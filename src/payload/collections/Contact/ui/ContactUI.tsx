import * as React from 'react'
import { useFormFields } from 'payload/components/forms'
import { Input } from '../../../../app/_components/Input'

const ContactUI: React.FC = () => {
  const [name, setName] = React.useState<string>('')
  const [email, setEmail] = React.useState<string>('')
  const [message, setMessage] = React.useState<string>('')

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  return (
    <div>
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={handleNameChange}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label>Message:</label>
        <textarea
          rows={5}
          value={message}
          onChange={handleMessageChange}
          className="form-control"
          required
        />
      </div>
    </div>
  )
}

export default ContactUI