import { useState, useEffect } from "react";
import loadingImg from "../../assets/loading.svg";
import messageIcon from "../../assets/cards-v2-icons/messageWhite.svg";

export default function DiscussionsCount(props) {
  const { apiDoc } = props;
  const [discussionsCount, setDiscussionsCount] = useState();
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

  return (
    <div>
      {discussionsCount ? (
        <div className="description-item-container">
          <img className="description-item-icon" src={messageIcon} />
          <div>{discussionsCount}</div>
        </div>
      ) : (
        <img className="loading-request-icon" style={{filter:"brightness(100)"}} src={loadingImg} />
      )}
    </div>
  );
}
