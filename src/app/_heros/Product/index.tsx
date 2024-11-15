'use client'
import React, { Fragment, useState } from 'react'

import { Category, Product } from '../../../payload/payload-types'
import { AddToCartButton } from '../../_components/AddToCartButton'
import { Gutter } from '../../_components/Gutter'
import { ImageGallery } from '../../_components/Gallery'

import classes from './index.module.scss'

export const ProductHero: React.FC<{
  product: Product
}> = ({ product }) => {
  const {
    title,
    categories,
    meta: { description },
    price,
    stock,
    gallery,
  } = product

  // Initialize selectedImage with the first gallery image
  const [selectedImage, setSelectedImage] = useState(gallery?.[0])

  // Function to format price with commas
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US') // Adjust 'en-US' to your desired locale if different
  }

  // Function to determine stock status text and color
  const getStockInfo = (stock: number): { text: string; colorClass: string } => {
    let stockText = ''
    let colorClass = ''

    if (stock === 0) {
      stockText = 'Out Of Stock'
      colorClass = classes.outOfStock
    } else if (stock >= 15) {
      stockText = 'In Stock'
      colorClass = classes.inStock
    } else if (stock >= 8) {
      stockText = 'Low Stock'
      colorClass = classes.lowStock
    } else {
      stockText = `${stock} Left`
      colorClass = classes.otherStock
    }

    return { text: stockText, colorClass }
  }

  // Determine if Add to Cart button should be disabled
  const isOutOfStock = stock === 0

  // Get stock status and color class
  const { text: stockStatus, colorClass } = getStockInfo(stock)

  // Handler for thumbnail click
  const handleThumbnailClick = (image: any) => {
    setSelectedImage(image)
  }

  return (
    <Gutter className={classes.productHero}>
      <div>
        <ImageGallery
          metaImage={selectedImage}
          gallery={gallery}
          onThumbnailClick={handleThumbnailClick}
        />
      </div>

      <div className={classes.details}>
        <h3 className={classes.title}>{title}</h3>

        <div className={classes.categoryWrapper}>
          <div className={classes.categories}>
            {categories?.map((category, index) => {
              const { title: categoryTitle } = category as Category

              const titleToUse = categoryTitle || 'Generic'
              const isLast = index === categories.length - 1

              return (
                <p key={index} className={classes.category}>
                  {titleToUse} <span className={classes.separator}>|</span>
                </p>
              )
            })}
          </div>
          <p className={`${classes.stock} ${colorClass}`}>{stockStatus}</p>
        </div>

        {/* Display Price with commas */}
        {price && (
          <p className={classes.price}>
            <b>PKR </b>
            {formatPrice(price)}
          </p>
        )}

        <div className={classes.description}>
          <h6>Description</h6>
          <p>{description}</p>
        </div>

        <AddToCartButton
          product={product}
          className={`${classes.addToCartButton} ${isOutOfStock ? classes.disabled : ''}`}
          disabled={isOutOfStock} // Disable the button if out of stock
        />
      </div>
    </Gutter>
  )
}