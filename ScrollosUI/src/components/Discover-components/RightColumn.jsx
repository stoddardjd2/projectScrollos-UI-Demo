import { useState } from "react";
import developmentImg from "../../assets/developmentPlaceholder.svg";
import Projects from "./Right-column-sub-components/Projects";
export default function RightColumn(props) {
  const { docCards, apiDocsDisplay, rightColumnDisplay } = props;

  function getRightColumnDisplay() {
    switch (rightColumnDisplay) {
      case "documents":
        // OVERRIDE TO ALWAYS DISPLAY DOCUMENTS VVV
      case rightColumnDisplay:

        return (
          <div className="card-grid">
            {/* if no search results */}
            {!(apiDocsDisplay.length === 0) ? (
              <>
                {docCards}
              </>
            ) : (
              <div className="no-results">NO RESULTS</div>
            )}
          </div>
        );
      case "projects":
        return (
          <img
            src={"https://fakeimg.pl/1700x1000?text=In+Development"}
            style={{ width: "100%", height: "100%" }}
          />
          // <Projects />;
        );
      case "discussions":
        return (
          <img
            src={"https://fakeimg.pl/1700x1000?text=In+Development"}
            style={{ width: "100%", height: "100%" }}
          />
        );
      case "notes":
        return (
          <img
            src={"https://fakeimg.pl/1700x1000?text=In+Development"}
            style={{ width: "100%", height: "100%" }}
          />
        );
      case "settings":
        return (
          <img
            src={"https://fakeimg.pl/1700x1000?text=In+Development"}
            style={{ width: "100%", height: "100%" }}
          />
        );
      case "notifications":
        return (
          <img
            src={"https://fakeimg.pl/1700x1000?text=In+Development"}
            style={{ width: "100%", height: "100%" }}
          />
        );
    }
  }

  return <div className="right-column">{getRightColumnDisplay()}</div>;
}
