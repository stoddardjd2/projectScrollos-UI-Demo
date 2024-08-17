// additional components:
import { useState, useEffect } from "react";
export default function FilterOption(props) {
  const {
    name,
    img,
    handleClick,
    active,
    slider,
    sortOption1,
    sortOption2,
    sortImg,
    clientUserData,
    handleFilter,
  } = props;
  //    default to sort from high to low
  const [sort, setSort] = useState(true);

  function handleSort(e) {
    setSort((prev) => !prev);
  }

  return (
    <div
      id={name}
      className="sort-main-container"
      onClick={(e) => {
        handleFilter(e);
        handleClick(e);
      }}
    >
      <div
        // id={name}
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
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
          //   style={
          //     // if hovering over current item and not active, display bottom border
          //     hover === name && !(hover === active)
          //       ? {
          //           borderBottom: " 2px green solid",
          //           animation: "expand 1s ease-in-out",
          //           width:" 100%"
          //         }
          //       : {

          //           animation: "shrink 0.3s ease-in-out",
          //         }
          //   }
        ></div>
      </div>
    </div>
  );
}
