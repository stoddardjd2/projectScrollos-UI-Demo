import likedIcon from "../../assets/ApiDocViewer-Icons/like-icons/liked.svg";
import notLikedIcon from "../../assets/ApiDocViewer-Icons/like-icons/not-liked.svg";

import { useState, useEffect } from "react";

export default function Like(props) {
  const { clientUserData, apiDoc } = props;
  const [isSaved, setIsSaved] = useState(
    clientUserData.bookmarks.includes(apiDoc._id)
  );
  function handleSave(e) {
    e.stopPropagation();
    //save changes to database:
    //add to database if saving
    //NOTE: use opposite of isSaved since toggling value to opposite on click stylingAfter function runs
    //save:
    if (!isSaved) {
      setIsSaved(!isSaved);
      //   setClientUserData((prev) => ({
      //     ...prev,
      //     bookmarks: [...prev.bookmarks, apiDoc._id],
      //   }));
      fetch(`http://localhost:3001/user/${clientUserData._id}/save/bookmarks`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docID: apiDoc._id }),
      });
      //   setIsSaved(!isSaved);
      //remove from database if unsaving
    } else if (isSaved) {
      //   setIsSaved(!isSaved);
      //remove id of selected item from state
      //   setClientUserData((prev) => {
      //     const index = prev.bookmarks.indexOf(apiDoc._id);
      //     let copy = [...prev.bookmarks];
      //     copy.splice(index, 1);

      //     return {
      //       ...prev,
      //       bookmarks: [...copy],
      //     };
      //   });
      setIsSaved(!isSaved);

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

  return (
    <button>
      <img
        className={isSaved ? "save saveFill" : "save saveEmpty"}
        onClick={handleSave}
        src={isSaved ? likedIcon : notLikedIcon}
      />
    </button>
  );
}
