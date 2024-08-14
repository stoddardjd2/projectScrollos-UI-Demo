import { useState } from "react";
import checkedIcon from "../../../assets/checked.svg";
import addBoxedIcon from "../../../assets/addBoxed.svg";
import emptyCheckboxIcon from "../../../assets/emptyCheckbox.svg";
export default function AddView(props) {
  const { getStyleForAction, action } = props;
  const [isChecked, setIsChecked] = useState({});
  const [input, setInput] = useState("");
  const [projects, setProjects] = useState(["project", "project2"]);
  function handleCheckToggle(e) {
    const id = e.currentTarget.id;
    setIsChecked((prev) => ({ ...prev, [id]: !isChecked[id] }));
  }
  const projectsElements = projects.map((project, index) => {
    return (
      <div key={index} id={index} className="item-container" onClick={handleCheckToggle}>
        <div className="item">{project}</div>
        <img
          className= {isChecked[index] ? "empty-checkbox icon" : "checked icon"}
          src={isChecked[index] ? emptyCheckboxIcon : checkedIcon}
        />
      </div>
    );
  });

  function handleInput(e) {
    setInput(e.target.value);
  }
  function handleSubmitInput() {
    setInput("")
    setProjects(prev=>([...prev, input]))
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
        <div className="projects-header">Projects</div>
        {/* <div className="underline"></div> */}
        <div className="projects-body">
          <div className="input-container">
            <input
              value={input}
              onChange={handleInput}
              placeholder="Add a project"
            ></input>
            {input.length > 0 && (
              <img
                onClick={handleSubmitInput}
                className="add-box icon"
                src={addBoxedIcon}
              />
            )}
          </div>
          {projectsElements}
        </div>
      </div>
    </div>
  );
}
