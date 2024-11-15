import React from 'react';
import Link from 'next/link';

import { Product } from '../../../payload/payload-types';
import { Media } from '../Media';

import classes from './index.module.scss';

export const Card: React.FC<{
  alignItems?: 'center';
  className?: string;
  showCategories?: boolean;
  hideImagesOnMobile?: boolean;
  title?: string;
  relationTo?: 'products';
  doc?: Product;
}> = props => {
  const {
    showCategories,
    title: titleFromProps,
    doc,
    doc: { slug, title, categories, meta, price, gallery } = {},
    className,
  } = props;

  // Function to format price with commas
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US'); // Adjust 'en-US' to your desired locale if different
  };

  const { description } = meta || {};

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0;
  const titleToUse = titleFromProps || title;
  const sanitizedDescription = description?.replace(/\s/g, ' '); // replace non-breaking space with white space
  const href = `/products/${slug}`;

  // Use the first image from the gallery if available
  const imageToUse = gallery && gallery.length > 0 ? gallery[0] : meta?.image;

  return (
    <Link href={href} className={[classes.card, className].filter(Boolean).join(' ')}>
      <div className={classes.mediaWrapper}>
        {!imageToUse && <div className={classes.placeholder}>No image</div>}
        {imageToUse && (
          <Media imgClassName={classes.image} resource={imageToUse} fill />
        )}
      </div>

      <div className={classes.content}>
        {titleToUse && <h4 className={classes.title}>{titleToUse}</h4>}
        {description && (
          <div className={classes.body}>
            {description && <p className={classes.description}>{sanitizedDescription}</p>}
          </div>
        )}
        {/* Display Price with commas */}
        {price && (
          <p className={classes.price}>
            <b>PKR </b>
            {formatPrice(price)}
          </p>
        )}
      </div>
    </Link>
  );
};
