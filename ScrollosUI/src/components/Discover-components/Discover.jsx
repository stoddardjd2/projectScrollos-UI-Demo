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
import FilterBar from "./FilterBar";
import Sidebar from "./Sidebar";
import PageSelection from "./PageSelection";
import Projects from "./Popup-components/Projects";
import Popup from "./Popup-components/Popup";
import projectsIcon from "../../assets/projects.svg";
import UserSettingsBar from "./UserSettingsBar";
import DocumentViewSelector from "./DocumentViewSelector";

export default function Discover() {
  const { loadedDocs, userData, allDocIds, loadedLastViewMode } =
    useLoaderData();
  //make sure values are defined to prevent errors after creating account or if no data
  const userDataSchema = {
    recents: [],
    bookmarks: [],
    notes: [],
    flags: [],
    recentProjects: [],
    projects: [],
  };
  //combine with userData overriding fields
  const userDataWithSchema = { ...userDataSchema, ...userData };

  const [numbOfDocsPerPage, setNumbOfDocsPerPage] = useState(12);

  // //make clone of loaded api docs to be able to mutate-
  //-value according to filter and search
  const [apiDocsDisplay, setDisplayApiDocs] = useState(loadedDocs);
  //alter amount of docs loaded at start using main fetch limit

  //loads then stores docIds assigned to each page
  // "initital" value set by useEffect below after recieiving database response
  const [idsForPage, setidsForPage] = useState(getIdsPerPage(allDocIds));
  const [clientUserData, setClientUserData] = useState(userDataWithSchema);
  //for toggling sidebar
  // const [isOpen, setIsOpen] = useState(false);

  // for controlling right column display:
  //Changed by sidebar selection
  const [rightColumnDisplay, setRightColumnDisplay] =
    useState(loadedLastViewMode);


  const [currentPage, setCurrentPage] = useState(0);
  //had to move out of page selection since was rerendering in same position and keeping
  //-prev currentPage state

  const [active, setActive] = useState(allDocIds);
  const [isPopupActive, setIsPopupActive] = useState(false);

  const [isSettings, setIsSettings] = useState(false);
  //for user settings popup/dropdown(need at this level to hide it when clicking off on discover page)

  useEffect(() => {}, [clientUserData]);

  useEffect(() => {
    const idsForPage = getIdsPerPage(active);
    setidsForPage(idsForPage);
    setCurrentPage(0);
    getDocsByArrayOfIdsAndUpdateDisplay(idsForPage[0]);
  }, [active]);

  function getIdsPerPage(docIds) {
    if (docIds) {
      const numbOfIdsPerPage = numbOfDocsPerPage;
      let idsGroupedByPage = [];
      let idsForPage = [];
      let currentPage = 1;
      docIds.map((docId, index) => {
        idsForPage.push(docId);
        if (index + 1 === numbOfIdsPerPage * currentPage) {
          idsGroupedByPage.push(idsForPage);
          idsForPage = [];
          //reset ids for next page
          currentPage++;
        } else if (docIds.length === index + 1) {
          //if last doc, push partial array
          idsGroupedByPage.push(idsForPage);
        }
      });

      return idsGroupedByPage;
    }
  }

  //for determine display type using active selection
  async function getDocsByArrayOfIdsAndUpdateDisplay(idsArray) {
    if (idsArray === undefined) {
      //if emtpy, show nothing
      setDisplayApiDocs([]);
    } else {
      fetch(`http://localhost:3001/read/ids/${1000}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(idsArray),
      })
        .then((results) => results.json())
        .then((res) => {
          // mongodb sends back array of documents in order of first in their database-
          //must sort their response to match with our array that was sent(for recents to work)
          let sortedResponse = new Array(idsArray.length);
          res.map((responseItem) => {
            const index = idsArray.indexOf(responseItem._id);
            sortedResponse.splice(index, 1, responseItem);
          });
          setDisplayApiDocs(sortedResponse);
        });
    }
  }

  //api Documents
  const docCards = apiDocsDisplay.map((doc) => {
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
    <div
      // onClick={handleDiscoverClick}
      className="discover-page"
    >
      {/* POPUPS here for z-index to work properly*/}
      {isPopupActive && (
        <Popup
          setIsPopupActive={setIsPopupActive}
          clientUserData={clientUserData}
          setClientUserData={setClientUserData}
        />
      )}
      <div className="header-container">
        <div className="search-bar">
          <div className="header">API Library </div>
          {/* <img src={walgreensLogo} /> */}

          {/* <div style={{display:"flex", alignItems: "center"}}> */}
          <Search
            setActive={setActive}
            allApiDocs={loadedDocs}
            apiDocsDisplay={apiDocsDisplay}
            allDocIds={allDocIds}
          />
          <UserSettingsBar
            clientUserData={clientUserData}
            isSettings={isSettings}
            setIsSettings={setIsSettings}
          />

          {/* </div> */}
        </div>
        <div className="page-info-bar">
          {/* <div className="found">10 docs found</div> */}
          <div className="left-margin">
            <div onClick={() => setIsPopupActive(true)} className="container">
              <div className="projects-container">
                <img className="projects-icon" src={projectsIcon} />
                <div>Projects</div>
              </div>
            </div>
          </div>
          {/* <Search
            setDisplayApiDocs={setDisplayApiDocs}
            allApiDocs={loadedDocs}
            apiDocsDisplay={apiDocsDisplay}
          /> */}
          <FilterBar
            setDisplayApiDocs={setDisplayApiDocs}
            allDocIds={allDocIds}
            clientUserData={clientUserData}
            setClientUserData={setClientUserData}
            projects={clientUserData.projects}
            active={active}
            setActive={setActive}
            setIsPopupActive={setIsPopupActive}
          />
          {/* <Sort
            allApiDocs={loadedDocs}
            setDisplayApiDocs={setDisplayApiDocs}
            clientUserData={clientUserData}
          /> */}
          <div className="actions-placeholder"></div>
          <DocumentViewSelector
            setClientUserData={setClientUserData}
            setRightColumnDisplay={setRightColumnDisplay}
            clientUserData={clientUserData}
          />
        </div>
      </div>
      <div className="discover">
        {/* <div className="left-column"> */}
        {/* <div className="divider">
            <div
              // style={
              //   !isOpen
              //     ? {
              //         transition: ".2s ease-in-out all",
              //       }
              //     : { marginLeft: "0px", transition: "1s ease-in-out all" }
              // }
              onClick={toggleSidebar}
              className="right-split"
            >
              <img
                style={{
                  transform: !isOpen ? "rotate(0deg)" : "rotate(180deg)",
                  transition: ".5s ease-in-out all",
                }}
                src={sideExpandIcon}
              />
            </div>

            <div className="left-split">
              <Sidebar
                setDisplayApiDocs={setDisplayApiDocs}
                projects={clientUserData.projects}
                setClientUserData={setClientUserData}
                isOpen={isOpen}
                rightColumnDisplay={rightColumnDisplay}
                setRightColumnDisplay={setRightColumnDisplay}
                loadedDocs={loadedDocs}
                setActive={setActive}
                active={active}
                allDocIds={allDocIds}
                clientUserData={clientUserData}
              />
            </div>
          </div> */}
        {/* </div> */}
        <RightColumn
          rightColumnDisplay={rightColumnDisplay}
          docCards={docCards}
          apiDocsDisplay={apiDocsDisplay}
          setDisplayApiDocs={setDisplayApiDocs}
          idsForPage={idsForPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          clientUserData={clientUserData}
          setClientUserData={setClientUserData}
        />
      </div>
    </div>
  );
}
