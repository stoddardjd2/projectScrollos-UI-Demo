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
    id,
    text
  } = props;
  //    default to sort from high to low
  const [sort, setSort] = useState(true);

  

  //if no name given, use id as name
  let optionName;
  if(!name){
    optionName = id;
  }else{
    optionName = name;
  }



  function handleSort(e) {
    setSort((prev) => !prev);
  }

  return (
    <div
      id={id}
      className="sort-main-container"
      onClick={(e) => {
        handleClick(e);
      }}
    >
      <div
        // id={lowerCaseName}
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
        className="option-container"
      >
        <div
          //   className="option"
          className={
            slider && active === id
              ? "option option-if-slidebar-active"
              : "option option-if-slidebar-inactive"
          }
        >
          <img className="icon " src={img} />
          <div className="name">{optionName}</div>
        </div>
        {/* if slider enabled and current option active, show extra sort options: */}
        <div
          onClick={handleSort}
          className={
            slider && active === id
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
            >
              <img src={sortImg} />
              <div>{sortOption2}</div>
            </div>
          </div>
        </div>
        <div
          className={
            active === id
              ? "bottom-border active"
              : "bottom-border inactive"
          }
        ></div>
      </div>
    </div>
  );
}
