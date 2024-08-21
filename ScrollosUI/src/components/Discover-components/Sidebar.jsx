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
export default function Sidebar(props) {
  const {
    isOpen,
    setRightColumnDisplay,
    rightColumnDisplay,
    projects,
    setProjects,
    setDisplayApiDocs,
    loadedDocs,
    setActive,
    active,
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
          setProjects={setProjects}
          active={active}
          setActive={setActive}
        />
        <SidebarItem
          name="Projects"
          img={projectsIcon}
          rightColumnDisplay={rightColumnDisplay}
          dropdownItems={projects}
          setDisplayApiDocs={setDisplayApiDocs}
          setRightColumnDisplay={setRightColumnDisplay}
          setProjects={setProjects}
          active={active}
          setActive={setActive}
          dropdownIcon={dropdownIcon}
        />

        <SidebarItem
          name="Discussions"
          img={discussionsIcon}
          rightColumnDisplay={rightColumnDisplay}
          setDisplayApiDocs={setDisplayApiDocs}
          setProjects={setProjects}
          active={active}
          setActive={setActive}
          setRightColumnDisplay={setRightColumnDisplay}
        />
        <SidebarItem
          name="Notes"
          img={notesIcon}
          rightColumnDisplay={rightColumnDisplay}
          setDisplayApiDocs={setDisplayApiDocs}
          setProjects={setProjects}
          active={active}
          setActive={setActive}
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
            setProjects={setProjects}
            active={active}
            setActive={setActive}
            setRightColumnDisplay={setRightColumnDisplay}
          />
          <SidebarItem
            name="Notifications"
            img={notificationsIcon}
            rightColumnDisplay={rightColumnDisplay}
            setDisplayApiDocs={setDisplayApiDocs}
            setProjects={setProjects}
            active={active}
            setActive={setActive}
            setRightColumnDisplay={setRightColumnDisplay}
          />
          <SidebarItem
            name="Logout"
            img={logoutIcon}
            rightColumnDisplay={rightColumnDisplay}
            setDisplayApiDocs={setDisplayApiDocs}
            setProjects={setProjects}
            active={active}
            setActive={setActive}
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
    rightColumnDisplay,
    dropdownItems,
    setDisplayApiDocs,
    setProjects,
    active,
    dropdownIcon,
    setActive,
  } = props;
  // const isSelected = rightColumnDisplay === name.toLowerCase();
  const isSelected = name.toLowerCase() === active;
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
    setActive(id);
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
    // setProjects();
    setProjects((prevProjects) => {
      //make copy of values not by reference to prevProjects so that it may be mutated seperately
      const prevProjectsCopy = [...prevProjects];
      prevProjectsCopy.splice(indexOfCurrentProject, 1);
      prevProjectsCopy.unshift(prevProjects[indexOfCurrentProject]);
      // const recentOrderArray = prevProjects.concat(prevProjectsCopy)
      return [...prevProjectsCopy];
    });

    // const documentsArray = dropdownItems[id].documentIds;
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
    </div>
  );
}
