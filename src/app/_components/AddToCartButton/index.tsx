// src/app/_components/AddToCartButton/index.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Product } from '../../../payload/payload-types'
import { useCart } from '../../_providers/Cart'
import { Button, Props } from '../Button'

import classes from './index.module.scss'

export const AddToCartButton: React.FC<{
  product: Product
  quantity?: number
  selectedSize?: string  // Add selectedSize as a prop
  className?: string
  appearance?: Props['appearance']
  disabled?: boolean
}> = props => {
  const { product, quantity = 1, selectedSize, className, appearance = 'primary', disabled = false } = props

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
        size: selectedSize,  // Pass selected size when adding to cart
      })
    }
  }

  return (
    <Button
      href={isInCart ? '/cart' : undefined}
      type={!isInCart ? 'button' : undefined}
      label={isInCart ? `✓ View in cart` : `Add to cart`}
      el={isInCart ? 'link' : undefined}
      appearance={appearance}
      className={[
        className,
        classes.addToCartButton,
        appearance === 'default' && isInCart && classes.green,
        !hasInitializedCart && classes.hidden,
        disabled && classes.disabled,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={handleClick}
      disabled={disabled}
    />
  )
}
