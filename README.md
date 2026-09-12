# SINAR BEMO — Frontend Prototype

Portal berita **"BERITA AKURAT & TERKINI"** — frontend statis (HTML5 + Tailwind CSS + Bootstrap 5 +
Alpine.js + SweetAlert2), menggunakan data dummy (`assets/js/data.js`). Belum terhubung ke backend
apa pun — siap diintegrasikan ke Laravel Blade pada tahap berikutnya.

## Menjalankan

Proyek ini murni statis, tidak perlu build step atau server khusus.

**Opsi 1 — buka langsung**
Buka `index.html` di browser.

**Opsi 2 — local server (disarankan, agar path relatif konsisten)**
```bash
# Python
python3 -m http.server 8080

# Node (http-server)
npx http-server -p 8080
```
Lalu akses `http://localhost:8080`.

## Struktur Folder

```
sinar-bemo/
├── index.html                 # Homepage
├── pages/                     # Halaman publik
│   ├── detail-berita.html     # ?slug=judul-berita
│   ├── kategori.html          # ?slug=nasional
│   ├── search.html            # ?q=kata-kunci
│   ├── populer.html / terbaru.html
│   ├── breaking-news.html / foto.html / video.html / opini.html
│   ├── tentang.html / kontak.html / privacy.html / disclaimer.html / sitemap.html
│   └── login.html             # Demo login (localStorage, tanpa backend)
├── admin/                     # Dashboard admin (CMS-style prototype)
│   ├── index.html             # Dashboard + Chart.js
│   ├── berita.html / tambah-berita.html / edit-berita.html
│   ├── kategori.html / tags.html / penulis.html
│   ├── media.html / komentar.html
│   ├── breaking-news.html / populer.html
│   ├── advertisement.html / newsletter.html
│   ├── users.html / roles.html
│   ├── statistics.html / pages.html / settings.html / activity-logs.html
├── assets/
│   ├── css/style.css          # Design system publik (tokens, komponen)
│   ├── css/admin.css          # Style khusus admin (sidebar, tabel, dsb.)
│   ├── js/data.js             # Sumber data dummy (articles, categories, users, dst.)
│   ├── js/components.js       # Fungsi render reusable + partial header/navbar/footer
│   ├── js/app.js              # Logic Alpine.js untuk situs publik + AlertKit (wrapper SweetAlert2)
│   └── js/admin.js            # Logic Alpine.js untuk admin dashboard
└── README.md
```

## Arsitektur Konsistensi (penting)

Header, navbar desktop, breaking-news bar, dan footer **tidak** disalin manual ke tiap halaman.
Semuanya dirender dari satu sumber di `components.js` (`headerHTML()`, `navbarHTML()`,
`breakingNewsHTML()`, `footerHTML()`) lalu di-mount ke placeholder:

```html
<div id="site-header-mount"></div>
<div id="site-navbar-mount"></div>
<div id="breaking-news-mount"></div>
<script>Components.mountPublicLayout('slug-kategori-aktif');</script>
...
<div id="site-footer-mount"></div>
```

Begitu pula admin: sidebar & topbar dirender dari `adminSidebarHTML()` / `adminTopbarHTML()` di
`admin.js`, dipanggil lewat `mountAdminShell('menu-key', 'Judul Halaman')`. Menu sidebar didefinisikan
**sekali** di `ADMIN_MENU` — menambah/mengubah menu cukup di satu tempat.

Ini membuat perubahan branding/navigasi konsisten di seluruh situs tanpa perlu menyunting puluhan file,
dan strukturnya sudah dekat dengan pola `@include`/`@component` Blade untuk migrasi Laravel nanti.

## Urutan Muat Script (penting!)

Alpine.js **harus dimuat paling akhir** (setelah `data.js`, `components.js`, `app.js`/`admin.js`),
karena `Alpine.data(...)` didaftarkan lewat event `alpine:init` — jika Alpine dimuat lebih dulu, event
tersebut sudah terlanjur ditembakkan sebelum komponen terdaftar. Urutan yang benar:

```html
<script src="assets/js/data.js"></script>
<script src="assets/js/components.js"></script>
<script src="assets/js/app.js"></script>
<!-- admin.js hanya di halaman /admin -->
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

## Fitur Utama

- **Publik**: hero news, berita terbaru (load more), terpopuler, pilihan editor, kategori, foto
  (lightbox), video (modal player), opini, search & filter, detail berita (share, bookmark, komentar),
  newsletter, dark mode (light/dark/system, tersimpan di `localStorage`), demo login berbasis role.
- **Admin**: dashboard dengan Chart.js (views harian/mingguan/bulanan, statistik kategori), CRUD berita
  (list, tambah, edit, hapus dengan konfirmasi SweetAlert2, bulk delete), workflow editorial
  (draft → review → published/revision), kategori/tags/penulis, media library (grid + upload simulasi),
  moderasi komentar, breaking news & pilihan editor toggle, advertisement & newsletter, user & role
  management, statistics, activity logs, settings.
- **State & feedback**: semua interaksi memakai Alpine.js untuk state dan SweetAlert2 (`AlertKit`
  wrapper di `app.js`) untuk feedback — tidak ada `alert()`/`confirm()` bawaan browser.
- **Data**: seluruhnya dummy di `data.js`, dengan penamaan field yang sudah selaras dengan kemungkinan
  nama kolom Eloquent (`articles`, `categories`, `tags`, `authors`, `comments`, `photos`, `videos`,
  `users`, `advertisements`, `statistics`) agar migrasi ke Laravel minim gesekan.

## Akun Demo Login

Buka `pages/login.html`, klik salah satu kartu akun demo untuk mengisi form otomatis
(password semua akun: `demo123`). Role: Super Admin, Admin, Editor, Wartawan, Kontributor, Pembaca.

## Catatan Integrasi Laravel (tahap berikutnya)

- Ganti pemanggilan `window.SINARBEMO_DATA` dengan data dari Eloquent/API.
- `articleUrl()`/`categoryUrl()` di `components.js` tinggal diarahkan ke route Laravel
  (`/berita/{slug}`, `/kategori/{slug}`) — struktur query string (`?slug=`) sengaja dibuat mirip
  parameter route agar mudah dipetakan.
- Partial header/navbar/footer & admin shell tinggal dipindah jadi `@include`/Blade component.
- Form (`tambah-berita.html`, `kontak.html`, komentar, newsletter, login) tinggal disambungkan ke
  route POST Laravel; validasi frontend yang sudah ada bisa dipertahankan sebagai lapisan pertama.

## Status

✅ Frontend lengkap (situs publik + admin dashboard) dengan data dummy — **belum ada backend, database,
migration, model, controller, atau API** sesuai cakupan tahap frontend.
