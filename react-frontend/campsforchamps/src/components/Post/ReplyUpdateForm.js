import React, { useState } from "react";
import { updateComment } from "../../helper/comment";
import { useForm } from "../../shared/hooks/useForm";

export const ReplyUpdateForm = (props) => {
  const [formValues, setFormValues, handleFormChange] = useForm({
    reply: props.reply,
  });

  // handle signup success, error, disable submit button
  // and redirect to home page
  const [response, setResponse] = useState({
    success: false,
    error: false,
    loading: false,
    redirect: false, // redirect to home page after successfull login
  });

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setResponse({ ...response, loading: true });

    const commentData = {
      comment: formValues.reply,
      children: props.children ? props.children : [],
      id: props.commentId,
    };

    updateComment(props.commentId, commentData)
      .then((data) => {
        console.log(data);
        setResponse({ ...response, loading: false });
      })
      .then((_) => props.setReload(!props.reload))
      .catch((err) => {
        console.log(err);
        setResponse({ ...response, loading: false });
      });
  };

  const formJsx = () => (
    <form onSubmit={handleFormSubmit}>
      <label>Comment</label>
      <input
        type="text"
        name="comment"
        value={formValues.comment}
        onChange={handleFormChange}
        placeholder="Write your comment"
      />

      <button type="submit" disabled={response.loading}>
        Submit
      </button>
    </form>
  );

  return <section>{formJsx()}</section>;
};
