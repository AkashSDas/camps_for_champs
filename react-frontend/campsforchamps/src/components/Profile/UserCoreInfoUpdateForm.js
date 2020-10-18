import React, { useState } from "react";
import { updateUserCoreInfo } from "../../helper/user";
import { showWarningMsg } from "../../shared/components/Message";
import { useForm } from "../../shared/hooks/useForm";

export const UserCoreInfoUpdateForm = (props) => {
  const [formValues, setFormValues, handleFormChange] = useForm({
    username: props.user.data.username,
    email: props.user.data.email,
    password: null,
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

    if (!(formValues.username && formValues.email && formValues.password)) {
      setMessage({
        ...message,
        display: true,
        message: "Fill all the fields",
      });
    } else {
      updateUserCoreInfo(formValues)
        .then((data) => {
          setMessage({
            ...message,
            display: true,
            message: "Successfully udpdate user core info",
          });
          console.log(data);
          setResponse({ ...response, loading: false });
        })
        .catch((err) => {
          setMessage({
            ...message,
            display: true,
            message: "Some error occured, Please try again",
          });
          console.log(err);
          setResponse({ ...response, loading: false });
        });
    }
  };

  const formJsx = () => {
    return (
      <form className="form" onSubmit={handleFormSubmit}>
        <label>Username</label>
        <input
          type="text"
          name="username"
          value={formValues.username}
          onChange={handleFormChange}
          placeholder="Your email address"
        />

        <label>Email</label>
        <input
          type="email"
          name="eamil"
          value={formValues.email}
          onChange={handleFormChange}
          placeholder="Your email address"
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formValues.password}
          onChange={handleFormChange}
          placeholder="Your password"
        />

        <button type="submit" disabled={response.loading}>
          <i className="fad fa-dove"></i> Update
        </button>
      </form>
    );
  };

  return (
    <section className="update-core-info">
      <h1>Update core info</h1>

      {showWarningMsg(message.display, message.message)}

      <button
        className="top-link-btn"
        onClick={() =>
          props.setDisplay({
            ...props.display,
            userCoreInfo: true,
            userCoreInfoUpdateForm: false,
          })
        }
      >
        <i className="fas fa-arrow-left"></i> Go back
      </button>

      {formJsx()}
    </section>
  );
};
