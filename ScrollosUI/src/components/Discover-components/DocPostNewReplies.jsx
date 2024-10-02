import { useEffect, useState } from "react";
import likedIcon from "../../assets/cards-v2-icons/bookmark.svg";
import loadingImg from "../../assets/loading.svg";
import notLikedIcon from "../../assets/cards-v2-icons/unfilled-bookmark.svg";
export default function DocPostNewReplies(props) {
  const {
    loadedReply,
    clientUserData,
    index,
    setDiscussions,
    discussions,
    selectedIndex,
    postIndex,
    apiDoc,
    setPosts,
    prevRepliesLength,
    setNewReplies,
    // handleDeleteReply,
  } = props;
  const [reply, setReply] = useState(loadedReply);
  const [likedBy, setLikedBy] = useState(loadedReply.likedBy);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(0);

  const createdDate = new Date(reply.createdAt);
  let pmOrAm = () => {
    if (!(createdDate.getUTCHours() >= 12)) {
      return "pm";
    } else return "am";
  };
  const matches = reply.reply.match(/\n/g);
  let numbOfLinesForPost = 0;
  if (matches) {
    numbOfLinesForPost = matches.length;
  }
  const postHeight = 21 + 23 * numbOfLinesForPost;

  function handleDeleteReply(postIndex, replyIndex) {
    setIsLoaded(0);
    fetch(
      `http://localhost:3001/deleteReply/${
        apiDoc._id
      }/${selectedIndex}/${postIndex}/${replyIndex + prevRepliesLength}`,
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
        // delete from apiDocs
        setIsLoaded(1);
        setNewReplies((prev) => {
          const copy = [...prev];
          copy.splice(replyIndex, 1);
          return copy;
        });
      });
  }

  function handleLikeReply() {
    fetch(
      `http://localhost:3001/toggleLikeReply/${apiDoc._id}/${selectedIndex}/${postIndex}/${index}`,
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
      });

    setLikedBy((prev) => {
      if (prev.includes(clientUserData._id)) {
        const copy = [...prev];
        const index = prev.indexOf(clientUserData._id);
        copy.splice(index, 1);
        return [...copy];
      } else {
        return [...prev, clientUserData._id];
      }
    });
  }

  return (
    <div key={index} className="replies-container">
      <div className="post-container reply-container">
        <div className="author">{reply.author}</div>
        <textarea
          style={{ height: `${postHeight}px` }}
          readOnly
          value={reply.reply}
          className="fake-input-for-wrap"
        ></textarea>
      </div>
      <div className="under-post">
        <div className="actions-flex">
          <div className="actions-flex-2">
            <button
              id={index}
              onClick={handleLikeReply}
              className="under-post-button like-container"
            >
              {likedBy.includes(clientUserData._id) ? (
                <img className="like-icon" src={likedIcon} />
              ) : (
                <img className="like-icon" src={notLikedIcon} />
              )}
              <div>{likedBy ? `${likedBy.length}` : "0"}</div>
            </button>

            {/* only show delete button if is autho */}
            {reply.authorId === clientUserData._id && (
              <div className="container">
                {!isDeleting ? (
                  <>
                    {!(isLoaded === 2) && (
                      <button
                        id={index}
                        onClick={() => setIsDeleting(!isDeleting)}
                        className="under-post-button"
                      >
                        Delete
                      </button>
                    )}
                  </>
                ) : (
                  <div className="confirm-delete-container">
                    <button
                      className="under-post-button cancel"
                      onClick={() => setIsDeleting(false)}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(e) => {
                        handleDeleteReply(postIndex, index);
                        setIsDeleting(false);
                        setIsLoaded(2);
                      }}
                      id={index}
                      className="under-post-button confirm"
                    >
                      Confirm
                    </button>
                  </div>
                )}
                {isLoaded == 2 && (
                  <img className="loading-request-icon" src={loadingImg} />
                )}
              </div>
            )}
          </div>

          <div className="post-time">
            {reply.createdAt
              ? `${
                  createdDate.getMonth() + 1
                }/${createdDate.getDate()}/${createdDate.getFullYear()}  ${createdDate.getUTCHours()}:${createdDate.getUTCMinutes()}${pmOrAm()}`
              : "just now"}
          </div>
        </div>
      </div>
    </div>
  );
}
