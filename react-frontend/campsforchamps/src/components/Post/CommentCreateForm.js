import React, { useState } from "react";
import { createComment } from "../../helper/comment";
import { useForm } from "../../shared/hooks/useForm";

export const CommentCreateForm = (props) => {
  const [formValues, setFormValues, handleFormChange] = useForm({
    comment: "",
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

    const commentData = {
      post: props.postId,
      comment: formValues.comment,
      children: null,
    };

    createComment(commentData)
      .then((data) => {
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
      <label>Comment</label>
      <input
        type="text"
        name="comment"
        value={formValues.comment}
        onChange={handleFormChange}
        placeholder="Write your comment"
      />

      <button
        className="create-comment-btn"
        type="submit"
        disabled={response.loading}
      >
        <i className="fad fa-dove"></i> Submit
      </button>
    </form>
  );

  return <section className="create-comment">{formJsx()}</section>;
};
