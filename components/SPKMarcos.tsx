'use client'

import { useState } from 'react'
import { Brain, ChevronRight, Trophy, ArrowLeft, Info } from 'lucide-react'
import { hitungMARCOS, FormKebutuhan, HasilMARCOS } from '@/lib/marcos'
import type { PaketMakeup } from '@/lib/data'
import PaketCard from './PaketCard'

interface SPKMarcosProps {
  paketList: PaketMakeup[]
  onDetail: (paket: PaketMakeup) => void
  onBooking: (paket: PaketMakeup) => void
}

const STEP_LABELS = ['Budget', 'Kualitas Makeup', 'Kelengkapan', 'Pengalaman MUA', 'Estetika']

export default function SPKMarcos({ paketList, onDetail, onBooking }: SPKMarcosProps) {
  const [step, setStep] = useState(0) // 0 = form, 1 = loading, 2 = result
  const [form, setForm] = useState<FormKebutuhan>({
    budget: 'sedang',
    kualitasMakeup: 'glamour',
    kelengkapan: 'makeup_hairdo',
    pengalamanMUA: 'profesional',
    estetikaDekorasi: 'elegan',
  })
  const [hasil, setHasil] = useState<HasilMARCOS[]>([])

  const handleHitung = () => {
    setStep(1)
    setTimeout(() => {
      const result = hitungMARCOS(paketList, form)
      setHasil(result)
      setStep(2)
    }, 1800)
  }

  const handleReset = () => {
    setStep(0)
    setHasil([])
  }

  return (
    // FIX: bg-cream sekarang valid karena sudah didefinisikan di tailwind.config.js
    <section id="spk" className="py-20 bg-gradient-to-b from-cream to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs font-semibold tracking-wide mb-4">
            <Brain size={14} />
            SPK MARCOS — Sistem Pendukung Keputusan
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-balance mb-3">
            Temukan Paket Terbaik <span className="text-primary italic">untuk Anda</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Sistem MARCOS (Measurement of Alternatives and Ranking according to Compromise Solution)
            menganalisis kesesuaian tiap paket dengan kebutuhan Anda secara ilmiah.
          </p>
        </div>

        {/* Step: Form */}
        {step === 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-border p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold mb-2.5">
                  1. Budget Pernikahan Anda
                </label>
                <div className="flex gap-2">
                  {[
                    { val: 'murah', label: 'Di Bawah Rp 2 Jt', sub: 'Hemat' },
                    { val: 'sedang', label: 'Rp 2–5 Juta', sub: 'Sedang' },
                    { val: 'mahal', label: 'Di Atas Rp 5 Jt', sub: 'Premium' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setForm(p => ({ ...p, budget: opt.val as FormKebutuhan['budget'] }))}
                      className={`flex-1 py-3 px-2 rounded-xl border-2 text-center transition-all ${
                        form.budget === opt.val
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <div className="text-xs font-semibold">{opt.sub}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{opt.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Kualitas Makeup */}
              <div>
                <label className="block text-sm font-semibold mb-2.5">
                  2. Kualitas Makeup yang Diinginkan
                </label>
                <div className="flex gap-2">
                  {[
                    { val: 'natural', label: 'Soft & Natural', sub: 'Natural' },
                    { val: 'glamour', label: 'Memukau', sub: 'Glamour' },
                    { val: 'bold', label: 'Dramatis', sub: 'Bold' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setForm(p => ({ ...p, kualitasMakeup: opt.val as FormKebutuhan['kualitasMakeup'] }))}
                      className={`flex-1 py-3 px-2 rounded-xl border-2 text-center transition-all ${
                        form.kualitasMakeup === opt.val
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <div className="text-xs font-semibold">{opt.sub}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{opt.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Kelengkapan */}
              <div>
                <label className="block text-sm font-semibold mb-2.5">
                  3. Kelengkapan Paket
                </label>
                <div className="flex flex-col gap-2">
                  {[
                    { val: 'makeup_only', label: 'Makeup Only' },
                    { val: 'makeup_hairdo', label: 'Makeup + Hairdo' },
                    { val: 'makeup_hairdo_dekorasi', label: 'Makeup + Hairdo + Dekorasi' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setForm(p => ({ ...p, kelengkapan: opt.val as FormKebutuhan['kelengkapan'] }))}
                      className={`py-2.5 px-4 rounded-xl border-2 text-left text-sm transition-all ${
                        form.kelengkapan === opt.val
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pengalaman MUA */}
              <div>
                <label className="block text-sm font-semibold mb-2.5">
                  4. Pengalaman MUA yang Diinginkan
                </label>
                <div className="flex flex-col gap-2">
                  {[
                    { val: 'berpengalaman', label: 'Berpengalaman', sub: '3–5 tahun' },
                    { val: 'profesional', label: 'Profesional', sub: '5–10 tahun' },
                    { val: 'senior', label: 'Senior', sub: '10+ tahun' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setForm(p => ({ ...p, pengalamanMUA: opt.val as FormKebutuhan['pengalamanMUA'] }))}
                      className={`py-2.5 px-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                        form.pengalamanMUA === opt.val
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <span className="text-sm font-medium">{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Estetika */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2.5">
                  5. Estetika / Konsep Dekorasi
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { val: 'minimalis', label: 'Minimalis', icon: '◇', desc: 'Clean & simple' },
                    { val: 'elegan', label: 'Elegan', icon: '◈', desc: 'Sophisticated' },
                    { val: 'mewah', label: 'Mewah', icon: '◉', desc: 'Luxurious' },
                    { val: 'adat', label: 'Adat', icon: '◎', desc: 'Tradisional' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setForm(p => ({ ...p, estetikaDekorasi: opt.val as FormKebutuhan['estetikaDekorasi'] }))}
                      className={`py-4 px-3 rounded-xl border-2 text-center transition-all ${
                        form.estetikaDekorasi === opt.val
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <div className="text-xl mb-1">{opt.icon}</div>
                      <div className="text-sm font-semibold">{opt.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleHitung}
              className="mt-8 w-full py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <Brain size={16} />
              Analisis & Temukan Paket Terbaik
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step: Loading */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-md border border-border p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Brain size={32} className="text-primary animate-pulse" />
            </div>
            <h3 className="text-xl font-serif font-semibold mb-2">Sedang Menganalisis...</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Algoritma MARCOS sedang menghitung derajat utilitas tiap paket
            </p>
            <div className="w-48 mx-auto bg-muted rounded-full h-2 overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '70%' }} />
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {STEP_LABELS.map((l, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Step: Result */}
        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Trophy size={18} className="text-amber-500" />
                  <h3 className="text-lg font-serif font-semibold">Hasil Rekomendasi MARCOS</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {hasil.length} paket diurutkan berdasarkan nilai fungsi utilitas f(K)
                </p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <ArrowLeft size={14} />
                Ubah Preferensi
              </button>
            </div>

            {/* Top recommendation */}
            {hasil[0] && (
              <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                  <Trophy size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                    Rekomendasi Terbaik MARCOS
                  </p>
                  <p className="font-serif font-semibold text-base truncate">{hasil[0].paket.nama}</p>
                  <p className="text-xs text-muted-foreground">
                    f(K) = {hasil[0].skor.toFixed(4)} · {hasil[0].persentase}% sesuai preferensi Anda
                  </p>
                </div>
                <div className="hidden sm:block w-24 text-right shrink-0">
                  <div className="text-lg font-bold text-amber-600">{hasil[0].persentase}%</div>
                  <div className="w-full bg-amber-200 rounded-full h-1.5 mt-1">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${hasil[0].persentase}%` }} />
                  </div>
                </div>
              </div>
            )}

            {/* MARCOS info note */}
            <div className="mb-6 flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-xl p-3 border border-border">
              <Info size={13} className="mt-0.5 shrink-0 text-primary" />
              <span>
                Peringkat dihitung menggunakan metode <strong>MARCOS</strong> (Stević et al., 2020).
                Skor f(K) menggambarkan derajat utilitas relatif terhadap solusi ideal (AI) dan anti-ideal (AAI).
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hasil.slice(0, 6).map(h => (
                <PaketCard
                  key={h.paket.id}
                  paket={h.paket}
                  onDetail={onDetail}
                  onBooking={onBooking}
                  matchPercentage={h.persentase}
                  rank={h.rank}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
