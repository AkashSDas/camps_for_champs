import moment from "moment";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, Redirect } from "react-router-dom";
import {
  deletePost,
  dislikePost,
  getAuthorInfo,
  getPost,
  likePost,
} from "../../helper/post";
import { getUserId, getUserInfo } from "../../helper/user";
import { Footer } from "../../shared/components/Footer";
import { showWarningMsg } from "../../shared/components/Message";
import { Navbar, NavbarAlt } from "../../shared/components/Navbar";
import { Comment } from "./Comment";

export const PostInfo = (props) => {
  const [post, setPost] = useState({});
  const [authorInfo, setAuthorInfo] = useState({
    id: null,
    username: null,
    email: null,
  });

  const [reload, setReload] = useState(false);

  // handle signup success, error, disable submit button
  // and redirect to home page
  const [response, setResponse] = useState({
    success: false,
    error: false,
    loading: false,
    redirect: false, // redirect to home page after successfull login
  });

  const [message, setMessage] = useState({
    display: false,
    message: "",
  });

  // user must be author to delete/update post
  const [privilege, setPrivilege] = useState(false);

  const [redirectToBlog, setRedirectToBlog] = useState(false);

  try {
    useEffect(() => {
      setResponse({ ...response, loading: true });

      try {
        getPost(props.location.state.postId)
          .then((data) => {
            setPost(data);
            return data;
          })
          .then((data) => {
            getAuthorInfo(data.author)
              .then((data) => {
                setAuthorInfo({
                  ...authorInfo,
                  id: data.id,
                  username: data.username,
                  email: data.email,
                });

                // if username === author's username then give privilege
                // else not, this can done since username for every user
                // is unique
                (async () => {
                  if ((await getUsername()) === data.username) {
                    setPrivilege(true);
                  } else {
                    setPrivilege(false);
                  }
                })();

                setResponse({ ...response, loading: false });
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      } catch (e) {
        console.log(e);
        setMessage({
          ...message,
          display: true,
          message: "Some error occured, Please go back",
        });
      }

      // keeping post as dependency in order to re-run useEffect which will get
      // the author name using the author from post which at first time will be
      // undefined (info: you can in the console it will give "TypeError: Cannot
      // read property 'id' of undefined") for the first time
    }, [reload]);

    const likeEventHandler = () => {
      likePost(post.id)
        .then((data) => {
          setReload(!reload);
        })
        .catch((err) => console.log(err));
    };

    const dislikeEventHandler = () => {
      dislikePost(post.id)
        .then((data) => {
          setReload(!reload);
        })
        .catch((err) => console.log(err));
    };

    const redirectToBlogJsx = () => {
      if (redirectToBlog) {
        return <Redirect to="/post" />;
      }
    };

    const deletePostEvent = () => {
      deletePost(post.id)
        .then((data) => setRedirectToBlog(true))
        .catch((err) => console.log(err));
    };

    const getUsername = async () => {
      const userId = await getUserId();
      const user = await getUserInfo(userId);
      return user.username;
    };

    return (
      <div>
        <Navbar />
        <NavbarAlt />

        <section className="post-info">
          {response.loading ? (
            <div>
              <div className="message">
                {showWarningMsg(message.display, message.message)}
                <h3>
                  <Link to="/post">Go back</Link>
                </h3>
              </div>

              <div className="loader"></div>
            </div>
          ) : (
            <div className="post-container">
              <h1>{post.title}</h1>

              <h3>Author: {authorInfo.username}</h3>
              <div className="description">
                <i className="fad fa-telescope"></i> Description:{" "}
                {post.description}
              </div>

              <div className="likes-btn">
                <button onClick={likeEventHandler}>
                  <i className="fad fa-thumbs-up"></i>{" "}
                  {post.likes ? post.likes.length : 0}
                </button>

                <button onClick={dislikeEventHandler}>
                  <i className="fad fa-thumbs-down"></i>{" "}
                  {post.dislikes ? post.dislikes.length : 0}
                </button>
              </div>

              <div className="dates">
                <div>
                  Posted on {moment(post.date_posted).format("MMM Do YYYY")}
                </div>
                <div>
                  Last modified{" "}
                  {moment(post.last_modified, "YYYYMMDD").fromNow()}
                </div>
              </div>

              {privilege ? (
                <div className="author-btn-section">
                  <Link
                    className="update-btn"
                    to={{
                      pathname: `/post/update`,
                      state: {
                        post: post,
                      },
                    }}
                  >
                    <i className="fas fa-wrench"></i> Update
                  </Link>
                  <button className="delete-btn" onClick={deletePostEvent}>
                    <i className="fas fa-trash-alt"></i> Delete
                  </button>
                </div>
              ) : null}

              <hr />

              <div className="markdown">
                <ReactMarkdown source={post.content} />
              </div>

              <hr />

              <Comment
                comments={post.comments}
                postId={post.id}
                reload={reload}
                setReload={setReload}
              />
            </div>
          )}

          {redirectToBlogJsx()}
        </section>

        <Footer />
      </div>
    );
  } catch (e) {
    console.log(e);
    return <Redirect to="/post" />;
  }
};
