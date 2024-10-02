import postsIcon from "../../assets/cards-v2-icons/message.svg";
import viewsIcon from "../../assets/cards-v2-icons/views.svg";
import loadingImg from "../../assets/loading.svg";
import { useState, useEffect } from "react";

export default function DocDiscussionGrid(props) {
  const {
    clientUserData,
    apiDoc,
    setSelectedIndex,
    handleExitPopup,
    setSelectedDiscussion,
    setDiscussions,
    discussions,
  } = props;
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    // load projects from database on initial and if returning from posts
    fetch(`http://localhost:3001/getDiscussions/${apiDoc._id}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setDiscussions(json.discussions);
      });
  }, []);

  async function handleNewDiscussion() {
    //prevent sync problems from creating duplicates by checking if id is already addewd
    fetch(`http://localhost:3001/addNewDiscussion/${apiDoc._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        author: clientUserData.username,
        authorId: clientUserData._id,
      }),
    })
      .then((res) => res.json())
      .then((json) => {});

    // const oldDiscussions = discussions;
    setDiscussions((prev) => {
      let prevCopy = [...prev];
      prevCopy.unshift({
        authorId: clientUserData._id,
        author: clientUserData.username,
        posts: [],
        title: "Untitled discussion",
        views: 0,
      });
      return [...prevCopy];
    });
  }

  function handleDiscussionSelection(e) {
    const selectionIndex = e.currentTarget.id;

    //add +1 view to discussion if selected
    fetch(
      `http://localhost:3001/addViewToDiscussion/${apiDoc._id}/${selectionIndex}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        //   body: JSON.stringify({
        //     post: postInput,
        //     author: clientUserData.username,
        //     authorId: clientUserData._id,
        //   }),
      }
    )
      .then((res) => res.json())
      .then((json) => {});
    // Update apiDocs to track current amount of views
    const views = discussions[selectionIndex].views;
    setDiscussions((prev) => {
      let discussionCopy = [...prev];
      // let apiDocCopy = { ...apiDoc };
      const incrementedViews = views + 1;
      discussionCopy[selectionIndex].views = incrementedViews;
      return [...discussionCopy];
    });

    setSelectedIndex(selectionIndex);
    setSelectedDiscussion(discussions[selectionIndex]);
  }

  let discussionElements;
  if (discussions) {
    // wait for discussions to load
    discussionElements = discussions.map((discussion, index) => {
      const createdDate = new Date(discussion.createdAt);
      return (
        <div
          className="cards-v2-item"
          key={index}
          onClick={handleDiscussionSelection}
          id={index}
        >
          <>
            <div className="inner-card-grid ">
              <div className="grid-item-container">
                <img className="grid-icon" src={postsIcon} />
                <div>{discussion.posts ? discussion.posts.length : "0"}</div>
              </div>
              <div className="grid-item-container">
                <img className="grid-icon push-up" src={viewsIcon} />
                <div>{discussion.views ? discussion.views : "0"}</div>
              </div>
            </div>

            <div className="bottom-container">
              <div className="discussion-title">{discussion.title}</div>
              <div className="bottom-sub-container">
                <div>{discussion.author}</div>
                <div className="posted-date">
                  {discussion.createdAt
                    ? `${
                        createdDate.getMonth() + 1
                      }/${createdDate.getDate()}/${createdDate.getFullYear()}`
                    : "just now"}
                </div>
              </div>
            </div>
          </>
        </div>
      );
    });
  } else
    return (
      <div className="loading-popup" onMouseDown={handleExitPopup} id="exit">
        <img className="loading-img" src={loadingImg} />
      </div>
    );

  return (
    <div className="doc-discussions-grid">
      {
        <>
          <div className="new-project-card-container">
            <button onClick={handleNewDiscussion} className="new-project-card">
              <svg
                width="40"
                height="50"
                viewBox="0 0 50 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.25 28.3333H0V21.25H21.25V0H28.3333V21.25H49.5833V28.3333H28.3333V49.5833H21.25V28.3333Z"
                  fill="#FEF7FF"
                />
              </svg>
            </button>
            <div className="new-discussion-text">New Discussion</div>
          </div>
          {!(discussionElements.length == 0) ? (
            discussionElements
          ) : (
            <div>No</div>
          )}
        </>
      }
    </div>
  );
}
