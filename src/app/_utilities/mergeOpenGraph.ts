import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  siteName: 'Spiral Gadgets',
  title: '',
  description: 'Explore our latest gadgets and accessories at Spiral Gadgets.',
  images: [
    {
      url: 'https://spiral-gadgets.com/media/metacard.png',
    },
  ],
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
