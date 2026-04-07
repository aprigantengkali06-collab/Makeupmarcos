'use client'

import { useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { findUserByCredentials, registerUser, setCurrentUser } from '@/lib/db'
import type { User } from '@/lib/data'
// Note: User type masih dari lib/data, DB functions dari lib/db

interface AuthModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (user: User) => void
  defaultTab?: 'login' | 'register'
}

export default function AuthModal({ open, onClose, onSuccess, defaultTab = 'login' }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(defaultTab)
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [regForm, setRegForm] = useState({ nama: '', email: '', noHp: '', password: '', konfirmasi: '' })

  if (!open) return null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const found = await findUserByCredentials(loginForm.email, loginForm.password)
      if (!found) {
        setError('Email atau password salah.')
        setLoading(false)
        return
      }
      setCurrentUser(found)
      onSuccess(found)
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (regForm.password !== regForm.konfirmasi) {
      setError('Password tidak cocok.')
      return
    }
    if (regForm.password.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }
    setLoading(true)
    try {
      const { user: newUser, error } = await registerUser({
        nama: regForm.nama,
        email: regForm.email,
        noHp: regForm.noHp,
        password: regForm.password,
      })
      if (error || !newUser) {
        setError(error ?? 'Gagal mendaftar.')
        setLoading(false)
        return
      }
      setCurrentUser(newUser)
      onSuccess(newUser)
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/30 px-6 pt-8 pb-6">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/10 transition-colors">
            <X size={18} />
          </button>
          <h2 className="text-2xl font-serif font-semibold text-foreground">
            {tab === 'login' ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {tab === 'login' ? 'Masuk untuk melanjutkan booking Anda' : 'Daftar untuk mulai booking paket impian'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'login' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => { setTab('login'); setError('') }}
          >
            Masuk
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'register' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
            onClick={() => { setTab('register'); setError('') }}
          >
            Daftar
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 px-4 py-3 bg-destructive/10 text-destructive text-sm rounded-lg">
              {error}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="nama@email.com"
                  className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={loginForm.password}
                    onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="Password"
                    className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring pr-10"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Demo: admin@marcos.com / admin123
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={regForm.nama}
                  onChange={e => setRegForm(p => ({ ...p, nama: e.target.value }))}
                  placeholder="Nama Anda"
                  className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="nama@email.com"
                  className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">No. HP / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={regForm.noHp}
                  onChange={e => setRegForm(p => ({ ...p, noHp: e.target.value }))}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={regForm.password}
                    onChange={e => setRegForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="Min. 6 karakter"
                    className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring pr-10"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Konfirmasi Password</label>
                <input
                  type="password"
                  required
                  value={regForm.konfirmasi}
                  onChange={e => setRegForm(p => ({ ...p, konfirmasi: e.target.value }))}
                  placeholder="Ulangi password"
                  className="w-full px-4 py-3 border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
