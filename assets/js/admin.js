/* =========================================================
   SINAR BEMO — ADMIN APP LOGIC (Alpine.js)  v3.0
   Sistem Dashboard Dinamis & Persisten (LocalStorage Sync)
   ========================================================= */

const AD = () => window.SINARBEMO_DATA;

/* ---------- SIDEBAR MENU DEFINITION (single source of truth) ---------- */
const ADMIN_MENU = [
  {
    group: 'Utama', items: [
      { key: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', href: 'index.html' },
    ]
  },
  {
    group: 'Konten', items: [
      { key: 'berita', label: 'Semua Berita', icon: 'newspaper', href: 'berita.html' },
      { key: 'tambah-berita', label: 'Tambah Berita', icon: 'plus-circle', href: 'tambah-berita.html' },
      { key: 'kategori', label: 'Kategori', icon: 'folder-tree', href: 'kategori.html' },
      { key: 'tags', label: 'Tags', icon: 'tag', href: 'tags.html' },
      { key: 'penulis', label: 'Penulis', icon: 'user-pen', href: 'penulis.html' },
    ]
  },
  {
    group: 'Media', items: [
      { key: 'media', label: 'Media Library', icon: 'images', href: 'media.html' },
    ]
  },
  {
    group: 'Interaksi', items: [
      { key: 'komentar', label: 'Komentar', icon: 'message-square', badge: () => AD().comments.filter(c => c.status === 'pending').length, href: 'komentar.html' },
      { key: 'breaking-news', label: 'Breaking News', icon: 'siren', href: 'breaking-news.html' },
      { key: 'populer', label: 'Berita Populer', icon: 'flame', href: 'populer.html' },
    ]
  },
  {
    group: 'Monetisasi', items: [
      { key: 'advertisement', label: 'Advertisement', icon: 'megaphone', href: 'advertisement.html' },
      { key: 'newsletter', label: 'Newsletter', icon: 'mail', href: 'newsletter.html' },
    ]
  },
  {
    group: 'Pengguna', items: [
      { key: 'users', label: 'Users', icon: 'users', href: 'users.html' },
      { key: 'roles', label: 'Roles', icon: 'shield-check', href: 'roles.html' },
    ]
  },
  {
    group: 'Sistem', items: [
      { key: 'statistics', label: 'Statistics', icon: 'bar-chart-3', href: 'statistics.html' },
      { key: 'pages', label: 'Pages', icon: 'file-text', href: 'pages.html' },
      { key: 'settings', label: 'Settings', icon: 'settings', href: 'settings.html' },
      { key: 'activity-logs', label: 'Activity Logs', icon: 'history', href: 'activity-logs.html' },
    ]
  },
];

/* ---------- ADMIN SHELL (sidebar + topbar) ---------- */
function syncLoggedInAvatar(avatar) {
  if (!avatar) return;

  try {
    const currentUser = JSON.parse(localStorage.getItem('sb_demo_user') || 'null');
    if (currentUser) {
      currentUser.avatar = avatar;
      localStorage.setItem('sb_demo_user', JSON.stringify(currentUser));
    }

    const demoAccounts = window.SINARBEMO_DATA && Array.isArray(window.SINARBEMO_DATA.demoAccounts)
      ? window.SINARBEMO_DATA.demoAccounts
      : [];

    if (currentUser && currentUser.email) {
      const match = demoAccounts.find(a => a.email && a.email.toLowerCase() === currentUser.email.toLowerCase());
      if (match) match.avatar = avatar;

      const users = Array.isArray(window.SINARBEMO_DATA?.users) ? window.SINARBEMO_DATA.users : [];
      const persistedUser = users.find(u => u.email && u.email.toLowerCase() === currentUser.email.toLowerCase());
      if (persistedUser) {
        persistedUser.avatar = avatar;
        try {
          localStorage.setItem('sb_users', JSON.stringify(users));
        } catch (e) { }
      }
    }
  } catch (e) { }
}

function getStoredSettings() {
  try {
    const raw = localStorage.getItem('sb_settings');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function getCurrentAdminUser() {
  const settings = getStoredSettings();
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('sb_demo_user') || 'null');
    } catch (e) {
      return null;
    }
  })();

  const fallbackUser = AD().demoAccounts[0] || null;
  if (!storedUser) return fallbackUser;

  if (!storedUser.avatar && settings.profile_image) {
    storedUser.avatar = settings.profile_image;
  }

  return storedUser;
}

function adminShell(activeKey) {
  return {
    activeKey,
    collapsed: localStorage.getItem('admin_sidebar_collapsed') === '1',
    mobileOpen: false,
    menu: ADMIN_MENU,
    currentUser: getCurrentAdminUser(),
    toggleCollapse() {
      this.collapsed = !this.collapsed;
      localStorage.setItem('admin_sidebar_collapsed', this.collapsed ? '1' : '0');
    },
    logout() {
      AlertKit.confirmDelete('Anda akan keluar dari sesi admin demo ini.').then(res => {
        if (res.isConfirmed) {
          localStorage.removeItem('sb_demo_user');
          location.href = '../pages/login.html';
        }
      });
    },
    badgeValue(item) { return item.badge ? item.badge() : null; },
  };
}

async function compressDataUrlToLimit(dataUrl, options = {}) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }

  const {
    maxWidth = 256,
    maxBytes = 90000,
    initialQuality = 0.82,
    minQuality = 0.35,
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const maxSide = Math.max(img.width, img.height);
      const scale = Math.min(1, maxWidth / maxSide);
      const targetWidth = Math.max(1, Math.round(img.width * scale));
      const targetHeight = Math.max(1, Math.round(img.height * scale));

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const mimeType = 'image/jpeg';
      let quality = initialQuality;
      let result = canvas.toDataURL(mimeType, quality);

      while (result.length > maxBytes && quality > minQuality) {
        quality = Number(Math.max(minQuality, quality - 0.06).toFixed(2));
        result = canvas.toDataURL(mimeType, quality);
      }

      resolve(result);
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

async function readAndCompressLocalImage(file, options = {}) {
  if (!file) return '';

  const result = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  return compressDataUrlToLimit(result, options);
}

async function normalizePersistableImage(value, options = {}) {
  if (!value || typeof value !== 'string') return value;

  if (value.startsWith('data:image/')) {
    return compressDataUrlToLimit(value, options);
  }

  return value;
}

/* ---------- DASHBOARD (Dinamis & Real-time) ---------- */
function dashboardApp() {
  return {
    stats: AD().getDynamicStats(),
    loading: true,
    init() {
      setTimeout(() => {
        this.loading = false;
        this.$nextTick(() => {
          window.lucide && lucide.createIcons();
          this.renderCharts();
        });
      }, 300);
    },
    renderCharts() {
      const s = this.stats;
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const textColor = isDark ? '#94a3b8' : '#64748b';
      const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';

      const cDaily = document.getElementById('chartDaily');
      if (cDaily) {
        const existingDaily = Chart.getChart(cDaily);
        if (existingDaily) existingDaily.destroy();
        new Chart(cDaily, {
          type: 'line',
          data: {
            labels: s.daily_labels,
            datasets: [{
              label: 'Views Harian',
              data: s.daily_views,
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239,68,68,.12)',
              tension: 0.4,
              fill: true,
              pointRadius: 4,
              pointHoverRadius: 6,
            }]
          },
          options: {
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { color: textColor }, grid: { color: gridColor } },
              y: { ticks: { color: textColor }, grid: { color: gridColor } }
            },
            responsive: true,
            maintainAspectRatio: false
          },
        });
      }

      const cWeekly = document.getElementById('chartWeekly');
      if (cWeekly) {
        const existingWeekly = Chart.getChart(cWeekly);
        if (existingWeekly) existingWeekly.destroy();
        new Chart(cWeekly, {
          type: 'bar',
          data: {
            labels: s.weekly_labels,
            datasets: [{
              label: 'Views Mingguan',
              data: s.weekly_views,
              backgroundColor: '#2563eb',
              borderRadius: 6
            }]
          },
          options: {
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { color: textColor }, grid: { display: false } },
              y: { ticks: { color: textColor }, grid: { color: gridColor } }
            },
            responsive: true,
            maintainAspectRatio: false
          },
        });
      }

      const cCategory = document.getElementById('chartCategory');
      if (cCategory) {
        const existingCategory = Chart.getChart(cCategory);
        if (existingCategory) existingCategory.destroy();
        new Chart(cCategory, {
          type: 'doughnut',
          data: {
            labels: s.category_stats.map(c => c.name),
            datasets: [{
              data: s.category_stats.map(c => c.value),
              backgroundColor: ['#ef4444', '#2563eb', '#facc15', '#16a34a', '#7c3aed', '#0891b2'],
              borderWidth: isDark ? 2 : 1,
              borderColor: isDark ? '#111827' : '#ffffff'
            }]
          },
          options: {
            plugins: {
              legend: {
                position: 'bottom',
                labels: { boxWidth: 10, color: textColor, font: { size: 11 } }
              }
            },
            responsive: true,
            maintainAspectRatio: false
          },
        });
      }
    },
    get topArticles() {
      return [...AD().articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
    },
  };
}

/* ---------- CRUD BERITA (List) ---------- */
function articleListApp() {
  return {
    articles: [...AD().articles],
    query: '',
    statusFilter: 'all',
    selected: [],
    currentPage: 1,
    perPage: 8,
    init() {
      this.refreshData();
      this.$nextTick(() => window.lucide && lucide.createIcons());
    },
    refreshData() {
      this.articles = [...AD().articles];
    },
    get filtered() {
      let list = this.articles;
      if (this.query.trim()) {
        const q = this.query.toLowerCase();
        list = list.filter(a => (a.title || '').toLowerCase().includes(q) || (a.category || '').toLowerCase().includes(q));
      }
      if (this.statusFilter !== 'all') {
        list = list.filter(a => a.status === this.statusFilter);
      }
      return list;
    },
    get paged() {
      const s = (this.currentPage - 1) * this.perPage;
      return this.filtered.slice(s, s + this.perPage);
    },
    get totalPages() {
      return Math.max(1, Math.ceil(this.filtered.length / this.perPage));
    },
    setPage(p) {
      this.currentPage = Math.max(1, Math.min(p, this.totalPages));
      this.$nextTick(() => window.lucide && lucide.createIcons());
    },
    toggleSelect(id) {
      this.selected = this.selected.includes(id) ? this.selected.filter(x => x !== id) : [...this.selected, id];
    },
    toggleSelectAll(e) {
      this.selected = e.target.checked ? this.paged.map(a => a.id) : [];
    },
    deleteArticle(a) {
      AlertKit.confirmDelete(`Berita "${a.title}" akan dihapus permanen.`).then(res => {
        if (res.isConfirmed) {
          AD().articles = AD().articles.filter(x => x.id !== a.id);
          AD().save('articles');
          AD().addLog('Menghapus berita', 'Berita', `Menghapus "${a.title}"`);
          this.refreshData();
          this.selected = this.selected.filter(id => id !== a.id);
          AlertKit.success('Berita dihapus');
          this.$nextTick(() => window.lucide && lucide.createIcons());
        }
      });
    },
    bulkDelete() {
      if (this.selected.length === 0) return;
      AlertKit.confirmDelete(`${this.selected.length} berita terpilih akan dihapus permanen.`).then(res => {
        if (res.isConfirmed) {
          const count = this.selected.length;
          AD().articles = AD().articles.filter(a => !this.selected.includes(a.id));
          AD().save('articles');
          AD().addLog('Hapus massal berita', 'Berita', `Menghapus ${count} berita sekaligus`);
          this.refreshData();
          this.selected = [];
          AlertKit.success('Berita terpilih berhasil dihapus');
          this.$nextTick(() => window.lucide && lucide.createIcons());
        }
      });
    },
  };
}

