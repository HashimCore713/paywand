'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import { Product } from '../../../../payload/payload-types'
import { Media } from '../../Media'

import classes from './index.module.scss'

export const NewProductCard: React.FC<{
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

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-PK') // Adjust 'en-US' to your desired locale if different
  }

  const { description } = meta || {}

  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ')
  const href = `/products/${slug}`

  // Determine margin-top based on product keywords
  let mediaWrapperClassName = classes.mediaWrapper
  if (slug?.toLowerCase().includes('macbook') || title?.toLowerCase().includes('macbook')) {
    mediaWrapperClassName += ` ${classes.macbook}`
  } else if (slug?.toLowerCase().includes('airpods') || title?.toLowerCase().includes('airpods')) {
    mediaWrapperClassName += ` ${classes.airpods}`
  } else if (slug?.toLowerCase().includes('iphone') || title?.toLowerCase().includes('iphone')) {
    mediaWrapperClassName += ` ${classes.iphone}`
  }

  // Truncate title for screens smaller than 440px
  const [truncatedTitle, setTruncatedTitle] = useState(titleToUse)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 440 && titleToUse.length > 15) {
        setTruncatedTitle(titleToUse.substring(0, 15) + '...')
      } else {
        setTruncatedTitle(titleToUse)
      }
    }

    handleResize() // Initial check
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [titleToUse])

  // Use the first image from the gallery as the main image
  const mainImage = gallery?.[0]

  return (
    <Link href={href} className={[classes.card, className].filter(Boolean).join(' ')}>
      <div className={classes.productDetailsDiv}>
        <p className={classes.imageTag}>NEW</p>
        {truncatedTitle && <p className={classes.imageHeading}>{truncatedTitle}</p>}
        {price && <p className={classes.price}>PKR {formatPrice(price)}</p>}
      </div>
      <div className={mediaWrapperClassName}>
        <div className={classes.collageCard}>
          {!mainImage && <div className={classes.placeholder}>No image</div>}
          {mainImage && (
            <Media imgClassName={classes.image} resource={mainImage} fill />
          )}
        </div>
      </div>
    </Link>
  )
}

export default NewProductCard
