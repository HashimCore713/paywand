'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { Product } from '../../../payload/payload-types'
import { fetchProd } from '../../_api/fetchProd'
import { SearchCard } from '../../_components/SearchCard'

import classes from './index.module.scss'

const SearchResults = ({ products }: { products: Product[] }) => {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')

  const [productDetails, setProductDetails] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  useEffect(() => {
    if (query) {
      // Split the query into words, remove spaces, and filter
      const queryTerms = query.toLowerCase().split(' ').filter(term => term.trim() !== '')

      const filtered = products.filter(product => {
        const slug = product.slug.toLowerCase()
        return queryTerms.every(term => slug.includes(term))
      })

      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [query, products])

  useEffect(() => {
    const fetchProductDetails = async () => {
      const detailsPromises = filteredProducts.map(async product => {
        try {
          const detail = await fetchProd<Product>(product.slug)
          return detail
        } catch (error) {
          console.error(`Error fetching detail for ${product.slug}:`, error)
          return null
        }
      })

      const details = await Promise.all(detailsPromises)
      const filteredDetails = details.filter(detail => detail !== null) as Product[]
      setProductDetails(filteredDetails)
    }

    if (filteredProducts.length > 0) {
      fetchProductDetails()
    } else {
      // Handle case where filteredProducts is empty if necessary
    }
  }, [filteredProducts])

  return (
    <div className={classes.searchResults}>
      {productDetails.map(product => (
        <SearchCard key={product.slug} doc={product} />
      ))}
    </div>
  )
}

export default SearchResults