/* ---------- FORM TAMBAH / EDIT BERITA (Dinamis & Terintegrasi) ---------- */
function articleFormApp(editSlug = null) {
  const existing = editSlug ? AD().articles.find(a => a.slug === editSlug) : null;
  return {
    isEdit: !!existing,
    originalId: existing ? existing.id : null,
    form: existing ? {
      title: existing.title,
      slug: existing.slug,
      excerpt: existing.excerpt || '',
      content: Array.isArray(existing.content) ? existing.content.map(p => `<p>${p}</p>`).join('') : (existing.content || ''),
      category: existing.category || '',
      tags: Array.isArray(existing.tags) ? existing.tags.join(', ') : (existing.tags || ''),
      thumbnail: existing.image || '',
      caption: existing.caption || '',
      author: existing.author || (AD().authors[0] ? AD().authors[0].name : 'Redaksi'),
      status: existing.status || 'draft',
      featured: !!existing.featured,
      breaking: !!existing.breaking,
      published_at: existing.published_at ? existing.published_at.replace(' ', 'T').slice(0, 16) : new Date().toISOString().slice(0, 16),
    } : {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      thumbnail: '',
      caption: '',
      author: AD().authors[0] ? AD().authors[0].name : 'Redaksi',
      status: 'draft',
      featured: false,
      breaking: false,
      published_at: new Date().toISOString().slice(0, 16),
    },
    categories: AD().categories,
    authors: AD().authors,
    previewOpen: false,
    previewPlaceholder: '<p class="text-muted">Konten artikel akan muncul di sini...</p>',
    autoSlug() {
      this.form.slug = this.form.title.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');
    },
    exec(cmd, val = null) {
      document.execCommand(cmd, false, val);
      const el = document.getElementById('editorContent');
      if (el) this.form.content = el.innerHTML;
    },
    syncContent() {
      const el = document.getElementById('editorContent');
      if (el) this.form.content = el.innerHTML;
    },
    saveData(targetStatus = null) {
      this.syncContent();
      if (!this.form.title.trim()) {
        AlertKit.warning('Judul wajib diisi');
        return;
      }

      if (targetStatus) {
        this.form.status = targetStatus;
      }

      if (this.form.status === 'published' && (!this.form.category || !this.form.content.trim())) {
        AlertKit.warning('Lengkapi form', 'Kategori dan isi berita wajib diisi sebelum publikasi.');
        return;
      }

      const tagsArray = this.form.tags ? this.form.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const contentParagraphs = this.form.content.includes('<p>')
        ? this.form.content.replace(/<\/p>/g, '').split('<p>').filter(Boolean)
        : [this.form.content];

      const articleObj = {
        id: this.isEdit ? this.originalId : Date.now(),
        title: this.form.title.trim(),
        slug: this.form.slug.trim() || 'berita-' + Date.now(),
        excerpt: this.form.excerpt.trim() || this.form.title.slice(0, 120),
        content: contentParagraphs,
        category: this.form.category || 'Nasional',
        category_slug: (this.form.category || 'nasional').toLowerCase().replace(/\s+/g, '-'),
        tags: tagsArray,
        image: this.form.thumbnail.trim() || AD().fallbackImage,
        caption: this.form.caption.trim() || this.form.title,
        author: this.form.author,
        status: this.form.status,
        featured: this.form.featured,
        breaking: this.form.breaking,
        views: this.isEdit && existing ? existing.views : 0,
        published_at: this.form.published_at.replace('T', ' ') + ':00',
        created_at: this.isEdit && existing ? existing.created_at : new Date().toISOString(),
      };

      if (this.isEdit) {
        const idx = AD().articles.findIndex(a => a.id === this.originalId);
        if (idx !== -1) {
          AD().articles[idx] = articleObj;
        } else {
          AD().articles.unshift(articleObj);
        }
        AD().save('articles');
        AD().addLog('Mengedit berita', 'Berita', `Memperbarui "${articleObj.title}"`);
        AlertKit.success('Perubahan disimpan', 'Berita berhasil diperbarui.').then(() => {
          location.href = 'berita.html';
        });
      } else {
        AD().articles.unshift(articleObj);
        AD().save('articles');
        AD().addLog(
          articleObj.status === 'published' ? 'Menerbitkan berita' : 'Menyimpan draft',
          'Berita',
          `Menambahkan "${articleObj.title}"`
        );
        AlertKit.success(
          articleObj.status === 'published' ? 'Berita diterbitkan!' : 'Draft tersimpan',
          'Berita berhasil disimpan ke database lokal.'
        ).then(() => {
          location.href = 'berita.html';
        });
      }
    },
    saveDraft() { this.saveData('draft'); },
    submitReview() { this.saveData('review'); },
    publishNow() { this.saveData('published'); },
  };
}

