// src/app/metadata.ts

import type { Metadata } from 'next'

import { mergeOpenGraph } from './_utilities/mergeOpenGraph'

const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL),
  twitter: {
    card: 'summary_large_image',
    creator: '@Paywand',
  },
  openGraph: mergeOpenGraph(),
}

export default metadata
