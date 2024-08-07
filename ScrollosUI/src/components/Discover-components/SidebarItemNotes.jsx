import { useEffect, useState } from "react";

//takes array of document ids and gets corresponding documents up to limit
export default function SidebarItem(props) {
  const { notes, name } = props;
  const [documents, setDocuments] = useState();
  const [isExpanded, setIsExpanded] = useState(false);
  //redirect using selection id for api doc viewer
  
  function handleClick(e) {
    // const selectedApiID = e.target.id;
    // window.location.href = `/ApiDocViewer/${selectedApiID}`;
  }

  function toggleIsExpanded() {
    setIsExpanded(!isExpanded);
  }

  //get doc items if documents is loaded/has value
  let items;
  if (notes) {
    items = notes.map((note, index) => {
      return (
        <div
          className="sidebar-item"
          key={index}
          id={document._id}
          onClick={handleClick}
        >
          {note}
        </div>
      );
    });
  }
  return (
    <div className={`sidebar-container sidebar-item-${name}`}>
      <h5
        onClick={toggleIsExpanded}
        className={`sidebar-header sidebar-header-${name}`}
      >
        {name}
      </h5>
      {isExpanded && items}
    </div>
  );
}
