import React, { useState } from "react";
import { changeUserPassword } from "../../helper/user";
import { showWarningMsg } from "../../shared/components/Message";
import { useForm } from "../../shared/hooks/useForm";

export const ChangePasswordForm = (props) => {
  const [formValues, setFormValues, handleFormChange] = useForm({
    new_password: "",
    old_password: "",
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

    if (!(formValues.old_password && formJsx.new_password)) {
      setMessage({
        ...message,
        display: true,
        message: "Fill all the fields",
      });
      setResponse({ ...response, loading: false });
    } else {
      changeUserPassword(formValues)
        .then((data) => {
          setMessage({
            ...message,
            display: true,
            message: "Password changed successfully",
          });
          console.log("Hi", data);
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
        <label>Old Password</label>
        <input
          type="password"
          name="old_password"
          value={formValues.old_password}
          onChange={handleFormChange}
          placeholder="Enter your old password"
        />

        <label>New Password</label>
        <input
          type="password"
          name="new_password"
          value={formValues.new_password}
          onChange={handleFormChange}
          placeholder="Enter your new password"
        />

        <button type="submit" disabled={response.loading}>
          <i className="fas fa-frog"></i> Change
        </button>
      </form>
    );
  };

  return (
    <section className="change-password">
      <h1>Change Password</h1>

      {showWarningMsg(message.display, message.message)}

      <button
        className="top-link-btn"
        onClick={() =>
          props.setDisplay({
            ...props.display,
            userCoreInfo: true,
            changePasswordForm: false,
          })
        }
      >
        <i className="fas fa-arrow-left"></i> Go back
      </button>

      {formJsx()}
    </section>
  );
};
