'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Settings } from '../../../../payload/payload-types'
import { Button } from '../../../_components/Button'
import { Input } from '../../../_components/Input'
import { LoadingShimmer } from '../../../_components/LoadingShimmer'
import { useAuth } from '../../../_providers/Auth'
import { useCart } from '../../../_providers/Cart'
import { useTheme } from '../../../_providers/Theme'
import cssVariables from '../../../cssVariables'
import { CheckoutForm } from '../CheckoutForm'
import { CheckoutItem } from '../CheckoutItem'

import classes from './index.module.scss'

const CheckoutPage: React.FC<{
  settings: Settings
}> = props => {
  const {
    settings: { productsPage, delivery },
  } = props

  const router = useRouter()
  const { cart, cartIsEmpty, cartTotal } = useCart()
  const [paymentOption, setPaymentOption] = useState<'cod' | 'card' | null>(null)

  // Calculate order total including delivery fee
  const orderTotal = cartTotal.raw + delivery

  const handlePaymentOptionSelect = (option: 'cod' | 'card') => {
    setPaymentOption(option)
  }

  const handleCheckout = () => {
    if (paymentOption === 'cod') {
      // Handle COD checkout logic (show form, etc.)
      console.log('Handling COD checkout')
    } else if (paymentOption === 'card') {
      // Redirect to card payment page or handle payment gateway integration
      console.log('Redirecting to card payment page')
      // Example redirection:
      // router.push('/card-payment');
    }
  }

  return (
    <Fragment>
      {cartIsEmpty ? (
        <div>
          Your <Link href="/cart">cart</Link> is empty.
          {typeof productsPage === 'object' && productsPage?.slug && (
            <Fragment>
              {' '}
              <Link href={`/${productsPage.slug}`}>Continue shopping?</Link>
            </Fragment>
          )}
        </div>
      ) : (
        <div className={classes.items}>
          <div className={classes.header}>
            <p>Products</p>
            <div className={classes.headerItemDetails}>
              <p></p>
              <p className={classes.quantity}>Quantity</p>
            </div>
            <p className={classes.subtotal}>Subtotal</p>
          </div>

          <ul>
            {cart?.items?.map((item, index) => {
              if (typeof item.product === 'object') {
                const {
                  quantity,
                  product,
                  product: { title, meta },
                } = item

                if (!quantity) return null

                const metaImage = meta?.image

                return (
                  <Fragment key={index}>
                    {/* CheckoutItem renders the product details */}
                    <CheckoutItem
                      product={product}
                      title={title}
                      metaImage={metaImage}
                      quantity={quantity}
                      index={index}
                    />
                  </Fragment>
                )
              }
              return null
            })}
          </ul>

          <div className={classes.orderTotal}>
            <p>
              Order Total <span className={classes.shippingNote}>(includes shipping fee)</span>
            </p>
            <p>PKR {orderTotal.toLocaleString('en-US')}</p>
          </div>

          <div className={classes.payment_options}>
            <Button
              className={classes.back}
              el="link"
              href="/cart"
              disabled={paymentOption === 'cod'}
            >
              Back To Cart
            </Button>
            <div className={classes.buttondiv}>
              <Button
                className={classes.payment_btn}
                el="link"
                href="/cart"
                appearance="cod"
                onClick={() => handlePaymentOptionSelect('cod')}
                disabled={paymentOption === 'cod'}
              >
                COD (Cash On Delivery)
              </Button>
              {/* <Button
                className={classes.payment_btn}
                el="link"
                href="/cart"
                appearance="card"
                onClick={() => handlePaymentOptionSelect('card')}
                disabled={paymentOption === 'card'}
              >
                Card Payment
              </Button> */}
            </div>
          </div>

          {paymentOption === 'cod' && <CheckoutForm delivery={delivery} />}
          {/* {paymentOption === 'card' && (
            <p>carddddd</p>
          )} */}
        </div>
      )}
    </Fragment>
  )
}

export default CheckoutPage
