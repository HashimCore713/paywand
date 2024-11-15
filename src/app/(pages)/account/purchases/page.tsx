import React from 'react';
import Link from 'next/link';

import { Media } from '../../../_components/Media';
import { Price } from '../../../_components/Price';
import { getMeUser } from '../../../_utilities/getMeUser';

import classes from './index.module.scss';

export default async function Purchases() {
  const { user } = await getMeUser({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to access your account.'
    )}&redirect=${encodeURIComponent('/account')}`,
  });

  return (
    <div>
      <h5>Purchased Products</h5>
      <div>
        {user?.purchases?.length > 0 ? (
          <ul className={classes.purchases}>
            {user.purchases.map((purchase, index) => {
              // Declare firstImage outside the JSX
              const firstImage = purchase.gallery?.[0]; // Get the first image from the gallery

              return (
                <li key={index} className={classes.purchase}>
                  {typeof purchase === 'string' ? (
                    <p>{purchase}</p>
                  ) : (
                    <Link href={`/products/${purchase.slug}`} className={classes.item}>
                      <div className={classes.mediaWrapper}>
                        {!firstImage ? (
                          <div className={classes.placeholder}>No image</div>
                        ) : (
                          <Media imgClassName={classes.image} resource={firstImage} />
                        )}
                      </div>
                      <div className={classes.itemDetails}>
                        <h6>{purchase.title}</h6>
                        <Price product={purchase} />
                        {/* Use formatAdjustedDateTime to adjust the displayed purchase date */}
                        {/* <p className={classes.purchasedDate}>{`Purchased On: ${formatDateTime(
                          purchase.createdAt,
                        )}`}</p> */}
                      </div>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className={classes.noPurchases}>You have no purchases.</div>
        )}
      </div>
    </div>
  );
}
