import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AIstroGPT',
  description: 'Your personal astrological assistant with AI capabilities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  )
}
