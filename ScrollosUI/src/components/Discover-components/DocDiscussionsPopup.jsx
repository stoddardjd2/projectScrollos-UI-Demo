import exitIcon from "../../assets/exit.svg";
import postsIcon from "../../assets/cards-v2-icons/message.svg";
import viewsIcon from "../../assets/cards-v2-icons/views.svg";
import backIcon from "../../assets/back.svg";

import { useState } from "react";
import DocDiscussion from "./DocDiscussion";
export default function DocDiscussionsPopup(props) {
  const {
    apiDoc,
    handleExitPopup,
    clientUserData,
    setDisplayApiDocs,
    currentDocIndex,
  } = props;
  const [selectedDiscussion, setSelectedDiscussion] = useState();
  const [selectedIndex, setSelectedIndex] = useState();

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
      .then((json) => {
        console.log(json);
      });
    // Update apiDocs to track current amount of views
    setDisplayApiDocs((prev) => {
      let apiDocsCopy = [...prev];
      let apiDocCopy = { ...apiDoc };
      const currentDocViews = apiDoc.discussions[selectionIndex].views;
      const incrementedViews = currentDocViews + 1;
      apiDocCopy.discussions[selectionIndex].views = incrementedViews;
      apiDocsCopy[currentDocIndex] = apiDocCopy;
      return [...apiDocsCopy];
    });

    setSelectedIndex(selectionIndex);
    setSelectedDiscussion(apiDoc.discussions[selectionIndex]);
  }
  function handleBack() {
    setSelectedDiscussion();
    // setProjectDocs([]);
  }

  function handleNewDiscussion() {
    console.log("NEW DISCUSSION CLICKED");

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
      .then((json) => {
        console.log("new discussion res", json);

        setDisplayApiDocs((prev) => {
          //  const isAdded = prev[currentDocIndex].discussions.includes({ _id: json._id });
          let isAdded = false;
          prev[currentDocIndex].discussions.map((discussion) => {
            if (discussion._id === json._id) {
              isAdded = true;
            }
          });
          console.log("isAdded", isAdded);
          console.log("setting apiDOcs");
          if (!isAdded) {
            let prevCopy = [...prev];
            prevCopy[currentDocIndex].discussions.unshift({
              likes: 0,
              authorId: clientUserData.id,
              author: clientUserData.username,
              posts: [],
              title: "Untitled discussion",
              views: 0,
              _id: json._id,
            });
            return [...prevCopy];
          } else {
            return [...prev];
            //if already added, do not change
          }
        });
      });
  }

  const discussionElements = apiDoc.discussions.map((discussion, index) => {
    const createdDate = new Date(discussion.createdAt);
    return (
      <div
        className="cards-v2-item"
        key={index}
        onClick={handleDiscussionSelection}
        id={index}
      >
        <div className="inner-card-grid ">
          <div className="grid-item-container">
            <img className="grid-icon" src={postsIcon} />
            <div>
              {apiDoc.discussions[index].posts
                ? apiDoc.discussions[index].posts.length
                : "0"}
            </div>
          </div>
          <div className="grid-item-container">
            <img className="grid-icon push-up" src={viewsIcon} />
            <div>
              {apiDoc.discussions[index].views
                ? apiDoc.discussions[index].views
                : "0"}
            </div>
          </div>
          {/* <div className="grid-item-container">
            <img className="grid-icon push-up" src={exitIcon} />
            <div>{apiDoc.views ? apiDoc.views : "0"}</div>
          </div>
          <div className="grid-item-container">
            <img className="grid-icon push-up" src={exitIcon} />
            <div>{apiDoc.views ? apiDoc.views : "0"}</div>
          </div> */}
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
      </div>
    );
  });

  return (
    <div id="exit" onMouseDown={handleExitPopup} className="doc-discussion-popup">
      <button className="exit">
        <img
          className="exit-icon"
          src={exitIcon}
          onClick={handleExitPopup}
          id="exit"
        />
      </button>
      {selectedDiscussion && (
        <button onClick={handleBack} className="back">
          <img className="back-icon" src={backIcon} />
        </button>
      )}

      <div className="discussion-content">
        {!selectedDiscussion ? (
          <>
            <h3 className="discussions-header">Discussions</h3>
            <div className="discussions-overflow">
              {apiDoc.discussions ? (
                <div className="doc-discussions-grid">
                  {
                    <>
                      <div className="new-project-card-container">
                        <button
                          onClick={handleNewDiscussion}
                          className="new-project-card"
                        >
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
                        <div className="new-discussion-text">
                          New Discussion
                        </div>
                      </div>

                      {discussionElements}
                    </>
                  }
                </div>
              ) : (
                "No posts"
              )}
            </div>
          </>
        ) : (
          // after discussion is selected
          <>
            {selectedIndex && (
              <DocDiscussion
                selectedDiscussion={selectedDiscussion}
                selectedIndex={selectedIndex}
                clientUserData={clientUserData}
                apiDoc={apiDoc}
                setDisplayApiDocs={setDisplayApiDocs}
                currentDocIndex={currentDocIndex}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
