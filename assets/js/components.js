/* =========================================================
   SINAR BEMO.COM — COMPONENTS
   Fungsi murni: menerima data → mengembalikan string HTML.
   Tidak menyimpan state (state dikelola di app.js/admin.js).
   Path asset di sini relatif terhadap ROOT (gunakan window.ASSET_BASE
   dari tiap halaman untuk menyesuaikan kedalaman folder).
   ========================================================= */

const Base = (typeof window !== 'undefined' && window.ASSET_BASE !== undefined) ? window.ASSET_BASE : '';

/* ---------- BRAND SOCIAL SVG ICONS (Lucide does not provide brand icons) ---------- */
const SOCIAL_ICONS = {
  facebook: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:inline-block;vertical-align:middle;" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
  youtube: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:inline-block;vertical-align:middle;" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  tiktok: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:inline-block;vertical-align:middle;" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.64 1.3-.12 2.45-1.03 2.79-2.29.15-.53.18-1.09.18-1.64V.02z"/></svg>`,
  twitter: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:inline-block;vertical-align:middle;" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style="display:inline-block;vertical-align:middle;" aria-hidden="true"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>`
};

function socialIcon(name, size = 14) {
  const icon = SOCIAL_ICONS[name];
  if (!icon) return '';
  if (size === 14) return icon;
  return icon.replace(/width="14"/g, `width="${size}"`).replace(/height="14"/g, `height="${size}"`);
}

