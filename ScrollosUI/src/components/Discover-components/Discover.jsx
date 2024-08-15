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
import userIcon from "../../assets/sidebar-icons/user.svg";

import FilterBar from "./FilterBar";
import Sidebar from "./Sidebar";
export default function Discover() {
  const { loadedDocs, userData } = useLoaderData();
  //make sure values are defined to prevent errors after creating account or if no data
  const userDataSchema = { recents: [], bookmarks: [], notes: [], flags: [] };
  //combine with userData overriding fields
  const userDataWithSchema = { ...userDataSchema, ...userData };

  // //make clone of loaded api docs to be able to mutate-
  //-value according to filter and search
  const [apiDocsDisplay, setDisplayApiDocs] = useState(loadedDocs);
  const [clientUserData, setClientUserData] = useState(userDataWithSchema);
  //for toggling sidebar
  const [isOpen, setIsOpen] = useState(false);

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
          <FilterBar />
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
              <Sidebar isOpen={isOpen} />
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
