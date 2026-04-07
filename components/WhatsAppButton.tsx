'use client'

import { MessageCircle } from 'lucide-react'

interface WhatsAppButtonProps {
  phoneNumber?: string
  message?: string
}

export default function WhatsAppButton({
  phoneNumber = '6281234567890', // Ganti dengan nomor WhatsApp bisnis
  message = 'Halo MARCOS MUA! Saya ingin bertanya tentang paket makeup wedding. 😊',
}: WhatsAppButtonProps) {
  const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
    >
      <MessageCircle size={22} className="shrink-0" />
      <span className="text-sm font-semibold whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-xs transition-all duration-300">
        Chat WhatsApp
      </span>
    </a>
  )
}
