'use client'

import { useState } from 'react'
import { X, Calendar, MapPin, FileText, CheckCircle2, Upload } from 'lucide-react'
import { addBooking, updateBooking } from '@/lib/db'
import { formatRupiah } from '@/lib/data'
import type { PaketMakeup, User } from '@/lib/data'

interface BookingModalProps {
  paket: PaketMakeup | null
  user: User | null
  open: boolean
  onClose: () => void
  onLoginRequired: () => void
}

export default function BookingModal({ paket, user, open, onClose, onLoginRequired }: BookingModalProps) {
  const [step, setStep] = useState(1) // 1=form, 2=payment, 3=success
  const [form, setForm] = useState({ tanggalAcara: '', lokasiAcara: '', catatan: '' })
  const [buktiFile, setBuktiFile] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [bookingId, setBookingId] = useState('')

  if (!open || !paket) return null

  // ── Login required prompt ──────────────────────────────────────
  if (!user) {
    return (
      <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted">
            <X size={18} />
          </button>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} className="text-primary" />
          </div>
          <h3 className="text-xl font-serif font-semibold mb-2">Login Diperlukan</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Silakan login atau daftar terlebih dahulu untuk melakukan booking paket.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl text-sm">
              Batal
            </button>
            <button
              onClick={() => { onClose(); onLoginRequired() }}
              className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium"
            >
              Login / Daftar
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const id = `BK${Date.now()}`
    await addBooking({
      id,
      customerId: user.id,
      customerNama: user.nama,
      customerEmail: user.email,
      customerHp: user.noHp,
      paketId: paket.id,
      paketNama: paket.nama,
      paketHarga: paket.harga,
      tanggalAcara: form.tanggalAcara,
      lokasiAcara: form.lokasiAcara,
      catatan: form.catatan,
      status: 'menunggu_pembayaran',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    setBookingId(id)
    setLoading(false)
    setStep(2)
  }

  const handleUploadBukti = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await updateBooking(bookingId, {
      status: 'menunggu_konfirmasi',
      buktiPembayaran: buktiFile || 'uploaded',
    })
    setLoading(false)
    setStep(3)
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={step === 3 ? onClose : undefined}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="font-serif font-semibold text-lg">
              {step === 1 ? 'Form Booking' : step === 2 ? 'Pembayaran' : 'Pesanan Berhasil!'}
            </h2>
            {/* Step indicator */}
            <div className="flex items-center gap-2 mt-1">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center gap-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step > s ? <CheckCircle2 size={14} /> : s}
                  </div>
                  {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
                </div>
              ))}
            </div>
          </div>
          {step === 3 && (
            <button onClick={onClose} className="p-1 rounded-full hover:bg-muted">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="p-6">
          {/* Paket summary */}
          <div className="flex gap-3 p-3 bg-muted rounded-xl mb-5">
            <img
              src={paket.foto}
              alt={`Foto paket ${paket.nama}`}
              className="w-16 h-16 rounded-lg object-cover shrink-0"
            />
            <div>
              <p className="text-sm font-semibold">{paket.nama}</p>
              <p className="text-lg font-bold text-primary">{formatRupiah(paket.harga)}</p>
            </div>
          </div>

          {/* ── Step 1: Form ─────────────────────────────────────── */}
          {step === 1 && (
            <form onSubmit={handleSubmitBooking} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5 block">
                  <Calendar size={14} className="text-primary" />
                  Tanggal Acara
                </label>
                <input
                  type="date"
                  required
                  value={form.tanggalAcara}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setForm(p => ({ ...p, tanggalAcara: e.target.value }))}
                  className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5 block">
                  <MapPin size={14} className="text-primary" />
                  Lokasi / Alamat Acara
                </label>
                <input
                  type="text"
                  required
                  value={form.lokasiAcara}
                  onChange={e => setForm(p => ({ ...p, lokasiAcara: e.target.value }))}
                  placeholder="Jl. Mawar No. 10, Jakarta"
                  className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5 block">
                  <FileText size={14} className="text-primary" />
                  Catatan Tambahan (opsional)
                </label>
                <textarea
                  rows={3}
                  value={form.catatan}
                  onChange={e => setForm(p => ({ ...p, catatan: e.target.value }))}
                  placeholder="Tema pernikahan, konsep makeup, dll..."
                  className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <div className="bg-muted rounded-xl px-4 py-3 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground">Nama Pemesan</span>
                  <span className="font-medium">{user.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">No. HP</span>
                  <span className="font-medium">{user.noHp}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm disabled:opacity-60 hover:bg-primary/90 transition-colors"
              >
                {loading ? 'Memproses...' : 'Pesan Sekarang'}
              </button>
            </form>
          )}

          {/* ── Step 2: Payment ──────────────────────────────────── */}
          {step === 2 && (
            <form onSubmit={handleUploadBukti} className="flex flex-col gap-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-700 mb-1">
                  ID Pesanan: {bookingId}
                </p>
                <p className="text-xs text-amber-600">Simpan ID pesanan ini sebagai referensi Anda</p>
              </div>
              <div className="border border-dashed border-primary rounded-xl p-5 text-center">
                <p className="text-sm font-semibold mb-1">Transfer ke Rekening</p>
                <p className="text-2xl font-bold text-primary my-2">BCA 1234567890</p>
                <p className="text-sm text-muted-foreground">a/n MARCOS MUA Studio</p>
                <div className="mt-3 pt-3 border-t border-dashed border-border">
                  <p className="text-xs text-muted-foreground">Jumlah Transfer</p>
                  <p className="text-lg font-bold text-foreground">{formatRupiah(paket.harga)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Upload Bukti Pembayaran
                </label>
                {/* FIX: Tambah relative agar absolute input bisa diklik */}
                <div className="relative border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 transition-colors">
                  {buktiFile ? (
                    <div>
                      <CheckCircle2 size={24} className="text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-green-600 font-medium">File berhasil dipilih</p>
                      <p className="text-xs text-muted-foreground">{buktiFile}</p>
                    </div>
                  ) : (
                    <>
                      <Upload size={24} className="text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">Klik atau seret file ke sini</p>
                      <p className="text-xs text-muted-foreground">JPG, PNG, PDF (maks. 5MB)</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    onChange={e => setBuktiFile(e.target.files?.[0]?.name || '')}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !buktiFile}
                className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm disabled:opacity-60 hover:bg-primary/90 transition-colors"
              >
                {loading ? 'Mengupload...' : 'Konfirmasi Pembayaran'}
              </button>
            </form>
          )}

          {/* ── Step 3: Success ──────────────────────────────────── */}
          {step === 3 && (
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-2">Pesanan Berhasil!</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Pesanan Anda sedang menunggu konfirmasi dari admin.
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                ID Pesanan: <strong>{bookingId}</strong>
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="/dashboard"
                  className="block w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Lihat Riwayat Pesanan
                </a>
                <button
                  onClick={onClose}
                  className="w-full py-3 border border-border rounded-xl text-sm"
                >
                  Tutup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
