import { useEffect, useState, useRef } from "react";
// import Discussions from "./Discussions";
import AddView from "../Card-components/AddView";
import exitIcon from "../../../assets/exit.svg";
import DocCard from "../DocCard";
import Comment from "./Comment";
import InputComment from "./InputComment";
import loadingIcon from "../../../assets/loading.svg";
import ProjectSelection from "./ProjectSelection";
export default function Popup(props) {
  const { setIsPopupActive, clientUserData, setClientUserData } = props;
  const [optionSelection, setOptionSelection] = useState("projects");
  const [projectDocs, setProjectDocs] = useState([]);
  const [loadedProjects, setLoadedProjects] = useState();
  const [selectedProject, setSelectedProject] = useState();
  const currentProjIndex = 0;

  useEffect(() => {
    fetch(`http://localhost:3001/getProjectsByGroup/${clientUserData.group}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        setLoadedProjects(json[0].projects);
        setInputValue(json[0].projects[currentProjIndex].notes);
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
        .then((json) => setProjectDocs(json));
    }
  }, [selectedProject]);

  const [inputValue, setInputValue] = useState();
  const inputRef = useRef(null);
  const [replyInputValue, setReplyInputValue] = useState();

  function handleAddReply() {}

  function handleReplyComment(e) {
    //for useRef when commenting
    inputRef.current.focus();
  }

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
    setSelectedProject(e.target.id);
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
    const loadIsSaved = clientUserData.bookmarks.includes(doc._id);
    const loadIsFlagged = clientUserData.flags.includes(doc._id);
    return (
      <DocCard
        key={doc._id}
        apiDoc={doc}
        loadIsSaved={loadIsSaved}
        loadIsFlagged={loadIsFlagged}
        userID={clientUserData._id}
        setClientUserData={setClientUserData}
        projects={clientUserData.projects}
        clientUserData={clientUserData}
      />
    );
  });

  return (
    <>
      <div id="close" className="popup" onClick={handleClosePopup}>
        {/* <div className="header">
            <div className="filler"></div> */}
        {selectedProject && (
          <button onClick={handleBack} className="back">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M4 10L3.29289 10.7071L2.58579 10L3.29289 9.29289L4 10ZM21 18C21 18.5523 20.5523 19 20 19C19.4477 19 19 18.5523 19 18L21 18ZM8.29289 15.7071L3.29289 10.7071L4.70711 9.29289L9.70711 14.2929L8.29289 15.7071ZM3.29289 9.29289L8.29289 4.29289L9.70711 5.70711L4.70711 10.7071L3.29289 9.29289ZM4 9L14 9L14 11L4 11L4 9ZM21 16L21 18L19 18L19 16L21 16ZM14 9C17.866 9 21 12.134 21 16L19 16C19 13.2386 16.7614 11 14 11L14 9Z"
                  fill="#33363F"
                ></path>
              </g>
            </svg>
          </button>
        )}
        <button id="close" className="exit" onClick={handleClosePopup}>
          <img
            className="exit-icon"
            src={exitIcon}
            onClick={handleClosePopup}
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
                  />
                )}
                {/* display after project selected: */}
                {selectedProject && !projectDocs.length == 0 && (
                  <div className="flex">
                    <div className="popup--left-column">
                      <div className="projects-grid">
                        {docCards}
                        {docCards}
                        {docCards}
                      </div>
                    </div>
                    <div className="popup--right-column">
                      <div className="discussions">
                        <div className="overflow">
                          <div className="discussions-header">Discussions</div>
                          {/* <div className="discussions-comments-container"></div> */}
                          {clientUserData.projects[
                            currentProjIndex
                          ].discussions.map((comment, index) => {
                            return (
                              <Comment
                                key={index}
                                projects={loadedProjects}
                                setClientUserData={setClientUserData}
                                comment = {comment}
                                name={comment.name}
                                text={comment.comment}
                                likes={comment.likes}
                                replies={comment.replies}
                                time={10}
                                setReplyInputValue={setReplyInputValue}
                              />
                            );
                          })}
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
                        <div>Notes</div>
                        <textarea
                          value={inputValue}
                          onChange={handleInputValue}
                          className="notes-text-input"
                          placeholder="Your notes..."
                        ></textarea>
                        {!(
                          inputValue === loadedProjects[currentProjIndex].notes
                        ) && (
                          // <div className="save">Save</div>
                          <div className="button-container">
                            <button
                              onClick={() =>
                                setInputValue(
                                  loadedProjects[currentProjIndex].notes
                                )
                              }
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
