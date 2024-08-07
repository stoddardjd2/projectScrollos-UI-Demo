import {
  unstable_useViewTransitionState,
  useLoaderData,
} from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { uid } from "react-uid";
import ApiDocBar from "./ApiDocBar";
import Search from "./Search";
import Saved from "./Saved";
import SidebarItem from "./SidebarItem";
import Preview from "./Preview";
import sideExpandIcon from "../../assets/sideExpand.svg";
import Sort from "./Sort";
import Logout from "./Logout";
import settingsIcon from "../../assets/settings.svg";
import SideBarItemNotes from "./SidebarItemNotes";
export default function Discover() {
  const { loadedDocs, userData } = useLoaderData();
  //make sure values are defined to prevent errors after creating account or if no data
  const userDataSchema = { recents: [], bookmarks: [], notes: [], flags: [] };
  //combine with userData overriding fields
  const userDataWithSchema = { ...userDataSchema, ...userData };

  // //make clone of loaded api docs to be able to mutate-
  //-value according to filter and search
  const [apiDocsDisplay, setDisplayApiDocs] = useState(loadedDocs);
  // const [selectedApiID, setSelectedApiID] = useState(null);
  //NOT IN USE VVV
  // const [showPreview, setShowPreview] = useState({ id: null });
  const [clientUserData, setClientUserData] = useState(userDataWithSchema);
  //for toggling sidebar
  const [isOpen, setIsOpen] = useState(false);

  //get currently selected API doc to display sidebar preview
  // let selectedDoc;
  // if (selectedApiID) {
  //   loadedDocs.map((doc) => {
  //     if (doc._id === selectedApiID) {
  //       const apiIndex = loadedDocs.indexOf(doc);
  //       selectedDoc = loadedDocs[apiIndex];
  //     }
  //   });
  // }

  function handleSelectedDoc(e) {
    const selectedDocId = e.currentTarget.id;
    //DOUBLE CLICK DISABLED!
    //if double clicked same api, redirect to apiDocViewer
    //On single click, load preview
    // if (selectedApiID == selectedDocId) {

    //update recents in db with updated recents array
    let recentDocIds = [];
    recentDocIds.push(selectedDocId);
    clientUserData.recents.map((recentId) => {
      if (!(selectedDocId == recentId)) {
        recentDocIds.push(recentId);
      }
    });

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
    // } else {
    //   setSelectedApiID(selectedDocId);
    //   setShowPreview(selectedDocId);
    // }
  }
  function toggleSidebar() {
    console.log("TOGGLE");
    setIsOpen(!isOpen);
  }
  function handleLogout() {
    window.location.href = "/";
  }

  //api Document Bar
  const apiDocs = apiDocsDisplay.map((apiDoc, index) => {
    const loadIsSaved = clientUserData.bookmarks.includes(apiDoc._id);
    const loadIsFlagged = clientUserData.flags.includes(apiDoc._id);
    return (
      <ApiDocBar
        key={apiDoc._id}
        apiDoc={apiDoc}
        loadIsSaved={loadIsSaved}
        loadIsFlagged={loadIsFlagged}
        handleSelectedDoc={handleSelectedDoc}
        userID={clientUserData._id}
        setClientUserData={setClientUserData}
      />
    );
  });

  return (
    <div>
      <div className="header-container">
        <div className="search-bar">
          <div className="header">Scrollos</div>

          <Search
            setDisplayApiDocs={setDisplayApiDocs}
            allApiDocs={loadedDocs}
            apiDocsDisplay={apiDocsDisplay}
          />

          <div className="settings button">
            <img src={settingsIcon} />
          </div>
          <btn onClick={handleLogout} className="logout button">
            Logout
          </btn>
        </div>
        <div className="page-info-bar">
          <div className="found">10 docs found</div>
          <Sort
            allApiDocs={loadedDocs}
            setDisplayApiDocs={setDisplayApiDocs}
            clientUserData={clientUserData}
          />
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
            {isOpen && <div className="right-split-placeholder"></div>}
            <div onClick={toggleSidebar} className="right-split">
              <img
                style={{
                  transform: isOpen ? "rotate(0deg)" : "rotate(180deg)",
                }}
                src={sideExpandIcon}
              />
            </div>
            {/* hide sidebar content if closed */}
            <div
              style={{
                width: isOpen ? "0em" : "fit-content",
              }}
              className="left-split"
            >
              <div className="flexbox">
                {/* hide sidebar content with preview showing */}
                <SidebarItem
                  name="Recently Viewed"
                  docIds={clientUserData.recents}
                  limit={5}
                  expanded={true}
                />
                <SidebarItem
                  name="Recent Bookmarks"
                  docIds={clientUserData.bookmarks}
                  limit={5}
                  expanded={true}
                />
                <SidebarItem
                  name="Flagged"
                  docIds={clientUserData.flags}
                  limit={5}
                  expanded={true}
                />
                <SideBarItemNotes name="Notes" notes={clientUserData.notes} />
                <SidebarItem
                  name="Project"
                  docIds={clientUserData.bookmarks}
                  limit={1}
                />
                {/* {selectedApiID && <Preview selectedApiDoc={selectedApiDoc}/>} */}
              </div>
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="divider">
            <div className="content">
              {/* <div style={{backgroundColor:"black"}} className="document-container keys">
            <div className="dropdown-icon"></div>
            <div className="title">Title</div>
            <div>Updated: </div>
            <div>Flagged:</div>
            <div>Add to Project</div>
            <div className="save">Save</div>
          </div> */}
         
         {/* if no search results */}
              {!(apiDocsDisplay.length === 0) ? apiDocs : <div className="no-results">NO RESULTS</div>}
            </div>
            <div className="right-split">
              <div className="flexbox">
              {/* <div className="feed">DATA</div>
              <div className="feed">Feed</div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
