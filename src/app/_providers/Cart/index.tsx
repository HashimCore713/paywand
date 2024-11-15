'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'

import { Product, User } from '../../../payload/payload-types'
import { useAuth } from '../Auth'
import { CartItem, cartReducer } from './reducer'

export type CartContext = {
  cart: User['cart']
  addItemToCart: (item: CartItem) => void
  deleteItemFromCart: (product: Product) => void
  cartIsEmpty: boolean | undefined
  clearCart: () => void
  isProductInCart: (product: Product) => boolean
  cartTotal: {
    formatted: string
    raw: number
  }
  hasInitializedCart: boolean
}

const Context = createContext({} as CartContext)

export const useCart = () => useContext(Context)

const arrayHasItems = (array: any[]) => Array.isArray(array) && array.length > 0

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, status: authStatus } = useAuth()

  const [cart, dispatchCart] = useReducer(cartReducer, {
    items: [],
  })

  const [total, setTotal] = useState<{
    formatted: string
    raw: number
  }>({
    formatted: '0.00',
    raw: 0,
  })

  const hasInitialized = useRef(false)
  const [hasInitializedCart, setHasInitialized] = useState(false)

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true

      const syncCartFromLocalStorage = async () => {
        const localCart = localStorage.getItem('cart')
        const parsedCart = JSON.parse(localCart || '{}')

        if (parsedCart?.items && parsedCart?.items?.length > 0) {
          const initialCart = await Promise.all(
            parsedCart.items.map(async ({ product, quantity }) => {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${product}`,
              )
              const data = await res.json()
              return {
                product: data,
                quantity,
              }
            }),
          )

          dispatchCart({
            type: 'SET_CART',
            payload: {
              items: initialCart,
            },
          })
        } else {
          dispatchCart({
            type: 'SET_CART',
            payload: {
              items: [],
            },
          })
        }
      }

      syncCartFromLocalStorage()
    }
  }, [])

  useEffect(() => {
    if (!hasInitialized.current) return

    if (authStatus === 'loggedIn') {
      dispatchCart({
        type: 'MERGE_CART',
        payload: user?.cart,
      })
    }

    if (authStatus === 'loggedOut') {
      dispatchCart({
        type: 'CLEAR_CART',
      })
    }
  }, [user, authStatus])

  useEffect(() => {
    if (!hasInitialized.current || user === undefined) return

    const flattenedCart = {
      ...cart,
      items: cart?.items
        ?.map(item => {
          if (!item?.product || typeof item?.product !== 'object') {
            return null
          }

          return {
            ...item,
            product: item?.product?.id,
            quantity: typeof item?.quantity === 'number' ? item?.quantity : 0,
          }
        })
        .filter(Boolean) as CartItem[],
    }

    if (user) {
      try {
        const syncCartToPayload = async () => {
          const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`, {
            credentials: 'include',
            method: 'PATCH',
            body: JSON.stringify({
              cart: flattenedCart,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          })

          if (req.ok) {
            localStorage.setItem('cart', '[]')
          }
        }

        syncCartToPayload()
      } catch (e) {
        console.error('Error while syncing cart to Payload.')
      }
    } else {
      localStorage.setItem('cart', JSON.stringify(flattenedCart))
    }

    setHasInitialized(true)
  }, [user, cart])

  const isProductInCart = useCallback(
    (incomingProduct: Product): boolean => {
      let isInCart = false
      const { items: itemsInCart } = cart || {}
      if (Array.isArray(itemsInCart) && itemsInCart.length > 0) {
        isInCart = Boolean(
          itemsInCart.find(({ product }) =>
            typeof product === 'string'
              ? product === incomingProduct.id
              : product?.id === incomingProduct.id,),
        )
      }
      return isInCart
    },
    [cart],
  )

  const addItemToCart = useCallback(incomingItem => {
    dispatchCart({
      type: 'ADD_ITEM',
      payload: incomingItem,
    })
  }, [])

  const deleteItemFromCart = useCallback(incomingProduct => {
    dispatchCart({
      type: 'DELETE_ITEM',
      payload: incomingProduct,
    })
  }, [])

  const clearCart = useCallback(() => {
    dispatchCart({
      type: 'CLEAR_CART',
    })
  }, [])

  useEffect(() => {
    if (!hasInitialized) return

    const newTotal =
      cart?.items?.reduce((acc, item) => {
        return (
          acc +
          (typeof item.product === 'object'
            ? item?.product?.price * (typeof item?.quantity === 'number' ? item?.quantity : 0)
            : 0)
        )
      }, 0) || 0

    setTotal({
      formatted: newTotal.toLocaleString('en-US', {
        style: 'currency',
        currency: 'PKR',
      }),
      raw: newTotal,
    })
  }, [cart, hasInitialized])

  return (
    <Context.Provider
      value={{
        cart,
        addItemToCart,
        deleteItemFromCart,
        cartIsEmpty: hasInitializedCart && !arrayHasItems(cart?.items),
        clearCart,
        isProductInCart,
        cartTotal: total,
        hasInitializedCart,
      }}
    >
      {children && children}
    </Context.Provider>
  )
}
