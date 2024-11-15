'use client'
import React, { useRef } from 'react'
import { SlArrowLeft, SlArrowRight } from 'react-icons/sl'
import Link from 'next/link'

import { Category } from '../../../payload/payload-types'
import CategoryCard from './CategoryCard'

import classes from './index.module.scss'

const Categories = ({ categories }: { categories: Category[] }) => {
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
      <div className={classes.titleWrapper}>
        <h5>Shop by Categories</h5>
        <h1></h1>
        <Link href="/products">Show All</Link>
      </div>

      <div className={classes.carouselWrapper}>
        <button className={classes.arrow} onClick={scrollLeft}>
          <SlArrowLeft />
        </button>
        <div className={classes.gradientWrapper}>
          <div className={classes.list} ref={listRef}>
            {categories?.map(category => {
              return <CategoryCard key={category.id} category={category} />
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

export default Categories
