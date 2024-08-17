import recentsIcon from "../../assets/filter-bar-icons/recents.svg";
import bookmarkIcon from "../../assets/filter-bar-icons/bookmark.svg";
import newDocIcon from "../../assets/filter-bar-icons/new-document.svg";
import allDocsIcon from "../../assets/filter-bar-icons/all-documents.svg";
import starIcon from "../../assets/filter-bar-icons/star.svg";
import sortByIcon from "../../assets/filter-bar-icons/sortby.svg";
import FilterOption from "./FilterOption";
import LastProjectIcon from "../../assets/filter-bar-icons/last-project.svg";
import { useState, useEffect } from "react";
export default function FilterBar(props) {
  const { setDisplayApiDocs, clientUserData, loadedDocs, projects } = props;
  const [active, setActive] = useState("All Docs");
  const [hover, setHover] = useState();
  const [filter, setFilter] = useState("sortby");

  useEffect(() => {
    if (!(filter == "sortby")) {
      switch (filter) {
        case "bookmarks":
          getDocsByArrayOfIdsAndUpdateDisplay(clientUserData.bookmarks);
          break;
        case "recents":
          getDocsByArrayOfIdsAndUpdateDisplay(clientUserData.recents);
          break;
        case "flagged":
          getDocsByArrayOfIdsAndUpdateDisplay(clientUserData.flags);
        case "all docs":
          // NO REQUEST. Set display to have loaded docs at start
          setDisplayApiDocs(loadedDocs);
          break;
        case "ratings":
          getDocsByArrayOfIdsAndUpdateDisplay([]);
          break;
        case "doc age":
          getDocsByArrayOfIdsAndUpdateDisplay([]);
          break;
        case "last project":
          getDocsByArrayOfIdsAndUpdateDisplay(projects[0].documentIds);
          break;
      }
    }
  }, [filter]);

  async function getDocsByArrayOfIdsAndUpdateDisplay(idsArray) {
    fetch(`http://localhost:3001/read/ids/${1000}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(idsArray),
    })
      .then((results) => results.json())
      .then((json) => {
        setDisplayApiDocs(json);
      });
  }

  function handleFilter(e) {
    const id = e.currentTarget.id;

    setFilter(id.toLowerCase());
  }

  function handleClick(e) {
    setActive(e.currentTarget.id);
  }
  //   function handleMouseEnter(e) {
  //     console.log("enter");
  //     setHover(e.currentTarget.id);
  //   }
  // async function handleMouseLeave(){

  // }
  return (
    <div className="filter-bar">
      <FilterOption
        name="All Docs"
        img={allDocsIcon}
        handleClick={handleClick}
        active={active}
        hover={hover}
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
        handleFilter={handleFilter}
      />

      <FilterOption
        name="Recents"
        img={recentsIcon}
        handleClick={handleClick}
        active={active}
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
        handleFilter={handleFilter}
        hover={hover}
      />
      <FilterOption
        name="Bookmarks"
        img={bookmarkIcon}
        handleClick={handleClick}
        active={active}
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
        handleFilter={handleFilter}
        hover={hover}
      />
      <FilterOption
        name="Last Project"
        img={LastProjectIcon}
        handleClick={handleClick}
        active={active}
        hover={hover}
        setDisplayApiDocs={setDisplayApiDocs}
        clientUserData={clientUserData}
        handleFilter={handleFilter}
      />

      {/* <div></div> */}
      <div className="vertical-border"></div>
      {/* <div></div> */}
      <FilterOption
        name="Ratings"
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
        handleFilter={handleFilter}
        hover={hover}
      />
      <FilterOption
        name="Doc Age"
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
        handleFilter={handleFilter}
        hover={hover}
      />
    </div>
  );
}
