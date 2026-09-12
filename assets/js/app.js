/* =========================================================
   SINAR BEMO.COM — PUBLIC APP LOGIC (Alpine.js)
   ========================================================= */

const D = () => window.SINARBEMO_DATA;
const C = () => window.Components;

/* ---------- SweetAlert2 Wrapper (AlertKit) ---------- */
window.AlertKit = {
  success(title, text = '') {
    return Swal.fire({ icon: 'success', title, text, timer: 1800, showConfirmButton: false });
  },
  error(title, text = '') {
    return Swal.fire({ icon: 'error', title, text, confirmButtonColor: '#ef4444' });
  },
  warning(title, text = '') {
    return Swal.fire({ icon: 'warning', title, text, confirmButtonColor: '#2563eb' });
  },
  info(title, text = '') {
    return Swal.fire({ icon: 'info', title, text, confirmButtonColor: '#2563eb' });
  },
  confirmDelete(text = 'Data yang dihapus tidak dapat dikembalikan.') {
    return Swal.fire({
      title: 'Hapus data ini?', text, icon: 'warning',
      showCancelButton: true, confirmButtonText: 'Ya, hapus', cancelButtonText: 'Batal',
      confirmButtonColor: '#ef4444', cancelButtonColor: '#64748b',
    });
  },
};

/* ---------- THEME (dark mode) ---------- */
function themeApp() {
  return {
    theme: localStorage.getItem('theme') || 'system',
    init() {
      this.applyTheme();
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.theme === 'system') this.applyTheme();
      });
    },
    setTheme(t) {
      this.theme = t;
      localStorage.setItem('theme', t);
      this.applyTheme();
    },
    applyTheme() {
      const isDark = this.theme === 'dark' ||
        (this.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    },
  };
}

/* ---------- NAVBAR / HEADER ---------- */
function navApp() {
  return {
    /* ---- state navbar ---- */
    mobileOpen: false,
    searchOpen: false,
    currentDate: new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    isLoggedIn: !!localStorage.getItem('sb_demo_user'),
    demoUser: JSON.parse(localStorage.getItem('sb_demo_user') || 'null'),
    /* ---- theme state (disinkron dari themeApp di <html>) ---- */
    theme: localStorage.getItem('theme') || 'system',
    /* ---- methods ---- */
    logout() {
      localStorage.removeItem('sb_demo_user');
      AlertKit.success('Berhasil keluar').then(() => location.reload());
    },
    setTheme(t) {
      this.theme = t;
      localStorage.setItem('theme', t);
      const isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      /* sync ke themeApp di <html> jika ada */
      if (window.Alpine) {
        const htmlEl = document.documentElement;
        const alpData = window.Alpine.$data ? window.Alpine.$data(htmlEl) : null;
        if (alpData && alpData.setTheme) alpData.setTheme(t);
      }
    },
  };
}

/* ---------- BREAKING NEWS BAR ---------- */
function breakingNewsApp() {
  return {
    items: D().articles.filter(a => a.breaking),
    index: 0,
    closed: localStorage.getItem('breaking_closed') === new Date().toDateString(),
    timer: null,
    init() {
      if (this.items.length === 0) this.items = D().articles.slice(0, 3);
      this.start();
    },
    start() { this.timer = setInterval(() => this.next(), 5000); },
    stop() { clearInterval(this.timer); },
    next() { this.index = (this.index + 1) % this.items.length; },
    prev() { this.index = (this.index - 1 + this.items.length) % this.items.length; },
    close() {
      this.closed = true;
      localStorage.setItem('breaking_closed', new Date().toDateString());
    },
    get current() { return this.items[this.index]; },
    url(a) { return C().articleUrl(a); },
  };
}

