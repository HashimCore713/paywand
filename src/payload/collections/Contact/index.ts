import type { CollectionConfig } from 'payload/types'

const Contact: CollectionConfig = {
  slug: 'contact',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'message', 'createdAt'],
    group: 'Messages',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
  ],
  access: {
    read: ({ req: { user } }) => !!user, // Only authenticated users can read messages
    create: () => true, // Anyone can create a message
    update: ({ req: { user } }) => !!user, // Only authenticated users can update messages
    delete: ({ req: { user } }) => !!user, // Only authenticated users can delete messages
  },
  timestamps: true, // Automatically add createdAt and updatedAt fields
}

export default Contact
