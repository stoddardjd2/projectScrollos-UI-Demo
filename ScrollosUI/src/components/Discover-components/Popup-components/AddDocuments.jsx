import { useEffect, useState } from "react";
import loadingIcon from "../../../assets/loading.svg";
import uncheckedIcon from "../../../assets/emptyCheckbox.svg";
import checkedIcon from "../../../assets/checked.svg";
import searchIcon from "../../../assets/search.svg";
export default function AddDocuments(props) {
  const { clientUserData, currentProject, setLoadedProjects, selectedProject } =
    props;
  const [loadedDocs, setLoadedDocs] = useState([]);
  const [searchInput, setSearchInput] = useState();
  const [loadedRecentDocs, setLoadedRecentDocs] = useState();
  const [loadedCurrentProject, setLoadedCurrentProject] =
    useState(currentProject);
  useEffect(() => {
    //get 5 most recent docs to display and load those docs using id
    const recentsCopy = [...clientUserData.recents];
    const recentDocsLimit = recentsCopy.splice(0, 5);

    fetch(`http://localhost:3001/read/ids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recentDocsLimit),
    })
      .then((results) => results.json())
      .then((res) => {
        setLoadedDocs(res);
        setLoadedRecentDocs(res);
      });
  }, []);

  async function handleSearchSubmit(e) {
    //update display with search query results
    if (e.target.value) {
      await fetch(
        `http://localhost:3001/search/title/getInfo/${e.target.value}`
      )
        .then((res) => res.json())
        .then((data) => {
          let idsArray = [];
          data.map((objId) => {
            idsArray.push(objId._id);
          });
          setLoadedDocs(data);
        });
    }
  }

  function handleSearch(e) {
    setSearchInput(e.target.value);
    if (e.target.value.length === 0) {
      // if search empty
      setLoadedDocs(loadedRecentDocs);
      //reset to original preview of recent docs
    }
  }

  function handleRemoveFromProject(e) {
    const docId = e.currentTarget.id;
    const index = loadedCurrentProject.documentIds.indexOf(docId);
    setLoadedCurrentProject((prev) => {
      let docIdsCopy = prev.documentIds;
      docIdsCopy.splice(index, 1);
      return { ...prev, documentIds: docIdsCopy };
    });
    //will remove or add to project depending on if is or is not included already
    fetch(
      `http://localhost:3001/removeDocFromProject/${loadedCurrentProject._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docId: docId }),
      }
    ).then(() => {});
  }

  function handleAddToProject(e) {
    const docId = e.currentTarget.id;
    setLoadedCurrentProject((prev) => {
      let docIdsCopy = [...prev.documentIds];
      docIdsCopy.push(docId);
      return { ...prev, documentIds: docIdsCopy };
    });
    //will remove or add to project depending on if is or is not included already
    fetch(`http://localhost:3001/addDocToProject/${loadedCurrentProject._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ docId: docId }),
    }).then(() => {});
  }

  return (
    <div className="add-documents-popup">
      <div
        //   onSubmit={handleSearchSubmit}
        className="search-container"
      >
        <input
          onChange={handleSearchSubmit}
          placeholder="Find API document"
          //   value={searchInput}
        ></input>
        <img
          //   onClick={handleSearchSubmit}
          className="search-icon"
          src={searchIcon}
        />
      </div>

      {loadedDocs.length > 0 ? (
        <>
          {loadedDocs.map((doc, index) => {
            if (index <= 6) {
              //limit amount of members to display on search (current is 6)
              const isChecked = loadedCurrentProject.documentIds.includes(
                doc._id
              );
              //check if dispayed document is added to project already
              return (
                <div
                  key={index}
                  id={doc._id}
                  onClick={
                    isChecked ? handleRemoveFromProject : handleAddToProject
                  }
                  className="doc-item-container"
                >
                  <div className="document-item">{doc.info.title}</div>

                  <img
                    className="checkbox-icon"
                    src={isChecked ? checkedIcon : uncheckedIcon}
                  />
                </div>
              );
            }
          })}
        </>
      ) : (
        <>
          {!searchInput && (
            <img className="add-docs-loading-placeholder" src={loadingIcon} />
          )}
        </>
      )}
      {
        //if no documents found for search:
        loadedDocs.length === 0 && searchInput && <div>No docs found</div>
      }
    </div>
  );
}