/* ---------- BOOKMARK (shared helper) ---------- */
function getBookmarks() { return JSON.parse(localStorage.getItem('sb_bookmarks') || '[]'); }
function isBookmarked(id) { return getBookmarks().includes(id); }
function toggleBookmark(id) {
  const isLoggedIn = !!localStorage.getItem('sb_demo_user');
  if (!isLoggedIn) {
    AlertKit.warning('Silakan login terlebih dahulu', 'Anda perlu masuk untuk menyimpan berita.');
    return false;
  }
  let list = getBookmarks();
  let added;
  if (list.includes(id)) {
    list = list.filter(x => x !== id);
    added = false;
  } else {
    list.push(id);
    added = true;
  }
  localStorage.setItem('sb_bookmarks', JSON.stringify(list));
  AlertKit.success(added ? 'Berita berhasil disimpan' : 'Berita dihapus dari simpanan');
  return added;
}

/* ---------- HOMEPAGE ---------- */
function homeApp() {
  return {
    loading: true,
    articles: [],
    hero: null,
    heroSupport: [],
    latest: [],
    popular: [],
    editorChoice: [],
    photos: [],
    videos: [],
    visibleLatest: 8,
    init() {
      setTimeout(() => {
        const all = D().articles.filter(a => a.status === 'published');
        this.articles = all;
        this.hero = all.find(a => a.featured) || all[0];
        this.heroSupport = all.filter(a => a.id !== this.hero.id).slice(0, 3);
        this.latest = [...all].sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
        this.popular = [...all].sort((a, b) => b.views - a.views).slice(0, 5);
        this.editorChoice = all.filter(a => a.featured).slice(0, 4);
        this.photos = D().photos;
        this.videos = D().videos;
        this.loading = false;
        this.$nextTick(() => window.lucide && lucide.createIcons());
      }, 500);
    },
    loadMore() { this.visibleLatest += 8; this.$nextTick(() => window.lucide && lucide.createIcons()); },
    get categories() { return D().categories; },
  };
}

/* ---------- DETAIL BERITA ---------- */
function articleApp() {
  return {
    article: null,
    related: [],
    popular: [],
    comments: [],
    loading: true,
    bookmarked: false,
    commentForm: { name: '', email: '', content: '' },
    replyingTo: null,
    replyForm: { name: '', email: '', content: '' },
    init() {
      const params = new URLSearchParams(location.search);
      const slug = params.get('slug');
      setTimeout(() => {
        this.article = D().articles.find(a => a.slug === slug) || D().articles[0];
        this.related = D().articles.filter(a => a.category === this.article.category && a.id !== this.article.id).slice(0, 4);
        this.popular = [...D().articles].sort((a, b) => b.views - a.views).slice(0, 5);
        this.comments = D().comments.filter(c => c.article_id === this.article.id || c.article_id === 1);
        this.bookmarked = isBookmarked(this.article.id);
        document.title = this.article.title + ' - SINAR BEMO.COM';
        this.loading = false;
        this.$nextTick(() => window.lucide && lucide.createIcons());
      }, 400);
    },
    toggleBookmark() { this.bookmarked = toggleBookmark(this.article.id); },
    copyLink() {
      navigator.clipboard.writeText(location.href).then(() => {
        Swal.fire({ icon: 'success', title: 'Link disalin', text: 'Link berita berhasil disalin.', timer: 1800, showConfirmButton: false });
      });
    },
    shareWhatsapp() { window.open(`https://wa.me/?text=${encodeURIComponent(this.article.title + ' ' + location.href)}`, '_blank'); },
    shareFacebook() { window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}`, '_blank'); },
    shareTwitter() { window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(this.article.title)}&url=${encodeURIComponent(location.href)}`, '_blank'); },
    submitComment() {
      if (!this.commentForm.name || !this.commentForm.email || !this.commentForm.content) {
        AlertKit.warning('Lengkapi form', 'Nama, email, dan komentar wajib diisi.');
        return;
      }
      const newComment = {
        id: Date.now(), article_id: this.article.id, name: this.commentForm.name,
        email: this.commentForm.email, content: this.commentForm.content,
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        status: 'approved', parent_id: null, likes: 0,
      };
      this.comments.push(newComment);
      const stored = JSON.parse(localStorage.getItem('sb_comments') || '[]');
      stored.push(newComment);
      localStorage.setItem('sb_comments', JSON.stringify(stored));
      this.commentForm = { name: '', email: '', content: '' };
      AlertKit.success('Komentar terkirim', 'Komentar Anda berhasil ditambahkan.');
    },
    likeComment(c) { c.likes++; },
  };
}

