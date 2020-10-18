import React, { useState } from "react";
import { createComment } from "../../helper/comment";
import { useForm } from "../../shared/hooks/useForm";

export const ReplyCreateForm = (props) => {
  const [formValues, setFormValues, handleFormChange] = useForm({
    reply: "",
  });

  // handle signup success, error, disable submit button
  // and redirect to home page
  const [response, setResponse] = useState({
    success: false,
    error: false,
    loading: false,
    redirect: false,
  });

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setResponse({ ...response, loading: true });

    const replyData = {
      post: props.postId,
      comment: formValues.reply,
      parent: props.commentId,
    };

    createComment(replyData)
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
    <form className="form" onSubmit={handleFormSubmit}>
      <label>Reply</label>
      <input
        type="text"
        name="reply"
        value={formValues.reply}
        onChange={handleFormChange}
        placeholder="Write your reply"
      />

      <button type="submit" disabled={response.loading}>
        <i className="fad fa-reply"></i> Submit
      </button>
    </form>
  );

  return <section className="create-reply">{formJsx()}</section>;
};
