# TAHAP 1 — PERANCANGAN FRONTEND SINAR BEMO
## "BERITA AKURAT & TERKINI"

> Dokumen ini adalah **blueprint fondasi** untuk seluruh pembangunan frontend SINAR BEMO. Semua tahap berikutnya (Tahap 2–20) akan mengacu pada keputusan desain, struktur, dan konvensi penamaan yang ditetapkan di sini. Belum ada kode aplikasi pada tahap ini — hanya kerangka konseptual dan struktural.

---

## 1. KONSEP UI/UX

### Positioning
SINAR BEMO diposisikan sebagai portal berita **editorial-premium**, terinspirasi dari portal kelas menengah-atas (gaya Kompas.com / Detik.com / BBC Indonesia) namun dengan sentuhan warna yang lebih hangat dan berani (coral) untuk membedakan identitas.

### Prinsip UX Utama
| Prinsip | Penerapan |
|---|---|
| **Scan-first reading** | Headline besar, excerpt singkat, hierarki visual jelas agar pembaca bisa "memindai" berita dalam 3 detik |
| **Content-first** | Iklan dan elemen non-konten tidak boleh mendominasi viewport |
| **Predictable navigation** | Struktur menu & breadcrumb konsisten di semua halaman |
| **Low-friction interaction** | Bookmark, share, dark mode — semua 1 klik, feedback instan (SweetAlert2) |
| **Trust signal** | Tanggal, penulis, kategori, jumlah views selalu terlihat untuk membangun kredibilitas |

### User Flow Utama (Publik)
```
Homepage → Kategori/Search → Detail Berita → Related News → (Bookmark/Share/Comment)
```

### User Flow Utama (Admin)
```
Login Demo → Dashboard → Kelola Berita (CRUD) → Submit Review → Published
```

---

## 2. DESIGN SYSTEM

Pendekatan: **Token-based design system** — semua nilai visual (warna, spacing, radius, shadow, font-size) didefinisikan sebagai CSS variable di `style.css`, dikonsumsi oleh Tailwind utility & custom class, sehingga konsisten dan mudah di-maintain.

### Prinsip Spacing (8pt grid)
```
--space-1: 4px    --space-4: 16px   --space-8: 32px
--space-2: 8px    --space-5: 20px   --space-10: 40px
--space-3: 12px   --space-6: 24px   --space-12: 48px
```

### Border Radius
```
--radius-sm: 6px   (badge, button kecil)
--radius-md: 10px  (card, input)
--radius-lg: 16px  (modal, hero card)
--radius-full: 9999px (avatar, pill badge)
```

### Shadow
```
--shadow-sm: subtle card resting state
--shadow-md: card hover
--shadow-lg: modal, dropdown, sticky header on scroll
```

---

## 3. COLOR SYSTEM

### Light Mode
```css
:root {
  --primary: #ef4444;        /* Coral/Merah - CTA, breaking news, link aktif */
  --primary-dark: #dc2626;
  --primary-light: #fee2e2;

  --secondary: #2563eb;      /* Biru - kategori, elemen informasi sekunder */
  --secondary-dark: #1d4ed8;
  --secondary-light: #dbeafe;

  --accent: #facc15;         /* Kuning - highlight, featured badge */
  --accent-dark: #eab308;

  --dark: #0f172a;           /* Teks utama, navy */
  --gray-900: #1e293b;
  --gray-700: #334155;
  --gray-500: #64748b;
  --gray-300: #cbd5e1;
  --gray-100: #f1f5f9;

  --light: #ffffff;
  --bg-body: #f8fafc;

  --success: #16a34a;
  --warning: #f59e0b;
  --danger: #dc2626;
  --info: #0ea5e9;
}
```

### Dark Mode
```css
[data-theme="dark"] {
  --dark: #f1f5f9;
  --bg-body: #0f172a;
  --light: #1e293b;
  --gray-100: #1e293b;
  --gray-300: #334155;
  --gray-500: #94a3b8;
  --gray-700: #cbd5e1;
  --gray-900: #f1f5f9;
  /* primary/secondary/accent tetap sama, disesuaikan contrast-nya di komponen */
}
```

### Penggunaan Warna
- **Coral (primary)**: tombol utama, link aktif, breaking news bar, badge "Breaking"
- **Biru (secondary)**: badge kategori, ikon, elemen informasi
- **Kuning (accent)**: badge "Featured"/"Pilihan Editor", rating, highlight
- **Navy/Charcoal (dark)**: heading, body text — kontras tinggi untuk readability

---