// Daftarkan fallback brand icons ke Lucide jika ada data-lucide sisa agar tidak melempar warning
if (typeof window !== 'undefined') {
  const registerLucideBrandFallbacks = () => {
    if (window.lucide && window.lucide.icons) {
      ['facebook', 'instagram', 'youtube', 'twitter', 'tiktok', 'whatsapp'].forEach(name => {
        if (!window.lucide.icons[name]) {
          window.lucide.icons[name] = {
            toSvg: () => SOCIAL_ICONS[name] || ''
          };
        }
      });
    }
  };
  registerLucideBrandFallbacks();
  window.addEventListener('DOMContentLoaded', registerLucideBrandFallbacks);
}

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr.replace(' ', 'T'));
  const diffMs = now - date;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDate(dateStr) {
  const date = new Date(dateStr.replace(' ', 'T'));
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatViews(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'jt';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'rb';
  return String(n);
}

function articleUrl(article) {
  return `${Base}pages/detail-berita.html?slug=${article.slug}`;
}
function categoryUrl(slug) {
  return `${Base}pages/kategori.html?slug=${slug}`;
}

function badgeCategory(name, slug) {
  return `<a href="${categoryUrl(slug)}" class="badge badge-category">${name}</a>`;
}

function statusBadge(status) {
  const map = {
    published: ['Terbit', 'badge-status-published'],
    draft: ['Draft', 'badge-status-draft'],
    review: ['Review', 'badge-status-review'],
    revision: ['Revisi', 'badge-status-revision'],
    rejected: ['Ditolak', 'badge-status-rejected'],
    archived: ['Arsip', 'badge-status-archived'],
  };
  const [label, cls] = map[status] || ['-', 'badge-status-draft'];
  return `<span class="badge ${cls}">${label}</span>`;
}

/* ---------- NEWS CARD (vertical, default) ---------- */
function newsCardHTML(a, opts = {}) {
  const { showExcerpt = true, imgHeight = '' } = opts;
  return `
  <article class="card news-card">
    <a href="${articleUrl(a)}" class="thumb-wrap" style="${imgHeight}">
      <img src="${a.image}" alt="${a.title}" loading="lazy" onerror="this.src='${window.SINARBEMO_DATA.fallbackImage}'">
      ${a.breaking ? '<span class="badge badge-breaking" style="position:absolute;top:10px;left:10px;">Breaking</span>' : ''}
    </a>
    <div class="card-body">
      ${badgeCategory(a.category, a.category_slug)}
      <a href="${articleUrl(a)}">
        <h3 class="card-title line-clamp-2">${a.title}</h3>
      </a>
      ${showExcerpt ? `<p class="card-excerpt line-clamp-2">${a.excerpt}</p>` : ''}
      <div class="card-meta">
        <span>${a.author}</span><span>&middot;</span><span>${timeAgo(a.published_at)}</span>
      </div>
    </div>
  </article>`;
}

/* ---------- NEWS CARD (horizontal, untuk list/sidebar) ---------- */
function newsCardHorizontalHTML(a) {
  return `
  <article class="news-card-horizontal">
    <a href="${articleUrl(a)}" class="thumb-wrap">
      <img src="${a.image}" alt="${a.title}" loading="lazy" onerror="this.src='${window.SINARBEMO_DATA.fallbackImage}'">
    </a>
    <div class="flex flex-col justify-center gap-1">
      <span class="text-meta" style="color:var(--secondary);font-weight:600;">${a.category}</span>
      <a href="${articleUrl(a)}"><h4 class="card-title line-clamp-2">${a.title}</h4></a>
      <span class="text-meta">${timeAgo(a.published_at)} &middot; ${formatViews(a.views)}x dibaca</span>
    </div>
  </article>`;
}

/* ---------- POPULAR ITEM (ranking) ---------- */
function popularItemHTML(a, rank) {
  return `
  <a href="${articleUrl(a)}" class="popular-item">
    <span class="popular-rank">${String(rank).padStart(2, '0')}</span>
    <img src="${a.image}" alt="${a.title}" class="w-16 h-16 rounded-md object-cover flex-shrink-0" loading="lazy" onerror="this.src='${window.SINARBEMO_DATA.fallbackImage}'">
    <div class="min-w-0">
      <h4 class="text-sm font-semibold line-clamp-2" style="font-family:var(--font-heading);">${a.title}</h4>
      <span class="text-meta">${formatViews(a.views)}x dibaca</span>
    </div>
  </a>`;
}

/* ---------- CATEGORY CARD ---------- */
function categoryCardHTML(c) {
  return `
  <a href="${categoryUrl(c.slug)}" class="category-card">
    <span class="cat-icon"><i data-lucide="${c.icon}" style="width:20px;height:20px;"></i></span>
    <span class="text-sm font-semibold" style="color:var(--dark);">${c.name}</span>
  </a>`;
}

/* ---------- ADVERTISEMENT ---------- */
function adSlotHTML(label = 'ADVERTISEMENT', size = 'py-10') {
  return `
  <div class="ad-slot ${size}">
    <span class="ad-label">${label}</span>
    <span class="text-sm">Your Advertisement Here</span>
  </div>`;
}

/* ---------- EMPTY / ERROR STATE ---------- */
function emptyStateHTML(message = 'Tidak ada berita ditemukan.', sub = 'Coba gunakan kata kunci atau kategori lain.') {
  return `
  <div class="state-box">
    <div class="state-icon"><i data-lucide="search-x" style="width:28px;height:28px;"></i></div>
    <p class="font-semibold" style="color:var(--gray-700);">${message}</p>
    <p class="text-sm mt-1">${sub}</p>
  </div>`;
}

function errorStateHTML(retryFn = 'location.reload()') {
  return `
  <div class="state-box">
    <div class="state-icon" style="background:var(--primary-light);color:var(--primary);"><i data-lucide="alert-triangle" style="width:28px;height:28px;"></i></div>
    <p class="font-semibold" style="color:var(--gray-700);">Oops! Terjadi kesalahan saat memuat data.</p>
    <button onclick="${retryFn}" class="btn btn-primary mt-4">Coba Lagi</button>
  </div>`;
}

/* ---------- SKELETON CARD ---------- */
function skeletonCardHTML() {
  return `
  <div class="card">
    <div class="skeleton" style="aspect-ratio:16/10;"></div>
    <div class="p-4 flex flex-col gap-2">
      <div class="skeleton" style="height:10px;width:40%;"></div>
      <div class="skeleton" style="height:14px;width:90%;"></div>
      <div class="skeleton" style="height:14px;width:70%;"></div>
    </div>
  </div>`;
}

/* ---------- PAGINATION ---------- */
function paginationHTML(current, total) {
  let pages = '';
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - current) <= 1) {
      pages += `<button @click="currentPage=${i}" class="page-btn" :class="currentPage===${i} ? 'active' : ''">${i}</button>`;
    } else if (Math.abs(i - current) === 2) {
      pages += `<span class="px-1 text-sm" style="color:var(--gray-300);">…</span>`;
    }
  }
  return pages;
}

