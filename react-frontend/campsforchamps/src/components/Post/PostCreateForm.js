import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Redirect } from "react-router-dom";
import { API } from "../../backend";
import { createPost } from "../../helper/post";
import { getUserId } from "../../helper/user";
import { Footer } from "../../shared/components/Footer";
import { Navbar, NavbarAlt } from "../../shared/components/Navbar";
import { useForm } from "../../shared/hooks/useForm";

export const PostCreateForm = (props) => {
  const [formValues, setFormValues, handleFormChange] = useForm({
    title: props.post ? props.post.title : "",
    description: props.post ? props.post.description : "",
    content: props.post ? props.post.content : "",
    author: props.post ? props.post.author : null,
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

    const postData = {
      ...formValues,
      author: `${API}user/${getUserId()}/`,
    };
    createPost(postData)
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
        setResponse({ ...response, error: true, loading: false });
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
        <h2>{formValues.title}</h2>
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formValues.title}
          onChange={handleFormChange}
          placeholder="Your post title"
        />

        <div className="description">{formValues.description}</div>
        <label>Description</label>
        <input
          type="text"
          name="description"
          value={formValues.description}
          onChange={handleFormChange}
          placeholder="Descrition of your post (optional)"
        />

        <ReactMarkdown
          className="markdown"
          source={formValues.content}
          escapeHtml={false}
        />
        <label>Content</label>
        <textarea
          type="text"
          name="content"
          value={formValues.content}
          onChange={handleFormChange}
          placeholder="Your post content"
        />

        <button type="submit" disabled={response.loading}>
          <i className="fad fa-kiwi-bird"></i> Submit
        </button>
      </form>
    );
  };

  return (
    <div>
      <Navbar />
      <NavbarAlt />

      <section className="post-create">
        <h1>Write your post</h1>

        {formJsx()}

        {redirectToPostInfo()}
      </section>

      <Footer />
    </div>
  );
};
