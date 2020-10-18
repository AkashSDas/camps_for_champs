import React, { useContext, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated, saveAuthToken } from "../../helper/auth";
import { login } from "../../helper/user";
import { Footer } from "../../shared/components/Footer";
import { showWarningMsg } from "../../shared/components/Message";
import { Navbar, NavbarAlt } from "../../shared/components/Navbar";
import { useForm } from "../../shared/hooks/useForm";
import { UserContext } from "../../shared/hooks/UserContext";

export const LogIn = () => {
  // user context
  const { userValues, setUserValues } = useContext(UserContext);

  // handle login form values
  const [formValues, setFormValues, handleFormChange] = useForm({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // handle signup success, error, disable submit button
  // and redirect to home page
  const [response, setResponse] = useState({
    success: false,
    error: false,
    loading: false,
    redirect: false, // redirect to home page after successfull login
  });

  const clearInputFields = () => {
    setFormValues({
      ...formValues,
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
      !(formValues.email && formValues.password && formValues.confirmPassword)
    ) {
      setMessage({
        ...message,
        display: true,
        message: "Fill all the fields",
      });
      setResponse({ ...response, loading: false });
    } else {
      login({
        email: formValues.email,
        password: formValues.password,
      })
        .then((data) => {
          if (!data) {
            setMessage({
              ...message,
              display: true,
              message: "Incorrect email/password",
            });
            setResponse({ ...response, loading: false });
          } else if (data.user.email === formValues.email) {
            // success

            clearInputFields();

            // updating user context
            setUserValues({
              userId: data.user.id,
              username: data.user.username,
              email: data.user.email,
            });

            // save session_token and user_id(for logging out the user)
            console.log(data);
            data = {
              token: data.token,
              user: {
                id: data.user.id,
              },
              authToken: data.authToken,
            };
            saveAuthToken(data, () => {
              console.log("Token added");

              // put this here only because if it is passed outside this
              // the change might happen after the component is unmounted
              // which creates some issues, keeping it here keeps everything
              // fine
              setResponse({
                ...response,
                success: true,
                redirect: true, // after the user has logout he/she can go login page
                loading: false,
              });
            });
          } else {
            // error
            setResponse({ ...response, error: true, loading: false });
          }
        })
        .catch((err) => console.log(`Login after submit error: ${err}`));
      // TODO: handle error
    }
  };

  // redirect to home page after the user is logged in
  const redirectToHome = () => {
    if (isAuthenticated()) {
      return <Redirect to="/" />;
    }
  };

  const loginJsxForm = () => {
    return (
      <form className="form" onSubmit={handleFormSubmit}>
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

        <Link to="/signup">Don't have an account?</Link>
        <Link to="/password-reset">Forgot password?</Link>

        <button type="submit" disabled={response.loading}>
          <i className="fas fa-alien-monster"></i> Log In
        </button>
      </form>
    );
  };

  return (
    <div>
      <Navbar />
      <NavbarAlt />

      <section className="auth">
        <h1>LogIn</h1>

        {showWarningMsg(message.display, message.message)}

        {loginJsxForm()}

        {redirectToHome()}
      </section>

      <Footer />
    </div>
  );
};