## 4. TYPOGRAPHY

### Font Pairing
- **Headline/Display**: `Merriweather` atau `Playfair Display` (serif — nuansa editorial/koran)
- **Body/UI**: `Inter` atau `Plus Jakarta Sans` (sans-serif — readability tinggi di layar)

```css
--font-heading: 'Merriweather', Georgia, serif;
--font-body: 'Inter', -apple-system, sans-serif;
```

### Scale (Type Ramp)
| Token | Size (desktop) | Size (mobile) | Penggunaan |
|---|---|---|---|
| `--text-hero` | 42px | 28px | Judul hero news |
| `--text-h1` | 32px | 24px | Judul detail berita |
| `--text-h2` | 24px | 20px | Judul section |
| `--text-h3` | 18px | 16px | Judul card |
| `--text-body` | 16px | 15px | Paragraf artikel |
| `--text-sm` | 14px | 13px | Meta info (tanggal, penulis) |
| `--text-xs` | 12px | 11px | Badge, label |

Line-height artikel: `1.75` untuk kenyamanan baca panjang.

---

## 5. COMPONENT SYSTEM

Semua komponen dirancang **reusable** dan **data-driven** (menerima data dari `data.js`, bukan hardcoded).

| Komponen | Varian |
|---|---|
| `NewsCard` | horizontal, vertical, compact (list), featured (besar) |
| `Navbar` | desktop, mobile drawer |
| `BreakingNewsBar` | marquee, slide |
| `PopularNewsItem` | dengan ranking number |
| `CategoryCard` | icon + label + jumlah berita |
| `AuthorCard` | avatar + nama + jumlah artikel |
| `Advertisement` | leaderboard, sidebar, in-article |
| `Newsletter` | inline, modal |
| `Pagination` | numbered, load-more |
| `Breadcrumb` | otomatis dari kategori/slug |
| `SearchBox` | navbar mini, halaman search penuh |
| `Modal` | generic (dipakai lightbox, video player, preview) |
| `Toast/SweetAlert` | wrapper konsisten (success/error/warning/confirm) |
| `Badge` | kategori, featured, breaking, status editorial |
| `Button` | primary, secondary, outline, ghost, icon-only |
| `Table` | admin data table dengan sorting header |
| `EmptyState` | icon + message + action |
| `LoadingState` | skeleton per tipe card |

Semua komponen akan diimplementasikan sebagai **HTML partial pattern** (fungsi JS yang me-render string template) di `components.js`, agar mudah dipetakan ke Blade `@component`/`@include` saat integrasi Laravel.

---

## 6. PUBLIC WEBSITE ARCHITECTURE

```
Homepage
 ├─ Header (logo, tanggal, social, search, login)
 ├─ Navbar (sticky, kategori utama)
 ├─ Breaking News Bar
 ├─ Hero News (1 utama + 3-4 pendukung)
 ├─ Berita Terbaru (grid + load more)
 ├─ Berita Terpopuler (ranking list)
 ├─ Pilihan Editor (editorial layout)
 ├─ Kategori Berita (grid kategori)
 ├─ Foto Terbaru (preview strip)
 ├─ Video Terbaru (preview strip)
 ├─ Advertisement (antar section)
 ├─ Newsletter
 └─ Footer

Detail Berita (?slug=)
 ├─ Breadcrumb
 ├─ Artikel (title, meta, image, content)
 ├─ Share + Bookmark
 ├─ Related News
 ├─ Popular News (sidebar)
 ├─ Advertisement (top/bottom/sidebar)
 └─ Comments

Kategori / Search / Populer / Terbaru
 ├─ Filter & Sort bar
 ├─ Grid/List berita
 ├─ Pagination
 └─ Empty/Loading/Error state

Foto / Video / Opini → gallery/list layout khusus per tipe konten
```

---

## 7. ADMIN DASHBOARD ARCHITECTURE

```
Admin Shell
 ├─ Sidebar (collapsible, mobile drawer)
 ├─ Topbar (search, notif, profile, theme toggle)
 └─ Content Area
      ├─ Dashboard (cards + Chart.js)
      ├─ Berita (CRUD + workflow editorial)
      ├─ Kategori / Tags / Penulis (CRUD sederhana)
      ├─ Media Library (grid + modal upload prototype)
      ├─ Komentar (moderasi)
      ├─ Breaking News (kelola item)
      ├─ Advertisement / Newsletter (kelola)
      ├─ Users / Roles
      ├─ Statistics
      ├─ Pages (halaman statis)
      ├─ Settings
      └─ Activity Logs
```

