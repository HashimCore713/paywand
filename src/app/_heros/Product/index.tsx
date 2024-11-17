'use client'

import React, { useState } from 'react'
import { Category, Product } from '../../../payload/payload-types'
import { AddToCartButton } from '../../_components/AddToCartButton'
import { Gutter } from '../../_components/Gutter'
import { ImageGallery } from '../../_components/Gallery'
import classes from './index.module.scss'

export const ProductHero: React.FC<{ product: Product }> = ({ product }) => {
  const { title, categories, meta: { description }, price, stock, gallery, sizes } = product
  const [selectedImage, setSelectedImage] = useState(gallery?.[0])
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  const formatPrice = (price: number) => price.toLocaleString('en-US')

  const getStockInfo = (stock: number): { text: string; colorClass: string } => {
    let stockText = ''
    let colorClass = ''
    if (stock === 0) {
      stockText = 'Out Of Stock'
      colorClass = classes.outOfStock
    } else if (stock >= 15) {
      stockText = 'In Stock'
      colorClass = classes.inStock
    } else {
      stockText = stock >= 8 ? 'Low Stock' : `${stock} Left`
      colorClass = classes.lowStock
    }
    return { text: stockText, colorClass }
  }

  const isOutOfStock = stock === 0 || !selectedSize
  const { text: stockStatus, colorClass } = getStockInfo(stock)

  const handleThumbnailClick = (image: any) => {
    setSelectedImage(image)
  }

  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSize = event.target.value
    setSelectedSize(selectedSize)
    console.log("Selected Size in ProductHero:", selectedSize) // Log the selected size
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
            {categories?.map((category, index) => (
              <p key={index} className={classes.category}>
                {category.title || 'Generic'} <span className={classes.separator}>|</span>
              </p>
            ))}
          </div>
          <p className={`${classes.stock} ${colorClass}`}>{stockStatus}</p>
        </div>

        {price && (
          <p className={classes.price}>
            <b>PKR </b>{formatPrice(price)}
          </p>
        )}

        {sizes && sizes.length > 0 && (
          <div className={classes.sizeSelector}>
            <label htmlFor="size-select" className={classes.sizeLabel}>Select Size:</label>
            <select
              id="size-select"
              value={selectedSize || ''}
              onChange={handleSizeChange}
              className={classes.sizeDropdown}
            >
              <option value="" disabled>Choose a size</option>
              {sizes.map((size: string) => (
                <option key={size} value={size}>{size}</option>
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
          selectedSize={selectedSize}  // Pass selected size to the AddToCartButton
          className={`${classes.addToCartButton} ${isOutOfStock ? classes.disabled : ''}`}
          disabled={isOutOfStock}
        />
      </div>
    </Gutter>
  )
}
