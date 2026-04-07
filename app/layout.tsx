import type { Metadata } from 'next'
import { Cormorant_Garamond, Lato } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MARCOS MUA — Paket Wedding Makeup Artist Profesional',
  description:
    'Temukan paket makeup wedding terbaik dengan sistem rekomendasi cerdas SPK MARCOS. Rias pengantin profesional, natural hingga glamour, adat hingga modern.',
  keywords: 'makeup artist, wedding, bridal, MUA, MARCOS, paket makeup, rias pengantin, SPK',
  openGraph: {
    title: 'MARCOS MUA — Wedding Makeup Artist',
    description: 'Tampil memukau di hari istimewa Anda dengan paket makeup wedding pilihan MARCOS.',
    type: 'website',
    locale: 'id_ID',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${cormorant.variable} ${lato.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
