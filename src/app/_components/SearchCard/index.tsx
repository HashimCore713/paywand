'use client'

import React from 'react'
import Link from 'next/link'

import { Product } from '../../../payload/payload-types'
import { Media } from '../Media'

import classes from './index.module.scss'

export const SearchCard: React.FC<{
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
    doc: { slug, title, categories, meta, price, gallery } = {},
    className,
  } = props

  // Function to format price with commas
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US') // Adjust 'en-US' to your desired locale if different
  }

  const { description } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ') // replace non-breaking space with white space
  const href = `/products/${slug}`

  // Use the first image from the gallery as the main image
  const mainImage = gallery?.[0]

  return (
    <Link href={href} className={[classes.card, className].filter(Boolean).join(' ')}>
      <div className={classes.mediaWrapper}>
        {!mainImage && <div className={classes.placeholder}>No image</div>}
        {mainImage && (
          <Media imgClassName={classes.image} resource={mainImage} fill />
        )}
      </div>

      <div className={classes.content}>
        {titleToUse && <h4 className={classes.title}>{titleToUse}</h4>}
        {description && (
          <div className={classes.body}>
            {description && <p className={classes.description}>{sanitizedDescription}</p>}
          </div>
        )}
        {/* Display Price with commas */}
        {price && (
          <p className={classes.price}>
            <b>PKR </b>
            {formatPrice(price)}
          </p>
        )}
      </div>
    </Link>
  )
}
