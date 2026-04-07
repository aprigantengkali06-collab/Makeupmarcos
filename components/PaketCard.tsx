'use client'

import { Star, CheckCircle2, Sparkles, Crown } from 'lucide-react'
import { formatRupiah } from '@/lib/data'
import type { PaketMakeup } from '@/lib/data'

interface PaketCardProps {
  paket: PaketMakeup
  onDetail: (paket: PaketMakeup) => void
  onBooking: (paket: PaketMakeup) => void
  matchPercentage?: number
  rank?: number
}

const KELENGKAPAN_LABEL: Record<PaketMakeup['kelengkapan'], string> = {
  makeup_only: 'Makeup Only',
  makeup_hairdo: 'Makeup + Hairdo',
  makeup_hairdo_dekorasi: 'Makeup + Hairdo + Dekorasi',
}

export default function PaketCard({ paket, onDetail, onBooking, matchPercentage, rank }: PaketCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden h-56">
        <img
          src={paket.foto}
          alt={`Foto ${paket.nama} bridal makeup package`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {paket.terlaris && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
              <Sparkles size={10} />
              Terlaris
            </span>
          )}
          {paket.terbaik && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-white text-xs font-semibold rounded-full">
              <Crown size={10} />
              Terbaik
            </span>
          )}
        </div>
        {/* Match percentage badge */}
        {matchPercentage !== undefined && (
          <div className="absolute top-3 right-3">
            <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${matchPercentage >= 90 ? 'bg-green-500 text-white' : matchPercentage >= 70 ? 'bg-primary text-white' : 'bg-white/90 text-foreground'}`}>
              {rank === 1 ? '★ ' : ''}
              {matchPercentage}% Cocok
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Kelengkapan badge */}
        <span className="self-start text-xs px-2.5 py-1 bg-accent text-accent-foreground rounded-full mb-2">
          {KELENGKAPAN_LABEL[paket.kelengkapan]}
        </span>

        <h3 className="font-serif font-semibold text-base leading-tight mb-1">{paket.nama}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{paket.deskripsi}</p>

        {/* Services preview */}
        <div className="flex flex-col gap-1 mb-3">
          {paket.layanan.slice(0, 3).map((l, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 size={11} className="text-primary shrink-0" />
              <span className="line-clamp-1">{l}</span>
            </div>
          ))}
          {paket.layanan.length > 3 && (
            <span className="text-xs text-primary">+{paket.layanan.length - 3} layanan lainnya</span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={12} className={s <= Math.round(paket.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
            ))}
          </div>
          <span className="text-xs font-semibold">{paket.rating}</span>
          <span className="text-xs text-muted-foreground">({paket.totalReview} ulasan)</span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <p className="text-lg font-bold text-primary">{formatRupiah(paket.harga)}</p>

          {/* CTA Buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onDetail(paket)}
              className="flex-1 py-2 border border-primary text-primary text-xs font-medium rounded-lg hover:bg-primary/5 transition-colors"
            >
              Lihat Detail
            </button>
            <button
              onClick={() => onBooking(paket)}
              className="flex-1 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
