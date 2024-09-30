import { useEffect, useRef, useState } from "react";
import DocDiscussionPost from "./DocDiscussionPost";
import postIcon from "../../assets/post.svg";

export default function DocDiscussion(props) {
  const {
    selectedDiscussion,
    clientUserData,
    apiDoc,
    selectedIndex,
    setDisplayApiDocs,
    currentDocIndex,
    setDiscussions,
    discussions,
  } = props;
  // const [posts, setPosts] = useState();
  const [posts, setPosts] = useState(discussions[selectedIndex].posts);
  const [isNewPost, setIsNewPost] = useState(false);
  const [postInput, setPostInput] = useState();
  const newPostRef = useRef(null);

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
        console.log("posts!!", json);
        setDiscussions((prev) => {
          let prevCopy = [...prev];
          prevCopy[selectedIndex] = json;
          return [...prev];
        });
      });
  }, []);

 
  function handleDeletePost(e) {
    console.log("delete post handle");
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

    setPosts((prev) => {
      const copy = [...prev];
      copy.splice(postIndex, 1);
      return copy;
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
          console.log("JSON", json);
          setPosts((prev) => {
            // const copy = [...prev]?
            const newPost = {
              post: postInput,
              author: clientUserData.username,
              authorId: clientUserData._id,
              replies: [],
              likedBy: [],
              _id: json._id,
            };
            console.log("PREV", prev);
            const copy = [newPost].concat(prev);
            return copy;
          });
          setIsNewPost(false);
          setPostInput();
        });

      // const copy = [...posts];
    }
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
          setPosts={setPosts}
        />
      );
    });
  }

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
  );
}
