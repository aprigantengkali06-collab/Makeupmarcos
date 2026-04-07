'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/db'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const u = getCurrentUser()
    if (!u || u.role !== 'admin') {
      window.location.href = '/'
    } else {
      setChecking(false)
    }
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Memuat dashboard admin...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
