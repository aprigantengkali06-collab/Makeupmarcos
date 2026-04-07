'use client'

import { Star, Quote } from 'lucide-react'
import { formatDate } from '@/lib/data'
import type { Testimoni } from '@/lib/data'

interface TestimoniSectionProps {
  testimoniList: Testimoni[]
}

export default function TestimoniSection({ testimoniList }: TestimoniSectionProps) {
  return (
    <section id="testimoni" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs font-semibold tracking-wide mb-4">
            Testimoni
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-balance mb-3">
            Kata Mereka <span className="text-primary italic">Tentang Kami</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Kepuasan pelanggan adalah prioritas utama kami. Baca pengalaman nyata dari pengantin bahagia.
          </p>
        </div>

        {/* Overall rating */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-6 px-8 py-5 bg-primary/5 rounded-2xl border border-primary/20">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">4.9</p>
              <div className="flex mt-1">
                {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-amber-400 text-amber-400" />)}
              </div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div>
              <p className="text-sm font-semibold">Berdasarkan 239 Ulasan</p>
              <p className="text-xs text-muted-foreground">dari berbagai platform</p>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimoniList.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-border p-5 hover:shadow-md transition-shadow flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={t.foto}
                    alt={`Foto profil testimoni dari ${t.nama}`}
                    className="w-11 h-11 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div>
                    <p className="font-semibold text-sm">{t.nama}</p>
                    <p className="text-xs text-primary">{t.paket}</p>
                  </div>
                </div>
                <Quote size={20} className="text-primary/30 shrink-0" />
              </div>

              {/* Stars */}
              <div className="flex mb-3">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={13} className={s <= t.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                ))}
              </div>

              {/* Comment */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                &ldquo;{t.komentar}&rdquo;
              </p>

              {/* Date */}
              <p className="text-xs text-muted-foreground/60 mt-3 pt-3 border-t border-border">
                {formatDate(t.tanggal)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