Semua halaman admin memakai **shared layout shell** (sidebar + topbar) agar Tahap 11 hanya perlu membuat 1 layout inti yang dipakai ulang.

---

## 8. STRUKTUR FOLDER FRONTEND

```text
sinar-bemo/
├── index.html
├── pages/
│   ├── berita.html
│   ├── detail-berita.html
│   ├── kategori.html
│   ├── search.html
│   ├── populer.html
│   ├── terbaru.html
│   ├── breaking-news.html
│   ├── foto.html
│   ├── video.html
│   ├── opini.html
│   ├── tentang.html
│   ├── kontak.html
│   ├── privacy.html
│   ├── disclaimer.html
│   └── sitemap.html
├── admin/
│   ├── index.html
│   ├── berita.html
│   ├── tambah-berita.html
│   ├── edit-berita.html
│   ├── kategori.html
│   ├── tags.html
│   ├── penulis.html
│   ├── media.html
│   ├── komentar.html
│   ├── breaking-news.html
│   ├── populer.html
│   ├── advertisement.html
│   ├── newsletter.html
│   ├── users.html
│   ├── roles.html
│   ├── statistics.html
│   ├── pages.html
│   ├── settings.html
│   └── activity-logs.html
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── admin.css
│   ├── js/
│   │   ├── data.js
│   │   ├── components.js
│   │   ├── app.js
│   │   └── admin.js
│   ├── images/
│   │   ├── logo/
│   │   ├── berita/
│   │   ├── authors/
│   │   ├── foto/
│   │   ├── video/
│   │   └── ads/
│   └── icons/
└── README.md
```

Struktur ini dipertahankan persis seperti diminta — sudah cukup scalable untuk prototype frontend murni.

---

## 9. STRUKTUR JAVASCRIPT

```
data.js          → sumber tunggal dummy data (articles, categories, users, dll)
      ↓
components.js     → fungsi render reusable (renderNewsCard, renderBadge, dll)
      ↓
app.js            → Alpine.js store & logic untuk website publik
      ↓
admin.js          → Alpine.js store & logic untuk dashboard admin
```

### Konvensi
- Setiap fungsi Alpine (`x-data="newsApp()"`, `x-data="searchApp()"`, dst.) didefinisikan di `app.js`/`admin.js`, dipanggil dari HTML.
- `data.js` tidak boleh memiliki dependency ke `app.js`/`admin.js` (searah, bukan circular).
- `components.js` hanya berisi fungsi murni (input data → output HTML string), tidak menyimpan state.

---

## 10. STRUKTUR DATA DUMMY

Entitas utama (nama akan dipertahankan konsisten hingga integrasi Laravel):

```
articles        → id, title, slug, category, author, excerpt, content,
                   image, views, status, featured, breaking, tags, published_at
categories      → id, name, slug, icon, description
tags            → id, name, slug
authors         → id, name, avatar, bio, role
comments        → id, article_id, name, email, content, date, status, parent_id
photos          → id, title, album, image, caption, author, date
videos          → id, title, description, thumbnail, url, views, date
users           → id, name, email, avatar, role, status, joined
advertisements  → id, position, image, link, active
statistics      → daily_views, weekly_views, monthly_views, top_articles
```

Semua field ini dirancang **1:1 dengan kemungkinan nama kolom Eloquent** di masa depan (snake_case, singular relation), agar migrasi ke Laravel minim gesekan.

---

## 11. RESPONSIVE STRATEGY

### Breakpoint (mengikuti Tailwind default)
```
sm  : 640px   (mobile besar/phablet)
md  : 768px   (tablet)
lg  : 1024px  (laptop)
xl  : 1280px  (desktop)
2xl : 1536px  (desktop besar)
```

### Pendekatan
- **Mobile-first**: semua utility class ditulis dari base (mobile) lalu di-override naik (`md:`, `lg:`).
- Grid berita: 1 kolom (mobile) → 2 kolom (tablet) → 3–4 kolom (desktop).
- Admin sidebar: drawer overlay (mobile) → fixed sidebar (desktop).
- Table admin: horizontal scroll wrapper di mobile, bukan dipotong.

---

## 12. ALPINE.JS ARCHITECTURE

Pola state per fitur, contoh:

```javascript
function newsApp() {
  return {
    searchQuery: '',
    selectedCategory: 'all',
    sortBy: 'latest',
    currentPage: 1,
    darkMode: localStorage.getItem('theme') === 'dark',
    mobileMenuOpen: false,
    init() { /* load dummy data, watch theme, dst */ }
  }
}
```

