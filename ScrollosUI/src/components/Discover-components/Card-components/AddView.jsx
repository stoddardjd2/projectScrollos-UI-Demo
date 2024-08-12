import { useState } from "react";
import checkedIcon from "../../../assets/checked.svg";
import addBoxedIcon from "../../../assets/addBoxed.svg";
import emptyCheckboxIcon from "../../../assets/emptyCheckbox.svg";
export default function AddView(props) {
    const {getStyleForAction, action} = props
  const [isChecked, setIsChecked] = useState(false);
  function handleCheckToggle() {
    console.log("check toggle!");
    setIsChecked(!isChecked);
  }

  return (
    <div
      className="add-action"
      style={
        action.active
          ? getStyleForAction("add-action")
          : {
              width: "auto",
              height: "0px",
              transitionProperty: "all",
              transitionTimingFunction: "ease-in-out",
              transitionDuration: ".5s",
              // transitionDelay: ".1s",
            }
      }
    >
      {/* ADD PROJECT LOADING HERE */}
      <div className="projects-container">
        <div className="input-container">
          <input placeholder="Add a project"></input>
          <img className="add-box icon" src={addBoxedIcon} />
        </div>
        <div className="underline"></div>

        <div className="item-container" onClick={handleCheckToggle}>
          <div className="item">Project</div>
          <img
            className="checkbox icon"
            src={isChecked ? emptyCheckboxIcon : checkedIcon}
          />
        </div>

        <div className="item-container">
          <div className="item">Project 2</div>
          <img className="checkbox icon" src={checkedIcon} />
        </div>

        <div className="item-container">
          <div className="item">Project 3</div>
          <img className="checkbox icon" src={checkedIcon} />
        </div>
      </div>
    </div>
  );
}
