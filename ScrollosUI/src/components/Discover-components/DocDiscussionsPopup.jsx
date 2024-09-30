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
  

  useEffect(() => {
    console.log("change!");
    if (discussions) {
      console.log(discussions);
      // console.log("likedBy Updated",discussions[0].posts[1].replies[0].likedBy);
    }
  }, [discussions]);

  function handleBack() {
    setSelectedDiscussion();
    setDiscussions();
    // setProjectDocs([]);
  }

  return (
    <div
      id="exit"
      onMouseDown={handleExitPopup}
      className="doc-discussion-popup"
    >
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
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
