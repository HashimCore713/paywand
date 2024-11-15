import React, { Fragment } from 'react'
import { Metadata } from 'next'

import { Settings } from '../../../payload/payload-types'
import { fetchSettings } from '../../_api/fetchGlobals'
import { Gutter } from '../../_components/Gutter'
import { Message } from '../../_components/Message'
import { LowImpactHero } from '../../_heros/LowImpact'
import { getMeUser } from '../../_utilities/getMeUser'
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph'
import CheckoutPage from './CheckoutPage'
import GuestCheckout from './GuestCheckout'

import classes from './index.module.scss'

export default async function Checkout() {
  const user = await getMeUser() // Removed the redirect part

  let settings: Settings | null = null

  try {
    settings = await fetchSettings()
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }

  return (
    <div className={classes.checkout}>
      <Gutter>{user ? <CheckoutPage settings={settings} /> : <GuestCheckout />}</Gutter>
    </div>
  )
}

export const metadata: Metadata = {
  title: 'Account',
  description: 'Create an account or log in to your existing account.',
  openGraph: mergeOpenGraph({
    title: 'Account',
    url: '/account',
  }),
}
