import recentsIcon from "../../assets/filter-bar-icons/recents.svg";
import bookmarkIcon from "../../assets/filter-bar-icons/bookmark.svg";
import newDocIcon from "../../assets/filter-bar-icons/new-document.svg";
import allDocsIcon from "../../assets/filter-bar-icons/all-documents.svg";
import starIcon from "../../assets/filter-bar-icons/star.svg";
import sortByIcon from "../../assets/filter-bar-icons/sortby.svg";
import FilterOption from "./FilterOption";
import LastProjectIcon from "../../assets/filter-bar-icons/last-project.svg";
import Popup from "./Popup-components/Popup";
import savedIcon from "../../assets/ApiDocViewer-Icons/like-icons/not-liked.svg";
import viewsIcon from "../../assets/views.svg";
import { useState } from "react";
export default function FilterBar(props) {
  const {
    setClientUserData,
    setActive,
    active,
    setDisplayApiDocs,
    clientUserData,
    allDocIds,
  } = props;

  const [activeFilter, setActiveFilter] = useState("all docs");

  function handleSortToggleForViews(sort) {
    setDisplayApiDocs();
    if (sort) {
      fetch(`http://localhost:3001/getDocIdsByViews/lowest`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((results) => results.json())
        .then((res) => {
          // mongodb sends back array of documents in order of first in their database-
          //must sort their response to match with our array that was sent(for recents to work)
          setActive(res);
        });
    } else {
      fetch(`http://localhost:3001/getDocIdsByViews/highest`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((results) => results.json())
        .then((res) => {
          // mongodb sends back array of documents in order of first in their database-
          //must sort their response to match with our array that was sent(for recents to work)
          setActive(res);
        });
    }
  }

  function handleSortToggleForRatings(sort) {
    console.log("DATE")
    setDisplayApiDocs();
    if (sort) {
      fetch(`http://localhost:3001/getDocIdsByRatings/lowest`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((results) => results.json())
        .then((res) => {
          // mongodb sends back array of documents in order of first in their database-
          //must sort their response to match with our array that was sent(for recents to work)
          setActive(res);
        });
    } else {
      fetch(`http://localhost:3001/getDocIdsByRatings/highest`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((results) => results.json())
        .then((res) => {
          // mongodb sends back array of documents in order of first in their database-
          //must sort their response to match with our array that was sent(for recents to work)
          setActive(res);
        });
    }
  }

  function handleSortToggleForDate(sort) {
    
    setDisplayApiDocs();
    if (sort) {
      fetch(`http://localhost:3001/getDocIdsByDate/oldest`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((results) => results.json())
        .then((res) => {
          // mongodb sends back array of documents in order of first in their database-
          //must sort their response to match with our array that was sent(for recents to work)
          setActive(res);
        });
    } else {
      fetch(`http://localhost:3001/getDocIdsByDate/newest`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((results) => results.json())
        .then((res) => {
          // mongodb sends back array of documents in order of first in their database-
          //must sort their response to match with our array that was sent(for recents to work)
          setActive(res);
        });
    }
  }

  function handleClick(e) {
    const activeId = e.currentTarget.id;
    setDisplayApiDocs();
    setActiveFilter(activeId);
    if (activeId === "documents") {
      setActive(allDocIds);
    } else if (activeId === "recents") {
      setActive(clientUserData.recents);
    } else if (activeId === "saved") {
      setActive(clientUserData.bookmarks);
    } else if (activeId === "lastproject") {
      setActive(clientUserData.projects[0].documentIds);
    } else if (activeId === "ratings") {
      fetch(`http://localhost:3001/getDocIdsByRatings/highest`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((results) => results.json())
        .then((res) => {
          setActive(res);
        });
    } else if (activeId === "date") {
      console.log("DATE")

      fetch(`http://localhost:3001/getDocIdsByDate/newest`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((results) => results.json())
        .then((res) => {
          setActive(res);
        });
    } else if (activeId === "views") {
      fetch(`http://localhost:3001/getDocIdsByViews/highest`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((results) => results.json())
        .then((res) => {
          setActive(res);
        });
    }
  }

  return (
    <div className="filter-bar">
      {/* active id deterimines display docs in discover switch case statement */}
      <FilterOption
        activeId="documents"
        displayName="All Docs"
        img={allDocsIcon}
        handleClick={handleClick}
        activeFilter={activeFilter}
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
      />

      <div className="vertical-border"></div>

      <FilterOption
        activeId="recents"
        displayName="Recents"
        img={recentsIcon}
        handleClick={handleClick}
        activeFilter={activeFilter}
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
      />
      <FilterOption
        activeId="saved"
        displayName="Saved"
        img={savedIcon}
        handleClick={handleClick}
        activeFilter={activeFilter}
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
      />
      {/* <FilterOption
        activeId="lastproject"
        displayName="Last Project"
        img={LastProjectIcon}
        handleClick={handleClick}
        activeFilter={activeFilter}
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
      /> */}

      {/* <div></div> */}
      <div className="vertical-border"></div>
      {/* <div></div> */}
      <FilterOption
        activeId="ratings"
        displayName="Ratings"
        img={starIcon}
        handleClick={handleClick}
        activeFilter={activeFilter}
        slider={true}
        sortByIcon={sortByIcon}
        sortImg={sortByIcon}
        sortOption1="Most"
        sortOption2="Least"
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
        handleSortToggle={handleSortToggleForRatings}
      />
      <FilterOption
        activeId="date"
        displayName="Date"
        img={newDocIcon}
        handleClick={handleClick}
        activeFilter={activeFilter}
        slider={true}
        sortByIcon={sortByIcon}
        sortImg={sortByIcon}
        sortOption1="Newest"
        sortOption2="Oldest"
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
        handleSortToggle={handleSortToggleForDate}
      />
      <FilterOption
        activeId="views"
        displayName="Views"
        img={viewsIcon}
        handleClick={handleClick}
        activeFilter={activeFilter}
        slider={true}
        sortByIcon={sortByIcon}
        sortImg={sortByIcon}
        sortOption1="Most"
        sortOption2="Least"
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
        handleSortToggle={handleSortToggleForViews}
      />
    </div>
  );
}
