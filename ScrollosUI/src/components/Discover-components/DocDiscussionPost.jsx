import { useEffect, useRef, useState } from "react";
import DocPostReplies from "./DocPostReplies";
import likedIcon from "../../assets/cards-v2-icons/bookmark.svg";
import notLikedIcon from "../../assets/cards-v2-icons/unfilled-bookmark.svg";
import replyIcon from "../../assets/reply.svg";
import postIcon from "../../assets/post.svg";

export default function DocPost(props) {
  const {
    post,
    apiDoc,
    selectedIndex,
    index,
    clientUserData,
    setDiscussions,
    discussions,
    handleDeletePost,
    // handleDeleteReply,
    setPosts,
  } = props;

  // const [post, setPost] = useState(loadedPost);
  const [likedBy, setLikedBy] = useState(post.likedBy);
  const [isReplying, setIsReplying] = useState(false);
  const [replyInput, setReplyInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewReplies, setIsViewReplies] = useState(false);
  const [newReplies, setNewReplies] = useState([]);
  const [isNewRepliesOpen, setIsNewRepliesOpen] = useState(true);
  const replyRef = useRef(null);

  function handleViewReplies(e) {
    setIsViewReplies(!isViewReplies);
  }

  function handleLikePost(e) {
    fetch(
      `http://localhost:3001/toggleLikePost/${apiDoc._id}/${selectedIndex}/${index}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: clientUserData._id,
        }),
      }
    )
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
      });

    setLikedBy((prev) => {
      console.log("likedBy", likedBy);
      if (prev.includes(clientUserData._id)) {
        console.log("included");
        const copy = [...prev];
        const index = prev.indexOf(clientUserData._id);
        copy.splice(index, 1);
        return [...copy];
      } else {
        return [...prev, clientUserData._id];
      }
    });
  }
  useEffect(() => {
    //focus after element is added to dom
    if (isReplying) {
      replyRef.current.focus();
    }
  }, [isReplying]);

  function handleReply() {
    setIsReplying(!isReplying);
  }

  function handleReplyInput(e) {
    setReplyInput(e.target.value);
  }

  function handleSubmitReply() {
    if (replyInput) {
      fetch(
        `http://localhost:3001/addReplyToPost/${apiDoc._id}/${selectedIndex}/${index}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reply: replyInput,
            author: clientUserData.username,
            authorId: clientUserData._id,
          }),
        }
      )
        .then((res) => res.json())
        .then((json) => {});
      setNewReplies((prev) => {
        let copy = [...prev];
        copy.unshift(replyInput);
        return [...copy];
      });
      setReplyInput("");
      setIsReplying(false);
      // check if has input before submitting
    }
  }

  const matches = post.post.match(/\n/g);
  const createdDate = new Date(post.createdAt);
  let pmOrAm = () => {
    if (!(createdDate.getUTCHours() >= 12)) {
      return "pm";
    } else return "am";
  };

  let numbOfLinesForPost = 0;
  if (matches) {
    numbOfLinesForPost = matches.length;
  }
  const postHeight = 21 + 23 * numbOfLinesForPost;
  return (
    <div className="post-main-container" key={index}>
      <div className="post-container">
        <div className="author">{post.author}</div>
        <textarea
          style={{ height: `${postHeight}px` }}
          readOnly
          value={post.post}
          className="fake-input-for-wrap"
        ></textarea>
      </div>

      {
        <div className="under-post-container">
          <div className="under-post">
            <div className="actions-flex">
              <div className="button-flex">
                <button
                  id={index}
                  onClick={(e) => {
                    handleLikePost(e);
                  }}
                  className="under-post-button"
                >
                  {likedBy.includes(clientUserData._id) ? (
                    <img className="like-icon" src={likedIcon} />
                  ) : (
                    <img className="like-icon" src={notLikedIcon} />
                  )}
                </button>
                <div>{likedBy ? `${likedBy.length}` : "0"}</div>
              </div>

              <button
                id={index}
                onClick={handleReply}
                className="under-post-button"
              >
                <div className="button-flex">
                  <img className="reply-icon" src={replyIcon}></img>
                  <div>Reply</div>
                </div>
              </button>
              {/* only show delete button if is autho */}
              {post.authorId === clientUserData._id && (
                <>
                  {!isDeleting ? (
                    <button
                      id={index}
                      onClick={() => setIsDeleting(!isDeleting)}
                      className="under-post-button"
                    >
                      Delete
                    </button>
                  ) : (
                    <div className="confirm-delete-container">
                      <button
                        onClick={(e) => {
                          handleDeletePost(e);
                          setIsDeleting(false);
                        }}
                        id={index}
                        className="under-post-button confirm"
                      >
                        Confirm
                      </button>
                      <button
                        className="under-post-button cancel"
                        onClick={() => setIsDeleting(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="post-time">
              {post.createdAt
                ? `${
                    createdDate.getMonth() + 1
                  }/${createdDate.getDate()}/${createdDate.getFullYear()}  ${createdDate.getUTCHours()}:${createdDate.getUTCMinutes()}${pmOrAm()}`
                : "just now"}
            </div>
          </div>

          {/* input */}
          {isReplying && (
            <div className="reply-input-container">
              <input
                ref={replyRef}
                value={replyInput}
                onChange={handleReplyInput}
                placeholder="reply here"
                className="reply-input"
              ></input>
              <div className="flex-container">
                <button
                  onClick={() => {
                    setIsReplying(false);
                  }}
                  className="cancel-reply"
                >
                  Cancel
                </button>
                <button
                  style={!replyInput ? { opacity: "40%" } : {}}
                  onClick={handleSubmitReply}
                  className="post-button"
                  type="button"
                >
                  <div>
                    <img src={postIcon} />
                  </div>
                  <div>Post</div>
                </button>
              </div>
            </div>
          )}

          {/* New replies */}
          {!newReplies.length == 0 && isNewRepliesOpen && (
            <>
              {newReplies.map((newReply, index) => {
                return (
                  <div key={index} className="new-replies-container">
                    <div className="post-container">
                      <div className="author">test </div>
                      <textarea
                        style={{ height: `${21}px` }}
                        readOnly
                        value={newReply}
                        className="fake-input-for-wrap"
                      ></textarea>
                    </div>

                    <div className="under-new-replies-container">
                      <div></div>
                      <div>just now</div>
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {!post.replies.length == 0 && (
            <div
              id={index}
              onClick={handleViewReplies}
              className="view-replies"
              style={isViewReplies ? { marginLeft: "40px" } : {}}
            >
              {!isViewReplies
                ? `View ${post.replies.length} more ${""} ${
                    post.replies.length > 1 ? "replies" : "reply"
                  }`
                : "Hide"}
            </div>
          )}
        </div>
      }
      {/* replies */}
      {isViewReplies &&
        post.replies.map((reply, replyIndex) => {
          return (
            <DocPostReplies
              loadedReply={reply}
              clientUserData={clientUserData}
              index={replyIndex}
              postIndex={index}
              key={replyIndex}
              setDiscussions={setDiscussions}
              discussions={discussions}
              selectedIndex={selectedIndex}
              apiDoc={apiDoc}
              setPosts={setPosts}
            />
          );
        })}
    </div>
  );
}
