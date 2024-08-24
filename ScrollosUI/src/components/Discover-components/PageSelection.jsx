import { useState } from "react";

export default function PageSelection(props) {
  const { setDisplayApiDocs, apiDocsDisplay, idsForPage } = props;
  const [currentPage, setCurrentPage] = useState(0);

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
        console.log("length:", idsForPage.length - 3);
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
                  backgroundColor: "white",
                  color: "black",
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
        console.log("test");
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
                  backgroundColor: "white",
                  color: "black",
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
        {currentPage >= 2 && (
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
                  backgroundColor: "white",
                  color: "black",
                }
              : {}
          }
        >
          {1}
        </div>
        {currentPage >= 2 && <div className="spacing">...</div>}
        {allPageElements}
        <div className="spacing">...</div>
        {/* display last page option possible */}
        <div
          onClick={handleSetPage}
          className="page"
          key={idsForPage.length - 1}
          id={idsForPage.length - 1}
        >
          {idsForPage.length}
        </div>
      </div>
    </>
  );
}
