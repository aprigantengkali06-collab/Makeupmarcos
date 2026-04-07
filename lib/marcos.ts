import type { PaketMakeup } from './data'

// ============================================================
// SPK MARCOS — Measurement of Alternatives and Ranking
// according to Compromise Solution
// Implementasi akademik sesuai metode MARCOS (Stević et al., 2020)
// ============================================================

export interface FormKebutuhan {
  budget: 'murah' | 'sedang' | 'mahal'
  kualitasMakeup: 'natural' | 'glamour' | 'bold'
  kelengkapan: 'makeup_only' | 'makeup_hairdo' | 'makeup_hairdo_dekorasi'
  pengalamanMUA: 'berpengalaman' | 'profesional' | 'senior'
  estetikaDekorasi: 'minimalis' | 'elegan' | 'mewah' | 'adat'
}

export interface HasilMARCOS {
  paket: PaketMakeup
  skor: number           // nilai utility f(K)
  kPlus: number          // utility degree terhadap ideal (AI)
  kMinus: number         // utility degree terhadap anti-ideal (AAI)
  persentase: number     // persentase kecocokan relatif (0–100)
  rank: number
}

// ── Bobot kriteria (total = 1.0) ──────────────────────────────
// C1: Harga, C2: Kualitas Makeup, C3: Kelengkapan,
// C4: Pengalaman MUA, C5: Estetika Dekorasi
const WEIGHTS = [0.25, 0.25, 0.20, 0.15, 0.15]

// ── Mapping nilai preferensi ke skala numerik 1–3 ────────────
const HARGA_MAP: Record<string, number> = { murah: 1, sedang: 2, mahal: 3 }
const KUALITAS_MAP: Record<string, number> = { natural: 1, glamour: 2, bold: 3 }
const KELENGKAPAN_MAP: Record<string, number> = {
  makeup_only: 1, makeup_hairdo: 2, makeup_hairdo_dekorasi: 3,
}
const PENGALAMAN_MAP: Record<string, number> = {
  berpengalaman: 1, profesional: 2, senior: 3,
}
const ESTETIKA_MAP: Record<string, number> = {
  minimalis: 1, elegan: 2, mewah: 3, adat: 3,
}

// ── Fungsi kesesuaian: 1 = cocok sempurna, 0 = tidak cocok ───
function kesesuaian(nilaiPaket: number, nilaiUser: number): number {
  const maxBeda = 2 // selisih maksimum antara nilai 1 dan 3
  return 1 - Math.abs(nilaiPaket - nilaiUser) / maxBeda
}

// ── Hitung skor kesesuaian tiap kriteria untuk satu paket ────
function buatVektorSkor(paket: PaketMakeup, form: FormKebutuhan): number[] {
  return [
    kesesuaian(HARGA_MAP[paket.kategoriHarga], HARGA_MAP[form.budget]),
    kesesuaian(KUALITAS_MAP[paket.kualitasMakeup], KUALITAS_MAP[form.kualitasMakeup]),
    kesesuaian(KELENGKAPAN_MAP[paket.kelengkapan], KELENGKAPAN_MAP[form.kelengkapan]),
    kesesuaian(PENGALAMAN_MAP[paket.pengalamanMUA], PENGALAMAN_MAP[form.pengalamanMUA]),
    kesesuaian(ESTETIKA_MAP[paket.estetikaDekorasi], ESTETIKA_MAP[form.estetikaDekorasi]),
  ]
}

// ============================================================
// ALGORITMA MARCOS
// ============================================================
export function hitungMARCOS(
  paketList: PaketMakeup[],
  form: FormKebutuhan
): HasilMARCOS[] {
  if (paketList.length === 0) return []

  const m = paketList.length
  const n = WEIGHTS.length

  // ── Langkah 1: Matriks keputusan awal ─────────────────────
  // Semua kriteria adalah tipe BENEFIT (nilai lebih tinggi = lebih baik)
  const matrix: number[][] = paketList.map(p => buatVektorSkor(p, form))

  // ── Langkah 2: Tentukan AI dan AAI dari data aktual ────────
  // AI (Ideal):      nilai maksimum tiap kolom (terbaik dari alternatif nyata)
  // AAI (Anti-Ideal): nilai minimum tiap kolom (terburuk dari alternatif nyata)
  const AI: number[] = Array.from({ length: n }, (_, j) =>
    Math.max(...matrix.map(row => row[j]))
  )
  const AAI: number[] = Array.from({ length: n }, (_, j) =>
    Math.min(...matrix.map(row => row[j]))
  )

  // ── Langkah 3: Normalisasi matriks diperluas ──────────────
  // Tipe benefit: n_ij = x_ij / x_AI_j
  const normalisasi = (val: number, j: number): number =>
    AI[j] > 0 ? val / AI[j] : 0

  const N: number[][] = matrix.map(row => row.map((val, j) => normalisasi(val, j)))
  // AI ternormalisasi = [1, 1, 1, 1, 1]
  const N_AAI: number[] = AAI.map((val, j) => normalisasi(val, j))

  // ── Langkah 4: Matriks berbobot ───────────────────────────
  const V: number[][] = N.map(row => row.map((val, j) => WEIGHTS[j] * val))
  const V_AI: number[] = WEIGHTS.map((w) => w * 1) // AI ternormalisasi = 1
  const V_AAI: number[] = N_AAI.map((val, j) => WEIGHTS[j] * val)

  // ── Langkah 5: Hitung S_i (agregat berbobot) ──────────────
  const S: number[] = V.map(row => row.reduce((a, b) => a + b, 0))
  const S_AI = V_AI.reduce((a, b) => a + b, 0)   // = jumlah bobot = 1.0
  const S_AAI = V_AAI.reduce((a, b) => a + b, 0)

  // Hindari pembagian nol (terjadi jika semua paket memiliki skor AAI = 0)
  const safeS_AAI = S_AAI === 0 ? 1e-6 : S_AAI

  // ── Langkah 6: Derajat utilitas K+ dan K- ─────────────────
  // K+_i = S_i / S_AI  (utilitas relatif terhadap solusi ideal)
  // K-_i = S_i / S_AAI (utilitas relatif terhadap solusi anti-ideal)
  const K_plus: number[] = S.map(s => s / S_AI)
  const K_minus: number[] = S.map(s => s / safeS_AAI)

  // ── Langkah 7: Fungsi utilitas f(K_i) MARCOS ──────────────
  // Referensi: Stević, Ž. et al. (2020). Sustainable supplier selection...
  //
  // f(K+) = K- / (K+ + K-)
  // f(K-) = K+ / (K+ + K-)
  // f(K)  = (K+ + K-) · K+ · K- / (K+·K- + K+² + K-²)
  const fK: number[] = K_plus.map((kp, i) => {
    const km = K_minus[i]
    const denom = kp * km + kp * kp + km * km
    if (denom === 0) return 0
    return (kp + km) * kp * km / denom
  })

  // ── Langkah 8: Peringkat alternatif ───────────────────────
  const ranked = paketList
    .map((paket, i) => ({
      paket,
      skor: fK[i],
      kPlus: K_plus[i],
      kMinus: K_minus[i],
    }))
    .sort((a, b) => b.skor - a.skor)

  const maxSkor = ranked[0]?.skor || 1

  return ranked.map((item, idx) => ({
    paket: item.paket,
    skor: item.skor,
    kPlus: item.kPlus,
    kMinus: item.kMinus,
    persentase: Math.min(100, Math.round((item.skor / maxSkor) * 100)),
    rank: idx + 1,
  }))
}
