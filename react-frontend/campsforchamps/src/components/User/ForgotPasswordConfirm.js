import React, { useState } from "react";
import { Link } from "react-router-dom";
import { passwordResetConfirm } from "../../helper/user";
import { Footer } from "../../shared/components/Footer";
import { showWarningMsg } from "../../shared/components/Message";
import { Navbar, NavbarAlt } from "../../shared/components/Navbar";
import { useForm } from "../../shared/hooks/useForm";

export const ForgotPasswordConfirm = (props) => {
  // handle forgot password confirm form values
  const [formValues, setFormValues, handleFormChange] = useForm({
    token: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({
    display: false,
    message: "",
  });

  // handle signup success, error and disable submit button
  const [response, setResponse] = useState({
    success: false,
    error: false,
    loading: false,
  });

  // handle form submit
  const handleFormSubmit = (event) => {
    event.preventDefault();
    setResponse({ ...response, loading: true });

    // validate password and confirmPassword
    if (formValues.password !== formValues.confirmPassword) {
      setMessage({
        ...message,
        display: true,
        message: "Password and confirm password must be equal",
      });
      setResponse({ ...response, loading: false });
    } else if (
      !(formValues.token && formValues.password && formValues.confirmPassword)
    ) {
      setMessage({
        ...message,
        display: true,
        message: "Fill all the fields",
      });
      setResponse({ ...response, loading: false });
    } else {
      passwordResetConfirm({
        token: formValues.token,
        password: formValues.password,
      })
        .then((data) => {
          console.log("Data forgot password confirm: ", data);
          if (data.status === "OK") {
            props.toggleLoginFormDisplay();
          }
          setResponse({ ...response, loading: false });
        })
        .catch((err) => {
          setMessage({
            ...message,
            display: true,
            message: "Some unknown error occured, Please try again",
          });
          console.log(`Password reset confirm error: ${err}`);
          setResponse({ ...response, loading: false });
        });
    }
  };

  const forgotPasswordFormConfirmJsx = () => {
    return (
      <form className="form" onSubmit={handleFormSubmit}>
        <label>Token</label>
        <input
          type="text"
          name="token"
          value={formValues.token}
          onChange={handleFormChange}
          placeholder="Enter the token you received on your email account"
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formValues.password}
          onChange={handleFormChange}
          placeholder="New Password"
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formValues.confirmPassword}
          onChange={handleFormChange}
          placeholder="Retype the password"
        />

        <Link to="/login">Go to login</Link>
        <Link to="/password-reset">Go back</Link>

        <button type="submit" disabled={response.loading}>
          <i className="fas fa-hippo"></i> Submit
        </button>
      </form>
    );
  };

  return (
    <div>
      <Navbar />
      <NavbarAlt />

      <section className="auth">
        <h1>Reset password</h1>

        {showWarningMsg(message.display, message.message)}

        {forgotPasswordFormConfirmJsx()}
      </section>

      <Footer />
    </div>
  );
};