/* ---------- KATEGORI & TAGS (CRUD Sederhana & Lengkap) ---------- */
function simpleCrudApp(dataKey) {
  return {
    dataKey,
    items: [...(AD()[dataKey] || [])],
    showModal: false,
    editing: null,
    form: { name: '', slug: '', description: '' },
    openAdd() {
      this.editing = null;
      this.form = { name: '', slug: '', description: '' };
      this.showModal = true;
    },
    openEdit(item) {
      this.editing = item;
      this.form = {
        name: item.name,
        slug: item.slug || '',
        description: item.description || ''
      };
      this.showModal = true;
    },
    autoSlug() {
      this.form.slug = this.form.name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    },
    save() {
      if (!this.form.name.trim()) {
        AlertKit.warning('Nama wajib diisi');
        return;
      }
      const slug = this.form.slug.trim() || this.form.name.toLowerCase().trim().replace(/\s+/g, '-');

      if (this.editing) {
        const previousName = this.editing.name;
        const previousSlug = this.editing.slug || '';

        this.editing.name = this.form.name.trim();
        this.editing.slug = slug;
        this.editing.description = this.form.description.trim();

        if (this.dataKey === 'categories') {
          AD().articles.forEach(article => {
            if (article.category === previousName || article.category_slug === previousSlug) {
              article.category = this.editing.name;
              article.category_slug = slug;
            }
          });
          AD().save('articles');
        }

        if (this.dataKey === 'tags') {
          AD().articles.forEach(article => {
            if (Array.isArray(article.tags)) {
              article.tags = article.tags.map(tag => tag === previousName ? this.editing.name : tag);
            }
          });
          AD().save('articles');
        }

        AD().save(this.dataKey);
        AD().addLog(`Mengedit ${this.dataKey}`, this.dataKey, `Memperbarui "${this.editing.name}"`);
        AlertKit.success('Perubahan disimpan');
      } else {
        const newItem = {
          id: Date.now(),
          name: this.form.name.trim(),
          slug: slug,
          description: this.form.description.trim(),
          icon: 'tag'
        };
        AD()[this.dataKey].push(newItem);
        AD().save(this.dataKey);
        AD().addLog(`Menambah ${this.dataKey}`, this.dataKey, `Menambahkan "${newItem.name}"`);
        this.items = [...AD()[this.dataKey]];
        AlertKit.success('Data berhasil ditambahkan');
      }
      this.showModal = false;
    },
    remove(item) {
      AlertKit.confirmDelete(`Item "${item.name}" akan dihapus permanen.`).then(res => {
        if (res.isConfirmed) {
          const fallbackCategory = (this.dataKey === 'categories' && AD().categories.length > 1)
            ? AD().categories.find(c => c.id !== item.id)
            : null;

          if (this.dataKey === 'categories') {
            AD().articles.forEach(article => {
              if (article.category === item.name || article.category_slug === item.slug) {
                article.category = fallbackCategory ? fallbackCategory.name : 'Nasional';
                article.category_slug = fallbackCategory ? fallbackCategory.slug : 'nasional';
              }
            });
            AD().save('articles');
          }

          if (this.dataKey === 'tags') {
            AD().articles.forEach(article => {
              if (Array.isArray(article.tags)) {
                article.tags = article.tags.filter(tag => tag !== item.name);
              }
            });
            AD().save('articles');
          }

          AD()[this.dataKey] = AD()[this.dataKey].filter(i => i.id !== item.id);
          AD().save(this.dataKey);
          AD().addLog(`Menghapus ${this.dataKey}`, this.dataKey, `Menghapus "${item.name}"`);
          this.items = [...AD()[this.dataKey]];
          AlertKit.success('Data dihapus');
        }
      });
    },
  };
}

/* ---------- PENULIS / AUTHORS APP (Dinamis) ---------- */
function authorsApp() {
  return {
    authors: [...AD().authors],
    showModal: false,
    editing: null,
    form: { name: '', role: 'Wartawan', bio: '', avatar: '' },
    init() {
      this.refreshData();
    },
    refreshData() {
      this.authors = [...AD().authors];
    },
    articleCount(name) {
      return AD().articles.filter(a => a.author === name).length;
    },
    openAdd() {
      this.editing = null;
      this.form = {
        name: '',
        role: 'Wartawan',
        bio: '',
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 60) + 1}`
      };
      this.showModal = true;
    },
    openEdit(a) {
      this.editing = a;
      this.form = {
        name: a.name,
        role: a.role,
        bio: a.bio || '',
        avatar: a.avatar
      };
      this.showModal = true;
    },
    save() {
      if (!this.form.name.trim()) {
        AlertKit.warning('Nama penulis wajib diisi');
        return;
      }
      if (this.editing) {
        const previousName = this.editing.name;

        Object.assign(this.editing, {
          name: this.form.name.trim(),
          role: this.form.role.trim(),
          bio: this.form.bio.trim(),
          avatar: this.form.avatar.trim() || this.editing.avatar
        });

        AD().articles.forEach(article => {
          if (article.author === previousName) {
            article.author = this.editing.name;
          }
        });

        AD().save('authors');
        AD().save('articles');
        AD().addLog('Mengedit penulis', 'Penulis', `Memperbarui data "${this.editing.name}"`);
        AlertKit.success('Data penulis diperbarui');
      } else {
        const newAuthor = {
          id: Date.now(),
          name: this.form.name.trim(),
          role: this.form.role.trim(),
          bio: this.form.bio.trim(),
          avatar: this.form.avatar.trim() || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 60) + 1}`
        };
        AD().authors.push(newAuthor);
        AD().save('authors');
        AD().addLog('Menambah penulis', 'Penulis', `Menambahkan penulis baru "${newAuthor.name}"`);
        AlertKit.success('Penulis baru ditambahkan');
      }
      this.refreshData();
      this.showModal = false;
    },
    remove(a) {
      AlertKit.confirmDelete(`Penulis "${a.name}" akan dihapus.`).then(res => {
        if (res.isConfirmed) {
          const removedName = a.name;
          const fallbackAuthor = AD().authors.find(x => x.id !== a.id)?.name || 'SINAR BEMO';

          AD().authors = AD().authors.filter(x => x.id !== a.id);
          AD().articles.forEach(article => {
            if (article.author === removedName) {
              article.author = fallbackAuthor;
            }
          });

          AD().save('authors');
          AD().save('articles');
          AD().addLog('Menghapus penulis', 'Penulis', `Menghapus "${a.name}"`);
          this.refreshData();
          AlertKit.success('Penulis berhasil dihapus');
        }
      });
    }
  };
}

