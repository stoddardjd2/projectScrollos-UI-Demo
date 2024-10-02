import exitIcon from "../../assets/exit.svg";

import backIcon from "../../assets/back.svg";

import { useState, useEffect } from "react";
import DocDiscussion from "./DocDiscussion";
import DocDiscussionsGrid from "./DocDiscussionsGrid";

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
  const [discussions, setDiscussions] = useState();

  function handleBack() {
    setSelectedDiscussion();
    setDiscussions();
    // setProjectDocs([]);
  }


  useEffect(() => {
    // load projects from database on initial and if returning from posts
    console.log("discussions", discussions);
  }, [discussions]);


  return (
    <div
      id="exit"
      onMouseDown={handleExitPopup}
      className="doc-discussion-popup"
    >
      <div className="discussion-content">
        {!selectedDiscussion ? (
          <>
            <div className="discussions-header-container first-cont">
              <h3 className="discussions-header">Discussions</h3>
              <div className="flex nav-buttons">
                {selectedDiscussion && (
                  <button onClick={handleBack} className="back">
                    <img className="back-icon" src={backIcon} />
                  </button>
                )}
                <button className="exit">
                  <img
                    className="exit-icon"
                    src={exitIcon}
                    onClick={handleExitPopup}
                    id="exit"
                  />
                </button>
              </div>
            </div>
            <div className="discussions-overflow">
              {apiDoc.discussions ? (
                <DocDiscussionsGrid
                  clientUserData={clientUserData}
                  apiDoc={apiDoc}
                  setSelectedIndex={setSelectedIndex}
                  handleExitPopup={handleExitPopup}
                  setSelectedDiscussion={setSelectedDiscussion}
                  setDiscussions={setDiscussions}
                  discussions={discussions}
                />
              ) : (
                "No posts"
              )}
            </div>
          </>
        ) : (
          // after discussion is selected
          <>
          {console.log("discussions[selectedIndex]")}
          {console.log(discussions[selectedIndex])}
          {selectedIndex && (
              <DocDiscussion
                discussions={discussions}
                setDiscussions={setDiscussions}
                selectedDiscussion={selectedDiscussion}
                selectedIndex={selectedIndex}
                clientUserData={clientUserData}
                apiDoc={apiDoc}
                setDisplayApiDocs={setDisplayApiDocs}
                currentDocIndex={currentDocIndex}
                setSelectedDiscussion={setSelectedDiscussion}
                handleBack={handleBack}
                handleExitPopup={handleExitPopup}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
