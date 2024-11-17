'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Order } from '../../../../payload/payload-types'
import { Button } from '../../../_components/Button'
import { Message } from '../../../_components/Message'
import { useAuth } from '../../../_providers/Auth'
import { useCart } from '../../../_providers/Cart'

import classes from './index.module.scss'

export const CheckoutForm: React.FC<{ delivery: number; selectedSize: string | null }> = ({ delivery, selectedSize }) => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const router = useRouter()
  const { cart, cartTotal } = useCart()
  const { user } = useAuth()

  // Initialize form fields with user's data if available
  useEffect(() => {
    if (user?.name) setName(user.name)
    if (user?.address) setAddress(user.address)
    if (user?.phone) setPhoneNumber(user.phone)
    if (user?.email) setEmail(user.email)
  }, [user])

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault()
      setIsLoading(true)
  
      try {
        // Calculate total including delivery fee
        const orderTotal = cartTotal.raw + delivery;
        
        const size = selectedSize;
        console.log("sieieieiieie", size);
        // Prepare order data
        const orderData = {
          total: orderTotal,
          name,
          address,
          phoneNumber,
          email,
          paymentMethod: 'cod',
          items: (cart?.items || []).map(({ product, quantity, size }) => ({
            product: typeof product === 'string' ? product : product.id,
            quantity,
            price: typeof product === 'object' ? product.price : undefined,
            size, // Add size for each item
          })),
        };
  
        // Log order data before sending to the server
        console.log('Order data being sent to server:', orderData);
  
        // Create the order in Payload
        const orderReq = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });
  
        if (!orderReq.ok) throw new Error(orderReq.statusText || 'Something went wrong.');
  
        const { error: errorFromRes, doc }: { error?: string; doc: Order } = await orderReq.json();
  
        if (errorFromRes) throw new Error(errorFromRes);
  
        // Log the stored order details
        console.log('Order successfully stored in the database:', doc);
  
        // Update product stocks
        await Promise.all(
          cart.items.map(async ({ product, quantity }) => {
            const productId = typeof product === 'string' ? product : product.id;
            const productReq = await fetch(
              `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${productId}`,
              {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  stock: product.stock - quantity,
                }),
              },
            );
  
            if (!productReq.ok) {
              throw new Error(`Failed to update stock for product ${productId}`);
            }
          }),
        );
  
        router.push(`/order-confirmation?order_id=${doc.id}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong.';
        console.error('Error while submitting order:', msg);
        setError(`Error while submitting order: ${msg}`);
      } finally {
        setIsLoading(false);
      }
    },
    [name, address, phoneNumber, email, cart, cartTotal, delivery, router, selectedSize], // Add selectedSize to dependencies
  );
  

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      {error && <Message error={error} />}
      <div className={classes.field}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          placeholder="e.g Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      <div className={classes.field}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          placeholder="e.g example@gmail.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>
      <div className={classes.field}>
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          placeholder="e.g Paywand Outlet Islamabad"
          value={address}
          onChange={e => setAddress(e.target.value)}
          required
        />
      </div>
      <div className={classes.field}>
        <label htmlFor="phoneNumber">Phone Number</label>
        <input
          type="text"
          id="phoneNumber"
          placeholder="e.g 03123344556"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          required
        />
      </div>
      <div className={classes.actions}>
        <Button
          label={isLoading ? 'Loading...' : 'Confirm Order'}
          type="submit"
          appearance="primary"
          disabled={isLoading}
        />
      </div>
    </form>
  )
}

export default CheckoutForm

