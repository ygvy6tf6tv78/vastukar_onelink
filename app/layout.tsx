import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import { siteConfig } from './data/site'
import { LanguageProvider } from './contexts/LanguageContext'
import { CartProvider } from './contexts/CartContext'
import { shopConfig } from './shops/dogra-associates/config'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

export function generateMetadata(): Metadata {
  const requestHeaders = headers()
  const forwardedHost = requestHeaders.get('x-forwarded-host')
  const host = forwardedHost || requestHeaders.get('host')
  const forwardedProtocol = requestHeaders.get('x-forwarded-proto')
  const protocol = forwardedProtocol || (host?.startsWith('localhost') ? 'http' : 'https')
  const publicUrl = host ? `${protocol}://${host}` : siteConfig.url
  const metadataBase = new URL(publicUrl)
  const imageUrl = new URL(`${shopConfig.assets.cover}?v=20260723`, metadataBase).toString()

  return {
    metadataBase,
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    keywords: siteConfig.seo.keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.credits.designer,
    alternates: { canonical: publicUrl },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: publicUrl,
      title: siteConfig.seo.title,
      description: siteConfig.seo.description,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          secureUrl: imageUrl,
          width: 1042,
          height: 398,
          alt: 'Vastukar Architects & Interiors, Jammu',
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.seo.title,
      description: siteConfig.seo.description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // JSON-LD structured data for LocalBusiness
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.seo.description,
    areaServed: {
      '@type': 'City',
      name: 'Jammu',
    },
    location: {
      '@type': 'Place',
      name: 'Jammu, India',
    },
    telephone: `+91${siteConfig.contact.phones[0]}`,
    email: siteConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.contact.address,
      addressLocality: 'Jammu',
      addressRegion: 'Jammu & Kashmir',
      addressCountry: 'IN',
    },
    serviceType: 'Architecture, interior design, project planning and turnkey execution',
    sameAs: [
      siteConfig.social?.facebook,
      siteConfig.social?.instagram,
      siteConfig.social?.twitter,
      siteConfig.social?.linkedin,
    ].filter(Boolean),
  }

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <style dangerouslySetInnerHTML={{ __html: `
          html, body {
            background: #ffffff;
            min-height: 100%;
            color: #0f172a;
          }
        ` }} />
      </head>
      <body className={`${poppins.className} antialiased min-h-screen`} style={{ 
        background: '#ffffff',
        color: '#0f172a',
      }}>
        <LanguageProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
