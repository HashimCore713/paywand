'use client'

import React, { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Settings } from '../../../../payload/payload-types'
import { fetchSettings } from '../../../_api/fetchGlobals'
import { Button } from '../../../_components/Button'
import { useCart } from '../../../_providers/Cart'
import { CheckoutItem } from '../CheckoutItem'
import GuestForm from '../GuestForm'

import classes from './index.module.scss'

const GuestCheckout: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null)

  useEffect(() => {
    const fetchSettingsfunc = async () => {
      try {
        const fetchedSettings = await fetchSettings()
        setSettings(fetchedSettings)
      } catch (error) {
        console.error(error)
        // Handle error if needed
      }
    }

    fetchSettingsfunc()
  }, [])

  const router = useRouter()
  const { cart, cartIsEmpty, cartTotal } = useCart()
  const [paymentOption, setPaymentOption] = useState<'cod' | 'card' | null>(null)

  // Calculate order total including delivery fee
  const orderTotal = cartTotal.raw + (settings?.delivery || 0)

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
          {typeof settings?.productsPage === 'object' && settings?.productsPage?.slug && (
            <Fragment>
              {' '}
              <Link href={`/${settings?.productsPage.slug}`}>Continue shopping?</Link>
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

          {paymentOption === 'cod' && <GuestForm delivery={settings?.delivery} />}
          {/* {paymentOption === 'card' && (
            <p>carddddd</p>
          )} */}
        </div>
      )}
    </Fragment>
  )
}

export default GuestCheckout