/* ---------- SEARCH ---------- */
function searchApp() {
  return {
    query: '',
    selectedCategory: 'all',
    sortBy: 'latest',
    currentPage: 1,
    perPage: 6,
    loading: true,
    results: [],
    init() {
      const params = new URLSearchParams(location.search);
      this.query = params.get('q') || '';
      setTimeout(() => { this.loading = false; this.$nextTick(() => window.lucide && lucide.createIcons()); }, 350);
    },
    get filtered() {
      let list = D().articles.filter(a => a.status === 'published');
      if (this.query.trim()) {
        const q = this.query.toLowerCase();
        list = list.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q) || a.content.join(' ').toLowerCase().includes(q));
      }
      if (this.selectedCategory !== 'all') list = list.filter(a => a.category_slug === this.selectedCategory);
      list = [...list].sort((a, b) => this.sortBy === 'popular' ? b.views - a.views : new Date(b.published_at) - new Date(a.published_at));
      return list;
    },
    get paged() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filtered.slice(start, start + this.perPage);
    },
    get totalPages() { return Math.max(1, Math.ceil(this.filtered.length / this.perPage)); },
    doSearch() { this.currentPage = 1; },
    get categories() { return D().categories; },
  };
}

/* ---------- KATEGORI ---------- */
function categoryApp() {
  return {
    category: null,
    articles: [],
    loading: true,
    currentPage: 1,
    perPage: 8,
    sortBy: 'latest',
    init() {
      const params = new URLSearchParams(location.search);
      const slug = params.get('slug') || D().categories[0].slug;
      setTimeout(() => {
        this.category = D().categories.find(c => c.slug === slug) || D().categories[0];
        this.articles = D().articles.filter(a => a.category_slug === this.category.slug && a.status === 'published');
        this.loading = false;
        this.$nextTick(() => window.lucide && lucide.createIcons());
      }, 350);
    },
    get sorted() {
      return [...this.articles].sort((a, b) => this.sortBy === 'popular' ? b.views - a.views : new Date(b.published_at) - new Date(a.published_at));
    },
    get paged() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.sorted.slice(start, start + this.perPage);
    },
    get totalPages() { return Math.max(1, Math.ceil(this.articles.length / this.perPage)); },
    get categories() { return D().categories; },
  };
}

/* ---------- LISTING GENERIK (populer / terbaru) ---------- */
function listingApp(mode) {
  return {
    loading: true,
    currentPage: 1,
    perPage: 8,
    init() { setTimeout(() => { this.loading = false; this.$nextTick(() => window.lucide && lucide.createIcons()); }, 350); },
    get sorted() {
      const list = D().articles.filter(a => a.status === 'published');
      return mode === 'popular'
        ? [...list].sort((a, b) => b.views - a.views)
        : [...list].sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    },
    get paged() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.sorted.slice(start, start + this.perPage);
    },
    get totalPages() { return Math.max(1, Math.ceil(this.sorted.length / this.perPage)); },
  };
}

/* ---------- FOTO / GALLERY ---------- */
function galleryApp() {
  return {
    loading: true,
    photos: [],
    lightboxOpen: false,
    activeIndex: 0,
    init() { setTimeout(() => { this.photos = D().photos; this.loading = false; this.$nextTick(() => window.lucide && lucide.createIcons()); }, 350); },
    open(i) { this.activeIndex = i; this.lightboxOpen = true; document.body.style.overflow = 'hidden'; },
    close() { this.lightboxOpen = false; document.body.style.overflow = ''; },
    next() { this.activeIndex = (this.activeIndex + 1) % this.photos.length; },
    prev() { this.activeIndex = (this.activeIndex - 1 + this.photos.length) % this.photos.length; },
    get active() { return this.photos[this.activeIndex]; },
  };
}

/* ---------- VIDEO ---------- */
function videoApp() {
  return {
    loading: true,
    videos: [],
    modalOpen: false,
    activeVideo: null,
    init() { setTimeout(() => { this.videos = D().videos; this.loading = false; this.$nextTick(() => window.lucide && lucide.createIcons()); }, 350); },
    play(v) { this.activeVideo = v; this.modalOpen = true; document.body.style.overflow = 'hidden'; },
    close() { this.modalOpen = false; document.body.style.overflow = ''; this.activeVideo = null; },
  };
}

