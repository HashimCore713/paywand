// next-seo.config.ts
const config = {
    title: 'Spiral Gadgets | Latest Tech Gadgets & Accessories',
    description: 'Discover the latest tech gadgets, phones, laptops, gaming consoles, and accessories at Spiral Gadgets. Your one-stop shop for all things tech in Pakistan.',
    openGraph: {
      type: 'website',
      locale: 'en_PK', 
      url: 'https://spiral-gadgets.com/',
      site_name: 'Spiral Gadgets',
      title: 'Spiral Gadgets | Tech Gadgets & Accessories',
      description: 'Get the best deals on phones, laptops, gaming consoles, and accessories at Spiral Gadgets. Shop online and enjoy fast delivery across Pakistan.',
      images: [
        {
          url: 'https://spiral-gadgets.com/media/metacard.png',
          width: 1200,
          height: 630,
          alt: 'Spiral Gadgets',
        },
      ],
    },
    twitter: {
      handle: '@SpiralGadgets',
      site: '@SpiralGadgets',
      cardType: 'summary_large_image',
    },
    additionalMetaTags: [
      {
        name: 'keywords',
        content: 'tech gadgets, phones, laptops, gaming consoles, accessories, online shopping, Pakistan',
      },
      {
        name: 'author',
        content: 'Spiral Gadgets',
      },
      {
        name: 'robots',
        content: 'index, follow',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      },
    ],
    additionalLinkTags: [
      {
        rel: 'icon',
        href: '/favicon.png', 
      },
      {
        rel: 'canonical',
        href: 'https://spiral-gadgets.com/',
      },
    ],
    instagram: {
      username: '@spiral-gadgets',
    },
  };
  
  export default config;
  