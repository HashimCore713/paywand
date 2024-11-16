// next-seo.config.ts
const config = {
    title: 'Paywand | Latest Weaving Stories into Styles',
    description: 'Discover the latest tech gadgets, phones, laptops, gaming consoles, and accessories at Paywand. Your one-stop shop for all things tech in Pakistan.',
    openGraph: {
      type: 'website',
      locale: 'en_PK', 
      url: 'https://paywand.pk/',
      site_name: 'Paywand',
      title: 'Paywand | Weaving Stories into Styles',
      description: 'Get the best deals on shirts, sweatshirts, hoodies, and accessories at Paywand. Shop online and enjoy fast delivery across Pakistan.',
      images: [
        {
          url: 'https://paywand.pk/media/metacard.png',
          width: 1200,
          height: 630,
          alt: 'Paywand',
        },
      ],
    },
    twitter: {
      handle: '@Paywand',
      site: '@Paywand',
      cardType: 'summary_large_image',
    },
    additionalMetaTags: [
      {
        name: 'keywords',
        content: 'shirts, hoodies, sweatshirts, accessories, online shopping, Pakistan',
      },
      {
        name: 'author',
        content: 'Paywand',
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
        href: 'https://paywand.pk/',
      },
    ],
    instagram: {
      username: '@paywand.pk',
    },
  };
  
  export default config;
  