/* ---------- AVATAR ---------- */
function avatarHTML(src, size = 32) {
  return `<img src="${src}" alt="avatar" class="rounded-full object-cover" style="width:${size}px;height:${size}px;">`;
}

/* ---------- HEADER PARTIAL (terpusat, dipakai semua halaman) ---------- */
function headerHTML() {
  return `
  <header class="site-header" x-data="navApp()">
    <div class="header-top py-2 hidden md:block">
      <div class="container-app flex items-center justify-between">
        <span x-text="currentDate"></span>
        <div class="flex items-center gap-4 header-social">
          <a href="#" aria-label="Facebook">${socialIcon('facebook', 14)}</a>
          <a href="#" aria-label="Instagram">${socialIcon('instagram', 14)}</a>
          <a href="#" aria-label="Youtube">${socialIcon('youtube', 14)}</a>
          <a href="#" aria-label="TikTok">${socialIcon('tiktok', 14)}</a>
        </div>
      </div>
    </div>
    <div class="py-4">
      <div class="container-app flex items-center justify-between gap-4">
        <a href="${Base}index.html" class="brand-logo-wrap">
          <img src="${Base}assets/img/logo.png" alt="Logo Sinar Bemo" class="brand-logo-img">
          <div class="flex flex-col leading-none">
            <span class="brand-logo">SINAR <span>BEMO</span>.COM</span>
            <span class="brand-tagline">BERITA AKURAT &amp; TERKINI</span>
          </div>
        </a>
        <div class="flex items-center gap-1.5">
          <button @click="searchOpen = true" class="btn btn-ghost btn-icon" aria-label="Cari berita">
            <i data-lucide="search" style="width:18px;height:18px"></i>
          </button>
          <div class="relative" x-data="{ open: false }">
            <button @click="open = !open" class="btn btn-ghost btn-icon" aria-label="Ganti tema" :title="'Tema: ' + theme">
              <i data-lucide="sun-moon" style="width:18px;height:18px"></i>
            </button>
            <div x-show="open" @click.outside="open=false" x-cloak
                 x-transition:enter="transition ease-out duration-200"
                 x-transition:enter-start="opacity-0 scale-95 -translate-y-1"
                 x-transition:enter-end="opacity-100 scale-100 translate-y-0"
                 x-transition:leave="transition ease-in duration-150"
                 x-transition:leave-start="opacity-100 scale-100 translate-y-0"
                 x-transition:leave-end="opacity-0 scale-95 -translate-y-1"
                 class="theme-dropdown-menu">
              <button @click="setTheme('light'); open=false" class="theme-dropdown-item" :class="{ 'active': theme === 'light' }">
                <span class="theme-icon">☀️</span>
                <span>Light</span>
                <svg class="theme-check" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </button>
              <button @click="setTheme('dark'); open=false" class="theme-dropdown-item" :class="{ 'active': theme === 'dark' }">
                <span class="theme-icon">🌙</span>
                <span>Dark</span>
                <svg class="theme-check" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </button>
              <button @click="setTheme('system'); open=false" class="theme-dropdown-item" :class="{ 'active': theme === 'system' }">
                <span class="theme-icon">🖥️</span>
                <span>Sistem</span>
                <svg class="theme-check" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </button>
            </div>
          </div>
          <template x-if="!isLoggedIn">
            <a href="${Base}pages/login.html" class="btn btn-outline btn-sm hidden sm:inline-flex">Login</a>
          </template>
          <template x-if="isLoggedIn">
            <div class="hidden sm:flex items-center gap-2">
              <img :src="demoUser.avatar" class="w-8 h-8 rounded-full object-cover" alt="avatar">
              <button @click="logout" class="btn btn-ghost btn-sm">Keluar</button>
            </div>
          </template>
          <button @click="mobileOpen = true" class="btn btn-ghost btn-icon md:hidden" aria-label="Buka menu">
            <i data-lucide="menu" style="width:20px;height:20px"></i>
          </button>
        </div>
      </div>
    </div>

    <div x-show="searchOpen" x-cloak x-transition class="fixed inset-0 z-50" style="background:rgba(15,23,42,.6);" @keydown.escape.window="searchOpen=false">
      <div class="container-app pt-24" @click.outside="searchOpen=false">
        <form action="${Base}pages/search.html" method="get" class="card p-2 flex items-center gap-2 max-w-2xl mx-auto">
          <i data-lucide="search" style="width:18px;height:18px;margin-left:8px;color:var(--gray-500);"></i>
          <input name="q" type="text" placeholder="Cari berita, topik, atau kata kunci..." class="flex-1 py-3 px-2 outline-none" style="background:transparent;color:var(--dark);" autofocus>
          <button type="submit" class="btn btn-primary">Cari</button>
        </form>
      </div>
    </div>

    <div x-show="mobileOpen" x-cloak class="mobile-drawer" @keydown.escape.window="mobileOpen=false">
      <div class="absolute inset-0" style="background:rgba(15,23,42,.6);" @click="mobileOpen=false" x-show="mobileOpen" x-transition.opacity></div>
      <div class="mobile-drawer-panel relative p-5 overflow-y-auto" x-show="mobileOpen" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="-translate-x-full" x-transition:enter-end="translate-x-0">
        <div class="flex items-center justify-between mb-6">
          <a href="${Base}index.html" class="flex items-center gap-2">
            <img src="${Base}assets/img/logo.png" alt="Logo Sinar Bemo" style="width:32px;height:32px;object-fit:contain;">
            <span class="brand-logo" style="font-size:20px;">SINAR <span>BEMO</span></span>
          </a>
          <button @click="mobileOpen=false" class="btn btn-ghost btn-icon"><i data-lucide="x"></i></button>
        </div>
        <nav>
          <a href="${Base}index.html" class="mobile-nav-link">Beranda <i data-lucide="chevron-right" style="width:16px;height:16px"></i></a>
          ${CATEGORIES_REF.map(c => `<a href="${Base}pages/kategori.html?slug=${c.slug}" class="mobile-nav-link">${c.name} <i data-lucide="chevron-right" style="width:16px;height:16px"></i></a>`).join('')}
          <a href="${Base}pages/foto.html" class="mobile-nav-link">Foto <i data-lucide="chevron-right" style="width:16px;height:16px"></i></a>
          <a href="${Base}pages/video.html" class="mobile-nav-link">Video <i data-lucide="chevron-right" style="width:16px;height:16px"></i></a>
          <a href="${Base}pages/opini.html" class="mobile-nav-link">Opini <i data-lucide="chevron-right" style="width:16px;height:16px"></i></a>
          <a href="${Base}pages/login.html" class="mobile-nav-link" style="color:var(--primary);">Login <i data-lucide="log-in" style="width:16px;height:16px"></i></a>
        </nav>
      </div>
    </div>
  </header>`;
}

