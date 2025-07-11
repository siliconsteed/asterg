import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script';
import Footer from '@/components/Footer';
import Header from '@/components/Header'; // Added Header import

export const metadata: Metadata = {
  title: 'AIstroGPT',
  description: 'Your personal astrological assistant with AI capabilities that can give insights based on planets in their zodiac signs.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
