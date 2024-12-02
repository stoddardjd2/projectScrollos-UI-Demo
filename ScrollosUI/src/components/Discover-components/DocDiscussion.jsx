import { useEffect, useRef, useState } from "react";
import DocDiscussionPost from "./DocDiscussionPost";
import postIcon from "../../assets/post.svg";
import editIcon from "../../assets/project-icons/edit.svg";
import checkIcon from "../../assets/project-icons/check.svg";
import trashIcon from "../../assets/trash.svg";
import cancelIcon from "../../assets/project-icons/cancel.svg";
import loadingImg from "../../assets/loading.svg";
import exitIcon from "../../assets/exit.svg";
import backIcon from "../../assets/back.svg";

export default function DocDiscussion(props) {
  const {
    selectedDiscussion,
    clientUserData,
    apiDoc,
    selectedIndex,
    setDiscussions,
    discussions,
    setSelectedDiscussion,
    handleBack,
    handleExitPopup,
  } = props;
  // const [posts, setPosts] = useState();
  // const [posts, setPosts] = useState(discussions[selectedIndex].posts);
  const posts = discussions[selectedIndex].posts;
  const [isNewPost, setIsNewPost] = useState(false);
  const [postInput, setPostInput] = useState();
  const [isLoaded, setIsLoaded] = useState(0);
  const [isEditingDiscName, setIsEditingDiscName] = useState(false);
  const [isDeletingDisc, setIsDeletingDisc] = useState(false);
  const [discNameInput, setDiscNameInput] = useState();
  const discNameInputRef = useRef(null);
  const newPostRef = useRef(null);

  function handleNameClick(e) {
    if (e.detail === 2) {
      handleEditDiscName();
    }
  }

  function handleEditDiscName(e) {
    setDiscNameInput(discussions[selectedIndex].title);
    setIsEditingDiscName(!isEditingDiscName);
  }
  useEffect(() => {
    if (isEditingDiscName) {
      discNameInputRef.current.focus();
    }
  }, [isEditingDiscName]);

  function handleSaveDiscName(e) {
    e.preventDefault();

    //update database to match updated project name

    if (!(discNameInput == discussions[selectedIndex].title)) {
      //check if name is different from prev name before sending request to update database
      fetch(
        `http://localhost:3001/updateDiscussionTitle/${apiDoc._id}/${selectedIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ discNameInput }),
        }
      )
        .then((res) => res.json())
        .then((json) => {});
      setDiscussions((prev) => {
        let copy = [...prev];
        copy[selectedIndex].title = discNameInput;
        return [...copy];
      });

      setIsEditingDiscName(false);
    }
  }

  useEffect(() => {
    //load posts
    fetch(`http://localhost:3001/getPosts/${apiDoc._id}/${selectedIndex}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setDiscussions((prev) => {
          let prevCopy = [...prev];
          prevCopy[selectedIndex] = json;
          return [...prev];
        });
      });
  }, []);

  function handleDeleteDisc() {
    setIsLoaded(0);
    fetch(
      `http://localhost:3001/deleteDiscussion/${apiDoc._id}/${selectedIndex}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        // delete from apiDocs
        setIsLoaded(1);
        setSelectedDiscussion();
        setDiscussions((prev) => {
          const copy = [...prev];
          copy.splice(selectedIndex, 1);
          return copy;
        });
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
          // setPosts((prev) => {
          //   // const copy = [...prev]?
          const newPost = {
            post: postInput,
            author: clientUserData.username,
            authorId: clientUserData._id,
            replies: [],
            likedBy: [],
            _id: json._id,
          };

          setDiscussions((prev) => {
            const copy = [...prev];
            const postsCopy = [...prev[selectedIndex].posts];
            postsCopy.unshift(newPost);
            copy.splice(selectedIndex, 1, {
              ...prev[selectedIndex],
              posts: [...postsCopy],
            });
            return [...copy];
          });

          setIsNewPost(false);
          setPostInput();
        });

      // const copy = [...posts];
    }
  }

  function handleDeletePost(e) {
    const postIndex = e.currentTarget.id;
    fetch(
      `http://localhost:3001/deleteDiscussion/${apiDoc._id}/${selectedIndex}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        // delete from apiDocs
        setIsLoaded(1);
        setDiscussions((prev) => {
          const copy = [...prev];
          const postsCopy = [...prev[selectedIndex].posts];
          postsCopy.splice(postIndex, 1);
          copy.splice(selectedIndex, 1, {
            ...prev[selectedIndex],
            posts: [...postsCopy],
          });
          return [...copy];
        });
        // setPosts((prev) => {
        //   const copy = [...prev];
        //   copy.splice(postIndex, 1);
        //   return copy;
        // });
      });
  }

  let postElements;
  //wait for posts to load
  if (posts) {
    postElements = posts.map((post, index) => {
      return (
        <DocDiscussionPost
          post={post}
          key={post._id}
          index={index}
          clientUserData={clientUserData}
          selectedIndex={selectedIndex}
          apiDoc={apiDoc}
          setDiscussions={setDiscussions}
          discussions={discussions}
          handleDeletePost={handleDeletePost}
          // setPosts={setPosts}
          isLoaded={isLoaded}
          setIsLoaded={setIsLoaded}
        />
      );
    });
  }

  return (
    <div className="discussion-container">
      <div className="discussion-header-container first-cont">
        {discussions[selectedIndex].authorId == clientUserData._id ? (
          <>
            {!isEditingDiscName ? (
              <div className="header-flex">
                <h2 onClick={handleNameClick} className="discussion-title">
                  {selectedDiscussion.title}
                </h2>

                {!isDeletingDisc ? (
                  <div className="header-flex">
                    {!(isLoaded == 2) && (
                      <>
                        <img
                          onClick={() => {
                            setIsEditingDiscName(!isEditingDiscName);
                            handleEditDiscName();
                          }}
                          className="edit-icon"
                          src={editIcon}
                        />
                        <img
                          onClick={() => {
                            setIsDeletingDisc(!isDeletingDisc);
                          }}
                          className="trash-icon"
                          src={trashIcon}
                        />
                      </>
                    )}
                  </div>
                ) : (
                  <div className="confirm-delete-container">
                    {!(isLoaded == 2) && (
                      <>
                        <div
                          onClick={() => {
                            setIsDeletingDisc(!isDeletingDisc);
                          }}
                          className="cancel"
                        >
                          Cancel
                        </div>

                        <button
                          onClick={(e) => {
                            handleDeleteDisc(e);
                            setIsLoaded(2);
                          }}
                          className="confirm"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
                {isLoaded == 2 && (
                  <>
                    <img className="loading-request-icon" src={loadingImg} />
                  </>
                )}
              </div>
            ) : (
              <div className="header-flex-edit">
                <form
                  className="discussion-input-form"
                  onSubmit={handleSaveDiscName}
                >
                  <input
                    ref={discNameInputRef}
                    id="txt"
                    type="text"
                    className={
                      isEditingDiscName ? "project-name-input" : "hidden"
                    }
                    value={discNameInput}
                    onChange={(e) => {
                      setDiscNameInput(e.target.value);
                    }}
                  ></input>
                </form>
                <div className="btns-flex">
                  <img
                    onClick={handleSaveDiscName}
                    className="disc-btn check"
                    src={checkIcon}
                  />
                  <img
                    onClick={() => {
                      setIsEditingDiscName(false);
                    }}
                    className="disc-btn"
                    src={cancelIcon}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="discussions-header-container discussion-nav">
            <h2 className="discussion-title">{selectedDiscussion.title}</h2>
          </div>
        )}
        <div className="discussions-right-buttons-container">
          {!isDeletingDisc && (
            <button onClick={handleNewPost} className="new-post-btn">
              <div className="plus">+</div>
              <div className="new-post-text">New post</div>
            </button>
          )}
          {selectedDiscussion && (
            <button onClick={handleBack} className="back">
              <img className="back-icon" src={backIcon} />
            </button>
          )}
        </div>

        {/* <button onClick={handleExitPopup} className="exit">
            <img className="exit-icon" src={exitIcon} id="exit" />
          </button> */}
      </div>
      <div className="content-bottom">
        {selectedDiscussion.posts && (
          <>
            {isNewPost && (
              <div className="new-post-form-container">
                <div className="post-container new-post-container">
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
                  <div className="post-input-flex-container">
                    <button
                      onClick={() => {
                        setIsNewPost(false);
                        setPostInput();
                      }}
                      className="post-cancel-reply"
                    >
                      Cancel
                    </button>
                    <button
                      style={!postInput ? { opacity: "40%" } : {}}
                      onClick={handleSubmitPost}
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
              </div>
            )}
            <div className="posts-overflow">{postElements}</div>
          </>
        )}
      </div>
    </div>
  );
}
