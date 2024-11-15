import type { CollectionConfig } from 'payload/types'

import { admins } from '../../access/admins'
// import { adminsOrLoggedIn } from '../../access/adminsOrLoggedIn'
import { anyone } from '../../access/anyone'
import { adminsOrOrderedBy } from './access/adminsOrOrderedBy'
import { clearUserCart } from './hooks/clearUserCart'
import { populateOrderedBy } from './hooks/populateOrderedBy'
import { updateUserPurchases } from './hooks/updateUserPurchases'
// import { LinkToPaymentIntent } from './ui/LinkToPaymentIntent'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'createdAt',
    defaultColumns: ['createdAt', 'orderedBy'],
    preview: doc => `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/orders/${doc.id}`,
  },
  hooks: {
    afterChange: [updateUserPurchases, clearUserCart],
  },
  access: {
    read: adminsOrOrderedBy,
    update: admins,
    create: anyone,
    delete: admins,
  },
  fields: [
    {
      name: 'orderedBy',
      type: 'relationship',
      relationTo: 'users',
      hooks: {
        beforeChange: [populateOrderedBy],
      },
      required: false, // Make this field optional
    },
    {
      name: 'paymentMethod',
      label: 'Payment Method',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Cash On Delivery',
          value: 'cod',
        },
        {
          label: 'Card',
          value: 'card',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status', // New field 'status'
      type: 'select',
      options: [
        {
          label: 'Confirmed',
          value: 'confirmed',
        },
        {
          label: 'Delivered',
          value: 'delivered',
        },
        {
          label: 'Not Delivered',
          value: 'not_delivered',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'phoneNumber',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          min: 0,
        },
        {
          name: 'quantity',
          type: 'number',
          min: 0,
        },
      ],
    },
  ],
}
