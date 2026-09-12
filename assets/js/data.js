/* =========================================================
   SINAR BEMO.COM — DUMMY DATA SOURCE
   Struktur field dirancang agar 1:1 mudah dipetakan ke
   tabel Eloquent (Laravel) pada tahap integrasi berikutnya.
   ========================================================= */

const CATEGORIES = [
  { id: 1, name: 'Nasional', slug: 'nasional', icon: 'flag', description: 'Isu dan kebijakan nasional terkini', color: '#2563eb' },
  { id: 2, name: 'Daerah', slug: 'daerah', icon: 'map-pin', description: 'Berita dari seluruh penjuru daerah', color: '#16a34a' },
  { id: 3, name: 'Papua', slug: 'papua', icon: 'mountain', description: 'Kabar terkini dari tanah Papua', color: '#ef4444' },
  { id: 4, name: 'Politik', slug: 'politik', icon: 'landmark', description: 'Dinamika politik dan pemerintahan', color: '#7c3aed' },
  { id: 5, name: 'Ekonomi', slug: 'ekonomi', icon: 'trending-up', description: 'Ekonomi, bisnis, dan pasar', color: '#0891b2' },
  { id: 6, name: 'Pendidikan', slug: 'pendidikan', icon: 'graduation-cap', description: 'Dunia pendidikan tanah air', color: '#ea580c' },
  { id: 7, name: 'Kesehatan', slug: 'kesehatan', icon: 'heart-pulse', description: 'Kesehatan dan gaya hidup sehat', color: '#dc2626' },
  { id: 8, name: 'Teknologi', slug: 'teknologi', icon: 'cpu', description: 'Inovasi dan perkembangan teknologi', color: '#4338ca' },
  { id: 9, name: 'Olahraga', slug: 'olahraga', icon: 'trophy', description: 'Kabar dunia olahraga', color: '#059669' },
  { id: 10, name: 'Budaya', slug: 'budaya', icon: 'drama', description: 'Seni dan budaya nusantara', color: '#b45309' },
  { id: 11, name: 'Hukum', slug: 'hukum', icon: 'gavel', description: 'Peristiwa hukum dan peradilan', color: '#334155' },
  { id: 12, name: 'Lifestyle', slug: 'lifestyle', icon: 'sparkles', description: 'Gaya hidup masa kini', color: '#db2777' },
];

const AUTHORS = [
  { id: 1, name: 'Maria Kaize', avatar: 'https://i.pravatar.cc/150?img=47', role: 'Redaktur Senior', bio: 'Meliput isu nasional dan politik selama 12 tahun.' },
  { id: 2, name: 'Yosep Rumbrar', avatar: 'https://i.pravatar.cc/150?img=12', role: 'Wartawan Papua', bio: 'Fokus liputan sosial dan pembangunan di Papua.' },
  { id: 3, name: 'Dinda Pratama', avatar: 'https://i.pravatar.cc/150?img=32', role: 'Wartawan Ekonomi', bio: 'Menulis analisis ekonomi dan bisnis.' },
  { id: 4, name: 'Aditya Nugraha', avatar: 'https://i.pravatar.cc/150?img=51', role: 'Wartawan Teknologi', bio: 'Mengulas tren teknologi dan startup.' },
  { id: 5, name: 'Sinar Bemo', avatar: 'https://i.pravatar.cc/150?img=68', role: 'Redaksi', bio: 'Tim redaksi Sinar Bemo.com.' },
];

const TAGS = [
  { id: 1, name: 'Pemilu', slug: 'pemilu' },
  { id: 2, name: 'Otsus Papua', slug: 'otsus-papua' },
  { id: 3, name: 'Startup', slug: 'startup' },
  { id: 4, name: 'BBM', slug: 'bbm' },
  { id: 5, name: 'Piala Dunia', slug: 'piala-dunia' },
  { id: 6, name: 'AI', slug: 'ai' },
  { id: 7, name: 'Infrastruktur', slug: 'infrastruktur' },
  { id: 8, name: 'UMKM', slug: 'umkm' },
];

