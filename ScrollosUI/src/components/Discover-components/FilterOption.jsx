// additional components:
import { useState, useEffect } from "react";
export default function FilterOption(props) {
  const {
    displayName,
    img,
    handleClick,
    activeFilter,
    slider,
    sortOption1,
    sortOption2,
    sortImg,
    activeId,
    handleSortToggle,
  } = props;
  //    default to sort from high to low
  const [sort, setSort] = useState(true);
  const [sortOption, setSortOption] = useState(0);

  return (
    <div id={activeId} className="sort-main-container" onClick={handleClick}>
      <div className="option-container">
        <div
          //   className="option"
          className={
            slider && activeFilter === activeId
              ? "option option-if-slidebar-active"
              : "option option-if-slidebar-inactive"
          }
        >
          <img className="icon " src={img} />
          <div className="name">{displayName}</div>
        </div>
        {/* if slider enabled and current option active, show extra sort options: */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            setSort((prev) => !prev);
            handleSortToggle(sort);
          }}
          className={
            slider && activeFilter === activeId
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
            <div className={"filter-container"}>
              <img src={sortImg} style={{ transform: "rotateX(180deg)" }} />
              <div>{sortOption1}</div>
            </div>

            <div className={"filter-container"}>
              <img src={sortImg} />
              <div>{sortOption2}</div>
            </div>
          </div>
        </div>
        <div
          className={
            activeFilter === activeId
              ? "bottom-border active"
              : "bottom-border inactive"
          }
        ></div>
      </div>
    </div>
  );
}
