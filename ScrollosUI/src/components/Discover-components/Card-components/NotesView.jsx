import { useState } from "react";


export default function NotesView(props) {
  const { action, getStyleForAction } = props;
  const [notes, setNotes] = useState("");

  function handleNotes(e){
    setNotes(e.target.value)
  }

  return (
    <div
      className="comment-action"
      style={
        action.active
          ? getStyleForAction("comment-action")
          : {
              width: "auto",
              height: "0px",
              transitionProperty: "all",
              transitionTimingFunction: "ease-in-out",
              transitionDuration: ".5s",
              overflow: "hidden",
            }
      }
    >
        <div className="notes-header">Notes:</div>
        <textarea onChange={handleNotes} className="notes-input" value={notes} placeholder="Your notes..."></textarea>
        {/* <div className="prev-notes">Your notes</div> */}
    </div>
  );
}
