import { useState, useEffect } from "react";
import starIcon from "../../assets/star.svg";
import Loading from "./Loading";
export default function Rating(props) {
  const { apiDoc, clientUserData } = props;
  const [mouseOverStar, setMouseOverStar] = useState();
  const [isAddRatingExpanded, setIsAddRatingExpanded] = useState(false);
  // const [averageRating, setAverageRating] = useState();
  // const averageRating = apiDoc.avgRating;
  const getLoadedUserRating = () => {
    if (apiDoc.ratings[clientUserData._id]) {
      return apiDoc.ratings[clientUserData._id];
    } else return false;
  };
  const [userRating, setUserRating] = useState(getLoadedUserRating());
  // load average rating (OLD, AVG RATING STORED IN APIDOC DATa)
  // useEffect(() => {
  //   fetch(`http://localhost:3001/getAverageRating/${apiDoc._id}`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((results) => {
  //       setAverageRating(results);
  //     });
  // }, []);

  function handleToggleAddRating() {
    setIsAddRatingExpanded(!isAddRatingExpanded);
  }
  function handleMouseOverStar(e) {
    const id = e.currentTarget.id;
    setMouseOverStar(id);
  }
  function handleAddRating(e) {
    const rating = e.currentTarget.id;
    setUserRating(rating);
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
                mouseOverStar >= index + 2 || userRating >= index + 2
                ? { opacity: "100%", transition: "0s ease-in-out all" }
                : { transition: "0s ease-in-out all", opacity: " 40%" }
              : //if not expanded:
                { opacity: " 40%" }
          }
        />
      );
    });
  }

  return (
    <div className="rating-container-main">
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
                mouseOverStar >= 1 || userRating >= 1
                ? { opacity: "100%", transition: "0s ease-in-out all" }
                : { transition: "0s ease-in-out all", opacity: "40%" }
              : //if not expanded:
                { opacity: "1" }
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
        <div className="rating">
          {apiDoc.avgRating ? apiDoc.avgRating : 0}
          {/* {averageRating ? averageRating : <Loading />} */}
        </div>
        <div>({apiDoc?.ratings ? Object.keys(apiDoc.ratings).length : 0})</div>
      </div>
    </div>
  );
}
