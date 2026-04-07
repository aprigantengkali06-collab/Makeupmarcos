'use client'

import { X, Star, CheckCircle2, Sparkles, Crown } from 'lucide-react'
import { formatRupiah } from '@/lib/data'
import type { PaketMakeup } from '@/lib/data'

interface PaketDetailModalProps {
  paket: PaketMakeup | null
  onClose: () => void
  onBooking: (paket: PaketMakeup) => void
}

const KELENGKAPAN_LABEL: Record<PaketMakeup['kelengkapan'], string> = {
  makeup_only: 'Makeup Only',
  makeup_hairdo: 'Makeup + Hairdo',
  makeup_hairdo_dekorasi: 'Makeup + Hairdo + Dekorasi',
}

const KUALITAS_LABEL: Record<PaketMakeup['kualitasMakeup'], string> = {
  natural: 'Natural',
  glamour: 'Glamour',
  bold: 'Bold',
}

const PENGALAMAN_LABEL: Record<PaketMakeup['pengalamanMUA'], string> = {
  berpengalaman: 'Berpengalaman',
  profesional: 'Profesional',
  senior: 'Senior',
}

const ESTETIKA_LABEL: Record<PaketMakeup['estetikaDekorasi'], string> = {
  minimalis: 'Minimalis',
  elegan: 'Elegan',
  mewah: 'Mewah',
  adat: 'Adat',
}

export default function PaketDetailModal({ paket, onClose, onBooking }: PaketDetailModalProps) {
  if (!paket) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 shadow hover:bg-muted transition-colors"
        >
          <X size={18} />
        </button>

        {/* Image */}
        <div className="relative h-64 md:h-80">
          <img
            src={paket.foto}
            alt={`Detail paket ${paket.nama} bridal makeup`}
            className="w-full h-full object-cover rounded-t-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-2xl" />
          <div className="absolute bottom-4 left-4 flex gap-2">
            {paket.terlaris && (
              <span className="flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                <Sparkles size={11} /> Terlaris
              </span>
            )}
            {paket.terbaik && (
              <span className="flex items-center gap-1 px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">
                <Crown size={11} /> Terbaik
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-serif font-semibold leading-tight">{paket.nama}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={13} className={s <= Math.round(paket.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                  ))}
                </div>
                <span className="text-sm font-semibold">{paket.rating}</span>
                <span className="text-sm text-muted-foreground">({paket.totalReview} ulasan)</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-primary">{formatRupiah(paket.harga)}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-5">{paket.deskripsi}</p>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: 'Kelengkapan', value: KELENGKAPAN_LABEL[paket.kelengkapan] },
              { label: 'Kualitas Makeup', value: KUALITAS_LABEL[paket.kualitasMakeup] },
              { label: 'Pengalaman MUA', value: PENGALAMAN_LABEL[paket.pengalamanMUA] },
              { label: 'Estetika', value: ESTETIKA_LABEL[paket.estetikaDekorasi] },
            ].map(spec => (
              <div key={spec.label} className="bg-muted rounded-xl px-4 py-3">
                <p className="text-xs text-muted-foreground mb-0.5">{spec.label}</p>
                <p className="text-sm font-semibold">{spec.value}</p>
              </div>
            ))}
          </div>

          {/* Layanan */}
          <div className="mb-6">
            <h3 className="font-semibold text-sm mb-3">Layanan Termasuk</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {paket.layanan.map((l, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => onBooking(paket)}
            className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            Booking Paket Ini
          </button>
        </div>
      </div>
    </div>
  )
}