/* ---------- NAVBAR DESKTOP PARTIAL ---------- */
function navbarHTML(activeSlug = 'beranda') {
  const link = (slug, href, label) =>
    `<a href="${href}" class="nav-link ${activeSlug === slug ? 'active' : ''}">${label}</a>`;
  return `
  <nav class="navbar hidden md:block">
    <div class="container-app navbar-scroll flex items-center">
      ${link('beranda', `${Base}index.html`, 'Beranda')}
      ${CATEGORIES_REF.map(c => link(c.slug, `${Base}pages/kategori.html?slug=${c.slug}`, c.name)).join('')}
      ${link('foto', `${Base}pages/foto.html`, 'Foto')}
      ${link('video', `${Base}pages/video.html`, 'Video')}
    </div>
  </nav>`;
}

/* ---------- BREAKING NEWS BAR PARTIAL ---------- */
function breakingNewsHTML() {
  return `
  <div class="breaking-bar" x-data="breakingNewsApp()" x-init="init()" x-show="!closed" x-cloak @mouseenter="stop()" @mouseleave="start()">
    <div class="container-app flex items-center gap-3 py-2">
      <span class="breaking-label rounded">BREAKING NEWS</span>
      <div class="flex-1 overflow-hidden">
        <template x-if="current"><a :href="url(current)" class="breaking-track" x-text="current.title"></a></template>
      </div>
      <button @click="prev()" class="btn-icon" aria-label="Sebelumnya"><i data-lucide="chevron-left" style="width:16px;height:16px"></i></button>
      <button @click="next()" class="btn-icon" aria-label="Berikutnya"><i data-lucide="chevron-right" style="width:16px;height:16px"></i></button>
      <button @click="close()" class="btn-icon" aria-label="Tutup"><i data-lucide="x" style="width:16px;height:16px"></i></button>
    </div>
  </div>`;
}

