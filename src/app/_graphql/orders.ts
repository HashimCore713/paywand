import { PRODUCT } from './products'

export const ORDERS = `
  query Orders {
    Orders(limit: 300) {
      docs {
        id
      }
    }
  }
`

export const ORDER = `
  query Order($id: String) {
    Orders(where: { id: { equals: $id } }) {
      docs {
        id
        orderedBy
        items {
          product {
            id
            name
          }
          price
          quantity
          selectedSize
        }
        name
        address
        phoneNumber
        email
        paymentMethod
        status
      }
    }
  }
`;

