import { ARCHIVE_BLOCK, CALL_TO_ACTION, CONTENT, MEDIA_BLOCK } from './blocks'
import { PRODUCT_CATEGORIES } from './categories'
import { META } from './meta'
import { MEDIA_FIELDS } from './media'

export const PRODUCTS = `
  query Products {
    Products(limit: 300) {
      docs {
        slug
      }
    }
  }
`

export const PRODUCT = `
  query Product($slug: String, $draft: Boolean) {
    Products(where: { slug: { equals: $slug}}, limit: 1, draft: $draft) {
      docs {
        id
        slug
        title
        stripeProductID
        ${PRODUCT_CATEGORIES}
        layout {
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
        }
        price
        stock
        priceJSON
        enablePaywall
        relatedProducts {
          price
          id
          slug
          title
          ${META}
          gallery {
          ${MEDIA_FIELDS}
          }
        }
        gallery {
          ${MEDIA_FIELDS}
        }
        ${META}
      }
    }
  }
`

export const PRODUCT_PAYWALL = `
  query Product($slug: String, $draft: Boolean) {
    Products(where: { slug: { equals: $slug}}, limit: 1, draft: $draft) {
      docs {
        paywall {
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
        }
      }
    }
  }
`

export const NEW_PRODUCTS = `
  query NewProducts {
    MacBook: Products(where: { slug: { contains: "macbook" }}, limit: 1) {
      docs {
        id
        slug
        title
        stripeProductID
        ${PRODUCT_CATEGORIES}
        layout {
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
        }
        price
        stock
        priceJSON
        enablePaywall
        relatedProducts {
          price
          id
          slug
          title
          ${META}
          gallery {
          ${MEDIA_FIELDS}
          }
        }
        gallery {
          ${MEDIA_FIELDS}
        }
        ${META}
      }
    }
    AirPods: Products(where: { slug: { contains: "airpods" }}, limit: 1) {
      docs {
        id
        slug
        title
        stripeProductID
        ${PRODUCT_CATEGORIES}
        layout {
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
        }
        price
        stock
        priceJSON
        enablePaywall
        relatedProducts {
          price
          id
          slug
          title
          ${META}
          gallery {
            ${MEDIA_FIELDS}
          }          
        }
        gallery {
          ${MEDIA_FIELDS}
        }
        ${META}
      }
    }
    iPhone: Products(where: { slug: { contains: "iphone" }}, limit: 1) {
      docs {
        id
        slug
        title
        stripeProductID
        ${PRODUCT_CATEGORIES}
        layout {
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
        }
        price
        stock
        priceJSON
        enablePaywall
        relatedProducts {
          price
          id
          slug
          title
          ${META}
          gallery {
            ${MEDIA_FIELDS}
          }
        }
        gallery {
          ${MEDIA_FIELDS}
        }
        ${META}
      }
    }
  }
`;

const categoryId = process.env.NEXT_PUBLIC_CATEGORY_ID;

export const PRODUCTS_QUICK_CHECKOUT = `
  query ProductsQuickCheckout {
    Products(
      where: { categories: { equals: "${categoryId}" } },
      limit: 8
    ) {
      docs {
        id
        slug
        title
        stripeProductID
        ${PRODUCT_CATEGORIES}
        layout {
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
        }
        price
        stock
        priceJSON
        enablePaywall
        relatedProducts {
          price
          id
          slug
          title
          ${META}
          gallery {
            ${MEDIA_FIELDS}
          }
        }
        gallery {
          ${MEDIA_FIELDS}
        }
        ${META}
      }
    }
  }
`;
