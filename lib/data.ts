// ============================================================
// TYPES
// ============================================================

export interface PaketMakeup {
  id: string
  nama: string
  harga: number
  kategoriHarga: 'murah' | 'sedang' | 'mahal'
  deskripsi: string
  layanan: string[]
  kelengkapan: 'makeup_only' | 'makeup_hairdo' | 'makeup_hairdo_dekorasi'
  kualitasMakeup: 'natural' | 'glamour' | 'bold'
  pengalamanMUA: 'berpengalaman' | 'profesional' | 'senior'
  estetikaDekorasi: 'minimalis' | 'elegan' | 'mewah' | 'adat'
  foto: string
  rating: number
  totalReview: number
  terlaris?: boolean
  terbaik?: boolean
}

export interface GaleriItem {
  id: string
  foto: string
  kategori: string
  deskripsi: string
}

export interface Testimoni {
  id: string
  nama: string
  paket: string
  rating: number
  komentar: string
  tanggal: string
  foto: string
}

export interface User {
  id: string
  nama: string
  email: string
  noHp: string
  password: string
  role: 'customer' | 'admin'
  createdAt: string
}

export interface Booking {
  id: string
  customerId: string
  customerNama: string
  customerEmail: string
  customerHp: string
  paketId: string
  paketNama: string
  paketHarga: number
  tanggalAcara: string
  lokasiAcara: string
  catatan: string
  status: 'menunggu_pembayaran' | 'menunggu_konfirmasi' | 'dikonfirmasi' | 'selesai' | 'dibatalkan'
  buktiPembayaran?: string
  createdAt: string
  updatedAt: string
}

// ============================================================
// MOCK DATA PAKET
// ============================================================

export const PAKET_DATA: PaketMakeup[] = [
  {
    id: 'p1',
    nama: 'Paket Cantik Natural',
    harga: 1500000,
    kategoriHarga: 'murah',
    deskripsi: 'Paket makeup natural elegan untuk pernikahan sederhana namun berkesan.',
    layanan: ['Makeup Pengantin Natural', 'Penataan Rambut Sederhana', 'Riasan Tahan 8 Jam', 'Konsultasi Makeup'],
    kelengkapan: 'makeup_hairdo',
    kualitasMakeup: 'natural',
    pengalamanMUA: 'berpengalaman',
    estetikaDekorasi: 'minimalis',
    foto: 'https://placehold.co/400x500?text=Paket+Cantik+Natural+Bridal+Makeup+Simple+Elegant+Soft+Tones',
    rating: 4.7,
    totalReview: 38,
  },
  {
    id: 'p2',
    nama: 'Paket Glamour Premium',
    harga: 3500000,
    kategoriHarga: 'sedang',
    deskripsi: 'Tampil glamour memukau dengan riasan lengkap dan hairdo eksklusif.',
    layanan: ['Makeup Pengantin Glamour', 'Hairdo Eksklusif', 'Riasan Tahan 12 Jam', 'Touch Up Set', 'Konsultasi & Trial Makeup', 'Asisten MUA'],
    kelengkapan: 'makeup_hairdo',
    kualitasMakeup: 'glamour',
    pengalamanMUA: 'profesional',
    estetikaDekorasi: 'elegan',
    foto: 'https://placehold.co/400x500?text=Paket+Glamour+Premium+Bridal+Makeup+Bold+Eyeshadow+Gold+Tones',
    rating: 4.9,
    totalReview: 72,
    terlaris: true,
  },
  {
    id: 'p3',
    nama: 'Paket Royal Wedding',
    harga: 6500000,
    kategoriHarga: 'mahal',
    deskripsi: 'Paket pernikahan mewah lengkap dengan dekorasi dan tim profesional.',
    layanan: ['Makeup Pengantin Bold & Mewah', 'Hairdo Premium', 'Dekorasi Pelaminan Mewah', 'Riasan Tahan 14 Jam', 'Touch Up Full Day', 'Tim 3 MUA', 'Dokumentasi Foto Makeup', 'Konsultasi & Trial 2x'],
    kelengkapan: 'makeup_hairdo_dekorasi',
    kualitasMakeup: 'bold',
    pengalamanMUA: 'senior',
    estetikaDekorasi: 'mewah',
    foto: 'https://placehold.co/400x500?text=Paket+Royal+Wedding+Luxurious+Bridal+Makeup+Crown+Gold+Ornaments',
    rating: 5.0,
    totalReview: 45,
    terbaik: true,
  },
  {
    id: 'p4',
    nama: 'Paket Adat Jawa',
    harga: 4200000,
    kategoriHarga: 'sedang',
    deskripsi: 'Riasan pengantin adat Jawa yang otentik dengan sentuhan modern.',
    layanan: ['Makeup Pengantin Adat Jawa', 'Sanggul Tradisional', 'Perlengkapan Adat', 'Riasan Tahan 12 Jam', 'Konsultasi Adat', 'Asisten MUA'],
    kelengkapan: 'makeup_hairdo_dekorasi',
    kualitasMakeup: 'bold',
    pengalamanMUA: 'senior',
    estetikaDekorasi: 'adat',
    foto: 'https://placehold.co/400x500?text=Paket+Adat+Jawa+Traditional+Javanese+Bridal+Makeup+Kebaya+Gold',
    rating: 4.8,
    totalReview: 54,
  },
  {
    id: 'p5',
    nama: 'Paket Minimalist Chic',
    harga: 2200000,
    kategoriHarga: 'sedang',
    deskripsi: 'Makeup minimalis modern untuk pengantin yang menginginkan tampilan bersih dan elegan.',
    layanan: ['Makeup Natural Minimalis', 'Hairdo Modern', 'Riasan Tahan 10 Jam', 'Touch Up Set', 'Konsultasi Makeup'],
    kelengkapan: 'makeup_hairdo',
    kualitasMakeup: 'natural',
    pengalamanMUA: 'profesional',
    estetikaDekorasi: 'minimalis',
    foto: 'https://placehold.co/400x500?text=Paket+Minimalist+Chic+Modern+Clean+Bridal+Makeup+White+Soft',
    rating: 4.6,
    totalReview: 29,
  },
  {
    id: 'p6',
    nama: 'Paket Makeup Only Basic',
    harga: 800000,
    kategoriHarga: 'murah',
    deskripsi: 'Paket makeup saja tanpa hairdo, cocok untuk yang ingin riasan simpel.',
    layanan: ['Makeup Pengantin Natural', 'Riasan Tahan 8 Jam', 'Konsultasi Singkat'],
    kelengkapan: 'makeup_only',
    kualitasMakeup: 'natural',
    pengalamanMUA: 'berpengalaman',
    estetikaDekorasi: 'minimalis',
    foto: 'https://placehold.co/400x500?text=Paket+Basic+Makeup+Only+Simple+Bridal+Natural+Glow',
    rating: 4.5,
    totalReview: 21,
  },
  {
    id: 'p7',
    nama: 'Paket Glamour Full Day',
    harga: 5500000,
    kategoriHarga: 'mahal',
    deskripsi: 'Layanan full day dengan makeup glamour dan tim lengkap untuk hari spesial Anda.',
    layanan: ['Makeup Bold Glamour', 'Hairdo Mewah', 'Dekorasi Elegan', 'Riasan Tahan 14 Jam', 'Touch Up Full Day', 'Tim 2 MUA', 'Konsultasi & Trial Makeup'],
    kelengkapan: 'makeup_hairdo_dekorasi',
    kualitasMakeup: 'glamour',
    pengalamanMUA: 'senior',
    estetikaDekorasi: 'elegan',
    foto: 'https://placehold.co/400x500?text=Paket+Glamour+Full+Day+Bridal+Smokey+Eyes+Luxurious+Dress',
    rating: 4.9,
    totalReview: 63,
  },
  {
    id: 'p8',
    nama: 'Paket Adat Modern Fusion',
    harga: 3800000,
    kategoriHarga: 'sedang',
    deskripsi: 'Perpaduan riasan adat dan modern yang memukau untuk pengantin kekinian.',
    layanan: ['Makeup Fusion Adat-Modern', 'Sanggul Modern', 'Aksesoris Adat', 'Riasan Tahan 12 Jam', 'Touch Up Set', 'Konsultasi Tema'],
    kelengkapan: 'makeup_hairdo',
    kualitasMakeup: 'bold',
    pengalamanMUA: 'profesional',
    estetikaDekorasi: 'adat',
    foto: 'https://placehold.co/400x500?text=Paket+Adat+Modern+Fusion+Bridal+Traditional+Contemporary+Blend',
    rating: 4.7,
    totalReview: 41,
  },
]

// ============================================================
// MOCK GALERI
// ============================================================

