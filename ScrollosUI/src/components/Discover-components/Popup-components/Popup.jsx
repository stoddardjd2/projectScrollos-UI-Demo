import { useEffect, useState, useRef } from "react";
// import Discussions from "./Discussions";
import AddView from "../Card-components/AddView";
import exitIcon from "../../../assets/exit.svg";
import DocCard from "../DocCard";
import Comment from "./Comment";
import InputComment from "./InputComment";
import loadingIcon from "../../../assets/loading.svg";
import ProjectSelection from "./ProjectSelection";
import backIcon from "../../../assets/back.svg";
import editIcon from "../../../assets/project-icons/edit.svg";
import checkIcon from "../../../assets/project-icons/check.svg";
import cancelIcon from "../../../assets/project-icons/cancel.svg";
import AddDocuments from "./AddDocuments";
import AddDocsPopover from "./AddDocsPopover";
import settingsIcon from "../../../assets/project-icons/settings.svg";
import AddMembersBtn from "./AddMembersBtn";
import CardsV2DocItem from "../CardsV2DocItem";
export default function Popup(props) {
  const { setIsPopupActive, clientUserData, setClientUserData } = props;
  const [optionSelection, setOptionSelection] = useState("projects");
  const [projectDocs, setProjectDocs] = useState([]);
  const [loadedProjects, setLoadedProjects] = useState();
  const [selectedProject, setSelectedProject] = useState();
  const [isEditingProjName, setIsEditingProjName] = useState(false);
  const [projectNameInput, setProjectNameInput] = useState();
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  const currentProjIndex = 0;

  useEffect(() => {
    fetch(`http://localhost:3001/getProjectsByArrayOfIds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientUserData.projects),
    })
      .then((res) => res.json())
      .then((json) => {
        setLoadedProjects(json);
      });
  }, []);

  useEffect(() => {
    //load after projects are loaded
    if (loadedProjects && selectedProject) {
      fetch(`http://localhost:3001/read/ids`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loadedProjects[selectedProject].documentIds),
      })
        .then((res) => res.json())
        .then((json) => {
          setProjectDocs(json);
        });
    }
  }, [selectedProject]);

  const [inputValue, setInputValue] = useState();
  const nameInputRef = useRef(null);
  const inputRef = useRef(null);

  const [replyInputValue, setReplyInputValue] = useState();

  function handleAddReply() {}

  // function handleReplyComment(e) {
  //   //for useRef when commenting
  //   inputRef.current.focus();
  // }

  function handleSave() {
    setClientUserData((prev) => {
      let prevCopy = { ...prev };
      prevCopy.projects[currentProjIndex].notes = inputValue;
      return prevCopy;
    });
  }
  function handleInputValue(e) {
    const value = e.target.value;
    setInputValue(value);
  }
  function handleBack() {
    setSelectedProject();
    setProjectDocs([]);
  }

  function handleClosePopup(e) {
    if (e.target === e.currentTarget) {
      setIsPopupActive(false);
    }
  }
  function handleOptionSelection(e) {
    const id = e.target.id;

    if (id) {
      //run only if selected an option and not option container]

      //remove last selection from active:
      document.getElementById(optionSelection).classList.remove("selected");
      //add new selection to active:
      document.getElementById(id).classList.add("selected");

      setOptionSelection(id);
    }
  }

  function handleProjectSelection(e) {
    setSelectedProject(e.currentTarget.id);

    setInputValue(loadedProjects[e.currentTarget.id].notes);
  }

  function handleEditProjectName(e) {
    setProjectNameInput(loadedProjects[selectedProject].name);
    setIsEditingProjName(!isEditingProjName);
    nameInputRef.current.focus();
  }
  function handleSaveProjName(e) {
    e.preventDefault();

    setLoadedProjects((prev) => {
      let prevCopy = [...prev];
      prevCopy.splice(selectedProject, 1, {
        ...prev[selectedProject],
        name: projectNameInput,
      });
      return [...prevCopy];
    });
    setIsEditingProjName(false);

    //update database to match updated project name
    if (!(projectNameInput === loadedProjects[selectedProject].name)) {
      //check if name is different from prev name before sending request to update database
      fetch(
        `http://localhost:3001/updateProjectNameById/${loadedProjects[selectedProject]._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectNameInput }),
        }
      )
        .then((res) => res.json())
        .then((json) => {});
    }
  }

  function handleAddDocument(e) {
    if (e.currentTarget.id == "add-doc-button") {
      setIsAddingDocument(!isAddingDocument);
    }
  }

  function handleLeaveProject() {
    fetch(
      `http://localhost:3001/leaveProject/${loadedProjects[selectedProject]._id}/${clientUserData._id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test: "test" }),
      }
    )
      .then((res) => res.json())
      .then((json) => {
      });

    setClientUserData((prev) => {
      let projectsCopy = [...prev.projects];
      let index = prev.projects.indexOf(loadedProjects[selectedProject]);
      projectsCopy.splice(index, 1);
      return { ...prev, projects: [...projectsCopy] };
    });

    setSelectedProject();
    //return to selection page by removing selection

    setLoadedProjects((prev) => {
      let copy = [...prev];
      copy.splice(selectedProject, 1);
      return [...copy];
    });
  }

  function handleNameClick(e) {
    if (e.detail === 2) {
      handleEditProjectName();
    }
  }

  function getSelectionContent() {
    switch (optionSelection) {
      case "projects":
        return <div>projects</div>;
      case "discussions":
        return <Discussions />;
      case "notes":
        return <div>Notes</div>;
    }
  }

  const docCards = projectDocs.map((doc) => {
    return (
      <CardsV2DocItem
        key={doc._id}
        apiDoc={doc}
        setClientUserData={setClientUserData}
        clientUserData={clientUserData}
      />
    );
  });

  return (
    <>
      <div id="close" className="popup" onMouseDown={handleClosePopup}>
        {/* <div className="header">
            <div className="filler"></div> */}
        {selectedProject && (
          <button onClick={handleBack} className="back">
            <img className="back-icon" src={backIcon} />
          </button>
        )}
        <button id="close" className="exit" onClick={handleClosePopup}>
          <img
            className="exit-icon"
            src={exitIcon}
          />
        </button>

        {/* </div> */}
        <div className="popup-card">
          {
            // Wait for projects to be loaded from database
            loadedProjects ? (
              <>
                {!selectedProject && (
                  <ProjectSelection
                    handleProjectSelection={handleProjectSelection}
                    loadedProjects={loadedProjects}
                    setLoadedProjects={setLoadedProjects}
                    clientUserData={clientUserData}
                    setClientUserData={setClientUserData}
                  />
                )}
                {/* display after project selected: */}
                {selectedProject && (
                  <div className="project-selection">
                    <div className="projects-main-header-container">
                      {!isEditingProjName && (
                        <h2 onClick={handleNameClick} className="projects-name">
                          {loadedProjects[selectedProject].name}
                        </h2>
                      )}
                      <form onSubmit={handleSaveProjName}>
                        <input
                          ref={nameInputRef}
                          id="txt"
                          type="text"
                          className={
                            isEditingProjName ? "project-name-input" : "hidden"
                          }
                          value={projectNameInput}
                          onChange={(e) => {
                            setProjectNameInput(e.target.value);
                          }}
                        ></input>
                      </form>

                      {/* <input
                        ref={nameInputRef}
                        id="txt"
                        type="text"
                        className="project-name-input"
                        value={projectNameInput}
                        onChange={(e) => {
                          setProjectNameInput(e.target.value);
                        }}
                      ></input> */}
                      {!isEditingProjName ? (
                        <img
                          onClick={handleEditProjectName}
                          className="edit-icon"
                          src={editIcon}
                        />
                      ) : (
                        <div className="btns-flex">
                          <img
                            onClick={handleSaveProjName}
                            className="project-name-edit-btns check"
                            src={checkIcon}
                          />
                          <img
                            onClick={() => {
                              setIsEditingProjName(false);
                            }}
                            className="project-name-edit-btns"
                            src={cancelIcon}
                          />
                        </div>
                      )}
                      <div className="header-subcontainer">
                        <button onClick={handleLeaveProject}>
                          <img className="settings-icon" src={settingsIcon} />
                        </button>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="popup--left-column">
                        <div className="projects-header-container">
                          <div className="documents-title">API Documents</div>
                          <div className="add-document-btn-container">
                            <button
                              onClick={handleAddDocument}
                              className="add-document-btn"
                              id="add-doc-button"
                            >
                              <div className="btn-inner-container">
                                <div className="plus">+</div>
                                <div>Add document</div>
                              </div>
                            </button>
                            {isAddingDocument && (
                              <AddDocuments
                                currentProject={loadedProjects[selectedProject]}
                                clientUserData={clientUserData}
                                setLoadedProjects={setLoadedProjects}
                                selectedProject={selectedProject}
                                setClientUserData={setClientUserData}
                              />
                            )}
                          </div>
                        </div>
                        <div className="overflow">
                          <div className="cards-v2-grid">{docCards}</div>
                          <div></div>
                        </div>
                      </div>
                      <div className="popup--right-column">
                        <div className="discussions">
                          <div className="overflow">
                            <div className="discussions-header-container">
                              <h2 className="discussions-header">
                                Discussions
                              </h2>

                              <AddMembersBtn
                                loadedProjects={loadedProjects}
                                selectedProject={selectedProject}
                              />
                            </div>
                            {/* <div className="discussions-comments-container"></div> */}

                            {loadedProjects[selectedProject].discussions.map(
                              (comment, index) => {
                                return (
                                  <Comment
                                    key={index}
                                    projects={loadedProjects}
                                    setClientUserData={setClientUserData}
                                    name={comment.name}
                                    text={comment.comment}
                                    likes={comment.likes.$numberInt}
                                    replies={comment.replies}
                                    time={10}
                                    setReplyInputValue={setReplyInputValue}
                                  />
                                );
                              }
                            )}
                          </div>
                          {/* input */}
                          <div className="input-comment-container">
                            <input
                              ref={inputRef}
                              className="input-comment"
                              placeholder="add a comment..."
                              value={replyInputValue}
                              onChange={(e) => {
                                setReplyInputValue(e.target.value);
                              }}
                            ></input>
                            {replyInputValue && (
                              <div
                                onClick={handleAddReply}
                                className="reply-container"
                              >
                                <svg
                                  style={{ cursor: "pointer" }}
                                  width="24"
                                  height="24"
                                  viewBox="0 0 192 128"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M181.333 117.333V104.533C181.333 86.6112 181.333 77.6512 177.845 70.8054C174.778 64.784 169.883 59.8891 163.861 56.8214C157.015 53.3334 148.055 53.3334 130.133 53.3334H10.6667M10.6667 53.3334L53.3333 10.6667M10.6667 53.3334L53.3333 96"
                                    stroke="#1D1B20"
                                    stroke-width="21.3333"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                                {/* <div>Reply</div> */}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="notes">
                          <div className="notes-header-container">
                            <div className="notes-header">Notes</div>
                            {!(
                              inputValue ===
                              loadedProjects[selectedProject].notes
                            ) && (
                              // <div className="save">Save</div>
                              <div className="button-container">
                                <button
                                  onClick={() => {
                                    setInputValue(
                                      loadedProjects[selectedProject].notes
                                    );
                                  }}
                                  className="undo"
                                >
                                  Undo
                                </button>
                                <button onClick={handleSave} className="save">
                                  Save
                                </button>
                                {/* <button onClick={()=>{setClientUserData((prev)=>({...prev,  [currentProj.notes]: inputValue}))}} className="save">Save</button> */}
                              </div>
                            )}
                          </div>
                          <textarea
                            value={inputValue}
                            onChange={handleInputValue}
                            className="notes-text-input"
                            placeholder="Your notes..."
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // loading placeholder text
              <div className="projects-loading-placeholder">
                <img src={loadingIcon} className="loadingIcon" />
              </div>
            )
          }
        </div>
      </div>
    </>
  );
}
