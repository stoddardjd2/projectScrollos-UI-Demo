import { useState } from "react";
import Discussions from "./Popup-components/Discussions";
import AddView from "./Card-components/AddView";

export default function Popup(props) {
  const { setIsPopupActive } = props;
  const [optionSelection, setOptionSelection] = useState("projects");
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
  return (
    <>
      <div className="popup" onClick={handleClosePopup}>
        <div className="popup-card">
          <div className="header">
            <div className="filler"></div>
            <div onClick={handleOptionSelection} className="options">
              <h2 id="notes" className="option">
                Notes
              </h2>
              <h2 id="projects" className="option selected">
                Projects
              </h2>
              <h2 id="discussions" className="option">
                Discussions
              </h2>
            </div>

            <button onClick={handleClosePopup}>X</button>
          </div>
          {/* <AddView/> */}
          <div className="content">{getSelectionContent()}</div>
        </div>
      </div>
    </>
  );
}
