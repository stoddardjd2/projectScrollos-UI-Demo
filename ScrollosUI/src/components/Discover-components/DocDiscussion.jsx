import { useEffect, useRef, useState } from "react";
import DocPostReplies from "./DocPostReplies";
import likedIcon from "../../assets/cards-v2-icons/bookmark.svg";
import notLikedIcon from "../../assets/cards-v2-icons/unfilled-bookmark.svg";
import replyIcon from "../../assets/reply.svg";

export default function DocDiscussion(props) {
  const {
    selectedDiscussion,
    clientUserData,
    apiDoc,
    selectedIndex,
    setDisplayApiDocs,
    currentDocIndex,
  } = props;
  const [isViewReplies, setIsViewReplies] = useState(false);
  const [isNewPost, setIsNewPost] = useState(false);
  const [postInput, setPostInput] = useState();
  const newPostRef = useRef(null);
  const replyRef = useRef(null);

  function handleViewReplies(e) {
    const currentPostIndex = e.currentTarget.id;

    setIsViewReplies((prev) => {
      return { ...prev, [currentPostIndex]: !prev[currentPostIndex] };
    });
  }
  function handleNewPost() {
    setIsNewPost(!isNewPost);
  }
  useEffect(() => {
    //focus after element is added to dom
    if (isNewPost) {
      newPostRef.current.focus();
    }
  }, [isNewPost]);

  function handlePostInput(e) {
    setPostInput(e.target.value);
  }
  function handleSubmitPost() {
    if (postInput) {
      fetch(
        `http://localhost:3001/addPostToDiscussion/${apiDoc._id}/${selectedIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post: postInput,
            author: clientUserData.username,
            authorId: clientUserData._id,
          }),
        }
      )
        .then((res) => res.json())
        .then((json) => {
          setDisplayApiDocs((prev) => {
            //   update apiDocs to have new post
            let isAdded = false;
            prev[currentDocIndex].discussions[selectedIndex].posts.map(
              (post) => {
                if (post._id === json._id) {
                  isAdded = true;
                }
              }
            );

            if (!isAdded) {
              let apiDocsCopy = [...prev];
              let apiDocCopy = { ...apiDoc };
              const newPost = {
                post: postInput,
                author: clientUserData.username,
                authorId: clientUserData._id,
                replies: [],
                likes: { likeCount: 0, likedBy: [] },
                _id: json._id,
              };

              apiDocCopy.discussions[selectedIndex].posts.unshift(newPost);
              apiDocsCopy[currentDocIndex] = apiDocCopy;
              return [...apiDocsCopy];
            } else {
              return [...prev];
              //if already added, do not change
            }
          });

          // close new post input
          setIsNewPost(false);
          setPostInput();
        });
    }
  }

  function handleDeletePost(e) {
    const postIndex = e.currentTarget.id;
    fetch(
      `http://localhost:3001/deletePost/${apiDoc._id}/${selectedIndex}/${postIndex}`,
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
        console.log("delete", json);
        // delete from apiDocs
      });

    const postIdToRemove =
      apiDoc.discussions[selectedIndex].posts[postIndex]._id;
    setDisplayApiDocs((prev) => {
      //   update apiDocs to have new post
      let isAdded = false;

      prev[currentDocIndex].discussions[selectedIndex].posts.map((post) => {
        if (post._id === postIdToRemove) {
          isAdded = true;
        }
      });

      if (isAdded) {
        let apiDocsCopy = [...prev];
        let apiDocCopy = { ...apiDoc };
        apiDocCopy.discussions[selectedIndex].posts.splice(postIndex, 1);
        // apiDocsCopy[currentDocIndex] = apiDocCopy;
        return [...apiDocsCopy];
      } else {
        return [...prev];
        //if already added, do not change
      }
    });
  }

  const discussionElements = selectedDiscussion.posts.map((post, index) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyInput, setReplyInput] = useState();
    const [isLiked, setIsLiked] = useState(
      post.likedBy.includes(clientUserData._id)
    );
    console.log("isLiked", isLiked);

    function handleLikePost(e) {
      console.log("like post clicked");
      const postIndex = e.currentTarget.id;

      if (isLiked) {
        console.log("unlike");
        fetch(
          `http://localhost:3001/unlikePost/${apiDoc._id}/${selectedIndex}/${postIndex}`,
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
            console.log("dislike-post", json);
          });
        // remove

        setDisplayApiDocs((prev) => {
          console.log("unlike");
          if (
            //check if likedBy array contains userId, indicating it has not yet been disliked
            apiDoc.discussions[selectedIndex].posts[postIndex].likedBy.includes(
              clientUserData._id
            )
          ) {
            const userIdIndex = apiDoc.discussions[selectedIndex].posts[
              postIndex
            ].likedBy.indexOf(clientUserData._id);
            let apiDocsCopy = [...prev];
            apiDocsCopy[currentDocIndex].discussions[selectedIndex].posts[
              postIndex
            ].likedBy.splice(userIdIndex, 1);
            return [...apiDocsCopy];
          } else return [...prev];
        });
      } else {
        console.log("like");
        fetch(
          `http://localhost:3001/likePost/${apiDoc._id}/${selectedIndex}/${postIndex}`,
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
            console.log("like-post", json);
          });

        setDisplayApiDocs((prev) => {
          if (
            //check if likedBy array contains userId, indicating it has already been liked
            !apiDoc.discussions[selectedIndex].posts[
              postIndex
            ].likedBy.includes(clientUserData._id)
          ) {
            console.log("liking");

            console.log("seting apiDOcs");
            let apiDocsCopy = [...prev];
            apiDocsCopy[currentDocIndex].discussions[selectedIndex].posts[
              postIndex
            ].likedBy.unshift(clientUserData._id);
            return [...apiDocsCopy];
          } else return [...prev];
        });
      }
    }

    useEffect(() => {
      //focus after element is added to dom
      if (isReplying) {
        replyRef.current.focus();
      }
    }, [isReplying]);

    function handleReply() {
      setIsReplying(!isReplying);
      console.log("reply");
    }

    function handleReplyInput(e) {
      setReplyInput(e.target.value);
    }

    const matches = post.post.match(/\n/g);
    const createdDate = new Date(post.createdAt);
    let pmOrAm = () => {
      if (!(createdDate.getUTCHours() >= 12)) {
        return "pm";
      } else return "am";
    };

    const likeCount = () => {
      if (isLiked) {
        return post.likedBy.length + 1;
      } else return post.likedBy.length;
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

        {!isReplying ? (
          <div className="under-post-container">
            <div className="under-post">
              <div className="actions-flex">
                <div className="button-flex">
                  <button
                    id={index}
                    onClick={(e) => {
                      handleLikePost(e);
                      setIsLiked((prev) => !prev);
                    }}
                    className="under-post-button"
                  >
                    {isLiked ? (
                      <img className="like-icon" src={likedIcon} />
                    ) : (
                      <img className="like-icon" src={notLikedIcon} />
                    )}
                  </button>
                  <div>{post.likedBy ? `${post.likedBy.length}` : "0"}</div>
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
                {apiDoc.discussions[selectedIndex].posts[index].authorId ===
                  clientUserData._id && (
                  <button
                    id={index}
                    onClick={handleDeletePost}
                    className="under-post-button"
                  >
                    delete
                  </button>
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
            {!post.replies.length == 0 && (
              <div
                id={index}
                onClick={handleViewReplies}
                className="view-replies"
                style={isViewReplies[index] ? { marginLeft: "20px" } : {}}
              >
                {!isViewReplies[index]
                  ? `View ${post.replies.length} more ${""} ${
                      post.replies.length > 1 ? "replies" : "reply"
                    }`
                  : "Hide"}
              </div>
            )}
          </div>
        ) : (
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
                onClick={handleSubmitPost}
                className="post-button"
                type="button"
              >
                <div>
                  <svg
                    width="19"
                    height="18"
                    viewBox="0 0 19 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.96124 8.70752H2.87966M2.70728 9.50472L1.70252 12.5061C1.15222 14.1499 0.877068 14.9718 1.07453 15.4779C1.246 15.9175 1.61429 16.2507 2.06874 16.3776C2.59205 16.5236 3.38245 16.1679 4.96325 15.4566L15.0976 10.8961C16.6406 10.2017 17.4121 9.85462 17.6505 9.37232C17.8577 8.95332 17.8577 8.46162 17.6505 8.04262C17.4121 7.56042 16.6406 7.21322 15.0976 6.51887L4.94577 1.95055C3.36973 1.24134 2.58172 0.88673 2.05893 1.0322C1.60491 1.15853 1.23666 1.49088 1.06459 1.92961C0.866448 2.4348 1.13866 3.25493 1.68309 4.89519L2.70923 7.98682C2.80273 8.26852 2.84949 8.40942 2.86794 8.55342C2.88432 8.68132 2.88415 8.81072 2.86745 8.93852C2.84862 9.08252 2.80151 9.22322 2.70728 9.50472Z"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div>Post</div>
              </button>
            </div>
          </div>
        )}
        {/* replies */}
        {isViewReplies[index] && <DocPostReplies post={post} />}
      </div>
    );
  });

  return (
    <div className="discussion-container">
      <div className="discussion-header-container">
        <div className="discussion-title">{selectedDiscussion.title}</div>
        <button onClick={handleNewPost} className="new-post-btn">
          <div className="plus">+</div>
          <div className="new-post-text">New post</div>
        </button>
      </div>
      {selectedDiscussion.posts && (
        <>
          {isNewPost && (
            <div className="new-post-form-container">
              <div className="post-container">
                <div className="author">{clientUserData.username}</div>
                <textarea
                  className="new-post-input"
                  value={postInput}
                  onChange={handlePostInput}
                  ref={newPostRef}
                  placeholder="new post"
                ></textarea>
              </div>
              <div>
                <button
                  style={!postInput ? { opacity: "40%" } : {}}
                  onClick={handleSubmitPost}
                  className="post-button"
                  type="button"
                >
                  <div>
                    <svg
                      width="19"
                      height="18"
                      viewBox="0 0 19 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.96124 8.70752H2.87966M2.70728 9.50472L1.70252 12.5061C1.15222 14.1499 0.877068 14.9718 1.07453 15.4779C1.246 15.9175 1.61429 16.2507 2.06874 16.3776C2.59205 16.5236 3.38245 16.1679 4.96325 15.4566L15.0976 10.8961C16.6406 10.2017 17.4121 9.85462 17.6505 9.37232C17.8577 8.95332 17.8577 8.46162 17.6505 8.04262C17.4121 7.56042 16.6406 7.21322 15.0976 6.51887L4.94577 1.95055C3.36973 1.24134 2.58172 0.88673 2.05893 1.0322C1.60491 1.15853 1.23666 1.49088 1.06459 1.92961C0.866448 2.4348 1.13866 3.25493 1.68309 4.89519L2.70923 7.98682C2.80273 8.26852 2.84949 8.40942 2.86794 8.55342C2.88432 8.68132 2.88415 8.81072 2.86745 8.93852C2.84862 9.08252 2.80151 9.22322 2.70728 9.50472Z"
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div>Post</div>
                </button>
              </div>
            </div>
          )}
          <div className="posts-overflow">{discussionElements}</div>
        </>
      )}
    </div>
  );
}
