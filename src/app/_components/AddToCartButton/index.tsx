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
  className?: string
  appearance?: Props['appearance']
  disabled?: boolean
  selectedSize?: string // New prop for size
}> = props => {
  const {
    product,
    quantity = 1,
    className,
    appearance = 'primary',
    disabled = false,
    selectedSize = '', // Default to an empty string if no size is selected
  } = props

  const { cart, addItemToCart, isProductInCart, hasInitializedCart } = useCart()
  const [isInCart, setIsInCart] = useState<boolean>()
  const router = useRouter()

  useEffect(() => {
    console.log("Selected Size in AddToCartButton:", selectedSize) // Log the selected size
    setIsInCart(isProductInCart(product, selectedSize)) // Check if the product with selected size is in the cart
  }, [isProductInCart, product, selectedSize, cart])

  const handleClick = () => {
    if (disabled) return // Prevent action if disabled
    if (isInCart) {
      router.push('/cart') // Navigate to the cart page if the product is already in the cart
    } else {
      addItemToCart({
        product,
        quantity,
        size: selectedSize, // Include the selected size when adding to cart
      })
      // router.push('/cart') // Uncomment if you want to redirect to cart after adding
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
