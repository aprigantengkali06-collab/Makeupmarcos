'use client'

import { ShieldCheck, Award, Clock, Heart, Users, Sparkles } from 'lucide-react'

const KEUNGGULAN = [
  {
    icon: <Award size={26} className="text-primary" />,
    judul: 'MUA Bersertifikat',
    deskripsi: 'Semua MUA kami telah bersertifikat profesional dan berpengalaman lebih dari 5 tahun di industri pernikahan.',
  },
  {
    icon: <ShieldCheck size={26} className="text-primary" />,
    judul: 'Produk Aman & Halal',
    deskripsi: 'Kami hanya menggunakan produk makeup berstandar internasional yang aman di kulit dan telah tersertifikasi halal.',
  },
  {
    icon: <Clock size={26} className="text-primary" />,
    judul: 'Tepat Waktu',
    deskripsi: 'Kami berkomitmen hadir tepat waktu karena kami mengerti betapa berharganya setiap momen di hari spesial Anda.',
  },
  {
    icon: <Heart size={26} className="text-primary" />,
    judul: 'Layanan Penuh Hati',
    deskripsi: 'Setiap klien adalah prioritas kami. Kami mendengarkan impian Anda dan mewujudkannya dengan sepenuh hati.',
  },
  {
    icon: <Users size={26} className="text-primary" />,
    judul: 'Tim Profesional',
    deskripsi: 'Tim kami terdiri dari MUA senior, asisten, dan koordinator yang bekerja sinergis untuk hasil terbaik.',
  },
  {
    icon: <Sparkles size={26} className="text-primary" />,
    judul: 'Hasil Tahan Lama',
    deskripsi: 'Teknik dan produk premium kami memastikan riasan tetap segar, tahan, dan fotogenik sepanjang hari.',
  },
]

export default function WhyUsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-xs font-semibold tracking-wide mb-4">
            Keunggulan Kami
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-balance mb-3">
            Mengapa Memilih <span className="text-primary italic">MARCOS MUA?</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Kami hadir bukan hanya sebagai MUA, tapi sebagai mitra kepercayaan di hari paling istimewa dalam hidup Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {KEUNGGULAN.map((item, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl border border-border hover:border-primary/40 hover:shadow-md transition-all duration-300 bg-white"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                {item.icon}
              </div>
              <h3 className="font-serif font-semibold text-lg mb-2">{item.judul}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.deskripsi}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