const NEWS_IMAGES = [
  'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80',
  'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80',
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
  'https://images.unsplash.com/photo-1590650046871-92c887180603?w=800&q=80',
  'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
  'https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?w=800&q=80',
  'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=800&q=80',
  'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80',
  'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
  'https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80';

const ARTICLE_TITLES = [
  'Pemerintah Percepat Pembangunan Infrastruktur Jalan di Wilayah Timur',
  'Harga BBM Bersubsidi Resmi Disesuaikan Mulai Pekan Depan',
  'DPR Sahkan Revisi Undang-Undang Otonomi Khusus Papua',
  'Ekonomi Digital Indonesia Diproyeksi Tumbuh Dua Digit Tahun Ini',
  'Kemendikbud Luncurkan Kurikulum Baru untuk Sekolah Menengah',
  'Kasus DBD Meningkat, Dinas Kesehatan Imbau Warga Waspada',
  'Startup Lokal Kembangkan Aplikasi Berbasis Kecerdasan Buatan',
  'Timnas Indonesia Raih Kemenangan Penting di Laga Tandang',
  'Festival Budaya Nusantara Digelar Meriah di Akhir Pekan',
  'Polisi Ungkap Kasus Penipuan Investasi Bodong Senilai Miliaran',
  'Tren Gaya Hidup Minimalis Semakin Digemari Anak Muda Urban',
  'UMKM Binaan Pemerintah Daerah Tembus Pasar Ekspor',
  'Presiden Tinjau Langsung Progres Proyek Strategis Nasional',
  'Bank Sentral Pertahankan Suku Bunga Acuan Bulan Ini',
  'Universitas Cendrawasih Buka Program Studi Baru',
  'Layanan Kesehatan Gratis Diperluas ke Daerah Terpencil',
  'Perusahaan Teknologi Global Buka Kantor Perwakilan di Jakarta',
  'Atlet Muda Papua Raih Medali Emas di Ajang Nasional',
  'Pameran Seni Rupa Kontemporer Tarik Ribuan Pengunjung',
  'Aparat Gagalkan Peredaran Narkotika Jaringan Antarprovinsi',
  'Gaya Hidup Sehat: Tren Olahraga Lari Terus Meningkat',
  'Koperasi Desa Jadi Andalan Penggerak Ekonomi Lokal',
  'Kebijakan Baru Perlindungan Data Pribadi Mulai Berlaku',
  'Sekolah di Wilayah Pesisir Terima Bantuan Fasilitas Belajar',
  'Rumah Sakit Daerah Tambah Layanan Unit Gawat Darurat',
  'Perkembangan 5G Dinilai Percepat Transformasi Digital Daerah',
  'Liga Voli Nasional Musim Ini Diikuti Lebih Banyak Klub',
  'Tradisi Adat Bakar Batu Tetap Lestari di Tengah Modernisasi',
  'Kejaksaan Tetapkan Tersangka Baru Kasus Korupsi Anggaran',
  'Wisata Alam Danau Sentani Kembali Ramai Dikunjungi',
];

const EXCERPTS = [
  'Kebijakan ini diharapkan mampu mendorong pemerataan pembangunan dan meningkatkan konektivitas antarwilayah dalam beberapa tahun ke depan.',
  'Langkah tersebut diambil pemerintah sebagai bagian dari upaya menjaga stabilitas anggaran negara di tengah tekanan ekonomi global.',
  'Perubahan aturan ini disambut beragam oleh masyarakat, mulai dari dukungan penuh hingga sejumlah catatan kritis dari pengamat kebijakan publik.',
  'Para pemangku kepentingan menilai perkembangan ini menjadi momentum penting bagi percepatan pertumbuhan sektor terkait di masa mendatang.',
  'Otoritas terkait menegaskan bahwa proses ini akan terus dipantau agar berjalan sesuai dengan target dan prinsip tata kelola yang baik.',
];

function seededImage(i) { return NEWS_IMAGES[i % NEWS_IMAGES.length]; }

function daysAgoISO(days, hour = 8, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString().slice(0, 16).replace('T', ' ');
}

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const ARTICLE_CONTENT_PARAGRAPHS = [
  'Perkembangan ini menjadi sorotan publik dalam beberapa hari terakhir, mengingat dampaknya yang cukup luas terhadap berbagai kalangan masyarakat, mulai dari pelaku usaha hingga warga di tingkat akar rumput.',
  'Sejumlah pihak menyambut baik langkah ini karena dinilai dapat memberikan kepastian jangka panjang. Namun demikian, tidak sedikit pula yang meminta agar proses implementasinya diawasi secara ketat agar tidak menimbulkan dampak yang tidak diinginkan.',
  'Dalam keterangannya, perwakilan otoritas terkait menyampaikan bahwa kebijakan ini telah melalui kajian mendalam bersama berbagai pemangku kepentingan, termasuk akademisi, pelaku industri, dan perwakilan masyarakat sipil.',
  'Ke depan, pemerintah menyatakan akan terus melakukan evaluasi berkala guna memastikan setiap kebijakan yang diambil benar-benar memberikan manfaat nyata bagi masyarakat luas, khususnya kelompok yang selama ini kurang terjangkau layanan publik.',
  'Sementara itu, sejumlah pengamat menilai bahwa keberhasilan implementasi kebijakan ini sangat bergantung pada koordinasi lintas sektor, transparansi anggaran, serta keterlibatan aktif masyarakat dalam proses pengawasan.',
  'Pihak berwenang mengimbau masyarakat untuk terus memantau informasi resmi dari kanal-kanal terpercaya agar tidak terjebak pada informasi yang keliru atau belum terverifikasi kebenarannya.',
];

const articles = ARTICLE_TITLES.map((title, i) => {
  const category = CATEGORIES[i % CATEGORIES.length];
  const author = AUTHORS[i % AUTHORS.length];
  const views = Math.floor(500 + Math.random() * 24000);
  const statusPool = ['published', 'published', 'published', 'published', 'draft', 'review'];
  return {
    id: i + 1,
    title,
    slug: slugify(title),
    category: category.name,
    category_slug: category.slug,
    author: author.name,
    author_id: author.id,
    excerpt: EXCERPTS[i % EXCERPTS.length],
    content: ARTICLE_CONTENT_PARAGRAPHS,
    image: seededImage(i),
    caption: `Ilustrasi terkait ${category.name.toLowerCase()} — dokumentasi Sinar Bemo.com.`,
    views,
    status: i < 24 ? 'published' : statusPool[i % statusPool.length],
    featured: i % 6 === 0,
    breaking: i % 9 === 0,
    tags: [TAGS[i % TAGS.length].name, TAGS[(i + 3) % TAGS.length].name],
    published_at: daysAgoISO(i % 14, 7 + (i % 10), (i * 7) % 60),
  };
});

const photos = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `Momen ${CATEGORIES[i % CATEGORIES.length].name} Pekan Ini #${i + 1}`,
  album: CATEGORIES[i % CATEGORIES.length].name,
  image: seededImage(i + 4),
  caption: 'Dokumentasi lapangan tim Sinar Bemo.com.',
  author: AUTHORS[i % AUTHORS.length].name,
  date: daysAgoISO(i),
}));

const videos = Array.from({ length: 9 }).map((_, i) => ({
  id: i + 1,
  title: ARTICLE_TITLES[(i * 3) % ARTICLE_TITLES.length] + ' — Liputan Video',
  description: EXCERPTS[i % EXCERPTS.length],
  thumbnail: seededImage(i + 2),
  url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  views: Math.floor(1000 + Math.random() * 50000),
  date: daysAgoISO(i + 1),
}));

const opinions = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  author: AUTHORS[i % AUTHORS.length].name,
  avatar: AUTHORS[i % AUTHORS.length].avatar,
  title: [
    'Menakar Arah Kebijakan Otonomi Khusus di Tanah Papua',
    'Transformasi Digital UMKM: Peluang atau Sekadar Wacana?',
    'Pendidikan Karakter di Tengah Derasnya Arus Informasi',
    'Krisis Iklim dan Tanggung Jawab Generasi Muda',
    'Reformasi Birokrasi: Sudah Sejauh Mana?',
    'Mencari Keseimbangan Kerja dan Kehidupan di Era Digital',
  ][i],
  excerpt: EXCERPTS[i % EXCERPTS.length],
  date: daysAgoISO(i * 2),
  category: 'Opini',
}));

const comments = [
  { id: 1, article_id: 1, name: 'Budi Santoso', email: 'budi@mail.com', content: 'Semoga pembangunan ini benar-benar dirasakan sampai ke pelosok.', date: daysAgoISO(0, 10, 20), status: 'approved', parent_id: null, likes: 12 },
  { id: 2, article_id: 1, name: 'Rina Wulandari', email: 'rina@mail.com', content: 'Menarik, tapi perlu pengawasan ketat soal anggarannya.', date: daysAgoISO(0, 11, 5), status: 'approved', parent_id: null, likes: 4 },
  { id: 3, article_id: 1, name: 'Admin Redaksi', email: 'redaksi@sinarbemo.com', content: 'Terima kasih atas masukannya, akan kami tindak lanjuti pada liputan berikutnya.', date: daysAgoISO(0, 12, 0), status: 'approved', parent_id: 2, likes: 2 },
];

