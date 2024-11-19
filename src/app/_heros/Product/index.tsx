'use client'
// src/app/_heros/Product/index.tsx
import React, { useState } from 'react'

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
    sizes,  // Assuming your product has a `sizes` field
  } = product

  const [selectedImage, setSelectedImage] = useState(gallery?.[0])
  const [selectedSize, setSelectedSize] = useState<string>('')  // State for selected size

  // Function to format price with commas
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US')
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

  const isOutOfStock = stock === 0
  const { text: stockStatus, colorClass } = getStockInfo(stock)

  // Handler for thumbnail click
  const handleThumbnailClick = (image: any) => {
    setSelectedImage(image)
  }

  // Handler for size selection
  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSize(event.target.value)
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

        {price && (
          <p className={classes.price}>
            <b>PKR </b>
            {formatPrice(price)}
          </p>
        )}
        {/* Choose Size Dropdown */}
        {sizes && sizes.length > 0 && (
          <div className={classes.sizeSelector}>
            <label htmlFor="size">Choose Size:</label>
            <select
              id="size"
              value={selectedSize}
              onChange={handleSizeChange}
              disabled={isOutOfStock}
            >
              <option value="">Select Size</option>
              {sizes.map((size, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={classes.description}>
          <h6>Description</h6>
          <p>{description}</p>
        </div>

        <AddToCartButton
          product={product}
          selectedSize={selectedSize}  // Pass selected size to AddToCartButton
          className={`${classes.addToCartButton} ${isOutOfStock ? classes.disabled : ''}`}
          disabled={isOutOfStock}
        />
      </div>
    </Gutter>
  )
}
