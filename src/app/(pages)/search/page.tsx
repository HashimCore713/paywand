import React from 'react'
import { draftMode } from 'next/headers'

import { Product } from '../../../payload/payload-types'
import { fetchDoc } from '../../_api/fetchDoc'
import { fetchDocs } from '../../_api/fetchDocs'
import { Gutter } from '../../_components/Gutter'
import { HR } from '../../_components/HR'
import SearchResults from './SearchResults'

import classes from './index.module.scss'

const Products = async () => {
  const { isEnabled: isDraftMode } = draftMode()

  let products: Product[] | null = null

  try {
    products = await fetchDocs<Product>('products') // Fetch all fields of products
    console.log('Fetched products:', products) // Added debugging log
  } catch (error) {
    console.log(error)
  }

  return (
    <div className={classes.container}>
      <Gutter className={classes.products}>
        {products && <SearchResults products={products} />}
      </Gutter>
      <HR />
    </div>
  )
}

export default Products