export const GALERI_DATA: GaleriItem[] = [
  { id: 'g1', foto: 'https://placehold.co/400x500?text=Wedding+Bridal+Glamour+Makeup+Gold+Eyeshadow+Natural+Glow', kategori: 'Glamour', deskripsi: 'Riasan glamour untuk pengantin modern' },
  { id: 'g2', foto: 'https://placehold.co/400x500?text=Traditional+Javanese+Bridal+Makeup+Kebaya+Sanggul+Classic', kategori: 'Adat', deskripsi: 'Riasan adat Jawa yang autentik' },
  { id: 'g3', foto: 'https://placehold.co/400x500?text=Minimalist+Bridal+Makeup+Clean+Skin+Natural+Lips+Soft', kategori: 'Natural', deskripsi: 'Tampilan natural elegan' },
  { id: 'g4', foto: 'https://placehold.co/400x500?text=Bold+Dramatic+Bridal+Makeup+Smokey+Eyes+Red+Lips+Luxury', kategori: 'Bold', deskripsi: 'Riasan bold dramatis memukau' },
  { id: 'g5', foto: 'https://placehold.co/400x500?text=Elegant+Wedding+Makeup+Hairdo+Updo+Pearl+Accessories', kategori: 'Elegan', deskripsi: 'Hairdo eksklusif dengan aksesori' },
  { id: 'g6', foto: 'https://placehold.co/400x500?text=Royal+Bridal+Makeup+Crown+Ornaments+Mewah+Gold+Decorations', kategori: 'Mewah', deskripsi: 'Riasan royal dengan mahkota emas' },
  { id: 'g7', foto: 'https://placehold.co/400x500?text=Soft+Glam+Bridal+Makeup+Floral+Hairpin+Romantic+Pink', kategori: 'Glamour', deskripsi: 'Soft glam dengan sentuhan bunga' },
  { id: 'g8', foto: 'https://placehold.co/400x500?text=Modern+Bride+Minimalist+Makeup+Sleek+Bun+Contemporary', kategori: 'Natural', deskripsi: 'Bride modern minimalis kekinian' },
  { id: 'g9', foto: 'https://placehold.co/400x500?text=Sundanese+Traditional+Bridal+Siger+Crown+Red+Makeup', kategori: 'Adat', deskripsi: 'Riasan adat Sunda dengan siger' },
]

// ============================================================
// MOCK TESTIMONI
// ============================================================

export const TESTIMONI_DATA: Testimoni[] = [
  {
    id: 't1',
    nama: 'Sari Wulandari',
    paket: 'Paket Glamour Premium',
    rating: 5,
    komentar: 'Alhamdulillah sangat puas! MUA-nya sangat profesional, ramah, dan hasilnya luar biasa. Wajah saya terlihat memukau tapi tetap natural. Riasannya tahan dari pagi sampai malam. Terima kasih banyak!',
    tanggal: '2024-11-15',
    foto: 'https://placehold.co/60x60?text=SW',
  },
  {
    id: 't2',
    nama: 'Dewi Anggraeni',
    paket: 'Paket Royal Wedding',
    rating: 5,
    komentar: 'Luar biasa! Ini beneran dream wedding saya. Dekorasinya cantik banget, makeup awet seharian, dan tim MUA sangat sabar dan profesional. Worth every penny!',
    tanggal: '2024-10-28',
    foto: 'https://placehold.co/60x60?text=DA',
  },
  {
    id: 't3',
    nama: 'Rizki Amalia',
    paket: 'Paket Adat Jawa',
    rating: 5,
    komentar: 'Riasan adat Jawa-nya detail banget, autentik, dan sangat memuaskan. MUA-nya ngerti betul tentang tata rias tradisional. Orang tua saya juga sangat senang!',
    tanggal: '2024-12-02',
    foto: 'https://placehold.co/60x60?text=RA',
  },
  {
    id: 't4',
    nama: 'Putri Maharani',
    paket: 'Paket Minimalist Chic',
    rating: 4,
    komentar: 'Suka banget sama hasilnya yang clean dan natural. Cocok banget sama konsep pernikahan kami yang garden party. MUA-nya juga fast respon dan informatif.',
    tanggal: '2024-09-20',
    foto: 'https://placehold.co/60x60?text=PM',
  },
  {
    id: 't5',
    nama: 'Indah Pratiwi',
    paket: 'Paket Glamour Full Day',
    rating: 5,
    komentar: 'Full day service-nya really worth it! MUA standby dari pagi sampai malam, touch up terus terjaga, hasilnya konsisten. Highly recommended untuk yang mau pernikahan panjang!',
    tanggal: '2024-11-30',
    foto: 'https://placehold.co/60x60?text=IP',
  },
  {
    id: 't6',
    nama: 'Fitri Handayani',
    paket: 'Paket Cantik Natural',
    rating: 4,
    komentar: 'Harga terjangkau tapi kualitasnya tidak mengecewakan. Makeup-nya natural sesuai yang saya minta. Cocok untuk pernikahan backyard yang sederhana tapi berkesan.',
    tanggal: '2024-08-14',
    foto: 'https://placehold.co/60x60?text=FH',
  },
]

