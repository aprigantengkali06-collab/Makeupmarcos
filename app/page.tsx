'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import KatalogSection from '@/components/KatalogSection'
import WhyUsSection from '@/components/WhyUsSection'
import SPKMarcos from '@/components/SPKMarcos'
import GaleriSection from '@/components/GaleriSection'
import TestimoniSection from '@/components/TestimoniSection'
import Footer from '@/components/Footer'
import AuthModal from '@/components/AuthModal'
import PaketDetailModal from '@/components/PaketDetailModal'
import BookingModal from '@/components/BookingModal'
import WhatsAppButton from '@/components/WhatsAppButton'
import { getPaket, getGaleri, getTestimoni, getCurrentUser } from '@/lib/data'
import type { PaketMakeup, User } from '@/lib/data'

export default function HomePage() {
  const [paketList, setPaketList] = useState<PaketMakeup[]>([])
  const [galeriList, setGaleriList] = useState<ReturnType<typeof getGaleri>>([])
  const [testimoniList, setTestimoniList] = useState<ReturnType<typeof getTestimoni>>([])
  const [user, setUser] = useState<User | null>(null)

  const [authOpen, setAuthOpen] = useState(false)
  const [detailPaket, setDetailPaket] = useState<PaketMakeup | null>(null)
  const [bookingPaket, setBookingPaket] = useState<PaketMakeup | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)

  useEffect(() => {
    setPaketList(getPaket())
    setGaleriList(getGaleri())
    setTestimoniList(getTestimoni())
    setUser(getCurrentUser())
  }, [])

  const handleBooking = (paket: PaketMakeup) => {
    setBookingPaket(paket)
    setDetailPaket(null)
    setBookingOpen(true)
  }

  const handleAuthSuccess = (u: User) => {
    setUser(u)
    setAuthOpen(false)
  }

  return (
    <main>
      <Navbar onLoginClick={() => setAuthOpen(true)} />

      <HeroSection
        onSPKClick={() => document.getElementById('spk')?.scrollIntoView({ behavior: 'smooth' })}
        onKatalogClick={() => document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' })}
      />

      <KatalogSection
        paketList={paketList}
        onDetail={setDetailPaket}
        onBooking={handleBooking}
      />

      <WhyUsSection />

      <SPKMarcos
        paketList={paketList}
        onDetail={setDetailPaket}
        onBooking={handleBooking}
      />

      <GaleriSection galeriList={galeriList} />

      <TestimoniSection testimoniList={testimoniList} />

      <Footer />

      {/* Floating WhatsApp button */}
      <WhatsAppButton />

      {/* Modals */}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <PaketDetailModal
        paket={detailPaket}
        onClose={() => setDetailPaket(null)}
        onBooking={handleBooking}
      />

      <BookingModal
        paket={bookingPaket}
        user={user}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        onLoginRequired={() => setAuthOpen(true)}
      />
    </main>
  )
}