/* ---------- MEDIA LIBRARY (Upload & Preview Dinamis) ---------- */
function mediaApp() {
  return {
    tab: 'all',
    photos: [...AD().photos],
    videos: [...AD().videos],
    uploadModal: false,
    previewModal: false,
    previewItem: null,
    form: { title: '', type: 'foto', url: '', caption: '' },
    init() {
      this.$nextTick(() => window.lucide && lucide.createIcons());
    },
    get items() {
      if (this.tab === 'foto') return this.photos.map(p => ({ ...p, type: 'foto', thumb: p.image }));
      if (this.tab === 'video') return this.videos.map(v => ({ ...v, type: 'video', thumb: v.thumbnail }));
      return [
        ...this.photos.map(p => ({ ...p, type: 'foto', thumb: p.image })),
        ...this.videos.map(v => ({ ...v, type: 'video', thumb: v.thumbnail })),
      ];
    },
    openUpload() {
      this.form = {
        title: '',
        type: 'foto',
        url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
        caption: ''
      };
      this.uploadModal = true;
    },
    saveMedia() {
      if (!this.form.title.trim() || !this.form.url.trim()) {
        AlertKit.warning('Judul dan URL media wajib diisi');
        return;
      }
      if (this.form.type === 'foto') {
        const item = {
          id: Date.now(),
          title: this.form.title.trim(),
          image: this.form.url.trim(),
          caption: this.form.caption.trim() || this.form.title.trim(),
          date: new Date().toISOString().slice(0, 10)
        };
        AD().photos.unshift(item);
        AD().save('photos');
        this.photos = [...AD().photos];
      } else {
        const item = {
          id: Date.now(),
          title: this.form.title.trim(),
          thumbnail: this.form.url.trim(),
          duration: '03:45',
          date: new Date().toISOString().slice(0, 10)
        };
        AD().videos.unshift(item);
        AD().save('videos');
        this.videos = [...AD().videos];
      }
      AD().addLog('Mengunggah media', 'Media', `Mengunggah ${this.form.type} "${this.form.title}"`);
      this.uploadModal = false;
      AlertKit.success('Media berhasil ditambahkan');
      this.$nextTick(() => window.lucide && lucide.createIcons());
    },
    openPreview(item) {
      this.previewItem = item;
      this.previewModal = true;
    },
    remove(item) {
      AlertKit.confirmDelete(`Media "${item.title}" akan dihapus.`).then(res => {
        if (res.isConfirmed) {
          if (item.type === 'foto') {
            AD().photos = AD().photos.filter(p => p.id !== item.id);
            AD().save('photos');
            this.photos = [...AD().photos];
          } else {
            AD().videos = AD().videos.filter(v => v.id !== item.id);
            AD().save('videos');
            this.videos = [...AD().videos];
          }
          AD().addLog('Menghapus media', 'Media', `Menghapus ${item.type} "${item.title}"`);
          AlertKit.success('Media berhasil dihapus');
          this.$nextTick(() => window.lucide && lucide.createIcons());
        }
      });
    },
  };
}

/* ---------- KOMENTAR (Moderasi Dinamis) ---------- */
function commentModerationApp() {
  return {
    comments: [...AD().comments],
    filter: 'all',
    init() {
      this.refresh();
    },
    refresh() {
      this.comments = [...AD().comments];
    },
    get filtered() {
      return this.filter === 'all' ? this.comments : this.comments.filter(c => c.status === this.filter);
    },
    approve(c) {
      c.status = 'approved';
      AD().save('comments');
      AD().addLog('Menyetujui komentar', 'Komentar', `Menyetujui komentar dari ${c.name}`);
      AlertKit.success('Komentar disetujui');
    },
    reject(c) {
      c.status = 'rejected';
      AD().save('comments');
      AD().addLog('Menolak komentar', 'Komentar', `Menolak komentar dari ${c.name}`);
      AlertKit.warning('Komentar ditolak');
    },
    markSpam(c) {
      c.status = 'spam';
      AD().save('comments');
      AD().addLog('Tandai spam', 'Komentar', `Menandai komentar ${c.name} sebagai spam`);
      AlertKit.warning('Ditandai sebagai spam');
    },
    remove(c) {
      AlertKit.confirmDelete('Komentar ini akan dihapus permanen.').then(res => {
        if (res.isConfirmed) {
          AD().comments = AD().comments.filter(x => x.id !== c.id);
          AD().save('comments');
          AD().addLog('Menghapus komentar', 'Komentar', `Menghapus komentar dari ${c.name}`);
          this.refresh();
          AlertKit.success('Komentar dihapus');
        }
      });
    },
  };
}

