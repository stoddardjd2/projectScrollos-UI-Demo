import { useLoaderData } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ApiDocBar from "./ApiDocBar";
import Search from "./Search";
import Saved from "./Saved";
export default function Discover() {
  const { allApiDocs, userData } = useLoaderData();
  //make clone of loaded api docs to be able to mutate-
  //-value according to filter and search
  const [apiDocsDisplay, setDisplayApiDocs] = useState(allApiDocs);
  const [selectedApiID, setSelectedApiID] = useState(null);
  const [showPreview, setShowPreview] = useState({ id: null });
  const [clientUserData, setClientUserData] = useState(userData);
  const [bookmarks, setBookmarks] = useState();

  //get currently selected API doc to display sidebar preview
  let selectedApiDoc;
  if (selectedApiID) {
    allApiDocs.map((doc) => {
      if (doc._id === selectedApiID) {
        const apiIndex = allApiDocs.indexOf(doc);
        selectedApiDoc = allApiDocs[apiIndex];
      }
    });
  }

  function handleSelectedDoc(e) {
    const targetID = e.currentTarget.id;
    //if double clicked same api, redirect to apiDocViewer
    //On single click, load preview
    if (selectedApiID == targetID) {
      window.location.href = `/ApiDocViewer/${selectedApiID}`;
    } else {
      setSelectedApiID(targetID);
    }
    setShowPreview(targetID);
  }

  //api Document Bar
  const apiDocs = apiDocsDisplay.map((apiDoc, index) => {
    const loadIsSaved = clientUserData.bookmarks.includes(apiDoc._id);
    return (
      <ApiDocBar
        key={index}
        apiDoc={apiDoc}
        loadIsSaved={loadIsSaved}
        handleSelectedDoc={handleSelectedDoc}
        userID={userData._id}
      />
    );
  });

  // preview container and info:
  const preview = (
    <>
      {selectedApiDoc && (
        <div className="preview">
          <div>NOTES</div>
          <div>{selectedApiDoc.info?.version}</div>
          <div>{selectedApiDoc.info.liscense?.name}</div>
          <div>{selectedApiDoc.info.liscense?.url}</div>
          <div>{selectedApiDoc?.openapi}</div>
          {selectedApiDoc?.servers &&
            selectedApiDoc.servers.map((server, index) => {
              return (
                <div key={index}>
                  <div>{server?.url}</div>
                  <div>{server?.name}</div>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
  return (
    <div className="discover">
      <div className="left-column">
        <div className="flexbox">
          {/* hide sidebar content with preview showing */}
          <div>Recents</div>
          <Saved
            userData={userData}
            setBookmarks={setBookmarks}
            bookmarks={bookmarks}
            userId={userData._id}
          />
          <div>Project</div>
          {selectedApiID && preview}
        </div>
      </div>
      <div className="right-column">
        <div className="search-bar">
          <Search
            setDisplayApiDocs={setDisplayApiDocs}
            allApiDocs={allApiDocs}
          />
          <div>Sort</div>
        </div>
        <div className="content">
          <div className="document-container keys">
            <div className="save">Save</div>
            <div>Title</div>
            <div>Updated: </div>
            <div>Flagged:</div>
            <div>Add to Project</div>
          </div>
          {apiDocs}
        </div>
      </div>
    </div>
  );
}
