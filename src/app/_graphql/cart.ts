import { META } from './meta'

export const CART = `cart {
  items {
    product {
      id
      slug
      price
      sizes
      priceJSON
      ${META}
    }
    quantity
    size
  }
}`
