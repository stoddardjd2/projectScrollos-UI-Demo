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
import PageSelection from "./PageSelection";
export default function Discover() {
  const { loadedDocs, userData, allDocIds } = useLoaderData();
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
  //alter amount of docs loaded at start using main fetch limit

  //loads then stores docIds assigned to each page
  // "initital" value set by useEffect below after recieiving database response
  const [idsForPage, setidsForPage] = useState(getIdsPerPage(allDocIds));
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

  const [active, setActive] = useState("documents");

  useEffect(() => {
    //For setting page buttons data
    //if displaying anything else, it will be in client data as array of all the ids

    if (active === "documents") {
      //if displaying all documents, use loaded allDocIds
      const idsForPage = getIdsPerPage(allDocIds);
      setidsForPage(getIdsPerPage(idsForPage));
      getDocsByArrayOfIdsAndUpdateDisplay(idsForPage[0]);
      //display first page
    } else {
      const idsForPage = getIdsPerPage(clientUserData[active]);
      setidsForPage(idsForPage);
      getDocsByArrayOfIdsAndUpdateDisplay(idsForPage[0]);
    }
  }, [active]);

  // async function getAllDocIds() {
  //   // get all doc ids to be used in determining page assingment for id

  // const results = await fetch(`http://localhost:3001/getAllDocIds`, {
  //   method: "get",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // })
  //   .then((results) => results.json())
  //   .then((json) => {
  //       const docsPerPage = getDocsPerPage(json);
  //       setidsForPage(docsPerPage);
  //     });
  //   return results;
  // }

  function getIdsPerPage(docIds) {
    if (docIds) {
      const numbOfIdsPerPage = 8;
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

  // useEffect(() => {
  //   //deterimine display option based on active selection
  //   if (active) {
  //     switch (active) {
  //       case "bookmarks":
  //         getDocsByArrayOfIdsAndUpdateDisplay(clientUserData.bookmarks);
  //         break;
  //       case "recents":
  //         // getDocsByArrayOfIdsAndUpdateDisplay(clientUserData.recents);
  //         break;
  //       case "flags":
  //         getDocsByArrayOfIdsAndUpdateDisplay(clientUserData.flags);
  //       case "documents":
  //         // NO REQUEST. Set display to have loaded docs at start
  //         setDisplayApiDocs(loadedDocs);
  //         break;
  //       case "ratings":
  //         getDocsByArrayOfIdsAndUpdateDisplay([]);
  //         break;
  //       case "docAge":
  //         getDocsByArrayOfIdsAndUpdateDisplay([]);
  //         break;
  //       case "lastProject":
  //         getDocsByArrayOfIdsAndUpdateDisplay(projects[0].documentIds);
  //         break;
  //     }
  //   }
  // }, [active]);

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
        userID={clientUserData._id}
        setClientUserData={setClientUserData}
        projects={projects}
        setProjects={setProjects}
        clientUserData={clientUserData}
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
          <PageSelection
            setDisplayApiDocs={setDisplayApiDocs}
            apiDocsDisplay={apiDocsDisplay}
            idsForPage={idsForPage}
          />
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
