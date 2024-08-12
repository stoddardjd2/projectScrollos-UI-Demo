import { useEffect, useState } from "react";

//takes array of document ids and gets corresponding documents up to limit
export default function SidebarItem(props) {
  const { docIds, limit, name, expanded, className, order, isOpen } = props;
  const [documents, setDocuments] = useState();
  const [isExpanded, setIsExpanded] = useState(expanded);
  //get docs for given array of ids (ex: recents, bookmarked,etc.)
  useEffect(() => {
    //make sure array isnt empty/placeholder NOT IN USE
    //make sure documents isnt already loaded
    if (!documents && isExpanded) {
      fetch(`http://localhost:3001/read/ids/${limit}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(docIds),
      })
        .then((results) => results.json())
        .then((docs) => {
          setDocuments(docs);
        });
    }
  }, [isExpanded]);

  //redirect using selection id for api doc viewer
  function handleClick(e) {
    const selectedApiID = e.target.id;
    window.location.href = `/ApiDocViewer/${selectedApiID}`;
  }

  function toggleIsExpanded() {
    console.log("slect!");
    setIsExpanded(!isExpanded);
  }

  //get doc items if documents is loaded/has value
  let items;
  if (documents) {
    items = documents.map((document, index) => {
      return (
        <div
          className="card-item"
          key={index}
          id={document._id}
          onClick={handleClick}
        >
          {document.info.title}
        </div>
      );
    });
  }
  return (
    <div
      className={`card-container ${className}`}
      style={{
        transform: isOpen
          ? "translate(-300px,0px)"
          : `translate(0px,${-135 * order}px)`,

        transition: `${0.3 * order}s ease-in-out all`,
      }}
    >
      <div
        className="card-view-animate"
        style={{ transition: `.3s ease-in-out all` }}
      >
        <h5
          onClick={toggleIsExpanded}
          className={`card-header header-${className}`}
        >
          {name}
        </h5>
        {/* {isExpanded && items} */}
        {items}
      </div>
    </div>
  );
}
