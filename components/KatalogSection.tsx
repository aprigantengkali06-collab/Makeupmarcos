'use client'

import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { formatRupiah } from '@/lib/data'
import type { PaketMakeup } from '@/lib/data'
import PaketCard from './PaketCard'

interface KatalogSectionProps {
  paketList: PaketMakeup[]
  onDetail: (paket: PaketMakeup) => void
  onBooking: (paket: PaketMakeup) => void
}

type SortKey = 'default' | 'harga_asc' | 'harga_desc' | 'rating'

export default function KatalogSection({ paketList, onDetail, onBooking }: KatalogSectionProps) {
  const [filterKelengkapan, setFilterKelengkapan] = useState<string>('semua')
  const [filterBudget, setFilterBudget] = useState<string>('semua')
  const [sortBy, setSortBy] = useState<SortKey>('default')
  const [showFilter, setShowFilter] = useState(false)

  const filtered = paketList
    .filter(p => {
      const okKelengkapan = filterKelengkapan === 'semua' || p.kelengkapan === filterKelengkapan
      const okBudget = filterBudget === 'semua' || p.kategoriHarga === filterBudget
      return okKelengkapan && okBudget
    })
    .sort((a, b) => {
      if (sortBy === 'harga_asc') return a.harga - b.harga
      if (sortBy === 'harga_desc') return b.harga - a.harga
      if (sortBy === 'rating') return b.rating - a.rating
      return 0
    })

  const activeFilters = [
    filterKelengkapan !== 'semua' && filterKelengkapan,
    filterBudget !== 'semua' && filterBudget,
  ].filter(Boolean)

  return (
    <section id="katalog" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs font-semibold tracking-wide mb-4">
            Katalog Paket
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-balance mb-3">
            Pilih Paket Sesuai <span className="text-primary italic">Impian Anda</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
            Berbagai paket makeup wedding tersedia untuk memenuhi kebutuhan dan budget Anda.
          </p>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Filter toggle */}
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${showFilter ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/40'}`}
          >
            <SlidersHorizontal size={15} />
            Filter
            {activeFilters.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortKey)}
            className="px-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-white"
          >
            <option value="default">Urutkan: Default</option>
            <option value="harga_asc">Harga Termurah</option>
            <option value="harga_desc">Harga Termahal</option>
            <option value="rating">Rating Tertinggi</option>
          </select>

          <div className="flex-1" />
          <p className="text-sm text-muted-foreground self-center">
            Menampilkan <strong>{filtered.length}</strong> paket
          </p>
        </div>

        {/* Filter panel */}
        {showFilter && (
          <div className="mb-6 p-5 bg-muted rounded-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold mb-2.5">Kelengkapan Paket</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { val: 'semua', label: 'Semua' },
                    { val: 'makeup_only', label: 'Makeup Only' },
                    { val: 'makeup_hairdo', label: 'Makeup + Hairdo' },
                    { val: 'makeup_hairdo_dekorasi', label: '+ Dekorasi' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setFilterKelengkapan(opt.val)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        filterKelengkapan === opt.val
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-white border-border hover:border-primary/40'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-2.5">Range Harga</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { val: 'semua', label: 'Semua Budget' },
                    { val: 'murah', label: 'Hemat (< 2 Jt)' },
                    { val: 'sedang', label: 'Sedang (2-5 Jt)' },
                    { val: 'mahal', label: 'Premium (> 5 Jt)' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setFilterBudget(opt.val)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        filterBudget === opt.val
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-white border-border hover:border-primary/40'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {activeFilters.length > 0 && (
              <button
                onClick={() => { setFilterKelengkapan('semua'); setFilterBudget('semua') }}
                className="mt-3 flex items-center gap-1 text-xs text-destructive hover:underline"
              >
                <X size={12} /> Reset Filter
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-serif mb-2">Tidak ada paket yang sesuai filter</p>
            <button
              onClick={() => { setFilterKelengkapan('semua'); setFilterBudget('semua') }}
              className="text-sm text-primary hover:underline"
            >
              Reset filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(p => (
              <PaketCard
                key={p.id}
                paket={p}
                onDetail={onDetail}
                onBooking={onBooking}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