/* ---------- USER MANAGEMENT (CRUD Pengguna) ---------- */
function userManagementApp() {
  return {
    users: [...AD().users],
    roleFilter: 'all',
    showModal: false,
    editing: null,
    form: { name: '', email: '', role: 'Pembaca', status: 'active', avatar: '' },
    init() {
      this.refresh();
    },
    refresh() {
      this.users = [...AD().users];
    },
    get filtered() {
      return this.roleFilter === 'all' ? this.users : this.users.filter(u => u.role === this.roleFilter);
    },
    openAdd() {
      this.editing = null;
      this.form = {
        name: '',
        email: '',
        role: 'Pembaca',
        status: 'active',
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 60) + 1}`
      };
      this.showModal = true;
    },
    openEdit(u) {
      this.editing = u;
      this.form = { ...u };
      this.showModal = true;
    },
    async handleAvatarUpload(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        AlertKit.warning('Format file tidak valid', 'Silakan pilih berkas gambar.');
        event.target.value = '';
        return;
      }

      try {
        const compressed = await readAndCompressLocalImage(file, { maxWidth: 256, maxBytes: 90000 });
        this.form.avatar = compressed;
      } catch (e) {
        AlertKit.error('Upload gagal', 'Gambar tidak dapat diproses. Silakan coba file lain.');
      }

      event.target.value = '';
    },
    async save() {
      if (!this.form.name.trim() || !this.form.email.trim()) {
        AlertKit.warning('Nama dan email pengguna wajib diisi');
        return;
      }

      const imageOptions = { maxWidth: 256, maxBytes: 90000 };

      if (this.editing) {
        const nextAvatar = await normalizePersistableImage(this.form.avatar.trim() || this.editing.avatar, imageOptions);
        const previousEmail = (this.editing.email || '').trim().toLowerCase();
        const mergedUser = {
          ...this.editing,
          name: this.form.name.trim(),
          email: this.form.email.trim(),
          role: this.form.role,
          status: this.form.status,
          avatar: nextAvatar,
        };

        Object.assign(this.editing, mergedUser);

        const users = Array.isArray(AD().users) ? AD().users : [];
        const userIndex = users.findIndex(u => u.email && u.email.toLowerCase() === previousEmail);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...mergedUser };
        }

        const currentUser = JSON.parse(localStorage.getItem('sb_demo_user') || 'null');
        if (currentUser && previousEmail && currentUser.email && currentUser.email.toLowerCase() === previousEmail) {
          const syncedCurrentUser = {
            ...currentUser,
            name: mergedUser.name,
            email: mergedUser.email,
            role: mergedUser.role,
            status: mergedUser.status,
            avatar: mergedUser.avatar,
          };
          localStorage.setItem('sb_demo_user', JSON.stringify(syncedCurrentUser));
        }

        AD().save('users');
        AD().addLog('Mengedit pengguna', 'Users', `Memperbarui akun "${mergedUser.name}"`);
        AlertKit.success('Data pengguna diperbarui');
      } else {
        const newUser = {
          id: Date.now(),
          name: this.form.name.trim(),
          email: this.form.email.trim(),
          role: this.form.role,
          status: this.form.status,
          avatar: await normalizePersistableImage(this.form.avatar.trim() || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 60) + 1}`, imageOptions),
          joined: new Date().toISOString().slice(0, 10),
        };
        AD().users.push(newUser);
        AD().save('users');
        AD().addLog('Menambah pengguna', 'Users', `Menambahkan pengguna baru "${newUser.name}"`);
        AlertKit.success('Pengguna baru ditambahkan');
      }
      this.refresh();
      this.showModal = false;
    },
    remove(u) {
      AlertKit.confirmDelete(`Pengguna "${u.name}" akan dihapus.`).then(res => {
        if (res.isConfirmed) {
          AD().users = AD().users.filter(x => x.id !== u.id);
          AD().save('users');
          AD().addLog('Menghapus pengguna', 'Users', `Menghapus akun "${u.name}"`);
          this.refresh();
          AlertKit.success('Pengguna dihapus');
        }
      });
    },
  };
}

/* ---------- SETTINGS (Pengaturan Tersimpan) ---------- */
function settingsApp() {
  const defaults = {
    site_name: 'SINAR BEMO',
    tagline: 'BERITA AKURAT & TERKINI',
    email: 'redaksi@sinarbemo.com',
    phone: '(0967) 123-456',
    address: 'Jl. Bomou, Deiyai, Papua Tengah',
    logo: '../assets/img/logo.png',
    profile_image: 'https://i.pravatar.cc/150?img=68',
    articles_per_page: 8,
  };
  let saved = defaults;
  try {
    const raw = localStorage.getItem('sb_settings');
    if (raw) saved = { ...defaults, ...JSON.parse(raw) };
  } catch (e) { }

  return {
    form: saved,
    currentTheme: localStorage.getItem('theme') || 'system',
    setTheme(t) {
      this.currentTheme = t;
      localStorage.setItem('theme', t);
      const isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      AlertKit.success(`Tema diubah ke ${t}`);
    },
    async handleLocalImageUpload(event, field) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        AlertKit.warning('Format file tidak valid', 'Silakan pilih berkas gambar.');
        event.target.value = '';
        return;
      }

      try {
        const compressed = await readAndCompressLocalImage(file, { maxWidth: 256, maxBytes: 90000 });
        this.form[field] = compressed;
      } catch (e) {
        AlertKit.error('Upload gagal', 'Gambar tidak dapat diproses. Silakan coba file lain.');
      }

      event.target.value = '';
    },
    async save() {
      try {
        const imageOptions = { maxWidth: 256, maxBytes: 90000 };
        const normalizedForm = {
          ...this.form,
          logo: await normalizePersistableImage(this.form.logo, imageOptions),
          profile_image: await normalizePersistableImage(this.form.profile_image, imageOptions),
        };

        this.form = normalizedForm;
        localStorage.setItem('sb_settings', JSON.stringify(this.form));
      } catch (e) {
        AlertKit.error('Penyimpanan gagal', 'Gambar terlalu besar untuk disimpan di browser ini. Silakan gunakan foto yang lebih kecil atau URL gambar yang sudah ringkas.');
        return;
      }

      try {
        const currentUser = JSON.parse(localStorage.getItem('sb_demo_user') || 'null');
        if (currentUser && this.form.profile_image) {
          currentUser.avatar = this.form.profile_image;
          localStorage.setItem('sb_demo_user', JSON.stringify(currentUser));
          syncLoggedInAvatar(this.form.profile_image);
        }
      } catch (e) { }

      AD().addLog('Memperbarui pengaturan', 'Settings', 'Memperbarui konfigurasi identitas dan preferensi situs');
      AlertKit.success('Pengaturan disimpan', 'Konfigurasi telah tersimpan dengan aman.');
    },
  };
}

