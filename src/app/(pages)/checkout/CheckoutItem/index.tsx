import React, { useState } from 'react'
import Link from 'next/link'

import { Media } from '../../../_components/Media'
import { Price } from '../../../_components/Price'

import classes from './index.module.scss'

export const CheckoutItem = ({ product, title, metaImage, quantity, index, size }) => {
  // Calculate subtotal for this item
  const calculateSubtotal = () => {
    if (product && product.price) {
      const subtotal = product.price * quantity
      return `PKR ${subtotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    }
    return 'PKR 0'
  }

  // Use the first image from the gallery if available
  const imageToUse = product.gallery && product.gallery.length > 0
  ? product.gallery[0]
  : product.meta?.image;

  return (
    <li className={classes.item} key={index}>
      <Link href={`/products/${product.slug}`} className={classes.mediaWrapper}>
        {!imageToUse && <span>No image</span>}
        {imageToUse && typeof imageToUse !== 'string' && (
          <Media className={classes.media} imgClassName={classes.image} resource={imageToUse} fill />
        )}
      </Link>

      <div className={classes.itemDetails}>
        <div className={classes.titleWrapper}>
          <h6>{title}</h6>
          <Price product={product} button={false} />
        </div>
        <p className={classes.quantity}><strong>{size}</strong></p>
        <p className={classes.quantity}>x{quantity}</p>
      </div>

      <div className={classes.subtotal}>
        <p>{calculateSubtotal()}</p>
      </div>
    </li>
  )
}
