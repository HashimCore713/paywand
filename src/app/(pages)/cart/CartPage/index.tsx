'use client'

import React, { Fragment } from 'react'
import Link from 'next/link'

import { Page, Settings } from '../../../../payload/payload-types'
import { Button } from '../../../_components/Button'
import { LoadingShimmer } from '../../../_components/LoadingShimmer'
import { useAuth } from '../../../_providers/Auth'
import { useCart } from '../../../_providers/Cart'
import CartItem from '../CartItem'

import classes from './index.module.scss'

export const CartPage: React.FC<{
  settings: Settings
  page: Page
}> = props => {
  const { settings } = props
  const { productsPage, delivery } = settings || {}

  const { user } = useAuth()

  const { cart, cartIsEmpty, addItemToCart, cartTotal, hasInitializedCart } = useCart()

  // Calculate grand total
  const grandTotal = cartTotal.raw + delivery

  // Function to fetch product details
  const fetchProductDetails = async (productId: string) => {
    const response = await fetch(`/api/products/${productId}`)
    const data = await response.json()
    return data
  }

  return (
    <Fragment>
      <br />
      {!hasInitializedCart ? (
        <div className={classes.loading}>
          <LoadingShimmer />
        </div>
      ) : (
        <Fragment>
          {cartIsEmpty ? (
            <div className={classes.empty}>
              Your cart is empty.
              {typeof productsPage === 'object' && productsPage?.slug && (
                <Fragment>
                  {' '}
                  <Link href={`/${productsPage.slug}`}>Click here</Link>
                  {` to shop.`}
                </Fragment>
              )}
              {!user && (
                <Fragment>
                  {' '}
                  <Link href={`/login?redirect=%2Fcart`}>Log in</Link>
                  {` to view a saved cart.`}
                </Fragment>
              )}
            </div>
          ) : (
            <div className={classes.cartWrapper}>
              <div>
                {/* CART LIST HEADER */}
                <div className={classes.header}>
                  <p>Products</p>
                  <div className={classes.headerItemDetails}>
                    <p></p>
                    <p>Size</p>
                    <p>Quantity</p>
                  </div>
                  <p className={classes.headersubtotal}>Subtotal</p>
                </div>
                {/* CART ITEM LIST */}
                <ul className={classes.itemsList}>
                  {cart?.items?.map((item, index) => {
                    if (typeof item.product === 'object') {
                      const { quantity, product, size } = item;

                      // Make sure size is correctly passed to CartItem
                      return (
                        <CartItem
                          key={product.id}
                          product={product}
                          title={product.title}
                          metaImage={product.meta?.image}
                          qty={quantity}
                          size={size}  // Pass size to CartItem
                          addItemToCart={addItemToCart}
                          fetchProductDetails={fetchProductDetails}
                        />
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>

              <div className={classes.summary}>
                <div className={classes.row}>
                  <h6 className={classes.cartTotal}>Summary</h6>
                </div>

                <div className={classes.row}>
                  <p className={classes.cartTotal}>Delivery Charge</p>
                  <p className={classes.cartTotal}>PKR {delivery}</p>
                </div>

                <div className={classes.row}>
                  <p className={classes.cartTotal}>Grand Total</p>
                  <p className={classes.cartTotal}>PKR {grandTotal.toLocaleString('en-US')}</p>
                </div>

                {/* Checkout Button */}
                {user ? (
                  <Link className={classes.checkoutButton} href="/checkout" passHref>
                    <Button
                      className={classes.checkoutButton}
                      label="Checkout"
                      appearance="primary"
                      onClick={() => {
                        localStorage.setItem('selectedSize', JSON.stringify(cart.items.map(item => item.size)));
                      }}
                    />
                  </Link>
                ) : (
                  <>
                    <Link href="/login?redirect=%2Fcheckout" passHref>
                      <Button
                        className={classes.checkoutButton}
                        label="Login to checkout"
                        appearance="secondary"
                      />
                    </Link>
                    <Link href="/checkout" passHref>
                      <Button
                        className={classes.checkoutButton}
                        label="Checkout as Guest"
                        appearance="tertiary"
                      />
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  )
}

export default CartPage
