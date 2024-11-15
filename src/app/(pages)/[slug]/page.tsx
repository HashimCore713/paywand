import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { Category, Page, Product } from '../../../payload/payload-types'
import { staticHome } from '../../../payload/seed/home-static'
import { fetchDoc } from '../../_api/fetchDoc'
import { fetchDocs } from '../../_api/fetchDocs'
import { fetchNewProducts } from '../../_api/fetchNewProducts'
import { fetchQuickCheckoutProducts } from '../../_api/fetchQuickCheckoutProducts'
import { Blocks } from '../../_components/Blocks'
import { Gutter } from '../../_components/Gutter'
import { Hero } from '../../_components/Hero'
import { HR } from '../../_components/HR'
import { generateMeta } from '../../_utilities/generateMeta'
import ShopInfo from '../../_components/ShopInfo'
import Categories from '../../_components/Categories'
import NewProducts from '../../_components/NewProducts'
import QuickCheckout from '../../_components/QuickCheckout'
import AboutUs from '../../_components/AboutUs'

import classes from './index.module.scss'

export default async function Page({ params: { slug = 'home' } }) {
  const { isEnabled: isDraftMode } = draftMode()

  let page: Page | null = null
  let categories: Category[] | null = null

  try {
    page = await fetchDoc<Page>({
      collection: 'pages',
      slug,
      draft: isDraftMode,
    })

    categories = await fetchDocs<Category>('categories')
  } catch (error) {
    console.error(error)
    // Handle error appropriately, such as logging or displaying a fallback message
  }
  ///////////////////////////////
  let products: Product[] | null = null

  try {
    products = await fetchNewProducts(); // Fetch all new products
  } catch (error) {
    console.error(error)
    // Handle error appropriately, such as logging or displaying a fallback message
  }
  /////////////////////////////
  ///////////////////////////////
  let quickproducts: Product[] | null = null

  try {
    quickproducts = await fetchQuickCheckoutProducts(); // Fetch products with specific category
  } catch (error) {
    console.error(error)
    // Handle error appropriately, such as logging or displaying a fallback message
  }
  /////////////////////////////

  // if no `home` page exists, render a static one using dummy content
  // you should delete this code once you have a home page in the CMS
  // this is really only useful for those who are demoing this template
  if (!page && slug === 'home') {
    page = staticHome
  }

  if (!page) {
    return notFound()
  }

  const { hero, layout } = page

  return (
    <React.Fragment>
      {slug === 'home' ? (
        <section>
          <Hero {...hero} alt="Discover the best in smartphones, laptops, tablets, earphones, smartwatches, accessories, computer gear, and gaming consoles. Trusted tech, just a click away." />
          <Gutter className={classes.home}>
            <NewProducts newProducts={products} /> {/* Updated prop name to match component */}
            <HR />
            <QuickCheckout quickCheckoutProducts={quickproducts} />
            {/* <AboutUs
              text="Spiral Gadgets is your ultimate destination for cutting-edge technology. Explore our extensive collection of smartphones, tablets, MacBooks, smartwatches, and gaming consoles from top brands like Apple and Samsung. Whether you're looking for the latest iPhone, Samsung Galaxy, or quality used phones, we've got you covered. Don't miss out on our exclusive deals on AirPods, chargers, PlayStations, Xbox, and more. At Spiral Gadgets, we offer a wide selection of premium gadgets and accessories, all available with secure checkout, fast shipping, and exceptional customer support. Upgrade your tech today with Spiral Gadgets – where quality meets convenience."
            /> */}
            <HR />
          </Gutter>
        </section>
      ) : (
        <>
          <Hero {...hero} />
          <Blocks
            blocks={layout}
            disableTopPadding={!hero || hero?.type === 'none' || hero?.type === 'lowImpact'}
          />
        </>
      )}
    </React.Fragment>
  )
}

export async function generateStaticParams() {
  try {
    const pages = await fetchDocs<Page>('pages')
    return pages?.map(({ slug }) => slug)
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function generateMetadata({ params: { slug = 'home' } }): Promise<Metadata> {
  const { isEnabled: isDraftMode } = draftMode()

  let page: Page | null = null

  try {
    page = await fetchDoc<Page>({
      collection: 'pages',
      slug,
      draft: isDraftMode,
    })
  } catch (error) {
    console.error(error)
    // Handle error appropriately, such as logging or displaying a fallback message
  }

  if (!page && slug === 'home') {
    page = staticHome
  }

  return generateMeta({ doc: page })
}
