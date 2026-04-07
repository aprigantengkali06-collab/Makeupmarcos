'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard, CalendarDays, ShoppingBag, MessageSquare,
  LogOut, ChevronRight, Star, CheckCircle2, Clock, XCircle,
  Package2, Upload, Phone, Mail, User as UserIcon, ArrowLeft,
  AlertCircle, PlusCircle, Menu, X
} from 'lucide-react'
import {
  getCurrentUser, setCurrentUser,
  getBookingsByCustomer, updateBooking, addBooking,
} from '@/lib/db'
import {
  getPaket, saveTestimoni, getTestimoni,
  formatRupiah, formatDate, STATUS_LABEL, STATUS_COLOR
} from '@/lib/data'
import type { User, Booking, PaketMakeup, Testimoni } from '@/lib/data'

type Tab = 'overview' | 'riwayat' | 'booking' | 'testimoni'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [tab, setTab] = useState<Tab>('overview')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [paketList, setPaketList] = useState<PaketMakeup[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Booking form
  const [bookingForm, setBookingForm] = useState({
    paketId: '',
    tanggalAcara: '',
    lokasiAcara: '',
    catatan: '',
  })
  const [bookingStep, setBookingStep] = useState(1)
  const [activeBookingId, setActiveBookingId] = useState('')
  const [buktiFile, setBuktiFile] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  // Testimoni form
  const [testimoniForm, setTestimoniForm] = useState({
    bookingId: '',
    rating: 5,
    komentar: '',
  })
  const [testimoniSuccess, setTestimoniSuccess] = useState(false)

  // Upload bukti for existing booking
  const [uploadBookingId, setUploadBookingId] = useState<string | null>(null)
  const [uploadFile, setUploadFile] = useState('')

  useEffect(() => {
    const u = getCurrentUser()
    if (!u || u.role !== 'customer') {
      window.location.href = '/'
      return
    }
    setUser(u)
    getBookingsByCustomer(u.id).then(b => setBookings(b))
    setPaketList(getPaket())
    setLoading(false)
  }, [])

  const refreshBookings = async () => {
    if (!user) return
    const updated = await getBookingsByCustomer(user.id)
    setBookings(updated)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    window.location.href = '/'
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setBookingLoading(true)
    const selectedPaket = paketList.find(p => p.id === bookingForm.paketId)
    if (!selectedPaket) return
    const id = `BK${Date.now()}`
    await addBooking({
      id,
      customerId: user.id,
      customerNama: user.nama,
      customerEmail: user.email,
      customerHp: user.noHp,
      paketId: selectedPaket.id,
      paketNama: selectedPaket.nama,
      paketHarga: selectedPaket.harga,
      tanggalAcara: bookingForm.tanggalAcara,
      lokasiAcara: bookingForm.lokasiAcara,
      catatan: bookingForm.catatan,
      status: 'menunggu_pembayaran',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    setActiveBookingId(id)
    setBookingStep(2)
    setBookingLoading(false)
  }

  const handlePaymentUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setBookingLoading(true)
    await updateBooking(activeBookingId, {
      status: 'menunggu_konfirmasi',
      buktiPembayaran: buktiFile || 'uploaded',
    })
    await refreshBookings()
    setBookingStep(3)
    setBookingLoading(false)
  }

  const handleUploadExisting = async (bookingId: string) => {
    if (!uploadFile) return
    await updateBooking(bookingId, {
      status: 'menunggu_konfirmasi',
      buktiPembayaran: uploadFile,
    })
    setUploadBookingId(null)
    setUploadFile('')
    await refreshBookings()
  }

  const handleTestimoniSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    const booking = bookings.find(b => b.id === testimoniForm.bookingId)
    if (!booking) return
    const all = getTestimoni()
    const newT: Testimoni = {
      id: `t${Date.now()}`,
      nama: user.nama,
      paket: booking.paketNama,
      rating: testimoniForm.rating,
      komentar: testimoniForm.komentar,
      tanggal: new Date().toISOString().split('T')[0],
      foto: `https://placehold.co/60x60?text=${encodeURIComponent(user.nama.substring(0, 2).toUpperCase())}`,
    }
    saveTestimoni([...all, newT])
    await updateBooking(testimoniForm.bookingId, { status: 'selesai' })
    await refreshBookings()
    setTestimoniSuccess(true)
    setTestimoniForm({ bookingId: '', rating: 5, komentar: '' })
  }

  const completedBookings = bookings.filter(b => b.status === 'dikonfirmasi' || b.status === 'selesai')
  const pendingBookings = bookings.filter(b => b.status === 'menunggu_pembayaran' || b.status === 'menunggu_konfirmasi')
  const reviewableBookings = bookings.filter(b => b.status === 'dikonfirmasi')

  const selectedPaket = paketList.find(p => p.id === bookingForm.paketId)

  const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'riwayat', label: 'Riwayat Pesanan', icon: <ShoppingBag size={18} />, badge: bookings.length },
    { id: 'booking', label: 'Booking Baru', icon: <CalendarDays size={18} /> },
    { id: 'testimoni', label: 'Tulis Testimoni', icon: <MessageSquare size={18} />, badge: reviewableBookings.length || undefined },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-muted/20 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="px-5 py-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-serif font-bold text-primary">MARCOS</span>
            <span className="text-xs text-muted-foreground tracking-widest uppercase">MUA</span>
          </Link>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserIcon size={18} className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user.nama}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
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
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  tab === item.id ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom links */}
        <div className="px-3 py-4 border-t border-border flex flex-col gap-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground/70 hover:bg-muted transition-colors"
          >
            <ArrowLeft size={18} />
            Kembali ke Beranda
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

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-border px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-muted"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div>
            <h1 className="font-serif font-semibold text-lg leading-none">
              {NAV_ITEMS.find(n => n.id === tab)?.label}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">Halo, {user.nama.split(' ')[0]}!</p>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6">

          {/* ─── OVERVIEW ─── */}
          {tab === 'overview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Pesanan', value: bookings.length, icon: <ShoppingBag size={20} />, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Menunggu Konfirmasi', value: pendingBookings.length, icon: <Clock size={20} />, color: 'text-amber-600 bg-amber-50' },
                  { label: 'Dikonfirmasi', value: completedBookings.length, icon: <CheckCircle2 size={20} />, color: 'text-green-600 bg-green-50' },
                  { label: 'Bisa Review', value: reviewableBookings.length, icon: <Star size={20} />, color: 'text-primary bg-primary/10' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white rounded-2xl border border-border p-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Notifications */}
              {reviewableBookings.length > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
                  <Star size={18} className="text-primary mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Bagikan pengalaman Anda!</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Anda memiliki {reviewableBookings.length} pesanan yang sudah dikonfirmasi. Tulis testimoni Anda.
                    </p>
                  </div>
                  <button
                    onClick={() => setTab('testimoni')}
                    className="text-xs px-3 py-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shrink-0"
                  >
                    Tulis
                  </button>
                </div>
              )}

              {/* Recent orders */}
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-semibold text-sm">Pesanan Terbaru</h2>
                  <button onClick={() => setTab('riwayat')} className="text-xs text-primary hover:underline flex items-center gap-1">
                    Lihat Semua <ChevronRight size={12} />
                  </button>
                </div>
                {bookings.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Package2 size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">Belum ada pesanan</p>
                    <p className="text-xs mt-1">Mulai booking paket impian Anda</p>
                    <button
                      onClick={() => setTab('booking')}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-full text-xs font-medium hover:bg-primary/90"
                    >
                      Booking Sekarang
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {bookings.slice(0, 3).map(b => (
                      <div key={b.id} className="px-5 py-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Package2 size={18} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{b.paketNama}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(b.tanggalAcara)}</p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${STATUS_COLOR[b.status]}`}>
                          {STATUS_LABEL[b.status]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA */}
              <button
                onClick={() => setTab('booking')}
                className="w-full py-4 border-2 border-dashed border-primary/30 rounded-2xl text-primary text-sm font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircle size={18} />
                Booking Paket Baru
              </button>
            </div>
          )}

          {/* ─── RIWAYAT ─── */}
          {tab === 'riwayat' && (
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border py-16 text-center text-muted-foreground">
                  <Package2 size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-medium">Belum ada pesanan</p>
                  <p className="text-sm mt-1">Booking paket untuk memulai</p>
                  <button
                    onClick={() => setTab('booking')}
                    className="mt-4 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90"
                  >
                    Booking Sekarang
                  </button>
                </div>
              ) : (
                bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(b => (
                  <div key={b.id} className="bg-white rounded-2xl border border-border overflow-hidden">
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-sm">{b.paketNama}</p>
                        <p className="text-xs text-muted-foreground">ID: {b.id}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLOR[b.status]}`}>
                        {STATUS_LABEL[b.status]}
                      </span>
                    </div>
                    {/* Details */}
                    <div className="px-5 py-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Tanggal Acara</p>
                        <p className="font-medium">{formatDate(b.tanggalAcara)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Total Harga</p>
                        <p className="font-bold text-primary">{formatRupiah(b.paketHarga)}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-muted-foreground mb-0.5">Lokasi</p>
                        <p className="font-medium">{b.lokasiAcara}</p>
                      </div>
                      {b.catatan && (
                        <div className="col-span-2">
                          <p className="text-xs text-muted-foreground mb-0.5">Catatan</p>
                          <p className="text-muted-foreground">{b.catatan}</p>
                        </div>
                      )}
                    </div>

                    {/* Upload bukti for menunggu_pembayaran */}
                    {b.status === 'menunggu_pembayaran' && (
                      <div className="px-5 py-4 bg-amber-50 border-t border-amber-100">
                        {uploadBookingId === b.id ? (
                          <div className="flex flex-col gap-3">
                            <p className="text-sm font-semibold text-amber-700">Upload Bukti Pembayaran</p>
                            <div className="text-sm text-amber-600 font-medium">
                              Transfer ke BCA 1234567890 a/n MARCOS MUA • {formatRupiah(b.paketHarga)}
                            </div>
                            <div className="relative border-2 border-dashed border-amber-300 rounded-xl p-4 text-center">
                              {uploadFile ? (
                                <div className="flex items-center justify-center gap-2 text-green-600">
                                  <CheckCircle2 size={16} /> <span className="text-sm font-medium">{uploadFile}</span>
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground">Klik untuk pilih file bukti transfer</p>
                              )}
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={e => setUploadFile(e.target.files?.[0]?.name || '')}
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => { setUploadBookingId(null); setUploadFile('') }}
                                className="flex-1 py-2 border border-border rounded-xl text-sm"
                              >
                                Batal
                              </button>
                              <button
                                disabled={!uploadFile}
                                onClick={() => handleUploadExisting(b.id)}
                                className="flex-1 py-2 bg-primary text-white rounded-xl text-sm font-medium disabled:opacity-50"
                              >
                                Kirim Bukti
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-amber-700">Menunggu Pembayaran</p>
                              <p className="text-xs text-amber-600 mt-0.5">Transfer ke BCA 1234567890</p>
                            </div>
                            <button
                              onClick={() => setUploadBookingId(b.id)}
                              className="flex items-center gap-1.5 text-xs px-3 py-2 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600"
                            >
                              <Upload size={13} /> Upload Bukti
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Review CTA */}
                    {b.status === 'dikonfirmasi' && (
                      <div className="px-5 py-3 bg-primary/5 border-t border-primary/10">
                        <button
                          onClick={() => { setTestimoniForm(f => ({ ...f, bookingId: b.id })); setTab('testimoni') }}
                          className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                        >
                          <Star size={13} className="fill-amber-400 text-amber-400" />
                          Tulis Ulasan untuk Pesanan Ini
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* ─── BOOKING BARU ─── */}
          {tab === 'booking' && (
            <div className="max-w-2xl mx-auto">
              {bookingSuccess || bookingStep === 3 ? (
                <div className="bg-white rounded-2xl border border-border p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={40} className="text-green-500" />
                  </div>
                  <h2 className="text-xl font-serif font-semibold mb-2">Pesanan Berhasil!</h2>
                  <p className="text-sm text-muted-foreground mb-1">Bukti pembayaran Anda sedang diverifikasi admin.</p>
                  <p className="text-xs text-muted-foreground mb-6">ID Pesanan: <strong>{activeBookingId}</strong></p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => { setTab('riwayat'); setBookingStep(1); setBuktiFile(''); setBookingForm({ paketId: '', tanggalAcara: '', lokasiAcara: '', catatan: '' }); refreshBookings() }}
                      className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90"
                    >
                      Lihat Riwayat Pesanan
                    </button>
                    <button
                      onClick={() => { setBookingStep(1); setBuktiFile(''); setBookingForm({ paketId: '', tanggalAcara: '', lokasiAcara: '', catatan: '' }) }}
                      className="w-full py-3 border border-border rounded-xl text-sm"
                    >
                      Booking Paket Lain
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-border overflow-hidden">
                  {/* Step progress */}
                  <div className="px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      {[
                        { n: 1, label: 'Detail Pesanan' },
                        { n: 2, label: 'Pembayaran' },
                      ].map(({ n, label }) => (
                        <div key={n} className="flex items-center gap-2 flex-1">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${bookingStep >= n ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                            {bookingStep > n ? <CheckCircle2 size={14} /> : n}
                          </div>
                          <span className={`text-xs font-medium ${bookingStep >= n ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
                          {n < 2 && <div className={`flex-1 h-0.5 ${bookingStep > n ? 'bg-primary' : 'bg-muted'}`} />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Step 1: Form */}
                    {bookingStep === 1 && (
                      <form onSubmit={handleBookingSubmit} className="space-y-5">
                        {/* Paket selection */}
                        <div>
                          <label className="text-sm font-semibold mb-2 block">Pilih Paket</label>
                          <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                            {paketList.map(p => (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => setBookingForm(f => ({ ...f, paketId: p.id }))}
                                className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                                  bookingForm.paketId === p.id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/30'
                                }`}
                              >
                                <img src={p.foto} alt={`Paket ${p.nama}`} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold truncate">{p.nama}</p>
                                  <p className="text-xs text-muted-foreground truncate">{p.layanan.slice(0, 2).join(', ')}</p>
                                  <p className="text-sm font-bold text-primary mt-0.5">{formatRupiah(p.harga)}</p>
                                </div>
                                {bookingForm.paketId === p.id && (
                                  <CheckCircle2 size={18} className="text-primary shrink-0" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5 block">
                              <CalendarDays size={14} className="text-primary" />
                              Tanggal Acara
                            </label>
                            <input
                              type="date"
                              required
                              value={bookingForm.tanggalAcara}
                              min={new Date().toISOString().split('T')[0]}
                              onChange={e => setBookingForm(f => ({ ...f, tanggalAcara: e.target.value }))}
                              className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-1.5 block">Lokasi Acara</label>
                            <input
                              type="text"
                              required
                              value={bookingForm.lokasiAcara}
                              onChange={e => setBookingForm(f => ({ ...f, lokasiAcara: e.target.value }))}
                              placeholder="Jl. Mawar No. 10, Jakarta"
                              className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Catatan (opsional)</label>
                          <textarea
                            rows={3}
                            value={bookingForm.catatan}
                            onChange={e => setBookingForm(f => ({ ...f, catatan: e.target.value }))}
                            placeholder="Tema, konsep, atau permintaan khusus..."
                            className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                          />
                        </div>

                        {/* Summary */}
                        {selectedPaket && (
                          <div className="bg-primary/5 rounded-xl p-4 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold">{selectedPaket.nama}</p>
                              <p className="text-xs text-muted-foreground">
                                {bookingForm.tanggalAcara ? formatDate(bookingForm.tanggalAcara) : 'Pilih tanggal'}
                              </p>
                            </div>
                            <p className="text-lg font-bold text-primary">{formatRupiah(selectedPaket.harga)}</p>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={bookingLoading || !bookingForm.paketId || !bookingForm.tanggalAcara || !bookingForm.lokasiAcara}
                          className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm disabled:opacity-50 hover:bg-primary/90 transition-colors"
                        >
                          {bookingLoading ? 'Memproses...' : 'Pesan Sekarang'}
                        </button>
                      </form>
                    )}

                    {/* Step 2: Payment */}
                    {bookingStep === 2 && selectedPaket && (
                      <form onSubmit={handlePaymentUpload} className="space-y-4">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                          <p className="text-sm font-semibold text-amber-700">ID Pesanan: {activeBookingId}</p>
                          <p className="text-xs text-amber-600 mt-0.5">Simpan ID ini sebagai referensi</p>
                        </div>
                        <div className="border-2 border-dashed border-primary/30 rounded-xl p-5 text-center">
                          <p className="text-xs text-muted-foreground mb-1">Transfer ke</p>
                          <p className="text-2xl font-bold text-primary">BCA 1234567890</p>
                          <p className="text-sm text-muted-foreground">a/n MARCOS MUA Studio</p>
                          <div className="mt-3 pt-3 border-t border-dashed border-border">
                            <p className="text-xs text-muted-foreground">Jumlah</p>
                            <p className="text-xl font-bold">{formatRupiah(selectedPaket.harga)}</p>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1.5 block">Upload Bukti Pembayaran</label>
                          <div className="relative border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 transition-colors">
                            {buktiFile ? (
                              <div className="flex items-center justify-center gap-2 text-green-600">
                                <CheckCircle2 size={20} />
                                <span className="text-sm font-medium">{buktiFile}</span>
                              </div>
                            ) : (
                              <>
                                <Upload size={24} className="text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground">Klik atau seret file bukti transfer</p>
                                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, PDF (maks. 5MB)</p>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={e => setBuktiFile(e.target.files?.[0]?.name || '')}
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          disabled={bookingLoading || !buktiFile}
                          className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm disabled:opacity-50 hover:bg-primary/90"
                        >
                          {bookingLoading ? 'Mengirim...' : 'Konfirmasi Pembayaran'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── TESTIMONI ─── */}
          {tab === 'testimoni' && (
            <div className="max-w-xl mx-auto">
              {testimoniSuccess ? (
                <div className="bg-white rounded-2xl border border-border p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <Star size={40} className="fill-primary text-primary" />
                  </div>
                  <h2 className="text-xl font-serif font-semibold mb-2">Terima Kasih!</h2>
                  <p className="text-sm text-muted-foreground mb-6">Ulasan Anda sangat berarti bagi kami dan calon pengantin lainnya.</p>
                  <button
                    onClick={() => { setTestimoniSuccess(false); setTab('riwayat') }}
                    className="px-6 py-3 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90"
                  >
                    Kembali ke Riwayat
                  </button>
                </div>
              ) : reviewableBookings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-border py-16 text-center text-muted-foreground">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-medium">Belum ada pesanan untuk direview</p>
                  <p className="text-sm mt-1 max-w-xs mx-auto">Pesanan yang sudah dikonfirmasi admin dapat diberikan ulasan.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-border overflow-hidden">
                  <div className="px-6 py-5 border-b border-border">
                    <h2 className="font-serif font-semibold text-lg">Tulis Ulasan</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Bagikan pengalaman pernikahan Anda</p>
                  </div>
                  <form onSubmit={handleTestimoniSubmit} className="p-6 space-y-5">
                    {/* Select booking */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Pilih Pesanan</label>
                      <div className="flex flex-col gap-2">
                        {reviewableBookings.map(b => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setTestimoniForm(f => ({ ...f, bookingId: b.id }))}
                            className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                              testimoniForm.bookingId === b.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/30'
                            }`}
                          >
                            <Package2 size={20} className="text-primary shrink-0" />
                            <div>
                              <p className="text-sm font-semibold">{b.paketNama}</p>
                              <p className="text-xs text-muted-foreground">{formatDate(b.tanggalAcara)}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(n => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setTestimoniForm(f => ({ ...f, rating: n }))}
                            className="p-1"
                          >
                            <Star
                              size={28}
                              className={`transition-colors ${
                                n <= testimoniForm.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-300 hover:text-amber-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="self-center text-sm font-semibold text-muted-foreground ml-1">
                          {['', 'Buruk', 'Kurang', 'Cukup', 'Bagus', 'Luar Biasa'][testimoniForm.rating]}
                        </span>
                      </div>
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Ulasan Anda</label>
                      <textarea
                        required
                        rows={4}
                        value={testimoniForm.komentar}
                        onChange={e => setTestimoniForm(f => ({ ...f, komentar: e.target.value }))}
                        placeholder="Ceritakan pengalaman Anda dengan layanan kami..."
                        className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!testimoniForm.bookingId || !testimoniForm.komentar}
                      className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm disabled:opacity-50 hover:bg-primary/90"
                    >
                      Kirim Ulasan
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