### Prinsip
- 1 `x-data` scope per komponen fungsional (navbar, search, gallery, dst) — hindari 1 objek raksasa global.
- State yang perlu persist (`theme`, `bookmarks`, `newsletter`) disinkronkan ke `localStorage` lewat `init()` dan `$watch`.
- Semua fungsi Alpine didaftarkan lewat `Alpine.data()` di `app.js`/`admin.js` agar tidak polusi `window`.

---

## 13. SWEETALERT2 ARCHITECTURE

Dibuat wrapper konsisten di `components.js`, contoh konsep:

```javascript
const AlertKit = {
  success(title, text) { /* Swal.fire icon success */ },
  error(title, text) { /* Swal.fire icon error */ },
  warning(title, text) { /* Swal.fire icon warning */ },
  confirmDelete(onConfirm) { /* Swal.fire showCancelButton */ }
}
```

Semua interaksi (login, bookmark, comment, newsletter, CRUD admin) memanggil `AlertKit.*` — bukan `Swal.fire` langsung berulang — supaya styling/icon/timer konsisten di seluruh aplikasi.

---

## 14. SEO FRONTEND STRATEGY

- Setiap halaman: `<title>`, `meta description`, `canonical`, Open Graph (`og:title`, `og:image`, `og:type=article`), Twitter Card.
- Struktur semantik: `<header> <nav> <main> <article> <section> <footer>`.
- Heading hierarchy terjaga: 1× `h1` per halaman, `h2`/`h3` untuk section/card.
- Breadcrumb terlihat & semantik (`nav aria-label="breadcrumb"`).
- URL prototype (`?slug=`) disiapkan agar mudah di-*rewrite* menjadi `/berita/judul-berita` via route Laravel nanti.
- `sitemap.html` sebagai placeholder representasi sitemap.xml masa depan.

---

## 15. ACCESSIBILITY STRATEGY

- Semua gambar wajib `alt` deskriptif.
- Kontras warna teks-terhadap-background divalidasi minimal AA (terutama teks di atas coral/biru).
- Semua elemen interaktif (tombol icon-only, dropdown, hamburger) memiliki `aria-label`.
- Modal dapat ditutup dengan `Esc` dan klik area luar, fokus terkunci di dalam modal saat terbuka (focus trap sederhana).
- Navigasi keyboard: urutan `tab` logis, `focus-visible` style jelas.
- Form selalu punya `<label>` terhubung ke input (bukan hanya placeholder).

---

## 16. PERFORMANCE STRATEGY

- `loading="lazy"` pada semua gambar non-hero.
- Skeleton loading dipakai di semua area yang memuat data async-simulasi (homepage, list, search, foto, video).
- Script non-kritis (`SweetAlert2`, `Chart.js`) dimuat dengan `defer`.
- Pagination/load-more dipakai alih-alih render seluruh dataset dummy sekaligus.
- Animasi dibatasi pada transform/opacity (GPU-friendly), tidak pada properti yang memicu reflow.
- Minim campuran Tailwind+Bootstrap pada elemen yang sama untuk menghindari CSS bengkak/konflik.

---

## 17. ROADMAP TAHAP BERIKUTNYA

| Tahap | Fokus |
|---|---|
| 2 | Setup CDN, global CSS (`style.css`), branding, dark mode base |
| 3 | Header + Navbar + Mobile Navigation |
| 4 | Homepage (komposisi seluruh section) |
| 5 | News Card + Berita Terbaru + Terpopuler + Pilihan Editor |
| 6 | Detail Berita |
| 7 | Search + Kategori |
| 8 | Foto + Video + Opini |
| 9 | Comment + Bookmark + Newsletter |
| 10 | Demo Login / Auth UI |
| 11 | Admin Dashboard shell |
| 12 | CRUD Berita frontend |
| 13 | Media Management |
| 14 | User + Role Management |
| 15 | Comment Management |
| 16 | Advertisement + Newsletter Management |
| 17 | Statistics + Chart.js |
| 18 | SEO + Accessibility + Performance pass |
| 19 | Testing menyeluruh |
| 20 | Final integration readiness untuk Laravel |

---

### Status Tahap 1: ✅ Selesai — Blueprint fondasi ditetapkan.

Silakan konfirmasi jika blueprint ini sudah sesuai, atau berikan revisi (mis. preferensi font, palet warna, atau prioritas kategori) sebelum lanjut ke **TAHAP 2: Setup Frontend + CDN + Global CSS + Branding**.
