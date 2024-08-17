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
  const [filter, setFilter] = useState("sortby");

  // function handleFilter(e) {
  //   const id = e.currentTarget.id;

  //   setFilter(id.toLowerCase());
  // }

  function handleClick(e) {
    setActive(e.currentTarget.id.toLowerCase());
  }

  return (
    <div className="filter-bar">
      <FilterOption
        id="documents"
        name="All Docs"
        img={allDocsIcon}
        handleClick={handleClick}
        active={active}
        hover={hover}
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
      />

      <FilterOption
        id="Recents"
        img={recentsIcon}
        handleClick={handleClick}
        active={active}
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
        hover={hover}
      />
      <FilterOption
        id="Bookmarks"
        img={bookmarkIcon}
        handleClick={handleClick}
        active={active}
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
        hover={hover}
      />
      <FilterOption
        id="Last Project"
        img={LastProjectIcon}
        handleClick={handleClick}
        active={active}
        hover={hover}
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
      />

      {/* <div></div> */}
      <div className="vertical-border"></div>
      {/* <div></div> */}
      <FilterOption
        id="Ratings"
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
        hover={hover}
      />
      <FilterOption
        id="Doc Age"
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
        hover={hover}
      />
    </div>
  );
}
