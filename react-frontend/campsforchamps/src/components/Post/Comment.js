import React, { useEffect, useState } from "react";
import { deleteComment } from "../../helper/comment";
import { getUserId } from "../../helper/user";
import { CommentCreateForm } from "./CommentCreateForm";
import { CommentUpdateForm } from "./CommentUpdateForm";
import { Reply } from "./Reply";
import { ReplyCreateForm } from "./ReplyCreateForm";

export const Comment = (props) => {
  const [userId, setUserId] = useState(null);
  const [displayReplies, setDisplayReplies] = useState({
    display: false,
    displayId: null,
  });

  useEffect(() => {
    setUserId(getUserId());
  }, []);

  const handleCommentDeleteEvent = (commentId) => {
    deleteComment(commentId)
      .then((data) => {
        props.setReload(!props.reload);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [displayComment, setDisplayComment] = useState({
    display: false,
    commentId: null,
  });

  const commentsJsx = () => {
    if (props.comments) {
      if (props.comments.length === 0) {
        return (
          <h2>
            <i className="fas fa-frown"></i> Be the first to comment
          </h2>
        );
      } else {
        return (
          <div>
            {props.comments.map((c, i) => (
              <div key={i} className="comment-card">
                <div className="comment-user">by {c.username}</div>
                <div className="comment-content">{c.comment}</div>

                {userId === c.user_id ? (
                  <div className="comment-user-btn">
                    <button
                      onClick={() =>
                        setDisplayComment({
                          display: !displayComment.display,
                          commentId: c.id,
                        })
                      }
                    >
                      Update
                    </button>
                    {displayComment.display &&
                    displayComment.commentId === c.id ? (
                      <CommentUpdateForm
                        comment={c.comment}
                        reload={props.reload}
                        setReload={props.setReload}
                        commentId={c.id}
                        children={c.children}
                      />
                    ) : null}{" "}
                    |
                    <button onClick={() => handleCommentDeleteEvent(c.id)}>
                      Delete
                    </button>
                  </div>
                ) : null}

                <button
                  className="replies-btn"
                  onClick={() =>
                    setDisplayReplies({
                      display: !displayReplies.display,
                      displayId: c.id,
                    })
                  }
                >
                  ({c.children.length})Replies
                </button>

                {displayReplies.display && displayReplies.displayId === c.id ? (
                  <div className="replies">
                    <ReplyCreateForm
                      post={props.postId}
                      commentId={c.id}
                      reload={props.reload}
                      setReload={props.setReload}
                    />

                    <Reply
                      replies={c.children}
                      userId={userId}
                      handleCommentDeleteEvent={handleCommentDeleteEvent}
                      reload={props.reload}
                      setReload={props.setReload}
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        );
      }
    }
  };

  return (
    <section className="comment">
      <h3>
        <i className="fas fa-comment-alt"></i> Comments (
        {props.comments ? props.comments.length : 0})
      </h3>

      <CommentCreateForm
        postId={props.postId}
        reload={props.reload}
        setReload={props.setReload}
      />

      <hr />

      {commentsJsx()}
    </section>
  );
};
