'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Product } from '../../../payload/payload-types'
import { useCart } from '../../_providers/Cart'
import { Button, Props } from '../Button'

import classes from './index.module.scss'

export const BuyNowButton: React.FC<{
  product: Product
  quantity?: number
  className?: string
  appearance?: Props['appearance']
  disabled?: boolean // Add this line
}> = props => {
  const { product, quantity = 1, className, appearance = 'buy', disabled = false } = props

  const { cart, addItemToCart, isProductInCart, hasInitializedCart } = useCart()

  const [isInCart, setIsInCart] = useState<boolean>()
  const router = useRouter()

  useEffect(() => {
    setIsInCart(isProductInCart(product))
  }, [isProductInCart, product, cart])

  const handleClick = () => {
    if (disabled) return // Prevent action if disabled
    if (isInCart) {
      router.push('/cart') // Navigate to the cart page if the product is already in the cart
    } else {
      addItemToCart({
        product,
        quantity,
      })
      router.push('/cart') //enable to automatically redirect to Cart page
    }
  }
  return (
    <Button
      href={isInCart ? '/cart' : undefined}
      type={!isInCart ? 'button' : undefined}
      label={'Buy now'}
      el={isInCart ? 'link' : undefined}
      appearance={appearance}
      className={[
        className,
        classes.buyNowButton,
        appearance === 'default' && isInCart && classes.green,
        !hasInitializedCart && classes.hidden,
        disabled && classes.disabled, // Add this line
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={handleClick}
      disabled={disabled} // Add this line
    />
  )
}
