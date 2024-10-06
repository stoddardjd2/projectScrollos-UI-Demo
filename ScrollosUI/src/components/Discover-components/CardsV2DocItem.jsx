import { useEffect, useState } from "react";
import saveFill from "../../assets/cards-v2-icons/bookmark.svg";
import saveEmpty from "../../assets/cards-v2-icons/unfilled-bookmark.svg";
// import saveEmpty from "../../assets/unfilledbookmark.svg";
// import saveFill from "../../assets/filledbookmark.svg";
// import starIcon from "../../assets/star.svg";
import starIcon from "../../assets/cards-v2-icons/star.svg";
import starFilledIcon from "../../assets/cards-v2-icons/starFilled.svg";
// import starOutlineIcon from "../../assets/star.svg";
import viewsIcon from "../../assets/cards-v2-icons/views.svg";
import versionIcon from "../../assets/cards-v2-icons/version.svg";
import messageIcon from "../../assets/cards-v2-icons/message.svg";
import RatingV2 from "./RatingV2";
import loadingImg from "../../assets/loading.svg";
import RatingV3 from "./RatingV3";
import DocDiscussionsHome from "./DocDiscussionsHome";

export default function CardsV2DocItem(props) {
  const {
    apiDoc,
    clientUserData,
    setClientUserData,
    setUserRating,
    currentDocIndex,
    setDisplayApiDocs,
    apiDocIndex,
  } = props;
  //   const [isSaved, setIsSaved] = useState(false);
  const [isMoreOptions, setIsMoreOptions] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [isDiscussion, setIsDiscussion] = useState(false);
  const [discussionsCount, setDiscussionsCount] = useState();
  const [averageRating, setAverageRating] = useState();

  const isSaved = clientUserData.bookmarks.includes(apiDoc._id);

  const [isRated, setIsRated] = useState(() => {
    return Object.keys(apiDoc.ratings).includes(clientUserData._id);
  });

  // load disucussion length
  useEffect(() => {
    fetch(`http://localhost:3001/getDiscussionLength/${apiDoc._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((results) => {
        setDiscussionsCount(results.discussions);
      });
  }, []);

  // load average rating
  useEffect(() => {
    fetch(`http://localhost:3001/getAverageRating/${apiDoc._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((results) => {
        setAverageRating(results);
      });
  }, []);

  function handleSave(e) {
    e.stopPropagation();
    //save changes to database:
    //add to database if saving
    //NOTE: use opposite of isSaved since toggling value to opposite on click stylingAfter function runs
    //save:
    if (!isSaved) {
      setClientUserData((prev) => ({
        ...prev,
        bookmarks: [...prev.bookmarks, apiDoc._id],
      }));
      fetch(`http://localhost:3001/user/${clientUserData._id}/save/bookmarks`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docID: apiDoc._id }),
      });
      //   setIsSaved(!isSaved);
      //remove from database if unsaving
    } else {
      //   setIsSaved(!isSaved);
      //remove id of selected item from state
      setClientUserData((prev) => {
        const index = prev.bookmarks.indexOf(apiDoc._id);
        let copy = [...prev.bookmarks];
        copy.splice(index, 1);

        return {
          ...prev,
          bookmarks: [...copy],
        };
      });
      fetch(
        `http://localhost:3001/user/${clientUserData._id}/remove/bookmarks`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ docID: apiDoc._id }),
        }
      );
    }
  }

  function handleSelectedDoc(e) {
    const selectedDocId = e.currentTarget.id;
    //update recents in db with updated recents array
    let recentDocIds = [];
    recentDocIds.push(selectedDocId);
    clientUserData.recents.map((recentId) => {
      if (!(selectedDocId == recentId)) {
        recentDocIds.push(recentId);
      }
    });

    setClientUserData((prev) => ({ ...prev, recents: recentDocIds }));

    //update recents with new recents array
    //make sure array is not empty

    if (recentDocIds.length > 0) {
      fetch(
        `http://localhost:3001/user/${clientUserData._id}/saveArray/recents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ docIds: recentDocIds }),
        }
      ).then(() => {
        //track each time document is viewed:
        fetch(`http://localhost:3001/addViewToDoc/${apiDoc._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((json) => {});
        window.location.href = `/ApiDocViewer/${selectedDocId}/${clientUserData._id}`;
      });
    }
  }

  function handleAddRating(e) {
    e.stopPropagation();
    // handle select star value and add rating to doc
    const rating = e.currentTarget.id;
    setDisplayApiDocs((prev) => {
      const copy = [...prev];
      copy.splice(apiDocIndex, 1, {
        ...prev[apiDocIndex],
        ratings: { ...prev[apiDocIndex].ratings, [clientUserData._id]: rating },
      });
      return [...copy];
    });

    setIsRating(false);
    setIsRated(true);
    // FETCH DATABASE AND ADD RATING!
    fetch(`http://localhost:3001/addRating/${apiDoc._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: clientUserData._id, rating: rating }),
    })
      .then((res) => res.json())
      .then((json) => {});
  }

  function handleExitPopup(e) {
    e.stopPropagation();
    if (e.target.id === "exit") {
      setIsDiscussion(false);
    }
  }

  return (
    <div className="cards-v2-item">
      <div className="inner-card-grid">
        <div className="grid-item-container">
          <img className="grid-icon push-up" src={viewsIcon} />
          <div>{apiDoc.views ? apiDoc.views : "0"}</div>
        </div>
        <div className="grid-item-container ">
          {discussionsCount ? (
            <div
              className="grid-item-container discussion-button hover-effect"
              onClick={() => {
                setIsDiscussion(!isDiscussion);
              }}
            >
              <img className="grid-icon" src={messageIcon} />
              <div>{discussionsCount}</div>
            </div>
          ) : (
            <img className="loading-request-icon" src={loadingImg} />
          )}

          {isDiscussion && (
            <div
              id="exit"
              onMouseDown={handleExitPopup}
              className="doc-discussion-popup"
            >
              <div className="popup-content-container">
                <DocDiscussionsHome
                  setClientUserData={setClientUserData}
                  apiDoc={apiDoc}
                  handleExit={handleExitPopup}
                  clientUserData={clientUserData}
                  setDisplayApiDocs={setDisplayApiDocs}
                  currentDocIndex={currentDocIndex}
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid-item-container hover-effect">
          {averageRating ? (
            <div
              className="sub-grid-item-container"
              onClick={() => {
                setIsRating(!isRating);
              }}
            >
              <img
                className="grid-icon push-up"
                src={!isRated ? starIcon : starFilledIcon}
              />
              <div>{averageRating}</div>
            </div>
          ) : (
            <img className="loading-request-icon" src={loadingImg} />
          )}

          {isRating && (
            <RatingV3
              handleAddRating={handleAddRating}
              clientUserData={clientUserData}
              apiDoc={apiDoc}
              locationMain={{ x: 20, y: 60 }}
              locationTriangle={{ x: 0, y: -40 }}
            />
          )}
        </div>

        <div
          onClick={handleSave}
          className="grid-item-container save-container hover-effect"
        >
          <img
            className={
              isSaved ? "save saveFill grid-icon " : "save saveEmpty grid-icon"
            }
            src={isSaved ? saveFill : saveEmpty}
            // src={saveFill}
          />
          {/* <img className="grid-icon push-up" src={saveFill} /> */}
          <div>{isSaved ? 3 + 1 : 3} </div>
        </div>
      </div>

      <div
        id={apiDoc._id}
        onClick={handleSelectedDoc}
        className="bottom-description"
      >
        <div className="name-container">
          <div className="bottom-name">{apiDoc.info.title}</div>
          <div className="more-options-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMoreOptions(!isMoreOptions);
              }}
              className="more-options"
            >
              <div className="options-img-container">
                <svg
                  width="5"
                  height="16"
                  viewBox="0 0 5 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.18478 14.0244C4.18478 14.4932 4.01906 14.8956 3.68762 15.2318C3.35145 15.5632 2.94899 15.729 2.48024 15.729C2.01622 15.729 1.61849 15.5632 1.28705 15.2318C0.955614 14.8956 0.789895 14.4932 0.789895 14.0244C0.789895 13.5699 0.955614 13.1721 1.28705 12.8312C1.61849 12.4903 2.01622 12.3199 2.48024 12.3199C2.79274 12.3199 3.07919 12.4004 3.33961 12.5614C3.59529 12.7176 3.80126 12.9236 3.95751 13.1793C4.10902 13.4349 4.18478 13.7167 4.18478 14.0244ZM4.18478 8.06739C4.18478 8.53614 4.01906 8.9386 3.68762 9.27478C3.35145 9.60622 2.94899 9.77194 2.48024 9.77194C2.01622 9.77194 1.61849 9.60622 1.28705 9.27478C0.955614 8.9386 0.789895 8.53614 0.789895 8.06739C0.789895 7.61285 0.955614 7.21512 1.28705 6.87421C1.61849 6.5333 2.01622 6.36285 2.48024 6.36285C2.79274 6.36285 3.07919 6.44334 3.33961 6.60432C3.59529 6.76057 3.80126 6.96654 3.95751 7.22222C4.10902 7.4779 4.18478 7.75963 4.18478 8.06739ZM4.18478 2.11036C4.18478 2.57911 4.01906 2.98157 3.68762 3.31775C3.35145 3.64919 2.94899 3.81491 2.48024 3.81491C2.01622 3.81491 1.61849 3.64919 1.28705 3.31775C0.955614 2.98157 0.789895 2.57911 0.789895 2.11036C0.789895 1.65581 0.955614 1.25809 1.28705 0.917178C1.61849 0.576269 2.01622 0.405814 2.48024 0.405814C2.79274 0.405814 3.07919 0.486307 3.33961 0.647292C3.59529 0.803542 3.80126 1.00951 3.95751 1.26519C4.10902 1.52087 4.18478 1.80259 4.18478 2.11036Z"
                    fill="black"
                  />
                </svg>
              </div>
            </button>
            {isMoreOptions && (
              <>
                <div className="more-options-popup">
                  <div>add to project</div>
                </div>
                <div className="more-options-triangle"></div>
              </>
            )}
          </div>
        </div>
        <div className="bottom-extra-container">
          <div className="bottom-extra">8/27/2024</div>
          <div className="rating-container">
            <div>v{apiDoc.info.version}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
