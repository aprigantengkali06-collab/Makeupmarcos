'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { GaleriItem } from '@/lib/data'

interface GaleriSectionProps {
  galeriList: GaleriItem[]
}

const KATEGORI = ['Semua', 'Natural', 'Glamour', 'Bold', 'Elegan', 'Mewah', 'Adat']

export default function GaleriSection({ galeriList }: GaleriSectionProps) {
  const [aktif, setAktif] = useState('Semua')
  const [lightbox, setLightbox] = useState<GaleriItem | null>(null)

  const filtered = aktif === 'Semua'
    ? galeriList
    : galeriList.filter(g => g.kategori === aktif)

  return (
    <section id="galeri" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs font-semibold tracking-wide mb-4">
            Portofolio
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-balance mb-3">
            Galeri Karya <span className="text-primary italic">Kami</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Hasil nyata riasan pengantin yang telah kami tangani. Setiap foto adalah cerita keindahan.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {KATEGORI.map(k => (
            <button
              key={k}
              onClick={() => setAktif(k)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                aktif === k
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white border border-border hover:border-primary/40'
              }`}
            >
              {k}
            </button>
          ))}
        </div>

        {/* Masonry-style grid */}
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          {filtered.map((g, i) => (
            <div
              key={g.id}
              className="break-inside-avoid group cursor-pointer"
              onClick={() => setLightbox(g)}
            >
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={g.foto}
                  alt={`Galeri portofolio: ${g.deskripsi}`}
                  className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                    i % 3 === 0 ? 'h-64' : i % 3 === 1 ? 'h-48' : 'h-56'
                  }`}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-3">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                    <span className="text-xs px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full">
                      {g.kategori}
                    </span>
                    <p className="text-xs text-white mt-1">{g.deskripsi}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90" onClick={() => setLightbox(null)}>
            <button className="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded-full">
              <X size={22} />
            </button>
            <div className="max-w-xl w-full" onClick={e => e.stopPropagation()}>
              <img
                src={lightbox.foto}
                alt={`Foto galeri: ${lightbox.deskripsi}`}
                className="w-full rounded-2xl"
              />
              <div className="text-center mt-4">
                <span className="text-xs px-3 py-1 bg-primary text-white rounded-full">{lightbox.kategori}</span>
                <p className="text-white/80 text-sm mt-2">{lightbox.deskripsi}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
