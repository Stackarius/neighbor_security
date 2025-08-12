import React from "react";

const ContactForm = () => {
  return (
    <div className="grid mx-auto">
      <h2 className="text-2xl font-bold my-4 text-center">Contact Form</h2>
      <form className="block bg-gray-100 p-8 mt-4 w-full md:w-[600px] rounded shadow-md">
        <div className="input-field">
          <label htmlFor="email">Email</label>
          <input type="email" />
        </div>
        <div className="input-field">
          <label htmlFor="organisation">Organisation (optional)</label>
          <input type="text" />
        </div>
        <div className="input-field">
          <label htmlFor="phone">Phone</label>
          <input type="text" />
        </div>

        <div className="input-field">
          <label htmlFor="message">Message</label>
          <textarea className="" id="ct-msg"></textarea>
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Send Message</button>
      </form>
    </div>
  );
};

export default ContactForm;
