'use client'

import React, { useEffect, useState } from 'react'
import { SlArrowDown, SlArrowUp } from 'react-icons/sl'

import { Category } from '../../../../payload/payload-types'
import { Checkbox } from '../../../_components/Checkbox'
import { HR } from '../../../_components/HR'
import { RadioButton } from '../../../_components/Radio'
import { useFilter } from '../../../_providers/Filter'

import classes from './index.module.scss'

const Filters = ({ categories }: { categories: Category[] }) => {
  const { categoryFilters, sort, setCategoryFilters, setSort } = useFilter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const [isMediumScreen, setIsMediumScreen] = useState(false)

  const handleCategories = (categoryId: string) => {
    if (categoryFilters.includes(categoryId)) {
      const updatedCategories = categoryFilters.filter(id => id !== categoryId)

      setCategoryFilters(updatedCategories)
    } else {
      setCategoryFilters([...categoryFilters, categoryId])
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 768)
      setIsMediumScreen(window.innerWidth <= 768)
    }

    handleResize() // Set the initial value
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleSort = (value: string) => setSort(value)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <div className={classes.filters}>
      <div>
        <h6 className={classes.title} onClick={toggleDropdown}>
          Product Categories
          {isMediumScreen && !isDropdownOpen && <SlArrowDown />}
          {isMediumScreen && isDropdownOpen && <SlArrowUp />}
        </h6>
        {isLargeScreen && (
          <div className={classes.categories}>
            {categories?.map(category => {
              const isSelected = categoryFilters.includes(category.id)

              return (
                <Checkbox
                  key={category.id}
                  label={category.title}
                  value={category.id}
                  isSelected={isSelected}
                  onClickHandler={handleCategories}
                />
              )
            })}
          </div>
        )}
        {isMediumScreen && isDropdownOpen && (
          <div className={classes.categories}>
            {categories?.map(category => {
              const isSelected = categoryFilters.includes(category.id)

              return (
                <Checkbox
                  key={category.id}
                  label={category.title}
                  value={category.id}
                  isSelected={isSelected}
                  onClickHandler={handleCategories}
                />
              )
            })}
          </div>
        )}
        <HR className={classes.hr} />
        <h6 className={classes.title}>Sort By</h6>
        <div className={classes.categories}>
          <RadioButton
            label="Latest"
            value="-createdAt"
            isSelected={sort === '-createdAt'}
            onRadioChange={handleSort}
            groupName="sort"
          />
          <RadioButton
            label="Oldest"
            value="createdAt"
            isSelected={sort === 'createdAt'}
            onRadioChange={handleSort}
            groupName="sort"
          />
        </div>
      </div>
    </div>
  )
}

export default Filters
