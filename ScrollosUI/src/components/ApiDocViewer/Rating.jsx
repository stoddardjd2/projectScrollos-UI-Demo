import { useState, useEffect } from "react";
import starIcon from "../../assets/star.svg";

export default function Rating(props) {
  const { apiDoc, clientUserData } = props;
  const [hoverOverIndex, setHoverOverIndex] = useState();
  const getLoadedUserRating = () => {
    if (apiDoc.ratings[clientUserData._id]) {
      return apiDoc.ratings[clientUserData._id];
    } else return false;
  };
  const [userRating, setUserRating] = useState(getLoadedUserRating());
  const [userRatingHover, setUserRatingHover] = useState(getLoadedUserRating());
  const [averageRating, setAverageRating] = useState()
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

  function handleHoverOverStar(e) {
    console.log("HOVER");
    setHoverOverIndex(e.target.id);
    setUserRatingHover(e.target.id);
  }
  function handleHoverLeaveStar(e) {
    setHoverOverIndex();
    // setUserRating(getLoadedUserRating());
    setUserRatingHover(userRating);
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

  let starsElements = [];
  for (let i = 1; i <= 5; i++) {
    starsElements.push(
      <img
        key={i}
        index={i}
        id={i}
        src={starIcon}
        className="star"
        onMouseEnter={handleHoverOverStar}
        onMouseLeave={handleHoverLeaveStar}
        style={i <= userRatingHover ? { opacity: 1 } : { opacity: 0.2 }}
        onClick={handleAddRating}
      />
    );
  }

  return <div className="rating-container-v3">{starsElements}</div>;
}
