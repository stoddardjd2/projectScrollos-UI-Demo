import scrollosIcon from "../../assets/icon.svg";
import documentsIcon from "../../assets/sidebar-icons/documents.svg";
import projectsIcon from "../../assets/sidebar-icons/projects.svg";
import discussionsIcon from "../../assets/sidebar-icons/discussions.svg";
import notesIcon from "../../assets/sidebar-icons/notes.svg";
import settingsIcon from "../../assets/sidebar-icons/settings.svg";
import notificationsIcon from "../../assets/sidebar-icons/notifications.svg";
import logoutIcon from "../../assets/sidebar-icons/logout.svg";
import dropdownIcon from "../../assets/sideExpand.svg";
import { useEffect, useState } from "react";
import AddView from "./Card-components/AddView";
import Popup from "./Popup-components/Popup";
export default function Sidebar(props) {
  const [sidebarSelection, setSidebarSelection] = useState();
  const {
    isOpen,
    setRightColumnDisplay,
    rightColumnDisplay,
    projects,
    setClientUserData,
    setDisplayApiDocs,
    loadedDocs,
    setActive,
    allDocIds,
    clientUserData,
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
              transition: "0s ease-in-out all",
            }
          : {
              transition: "0s ease-in-out all",
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
          setClientUserData={setClientUserData}
          sidebarSelection={sidebarSelection}
          setSidebarSelection={setSidebarSelection}
          allDocIds={allDocIds}
          setActive={setActive}
        />
        <SidebarItem
          name="Projects"
          img={projectsIcon}
          rightColumnDisplay={rightColumnDisplay}
          dropdownItems={projects}
          setDisplayApiDocs={setDisplayApiDocs}
          setRightColumnDisplay={setRightColumnDisplay}
          setClientUserData={setClientUserData}
          dropdownIcon={dropdownIcon}
          sidebarSelection={sidebarSelection}
          setSidebarSelection={setSidebarSelection}
          setActive={setActive}
        />

        <SidebarItem
          name="Discussions"
          img={discussionsIcon}
          rightColumnDisplay={rightColumnDisplay}
          setDisplayApiDocs={setDisplayApiDocs}
          setClientUserData={setClientUserData}
          setRightColumnDisplay={setRightColumnDisplay}
          sidebarSelection={sidebarSelection}
          setSidebarSelection={setSidebarSelection}
          popup={true}
          clientUserData={clientUserData}
        />
        <SidebarItem
          name="Notes"
          img={notesIcon}
          rightColumnDisplay={rightColumnDisplay}
          setDisplayApiDocs={setDisplayApiDocs}
          setClientUserData={setClientUserData}
          setRightColumnDisplay={setRightColumnDisplay}
          sidebarSelection={sidebarSelection}
          setSidebarSelection={setSidebarSelection}
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
            setClientUserData={setClientUserData}
            setRightColumnDisplay={setRightColumnDisplay}
            sidebarSelection={sidebarSelection}
            setSidebarSelection={setSidebarSelection}
          />
          <SidebarItem
            name="Notifications"
            img={notificationsIcon}
            rightColumnDisplay={rightColumnDisplay}
            setDisplayApiDocs={setDisplayApiDocs}
            setClientUserData={setClientUserData}
            setRightColumnDisplay={setRightColumnDisplay}
            sidebarSelection={sidebarSelection}
            setSidebarSelection={setSidebarSelection}
          />
          <SidebarItem
            name="Logout"
            img={logoutIcon}
            rightColumnDisplay={rightColumnDisplay}
            setDisplayApiDocs={setDisplayApiDocs}
            setClientUserData={setClientUserData}
            setRightColumnDisplay={setRightColumnDisplay}
            sidebarSelection={sidebarSelection}
            setSidebarSelection={setSidebarSelection}
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
    rightColumnDisplay,
    dropdownItems,
    setDisplayApiDocs,
    dropdownIcon,
    sidebarSelection,
    setSidebarSelection,
    setActive,
    allDocIds,
    popup,
    clientUserData,
    setClientUserData,
  } = props;
  const [isPopupActive, setIsPopupActive] = useState(false);
  // const isSelected = rightColumnDisplay === name.toLowerCase();
  const isSelected = name.toLowerCase() === sidebarSelection;
  const [initialDropdownOrder, setInitialDropdownOrder] =
    useState(dropdownItems);
  //get initial dropdown order and prevent from changing when projects array changes.
  //only change when adding new projects

  const [dropdownSelection, setDropdownSelection] = useState();

  function handleOptionSelection(e) {
    //changing display disabled in rightColumn.jsx!!!
    const id = e.currentTarget.id.toLowerCase();

    //reset dropdown selection on option selection
    // setDropdownSelection();
    // setActive(id);
    if (popup) {
      console.log("popup");
      setIsPopupActive(!isPopupActive);
    }

    if (id === sidebarSelection && sidebarSelection) {
      //if sidebar selection is already open and same sidebar option is selected
      setSidebarSelection();
    } else {
      setSidebarSelection(id);
      //control docs to display on option selection:
      if (id === "documents") {
        console.log("setting to", allDocIds);
        setActive(allDocIds);
      }
    }
    setDropdownSelection();
  }

  useEffect(() => {
    //if project created, get that project from array and add to initial array
    if (dropdownItems) {
      //check if dropdown exists for current option
      if (dropdownItems.length > initialDropdownOrder.length) {
        //check if dropdownItems length is greater, indicating project was added
        setInitialDropdownOrder((prev) => {
          //add new project to front of array(new item will be first value in array)
          prev.unshift(dropdownItems[0]);
          // prev.splice(1, 0, dropdownItems[0]);
          return [...prev];
        });
      }
    }
  }, [dropdownItems]);

  function handleDropdownSelection(e) {
    const id = e.currentTarget.id;
    // id is project name which is always unique
    let documentsArray = [];
    let indexOfCurrentProject;
    dropdownItems.map((project, index) => {
      if (project.id === id) {
        documentsArray = project.documentIds;
        indexOfCurrentProject = index;
      }
    });

    //push selected proejct to front of array
    setClientUserData((prev) => {
      //make copy of values not by reference to prevProjects so that it may be mutated seperately
      const prevProjectsCopy = [...prev.projects];
      prevProjectsCopy.splice(indexOfCurrentProject, 1);
      prevProjectsCopy.unshift(prev.projects[indexOfCurrentProject]);
      // const recentOrderArray = prevProjects.concat(prevProjectsCopy)
      return { ...prev, projects: [...prevProjectsCopy] };
    });

    setDropdownSelection(id);
    setActive(documentsArray);
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
        className="sidebar-icon"
          src={img}
          style={isSelected ? { filter: "brightness(100)" } : {}}
        />
        <div className="sidebar-item">{name}</div>
        {dropdownIcon && (
          <img
            src={dropdownIcon}
            className="dropdown-icon"
            style={
              isSelected
                ? {
                    transform: "rotate(-90deg)",
                    transition: ".3s ease-in-out transform",
                  }
                : {
                    transition: ".3s ease-in-out transform",
                    transform: "rotate(90deg)",
                    filter: "brightness(0)",
                  }
            }
          />
        )}
      </div>
      {/*render dropdown if exists */}
      {initialDropdownOrder && (
        // <div className="dropdown-items-container-restricter">
        <div
          className="dropdown-items-container"
          style={
            !isSelected
              ? {
                  // height: "0px",
                  transition: ".3s linear all",
                  maxHeight: "0px",
                }
              : {
                  // height: "auto",
                  maxHeight: "100px",
                  transition: ".3s linear all",
                }
          }
        >
          {initialDropdownOrder.map((item, index) => {
            return (
              //if dropdown item selected, add selection styling
              <div
                style={
                  dropdownSelection === initialDropdownOrder[index].id
                    ? {
                        backgroundColor: "var(--primary-light)",
                        color: "white",
                      }
                    : {}
                }
                id={initialDropdownOrder[index].id}
                key={initialDropdownOrder[index].id}
                onClick={handleDropdownSelection}
                className="dropdown-item"
              >
                {item.id}
              </div>
            );
          })}
        </div>
        // </div>
      )}
      {/* popups: */}
      {isPopupActive && (
        <Popup
          setIsPopupActive={setIsPopupActive}
          clientUserData={clientUserData}
          setClientUserData={setClientUserData}
        />
      )}
    </div>
  );
}
