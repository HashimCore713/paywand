'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { Media } from '../../../_components/Media'
import { Price } from '../../../_components/Price'
import { RemoveFromCartButton } from '../../../_components/RemoveFromCartButton'

import classes from './index.module.scss'

const CartItem = ({ product, title, metaImage, qty, size, addItemToCart, fetchProductDetails }) => {
  const [quantity, setQuantity] = useState(qty)
  const [loading, setLoading] = useState(false)
  const [productDetails, setProductDetails] = useState(product)

  useEffect(() => {
    const loadProductDetails = async () => {
      setLoading(true)
      const details = await fetchProductDetails(product.id)
      setProductDetails(details)
      setLoading(false)
    }

    // Only load product details if `productDetails.slug` is undefined
    if (!productDetails.slug) {
      loadProductDetails()
    }
  }, [product.id, fetchProductDetails, productDetails.slug]) // Include productDetails.slug in dependencies

  const decrementQty = () => {
    const updatedQty = quantity > 1 ? quantity - 1 : 1
    setQuantity(updatedQty)
    addItemToCart({ product: productDetails, quantity: Number(updatedQty) })
  }

  const incrementQty = () => {
    // Check if product stock is greater than current quantity
    if (productDetails.stock > quantity) {
      const updatedQty = quantity + 1
      setQuantity(updatedQty)
      addItemToCart({ product: productDetails, quantity: Number(updatedQty) })
    } else {
      // Handle case where stock limit is reached
      alert(`Only ${productDetails.stock} items available in stock.`)
      // Optionally, you can disable the increment button or show a message
    }
  }

  const enterQty = e => {
    const updatedQty = Number(e.target.value)
    setQuantity(updatedQty)
    addItemToCart({ product: productDetails, quantity: Number(updatedQty) })
  }

  // Calculate subtotal for this item
  const calculateSubtotal = () => {
    if (productDetails && productDetails.price) {
      const subtotal = productDetails.price * quantity
      return `PKR ${subtotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    }
    return 'PKR 0'
  }

  const href = productDetails.slug ? `/products/${productDetails.slug}` : '#'

  // Use the first image from the gallery if available
  const imageToUse = productDetails.gallery && productDetails.gallery.length > 0
    ? productDetails.gallery[0]
    : productDetails.meta?.image;

  return (
    <li className={classes.item} key={title}>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Link href={href} className={classes.mediaWrapper}>
            {!imageToUse && <span>No image</span>}
            {imageToUse && typeof imageToUse !== 'string' && (
              <Media
                className={classes.media}
                imgClassName={classes.image}
                resource={imageToUse}
                fill
              />
            )}
          </Link>
          <div className={classes.itemDetails}>
            <div className={classes.titleWrapper}>
              <h6>{title}</h6>
              <Price product={productDetails} button={false} />
            </div>

            {/* Display size before quantity */}
            <div className={classes.size}>
              {size && <p>{size}</p>} 
            </div>

            <div className={classes.quantity}>
              <div className={classes.quantityBtn} onClick={decrementQty}>
                <Image
                  src="/assets/icons/minus.svg"
                  alt="minus"
                  width={24}
                  height={24}
                  className={classes.qtnBt}
                />
              </div>

              <input
                type="text"
                className={classes.quantityInput}
                value={quantity}
                onChange={enterQty}
              />

              <div className={classes.quantityBtn} onClick={incrementQty}>
                <Image
                  src="/assets/icons/plus.svg"
                  alt="plus"
                  width={24}
                  height={24}
                  className={classes.qtnBt}
                />
              </div>
            </div>
          </div>

          <div className={classes.subtotalWrapper}>
            <p>{calculateSubtotal()}</p>
            <RemoveFromCartButton product={productDetails} className={classes.removeButton} />
          </div>
        </>
      )}
    </li>
  )
}

export default CartItem
