'use client'
// src/app/pages/contact/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { mergeOpenGraph } from '../../_utilities/mergeOpenGraph';
import { Gutter } from '../../_components/Gutter';
import ContactForm from './ContactForm';

import classes from './index.module.scss';

export default function ContactPage() {
  const metadata: Metadata = {
    title: 'Contact Paywand | Get in Touch for Queries & Support',
    description: 'Reach out to Paywand for any queries, support, or feedback. We’re here to help you with your tech needs and ensure you have the best shopping experience.',
    openGraph: mergeOpenGraph({
      title: 'Contact Paywand | Get in Touch for Queries & Support',
      description: 'Reach out to Paywand for any queries, support, or feedback. We’re here to help you with your tech needs and ensure you have the best shopping experience.',
      url: '/contact',
      type: 'website',
      images: [
        {
          url: 'https://spiral-gadgets.com/images/contact-us.jpg',
          width: 1200,
          height: 630,
          alt: 'Contact Paywand',
        },
      ],
    }),
    twitter: {
      card: 'summary_large_image',
      title: 'Contact Paywand | Get in Touch for Queries & Support',
      description: 'Reach out to Paywand for any queries, support, or feedback. We’re here to help you with your tech needs and ensure you have the best shopping experience.',
      images: ['https://spiral-gadgets.com/images/contact-us.jpg'],
    },
  };

  // Handle form submission
  const handleSubmit = async (formData: any) => {
    try {
      // Example fetch logic, replace with your actual API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      // Handle success, e.g., show success message or redirect
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error, e.g., show error message
    }
  };

  return (
    <div className={classes.contact}>
    <Gutter>
      <h1 className={classes.heading}>Get in Touch with Paywand Team</h1>
      <p>Have any questions, feedback, or need support? Fill out the form below and our team will get back to you promptly.</p>
      <p>&nbsp;</p>
      <ContactForm onSubmit={handleSubmit} />
    </Gutter>
    </div>
  );
}
