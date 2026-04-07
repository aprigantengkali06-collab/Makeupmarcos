'use client'

import { Brain, ChevronDown, Star } from 'lucide-react'

interface HeroSectionProps {
  onSPKClick: () => void
  onKatalogClick: () => void
}

export default function HeroSection({ onSPKClick, onKatalogClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://placehold.co/1920x1080?text=Elegant+Wedding+Bridal+Makeup+Studio+Rose+Gold+Background+Luxury+Setting"
          alt="Elegant wedding bridal makeup studio background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Floating portrait cards */}
      <div className="absolute top-1/4 right-8 lg:right-1/4 hidden md:block">
        <div className="w-64 h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 rotate-2">
          <img
            src="https://placehold.co/256x320?text=Beautiful+Bride+Natural+Glow+Makeup+Wedding+Portrait+Elegant"
            alt="Beautiful bride with natural glow wedding makeup"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="absolute bottom-32 right-4 lg:right-[20%] hidden md:block">
        <div className="w-44 h-56 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 -rotate-3">
          <img
            src="https://placehold.co/176x224?text=Glamour+Bridal+Makeup+Gold+Eyeshadow+Close+Up+Beautiful"
            alt="Close up glamour bridal makeup with gold eyeshadow"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16">
        <div className="max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full text-white text-xs font-medium tracking-wide mb-6">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            #1 Wedding MUA Terpercaya
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white leading-tight mb-5">
            Tampil{' '}
            {/* FIX: gunakan class Tailwind rose-gold alih-alih CSS variable inline */}
            <span className="italic text-rose-gold">Memukau</span>
            {' '}di Hari Istimewa Anda
          </h1>

          <p className="text-white/85 text-base md:text-lg leading-relaxed mb-8">
            Temukan paket makeup wedding yang sempurna dengan bantuan sistem rekomendasi SPK MARCOS.
            Dipercaya lebih dari 500+ pengantin.
          </p>

          {/* Stats */}
          <div className="flex gap-6 mb-10">
            {[
              { num: '500+', label: 'Pengantin Happy' },
              { num: '8+', label: 'Tahun Pengalaman' },
              { num: '4.9', label: 'Rating Rata-rata' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-xl font-bold text-white">{stat.num}</p>
                <p className="text-xs text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onSPKClick}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
            >
              <Brain size={16} />
              Temukan Paket Terbaik
            </button>
            <button
              onClick={onKatalogClick}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/15 backdrop-blur-sm border border-white/40 text-white rounded-full font-semibold text-sm hover:bg-white/25 transition-all"
            >
              Lihat Semua Paket
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/60 hover:text-white/90 transition-colors"
        aria-label="Scroll ke katalog"
      >
        <span className="text-xs tracking-widest">Scroll</span>
        <ChevronDown size={18} className="animate-bounce" />
      </button>
    </section>
  )
}
