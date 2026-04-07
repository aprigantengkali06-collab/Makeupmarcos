import { Phone, Mail, MapPin, Instagram, MessageCircle } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-serif font-bold mb-3" style={{ color: 'var(--rose-gold)' }}>
              MARCOS MUA
            </h3>
            <p className="text-white/70 text-sm leading-relaxed mb-5 max-w-xs">
              Makeup Artist & Wedding Specialist terpercaya dengan pengalaman lebih dari 8 tahun. Kami hadir untuk mewujudkan tampilan impian Anda di hari istimewa.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram MARCOS MUA" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary/70 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" aria-label="WhatsApp MARCOS MUA" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary/70 transition-colors">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="font-semibold text-sm mb-4 tracking-wide">Layanan</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-white/65">
              {['Makeup Pengantin', 'Hairdo & Sanggul', 'Dekorasi Pelaminan', 'Makeup Wisuda', 'Makeup Pesta'].map(l => (
                <li key={l}>
                  <a href="#katalog" className="hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-semibold text-sm mb-4 tracking-wide">Kontak</h4>
            <ul className="flex flex-col gap-3 text-sm text-white/65">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="shrink-0 mt-0.5" style={{ color: 'var(--rose-gold)' }} />
                <span>Jl. Melati No. 45, Jakarta Selatan, DKI Jakarta</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="shrink-0" style={{ color: 'var(--rose-gold)' }} />
                <a href="tel:+6281234567890" className="hover:text-white transition-colors">+62 812-3456-7890</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="shrink-0" style={{ color: 'var(--rose-gold)' }} />
                <a href="mailto:halo@marcosmua.com" className="hover:text-white transition-colors">halo@marcosmua.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>&copy; 2025 MARCOS MUA Studio. All rights reserved.</p>
          <p>Dilengkapi SPK MARCOS untuk rekomendasi paket terbaik</p>
        </div>
      </div>
    </footer>
  )
}