const users = [
  { id: 1, name: 'Maria Kaize', email: 'maria@sinarbemo.com', avatar: AUTHORS[0].avatar, role: 'Super Admin', status: 'active', joined: '2023-01-10' },
  { id: 2, name: 'Yosep Rumbrar', email: 'yosep@sinarbemo.com', avatar: AUTHORS[1].avatar, role: 'Wartawan', status: 'active', joined: '2023-03-22' },
  { id: 3, name: 'Dinda Pratama', email: 'dinda@sinarbemo.com', avatar: AUTHORS[2].avatar, role: 'Editor', status: 'active', joined: '2023-05-14' },
  { id: 4, name: 'Aditya Nugraha', email: 'aditya@sinarbemo.com', avatar: AUTHORS[3].avatar, role: 'Wartawan', status: 'inactive', joined: '2024-01-02' },
  { id: 5, name: 'Putri Ayu', email: 'putri@mail.com', avatar: 'https://i.pravatar.cc/150?img=44', role: 'Kontributor', status: 'active', joined: '2024-06-11' },
  { id: 6, name: 'Pembaca Umum', email: 'reader@mail.com', avatar: 'https://i.pravatar.cc/150?img=15', role: 'Pembaca', status: 'active', joined: '2024-08-19' },
];

const DEMO_ACCOUNTS = [
  { role: 'Super Admin', email: 'superadmin@sinarbemo.com', password: 'demo123', avatar: users[0].avatar },
  { role: 'Admin', email: 'admin@sinarbemo.com', password: 'demo123', avatar: AUTHORS[4].avatar },
  { role: 'Editor', email: 'editor@sinarbemo.com', password: 'demo123', avatar: users[2].avatar },
  { role: 'Wartawan', email: 'wartawan@sinarbemo.com', password: 'demo123', avatar: users[1].avatar },
  { role: 'Kontributor', email: 'kontributor@sinarbemo.com', password: 'demo123', avatar: users[4].avatar },
  { role: 'Pembaca', email: 'pembaca@sinarbemo.com', password: 'demo123', avatar: users[5].avatar },
];

const advertisements = [
  { id: 1, position: 'header', image: null, link: '#', active: true },
  { id: 2, position: 'homepage', image: null, link: '#', active: true },
  { id: 3, position: 'sidebar', image: null, link: '#', active: true },
  { id: 4, position: 'article-top', image: null, link: '#', active: true },
  { id: 5, position: 'article-bottom', image: null, link: '#', active: true },
  { id: 6, position: 'footer', image: null, link: '#', active: true },
];

const statistics = {
  total_articles: articles.length,
  published: articles.filter(a => a.status === 'published').length,
  draft: articles.filter(a => a.status === 'draft').length,
  review: articles.filter(a => a.status === 'review').length,
  rejected: 2,
  total_users: users.length,
  total_comments: comments.length,
  total_views: articles.reduce((sum, a) => sum + a.views, 0),
  visitors_today: 4821,
  visitors_week: 28904,
  visitors_month: 118230,
  daily_views: [1200, 1900, 1500, 2100, 2600, 2300, 3100],
  daily_labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
  weekly_views: [12500, 15800, 14200, 18900],
  weekly_labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
  monthly_views: [45000, 52000, 48000, 61000, 58000, 67000],
  monthly_labels: ['Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep'],
  category_stats: CATEGORIES.slice(0, 6).map(c => ({
    name: c.name,
    value: articles.filter(a => a.category === c.name).length,
  })),
};

