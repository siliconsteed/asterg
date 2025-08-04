import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script';
import Footer from '@/components/Footer';
import Header from '@/components/Header'; 

export const metadata: Metadata = {
  metadataBase: new URL('https://aistrogpt.com'),
  title: 'AI Astrology Readings | Personalized Birth Chart Analysis | AistroGPT',
  description: 'Get instant, AI-powered astrology readings tailored to your birth chart. Chat with our advanced astrology AI for personalized horoscopes, compatibility insights, and cosmic guidance.',
  keywords: [
    'AI astrology', 'birth chart analysis', 'personalized horoscope', 'astrology chat', 'zodiac readings', 'astrology AI',
    'astrology readings', 'birth chart calculator', 'natal chart', 'astrology consultation', 'zodiac compatibility', 'astrological predictions',
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
  ],
  authors: [{ name: 'AistroGPT' }],
  creator: 'AistroGPT',
  publisher: 'AistroGPT',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  alternates: {
    canonical: '/',
  },
  category: 'Astrology & Spirituality',
  classification: 'Astrology Services',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    url: 'https://aistrogpt.com/',
    title: 'AI Astrology Readings | Personalized Birth Chart Analysis | AistroGPT',
    description: 'Get instant, AI-powered astrology readings tailored to your birth chart. Chat with our advanced astrology AI for personalized horoscopes and cosmic guidance.',
    siteName: 'AistroGPT',
    locale: 'en_US',
    images: [
      {
        url: '/assets/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AistroGPT - AI Astrology Readings',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Astrology Readings | Personalized Birth Chart Analysis | AistroGPT',
    description: 'Get instant, AI-powered astrology readings tailored to your birth chart. Chat with our advanced astrology AI for personalized horoscopes and cosmic guidance.',
    images: ['/assets/og-image.jpg'],
    creator: '@aistrogpt',
    site: '@aistrogpt',
  },
  icons: {
    icon: '/assets/favicon.ico',
    apple: '/assets/apple-touch-icon.png',
    shortcut: '/assets/favicon.ico',
  },
  verification: {
    google: 'hHaaNDve3gsXRw3PD-6M-6j0Ij-QWEopQfjOy9LD1vs',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  other: {
    'application-name': 'AistroGPT',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'AistroGPT',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileColor': '#000000',
    'msapplication-tap-highlight': 'no',
    'theme-color': '#000000',
    'viewport': 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
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
        <Script
          id="structured-data-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'AistroGPT',
              url: 'https://aistrogpt.com',
              logo: 'https://aistrogpt.com/assets/og-image.jpg',
              sameAs: [
                'https://twitter.com/aistrogpt',
                // Add more social profiles if available
              ],
            }),
          }}
        />
        <Script
          id="structured-data-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'AistroGPT',
              url: 'https://aistrogpt.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://aistrogpt.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <Header /> {/* Added Header component */}
        {children}
        <Footer />
      </body>
    </html>
  )
}
