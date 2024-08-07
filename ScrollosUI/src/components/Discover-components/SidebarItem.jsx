import { useEffect, useState } from "react";

//takes array of document ids and gets corresponding documents up to limit
export default function SidebarItem(props) {
  const { docIds, limit, name, expanded } = props;
  const [documents, setDocuments] = useState();
  const [isExpanded, setIsExpanded] = useState(expanded);

  //get docs for given array of ids (ex: recents, bookmarked,etc.)
  console.log(name)
  console.log(documents)
  useEffect(() => {
    //make sure array isnt empty/placeholder NOT IN USE
    //make sure documents isnt already loaded
    if (!documents && isExpanded) {
    console.log("loading", name)
      fetch(`http://localhost:3001/read/ids/${limit}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(docIds),
      })
        .then((results) => results.json())
        .then((docs) => {
          console.log("setting docs")
          setDocuments(docs);
        });
    }
  }, []);

  //redirect using selection id for api doc viewer
  function handleClick(e) {
    const selectedApiID = e.target.id;
    window.location.href = `/ApiDocViewer/${selectedApiID}`;
  }

  function toggleIsExpanded() {
    setIsExpanded(!isExpanded);
  }

  //get doc items if documents is loaded/has value
  let items;
  if (documents) {
    items = documents.map((document, index) => {
      return (
        <div
          className="sidebar-item"
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
    items && (
      <div className={`sidebar-container sidebar-item-${name}`}>
        <h5
          onClick={toggleIsExpanded}
          className={`sidebar-header sidebar-header-${name}`}
        >
          {name}
        </h5>
        {isExpanded && items}
      </div>
    )
  );
}
