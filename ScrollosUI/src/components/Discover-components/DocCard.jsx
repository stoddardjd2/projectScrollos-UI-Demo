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

import ActionButton from "./Card-components/ActionButton";
// import getStyleForAction from "./Card-components/getStyleForAction";
export default function DocCards(props) {
  const {
    setClientUserData,
    apiDoc,
    loadIsSaved,
    handleSelectedDoc,
    userID,
    loadIsFlagged,
    projects,
    setProjects,
  } = props;
  const [isSaved, setIsSaved] = useState(loadIsSaved);
  // const [isFlagged, setIsFlagged] = useState(loadIsFlagged);
  const [action, setAction] = useState({ active: false, type: "none" });
  // const [IsinfoFlipped, setIsInfoFlipped] = useState(false);

  const [mouseOverStar, setMouseOverStar] = useState();
  const [isAddRatingExpanded, setIsAddRatingExpanded] = useState(false);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));



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

  async function handleAction(e) {
    const id = e.currentTarget.id;
    // if switching to new action view when different action view is open-
    //-close old view first then open
    if (action.active && !(action.type === id)) {
      setAction({ active: false });
      await delay(500);
      setAction({
        active: true,
        type: id,
      });
    } else {
      // if clicking same action when action view is open, close the current view
      if (action.active) {
        //if closing action view
        setAction({ active: false });
      } else {
        setAction({
          // if opening action view
          active: !action.active,
          type: id,
        });
      }
    }
  }

  function handleToggleAddRating() {
    setIsAddRatingExpanded(!isAddRatingExpanded);
  }
  function handleAddRating(e) {
    const rating = e.currentTarget.id;
    console.log("adding rating of :", rating);

    
    // FETCH DATABASE AND ADD RATING!
  }
  function handleMouseOverStar(e) {
    const id = e.currentTarget.id;
    setMouseOverStar(id);
  }

  function getAverageRating(ratings) {
    if (ratings) {
      if (ratings.length === 0) {
        return { sum: 0, average: 0 };
      }

      let totalSum = ratings.reduce(
        (acc, ratingObj) => acc + parseFloat(ratingObj.rating),
        0
      );
      let average = totalSum / ratings.length;

      // Rounding the average to the nearest tenth
      let roundedAverage = Math.round(average * 10) / 10;

      return roundedAverage;
    } else return 0;
  }

  function getRatingElements() {
    const ratingDelays = [
      { enter: "0.4s", exit: "0s" },
      { enter: "0.3s", exit: "0.1s" },
      { enter: "0.2s", exit: "0.2s" },
      { enter: "0.1s", exit: "0.3s" },
    ];
    return ratingDelays.map((ratingDelay, index) => {
      return (
        <img
          key={index}
          src={starIcon}
          className="star"
          onClick={handleAddRating}
          id={index + 2}
          style={
            isAddRatingExpanded
              ? // if expanded:
                mouseOverStar >= index + 2
                ? { opacity: "100%", transition: "0s ease-in-out all" }
                : { transition: "0s ease-in-out all", opacity: " 40%" }
              : //if not expanded:
                { opacity: " 40%" }
          }
        />
      );
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
          padding: "0px",
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
          // transform: "translate(40px 40px)",
          marginTop: "-80px",
          marginLeft: "20px",
          // marginBottom: "-50px",
          padding: "0px",
        };
      } else if (target === "date-star") {
        return {
          // maxHeight: "60px",
          // height: "1em",
          // minHeight: "1em",
          // marginRight:"100%",
          // marginLeft: "100%",
          maxHeight: "100px",

          transition: "2s ease-in-out all",
        };
      } else if (target === "comment-action") {
        return {
          width: "auto",
          height: "82%",
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
      } else if (target === "bookmark") {
        return {
          transitionTimingFunction: "linear",
          transitionDuration: ".5s",
          transitionDelay: ".15s",
          transform: "translate(230px, -100px) scale(2.3)",
          // backgroundColor: "red"

          // visibility: "hidden",
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
          padding: "0px",
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
      } else if (target === "bookmark") {
        return {
          transitionTimingFunction: "linear",
          transitionDuration: ".5s",
          transitionDelay: ".15s",
          transform: "translate(230px, -100px) scale(2.3)",
          // backgroundColor: "red"

          // visibility: "hidden",
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
                  : // when closing info, use delay. If not info closing, use default
                    //  : action.type === "info"
                    //   ? {
                    //       transitionTimingFunction: "linear",
                    //       transitionDuration: "0s",
                    //       // transitionDelay: ".15s",
                    //       transform: "translate(215px, 8px) scale(2.3)",
                    //     }
                    {
                      transitionTimingFunction: "ease-in-out",
                      transitionDuration: ".2s",
                      // transitionDelay: ".15s",
                      transform: "translate(230px, 8px) scale(2.3)",
                    }
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
          <div className="updated">Opened 8/8/2024 </div>
          <div
            className="rating-container"
            onClick={handleToggleAddRating}
            onMouseOver={(e) => setMouseOverStar(e.target.id)}
            onMouseLeave={() => setMouseOverStar()}
          >
            <img
              src={starIcon}
              id={1}
              // onMouseOver={(e) => setMouseOverStar(e.currentTarget.id)}
              // onMouseLeave={() => setMouseOverStar()}
              className="star"
              style={
                isAddRatingExpanded
                  ? // if expanded:
                    mouseOverStar >= 1
                    ? { opacity: "100%", transition: "0s ease-in-out all" }
                    : { transition: "0s ease-in-out all", opacity: "40%" }
                  : //if not expanded:
                    {}
              }
              onClick={(e) => {
                //only set rating if expanded
                isAddRatingExpanded && handleAddRating(e);
              }}
            />

            <div
              className="add-rating-container"
              style={!isAddRatingExpanded ? { width: "0%" } : { width: "100%" }}
            >
              {getRatingElements()}
            </div>
            <div className="rating">{getAverageRating(apiDoc.ratings.reviews)}</div>
          </div>
        </div>

        {/* if info is clicked*/}

        <InfoView
          getStyleForAction={getStyleForAction}
          apiDoc={apiDoc}
          action={action}
        />

        {/* if comments is clicked (REPURPOSED FOR NOTES)*/}
        <NotesView getStyleForAction={getStyleForAction} action={action} />

        {/* if add is clicked: */}
        <AddView
          apiDoc={apiDoc}
          projects={projects}
          setProjects={setProjects}
          action={action}
          getStyleForAction={getStyleForAction}
        />

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
          {/* <img
            id="comment"
            className={
              action.type === "comment"
                ? "active action-icon"
                : "inactive action-icon"
            }
            src={commentIcon}
            onClick={handleAction}
          /> */}
          {/* <img
              onClick={handleFlag}
              className={
                isFlagged ? "flag filledflagIcon" : "flag unfilledflagIcon"
              }
              src={isFlagged ? filledflagIcon : unfilledflagIcon}
            /> */}

          {/* <div
            className={
              action.type === "add" ? "active container" : "inactive container"
            }
          >
            <img
              id="add"
              className={
                action.type === "add"
                  ? "active action-icon"
                  : "inactive action-icon"
              }
              src={addIcon}
              onClick={handleAction}
            />
          </div> */}
          <ActionButton
            type="comment"
            img={commentIcon}
            handleAction={handleAction}
            action={action}
          />
          <ActionButton
            type="add"
            img={addIcon}
            handleAction={handleAction}
            action={action}
          />
          <ActionButton
            type="info"
            img={infoIcon}
            handleAction={handleAction}
            action={action}
          />
        </div>
      </div>

      {/* if dropdown opened: */}
    </>
  );
}
