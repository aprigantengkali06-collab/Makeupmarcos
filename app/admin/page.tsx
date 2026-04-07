'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard, ShoppingBag, Package2, Images, MessageSquare,
  Users, LogOut, ArrowLeft, Menu, X, Plus, Pencil, Trash2,
  CheckCircle2, XCircle, Clock, Eye, ChevronRight,
  TrendingUp, Star, AlertCircle, Upload, Link, Loader2,
} from 'lucide-react'
import {
  getAllBookings, updateBooking, getAllCustomers,
  getCurrentUser, setCurrentUser,
} from '@/lib/db'
import {
  getPaket, savePaket,
  getGaleri, saveGaleri,
  getTestimoni, saveTestimoni,
  formatRupiah, formatDate,
  STATUS_LABEL, STATUS_COLOR,
  PAKET_DATA,
} from '@/lib/data'
import type { Booking, PaketMakeup, User, GaleriItem, Testimoni } from '@/lib/data'

type Tab = 'overview' | 'pesanan' | 'paket' | 'galeri' | 'testimoni' | 'customer'

// ─── Paket Form Initial State ────────────────────────────────────────────────
const EMPTY_PAKET: Omit<PaketMakeup, 'id'> = {
  nama: '',
  harga: 0,
  kategoriHarga: 'sedang',
  deskripsi: '',
  layanan: [],
  kelengkapan: 'makeup_hairdo',
  kualitasMakeup: 'natural',
  pengalamanMUA: 'profesional',
  estetikaDekorasi: 'minimalis',
  foto: 'https://placehold.co/400x500?text=Foto+Paket+Makeup+Wedding+Bridal',
  rating: 4.8,
  totalReview: 0,
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [bookings, setBookings] = useState<Booking[]>([])
  const [paketList, setPaketList] = useState<PaketMakeup[]>([])
  const [galeriList, setGaleriList] = useState<GaleriItem[]>([])
  const [testimoniList, setTestimoniList] = useState<Testimoni[]>([])
  const [customerList, setCustomerList] = useState<User[]>([])

  // Paket form state
  const [showPaketForm, setShowPaketForm] = useState(false)
  const [editPaket, setEditPaket] = useState<PaketMakeup | null>(null)
  const [paketForm, setPaketForm] = useState<Omit<PaketMakeup, 'id'>>(EMPTY_PAKET)
  const [layananInput, setLayananInput] = useState('')

  // Galeri form state
  const [showGaleriForm, setShowGaleriForm] = useState(false)
  const [galeriForm, setGaleriForm] = useState({ foto: '', kategori: '', deskripsi: '' })
  const [galeriUploadMode, setGaleriUploadMode] = useState<'url' | 'file'>('url')
  const [galeriUploading, setGaleriUploading] = useState(false)

  // Paket upload mode
  const [paketUploadMode, setPaketUploadMode] = useState<'url' | 'file'>('url')
  const [paketUploading, setPaketUploading] = useState(false)

  // Detail pesanan modal
  const [detailBooking, setDetailBooking] = useState<Booking | null>(null)

  // Filter pesanan
  const [filterStatus, setFilterStatus] = useState<string>('semua')

  useEffect(() => {
    getAllBookings().then(b => setBookings(b))
    getAllCustomers().then(c => setCustomerList(c))
    setPaketList(getPaket())
    setGaleriList(getGaleri())
    setTestimoniList(getTestimoni())
  }, [])

  // ─── Helper: baca file jadi base64 data URL ─────────────────────────────────
  const readFileAsBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  const handleGaleriFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setGaleriUploading(true)
    try {
      const base64 = await readFileAsBase64(file)
      setGaleriForm(p => ({ ...p, foto: base64 }))
    } catch {
      alert('Gagal membaca file. Coba lagi.')
    } finally {
      setGaleriUploading(false)
    }
  }

  const handlePaketFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPaketUploading(true)
    try {
      const base64 = await readFileAsBase64(file)
      setPaketForm(p => ({ ...p, foto: base64 }))
    } catch {
      alert('Gagal membaca file. Coba lagi.')
    } finally {
      setPaketUploading(false)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    window.location.href = '/'
  }

  // ─── Pesanan handlers ───────────────────────────────────────────────────────
  const handleKonfirmasi = async (id: string) => {
    await updateBooking(id, { status: 'dikonfirmasi' })
    const fresh = await getAllBookings()
    setBookings(fresh)
    if (detailBooking?.id === id) setDetailBooking(b => b ? { ...b, status: 'dikonfirmasi' } : null)
  }

  const handleSelesai = async (id: string) => {
    await updateBooking(id, { status: 'selesai' })
    const fresh = await getAllBookings()
    setBookings(fresh)
    if (detailBooking?.id === id) setDetailBooking(b => b ? { ...b, status: 'selesai' } : null)
  }

  const handleTolak = async (id: string) => {
    await updateBooking(id, { status: 'dibatalkan' })
    const fresh = await getAllBookings()
    setBookings(fresh)
    if (detailBooking?.id === id) setDetailBooking(b => b ? { ...b, status: 'dibatalkan' } : null)
  }

  // ─── Paket handlers ─────────────────────────────────────────────────────────
  const openAddPaket = () => {
    setEditPaket(null)
    setPaketForm(EMPTY_PAKET)
    setLayananInput('')
    setPaketUploadMode('url')
    setShowPaketForm(true)
  }

  const openEditPaket = (p: PaketMakeup) => {
    setEditPaket(p)
    const { id, ...rest } = p
    setPaketForm(rest)
    setLayananInput(p.layanan.join('\n'))
    // Jika foto adalah base64, set ke mode file; jika URL, set ke mode url
    setPaketUploadMode(p.foto.startsWith('data:') ? 'file' : 'url')
    setShowPaketForm(true)
  }

  const handleSavePaket = (e: React.FormEvent) => {
    e.preventDefault()
    const layanan = layananInput.split('\n').map(l => l.trim()).filter(Boolean)
    const updated = { ...paketForm, layanan }
    const all = getPaket()
    if (editPaket) {
      const newList = all.map(p => p.id === editPaket.id ? { ...updated, id: editPaket.id } : p)
      savePaket(newList)
      setPaketList(newList)
    } else {
      const newPaket: PaketMakeup = { ...updated, id: `p${Date.now()}` }
      const newList = [...all, newPaket]
      savePaket(newList)
      setPaketList(newList)
    }
    setShowPaketForm(false)
  }

  const handleDeletePaket = (id: string) => {
    if (!confirm('Hapus paket ini?')) return
    const newList = getPaket().filter(p => p.id !== id)
    savePaket(newList)
    setPaketList(newList)
  }

  const handleResetPaket = () => {
    if (!confirm('Reset ke data paket default?')) return
    savePaket(PAKET_DATA)
    setPaketList(PAKET_DATA)
  }

  // ─── Galeri handlers ────────────────────────────────────────────────────────
  const handleAddGaleri = (e: React.FormEvent) => {
    e.preventDefault()
    if (!galeriForm.foto) {
      alert('Foto belum dipilih atau URL belum diisi.')
      return
    }
    const newItem: GaleriItem = { id: `g${Date.now()}`, ...galeriForm }
    const newList = [...getGaleri(), newItem]
    saveGaleri(newList)
    setGaleriList(newList)
    setGaleriForm({ foto: '', kategori: '', deskripsi: '' })
    setGaleriUploadMode('url')
    setShowGaleriForm(false)
  }

  const handleDeleteGaleri = (id: string) => {
    if (!confirm('Hapus foto ini dari galeri?')) return
    const newList = getGaleri().filter(g => g.id !== id)
    saveGaleri(newList)
    setGaleriList(newList)
  }

  // ─── Testimoni handlers ─────────────────────────────────────────────────────
  const handleDeleteTestimoni = (id: string) => {
    if (!confirm('Hapus testimoni ini?')) return
    const newList = getTestimoni().filter(t => t.id !== id)
    saveTestimoni(newList)
    setTestimoniList(newList)
  }

  // ─── Computed stats ─────────────────────────────────────────────────────────
  const totalRevenue = bookings
    .filter(b => b.status === 'dikonfirmasi' || b.status === 'selesai')
    .reduce((sum, b) => sum + b.paketHarga, 0)

  const pendingCount = bookings.filter(b => b.status === 'menunggu_konfirmasi').length
  const filteredBookings = filterStatus === 'semua'
    ? bookings
    : bookings.filter(b => b.status === filterStatus)

  const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'pesanan', label: 'Kelola Pesanan', icon: <ShoppingBag size={18} />, badge: pendingCount || undefined },
    { id: 'paket', label: 'Kelola Paket', icon: <Package2 size={18} /> },
    { id: 'galeri', label: 'Kelola Galeri', icon: <Images size={18} /> },
    { id: 'testimoni', label: 'Kelola Testimoni', icon: <MessageSquare size={18} /> },
    { id: 'customer', label: 'Data Customer', icon: <Users size={18} /> },
  ]

  return (
    <div className="min-h-screen bg-muted/20 flex">

      {/* ─── SIDEBAR ─────────────────────────────────────────────────────── */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="px-5 py-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-serif font-bold text-primary">MARCOS</span>
            <span className="text-xs text-muted-foreground tracking-widest uppercase">Admin</span>
          </Link>
        </div>

        <div className="px-5 py-3 border-b border-border bg-primary/5">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide">Panel Administrator</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setSidebarOpen(false) }}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                tab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground/70 hover:bg-muted hover:text-foreground'
              }`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${tab === item.id ? 'bg-white/20 text-white' : 'bg-destructive/10 text-destructive'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-border flex flex-col gap-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:bg-muted transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <ArrowLeft size={18} />
            Lihat Website
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/5 transition-colors"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ─── MAIN ────────────────────────────────────────────────────────── */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-border px-4 sm:px-6 py-4 flex items-center gap-4">
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-muted" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex-1">
            <h1 className="font-serif font-semibold text-lg leading-none">
              {NAV_ITEMS.find(n => n.id === tab)?.label}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">Dashboard Administrator MARCOS MUA</p>
          </div>
          {pendingCount > 0 && (
            <button
              onClick={() => setTab('pesanan')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors"
            >
              <AlertCircle size={13} />
              {pendingCount} pesanan menunggu konfirmasi
            </button>
          )}
        </header>

        <div className="flex-1 p-4 sm:p-6">

          {/* ═══════════ OVERVIEW ═══════════ */}
          {tab === 'overview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Pesanan', value: bookings.length, icon: <ShoppingBag size={20} />, color: 'text-blue-600 bg-blue-50', sub: 'semua status' },
                  { label: 'Menunggu Konfirmasi', value: pendingCount, icon: <Clock size={20} />, color: 'text-amber-600 bg-amber-50', sub: 'perlu diproses' },
                  { label: 'Total Paket', value: paketList.length, icon: <Package2 size={20} />, color: 'text-primary bg-primary/10', sub: 'aktif tersedia' },
                  { label: 'Total Revenue', value: formatRupiah(totalRevenue), icon: <TrendingUp size={20} />, color: 'text-green-600 bg-green-50', sub: 'terkonfirmasi' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white rounded-2xl border border-border p-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <p className="text-xl font-bold leading-tight">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Alert */}
              {pendingCount > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                  <AlertCircle size={20} className="text-amber-600 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-800">Ada {pendingCount} pesanan menunggu konfirmasi</p>
                    <p className="text-xs text-amber-700 mt-0.5">Segera proses untuk memberikan pengalaman terbaik kepada customer.</p>
                  </div>
                  <button
                    onClick={() => setTab('pesanan')}
                    className="px-3 py-1.5 bg-amber-600 text-white rounded-full text-xs font-medium hover:bg-amber-700 transition-colors shrink-0"
                  >
                    Proses Sekarang
                  </button>
                </div>
              )}

              {/* Recent Bookings */}
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-semibold text-sm">Pesanan Terbaru</h2>
                  <button onClick={() => setTab('pesanan')} className="text-xs text-primary hover:underline flex items-center gap-1">
                    Lihat Semua <ChevronRight size={12} />
                  </button>
                </div>
                {bookings.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <ShoppingBag size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Belum ada pesanan masuk</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {[...bookings]
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 5)
                      .map(b => (
                        <div key={b.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{b.customerNama}</p>
                            <p className="text-xs text-muted-foreground truncate">{b.paketNama} — {formatDate(b.tanggalAcara)}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLOR[b.status]}`}>
                              {STATUS_LABEL[b.status]}
                            </span>
                            <p className="text-xs text-muted-foreground mt-1">{formatRupiah(b.paketHarga)}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Tambah Paket', icon: <Plus size={18} />, action: () => { setTab('paket'); setTimeout(openAddPaket, 100) } },
                  { label: 'Tambah Galeri', icon: <Images size={18} />, action: () => { setTab('galeri'); setShowGaleriForm(true) } },
                  { label: 'Lihat Customer', icon: <Users size={18} />, action: () => setTab('customer') },
                  { label: 'Lihat Testimoni', icon: <Star size={18} />, action: () => setTab('testimoni') },
                ].map(qa => (
                  <button
                    key={qa.label}
                    onClick={qa.action}
                    className="flex flex-col items-center gap-2 py-5 bg-white rounded-2xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-sm font-medium"
                  >
                    <span className="text-primary">{qa.icon}</span>
                    {qa.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════ PESANAN ═══════════ */}
          {tab === 'pesanan' && (
            <div className="space-y-4">
              {/* Filter */}
              <div className="flex flex-wrap gap-2">
                {[
                  { val: 'semua', label: 'Semua' },
                  { val: 'menunggu_pembayaran', label: 'Menunggu Bayar' },
                  { val: 'menunggu_konfirmasi', label: 'Menunggu Konfirmasi' },
                  { val: 'dikonfirmasi', label: 'Dikonfirmasi' },
                  { val: 'selesai', label: 'Selesai' },
                  { val: 'dibatalkan', label: 'Dibatalkan' },
                ].map(f => (
                  <button
                    key={f.val}
                    onClick={() => setFilterStatus(f.val)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      filterStatus === f.val
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-white border-border hover:border-primary/40'
                    }`}
                  >
                    {f.label}
                    {f.val !== 'semua' && (
                      <span className="ml-1 opacity-70">
                        ({bookings.filter(b => b.status === f.val).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {filteredBookings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border py-16 text-center text-muted-foreground">
                  <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-medium">Tidak ada pesanan</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...filteredBookings]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map(b => (
                      <div key={b.id} className="bg-white rounded-2xl border border-border overflow-hidden">
                        <div className="px-5 py-4 flex flex-wrap items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-semibold text-sm">{b.customerNama}</p>
                              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_COLOR[b.status]}`}>
                                {STATUS_LABEL[b.status]}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{b.paketNama} — <span className="font-semibold text-foreground">{formatRupiah(b.paketHarga)}</span></p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Acara: {formatDate(b.tanggalAcara)} | Lokasi: {b.lokasiAcara}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              HP: {b.customerHp} | Email: {b.customerEmail}
                            </p>
                            <p className="text-xs text-muted-foreground/60 mt-1">ID: {b.id} | Booking: {formatDate(b.createdAt)}</p>
                          </div>

                          <div className="flex flex-col gap-2 shrink-0">
                            <button
                              onClick={() => setDetailBooking(b)}
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs hover:bg-muted transition-colors"
                            >
                              <Eye size={12} /> Detail
                            </button>
                            {b.status === 'menunggu_konfirmasi' && (
                              <>
                                <button
                                  onClick={() => handleKonfirmasi(b.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition-colors"
                                >
                                  <CheckCircle2 size={12} /> Konfirmasi
                                </button>
                                <button
                                  onClick={() => handleTolak(b.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive text-white rounded-lg text-xs hover:bg-destructive/90 transition-colors"
                                >
                                  <XCircle size={12} /> Tolak
                                </button>
                              </>
                            )}
                            {b.status === 'dikonfirmasi' && (
                              <button
                                onClick={() => handleSelesai(b.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors"
                              >
                                <CheckCircle2 size={12} /> Selesai
                              </button>
                            )}
                          </div>
                        </div>

                        {b.buktiPembayaran && (
                          <div className="px-5 pb-3">
                            <span className="text-xs px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full">
                              Bukti bayar telah diupload: {b.buktiPembayaran}
                            </span>
                          </div>
                        )}
                        {b.catatan && (
                          <div className="px-5 pb-3">
                            <p className="text-xs text-muted-foreground italic">Catatan: {b.catatan}</p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════ PAKET ═══════════ */}
          {tab === 'paket' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{paketList.length} paket tersedia</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleResetPaket}
                    className="px-3 py-2 border border-border rounded-xl text-xs hover:bg-muted transition-colors"
                  >
                    Reset Default
                  </button>
                  <button
                    onClick={openAddPaket}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Plus size={15} /> Tambah Paket
                  </button>
                </div>
              </div>

              {/* Paket Form Modal */}
              {showPaketForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPaketForm(false)} />
                  <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                      <h3 className="font-serif font-semibold text-lg">
                        {editPaket ? 'Edit Paket' : 'Tambah Paket Baru'}
                      </h3>
                      <button onClick={() => setShowPaketForm(false)} className="p-1 rounded-full hover:bg-muted">
                        <X size={18} />
                      </button>
                    </div>
                    <form onSubmit={handleSavePaket} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Nama Paket</label>
                        <input
                          required
                          value={paketForm.nama}
                          onChange={e => setPaketForm(p => ({ ...p, nama: e.target.value }))}
                          placeholder="Paket Glamour Premium"
                          className="w-full px-4 py-2.5 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Harga (Rp)</label>
                        <input
                          required
                          type="number"
                          min={0}
                          value={paketForm.harga}
                          onChange={e => setPaketForm(p => ({ ...p, harga: Number(e.target.value) }))}
                          className="w-full px-4 py-2.5 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Kategori Harga</label>
                        <select
                          value={paketForm.kategoriHarga}
                          onChange={e => setPaketForm(p => ({ ...p, kategoriHarga: e.target.value as PaketMakeup['kategoriHarga'] }))}
                          className="w-full px-4 py-2.5 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
                        >
                          <option value="murah">Murah (di bawah Rp 2 jt)</option>
                          <option value="sedang">Sedang (Rp 2–5 jt)</option>
                          <option value="mahal">Mahal (di atas Rp 5 jt)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Kualitas Makeup</label>
                        <select
                          value={paketForm.kualitasMakeup}
                          onChange={e => setPaketForm(p => ({ ...p, kualitasMakeup: e.target.value as PaketMakeup['kualitasMakeup'] }))}
                          className="w-full px-4 py-2.5 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
                        >
                          <option value="natural">Natural</option>
                          <option value="glamour">Glamour</option>
                          <option value="bold">Bold</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Kelengkapan</label>
                        <select
                          value={paketForm.kelengkapan}
                          onChange={e => setPaketForm(p => ({ ...p, kelengkapan: e.target.value as PaketMakeup['kelengkapan'] }))}
                          className="w-full px-4 py-2.5 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
                        >
                          <option value="makeup_only">Makeup Only</option>
                          <option value="makeup_hairdo">Makeup + Hairdo</option>
                          <option value="makeup_hairdo_dekorasi">Makeup + Hairdo + Dekorasi</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Pengalaman MUA</label>
                        <select
                          value={paketForm.pengalamanMUA}
                          onChange={e => setPaketForm(p => ({ ...p, pengalamanMUA: e.target.value as PaketMakeup['pengalamanMUA'] }))}
                          className="w-full px-4 py-2.5 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
                        >
                          <option value="berpengalaman">Berpengalaman (3–5 thn)</option>
                          <option value="profesional">Profesional (5–10 thn)</option>
                          <option value="senior">Senior (10+ thn)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Estetika Dekorasi</label>
                        <select
                          value={paketForm.estetikaDekorasi}
                          onChange={e => setPaketForm(p => ({ ...p, estetikaDekorasi: e.target.value as PaketMakeup['estetikaDekorasi'] }))}
                          className="w-full px-4 py-2.5 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
                        >
                          <option value="minimalis">Minimalis</option>
                          <option value="elegan">Elegan</option>
                          <option value="mewah">Mewah</option>
                          <option value="adat">Adat</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Rating</label>
                        <input
                          type="number"
                          min={1} max={5} step={0.1}
                          value={paketForm.rating}
                          onChange={e => setPaketForm(p => ({ ...p, rating: Number(e.target.value) }))}
                          className="w-full px-4 py-2.5 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Foto Paket</label>
                        {/* Toggle mode */}
                        <div className="flex rounded-lg border border-input overflow-hidden mb-2.5">
                          <button
                            type="button"
                            onClick={() => setPaketUploadMode('url')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${paketUploadMode === 'url' ? 'bg-primary text-primary-foreground' : 'bg-white hover:bg-muted'}`}
                          >
                            <Link size={12} /> URL Link
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaketUploadMode('file')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${paketUploadMode === 'file' ? 'bg-primary text-primary-foreground' : 'bg-white hover:bg-muted'}`}
                          >
                            <Upload size={12} /> Upload File
                          </button>
                        </div>

                        {paketUploadMode === 'url' ? (
                          <input
                            value={paketForm.foto.startsWith('data:') ? '' : paketForm.foto}
                            onChange={e => setPaketForm(p => ({ ...p, foto: e.target.value }))}
                            placeholder="https://placehold.co/400x500?text=..."
                            className="w-full px-4 py-2.5 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        ) : (
                          <div className="space-y-2">
                            <label className={`flex flex-col items-center justify-center gap-2 w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${paketUploading ? 'opacity-60 cursor-not-allowed border-muted' : 'border-primary/40 hover:bg-primary/5 hover:border-primary/60'}`}>
                              {paketUploading ? (
                                <>
                                  <Loader2 size={22} className="animate-spin text-primary" />
                                  <span className="text-xs text-muted-foreground">Memuat foto...</span>
                                </>
                              ) : paketForm.foto.startsWith('data:') ? (
                                <>
                                  <CheckCircle2 size={22} className="text-green-600" />
                                  <span className="text-xs text-green-700 font-medium">Foto berhasil dimuat</span>
                                  <span className="text-xs text-muted-foreground">Klik untuk ganti</span>
                                </>
                              ) : (
                                <>
                                  <Upload size={22} className="text-primary/60" />
                                  <span className="text-xs text-muted-foreground">Klik untuk pilih foto dari perangkat</span>
                                  <span className="text-xs text-muted-foreground/60">JPG, PNG, WEBP — maks. 5 MB</span>
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                disabled={paketUploading}
                                onChange={handlePaketFileChange}
                                className="sr-only"
                              />
                            </label>
                            {/* Preview */}
                            {paketForm.foto.startsWith('data:') && (
                              <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border">
                                <img src={paketForm.foto} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setPaketForm(p => ({ ...p, foto: EMPTY_PAKET.foto }))}
                                  className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Deskripsi</label>
                        <textarea
                          rows={2}
                          value={paketForm.deskripsi}
                          onChange={e => setPaketForm(p => ({ ...p, deskripsi: e.target.value }))}
                          className="w-full px-4 py-2.5 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                          Daftar Layanan <span className="font-normal text-muted-foreground">(satu per baris)</span>
                        </label>
                        <textarea
                          rows={5}
                          value={layananInput}
                          onChange={e => setLayananInput(e.target.value)}
                          placeholder={"Makeup Pengantin Glamour\nHairdo Eksklusif\nRiasan Tahan 12 Jam"}
                          className="w-full px-4 py-2.5 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2 flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowPaketForm(false)}
                          className="flex-1 py-3 border border-border rounded-xl text-sm"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                        >
                          {editPaket ? 'Simpan Perubahan' : 'Tambah Paket'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Paket List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paketList.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl border border-border overflow-hidden">
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={p.foto}
                        alt={`Foto paket ${p.nama}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <span className="text-xs px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white rounded-full">
                          {p.kategoriHarga}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="font-serif font-semibold text-sm mb-0.5 leading-tight">{p.nama}</p>
                      <p className="text-base font-bold text-primary">{formatRupiah(p.harga)}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{p.deskripsi}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium">{p.rating}</span>
                        <span className="text-xs text-muted-foreground">({p.totalReview})</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => openEditPaket(p)}
                          className="flex-1 flex items-center justify-center gap-1 py-2 border border-border rounded-lg text-xs hover:bg-muted transition-colors"
                        >
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeletePaket(p.id)}
                          className="flex-1 flex items-center justify-center gap-1 py-2 border border-destructive/30 text-destructive rounded-lg text-xs hover:bg-destructive/5 transition-colors"
                        >
                          <Trash2 size={12} /> Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════ GALERI ═══════════ */}
          {tab === 'galeri' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{galeriList.length} foto di galeri</p>
                <button
                  onClick={() => setShowGaleriForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Plus size={15} /> Tambah Foto
                </button>
              </div>

              {/* Add Galeri Modal */}
              {showGaleriForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowGaleriForm(false); setGaleriUploadMode('url'); setGaleriForm({ foto: '', kategori: '', deskripsi: '' }) }} />
                  <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                      <h3 className="font-serif font-semibold text-lg">Tambah Foto Galeri</h3>
                      <button onClick={() => { setShowGaleriForm(false); setGaleriUploadMode('url'); setGaleriForm({ foto: '', kategori: '', deskripsi: '' }) }} className="p-1 rounded-full hover:bg-muted">
                        <X size={18} />
                      </button>
                    </div>
                    <form onSubmit={handleAddGaleri} className="p-6 flex flex-col gap-4">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Foto</label>
                        {/* Toggle mode */}
                        <div className="flex rounded-lg border border-input overflow-hidden mb-2.5">
                          <button
                            type="button"
                            onClick={() => { setGaleriUploadMode('url'); setGaleriForm(p => ({ ...p, foto: '' })) }}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${galeriUploadMode === 'url' ? 'bg-primary text-primary-foreground' : 'bg-white hover:bg-muted'}`}
                          >
                            <Link size={12} /> URL Link
                          </button>
                          <button
                            type="button"
                            onClick={() => { setGaleriUploadMode('file'); setGaleriForm(p => ({ ...p, foto: '' })) }}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${galeriUploadMode === 'file' ? 'bg-primary text-primary-foreground' : 'bg-white hover:bg-muted'}`}
                          >
                            <Upload size={12} /> Upload File
                          </button>
                        </div>

                        {galeriUploadMode === 'url' ? (
                          <input
                            required
                            value={galeriForm.foto}
                            onChange={e => setGaleriForm(p => ({ ...p, foto: e.target.value }))}
                            placeholder="https://placehold.co/400x500?text=..."
                            className="w-full px-4 py-2.5 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        ) : (
                          <div className="space-y-2">
                            <label className={`flex flex-col items-center justify-center gap-2 w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${galeriUploading ? 'opacity-60 cursor-not-allowed border-muted' : 'border-primary/40 hover:bg-primary/5 hover:border-primary/60'}`}>
                              {galeriUploading ? (
                                <>
                                  <Loader2 size={22} className="animate-spin text-primary" />
                                  <span className="text-xs text-muted-foreground">Memuat foto...</span>
                                </>
                              ) : galeriForm.foto.startsWith('data:') ? (
                                <>
                                  <CheckCircle2 size={22} className="text-green-600" />
                                  <span className="text-xs text-green-700 font-medium">Foto berhasil dimuat</span>
                                  <span className="text-xs text-muted-foreground">Klik untuk ganti</span>
                                </>
                              ) : (
                                <>
                                  <Upload size={22} className="text-primary/60" />
                                  <span className="text-xs text-muted-foreground">Klik untuk pilih foto dari perangkat</span>
                                  <span className="text-xs text-muted-foreground/60">JPG, PNG, WEBP — maks. 5 MB</span>
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                disabled={galeriUploading}
                                onChange={handleGaleriFileChange}
                                className="sr-only"
                              />
                            </label>
                            {/* Preview */}
                            {galeriForm.foto.startsWith('data:') && (
                              <div className="relative w-full h-36 rounded-xl overflow-hidden border border-border">
                                <img src={galeriForm.foto} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setGaleriForm(p => ({ ...p, foto: '' }))}
                                  className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Kategori</label>
                        <select
                          value={galeriForm.kategori}
                          onChange={e => setGaleriForm(p => ({ ...p, kategori: e.target.value }))}
                          className="w-full px-4 py-2.5 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
                        >
                          <option value="">Pilih kategori...</option>
                          {['Natural', 'Glamour', 'Bold', 'Elegan', 'Mewah', 'Adat'].map(k => (
                            <option key={k} value={k}>{k}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Deskripsi</label>
                        <input
                          required
                          value={galeriForm.deskripsi}
                          onChange={e => setGaleriForm(p => ({ ...p, deskripsi: e.target.value }))}
                          placeholder="Riasan glamour pengantin modern"
                          className="w-full px-4 py-2.5 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div className="flex gap-3 pt-1">
                        <button type="button" onClick={() => { setShowGaleriForm(false); setGaleriUploadMode('url'); setGaleriForm({ foto: '', kategori: '', deskripsi: '' }) }} className="flex-1 py-3 border border-border rounded-xl text-sm">
                          Batal
                        </button>
                        <button type="submit" disabled={galeriUploading} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                          Tambah Foto
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Galeri Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {galeriList.map(g => (
                  <div key={g.id} className="relative group rounded-2xl overflow-hidden border border-border">
                    <img
                      src={g.foto}
                      alt={`Galeri: ${g.deskripsi}`}
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                      <div className="w-full translate-y-full group-hover:translate-y-0 transition-transform p-3 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-white font-medium">{g.kategori}</p>
                          <p className="text-xs text-white/80 line-clamp-1">{g.deskripsi}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteGaleri(g.id)}
                          className="p-1.5 bg-destructive/90 text-white rounded-lg hover:bg-destructive transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════ TESTIMONI ═══════════ */}
          {tab === 'testimoni' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{testimoniList.length} testimoni tersimpan</p>
              {testimoniList.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border py-16 text-center text-muted-foreground">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-medium">Belum ada testimoni</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimoniList.map(t => (
                    <div key={t.id} className="bg-white rounded-2xl border border-border p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <img
                          src={t.foto}
                          alt={`Foto ${t.nama}`}
                          className="w-10 h-10 rounded-full object-cover border-2 border-primary/20 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{t.nama}</p>
                          <p className="text-xs text-primary">{t.paket}</p>
                          <div className="flex mt-1">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} size={11} className={s <= t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTestimoni(t.id)}
                          className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground italic leading-relaxed line-clamp-3">
                        &ldquo;{t.komentar}&rdquo;
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-2">{formatDate(t.tanggal)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════ CUSTOMER ═══════════ */}
          {tab === 'customer' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{customerList.length} customer terdaftar</p>
              {customerList.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border py-16 text-center text-muted-foreground">
                  <Users size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-medium">Belum ada customer terdaftar</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/30">
                          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nama</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">No. HP</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pesanan</th>
                          <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Daftar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {customerList.map(c => {
                          const customerBookings = bookings.filter(b => b.customerId === c.id)
                          return (
                            <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <span className="text-xs font-bold text-primary">
                                      {c.nama.substring(0, 2).toUpperCase()}
                                    </span>
                                  </div>
                                  <span className="font-medium">{c.nama}</span>
                                </div>
                              </td>
                              <td className="px-5 py-3.5 text-muted-foreground">{c.email}</td>
                              <td className="px-5 py-3.5 text-muted-foreground">{c.noHp}</td>
                              <td className="px-5 py-3.5">
                                <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                                  {customerBookings.length} pesanan
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-muted-foreground text-xs">
                                {formatDate(c.createdAt)}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ─── DETAIL BOOKING MODAL ─────────────────────────────────────────── */}
      {detailBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDetailBooking(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-serif font-semibold text-lg">Detail Pesanan</h3>
              <button onClick={() => setDetailBooking(null)} className="p-1 rounded-full hover:bg-muted">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLOR[detailBooking.status]}`}>
                  {STATUS_LABEL[detailBooking.status]}
                </span>
                <span className="text-xs text-muted-foreground">ID: {detailBooking.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Nama Customer', value: detailBooking.customerNama },
                  { label: 'Email', value: detailBooking.customerEmail },
                  { label: 'No. HP', value: detailBooking.customerHp },
                  { label: 'Paket', value: detailBooking.paketNama },
                  { label: 'Total Harga', value: formatRupiah(detailBooking.paketHarga) },
                  { label: 'Tanggal Acara', value: formatDate(detailBooking.tanggalAcara) },
                  { label: 'Lokasi', value: detailBooking.lokasiAcara },
                  { label: 'Tanggal Booking', value: formatDate(detailBooking.createdAt) },
                ].map(row => (
                  <div key={row.label} className={`bg-muted rounded-xl px-4 py-3 ${row.label === 'Lokasi' ? 'col-span-2' : ''}`}>
                    <p className="text-xs text-muted-foreground mb-0.5">{row.label}</p>
                    <p className="text-sm font-semibold">{row.value}</p>
                  </div>
                ))}
                {detailBooking.catatan && (
                  <div className="col-span-2 bg-muted rounded-xl px-4 py-3">
                    <p className="text-xs text-muted-foreground mb-0.5">Catatan</p>
                    <p className="text-sm">{detailBooking.catatan}</p>
                  </div>
                )}
                {detailBooking.buktiPembayaran && (
                  <div className="col-span-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <p className="text-xs text-green-600 mb-0.5">Bukti Pembayaran</p>
                    <p className="text-sm font-medium text-green-700">{detailBooking.buktiPembayaran}</p>
                  </div>
                )}
              </div>

              {/* Action buttons in modal */}
              <div className="flex gap-2 pt-2">
                {detailBooking.status === 'menunggu_konfirmasi' && (
                  <>
                    <button
                      onClick={() => handleKonfirmasi(detailBooking.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle2 size={15} /> Konfirmasi
                    </button>
                    <button
                      onClick={() => { handleTolak(detailBooking.id); setDetailBooking(null) }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-destructive text-white rounded-xl text-sm font-medium hover:bg-destructive/90 transition-colors"
                    >
                      <XCircle size={15} /> Tolak
                    </button>
                  </>
                )}
                {detailBooking.status === 'dikonfirmasi' && (
                  <button
                    onClick={() => handleSelesai(detailBooking.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <CheckCircle2 size={15} /> Tandai Selesai
                  </button>
                )}
                <button
                  onClick={() => setDetailBooking(null)}
                  className="flex-1 py-3 border border-border rounded-xl text-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
