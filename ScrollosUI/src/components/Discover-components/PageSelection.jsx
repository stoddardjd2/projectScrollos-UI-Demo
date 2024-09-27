import { useState } from "react";

export default function PageSelection(props) {
  const {
    setDisplayApiDocs,
    apiDocsDisplay,
    idsForPage,
    currentPage,
    setCurrentPage,
    setRightColumnDisplay
  } = props;

  function handleSetPage(e) {
    const index = e.currentTarget.id;
    setCurrentPage(Number(index));

    const docsToDisplay = idsForPage[index];

    fetch(`http://localhost:3001/read/ids/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(docsToDisplay),
    })
      .then((results) => results.json())
      .then((json) => {
        setDisplayApiDocs(json);
      });
  }

  function handlePrevClick() {
    const prevPage = currentPage - 1;
    setCurrentPage(prevPage);
    const docsToDisplay = idsForPage[prevPage];

    fetch(`http://localhost:3001/read/ids/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(docsToDisplay),
    })
      .then((results) => results.json())
      .then((json) => {
        setDisplayApiDocs(json);
      });
  }

  // wait for idsForPage to be loaded and calculated
  const allPageElements =
    idsForPage &&
    idsForPage.map((page, index) => {
      if (index === 0) {
        return;
      }
      if (index === idsForPage.length - 1) {
        return;
      }

      // for last pages
      if (
        currentPage >= idsForPage.length - 4 &&
        index >= idsForPage.length - 4
      ) {
        return (
          <div
            onClick={handleSetPage}
            className="page"
            key={index}
            id={index}
            style={
              currentPage == index
                ? {
                    opacity: "100%",
                    backgroundColor: "var(--primary-light)",
                    color: "white",
                    border: "none",
                    // backgroundColor: "var(--primary-light)",
                    // boxShadow: " 0 0px 5px white",
                    // color: "white"
                  }
                : {}
            }
          >
            {index + 1}
          </div>
        );
      }

      if (index >= 3 + currentPage) {
        //only display at most 3 page buttons
        return;
      }
      if (index < currentPage) {
        return;
      }
      if (currentPage === 1 && index === 3) {
        return;
      }
      return (
        <div
          onClick={handleSetPage}
          className="page"
          key={index}
          id={index}
          style={
            currentPage == index
              ? {
                  opacity: "100%",
                  backgroundColor: "var(--primary-light)",
                  color: "white",
                  border: "none",
                }
              : {}
          }
        >
          {index + 1}
        </div>
      );
    });
  return (
    <>
      <div className="page-container">
        {currentPage >= 2 && idsForPage.length >= 4 && (
          <button onClick={handlePrevClick} className="prev-page">
            <div>Prev</div>
          </button>
        )}
        <div
          onClick={handleSetPage}
          className="page"
          key={0}
          id={0}
          style={
            currentPage == 0
              ? {
                  backgroundColor: "var(--primary-light)",
                  color: "white",
                  border: "none",
                }
              : {}
          }
        >
          {1}
        </div>
        {idsForPage.length >= 2 && (
          <>
            {currentPage >= 2 && idsForPage.length >= 4 && (
              <div className="spacing">...</div>
            )}
            {allPageElements}
            {idsForPage.length >= 4 && <div className="spacing">...</div>}
            {/* display last page option possible */}
            <div
              onClick={handleSetPage}
              className="page"
              key={idsForPage.length - 1}
              id={idsForPage.length - 1}
              style={
                currentPage == idsForPage.length - 1
                  ? {
                      backgroundColor: "var(--primary-light)",
                      color: "white",
                      border: "none",
                    }
                  : {}
              }
            >
              {idsForPage.length}
            </div>
          </>
        )}
      </div>
    </>
  );
}
