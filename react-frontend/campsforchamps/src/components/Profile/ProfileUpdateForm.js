import React, { useState } from "react";
import { updateUserProfile } from "../../helper/profile";
import { showWarningMsg } from "../../shared/components/Message";
import { useForm } from "../../shared/hooks/useForm";

export const ProfileUpdateForm = (props) => {
  const [formValues, setFormValues, handleFormChange] = useForm({
    // default values are empty strings if fields have null value
    id: props.profile.id ? props.profile.id : null, // userId === that user's profileId
    first_name: props.profile.first_name ? props.profile.first_name : "",
    last_name: props.profile.last_name ? props.profile.last_name : "",
    phone_number: props.profile.phone_number ? props.profile.phone_number : "",
    gender: props.profile.gender ? props.profile.gender : "",
    address: props.profile.address ? props.profile.address : "",
    user: props.profile.user,
    // image: props.profile.image ? props.profile.image : "",
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

  // handle user profile form submit
  const handleFormSubmit = (event) => {
    event.preventDefault();
    setResponse({ ...response, loading: true });

    updateUserProfile(formValues.id, formValues)
      .then((data) => {
        setMessage({
          ...message,
          display: true,
          message: "Successfully updated personal info",
        });
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
    // TODO: handle messages success or error
  };

  const formJsx = () => {
    return (
      // encType="multipart/form-data"
      <form className="form" onSubmit={handleFormSubmit}>
        <label>First Name</label>
        <input
          type="text"
          name="first_name"
          value={formValues.first_name}
          onChange={handleFormChange}
          placeholder="Your first name"
        />

        <label>Last Name</label>
        <input
          type="text"
          name="last_name"
          value={formValues.last_name}
          onChange={handleFormChange}
          placeholder="Your last name"
        />

        <label>Phone number</label>
        <input
          type="text"
          name="phone_number"
          value={formValues.phone_number}
          onChange={handleFormChange}
          placeholder="Your phone number"
        />

        <label>Gender</label>
        <select
          name="gender"
          onChange={handleFormChange}
          value={formValues.gender}
        >
          <option value="3">Don't want to answer</option>
          <option value="0">Male</option>
          <option value="1">Female</option>
          <option value="2">Transgender</option>
        </select>

        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formValues.address}
          onChange={handleFormChange}
          placeholder="Where do you live?"
        />

        {/* <label>Profile image</label>
        <input type="file" name="image" onChange={handleFormChange} /> */}

        <button type="submit" disabled={response.loading}>
          <i className="fas fa-turtle"></i> Update
        </button>
      </form>
    );
  };

  return (
    <section className="personal-info-update">
      <h1>Update personal info</h1>

      {showWarningMsg(message.display, message.message)}

      <button
        className="top-link-btn"
        onClick={() =>
          props.setDisplay({
            ...props.display,
            userCoreInfo: true,
            profileUpdateForm: false,
          })
        }
      >
        <i className="fas fa-arrow-left"></i> Go back
      </button>

      {formJsx()}
    </section>
  );
};
