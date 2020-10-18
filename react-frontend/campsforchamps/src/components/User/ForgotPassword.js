import React, { useState } from "react";
import { Link } from "react-router-dom";
import { passwordReset } from "../../helper/user";
import { Footer } from "../../shared/components/Footer";
import { showWarningMsg } from "../../shared/components/Message";
import { Navbar, NavbarAlt } from "../../shared/components/Navbar";
import { useForm } from "../../shared/hooks/useForm";

export const ForgotPassword = (props) => {
  // handle forgot password form values
  const [formValues, setFormValues, handleFormChange] = useForm({
    email: "",
  });

  // handle signup success, error and disable submit button
  const [response, setResponse] = useState({
    success: false,
    error: false,
    loading: false,
  });

  const [message, setMessage] = useState({
    display: false,
    message: "",
  });

  // handle form submit
  const handleFormSubmit = (event) => {
    event.preventDefault();
    setResponse({ ...response, loading: true });

    if (formValues.email) {
      passwordReset(formValues)
        .then((data) => {
          console.log("Password reset data", data);
          if (data.status === "OK") {
            // go to submit token form
            props.toggleForgotPasswordDisplay();
          }
          // handle no user case
          setResponse({ ...response, loading: false });
        })
        .catch((err) => {
          setMessage({
            ...message,
            display: true,
            message: "Some unkown error occured, Please try again",
          });
          console.log(`Password reset error: ${err}`);
          setResponse({ ...response, loading: false });
        });
    } else {
      setMessage({
        ...message,
        display: true,
        message: "Fill all the fields",
      });
      setResponse({ ...response, loading: false });
    }
  };

  const forgotPasswordFormJsx = () => {
    return (
      <form className="form" onSubmit={handleFormSubmit}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleFormChange}
          placeholder="Email on which reset password token would be sent"
        />

        <Link to="/login">Go to login</Link>
        <Link to="/password-reset/confirm">Enter password reset token?</Link>

        <button type="submit" disabled={response.loading}>
          <i className="fas fa-deer-rudolph"></i> Submit
        </button>
      </form>
    );
  };

  return (
    <div>
      <Navbar />
      <NavbarAlt />

      <section className="auth">
        <h1>Forgot Password</h1>

        {showWarningMsg(message.display, message.message)}

        {forgotPasswordFormJsx()}
      </section>

      <Footer />
    </div>
  );
};
