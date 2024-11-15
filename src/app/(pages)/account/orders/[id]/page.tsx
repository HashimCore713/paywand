import React, { Fragment } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Order } from '../../../../../payload/payload-types';
import { HR } from '../../../../_components/HR';
import { Media } from '../../../../_components/Media';
import { Price } from '../../../../_components/Price';
import { formatDateTime } from '../../../../_utilities/formatDateTime';
import { getMeUser } from '../../../../_utilities/getMeUser';
import { mergeOpenGraph } from '../../../../_utilities/mergeOpenGraph';

import classes from './index.module.scss';

export default async function Order({ params: { id } }) {
  const { token } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to view this order.'
    )}&redirect=${encodeURIComponent(`/order/${id}`)}`,
  });

  let order: Order | null = null;

  try {
    order = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
    })?.then(async (res) => {
      if (!res.ok) notFound();
      const json = await res.json();
      if ('error' in json && json.error) notFound();
      if ('errors' in json && json.errors) notFound();
      return json;
    });
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
  }

  if (!order) {
    notFound();
  }

  const paymentMethodDisplay =
    order.paymentMethod === 'cod'
      ? 'Cash On Delivery'
      : order.paymentMethod === 'card'
      ? 'Card Payment'
      : order.paymentMethod;

  const statusDisplay =
    order.status === 'delivered' ? (
      <span className={classes.delivered}>Delivered</span>
    ) : order.status === 'cancelled' ? (
      <span className={classes.cancelled}>Cancelled</span>
    ) : (
      <span className={classes.pending}>Pending</span>
    );

  return (
    <div>
      <h5>
        {`Order`}
        <span className={classes.id}>{` ${order.id}`}</span>
      </h5>
      <div className={classes.itemMeta}>
        <p>{`ID: ${order.id}`}</p>
        <p>{`Payment Method: ${paymentMethodDisplay}`}</p>
        <p>{`Ordered On: ${formatDateTime(order.createdAt)}`}</p>
        <p>
          {'Status: '}
          {statusDisplay}
        </p>
        <p className={classes.total}>
          {'Total: '}
          {new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
          }).format(order.total)}
        </p>
      </div>

      <div className={classes.order}>
        {order.items?.map((item, index) => {
          if (typeof item.product === 'object') {
            const {
              quantity,
              product,
              product: { id, title, stripeProductID, gallery }, // Added gallery
            } = item;

            const firstImage = gallery?.[0]; // Get the first image from the gallery

            return (
              <Fragment key={index}>
                <div className={classes.row}>
                  <Link href={`/products/${product.slug}`} className={classes.mediaWrapper}>
                    {!firstImage && <span className={classes.placeholder}>No image</span>}
                    {firstImage && (
                      <Media
                        className={classes.media}
                        imgClassName={classes.image}
                        resource={firstImage} // Use first image from gallery
                        fill
                      />
                    )}
                  </Link>
                  <div className={classes.rowContent}>
                    <h6 className={classes.title}>
                      <Link href={`/products/${product.slug}`} className={classes.titleLink}>
                        {title}
                      </Link>
                    </h6>
                    <p>{`Quantity: ${quantity}`}</p>
                    <Price product={product} button={false} quantity={quantity} />
                  </div>
                </div>
              </Fragment>
            );
          }

          return null;
        })}
      </div>
      <HR className={classes.hr} />
    </div>
  );
}

export async function generateMetadata({ params: { id } }): Promise<Metadata> {
  return {
    title: `Order ${id}`,
    description: `Order details for order ${id}.`,
    openGraph: mergeOpenGraph({
      title: `Order ${id}`,
      url: `/orders/${id}`,
    }),
  };
}
