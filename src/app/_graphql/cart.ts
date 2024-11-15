import { META } from './meta'

export const CART = `cart {
  items {
    product {
      id
      slug
      price
      priceJSON
      ${META}
    }
    quantity
  }
}`
