import React, { useState } from 'react';
import { Button } from '../../../_components/Button'; // Import Button component

import classes from './index.module.scss';

interface ContactFormProps {
  onSubmit: (formData: { name: string; email: string; message: string }) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State for showing success message

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Ensure all fields are filled
    if (!name || !email || !message) {
      alert('Please fill out all fields.');
      return;
    }
    const formData = {
      name,
      email,
      message,
    };
    await onSubmit(formData); // Pass form data to parent component
    // Optionally, reset form fields after submission
    setName('');
    setEmail('');
    setMessage('');
    setShowSuccessMessage(true); // Show success message
    setTimeout(() => {
      setShowSuccessMessage(false); // Hide success message after a delay
    }, 3000); // Adjust the delay as needed
  };

  return (
    <form onSubmit={handleSubmit} className={classes.form}>
      <div className={classes.field}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className={classes.field}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className={classes.field}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
        />
      </div>
      <div className={classes.actions}>
        <Button
          type="submit"
          appearance={name && email && message ? 'primary' : 'secondary'} // Conditionally set appearance
          disabled={!name || !email || !message} // Disable button if fields are empty
        >
          Submit
        </Button>
      </div>
      {showSuccessMessage && (
        <div className={classes.successMessage}>
          Message sent successfully. We'll get back to you soon!
        </div>
      )}
    </form>
  );
};

export default ContactForm;
