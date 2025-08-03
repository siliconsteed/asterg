import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script';
import Footer from '@/components/Footer';
import Header from '@/components/Header'; 

export const metadata: Metadata = {
  metadataBase: new URL('https://aistrogpt.com'),
  title: 'AI Astrology Readings | Personalized Birth Chart Analysis | AistroGPT',
  description: 'Get instant, AI-powered astrology readings tailored to your birth chart. Chat with our advanced astrology AI for personalized horoscopes, compatibility insights, and cosmic guidance.',
  keywords: ['AI astrology', 'birth chart analysis', 'personalized horoscope', 'astrology chat', 'zodiac readings', 'astrology AI'],
  authors: [{ name: 'AistroGPT' }],
  robots: 'index, follow',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://aistrogpt.com/',
    title: 'AI Astrology Readings | Personalized Birth Chart Analysis | AistroGPT',
    description: 'Get instant, AI-powered astrology readings tailored to your birth chart. Chat with our advanced astrology AI for personalized horoscopes and cosmic guidance.',
    images: ['/assets/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Astrology Readings | Personalized Birth Chart Analysis | AistroGPT',
    description: 'Get instant, AI-powered astrology readings tailored to your birth chart. Chat with our advanced astrology AI for personalized horoscopes and cosmic guidance.',
    images: ['/assets/og-image.jpg'],
  },
  icons: {
    icon: '/assets/favicon.ico',
    apple: '/assets/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>

        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-XQ0ZNR15YL" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2424521847584295"
          crossOrigin="anonymous"></script>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="f0415c7e-31ef-47c5-b6a3-9353fa828eee"></script>
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XQ0ZNR15YL');
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <Header /> {/* Added Header component */}
        {children}
        <Footer />
      </body>
    </html>
  )
}
