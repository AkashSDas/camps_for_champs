import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { signup } from "../../helper/user";
import { Footer } from "../../shared/components/Footer";
import { showWarningMsg } from "../../shared/components/Message";
import { Navbar, NavbarAlt } from "../../shared/components/Navbar";
import { useForm } from "../../shared/hooks/useForm";

export const SignUp = () => {
  const [formValues, setFormValues, handleFormChange] = useForm({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // handle signup success, error and disable submit button
  const [response, setResponse] = useState({
    success: false,
    error: false,
    loading: false,
    redirect: false,
  });

  const clearInputFields = () => {
    setFormValues({
      ...formValues,
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const [message, setMessage] = useState({
    display: false,
    message: "",
  });

  // form submit handler
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
      !(
        formValues.email &&
        formValues.username &&
        formValues.password &&
        formValues.confirmPassword
      )
    ) {
      setMessage({
        ...message,
        display: true,
        message: "Fill all the fields",
      });
      setResponse({ ...response, loading: false });
    } else {
      signup({
        username: formValues.username,
        email: formValues.email,
        password: formValues.password,
      })
        .then((data) => {
          console.log("SignUp Data: ", data);

          if (data.email === formValues.email) {
            // success
            clearInputFields();
            setResponse({ ...response, success: true, loading: false });
          } else {
            // error

            if (data.email && data.username) {
              setMessage({
                ...message,
                display: true,
                message: "Email and Username already taken",
              });
            } else if (data.email) {
              setMessage({
                ...message,
                display: true,
                message: "Email address already taken",
              });
            } else if (data.usernam) {
              setMessage({
                ...message,
                display: true,
                message: "Username already taken",
              });
            }
            setResponse({ ...response, error: true, loading: false });
          }
        })
        .catch((err) => console.log(`Sign Up after submit error: ${err}`));
      // TODO: handle error
    }
  };

  const redirectToLogin = () => {
    if (response.redirect) {
      return <Redirect to="/login" />;
    }
  };

  const signupJsxForm = () => {
    return (
      <form className="form" onSubmit={handleFormSubmit}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formValues.username}
          onChange={handleFormChange}
          placeholder="Unique username"
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleFormChange}
          placeholder="Unique email address"
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formValues.password}
          onChange={handleFormChange}
          placeholder="Password"
        />

        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formValues.confirmPassword}
          onChange={handleFormChange}
          placeholder="Retype the password"
        />

        <Link to="/login">Already have an account?</Link>

        <button type="submit" disabled={response.loading}>
          <i className="fas fa-unicorn"></i> Sign Up
        </button>
      </form>
    );
  };

  return (
    <div>
      <Navbar />
      <NavbarAlt />

      <section className="auth">
        <h1>Sign Up</h1>

        {showWarningMsg(message.display, message.message)}

        {signupJsxForm()}

        {redirectToLogin()}
      </section>

      <Footer />
    </div>
  );
};