/* ---------- OPINI ---------- */
function opiniApp() {
  return {
    loading: true,
    opinions: [],
    init() { setTimeout(() => { this.opinions = D().opinions; this.loading = false; }, 300); },
  };
}

/* ---------- NEWSLETTER ---------- */
function newsletterApp() {
  return {
    email: '',
    subscribe() {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.email || !re.test(this.email)) {
        AlertKit.error('Email tidak valid', 'Mohon masukkan alamat email yang benar.');
        return;
      }
      const list = JSON.parse(localStorage.getItem('sb_newsletter') || '[]');
      if (list.includes(this.email)) {
        AlertKit.info('Sudah berlangganan', 'Email ini sudah terdaftar di newsletter kami.');
        return;
      }
      list.push(this.email);
      localStorage.setItem('sb_newsletter', JSON.stringify(list));
      AlertKit.success('Berhasil berlangganan!', 'Terima kasih telah berlangganan newsletter kami.');
      this.email = '';
    },
  };
}

/* ---------- DEMO LOGIN ---------- */
function loginApp() {
  return {
    email: '',
    password: '',
    selectedRole: null,
    accounts: D().demoAccounts,
    login() {
      const acc = this.accounts.find(a => a.email === this.email && a.password === this.password);
      if (!acc) {
        AlertKit.error('Login gagal', 'Email atau kata sandi demo tidak sesuai.');
        return;
      }
      localStorage.setItem('sb_demo_user', JSON.stringify(acc));
      AlertKit.success('Login berhasil', `Selamat datang, ${acc.role}`).then(() => {
        location.href = acc.role === 'Pembaca' ? '../index.html' : '../admin/index.html';
      });
    },
    quickFill(acc) { this.email = acc.email; this.password = acc.password; },
  };
}

/* ---------- FLOATING ACTION BUTTON (FAB) LOGIC ---------- */
function fabApp() {
  return {
    isOpen: false,
    showScrollTop: false,
    theme: localStorage.getItem('theme') || 'system',
    init() {
      window.addEventListener('scroll', () => {
        this.showScrollTop = window.scrollY > 280;
      }, { passive: true });
    },
    toggleMenu() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        setTimeout(() => window.lucide && lucide.createIcons(), 50);
      }
    },
    closeMenu() {
      this.isOpen = false;
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      this.theme = next;
      localStorage.setItem('theme', next);
      document.documentElement.setAttribute('data-theme', next);
      if (window.AlertKit) {
        AlertKit.success(`Mode ${next === 'dark' ? 'Gelap 🌙' : 'Terang ☀️'} Aktif`);
      }
      this.closeMenu();
    },
    openSearch() {
      this.closeMenu();
      const searchBtn = document.querySelector('button[aria-label="Cari berita"]');
      if (searchBtn) {
        searchBtn.click();
      } else {
        location.href = (window.ASSET_BASE || '') + 'pages/search.html';
      }
    },
    contactRedaksi() {
      this.closeMenu();
      location.href = (window.ASSET_BASE || '') + 'pages/kontak.html';
    },
  };
}

/* Ekspor init global untuk dark-mode header icon toggle, dsb */
document.addEventListener('alpine:init', () => {
  Alpine.data('themeApp', themeApp);
  Alpine.data('navApp', navApp);
  Alpine.data('breakingNewsApp', breakingNewsApp);
  Alpine.data('homeApp', homeApp);
  Alpine.data('articleApp', articleApp);
  Alpine.data('searchApp', searchApp);
  Alpine.data('categoryApp', categoryApp);
  Alpine.data('listingApp', listingApp);
  Alpine.data('galleryApp', galleryApp);
  Alpine.data('videoApp', videoApp);
  Alpine.data('opiniApp', opiniApp);
  Alpine.data('newsletterApp', newsletterApp);
  Alpine.data('loginApp', loginApp);
  Alpine.data('fabApp', fabApp);
});