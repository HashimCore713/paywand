import React, { Fragment } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Order } from '../../../../payload/payload-types'
import { Button } from '../../../_components/Button'
import { Gutter } from '../../../_components/Gutter'
import { HR } from '../../../_components/HR'
import { Media } from '../../../_components/Media'
import { formatDateTime } from '../../../_utilities/formatDateTime'
import { getMeUser } from '../../../_utilities/getMeUser'
import { mergeOpenGraph } from '../../../_utilities/mergeOpenGraph'

import classes from './index.module.scss'

export default async function Order({ params: { id } }) {
  const { token } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to view this order.',
    )}&redirect=${encodeURIComponent(`/order/${id}`)}`,
  })

  let order: Order | null = null

  try {
    order = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
    })?.then(async res => {
      if (!res.ok) notFound()
      const json = await res.json()
      if ('error' in json && json.error) notFound()
      if ('errors' in json && json.errors) notFound()
      return json
    })
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }

  if (!order) {
    notFound()
  }

  return (
    <Gutter className={classes.orders}>
      <h1>
        {`Order`}
        <span className={classes.id}>{`${order.id}`}</span>
      </h1>
      <div className={classes.itemMeta}>
        <div>
          <p>{`ID: ${order.id}`}</p>
          <p>{`Payment Method: ${order.paymentMethod}`}</p>
          <p>{`Ordered On: ${formatDateTime(order.createdAt)}`}</p>
          <p className={classes.total}>
            {'Total: '}
            {new Intl.NumberFormat('en-PK', {
              style: 'currency',
              currency: 'PKR',
            }).format(order.total)}
          </p>
        </div>
        <div>
          <p>{`Name: `}<strong>{order.name}</strong></p>
          <p>{`Address: ${order.address}`}</p>
          <p>{`Phone Number: ${order.phoneNumber}`}</p>
        </div>
      </div>
      <HR />
      <div className={classes.order}>
        <h4 className={classes.orderItems}>Items</h4>
        {order.items?.map((item, index) => {
          if (typeof item.product === 'object') {
            const {
              quantity,
              product,
              product: { id, title, meta, gallery, slug, stripeProductID, price },
            } = item

            const isLast = index === (order?.items?.length || 0) - 1

            // Use the first image from the gallery, or fallback to meta.image
            const imageToUse = gallery && gallery.length > 0 ? gallery[0] : meta?.image;

            return (
              <Fragment key={index}>
                <div className={classes.row}>
                  <Link href={`/products/${slug}`} className={classes.mediaWrapper}>
                    {!imageToUse && <span className={classes.placeholder}>No image</span>}
                    {imageToUse && typeof imageToUse !== 'string' && (
                      <Media
                        className={classes.media}
                        imgClassName={classes.image}
                        resource={imageToUse}
                        fill
                      />
                    )}
                  </Link>
                  <div className={classes.rowContent}>
                    <h5 className={classes.title}>
                      <Link href={`/products/${slug}`} className={classes.titleLink}>
                        {title}
                      </Link>
                    </h5>
                    <p>{`Quantity: ${quantity}`}</p>
                    <p className={classes.price}>
                      {new Intl.NumberFormat('en-PK', {
                        style: 'currency',
                        currency: 'PKR',
                      }).format(price)}
                    </p>
                  </div>
                </div>
                {!isLast && <HR />}
              </Fragment>
            )
          }

          return null
        })}
      </div>
      <HR />
      <div className={classes.actions}>
        <Button href="/orders" appearance="primary" label="See all orders" />
        <Button href="/account" appearance="secondary" label="Go to account" />
      </div>
    </Gutter>
  )
}

export const generateMetadata = async ({ params: { id } }): Promise<Metadata> => ({
  title: `Order ${id}`,
  description: `Order details for order ${id}.`,
  openGraph: mergeOpenGraph({
    title: `Order ${id}`,
    url: `/orders/${id}`,
  }),
})