const activityLogs = [
  { id: 1, user: 'Maria Kaize', action: 'Menerbitkan berita', module: 'Berita', description: `Menerbitkan "${articles[0].title}"`, ip: '103.10.22.4', agent: 'Chrome / Windows', timestamp: daysAgoISO(0, 9, 12) },
  { id: 2, user: 'Dinda Pratama', action: 'Menyetujui komentar', module: 'Komentar', description: 'Menyetujui komentar dari Budi Santoso', ip: '182.1.44.9', agent: 'Safari / macOS', timestamp: daysAgoISO(0, 10, 40) },
  { id: 3, user: 'Yosep Rumbrar', action: 'Menyimpan draft', module: 'Berita', description: `Menyimpan draft "${articles[24].title}"`, ip: '114.5.9.20', agent: 'Chrome / Android', timestamp: daysAgoISO(1, 15, 2) },
  { id: 4, user: 'Super Admin', action: 'Menambah pengguna', module: 'Users', description: 'Menambahkan akun baru untuk Putri Ayu', ip: '103.10.22.4', agent: 'Chrome / Windows', timestamp: daysAgoISO(2, 8, 22) },
  { id: 5, user: 'Aditya Nugraha', action: 'Mengunggah media', module: 'Media', description: 'Mengunggah 3 foto ke album Teknologi', ip: '36.72.10.3', agent: 'Firefox / Windows', timestamp: daysAgoISO(3, 13, 51) },
];

function loadPersisted(key, defaultVal) {
  try {
    const raw = localStorage.getItem('sb_' + key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

// Ekspor global (dikonsumsi oleh components.js / app.js / admin.js)
window.SINARBEMO_DATA = {
  categories: loadPersisted('categories', CATEGORIES),
  authors: loadPersisted('authors', AUTHORS),
  tags: loadPersisted('tags', TAGS),
  articles: loadPersisted('articles', articles),
  photos: loadPersisted('photos', photos),
  videos: loadPersisted('videos', videos),
  opinions: loadPersisted('opinions', opinions),
  comments: loadPersisted('comments', comments),
  users: loadPersisted('users', users),
  demoAccounts: DEMO_ACCOUNTS,
  advertisements: loadPersisted('advertisements', advertisements),
  statistics,
  activityLogs: loadPersisted('activityLogs', activityLogs),
  fallbackImage: FALLBACK_IMAGE,

  // Simpan data koleksi ke localStorage
  save(key) {
    try {
      localStorage.setItem('sb_' + key, JSON.stringify(this[key]));
    } catch (e) {
      console.error('Error saving sb_' + key, e);
    }
  },

  // Catat riwayat aktivitas admin
  addLog(action, module, description) {
    const user = JSON.parse(localStorage.getItem('sb_demo_user') || '{}').name || 'Admin';
    const log = {
      id: Date.now(),
      user,
      action,
      module,
      description,
      ip: '103.10.22.4',
      agent: 'Chrome / Windows',
      timestamp: new Date().toISOString()
    };
    this.activityLogs.unshift(log);
    this.save('activityLogs');
  },

  // Sinkronisasi statistik dinamis
  getDynamicStats() {
    const arts = this.articles;
    return {
      ...this.statistics,
      total_articles: arts.length,
      published: arts.filter(a => a.status === 'published').length,
      draft: arts.filter(a => a.status === 'draft').length,
      review: arts.filter(a => a.status === 'review').length,
      rejected: arts.filter(a => a.status === 'rejected').length || 2,
      total_users: this.users.length,
      total_comments: this.comments.length,
      total_views: arts.reduce((sum, a) => sum + (a.views || 0), 0),
    };
  }
};

