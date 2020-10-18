import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "../../helper/post";
import { Footer } from "../../shared/components/Footer";
import { Navbar, NavbarAlt } from "../../shared/components/Navbar";

export const Post = () => {
  const [posts, setPosts] = useState([]);

  // handle signup success, error, disable submit button
  const [response, setResponse] = useState({
    success: false,
    error: false,
    loading: true,
  });

  useEffect(() => {
    setResponse({ ...response, loading: true });

    getAllPosts()
      .then((posts) => {
        setPosts(posts);
        setResponse({ ...response, loading: false });
      })
      .catch((err) => {
        console.log(err);
        setResponse({ ...response, loading: false });
      });
  }, []);

  const postsJsx = () => {
    return (
      <div className="post-container">
        {posts.length > 0 ? (
          <div className="all-posts">
            {posts.map((p, i) => (
              <div key={i} className="post-card">
                <h2>{p.title}</h2>
                <div className="description">{p.description}</div>

                <Link
                  className="read-more-btn"
                  to={{
                    pathname: `/post/info`,
                    state: {
                      postId: p.id,
                    },
                  }}
                >
                  Read more
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <h1>No posts</h1>
        )}
      </div>
    );
  };

  return (
    <div>
      <Navbar />
      <NavbarAlt />

      <section className="post">
        <h1>CampsForChamps Blog</h1>

        {response.loading ? (
          <div className="loader"></div>
        ) : (
          <div className="container">
            <Link className="create-post-btn" to="/post/create">
              <i className="fas fa-pen-alt"></i> Create a post?
            </Link>

            {postsJsx()}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};
