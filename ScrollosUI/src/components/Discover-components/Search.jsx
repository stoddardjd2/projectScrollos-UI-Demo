import searchIcon from "../../assets/search.svg";
import clearIcon from "../../assets/x.svg";
import { useState } from "react";
export default function Search(props) {
  const { setDisplayApiDocs, allApiDocs, apiDocsDisplay } = props;
  const [search, setSearch] = useState("");

  function handleInput(e){
    const value = e.target.value
    console.log("serach update:", value)
    setSearch(value);
  }

  async function handleSearch(e) {
    e.preventDefault();
    //update display with search query results
    console.log("serach!");
    await fetch(`http://localhost:3001/search/title/${search}`)
      .then((res) => res.json())
      .then((data) => setDisplayApiDocs(data));
  }

  // function handleActiveSearch(e) {
  //   console.log("handling serach");
  //   const searchText = e.target.value;
  //   setSearch(searchText);

  //   let matches = [];
  //   if (!(searchText == "")) {
  //     apiDocsDisplay.map((apiDoc) => {
  //       if (
  //         apiDoc.info.title.toLowerCase().includes(searchText.toLowerCase())
  //       ) {
  //         matches.push(apiDoc);
  //       }
  //     });
  //     //update display to show search matches
  //     setDisplayApiDocs(matches);
  //   } else {
  //     //if search is empty:

  //     setDisplayApiDocs(allApiDocs);
  //   }
  // }

  function handleReset() {
    //reset search
    setSearch("");
    setDisplayApiDocs(allApiDocs);
  }
  return (
    <>
      {/* <label htmlFor="searchbox" className="hidden">
        Search box
      </label> */}
      <div className="search--container">
        {/* display reset button if search has text input */}
        {
          <img
            style={{ visibility: search ? "visible" : "hidden"}}
            onClick={handleReset}
            className="clear--icon search-box-icon"
            src={clearIcon}
          />
        }
        <form className="search-form" onSubmit={handleSearch}>
          <input
            value={search}
            // onChange={handleActiveSearch}
            onChange={handleInput}
            className="search--searchbox"
            placeholder="Find API document"
            id="searchbox"
          ></input>
        </form>
        <button onClick={handleSearch} className="search--button">
          {<img className="search--icon search-box-icon" src={searchIcon} />}
        </button>
      </div>
    </>
  );
}