/* ---------- FOOTER PARTIAL ---------- */
function footerHTML() {
  return `
  <footer class="site-footer mt-16 pt-14 pb-6">
    <div class="container-app grid grid-cols-1 md:grid-cols-4 gap-10">
      <div>
        <a href="${Base}index.html" class="flex items-center gap-3 mb-3" style="text-decoration:none;">
          <img src="${Base}assets/img/logo.png" alt="Logo Sinar Bemo" style="width:40px;height:40px;object-fit:contain;border-radius:50%;background:#fff;padding:3px;">
          <div class="flex flex-col leading-none">
            <span class="brand-logo" style="color:#fff;font-size:20px;">SINAR <span style="color:var(--primary);">BEMO</span>.COM</span>
            <span style="font-size:10px;color:#93c5fd;font-weight:600;letter-spacing:1.5px;">BERITA AKURAT &amp; TERKINI</span>
          </div>
        </a>
        <p class="text-sm mt-3 opacity-70">Portal berita independen yang menyajikan informasi nasional, daerah, dan Papua secara cepat dan berimbang.</p>
        <div class="flex gap-3 mt-4 footer-social">
          <a href="#" aria-label="Facebook">${socialIcon('facebook', 16)}</a>
          <a href="#" aria-label="Instagram">${socialIcon('instagram', 16)}</a>
          <a href="#" aria-label="Youtube">${socialIcon('youtube', 16)}</a>
          <a href="#" aria-label="X / Twitter">${socialIcon('twitter', 16)}</a>
        </div>
      </div>
      <div>
        <h4 class="text-white font-semibold mb-3">Perusahaan</h4>
        <ul class="text-sm flex flex-col gap-2 opacity-80">
          <li><a href="${Base}pages/tentang.html">Tentang Kami</a></li>
          <li><a href="${Base}pages/kontak.html">Kontak</a></li>
          <li><a href="${Base}pages/kontak.html">Redaksi</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-white font-semibold mb-3">Legal</h4>
        <ul class="text-sm flex flex-col gap-2 opacity-80">
          <li><a href="${Base}pages/privacy.html">Privacy Policy</a></li>
          <li><a href="${Base}pages/disclaimer.html">Disclaimer</a></li>
          <li><a href="${Base}pages/sitemap.html">Sitemap</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-white font-semibold mb-3">Kategori</h4>
        <ul class="text-sm flex flex-col gap-2 opacity-80">
          <li><a href="${Base}pages/kategori.html?slug=nasional">Nasional</a></li>
          <li><a href="${Base}pages/kategori.html?slug=politik">Politik</a></li>
          <li><a href="${Base}pages/kategori.html?slug=teknologi">Teknologi</a></li>
          <li><a href="${Base}pages/kategori.html?slug=olahraga">Olahraga</a></li>
        </ul>
      </div>
    </div>
    <div class="container-app border-t mt-10 pt-5 text-xs opacity-60 text-center" style="border-color:rgba(255,255,255,.1);">
      © 2026 SINAR BEMO.COM. All Rights Reserved.
    </div>
  </footer>
  ${fabHTML()}`;
}

