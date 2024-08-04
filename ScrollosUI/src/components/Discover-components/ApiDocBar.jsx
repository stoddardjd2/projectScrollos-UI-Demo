import { useState } from "react";
import saveFill from "../../assets/filledbookmark.svg";
import saveEmpty from "../../assets/unfilledbookmark.svg";

export default function ApiDocBar(props) {
  const { apiDoc, loadIsSaved, handleSelectedDoc, userID } = props;
  const [isSaved, setIsSaved] = useState(loadIsSaved);
  const { info } = apiDoc || {};
  const { title, description, version, contact, termsOfService } = info || {};

  //skip running fetch in useEffect on initial render
  //update userData in database on change to clientUserData

  function handleSave(e) {
    e.stopPropagation();
    setIsSaved(!isSaved);
    //save changes to database:

    //add to database if saving
    //NOTE: use opposite of isSaved since toggling value to opposite on click after function runs
    if (!isSaved) {
      fetch(`http://localhost:3001/user/${userID}/save/bookmarks`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docID: apiDoc._id }),
      });
      //remove from database if unsaving
    } else if (isSaved) {
      fetch(`http://localhost:3001/user/${userID}/remove/bookmarks`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docID: apiDoc._id }),
      });
    }
  }

  return (
    <div
      onClick={handleSelectedDoc}
      id={apiDoc._id}
      className="document-container"
    >
      <div className="save" onClick={handleSave}>
        <img className="save" src={isSaved ? saveFill : saveEmpty} />
      </div>
      <div>{title}</div>

      <div className="updated">Updated: </div>
      <div>Flagged</div>
      <div>Add to Project</div>
    </div>
  );
}
