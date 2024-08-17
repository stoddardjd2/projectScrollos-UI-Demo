import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { uid } from "react-uid";
import DocCard from "./DocCard";
import Search from "./Search";
import Saved from "./Saved";
import SidebarItem from "./SidebarItem";
import Preview from "./Preview";
import sideExpandIcon from "../../assets/sideExpand.svg";
import RightColumn from "./RightColumn";
import Sort from "./Sort";
import Logout from "./Logout";
import settingsIcon from "../../assets/settings.svg";
import SideBarItemNotes from "./SidebarItemNotes";
import walgreensLogo from "../../assets/walgreensLogo.svg";
import userIcon from "../../assets/sidebar-icons/user.svg";

import FilterBar from "./FilterBar";
import Sidebar from "./Sidebar";
export default function Discover() {
  const { loadedDocs, userData } = useLoaderData();
  //make sure values are defined to prevent errors after creating account or if no data
  const userDataSchema = {
    recents: [],
    bookmarks: [],
    notes: [],
    flags: [],
    recentProjects: [],
  };
  //combine with userData overriding fields
  const userDataWithSchema = { ...userDataSchema, ...userData };

  // //make clone of loaded api docs to be able to mutate-
  //-value according to filter and search
  const [apiDocsDisplay, setDisplayApiDocs] = useState(loadedDocs);
  const [clientUserData, setClientUserData] = useState(userDataWithSchema);
  //for toggling sidebar
  const [isOpen, setIsOpen] = useState(false);

  // for controlling right column display:
  //Changed by sidebar selection
  const [rightColumnDisplay, setRightColumnDisplay] = useState("documents");
  // Store all projects for current user:
  //temporary values to test:
  const [projects, setProjects] = useState([
    {
      id: "Project One",
      documentIds: ["669c15ffb288b7fcda5dc2ac", "66aeb7744d74dc0a686c2a05"],
    },
    {
      id: "Project Two",
      documentIds: [
        "66aeb7944d74dc0a686c2a08",
        "66aeb79e4d74dc0a686c2a0a",
        "66aeb7a34d74dc0a686c2a0b",
      ],
    },
  ]);

  const [active, setActive] = useState("All Docs");
  useEffect(() => {
    //deterimine display option based on active selection
    if (active) {
      console.log("effect time:", active);
      switch (active) {
        case "bookmarks":
          getDocsByArrayOfIdsAndUpdateDisplay(clientUserData.bookmarks);
          break;
        case "recents":
          getDocsByArrayOfIdsAndUpdateDisplay(clientUserData.recents);
          break;
        case "flagged":
          getDocsByArrayOfIdsAndUpdateDisplay(clientUserData.flags);
        case "documents":
          // NO REQUEST. Set display to have loaded docs at start
          setDisplayApiDocs(loadedDocs);
          break;
        case "ratings":
          getDocsByArrayOfIdsAndUpdateDisplay([]);
          break;
        case "doc age":
          getDocsByArrayOfIdsAndUpdateDisplay([]);
          break;
        case "last project":
          getDocsByArrayOfIdsAndUpdateDisplay(projects[0].documentIds);
          break;
      }
    }
  }, [active]);

  //for determine display type using active selection
  async function getDocsByArrayOfIdsAndUpdateDisplay(idsArray) {
    fetch(`http://localhost:3001/read/ids/${1000}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(idsArray),
    })
      .then((results) => results.json())
      .then((json) => {
        setDisplayApiDocs(json);
      });
  }


  function handleSelectedDoc(e) {
    const selectedDocId = e.currentTarget.id;

    //update recents in db with updated recents array
    let recentDocIds = [];
    recentDocIds.push(selectedDocId);
    clientUserData.recents.map((recentId) => {
      if (!(selectedDocId == recentId)) {
        recentDocIds.push(recentId);
      }
    });
    setDisplayApiDocs;
    //update recents with new recents array
    //make sure array is not empty
    if (!(recentDocIds[0] == "")) {
      fetch(
        `http://localhost:3001/user/${clientUserData._id}/saveArray/recents`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ docIds: recentDocIds }),
        }
      ).then((window.location.href = `/ApiDocViewer/${selectedDocId}`));
    }
  }
  function toggleSidebar() {
    setIsOpen(!isOpen);
  }

  //api Document Bar
  const docCards = apiDocsDisplay.map((doc) => {
    const loadIsSaved = clientUserData.bookmarks.includes(doc._id);
    const loadIsFlagged = clientUserData.flags.includes(doc._id);
    return (
      <DocCard
        key={doc._id}
        apiDoc={doc}
        loadIsSaved={loadIsSaved}
        loadIsFlagged={loadIsFlagged}
        handleSelectedDoc={handleSelectedDoc}
        userID={clientUserData._id}
        setClientUserData={setClientUserData}
        projects={projects}
        setProjects={setProjects}
      />
    );
  });

  return (
    <div className="discover-page">
      <div className="header-container">
        <div className="search-bar">
          <div className="header">API Library </div>
          {/* <img src={walgreensLogo} /> */}

          {/* <div style={{display:"flex", alignItems: "center"}}> */}
          <Search
            setDisplayApiDocs={setDisplayApiDocs}
            allApiDocs={loadedDocs}
            apiDocsDisplay={apiDocsDisplay}
          />

          <div className="user-info-container">
            <img className="user-icon" src={userIcon} />
            <div>
              <div className="username">Jared Stoddard</div>
              <div className="email">stoddardjd2@gmail.com</div>
            </div>
            <div className="ellipsis">...</div>
          </div>
          {/* </div> */}
        </div>
        <div className="page-info-bar">
          {/* <div className="found">10 docs found</div> */}
          <div className="left-margin"></div>
          {/* <Search
            setDisplayApiDocs={setDisplayApiDocs}
            allApiDocs={loadedDocs}
            apiDocsDisplay={apiDocsDisplay}
          /> */}
          <FilterBar
            setDisplayApiDocs={setDisplayApiDocs}
            loadedDocs={loadedDocs}
            clientUserData={clientUserData}
            projects={projects}
            active={active}
            setActive={setActive}
          />
          {/* <Sort
            allApiDocs={loadedDocs}
            setDisplayApiDocs={setDisplayApiDocs}
            clientUserData={clientUserData}
          /> */}
          <div className="page-container">
            <div className="page">1</div>
            <div className="page">2</div>
            <div className="page">3</div>
          </div>
        </div>
      </div>
      <div className="discover">
        <div className="left-column">
          <div className="divider">
            <div
              style={
                !isOpen
                  ? {
                      transition: ".5s ease-in-out all",
                    }
                  : { marginLeft: "0px", transition: "1s ease-in-out all" }
              }
              onClick={toggleSidebar}
              className="right-split"
            >
              <img
                style={{
                  transform: !isOpen ? "rotate(0deg)" : "rotate(180deg)",
                  transition: "1s ease-in-out all",
                }}
                src={sideExpandIcon}
              />
            </div>

            {/* hide sidebar content if closed */}
            <div className="left-split">
              <Sidebar
                setDisplayApiDocs={setDisplayApiDocs}
                projects={projects}
                setProjects={setProjects}
                isOpen={isOpen}
                rightColumnDisplay={rightColumnDisplay}
                setRightColumnDisplay={setRightColumnDisplay}
                loadedDocs={loadedDocs}
                setActive={setActive}
                active={active}
              />
            </div>
          </div>
        </div>
        <RightColumn
          rightColumnDisplay={rightColumnDisplay}
          docCards={docCards}
          apiDocsDisplay={apiDocsDisplay}
        />
      </div>
    </div>
  );
}
