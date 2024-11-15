'use client'

import React from 'react'
import Link from 'next/link'

import { Product } from '../../../../payload/payload-types'
import { AddToCartButton } from '../../AddToCartButton'
import { BuyNowButton } from '../../BuyNowButton'
import { Media } from '../../Media'

import classes from './index.module.scss'

const QuickCard: React.FC<{
  alignItems?: 'center'
  className?: string
  showCategories?: boolean
  hideImagesOnMobile?: boolean
  title?: string
  relationTo?: 'products'
  doc?: Product
}> = props => {
  const {
    showCategories,
    title: titleFromProps,
    doc,
    doc: { slug, title, categories, meta, price, stock, gallery } = {},
    className,
  } = props

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PK')
  }

  const { description } = meta || {}
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ')
  const href = `/products/${slug}`
  const isOutOfStock = stock === 0

  // const hasTargetCategory = categories?.some(category => category.id === '66d72957f1183bf501993fe3')

  // if (!hasTargetCategory) {
  //   return null // Don't render if the product does not have the target category
  // }

  // Use the first image from the gallery as the main image
  const mainImage = gallery?.[0]

  return (
    <div className={[classes.card, className].filter(Boolean).join(' ')}>
      <BuyNowButton
        product={doc}
        className={`${classes.BuyNowButton} ${isOutOfStock ? classes.disabled : ''}`}
        disabled={isOutOfStock}
      />
      <Link
        href={href}
        className={[classes.card, classes.subClass, className].filter(Boolean).join(' ')}
      >
        <div className={classes.productDetailsDiv}>
          <p className={classes.imageTag}>Trending</p>
          {titleToUse && <p className={classes.imageHeading}>{titleToUse}</p>}
          {price && <p className={classes.price}>PKR {formatPrice(price)}</p>}
        </div>
        <div className={classes.mediaWrapper}>
          <div className={classes.collageCard}>
            {!mainImage && <div className={classes.placeholder}>No image</div>}
            {mainImage && (
              <Media imgClassName={classes.image} resource={mainImage} fill />
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default QuickCard
