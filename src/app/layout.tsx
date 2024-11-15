import React from 'react'
import { Metadata } from 'next'
import { Jost } from 'next/font/google'
import { DefaultSeo } from 'next-seo'

import { AdminBar } from './_components/AdminBar'
import { Footer } from './_components/Footer'
import { Header } from './_components/Header'
import { Providers } from './_providers'
import { InitTheme } from './_providers/Theme/InitTheme'
import { mergeOpenGraph } from './_utilities/mergeOpenGraph'

import './_css/app.scss'
import SEO from '../next-seo.config' // Import the config

const jost = Jost({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jost',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-KJWDLE7382"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KJWDLE7382');
            `,
          }}
        />

        <InitTheme />
        <meta name="keywords" content="tech gadgets, phones, laptops, gaming consoles, accessories, online shopping, Pakistan" />
        <meta name="author" content="Spiral Gadgets" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_PK" />
        <meta property="og:url" content="https://spiral-gadgets.com/" />
        <meta property="og:site_name" content="Spiral Gadgets" />
        <meta property="og:title" content="Spiral Gadgets | Tech Gadgets & Accessories" />
        <meta property="og:description" content="Get the best deals on phones, laptops, gaming consoles, and accessories at Spiral Gadgets. Shop online and enjoy fast delivery across Pakistan." />
        <meta property="og:image" content="https://spiral-gadgets.com/media/metacard.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Spiral Gadgets" />

        {/* Twitter Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SpiralGadgets" />
        <meta name="twitter:title" content="Spiral Gadgets | Tech Gadgets & Accessories" />
        <meta name="twitter:description" content="Get the best deals on phones, laptops, gaming consoles, and accessories at Spiral Gadgets. Shop online and enjoy fast delivery across Pakistan." />
        <meta name="twitter:image" content="https://spiral-gadgets.com/media/metacard.png" />

        {/* Facvicon Tags */}
        {/* <link rel="icon" href="/favicon.png" sizes="32x32" />
        <link rel="icon" href="/favicon.png" sizes="48x48" /> */}
        <link rel="shortcut icon" href="favicon.png" type="image/x-icon" />
        <link rel="apple-touch-icon" href="favicon.png" />

        <link rel="canonical" href="https://spiral-gadgets.com/" />

        {/* Schema.org Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Spiral Gadgets",
              "url": "https://spiral-gadgets.com/",
              "description": "Get the best deals on phones, laptops, gaming consoles, and accessories at Spiral Gadgets. Shop online and enjoy fast delivery across Pakistan.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://spiral-gadgets.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </head>
      <body className={jost.variable}>
        <Providers>
          {/* @ts-expect-error */}
          <Header />
          <main className="main">{children}</main>
          {/* @ts-expect-error */}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL),
  twitter: {
    card: 'summary_large_image',
    creator: '@SpiralGadgets',
  },
  openGraph: mergeOpenGraph(),
}
