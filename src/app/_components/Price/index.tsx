'use client'

import React, { useEffect, useState } from 'react'

import { Product } from '../../../payload/payload-types'

import classes from './index.module.scss'

export const priceFromNumber = (price: number, quantity: number = 1, raw?: boolean): string => {
  const priceValue = price * quantity

  if (raw) return priceValue.toString()

  return priceValue.toLocaleString('en-PK', {
    style: 'currency',
    currency: 'PKR',
  })
}

export const Price: React.FC<{
  product: Product
  quantity?: number
  button?: 'addToCart' | 'removeFromCart' | false
}> = props => {
  const { product, product: { price } = {}, button = 'addToCart', quantity } = props

  const [priceState, setPriceState] = useState<{
    actualPrice: string
    withQuantity: string
  }>(() => ({
    actualPrice: priceFromNumber(price),
    withQuantity: priceFromNumber(price, quantity),
  }))

  useEffect(() => {
    setPriceState({
      actualPrice: priceFromNumber(price),
      withQuantity: priceFromNumber(price, quantity),
    })
  }, [price, quantity])

  return (
    <div className={classes.actions}>
      {typeof priceState?.actualPrice !== 'undefined' && priceState?.withQuantity !== '' && (
        <div className={classes.price}>
          <p>{priceState?.withQuantity}</p>
        </div>
      )}
    </div>
  )
}
