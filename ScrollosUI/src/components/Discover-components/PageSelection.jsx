export default function PageSelection(props) {
  const { setDisplayApiDocs, apiDocsDisplay, idsForPage } = props;

  function handleSetPage(e) {
    const index = e.currentTarget.id;
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
    // add functionality when clicking
  }
  // wait for idsForPage to be loaded and calculated
  const allPageElements =
    idsForPage &&
    idsForPage.map((page, index) => {
      return (
        <div onClick={handleSetPage} className="page" key={index} id={index}>
          {index + 1}
        </div>
      );
    });
  return <div className="page-container">{allPageElements}</div>;
}
