import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { uid } from "react-uid";
import DocCard from "./DocCard";
import Search from "./Search";
import Saved from "./Saved";
import SidebarItem from "./SidebarItem";
import Preview from "./Preview";
import sideExpandIcon from "../../assets/sideExpand.svg";
import Sort from "./Sort";
import Logout from "./Logout";
import settingsIcon from "../../assets/settings.svg";
import SideBarItemNotes from "./SidebarItemNotes";
import walgreensLogo from "../../assets/walgreensLogo.svg";
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
    setIsOpen(!isOpen);
  }
  function handleLogout() {
    window.location.href = "/";
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
      />
    );
  });

  return (
    <div className="discover-page">
      <div className="header-container">
        <div className="search-bar">
          <div className="header">Walgreens' API Docs</div>
          {/* <img src={walgreensLogo} /> */}

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
            {/* {isOpen && <div className="right-split-placeholder"></div>} */}
            <div
              style={
                !isOpen
                  ? {
                      marginLeft: "245px",
                      transition: ".5s ease-in-out all",
                    }
                  : { marginLeft: "0px", transition: "1s ease-in-out all" }
              }
              onClick={toggleSidebar}
              className="right-split"
            >
              <img
                style={{
                  transform: isOpen ? "rotate(0deg)" : "rotate(180deg)",
                  transition: "1s ease-in-out all",
                }}
                src={sideExpandIcon}
              />
            </div>

            {/* hide sidebar content if closed */}
            <div className="left-split">
              <div
                className="cards-flexbox"
                // style={{
                //   transform: isOpen
                //     ? "translate(-300px,0px)"
                //     : "translate(0px,0px)",
                //   transition: ".5s ease-in-out all",
                // }}
              >
                {/* hide sidebar content with preview showing */}
                {/* expanded NOT in use */}
                <SidebarItem
                  name="Recently Viewed"
                  docIds={clientUserData.recents}
                  limit={5}
                  expanded={true}
                  className="recently-viewed"
                  order="1"
                  isOpen={isOpen}
                />
                <SidebarItem
                  name="Recent Bookmarks"
                  docIds={clientUserData.bookmarks}
                  limit={5}
                  expanded={true}
                  className="recent-bookmarks"
                  order="2"
                  isOpen={isOpen}
                />
                <SidebarItem
                  name="Projects"
                  docIds={clientUserData.bookmarks}
                  limit={5}
                  expanded={true}
                  className="recent-bookmarks"
                  order="3"
                  isOpen={isOpen}
                />
                {/* <SidebarItem
                  name="Flagged"
                  docIds={clientUserData.flags}
                  limit={5}
                  expanded={true}
                  className="flagged"
                  order="3"
                  isOpen={isOpen}
                /> */}
                <SideBarItemNotes
                  expanded={true}
                  name="Notes"
                  notes={clientUserData.notes}
                  className="notes"
                  order="4"
                  isOpen={isOpen}
                />
                {/* <SidebarItem
                  name="Project"
                  docIds={clientUserData.bookmarks}
                  limit={1}
                /> */}
                {/* {selectedApiID && <Preview selectedApiDoc={selectedApiDoc}/>} */}
              </div>
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="card-grid">
            {/* if no search results */}
            {!(apiDocsDisplay.length === 0) ? (
              <>
                {docCards}
                {docCards}
                {docCards}
              </>
            ) : (
              <div className="no-results">NO RESULTS</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
