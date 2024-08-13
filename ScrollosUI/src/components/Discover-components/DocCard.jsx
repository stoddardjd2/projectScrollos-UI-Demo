import { useState, useTransition, useEffect } from "react";
import saveFill from "../../assets/filledbookmark.svg";
import saveEmpty from "../../assets/unfilledbookmark.svg";
import infoIcon from "../../assets/info.svg";
import starIcon from "../../assets/star.svg";
import addIcon from "../../assets/add.svg";
import commentIcon from "../../assets/comment.svg";

import NotesView from "./Card-components/NotesView";
import AddView from "./Card-components/AddView";
import InfoView from "./Card-components/InfoView";
// import getStyleForAction from "./Card-components/getStyleForAction";
export default function DocCards(props) {
  const {
    setClientUserData,
    apiDoc,
    loadIsSaved,
    handleSelectedDoc,
    userID,
    loadIsFlagged,
  } = props;
  const [isSaved, setIsSaved] = useState(loadIsSaved);
  const [isFlagged, setIsFlagged] = useState(loadIsFlagged);
  const [action, setAction] = useState({ active: false, type: "none" });
  // const [IsinfoFlipped, setIsInfoFlipped] = useState(false);

  function handleSave(e) {
    e.stopPropagation();
    //save changes to database:
    //add to database if saving
    //NOTE: use opposite of isSaved since toggling value to opposite on click stylingAfter function runs
    console.log("fetchinG!");
    //save:
    if (!isSaved) {
      console.log("save!");

      setClientUserData((prev) => ({
        ...prev,
        bookmarks: [...prev.bookmarks, apiDoc._id],
      }));
      fetch(`http://localhost:3001/user/${userID}/save/bookmarks`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docID: apiDoc._id }),
      });
      setIsSaved(!isSaved);
      //remove from database if unsaving
    } else if (isSaved) {
      setIsSaved(!isSaved);
      //remove id of selected item from state
      setClientUserData((prev) => {
        const index = prev.bookmarks.indexOf(apiDoc._id);
        prev.bookmarks.splice(index, 1);

        return { ...prev, bookmarks: [...prev.bookmarks, apiDoc._id] };
      });
      fetch(`http://localhost:3001/user/${userID}/remove/bookmarks`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docID: apiDoc._id }),
      });
    }
  }

  //have flags visable for entire company
  function handleFlag(e) {
    e.stopPropagation();
    setIsFlagged(!isFlagged);
    //save changes to database:
    //add to database if saving
    //NOTE: use opposite of isSaved since toggling value to opposite on click stylingAfter function runs
    if (!isFlagged) {
      fetch(`http://localhost:3001/user/${userID}/save/flags`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docID: apiDoc._id }),
      });
      //remove from database if unsaving
    } else if (isFlagged) {
      fetch(`http://localhost:3001/user/${userID}/remove/flags`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docID: apiDoc._id }),
      });
    }
  }

  function handleIsAddClicked() {
    setAction({ active: !action.active, type: "add", add: true });
    // setIsAddClicked(!isAddClicked);
  }

  function handleInfoClick() {
    setAction({
      active: !action.active,
      type: "info",
    });
    // setIsInfoFlipped(!IsinfoFlipped);
  }
  function handleCommentClick() {
    setAction({
      active: !action.active,
      type: "comment",
    });
  }

  function getStyleForAction(target) {
    if (action.type === "info") {
      if (target === "bookmark") {
        return {
          transitionTimingFunction: "linear",
          transitionDuration: "0s",
          transitionDelay: ".15s",
          visibility: "hidden",
        };
      } else if (target === "info-action") {
        return {
          width: "100%",
          height: "100%",
          transitionDuration: "0s",
          transitionDelay: ".15s",
          transform: "rotateY(180deg)",
          overflow: "hidden",
        };
      } else if (target === "date-star") {
        return {
          height: "0px",

          transitionDuration: "0s",
          transitionDelay: ".15s",
          overflow: "hidden",
          visibility: "hidden",
        };
      } else if (target === "actions-container") {
        return {
          transform: "rotateY(180deg)",
          transitionTimingFunction: "linear",
          transitionDuration: "0s",
          transitionDelay: ".15s",
        };
      } else if (target === "doc-card") {
        return {
          transform: "rotateY(180deg)",
          transitionTimingFunction: "linear",
          transitionDuration: ".3s",
          transitionDelay: "0s",
        };
      } else if (target === "title") {
        return {
          transitionDuration: "0s",
          transitionDelay: ".15s",
          maxHeight: "0px",
          minHeight: "0px",
          visibility: "visible",
        };
      } else if (target === "add-action") {
        return {
          width: "0%",
          height: "0%",
          visibility: "hidden",
        };
      } else if (target === "comment-action") {
        return {
          width: "0%",
          height: "0%",
          visibility: "hidden",
        };
      }
    } else if (action.type === "comment") {
      if (target === "info-action") {
        return {
          visibility: "hidden",
          width: "0%",
          height: "0%",
        };
      } else if (target === "title") {
        return {
          transition: ".5s ease-in-out all",
          maxHeight: "0em",
          minHeight: "0em",
          marginTop: "-80px",
        };
      } else if (target === "date-star") {
        return {
          // height: "0px",
          // height: "1em",
          // minHeight: "1em",
          // marginRight:"100%",
          // marginLeft: "100%",
          // marginTop: "100%",
          // transition: "2s ease-in-out all",
        };
      } else if (target === "comment-action") {
        return {
          width: "auto",
          height: "78%",
          transitionProperty: "all",
          transitionTimingFunction: "ease-in-out",
          transitionDuration: ".5s",
          // transitionDelay: ".1s",
        };
      } else if (target === "add-action") {
        return {
          width: "0%",
          height: "0%",
          transitionProperty: "all",
          transitionTimingFunction: "ease-in-out",
          transitionDuration: ".5s",
          // transitionDelay: ".1s",
        };
      }
      // return { backgroundColor: "red" };
    } else if (action.type === "add") {
      if (target === "info-action") {
        return {
          visibility: "hidden",
          width: "0%",
          height: "0%",
        };
      } else if (target === "date-star") {
        return {
          height: "0px",
          transition: ".5s ease-in-out all",
          overflow: "hidden",
        };
      } else if (target === "title") {
        return {
          transition: ".5s ease-in-out all",
          maxHeight: "0em",
          minHeight: "0em",
          marginLeft: "300px",
        };
      } else if (target === "add-action") {
        return {
          width: "100%",
          height: "100%",
          transitionProperty: "all",
          transitionTimingFunction: "ease-in-out",
          transitionDuration: ".5s",
          // transitionDelay: ".1s",
        };
      } else if (target === "comment-action") {
        return {
          width: "0%",
          height: "0%",
          visibility: "hidden",
        };
      }
    }
  }

  return (
    <>
      <div
        className="doc-card"
        style={
          action.active
            ? getStyleForAction("doc-card")
            : { transition: ".3s linear all" }
        }
      >
        <div className="bookmark-container">
          {/* maintains min height for flex box when bookmark animated */}
          <div className="placeholder"></div>
          <div className="save-container">
            <img
              className={isSaved ? "save saveFill" : "save saveEmpty"}
              onClick={handleSave}
              src={isSaved ? saveFill : saveEmpty}
              style={
                action.active
                  ? getStyleForAction("bookmark")
                  // when closing info, use delay. If not info closing, use default
                  : action.type === "info"
                  ? {
                      transitionTimingFunction: "linear",
                      transitionDuration: "0s",
                      transitionDelay: ".15s",
                    }
                  : {}
              }
            />
          </div>
        </div>
        <div
          className="title-container"
          style={
            //animation for info press: flip card and hide body
            //isDelayed will be true delayed stylingAfter isInfoClicked
            // delayInfoClick

            //load styling for type of action if action is being performed
            // isAddClicked
            action.active
              ? getStyleForAction("title")
              : { transition: ".5s ease-in-out all" }
          }
        >
          <div id={apiDoc._id} onClick={handleSelectedDoc} className="title">
            {apiDoc.info?.title}
          </div>
        </div>
        <div
          className="date-star-container"
          style={
            action.active
              ? getStyleForAction("date-star")
              : { transition: ".5s ease-in-out all", overflow: "hidden" }
          }
        >
          <div className="updated">8/8/2024 </div>
          <div className="rating-container">
            <img src={starIcon} className="star" />
            <div className="rating">5.0 (15)</div>
          </div>
        </div>

        {/* if info is clicked*/}

        <InfoView
          getStyleForAction={getStyleForAction}
          apiDoc={apiDoc}
          action={action}
        />

        {/* if comments is clicked (REPURPOSED FOR NOTES)*/}
        <NotesView getStyleForAction={getStyleForAction} action={action}/>
     
        {/* if add is clicked: */}
        <AddView action={action} getStyleForAction={getStyleForAction} />

        <div
          className="actions-container"
          style={
            action.active
              ? getStyleForAction("actions-container")
              : {
                  transitionProperty: "all",
                  transitionTimingFunction: "ease-in-out",
                  transitionDuration: ".2s",
                }
          }
        >
          <img
            className="comment"
            src={commentIcon}
            onClick={handleCommentClick}
          />
          {/* <img
              onClick={handleFlag}
              className={
                isFlagged ? "flag filledflagIcon" : "flag unfilledflagIcon"
              }
              src={isFlagged ? filledflagIcon : unfilledflagIcon}
            /> */}

          <img className="add" src={addIcon} onClick={handleIsAddClicked} />
          <img className="info" src={infoIcon} onClick={handleInfoClick} />
        </div>
      </div>

      {/* if dropdown opened: */}
    </>
  );
}
