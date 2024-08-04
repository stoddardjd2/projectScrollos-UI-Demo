import { useEffect } from "react";

export default function Saved(props) {
  const { setBookmarks, bookmarks, userId, userData } = props;

  //send bookmark ids array to server to get their api info
  useEffect(() => {
    fetch(`http://localhost:3001/read/ids/5`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        Ids: userData.bookmarks,
      },
    })
      .then((results) => results.json())
      .then((docs) => {
        console.log("setting!");
        setBookmarks(docs);
      });
  }, []);
  

  //   useEffect(() => {
  //     fetch(`http://localhost:3001/user/${userId}/get/bookmarks/5`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //       .then((results) => results.json())
  //       .then((docs) => {
  //         console.log("setting!");
  //         setBookmarks(docs);
  //       });
  //   }, []);

  let apiTitles;
  if (bookmarks) {
    console.log("bookmarks");
    console.log(bookmarks);

    apiTitles = bookmarks.map((bookmark) => {
      return <div>{bookmark.info.title}</div>;
    });
  }
  console.log("apiTitles");
  console.log(apiTitles);
  return <div>{apiTitles && apiTitles}</div>;
}
