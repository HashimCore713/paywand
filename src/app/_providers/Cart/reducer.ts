import type { CartItems, Product, User } from '../../../payload/payload-types'

export type CartItem = CartItems[0]

type CartType = User['cart']

type CartAction =
  | {
      type: 'SET_CART'
      payload: CartType
    }
  | {
      type: 'MERGE_CART'
      payload: CartType
    }
  | {
      type: 'ADD_ITEM'
      payload: CartItem
    }
  | {
      type: 'DELETE_ITEM'
      payload: Product
    }
  | {
      type: 'CLEAR_CART'
    }

    export const cartReducer = (cart: CartType, action: CartAction): CartType => {
      let updatedCart = { ...cart }
      console.log('Action received:', action)
      console.log('Initial Cart State:', cart)
    
      switch (action.type) {
        case 'SET_CART':
          updatedCart = action.payload
          console.log('SET_CART Action - New Cart from Payload:', updatedCart)
          break
    
          case 'MERGE_CART':
            updatedCart.items = [
              ...(cart?.items || []),
              ...(action.payload?.items || []),
            ].reduce((acc: CartItem[], item) => {
              const productId = typeof item.product === 'string' ? item.product : item.product?.id;
              const size = item.size;
          
              // Find if the item already exists in the accumulator (cart)
              const indexInAcc = acc.findIndex(({ product, size: existingSize }) =>
                (typeof product === 'string' ? product === productId : product?.id === productId) && existingSize === size
              );
          
              if (indexInAcc > -1) {
                // If item exists, update quantity
                acc[indexInAcc] = {
                  ...acc[indexInAcc],
                  quantity: acc[indexInAcc].quantity + item.quantity,
                };
              } else {
                // If item doesn't exist, add new item
                acc.push(item);
              }
              return acc;
            }, []);
            break;
          
    
        case 'ADD_ITEM': {
          const { payload: incomingItem } = action
          const productId = typeof incomingItem.product === 'string' ? incomingItem.product : incomingItem.product?.id
          const size = incomingItem.size
    
          const indexInCart = cart.items.findIndex(({ product, size: existingSize }) =>
            (typeof product === 'string' ? product === productId : product?.id === productId) && existingSize === size
          )
    
          if (indexInCart === -1) {
            console.log('Adding new item to cart:', incomingItem)
            // Only add item if it doesn't already exist in the cart
            updatedCart.items = [...cart.items, incomingItem]
          } else {
            console.log('Item already in cart, updating quantity:', incomingItem)
            // If item exists, update quantity (if quantity is provided)
            updatedCart.items[indexInCart] = {
              ...updatedCart.items[indexInCart],
              quantity: incomingItem.quantity > 0 ? incomingItem.quantity : updatedCart.items[indexInCart].quantity,
            }
          }
          break
        }
    
        case 'DELETE_ITEM': {
          const indexInCart = cart.items.findIndex(({ product }) =>
            typeof product === 'string' ? product === action.payload.id : product?.id === action.payload.id
          )
    
          if (indexInCart > -1) {
            console.log('Deleting item from cart:', action.payload)
            updatedCart.items = updatedCart.items.filter((_, index) => index !== indexInCart)
          }
          break
        }
    
        case 'CLEAR_CART':
          console.log('Clearing the entire cart.')
          updatedCart.items = []
          break
    
        default:
          console.log('No action matched.')
          return cart
      }
    
      console.log('Updated Cart:', updatedCart)
      // Save the updated cart to localStorage to persist across reloads
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      return updatedCart
    }
    
