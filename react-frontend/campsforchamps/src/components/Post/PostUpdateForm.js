import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Redirect } from "react-router-dom";
import { updatePost } from "../../helper/post";
import { Footer } from "../../shared/components/Footer";
import { Navbar, NavbarAlt } from "../../shared/components/Navbar";
import { useForm } from "../../shared/hooks/useForm";

export const PostUpdateForm = (props) => {
  const post = props.location.state.post;
  const [formValues, setFormValues, handleFormChange] = useForm({
    title: post ? post.title : "",
    description: post ? post.description : "",
    content: post ? post.content : "",
    author: post ? post.author : null,
  });

  // handle signup success, error, disable submit button
  // and redirect to home page
  const [response, setResponse] = useState({
    success: false,
    error: false,
    loading: false,
    redirect: false, // redirect to home page after successfull login
  });

  const [redirect, setRedirect] = useState({
    postId: null,
    doRedirect: false,
  });

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setResponse({ ...response, loading: true });

    updatePost(post.id, formValues)
      .then((data) => {
        console.log(data);
        setRedirect({
          ...redirect,
          postId: data.id,
          doRedirect: true,
        });
        setResponse({ ...response, success: true, loading: false });
      })
      .catch((err) => {
        setResponse({ ...response, error: true, loading: true });
        console.log(err);
      });
  };

  const redirectToPostInfo = () => {
    if (redirect.doRedirect) {
      return (
        <Redirect
          to={{
            pathname: "/post/info",
            state: {
              postId: redirect.postId,
            },
          }}
        />
      );
    }
  };

  const formJsx = () => {
    return (
      <form className="form" onSubmit={handleFormSubmit}>
        <h1>{formValues.title}</h1>

        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formValues.title}
          onChange={handleFormChange}
          placeholder="Your post title"
        />

        <h3 className="description">{formValues.description}</h3>
        <label>Description</label>
        <input
          type="text"
          name="description"
          value={formValues.description}
          onChange={handleFormChange}
          placeholder="Descrition of your post (optional)"
        />

        {/* {formValues.content} */}
        <ReactMarkdown source={formValues.content} />
        <label>Content</label>
        <textarea
          type="text"
          name="content"
          value={formValues.content}
          onChange={handleFormChange}
          placeholder="Your post content"
        />

        <button type="submit" disabled={response.loading}>
          <i className="fad fa-alien-monster"></i> Submit
        </button>
      </form>
    );
  };

  return (
    <div>
      <Navbar />
      <NavbarAlt />

      <section className="post-update">
        {formJsx()}

        {redirectToPostInfo()}
      </section>

      <Footer />
    </div>
  );
};
