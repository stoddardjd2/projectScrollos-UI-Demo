import { useState, useTransition } from "react";
import saveFill from "../../assets/filledbookmark.svg";
import saveEmpty from "../../assets/unfilledbookmark.svg";
import dropdownIcon from "../../assets/dropdown.svg";
import filledflagIcon from "../../assets/filledflag.svg";
import unfilledflagIcon from "../../assets/unfilledflag.svg";

export default function ApiDocBar(props) {
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
  const [dropdown, setDropdown] = useState(false);
  const { info } = apiDoc || {};
  const { title, description, version, contact, termsOfService } = info || {};

  //skip running fetch in useEffect on initial render
  //update userData in database on change to clientUserData

  function handleSave(e) {
    e.stopPropagation();
    //save changes to database:
    //add to database if saving
    //NOTE: use opposite of isSaved since toggling value to opposite on click after function runs
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
        console.log("remove!");
        console.log(prev.bookmarks);
        const index = prev.bookmarks.indexOf(apiDoc._id);
        prev.bookmarks.splice(index, 1);
        console.log("prev.bookmarks");
        console.log(prev.bookmarks);
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
    //NOTE: use opposite of isSaved since toggling value to opposite on click after function runs
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

  function toggleDropdown() {
    setDropdown(!dropdown);
  }

  return (
    <div>
      <div className="document-container">
        <div className="dropdown-icon">
          <img 
            onClick={toggleDropdown}
            src={dropdownIcon}
            style={{ transform: dropdown ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </div>
        <div className="title-container">
          <div id={apiDoc._id} onClick={handleSelectedDoc} className="title">
            {title}
          </div>
        </div>
        <div className="save" >
          <img
          className= {isSaved ? "save saveFill" : "save saveEmpty"}
            onClick={handleSave}
            src={isSaved ? saveFill : saveEmpty}
          />
        </div>
        <div className="flag">
          <img
            onClick={handleFlag}
            className={isFlagged ? "flag filledflagIcon" : "flag unfilledflagIcon"}
            src={isFlagged ? filledflagIcon : unfilledflagIcon}
          />
        </div>
        <div className="updated">DATE </div>
       
        <div className="project">Add to Project</div>
       
      </div>
      {/* if dropdown opened: */}
      {dropdown && <div className="dropdown">DROP!</div>}
    </div>
  );
}
