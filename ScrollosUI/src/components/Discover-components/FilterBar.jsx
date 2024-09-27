import recentsIcon from "../../assets/filter-bar-icons/recents.svg";
import bookmarkIcon from "../../assets/filter-bar-icons/bookmark.svg";
import newDocIcon from "../../assets/filter-bar-icons/new-document.svg";
import allDocsIcon from "../../assets/filter-bar-icons/all-documents.svg";
import starIcon from "../../assets/filter-bar-icons/star.svg";
import sortByIcon from "../../assets/filter-bar-icons/sortby.svg";
import FilterOption from "./FilterOption";
import LastProjectIcon from "../../assets/filter-bar-icons/last-project.svg";
import Popup from "./Popup-components/Popup";
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

  function handleClick(e) {
    const activeId = e.currentTarget.id;
    setActiveFilter(activeId);
    if (activeId === "documents") {
      setActive(allDocIds);
    } else if (activeId === "recents") {
      setActive(clientUserData.recents);
    } else if (activeId === "bookmarks") {
      setActive(clientUserData.bookmarks);
    } else if (activeId === "lastproject") {
      setActive(clientUserData.projects[0].documentIds);
    } else if (activeId === "ratings") {
    } else if (activeId === "docage") {
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
        activeId="bookmarks"
        displayName="Bookmarks"
        img={bookmarkIcon}
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
      />
      <FilterOption
        activeId="docage"
        displayName="Doc Age"
        img={newDocIcon}
        handleClick={handleClick}
        activeFilter={activeFilter}
        slider={true}
        sortByIcon={sortByIcon}
        sortImg={sortByIcon}
        sortOption1="Oldest"
        sortOption2="Newest"
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
      />
      <FilterOption
        activeId="popular"
        displayName="Popular"
        img={newDocIcon}
        handleClick={handleClick}
        activeFilter={activeFilter}
        slider={true}
        sortByIcon={sortByIcon}
        sortImg={sortByIcon}
        sortOption1="Oldest"
        sortOption2="Newest"
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
      />
    </div>
  );
}
