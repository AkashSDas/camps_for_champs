import React, { useState } from "react";
import { CommentUpdateForm } from "./CommentUpdateForm";

export const Reply = (props) => {
  const [display, setDisplay] = useState(false);

  return (
    <section className="reply">
      {props.replies ? (
        <div>
          {props.replies.map((r, i) => (
            <div key={i} className="reply-card">
              <hr />

              <div>
                <span className="reply-user">by {r.username}</span> |{" "}
                <span className="reply-content"> {r.comment}</span>
              </div>
              {r.user_id === props.userId ? (
                // reply update and delete buttons
                <div className="comment-user-btn">
                  <button onClick={() => setDisplay(!display)}>Update</button>
                  {display ? (
                    // comment update form is used for reply update form
                    <CommentUpdateForm
                      comment={r.comment}
                      reload={props.reload}
                      setReload={props.setReload}
                      commentId={r.id}
                      children={r.children}
                    />
                  ) : null}

                  {/* handleCommentDeleteEvent can also be used in deleting the 
                reply because comments and replies are the same thing */}
                  <button onClick={() => props.handleCommentDeleteEvent(r.id)}>
                    Delete
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
};