/* ---------- BREAKING NEWS TOGGLE ---------- */
function breakingNewsAdminApp() {
  return {
    articles: [...AD().articles],
    toggle(a) {
      a.breaking = !a.breaking;
      AD().save('articles');
      AD().addLog(
        a.breaking ? 'Aktifkan breaking' : 'Nonaktifkan breaking',
        'Breaking News',
        `${a.breaking ? 'Menjadikan' : 'Mencabut'} "${a.title}" sebagai Breaking News`
      );
      AlertKit.success(a.breaking ? 'Ditambahkan ke Breaking News' : 'Dihapus dari Breaking News');
    }
  };
}

/* ---------- POPULAR / FEATURED TOGGLE ---------- */
function popularAdminApp() {
  return {
    articles: [...AD().articles],
    toggle(a) {
      a.featured = !a.featured;
      AD().save('articles');
      AD().addLog(
        a.featured ? 'Pilihan Editor' : 'Hapus Pilihan Editor',
        'Populer',
        `${a.featured ? 'Menandai' : 'Mencabut'} "${a.title}" sebagai Pilihan Editor`
      );
      AlertKit.success(a.featured ? 'Ditandai sebagai Pilihan Editor' : 'Dihapus dari Pilihan Editor');
    }
  };
}

/* ---------- ADVERTISEMENT MANAGEMENT ---------- */
function advertisementApp() {
  return {
    ads: [...AD().advertisements],
    toggle(ad) {
      ad.active = !ad.active;
      AD().save('advertisements');
      AD().addLog('Update iklan', 'Advertisement', `Slot ${ad.position} ${ad.active ? 'diaktifkan' : 'dinonaktifkan'}`);
      AlertKit.success(ad.active ? 'Slot iklan diaktifkan' : 'Slot iklan dinonaktifkan');
    }
  };
}

/* ---------- ACTIVITY LOGS APP ---------- */
function activityLogsApp() {
  return {
    logs: [...AD().activityLogs],
    refresh() {
      this.logs = [...AD().activityLogs];
    },
    clearLogs() {
      AlertKit.confirmDelete('Seluruh riwayat aktivitas akan dibersihkan.').then(res => {
        if (res.isConfirmed) {
          AD().activityLogs = [];
          AD().save('activityLogs');
          this.refresh();
          AlertKit.success('Log aktivitas dibersihkan');
        }
      });
    }
  };
}

/* ---------- SIDEBAR + TOPBAR PARTIAL (terpusat) ---------- */
function adminSidebarHTML() {
  let logo = '../assets/img/logo.png';
  let siteName = 'SINAR BEMO';
  try {
    const raw = localStorage.getItem('sb_settings');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.logo) logo = parsed.logo;
      if (parsed.site_name) siteName = parsed.site_name;
    }
  } catch (e) { }

  return `
  <aside class="admin-sidebar" :class="{ collapsed: collapsed, 'mobile-open': mobileOpen }">
    <div class="sidebar-brand flex items-center gap-3">
      <img src="${logo}" alt="Logo SINAR BEMO" style="width:34px;height:34px;object-fit:contain;flex-shrink:0;border-radius:6px;background:rgba(255,255,255,0.05);padding:2px;">
      <div class="sidebar-label">
        <div style="color:#fff;font-weight:700;font-size:14px;line-height:1.2;">${siteName}</div>
        <div style="font-size:10px;color:#94a3b8;">Admin Panel</div>
      </div>
    </div>
    <template x-for="group in menu" :key="group.group">
      <div>
        <div class="sidebar-group-title" x-text="group.group"></div>
        <template x-for="item in group.items" :key="item.key">
          <a :href="item.href" class="sidebar-link" :class="activeKey === item.key ? 'active' : ''">
            <i :data-lucide="item.icon" style="width:17px;height:17px;flex-shrink:0;"></i>
            <span class="sidebar-label" x-text="item.label"></span>
            <template x-if="item.badge && badgeValue(item)"><span class="badge-dot sidebar-label" x-text="badgeValue(item)"></span></template>
          </a>
        </template>
      </div>
    </template>
  </aside>`;
}

