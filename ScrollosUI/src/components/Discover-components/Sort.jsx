import { useEffect, useState } from "react";
import refreshIcon from "../../assets/refresh.svg";

export default function Sort(props) {
  const { setDisplayApiDocs, clientUserData, allApiDocs } = props;
  const [sort, setSort] = useState("sortby");
  function handleSelection(e) {
    const value = e.target.value;
    setSort(value);
  }
  function resetSearch() {
    setSort("sortby");
    setDisplayApiDocs(allApiDocs);
  }

  useEffect(() => {
    if (!(sort == "sortby")) {
      let idsArray = [];
      switch (sort) {
        case "bookmarked":
          idsArray = clientUserData.bookmarks;
          break;
        //
        case "recent":
          idsArray = clientUserData.recents;
          break;
        case "flagged":
            idsArray = clientUserData.flags;
      }
      //fetch with array corresponding to sort type
      fetch(`http://localhost:3001/read/ids/${10}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(idsArray),
      })
        .then((results) => results.json())
        .then((docs) => {
          setDisplayApiDocs(docs);
        });
    }
  }, [sort]);

  return (
    <div className="sort">
      <div className="sort--container">
        <div className="sort--dropdown-container">
          <select
            onChange={handleSelection}
            id="selection"
            className="sort--selection"
            value={sort}
          >
            <option className="sort--sortby-option" value="sortby" hidden>
              &#8644; Sort by:
            </option>
            <option value="recent">Recent</option>
            <option value="flagged">Flagged</option>
            <option value="bookmarked">Bookmarked</option>
          </select>
        </div>
        <button onClick={resetSearch} className="sort--button-refresh">
          <a href="http://"></a>
          <img className="sort--button-refresh-icon" src={refreshIcon}></img>
        </button>
      </div>
    </div>
  );
}
