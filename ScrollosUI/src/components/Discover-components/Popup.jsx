import { useEffect, useState } from "react";
import Discussions from "./Popup-components/Discussions";
import AddView from "./Card-components/AddView";
import exitIcon from "../../assets/exit.svg";
import DocCard from "./DocCard";
export default function Popup(props) {
  const { setIsPopupActive, clientUserData, setClientUserData } = props;
  const [optionSelection, setOptionSelection] = useState("projects");
  const [projectDocs, setProjectDocs] = useState([]);
  const currentProjIndex = 0
  const currentProj =  clientUserData.projects[currentProjIndex]
  const loadedNotes = currentProj.notes;
  const [inputValue, setInputValue] = useState(loadedNotes);
  console.log("userdata POPOUP", clientUserData.projects)

  function handleInputValue(e) {
    const value = e.target.value;
    setInputValue(value);
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

  useEffect(() => {

    fetch(`http://localhost:3001/read/ids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentProj.documentIds),
    })
      .then((res) => res.json())
      .then((json) => setProjectDocs(json));
  }, []);

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

        <button id="close" className="exit" onClick={handleClosePopup}>
          <img
            className="exit-icon"
            src={exitIcon}
            onClick={handleClosePopup}
          />
        </button>

        {/* </div> */}
        <div className="popup-card">
          <div className="flex">
            <div className="popup--left-column">
              <div className="projects-grid">
                {docCards}
                {docCards}
                {docCards}
              </div>
            </div>
            <div className="popup--right-column">
              <div className="discussions">Discussions</div>
              <div className="notes">
                <div>Notes</div>

                <textarea
                  value={inputValue}
                  onChange={handleInputValue}
                  className="notes-text-input"
                  placeholder="Your notes..."
                ></textarea>
                {!(inputValue === loadedNotes) && (
                  // <div className="save">Save</div>
                  <div className="button-container">
                    <button onClick={()=>setInputValue(loadedNotes)} className="undo">Undo</button>
                    <button onClick={()=>{setClientUserData((prev)=>{
                      let projectsCopy = prev.projects
                      let copy = [...prev.projects[currentProj]]
                      copy.notes = inputValue;
                      console.log("UptdCopy", copy)
                      projectsCopy.splice(currentProjIndex, 1, copy)
                      ({...prev, projects:[...UpdatedProjects]})})}} className="save">Save</button>
                    {/* <button onClick={()=>{setClientUserData((prev)=>({...prev,  [currentProj.notes]: inputValue}))}} className="save">Save</button> */}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* <AddView/> */}
          {/* <div className="content">{getSelectionContent()}</div> */}
        </div>
      </div>
    </>
  );
}