function adminTopbarHTML(pageTitle) {
  return `
  <div class="admin-topbar">
    <button @click="mobileOpen = !mobileOpen" class="btn btn-ghost btn-icon lg:hidden" aria-label="Menu"><i data-lucide="menu" style="width:18px;height:18px"></i></button>
    <button @click="toggleCollapse()" class="btn btn-ghost btn-icon hidden lg:inline-flex" aria-label="Ciutkan sidebar"><i data-lucide="panel-left" style="width:18px;height:18px"></i></button>
    <h1 class="font-semibold text-sm md:text-base" style="font-family:var(--font-heading);">${pageTitle}</h1>
    <div class="ml-auto flex items-center gap-2">
      <a href="../index.html" target="_blank" class="btn btn-ghost btn-sm hidden sm:inline-flex"><i data-lucide="external-link" style="width:14px;height:14px"></i> Lihat Situs</a>

      <!-- Theme Toggle -->
      <div class="relative" x-data="{ themeOpen:false, theme: localStorage.getItem('theme')||'system' }">
        <button @click="themeOpen=!themeOpen" class="btn btn-ghost btn-icon" :title="'Tema: '+theme" aria-label="Ganti tema">
          <i data-lucide="sun-moon" style="width:17px;height:17px"></i>
        </button>
        <div x-show="themeOpen" @click.outside="themeOpen=false" x-cloak
             x-transition:enter="transition ease-out duration-200"
             x-transition:enter-start="opacity-0 scale-95 -translate-y-1"
             x-transition:enter-end="opacity-100 scale-100 translate-y-0"
             x-transition:leave="transition ease-in duration-150"
             x-transition:leave-start="opacity-100 scale-100 translate-y-0"
             x-transition:leave-end="opacity-0 scale-95 -translate-y-1"
             class="theme-dropdown-menu">
          <button @click="theme='light'; localStorage.setItem('theme','light'); document.documentElement.setAttribute('data-theme','light'); themeOpen=false;"
            class="theme-dropdown-item" :class="{ 'active': theme==='light' }">
            <span class="theme-icon">☀️</span>
            <span>Light</span>
            <svg class="theme-check" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
          <button @click="theme='dark'; localStorage.setItem('theme','dark'); document.documentElement.setAttribute('data-theme','dark'); themeOpen=false;"
            class="theme-dropdown-item" :class="{ 'active': theme==='dark' }">
            <span class="theme-icon">🌙</span>
            <span>Dark</span>
            <svg class="theme-check" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
          <button @click="theme='system'; localStorage.setItem('theme','system'); var d=(window.matchMedia('(prefers-color-scheme:dark)').matches); document.documentElement.setAttribute('data-theme',d?'dark':'light'); themeOpen=false;"
            class="theme-dropdown-item" :class="{ 'active': theme==='system' }">
            <span class="theme-icon">🖥️</span>
            <span>Sistem</span>
            <svg class="theme-check" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
        </div>
      </div>

      <!-- User Dropdown -->
      <div class="relative" x-data="{ open:false }">
        <button @click="open=!open" class="flex items-center gap-2" type="button" aria-label="Menu pengguna">
          <img :src="currentUser.avatar || 'https://i.pravatar.cc/150?img=68'" class="w-8 h-8 rounded-full object-cover" alt="avatar">
        </button>
        <div x-show="open" @click.outside="open=false" x-cloak x-transition
             style="position:absolute;right:0;margin-top:8px;width:176px;z-index:50;border-radius:var(--radius-md);background:var(--light);border:1px solid var(--border-color);box-shadow:var(--shadow-lg);padding:4px;">
          <div style="padding:8px 12px;font-size:12px;color:var(--gray-500);" x-text="currentUser.name || 'Pengguna'">Pengguna</div>
          <div style="padding:0 12px 8px;font-size:11px;color:var(--gray-400);font-weight:600;text-transform:uppercase;letter-spacing:.5px;" x-text="currentUser.role || 'Admin'">Admin</div>
          <div style="border-top:1px solid var(--border-color);margin:4px 0;"></div>
          <button @click="logout()"
            style="width:100%;text-align:left;padding:8px 12px;border-radius:var(--radius-sm);font-size:13px;color:var(--primary);display:flex;align-items:center;gap:8px;font-weight:600;cursor:pointer;background:transparent;border:none;">
            <i data-lucide="log-in" style="width:14px;height:14px"></i> Keluar
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

function mountAdminShell(activeKey, pageTitle) {
  const sidebarMount = document.getElementById('admin-sidebar-mount');
  const topbarMount = document.getElementById('admin-topbar-mount');
  if (sidebarMount) sidebarMount.outerHTML = adminSidebarHTML();
  if (topbarMount) topbarMount.outerHTML = adminTopbarHTML(pageTitle);
}

/* Registrasi Komponen Alpine.js */
document.addEventListener('alpine:init', () => {
  Alpine.data('themeApp', themeApp);
  Alpine.data('adminShell', adminShell);
  Alpine.data('dashboardApp', dashboardApp);
  Alpine.data('articleListApp', articleListApp);
  Alpine.data('articleFormApp', articleFormApp);
  Alpine.data('simpleCrudApp', simpleCrudApp);
  Alpine.data('authorsApp', authorsApp);
  Alpine.data('mediaApp', mediaApp);
  Alpine.data('commentModerationApp', commentModerationApp);
  Alpine.data('userManagementApp', userManagementApp);
  Alpine.data('settingsApp', settingsApp);
  Alpine.data('breakingNewsAdminApp', breakingNewsAdminApp);
  Alpine.data('popularAdminApp', popularAdminApp);
  Alpine.data('advertisementApp', advertisementApp);
  Alpine.data('activityLogsApp', activityLogsApp);
});