'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCurrentUser, setCurrentUser } from '@/lib/db'
import type { User } from '@/lib/data'
import { Menu, X, User as UserIcon, LogOut, ChevronDown } from 'lucide-react'

interface NavbarProps {
  onLoginClick?: () => void
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  useEffect(() => {
    setUser(getCurrentUser())
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    setCurrentUser(null)
    setUser(null)
    setDropOpen(false)
    window.location.href = '/'
  }

  const navLinks = [
    { href: '/#katalog', label: 'Katalog' },
    { href: '/#spk', label: 'Temukan Paket' },
    { href: '/#galeri', label: 'Galeri' },
    { href: '/#testimoni', label: 'Testimoni' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl md:text-3xl font-serif font-bold tracking-wide text-primary">
              MARCOS
            </span>
            <span className="hidden sm:block text-xs text-muted-foreground tracking-widest uppercase mt-1">
              MUA
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <a
                key={l.href}
                href={l.href}
                className={`text-sm tracking-wide font-medium transition-colors ${
                  scrolled ? 'text-foreground hover:text-primary' : 'text-foreground/90 hover:text-primary'
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 hover:bg-primary/5 transition-colors text-sm"
                >
                  <UserIcon size={16} className="text-primary" />
                  <span className="font-medium">{user.nama.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>
                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-border overflow-hidden">
                    {user.role === 'admin' ? (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-muted transition-colors"
                        onClick={() => setDropOpen(false)}
                      >
                        <UserIcon size={14} />
                        Dashboard Admin
                      </Link>
                    ) : (
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-muted transition-colors"
                        onClick={() => setDropOpen(false)}
                      >
                        <UserIcon size={14} />
                        Dashboard Saya
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-destructive hover:bg-muted transition-colors"
                    >
                      <LogOut size={14} />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="text-sm font-medium px-4 py-2 hover:text-primary transition-colors"
                >
                  Masuk
                </button>
                <button
                  onClick={onLoginClick}
                  className="text-sm font-medium px-5 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                >
                  Daftar
                </button>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-border">
            <div className="py-4 flex flex-col gap-1">
              {navLinks.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  className="px-4 py-3 text-sm font-medium hover:bg-muted transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-2 px-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      href={user.role === 'admin' ? '/admin' : '/dashboard'}
                      className="text-center py-2 border border-primary text-primary rounded-full text-sm"
                      onClick={() => setMenuOpen(false)}
                    >
                      {user.role === 'admin' ? 'Dashboard Admin' : 'Dashboard Saya'}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="py-2 text-destructive text-sm"
                    >
                      Keluar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { onLoginClick?.(); setMenuOpen(false) }}
                      className="py-2 border border-primary text-primary rounded-full text-sm"
                    >
                      Masuk
                    </button>
                    <button
                      onClick={() => { onLoginClick?.(); setMenuOpen(false) }}
                      className="py-2 bg-primary text-primary-foreground rounded-full text-sm"
                    >
                      Daftar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
