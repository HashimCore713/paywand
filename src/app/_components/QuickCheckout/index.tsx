'use client'

import React, { useEffect, useRef, useState } from 'react'
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl'

import { Product } from '../../../payload/payload-types'
import QuickCard from './QuickCard'

import classes from './index.module.scss'

const QuickCheckout = ({ quickCheckoutProducts }: { quickCheckoutProducts: Product[] }) => {
  const listRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (listRef.current) {
      listRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <section className={classes.container}>
      <div>
        <h4>Quick Checkout</h4>
      </div>

      <div className={classes.carouselWrapper}>
        <button className={classes.arrow} onClick={scrollLeft}>
          <SlArrowLeft />
        </button>
        <div className={classes.gradientWrapper}>
          <div className={classes.list} ref={listRef}>
            {quickCheckoutProducts?.map(product => {
              return <QuickCard key={product.id} doc={product} />
            })}
          </div>
        </div>
        <button className={classes.arrow} onClick={scrollRight}>
          <SlArrowRight />
        </button>
      </div>
    </section>
  )
}

export default QuickCheckout

