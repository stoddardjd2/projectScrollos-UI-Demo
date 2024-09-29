import { useState } from "react";
import starIcon from "../../assets/star.svg";

export default function Rating(props) {
  const { apiDoc, handleAddRating } = props;
  const [mouseOverStar, setMouseOverStar] = useState();
  const [isAddRatingExpanded, setIsAddRatingExpanded] = useState(true);
  function handleToggleAddRating() {
    setIsAddRatingExpanded(!isAddRatingExpanded);
  }
  function handleMouseOverStar(e) {
    const id = e.currentTarget.id;
    setMouseOverStar(id);
  }

  // function getAverageRating(ratings) {
  //   if (ratings) {
  //     if (ratings.length === 0) {
  //       return { sum: 0, average: 0 };
  //     }

  //     let totalSum = ratings.reduce(
  //       (acc, ratingObj) => acc + parseFloat(ratingObj.rating),
  //       0
  //     );
  //     let average = totalSum / ratings.length;

  //     // Rounding the average to the nearest tenth
  //     let roundedAverage = Math.round(average * 10) / 10;

  //     return roundedAverage;
  //   } else return 0;
  // }

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

  return (
    <div
      className="rating-container"
      style={{ padding: "0" }}
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
      {/* <div className="rating">{getAverageRating(apiDoc.ratings.reviews)}</div> */}
    </div>
  );
}
