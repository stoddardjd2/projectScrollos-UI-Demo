import { useState } from "react";
import developmentImg from "../../assets/developmentPlaceholder.svg";
import Projects from "./Right-column-sub-components/Projects";
import PageSelection from "./PageSelection";

import RowDocItem from "./RowDocItem";
import CardsV2DocItem from "./CardsV2DocItem";

export default function RightColumn(props) {
  const {
    docCards,
    apiDocsDisplay,
    rightColumnDisplay,
    setDisplayApiDocs,
    idsForPage,
    currentPage,
    setCurrentPage,
    clientUserData,
    setClientUserData,
  } = props;

  function getRightColumnDisplay() {
    switch (rightColumnDisplay) {
      case "cards":
        // OVERRIDE TO ALWAYS DISPLAY DOCUMENTS VVV
        // case rightColumnDisplay:
        return (
          <div className="card-grid">
            {/* if no search results */}
            {!(apiDocsDisplay.length === 0) ? (
              <>{docCards}</>
            ) : (
              <div className="no-results">NO RESULTS</div>
            )}
          </div>
        );
      case "rows":
        return (
          <div className="row-view">
            {/* if no search results */}
            {!(apiDocsDisplay.length === 0) ? (
              <>
                <div className="row-flex-container row-key">
                  <div className="row-save save-container"></div>
                  <div className="row-title ">Recent Docs</div>
                  <div className="row-rating">Rating</div>
                  <div className="row-date row-key">Last opened</div>
                  <div className="row-version row-key">Document Version</div>
                  <div className="row-api-type row-key">API Spec</div>
                  <button className="more-options"></button>
                </div>
                {apiDocsDisplay.map((apiDoc, index) => {
                  const loadIsSaved = clientUserData.bookmarks.includes(
                    apiDoc._id
                  );

                  return (
                    <RowDocItem
                      apiDoc={apiDoc}
                      loadIsSaved={loadIsSaved}
                      setClientUserData={setClientUserData}
                      clientUserData={clientUserData}
                      key={index}
                    />
                  );
                })}
              </>
            ) : (
              <div className="no-results">NO RESULTS</div>
            )}
          </div>
          // <Projects />;
        );
      case "cards-v2":
        return (
          <div className="cards-v2-view">
            <div className="cards-v2-grid">
              {apiDocsDisplay.map((apiDoc, index) => {
                return (
                    <CardsV2DocItem
                      clientUserData={clientUserData}
                      apiDoc={apiDoc}
                      setClientUserData={setClientUserData}
                      key = {index}
                      setDisplayApiDocs={setDisplayApiDocs}
                      currentDocIndex = {index}
                    />
                );
              })}
            </div>
          </div>
        );
    }
  }

  return (
    <div className="right-column">
      {getRightColumnDisplay()}
      <div className="bottom-navigation">
        <PageSelection
          setDisplayApiDocs={setDisplayApiDocs}
          apiDocsDisplay={apiDocsDisplay}
          idsForPage={idsForPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}
