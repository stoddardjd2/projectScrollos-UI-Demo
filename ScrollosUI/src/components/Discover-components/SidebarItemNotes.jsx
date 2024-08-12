import { useEffect, useState } from "react";

//takes array of document ids and gets corresponding documents up to limit
export default function SidebarItem(props) {
  const { notes, name, expanded, className, order, isOpen } = props;
  const [documents, setDocuments] = useState();
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [isSelected, setIsSelected] = useState(false);

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
          className="card-item"
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
    <div
      className={`card-container ${className}`}
      style={{
        transform: isOpen ? "translate(-300px,0px)" : `translate(0px,${-135*order}px)`,
        transition: `${.3*order}s ease-in-out all`,
      }}
    >
      {/* <div
        className="card-view-animate"
        style={{ transition: `.3s ease-in-out all` }}
      > */}
        <h5
          onClick={toggleIsExpanded}
          className={`card-header header-${className}`}
        >
          {name}
        </h5>
        {/* {isExpanded && items} */}
        {items}
      {/* </div> */}
    </div>
  );
}
