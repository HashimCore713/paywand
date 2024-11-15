'use client'

import React, { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { PiShoppingCart } from "react-icons/pi";

import { useCart } from '../../_providers/Cart'

import classes from './index.module.scss'

export const CartLink: React.FC<{
  className?: string
}> = props => {
  const { className } = props
  const { cart } = useCart()
  const [length, setLength] = useState<number>()

  useEffect(() => {
    setLength(cart?.items?.length || 0)
  }, [cart])

  return (
    <Link className={[classes.cartLink, className].filter(Boolean).join(' ')} href="/cart">
      <Fragment>
        <PiShoppingCart className={classes.carticon}/>
        {typeof length === 'number' && length > 0 && (
          <small className={classes.quantity}>({length})</small>
        )}
      </Fragment>
    </Link>
  )
}
