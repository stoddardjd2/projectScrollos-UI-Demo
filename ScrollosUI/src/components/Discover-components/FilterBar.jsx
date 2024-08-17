import recentsIcon from "../../assets/filter-bar-icons/recents.svg";
import bookmarkIcon from "../../assets/filter-bar-icons/bookmark.svg";
import newDocIcon from "../../assets/filter-bar-icons/new-document.svg";
import allDocsIcon from "../../assets/filter-bar-icons/all-documents.svg";
import starIcon from "../../assets/filter-bar-icons/star.svg";
import sortByIcon from "../../assets/filter-bar-icons/sortby.svg";
import FilterOption from "./FilterOption";
import LastProjectIcon from "../../assets/filter-bar-icons/last-project.svg";
import { useState, useEffect, act } from "react";
export default function FilterBar(props) {
  const {
    setActive,
    active,
    setDisplayApiDocs,
    clientUserData,
    loadedDocs,
    projects,
  } = props;
  const [hover, setHover] = useState();

  // function handleFilter(e) {
  //   const id = e.currentTarget.id;

  //   setFilter(id.toLowerCase());
  // }

  function handleClick(e) {
    setActive(e.currentTarget.id.toLowerCase());
  }

  return (
    <div className="filter-bar">
      {/* active id deterimines display docs in discover switch case statement */}
      <FilterOption
        activeId="documents"
        displayName="All Docs"
        img={allDocsIcon}
        handleClick={handleClick}
        active={active}
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
      />
      <FilterOption
        activeId="recents"
        displayName="Recents"
        img={recentsIcon}
        handleClick={handleClick}
        active={active}
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
      />
      <FilterOption
        activeId="bookmarks"
        displayName="Bookmarks"
        img={bookmarkIcon}
        handleClick={handleClick}
        active={active}
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
      />
      <FilterOption
        activeId="last project"
        displayName="Last Project"
        img={LastProjectIcon}
        handleClick={handleClick}
        active={active}
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
      />

      {/* <div></div> */}
      <div className="vertical-border"></div>
      {/* <div></div> */}
      <FilterOption
        activeId="ratings"
        displayName="Ratings"
        img={starIcon}
        handleClick={handleClick}
        active={active}
        slider={true}
        sortByIcon={sortByIcon}
        sortImg={sortByIcon}
        sortOption1="Most"
        sortOption2="Least"
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
      />
      <FilterOption
        activeId="doc age"
        displayName="Doc Age"
        img={newDocIcon}
        handleClick={handleClick}
        active={active}
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
