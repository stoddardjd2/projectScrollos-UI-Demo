import { useState } from "react";
import saveIcon from "../../../assets/ApiDocViewer-Icons/notes-icons/save.svg";
import cancelIcon from "../../../assets/ApiDocViewer-Icons/notes-icons/cancel.svg";
import trashIcon from "../../../assets/ApiDocViewer-Icons/notes-icons/trash.svg";
export default function Notes(props) {
  const { clientUserData, setClientUserData, apiDoc } = props;
  // const [notesInput, setNotesInput] = useState(clientUserData.notes);
  console.log("LOADING", clientUserData.notes[apiDoc._id]);
  const [noteValue, setNoteValue] = useState(
    clientUserData.notes[apiDoc._id]
      ? [...clientUserData.notes[apiDoc._id]]
      : []
  );
  const [isDeleting, setIsDeleting] = useState(false);

  function handleSaveNotes(e) {
    const index = e.currentTarget.id;
    setClientUserData((prev) => {
      const notesCopy = [...prev.notes[apiDoc._id]];
      notesCopy.splice(index, 1, noteValue[index]);
      return {
        ...prev,
        notes: {...prev.notes, [apiDoc._id]: [...notesCopy] },
      };
    });
    fetch(
      `http://localhost:3001/updateNotes/${clientUserData._id}/${apiDoc._id}/${index}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note: noteValue[index] }),
      }
    )
      .then((res) => res.json())
      .then((results) => {});
  }
  function handleNewNote() {
    setClientUserData((prev) => {
      console.log("PREV", prev.notes);
      //handle if no notes created for apiDoc yet
      if (prev.notes[apiDoc._id]) {
        console.log("exists");
        const notesCopy = [...prev.notes[apiDoc._id]];
        notesCopy.unshift("");
        return { ...prev, notes: { ...prev.notes, [apiDoc._id]: notesCopy } };
      } else {
        return { ...prev, notes: { ...prev.notes, [apiDoc._id]: [""] } };
      }
    });

    setNoteValue((prev) => {
      const copy = [...prev];
      copy.unshift("");
      return copy;
    });
  }
  function handleCancel(e) {
    const index = e.currentTarget.id;
    console.log("CANBCLE");
    setNoteValue((prev) => {
      const copy = [...prev];
      copy.splice(index, 1, clientUserData.notes[index]);
      return copy;
    });
  }

  function handleDeleteNote(e) {
    const index = e.currentTarget.id;
    setIsDeleting((prev) => {
      return { ...prev, [index]: true };
    });
  }

  function handleConfirmDelete(e) {
    const index = e.currentTarget.id;
    setIsDeleting(false);
    setClientUserData((prev) => {
      const notesCopy = [...prev.notes];
      notesCopy.splice(index, 1);
      return { ...prev, notes: notesCopy };
    });
    setNoteValue((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  }

  function handleNoteInput(e) {
    const index = e.currentTarget.id;
    setNoteValue((prev) => {
      const copy = [...prev];
      copy.splice(index, 1, e.target.value);
      console.log("CIPOY", copy);
      return [...copy];
    });
  }

  return (
    <div className="notes-container">
      <div className="notes-header-container">
        <button onClick={handleNewNote}>New Note</button>
      </div>

      <div className="notes-grid">
        {console.log("pre", clientUserData.notes)}
        {console.log("pre-map", clientUserData.notes[apiDoc._id])}
        {console.log("id", apiDoc._id)}
        {clientUserData.notes[apiDoc._id] &&
          clientUserData.notes[apiDoc._id].map((note, index) => {
            console.log("mapping");
            return (
              <div className="note-item-container">
                <textarea
                  key={index}
                  id={index}
                  className="notes-textarea"
                  placeholder="add notes..."
                  onChange={handleNoteInput}
                  value={noteValue[index]}
                ></textarea>
                {!(noteValue[index] == clientUserData.notes[index]) && (
                  <div className="notes-actions-container">
                    <button
                      id={index}
                      className="cancel-button note-button"
                      onClick={handleCancel}
                    >
                      <img src={cancelIcon} />
                    </button>
                    <button
                      id={index}
                      className="save-button note-button"
                      onClick={handleSaveNotes}
                    >
                      <img src={saveIcon} />
                    </button>
                  </div>
                )}
                <div className="trash-container">
                  {!isDeleting[index] ? (
                    <button
                      id={index}
                      className="trash-button note-button"
                      onClick={handleDeleteNote}
                    >
                      <img src={trashIcon} />
                    </button>
                  ) : (
                    <div className="trash-confirm-container">
                      <button
                        id={index}
                        className="cancel-button note-button"
                        onClick={(e) => {
                          const index = e.currentTarget.id;
                          setIsDeleting((prev) => {
                            return { ...prev, [index]: false };
                          });
                        }}
                      >
                        <img src={cancelIcon} />
                      </button>
                      <button
                        id={index}
                        className="save-button note-button"
                        onClick={handleConfirmDelete}
                      >
                        <img src={saveIcon} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
