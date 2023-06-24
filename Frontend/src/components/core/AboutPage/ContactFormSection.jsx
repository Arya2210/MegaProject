import React from 'react'
import ContactUsForm from '../../ContactPage/ContactUsForm'

function ContactFormSection() {
  return (
    <div className='mx-auto flex flex-col'>

        <h1>
            Get In Touch
        </h1>
        <p>
            We would love to here for you , Please fill out this form
        </p>

        <div>
            <ContactUsForm/>
        </div>

    </div>
  )
}

export default ContactFormSection