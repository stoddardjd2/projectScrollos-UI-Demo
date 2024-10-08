import { useState } from "react";
import saveIcon from "../../../assets/ApiDocViewer-Icons/notes-icons/save.svg";
import cancelIcon from "../../../assets/ApiDocViewer-Icons/notes-icons/cancel.svg";
import trashIcon from "../../../assets/ApiDocViewer-Icons/notes-icons/trash.svg";

export default function Notes(props) {
  const { clientUserData, setClientUserData, apiDoc } = props;
  // const [notesInput, setNotesInput] = useState(clientUserData.notes);
  const [noteValue, setNoteValue] = useState(getNoteValues());
  const [isDeletingEnabled, setIsDeletingEnabled] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function getNoteValues() {
    clientUserData.notes[apiDoc._id];
    let values = [];
    if (clientUserData.notes[apiDoc._id]) {
      values = clientUserData.notes[apiDoc._id].map((noteInfo) => {
        return noteInfo.note;
      });
    }
    return values;
  }

  function handleSaveNotes(e) {
    const index = e.currentTarget.id;

    setClientUserData((prev) => {
      const notesCopy = [...prev.notes[apiDoc._id]];
      notesCopy.splice(index, 1, {
        ...prev.notes[apiDoc._id][index],
        note: noteValue[index],
      });
      return { ...prev, notes: { ...prev.notes, [apiDoc._id]: notesCopy } };
    });

    fetch(
      `http://localhost:3001/saveNote/${clientUserData._id}/${apiDoc._id}/${index}`,
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
      //handle if no notes created for apiDoc yet
      fetch(
        `http://localhost:3001/createNote/${clientUserData._id}/${apiDoc._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((results) => {});

      if (prev.notes[apiDoc._id]) {
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
    setNoteValue((prev) => {
      const copy = [...prev];
      copy.splice(index, 1, clientUserData.notes[apiDoc._id][index]);
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
      const notesCopy = [...prev.notes[apiDoc._id]];
      notesCopy.splice(index, 1);
      return { ...prev, notes: { ...prev.notes, [apiDoc._id]: notesCopy } };
    });
    setNoteValue((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
    fetch(
      `http://localhost:3001/deleteNote/${clientUserData._id}/${apiDoc._id}/${index}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((results) => {});
  }

  function handleNoteInput(e) {
    const index = e.currentTarget.id;
    setNoteValue((prev) => {
      const copy = [...prev];
      copy.splice(index, 1, e.target.value);
      return [...copy];
    });
  }

  return (
    <div className="notes-container">
      <div className="notes-header-container">
        <button onClick={handleNewNote}>New Note</button>
        <button
          className="enable-delete-btn"
          style={
            isDeletingEnabled ? { backgroundColor: "rgb(83, 83, 83)" } : {}
          }
          onClick={() => setIsDeletingEnabled(!isDeletingEnabled)}
        >
          Delete note
        </button>
      </div>

      <div className="notes-grid">
        {clientUserData.notes[apiDoc._id] &&
          clientUserData.notes[apiDoc._id].map((noteInfo, index) => {
            const updatedDate = new Date(
              clientUserData.notes[apiDoc._id][index].updatedAt
            );

            return (
              <div key={index} className="note-item-container">
                <textarea
                  key={index}
                  id={index}
                  className="notes-textarea"
                  placeholder="add notes..."
                  onChange={handleNoteInput}
                  value={noteValue[index]}
                ></textarea>
                {
                  <div className="notes-actions-container">
                    {/* <button
                      id={index}
                      className="cancel-button note-button"
                      onClick={handleCancel}
                    >
                      <img src={cancelIcon} />
                    </button> */}

                    {isDeletingEnabled && (
                      <>
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
                              className="confirm-delete-button save-button note-button"
                              onClick={handleConfirmDelete}
                            >
                              <img src={trashIcon} />
                            </button>
                            <button
                              id={index}
                              className="confirm-cancel-button cancel-button note-button"
                              onClick={(e) => {
                                const index = e.currentTarget.id;
                                setIsDeleting((prev) => {
                                  return { ...prev, [index]: false };
                                });
                              }}
                            >
                              <img src={cancelIcon} />
                            </button>
                          </div>
                        )}
                      </>
                    )}

                    {!(noteValue[index] == noteInfo.note) && (
                      <button
                        id={index}
                        className="save-button note-button"
                        onClick={handleSaveNotes}
                      >
                        <img src={saveIcon} />
                      </button>
                    )}
                  </div>
                }

                <div className="notes-details-container">
                  {clientUserData.notes[apiDoc._id][index].updatedAt &&
                    `Updated ${
                      updatedDate.getMonth() + 1
                    }/${updatedDate.getDate()}/${updatedDate.getFullYear()}`}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
