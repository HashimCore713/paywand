// src/app/_components/ShopInfo/index.tsx

import React from 'react';
import classes from './index.module.scss'; // Assuming you'll style this component

const ShopInfo = ({ imageUrl, location, mapsLink, description }) => {
  return (
    <section className={classes.shopInfo}>
      <div className={classes.imageContainer}>
        <img src={imageUrl} alt="Shop" className={classes.shopImage} />
      </div>
      <div className={classes.locationInfo}>
        <h3 className={classes.title}>Our Location</h3>
        <p>{location}</p>
        {mapsLink && (
          <p>
            <a className={classes.maploc} href={mapsLink} target="_blank" rel="noopener noreferrer">
              View on Google Maps
            </a>
          </p>
        )}
      </div>
    </section>
  );
};

export default ShopInfo;
