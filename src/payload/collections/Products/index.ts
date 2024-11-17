import type { CollectionConfig } from 'payload/types';

import { admins } from '../../access/admins';
import { anyone } from '../../access/anyone';
import { Archive } from '../../blocks/ArchiveBlock';
import { CallToAction } from '../../blocks/CallToAction';
import { Content } from '../../blocks/Content';
import { MediaBlock } from '../../blocks/MediaBlock';
import { slugField } from '../../fields/slug';
import { populateArchiveBlock } from '../../hooks/populateArchiveBlock';
import { checkUserPurchases } from './access/checkUserPurchases';
import { beforeProductChange } from './hooks/beforeChange';
import { deleteProductFromCarts } from './hooks/deleteProductFromCarts';
import { revalidateProduct } from './hooks/revalidateProduct';
import { ProductSelect } from './ui/ProductSelect';

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'stripeProductID', '_status'],
    preview: doc => {
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/next/preview?url=${encodeURIComponent(
        `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/products/${doc.slug}`,
      )}&secret=${process.env.PAYLOAD_PUBLIC_DRAFT_SECRET}`;
    },
  },
  hooks: {
    beforeChange: [beforeProductChange],
    afterChange: [revalidateProduct],
    afterRead: [populateArchiveBlock],
    afterDelete: [deleteProductFromCarts],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
    create: admins,
    update: anyone,
    delete: admins,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'publishedOn',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date();
            }
            return value;
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              required: true,
              blocks: [CallToAction, Content, MediaBlock, Archive],
            },
          ],
        },
        {
          label: 'Product Details',
          fields: [
            {
              name: 'stripeProductID',
              label: 'Stripe Product',
              type: 'text',
              admin: {
                components: {
                  Field: ProductSelect,
                },
              },
            },
            {
              name: 'price',
              label: 'Price',
              type: 'number',
              min: 0,
              required: true,
            },
            {
              name: 'stock',
              label: 'Stock',
              type: 'number',
              min: 0,
              required: true,
            },
            {
              name: 'priceJSON',
              label: 'Price JSON',
              type: 'number',
              admin: {
                readOnly: true,
                hidden: true,
              },
            },
            {
              name: 'enablePaywall',
              label: 'Enable Paywall',
              type: 'checkbox',
            },
            {
              name: 'paywall',
              label: 'Paywall',
              type: 'blocks',
              access: {
                read: checkUserPurchases,
              },
              blocks: [CallToAction, Content, MediaBlock, Archive],
            },
            {
              name: 'gallery',
              label: 'Gallery',
              type: 'relationship',
              relationTo: 'media',
              hasMany: true,
              admin: {
                position: 'sidebar',
              },
            },
            {
              name: 'sizes',
              label: 'Sizes',
              type: 'select',
              options: [
                { label: 'Small', value: 'S' },
                { label: 'Medium', value: 'M' },
                { label: 'Large', value: 'L' },
                { label: 'Extra Large', value: 'XL' },
              ],
              hasMany: true,
              admin: {
                position: 'sidebar',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        };
      },
    },
    slugField(),
    {
      name: 'skipSync',
      label: 'Skip Sync',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        readOnly: true,
        hidden: true,
      },
    },
  ],
};

export default Products;