// ============================================================
// LOCALSTORAGE HELPERS
// ============================================================

const isBrowser = typeof window !== 'undefined'

export function getUsers(): User[] {
  if (!isBrowser) return []
  try {
    const data = localStorage.getItem('marcos_users')
    return data ? JSON.parse(data) : getDefaultUsers()
  } catch { return getDefaultUsers() }
}

function getDefaultUsers(): User[] {
  const defaults: User[] = [
    {
      id: 'admin1',
      nama: 'Admin Marcos',
      email: 'admin@marcos.com',
      noHp: '081234567890',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString(),
    }
  ]
  if (isBrowser) localStorage.setItem('marcos_users', JSON.stringify(defaults))
  return defaults
}

export function saveUsers(users: User[]) {
  if (!isBrowser) return
  localStorage.setItem('marcos_users', JSON.stringify(users))
}

export function getCurrentUser(): User | null {
  if (!isBrowser) return null
  try {
    const data = localStorage.getItem('marcos_current_user')
    return data ? JSON.parse(data) : null
  } catch { return null }
}

export function setCurrentUser(user: User | null) {
  if (!isBrowser) return
  if (user) localStorage.setItem('marcos_current_user', JSON.stringify(user))
  else localStorage.removeItem('marcos_current_user')
}

export function getBookings(): Booking[] {
  if (!isBrowser) return []
  try {
    const data = localStorage.getItem('marcos_bookings')
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

export function saveBookings(bookings: Booking[]) {
  if (!isBrowser) return
  localStorage.setItem('marcos_bookings', JSON.stringify(bookings))
}

export function addBooking(booking: Booking) {
  const bookings = getBookings()
  bookings.push(booking)
  saveBookings(bookings)
}

export function updateBooking(id: string, updates: Partial<Booking>) {
  const bookings = getBookings()
  const idx = bookings.findIndex(b => b.id === id)
  if (idx !== -1) {
    bookings[idx] = { ...bookings[idx], ...updates, updatedAt: new Date().toISOString() }
    saveBookings(bookings)
  }
}

export function getPaket(): PaketMakeup[] {
  if (!isBrowser) return PAKET_DATA
  try {
    const data = localStorage.getItem('marcos_paket')
    return data ? JSON.parse(data) : PAKET_DATA
  } catch { return PAKET_DATA }
}

export function savePaket(paket: PaketMakeup[]) {
  if (!isBrowser) return
  localStorage.setItem('marcos_paket', JSON.stringify(paket))
}

export function getGaleri(): GaleriItem[] {
  if (!isBrowser) return GALERI_DATA
  try {
    const data = localStorage.getItem('marcos_galeri')
    return data ? JSON.parse(data) : GALERI_DATA
  } catch { return GALERI_DATA }
}

export function saveGaleri(galeri: GaleriItem[]) {
  if (!isBrowser) return
  localStorage.setItem('marcos_galeri', JSON.stringify(galeri))
}

export function getTestimoni(): Testimoni[] {
  if (!isBrowser) return TESTIMONI_DATA
  try {
    const data = localStorage.getItem('marcos_testimoni')
    return data ? JSON.parse(data) : TESTIMONI_DATA
  } catch { return TESTIMONI_DATA }
}

export function saveTestimoni(testimoni: Testimoni[]) {
  if (!isBrowser) return
  localStorage.setItem('marcos_testimoni', JSON.stringify(testimoni))
}

// ============================================================
// FORMAT HELPERS
// ============================================================

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr))
}

export const STATUS_LABEL: Record<Booking['status'], string> = {
  menunggu_pembayaran: 'Menunggu Pembayaran',
  menunggu_konfirmasi: 'Menunggu Konfirmasi',
  dikonfirmasi: 'Dikonfirmasi',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
}

export const STATUS_COLOR: Record<Booking['status'], string> = {
  menunggu_pembayaran: 'bg-yellow-100 text-yellow-700',
  menunggu_konfirmasi: 'bg-blue-100 text-blue-700',
  dikonfirmasi: 'bg-green-100 text-green-700',
  selesai: 'bg-gray-100 text-gray-700',
  dibatalkan: 'bg-red-100 text-red-700',
}
