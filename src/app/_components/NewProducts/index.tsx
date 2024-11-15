'use client'

import React, { useEffect, useState } from 'react';
import { Product } from '../../../payload/payload-types';
import { fetchNewProducts } from '../../_api/fetchNewProducts';
import { NewProductCard } from './NewProductCard';

import classes from './index.module.scss';

const NewProducts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchNewProducts();
        const { Beige, Black, Grey } = data;

        const filteredProducts = [
          Beige.docs.length > 0 ? Beige.docs[0] : null,
          Black.docs.length > 0 ? Black.docs[0] : null,
          Grey.docs.length > 0 ? Grey.docs[0] : null,
        ].filter(Boolean) as Product[];

        setProducts(filteredProducts);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  ///////////////
    // Custom sorting logic
    const FirstProduct = products.find(
      product =>
        product.title?.toLowerCase().includes('beige') ||
        product.slug?.toLowerCase().includes('beige')
    );
  
    const SecondProduct = products.find(
      product =>
        product.title?.toLowerCase().includes('black') ||
        product.slug?.toLowerCase().includes('black')
    );
  
    const ThirdProduct = products.find(
      product =>
        product.title?.toLowerCase().includes('grey') ||
        product.slug?.toLowerCase().includes('grey')
    );
  ///////////////

  return (
    <section className={classes.container}>
      <div>
        <h5>See What's New</h5>
      </div>

      <div className={classes.grid}>
        {FirstProduct && (
          <div className={classes.fullRow}>
            <NewProductCard key={FirstProduct.slug} doc={FirstProduct} />
          </div>
        )}
        <div className={classes.twoColumns}>
          {SecondProduct && (
            <div className={classes.halfColumn}>
              <NewProductCard key={SecondProduct.slug} doc={SecondProduct} />
            </div>
          )}
          {ThirdProduct && (
            <div className={classes.halfColumn}>
              <NewProductCard key={ThirdProduct.slug} doc={ThirdProduct} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewProducts;