import { useState } from "react";
import rowColumnIcon from "../../assets/row-column.svg";
import viewTypeIcon from "../../assets/document-view-selector-icons/viewType.svg";
import cardsIcon from "../../assets/document-view-selector-icons/cards.svg";
import rowsIcon from "../../assets/document-view-selector-icons/rows.svg";
import cardsV2Icon from "../../assets/document-view-selector-icons/cardsV2.svg";
import gridIcon from "../../assets/document-view-selector-icons/grid.svg";
export default function DocumentViewSelector(props) {
  const { clientUserData, setRightColumnDisplay, setClientUserData } = props;
  const [isViewClicked, setIsViewClicked] = useState(false);
  function handleViewSelection(e) {
    const viewId = e.currentTarget.id;

    //save last view option to defaul to on start
    fetch(`http://localhost:3001/updateLastViewMode/${clientUserData._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ viewMode: viewId }),
    })
      .then((results) => results.json())
      .then((res) => {
        console.log("res", res);
        // mongodb sends back array of documents in order of first in their database-
        //must sort their response to match with our array that was sent(for recents to work)
      });

    console.log("setting view", viewId);
    setIsViewClicked(false);
    setRightColumnDisplay(viewId);
    // switch (id) {
    //   case "cards":
    //     console.log("cards!");
    //     break;
    //   case "rows":
    //     console.log("rows!");
    //     break;
    //   case "cards-v2":
    //     console.log("cards-v2!");
    //     break;
    // }
  }
  return (
    <button className="document-view-selector">
      <div
        onClick={() => {
          setIsViewClicked(!isViewClicked);
        }}
        className="view-filter-btn"
      >
        <img src={viewTypeIcon} />
        View

      </div>
      {isViewClicked && (
        <div className="bottom-popup">
          <div className="bottom-popup-container">
            {/* <div
              onClick={handleViewSelection}
              className="bottom-popup-item-container"
              id="cards"
            >
              <img src={cardsIcon} />
              <div>Cards</div>
            </div> */}
            <div
              onClick={handleViewSelection}
              className="bottom-popup-item-container"
              id="rows"
            >
              <img src={rowsIcon} />
              <div>Rows</div>
            </div>
            <div
              onClick={handleViewSelection}
              className="bottom-popup-item-container"
              id="cards-v2"
            >
              <img src={gridIcon} />
              <div>Grid</div>
            </div>
          </div>
          <div className="triangle"></div>
        </div>
      )}
    </button>
  );
}