/* ---------- FLOATING ACTION BUTTON (FAB) PARTIAL ---------- */
function fabHTML() {
  return `
  <div class="fab-root" x-data="fabApp()" x-init="init()">
    <!-- Backdrop saat menu FAB terbuka -->
    <div x-show="isOpen" x-cloak @click="closeMenu()" class="fab-backdrop" x-transition.opacity></div>

    <!-- Tombol Pintas Scroll to Top (otomatis muncul saat scroll > 280px) -->
    <button x-show="showScrollTop && !isOpen" x-cloak @click="scrollToTop()"
            class="fab-scroll-top" aria-label="Kembali ke atas" title="Kembali ke atas"
            x-transition:enter="transition ease-out duration-300"
            x-transition:enter-start="opacity-0 scale-75"
            x-transition:enter-end="opacity-100 scale-100"
            x-transition:leave="transition ease-in duration-200"
            x-transition:leave-start="opacity-100 scale-100"
            x-transition:leave-end="opacity-0 scale-75">
      <i data-lucide="chevron-up" style="width:20px;height:20px;"></i>
    </button>

    <!-- Kontainer FAB Speed Dial -->
    <div class="fab-container">
      <!-- Tombol Trigger Utama -->
      <button @click="toggleMenu()" class="fab-main-btn" :class="{ 'is-active': isOpen }"
              aria-label="Menu Pintasan Cepat" title="Menu Pintasan Cepat">
        <i data-lucide="plus" class="fab-main-icon" style="width:24px;height:24px;"></i>
      </button>

      <!-- Menu Items Speed Dial -->
      <div x-show="isOpen" x-cloak class="fab-menu"
           x-transition:enter="transition ease-out duration-300"
           x-transition:enter-start="opacity-0 -translate-y-2 scale-90"
           x-transition:enter-end="opacity-100 translate-y-0 scale-100"
           x-transition:leave="transition ease-in duration-200"
           x-transition:leave-start="opacity-100 translate-y-0 scale-100"
           x-transition:leave-end="opacity-0 -translate-y-2 scale-90">

        <!-- 1. Scroll ke Atas -->
        <div class="fab-item">
          <span class="fab-label">Ke Atas</span>
          <button @click="scrollToTop(); closeMenu();" class="fab-sub-btn" aria-label="Ke Atas" title="Ke Atas">
            <i data-lucide="arrow-up" style="width:18px;height:18px;"></i>
          </button>
        </div>

        <!-- 2. Ganti Mode Tema -->
        <div class="fab-item">
          <span class="fab-label">Ganti Tema</span>
          <button @click="toggleTheme()" class="fab-sub-btn" aria-label="Ganti Tema" title="Ganti Tema">
            <i data-lucide="sun-moon" style="width:18px;height:18px;"></i>
          </button>
        </div>

        <!-- 3. Cari Berita Cepat -->
        <div class="fab-item">
          <span class="fab-label">Cari Berita</span>
          <button @click="openSearch()" class="fab-sub-btn" aria-label="Cari Berita" title="Cari Berita">
            <i data-lucide="search" style="width:18px;height:18px;"></i>
          </button>
        </div>

        <!-- 4. Kontak Redaksi -->
        <div class="fab-item">
          <span class="fab-label">Redaksi</span>
          <button @click="contactRedaksi()" class="fab-sub-btn" aria-label="Kontak Redaksi" title="Kontak Redaksi">
            <i data-lucide="send" style="width:18px;height:18px;"></i>
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

/* Mount seluruh partial publik ke dalam halaman (dipanggil dari tiap page) */
function mountPublicLayout(activeSlug = 'beranda', { breaking = true } = {}) {
  const headerMount = document.getElementById('site-header-mount');
  const navMount = document.getElementById('site-navbar-mount');
  const breakingMount = document.getElementById('breaking-news-mount');
  const footerMount = document.getElementById('site-footer-mount');
  if (headerMount) headerMount.outerHTML = headerHTML();
  if (navMount) navMount.outerHTML = navbarHTML(activeSlug);
  if (breakingMount) breakingMount.outerHTML = breaking ? breakingNewsHTML() : '';
  if (footerMount) footerMount.outerHTML = footerHTML();
}

const CATEGORIES_REF = (window.SINARBEMO_DATA && window.SINARBEMO_DATA.categories) || [];

/* Ekspor global */
window.Components = {
  timeAgo, formatDate, formatViews, articleUrl, categoryUrl,
  badgeCategory, statusBadge, newsCardHTML, newsCardHorizontalHTML,
  popularItemHTML, categoryCardHTML, adSlotHTML, emptyStateHTML,
  errorStateHTML, skeletonCardHTML, paginationHTML, avatarHTML,
  headerHTML, navbarHTML, breakingNewsHTML, footerHTML, fabHTML, mountPublicLayout,
  socialIcon,
};