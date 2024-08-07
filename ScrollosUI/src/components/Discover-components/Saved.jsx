import { useEffect, useState } from "react";

export default function Saved(props) {
  const {clientUserData } = props;
  const bookmarkIds = clientUserData.bookmarks
  const [bookmarkDocs, setBookmarkDocs]= useState()
  // const [bookmarks, setBookmarks] = useState();

  useEffect(() => {
    fetch(`http://localhost:3001/read/ids/4`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookmarkIds),
    })
      .then((results) => results.json())
      .then((docs) => {
        setBookmarkDocs(docs);
      });
  }, []);

  //redirect using selection id for api doc viewer
  function handleClick(e) {
    const selectedApiID = e.target.id;
    window.location.href = `/ApiDocViewer/${selectedApiID}`;
  }

  let apiTitles;
  if (bookmarkDocs) {
    apiTitles = bookmarkDocs.map((bookmarkDoc, index) => {
      return (
        <div key={index} id={bookmarkDoc._id} onClick={handleClick}>
          {bookmarkDoc.info.title}
        </div>
      );
    });
  }
  return (
    apiTitles && <div className="sidebar--saved-container">{apiTitles}</div>
  );
}
