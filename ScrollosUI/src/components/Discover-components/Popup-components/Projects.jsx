import { useState, useRef } from "react";
import checkedIcon from "../../../assets/checked.svg";
import addBoxedIcon from "../../../assets/addBoxed.svg";
import emptyCheckboxIcon from "../../../assets/emptyCheckbox.svg";
import plusIcon from "../../../assets/plus.svg";
import cancelIcon from "../../../assets/cancel.svg";
export default function Projects(props) {
  const { getStyleForAction, action, projects, setClientUserData, apiDoc } =
    props;
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [invalidName, setInvalidName] = useState(false);
  // const [isChecked, setIsChecked] = useState({});
  const [input, setInput] = useState("");
  const [isProjectsSorted, setIsProjectsSorted] = useState(false);

  const inputRef = useRef(null);
  //refrence input box when image clicked and input empty

  function handleInput(e) {
    setInput(e.target.value);
  }

  function handleSubmitInput(e) {
    e.preventDefault();
    inputRef.current.focus();
    //focus refrence on button click

    //check if input isnt empty
    if (!(input.length === 0)) {
      setInput("");

      let hasDuplicateName;
      projects.map((project) => {
        if (project.id === input) {
          hasDuplicateName = true;
        }
      });
      if (!hasDuplicateName) {
        //insert new project at start of projects array
        setIsAddingProject(false);
        setInvalidName(false);
        setClientUserData((prev) => {
          let insertAtStart = prev.projects;
          insertAtStart.unshift({ id: input, documentIds: [apiDoc._id] });
          return { ...prev, projects: [...insertAtStart] };
        });
      } else {
        setInvalidName(true);
      }
    }
  }

  function handleCheckToggle(e) {
    // for current documentID, when checkbox is toggled(1), check if corresponding-
    //-projectID includes that documentID(2). If includes, remove from array to simulate-
    // -unchecking(3). If not included, add to array to simulate checking(4). -
    // -using setProjects, update only the current project array(5).

    // get array of projects.
    //ARRAY => OBJ => ARRAY
    //prev => documentIds => ARRAY value

    if (!isProjectsSorted) {
      setIsProjectsSorted(true);
    }
    //used to prevent sorting list again when toggling checkbox

    const projectId = e.currentTarget.id;
    const projectsCopy = projects;
    projects.map((project, index) => {
      if (project.id === projectId) {
        if (project.documentIds.includes(apiDoc._id)) {
          const location = project.documentIds.indexOf(apiDoc._id);
          project.documentIds.splice(location, 1);
          projectsCopy.splice(index, 1, project);
        } else {
          project.documentIds.push(apiDoc._id);
          projectsCopy.splice(index, 1, project);
        }
      }
      setClientUserData((prev) => ({ ...prev, projects: [...projectsCopy] }));
    });
  }

  function getProjectElements() {
    if (action.active && action.type === "add") {
      //render only if action active and is current type (1 of 2)
      let projectsWithDocId = [];
      let projectsWithoutDocId = [];

      let allProjectsInOrder = () => {
        //only sort until checkbox clicked. (checkbox sets isProjectSorted to true)
        if (isProjectsSorted) {
          return projects;
        } else {
          if (projects) {
            //filter out projects that are not applied to this doc and include projects without it below
            projects.map((project) => {
              if (project.documentIds.includes(apiDoc._id)) {
                projectsWithDocId.push(project);
              } else {
                projectsWithoutDocId.push(project);
              }
            });
          }
          return [...projectsWithDocId, ...projectsWithoutDocId];
        }
      };
      return allProjectsInOrder().map((project, index) => {
        let currentIndex;
        projects.map((projectMap, index) => {
          if (projectMap.id === project.id) {
            currentIndex = index;
          }
        });

        const isChecked = projects[currentIndex].documentIds.includes(
          apiDoc._id
        );
        return (
          <div
            key={index}
            id={project.id}
            className="item-container"
            onClick={handleCheckToggle}
          >
            <div className="item">{project.id}</div>
            <img
              className={!isChecked ? "empty-checkbox icon" : "checked icon"}
              src={!isChecked ? emptyCheckboxIcon : checkedIcon}
            />
          </div>
        );
      });
    }
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
      {/* render when action active and is current type */}
      {action.active && action.type === "add" && (
        <div className="projects-container">
          {/* <div className="projects-header">Projects</div> */}
          {/* <div className="underline"></div> */}
          <div className="projects-body">
            {/* Add hiding project add field when input active, have input in spot.- */}
            {/*-add reverting to add project when clicking off of input. put user in input box  */}

            {!isAddingProject ? (
              <button
                onClick={() => {
                  setInput("");
                  setIsAddingProject(true);
                }}
                className="add-project-button"
              >
                {/* {!isAddingProject && ( */}
                <div
                  className="add-project-body"
                  // style={isAddingProject ? { opacity: "30%" } : {}}
                >
                  <img className="add-icon" src={plusIcon} />
                  <div>New project</div>
                </div>
                {/* )} */}
              </button>
            ) : (
              <button
                onClick={() => setIsAddingProject(false)}
                className="add-project-button"
              >
                <div
                  className="add-project-body"
                  // style={isAddingProject ? { opacity: "60%" } : {}}
                >
                  <img className="add-icon" src={cancelIcon} />
                  <div>Cancel</div>
                </div>
              </button>
            )}
            {isAddingProject && (
              <form className="form" onSubmit={handleSubmitInput}>
                <input
                  // onFocus={() => {
                  //   setIsAddingProject(true);
                  // }}
                  ref={inputRef}
                  id="projectInput"
                  autoComplete="hidden"
                  autoFocus
                  value={input}
                  onChange={handleInput}
                  placeholder={
                    invalidName ? "Name taken, try again" : "Project name"
                  }
                ></input>
                <img
                  className="empty-checkbox icon"
                  src={emptyCheckboxIcon}
                  onClick={handleSubmitInput}
                />
              </form>
            )}
            {/* <div className="input-container item-container">
                <form className="form" onSubmit={handleSubmitInput}>
                  <input
                    autoFocus
                    value={input}
                    onChange={handleInput}
                    placeholder="Add new project"
                  ></input>
                </form>
              </div>
             */}
            {/* {input.length > 0 && (
                  <img
                    onClick={handleSubmitInput}
                    className="add-box icon"
                    src={checkedIcon}
                  />
                )} */}
            {getProjectElements()}
          </div>
        </div>
      )}
    </div>
  );
}
