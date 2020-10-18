import React from "react";
import { Footer } from "../../shared/components/Footer";
import { Navbar, NavbarAlt } from "../../shared/components/Navbar";
import { useForm } from "../../shared/hooks/useForm";

export const ContactUs = () => {
  const [formValues, setFormValues, handleFormChange] = useForm({
    email: "",
    reason: "",
  });

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log("Thanks for contacting");
  };

  return (
    <div>
      <Navbar />
      <NavbarAlt />

      <section className="contact-us">
        <h1>Contact Us</h1>

        <form className="form" onSubmit={handleFormSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleFormChange}
            placeholder="Your email"
          />

          <label>Reason</label>
          <textarea
            name="reason"
            value={formValues.reason}
            onChange={handleFormChange}
            placeholder="Your reason for contacting"
          />

          <button type="submit">
            <i className="fad fa-dove"></i> Submit
          </button>
        </form>
      </section>

      <Footer />
    </div>
  );
};
