import scrollosIcon from "../../assets/icon.svg";
import documentsIcon from "../../assets/sidebar-icons/documents.svg";
import projectsIcon from "../../assets/sidebar-icons/projects.svg";
import discussionsIcon from "../../assets/sidebar-icons/discussions.svg";
import notesIcon from "../../assets/sidebar-icons/notes.svg";
import settingsIcon from "../../assets/sidebar-icons/settings.svg";
import notificationsIcon from "../../assets/sidebar-icons/notifications.svg";
import logoutIcon from "../../assets/sidebar-icons/logout.svg";
import { useEffect, useState } from "react";
export default function Sidebar(props) {
  const {
    isOpen,
    setRightColumnDisplay,
    rightColumnDisplay,
    projects,
    setDisplayApiDocs,
    loadedDocs,
  } = props;
  function handleLogout() {
    window.location.href = "/";
  }

  return (
    <div
      className="side-bar"
      style={
        !isOpen
          ? {
              width: "0px",
              // transform:"translate(-300px, 0)",
              transition: ".5s ease-in-out all",
            }
          : {
              transition: ".5s ease-in-out all",
            }
      }
    >
      <div className="scrollos-container">
        <img className="scrollos-icon" src={scrollosIcon} />
        <div className="scrollos-text-container">
          <div className="intro">Powered by</div>
          <div className="header">Project Scrollos</div>
        </div>
      </div>
      <div className="slider-container">
        <div className="slider-option selected">Personal</div>
        <div className="slider-option">Business</div>
      </div>
      <div className="sidebar-items-container">
        <SidebarItem
          name="Documents"
          img={documentsIcon}
          rightColumnDisplay={rightColumnDisplay}
          setDisplayApiDocs={setDisplayApiDocs}
          setRightColumnDisplay={setRightColumnDisplay}
          loadedDocs={loadedDocs}
        />
        <SidebarItem
          name="Projects"
          img={projectsIcon}
          rightColumnDisplay={rightColumnDisplay}
          dropdownItems={projects}
          setDisplayApiDocs={setDisplayApiDocs}
          setRightColumnDisplay={setRightColumnDisplay}
        />

        <SidebarItem
          name="Discussions"
          img={discussionsIcon}
          rightColumnDisplay={rightColumnDisplay}
          
          setDisplayApiDocs={setDisplayApiDocs}
          setRightColumnDisplay={setRightColumnDisplay}
        />
        <SidebarItem
          name="Notes"
          img={notesIcon}
          rightColumnDisplay={rightColumnDisplay}
          setDisplayApiDocs={setDisplayApiDocs}
          setRightColumnDisplay={setRightColumnDisplay}
        />
        {/* border */}
        <div className="bottom-border"></div>
        {/* Account fields */}
        <div className="account-items-container">
          <div className="account-header">Account</div>

          <SidebarItem
            name="Settings"
            img={settingsIcon}
            rightColumnDisplay={rightColumnDisplay}
            setDisplayApiDocs={setDisplayApiDocs}
            setRightColumnDisplay={setRightColumnDisplay}
          />
          <SidebarItem
            name="Notifications"
            img={notificationsIcon}
            rightColumnDisplay={rightColumnDisplay}
            setDisplayApiDocs={setDisplayApiDocs}
            setRightColumnDisplay={setRightColumnDisplay}
          />
          <SidebarItem
            name="Logout"
            img={logoutIcon}
            rightColumnDisplay={rightColumnDisplay}
            setDisplayApiDocs={setDisplayApiDocs}
            setRightColumnDisplay={setRightColumnDisplay}
          />
        </div>
      </div>
    </div>
  );
}
function SidebarItem(props) {
  const {
    name,
    img,
    clickHandler,
    rightColumnDisplay,
    dropdownItems,
    setRightColumnDisplay,
    setDisplayApiDocs,
    loadedDocs,
  } = props;
  const [dropdownSelection, setDropdownSelection] = useState();

  const isSelected = rightColumnDisplay === name.toLowerCase();

  function handleOptionSelection(e) {
    //changing display disabled in rightColumn.jsx!!!
    const id = e.currentTarget.id.toLowerCase();
    //if documents selected, set apiDocs to loaded docs
    if (loadedDocs) {
      setDisplayApiDocs(loadedDocs);
    }
    setRightColumnDisplay(id);
    //reset dropdown selection on option selection
    setDropdownSelection()
  }

  function handleDropdownSelection(e) {
    const id = e.currentTarget.id;
    const documentsArray = dropdownItems[id].documentIds;
    setDropdownSelection(id);
    //update display to show documents included in dropdown selection
    fetch(`http://localhost:3001/read/ids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(documentsArray),
    })
      .then((results) => results.json())
      .then((json) => setDisplayApiDocs(json));
  }

  return (
    <div>
      <div
        id={name}
        onClick={handleOptionSelection}
        className="sidebar-item-container"
        // Highlight currently displayed option
        style={
          isSelected
            ? { backgroundColor: "var(--primary-light)", color: "white" }
            : {}
        }
      >
        {/* change color of image when selected */}
        <img
          src={img}
          style={isSelected ? { filter: "brightness(100)" } : {}}
        />
        <div className="sidebar-item">{name}</div>
      </div>
      {/*show dropdown if exists and selected */}
      {dropdownItems && isSelected && (
        <>
          {dropdownItems.map((item, index) => {
            return (
              //if dropdown item selected, add selection styling
              <div
                style={
                  dropdownSelection == index
                    ? {
                        backgroundColor: "var(--primary-light)",
                        color: "white",
                      }
                    : {}
                }
                id={index}
                key={index}
                onClick={handleDropdownSelection}
                className="dropdown-item"
              >
                {item.id}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
