import recentsIcon from "../../assets/filter-bar-icons/recents.svg";
import bookmarkIcon from "../../assets/filter-bar-icons/bookmark.svg";
import newDocIcon from "../../assets/filter-bar-icons/new-document.svg";
import allDocsIcon from "../../assets/filter-bar-icons/all-documents.svg";
import starIcon from "../../assets/filter-bar-icons/star.svg";
import sortByIcon from "../../assets/filter-bar-icons/sortby.svg";
import { useState } from "react";
export default function FilterBar() {
  const [active, setActive] = useState("All Docs");
  const [hover, setHover] = useState();

  function handleClick(e) {
    setActive(e.currentTarget.id);
  }
  function handleMouseEnter(e) {
    console.log("enter");
    setHover(e.currentTarget.id);
  }

  return (
    <div className="filter-bar">
      <FilterOption
        name="All Docs"
        img={allDocsIcon}
        handleClick={handleClick}
        active={active}
        handleMouseEnter={handleMouseEnter}
        hover={hover}
      />

      <FilterOption
        name="Recents"
        img={recentsIcon}
        handleClick={handleClick}
        active={active}
        handleMouseEnter={handleMouseEnter}
        hover={hover}
      />
      <FilterOption
        name="Bookmarks"
        img={bookmarkIcon}
        handleClick={handleClick}
        handleMouseEnter={handleMouseEnter}
        active={active}
        hover={hover}
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
        handleMouseEnter={handleMouseEnter}
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
        handleMouseEnter={handleMouseEnter}
        hover={hover}
      />
    </div>
  );
}
// additional components:
function FilterOption(props) {
  const {
    name,
    img,
    handleClick,
    handleMouseEnter,
    active,
    slider,
    sortByIcon,
    sortOption1,
    sortOption2,
    sortImg,
    hover,
  } = props;
  //    default to sort from high to low
  const [sort, setSort] = useState(true);
  function handleSort(e) {
    setSort((prev) => !prev);
    console.log("sort");
  }

  return (
    <div className="sort-main-container">
      <div
        id={name}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className="option-container"
      >
        <div
          //   className="option"
          className={
            slider && active === name
              ? "option option-if-slidebar-active"
              : "option option-if-slidebar-inactive"
          }
        >
          <img className="icon " src={img} />
          <div className="name">{name}</div>
        </div>

        {/* if slider enabled and current option active, show extra sort options: */}

        <div
          onClick={handleSort}
          className={
            slider && active === name
              ? "sort-container sort-active"
              : "sort-container sort-inactive"
          }
        >
          <div
            style={
              !sort
                ? { translate: "-4.55em", transition: ".4s ease-in-out all" }
                : { transition: ".4s ease-in-out all" }
            }
            className="toggle-container"
          >
            <div className={"container"}>
              <img src={sortImg} style={{ transform: "rotateX(180deg)" }} />
              <div>{sortOption1}</div>
            </div>

            <div
              className={"container"}
              //   style={sort ? { marginLeft: " 100px" } : {}}
            >
              <img src={sortImg} />
              <div>{sortOption2}</div>
            </div>
          </div>
        </div>

        <div
          className={
            active === name ? "bottom-border active" : "bottom-border inactive"
          }
          style={
            // if hovering over current item and not active, display bottom border
            hover === name && !(hover === active)
              ? {
                  borderBottom: " 2px var(--primary) solid",
                  animation: "expand 0.3s ease-in-out",
                }
              : {
                  animation: "shrink 0.3s ease-in-out",
                }
          }
        ></div>
      </div>
    </div>
  );
}
