import type { Metadata } from 'next'
import { Fraunces, Caveat, DM_Sans } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['SOFT', 'WONK', 'opsz'],
  weight: ['400', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['500', '700'],
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '700'],
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://shahzaibhamid.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Dr. Shahzaib Hamid · Found, Chosen, Booked',
  description:
    'Dr. Shahzaib Hamid, Founder & CEO of CodeSquad, helps US clinics, med spas, dentists, doctors and plastic surgeons get more patients through SEO, AEO, Google Ads and Meta Ads. Tagline: Found, Chosen, Booked.',
  keywords: [
    'medical SEO',
    'med spa marketing',
    'dental SEO',
    'plastic surgery marketing',
    'AEO',
    'Google Ads for clinics',
    'Meta Ads for doctors',
    'CodeSquad',
    'Shahzaib Hamid',
  ],
  authors: [{ name: 'Dr. Shahzaib Hamid', url: siteUrl }],
  openGraph: {
    title: 'Dr. Shahzaib Hamid · Found, Chosen, Booked',
    description:
      'PhD-turned-founder helping US clinics plug the patient-acquisition leak — SEO, AEO, Google & Meta Ads.',
    url: siteUrl,
    siteName: 'Shahzaib Hamid',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dr. Shahzaib Hamid — Found, Chosen, Booked',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr. Shahzaib Hamid · Found, Chosen, Booked',
    description:
      'PhD-turned-founder helping US clinics plug the patient-acquisition leak.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  alternates: { canonical: siteUrl },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Dr. Shahzaib Hamid',
      jobTitle: 'Founder & CEO',
      description:
        'PhD in Computer Vision turned healthcare-marketing founder. Helps US clinics get Found, Chosen and Booked.',
      url: siteUrl,
      sameAs: ['https://codesquad.ai'],
      worksFor: { '@id': `${siteUrl}/#org` },
      knowsAbout: ['SEO', 'AEO', 'Google Ads', 'Meta Ads', 'Medical Marketing'],
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#org`,
      name: 'CodeSquad',
      url: 'https://codesquad.ai',
      founder: { '@id': `${siteUrl}/#person` },
      description:
        'SEO, AEO, Google Ads and Meta Ads for med spas, dentists, doctors and plastic surgeons.',
      areaServed: 'US',
      serviceType: [
        'SEO',
        'AEO',
        'Google Ads Management',
        'Meta Ads Management',
        'Healthcare Marketing',
      ],
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${caveat.variable} ${dmSans.variable}`}
    >
      <head>
        {/* Prevent dark-mode flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
