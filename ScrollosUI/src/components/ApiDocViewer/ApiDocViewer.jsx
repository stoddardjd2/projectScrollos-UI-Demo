import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ApiDocViewer.css";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import Contact from "./Contact";
import DocDiscussionsHome from "../Discover-components/DocDiscussionsHome";
import Details from "./About/Details";
import Notes from "./About/Notes";
import detailsIcon from "../../assets/ApiDocViewer-Icons/about-icons/details.svg";
import contactIcon from "../../assets/ApiDocViewer-Icons/about-icons/contact.svg";
import notesIcon from "../../assets/ApiDocViewer-Icons/about-icons/notes.svg";
import reviewsIcon from "../../assets/ApiDocViewer-Icons/about-icons/reviews.svg";
import messageIcon from "../../assets/cards-v2-icons/messageWhite.svg";
import expandIcon from "../../assets/ApiDocViewer-Icons/expand.svg";
import shrinkIcon from "../../assets/ApiDocViewer-Icons/shrink.svg";
import MainHeader from "../Discover-components/MainHeader";
export default function ApiDocViewer() {
  // const [apiDocsViewer, setApiDocsViewer] = useState(null);
  const { apiDoc, userData } = useLoaderData();

  const [clientUserData, setClientUserData] = useState(userData);
  const [aboutOptionSelection, setAboutOptionSelection] = useState(0);
  const [isSwaggerExpanded, setIsSwaggerExpanded] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  function handleExit() {
  }
  const aboutOptions = [
    {
      name: "Details",
      elements: <Details clientUserData={clientUserData} apiDoc={apiDoc} />,
      icon: detailsIcon,
    },
    {
      name: "Contact",
      elements: <Contact apiDoc={apiDoc} />,
      icon: contactIcon,
    },
    {
      name: "Discussions",
      elements: (
        <DocDiscussionsHome
          apiDoc={apiDoc}
          clientUserData={clientUserData}
          handleExit={handleExit}
        />
      ),
      icon: messageIcon,
    },
    {
      name: "Notes",
      elements: (
        <Notes
          apiDoc={apiDoc}
          setClientUserData={setClientUserData}
          clientUserData={clientUserData}
        />
      ),
      icon: notesIcon,
    },
    // { name: "Reviews", elements: <Notes />, icon: reviewsIcon },
  ];
  return (
    <div className="apiDocViewer-main-container">
      <MainHeader clientUserData={clientUserData} isInDiscover={false} />
      <div className="apiDocViewer-sub-container">
        <div
          style={
            isSwaggerExpanded
              ? {
                  gridTemplateAreas: `"swagger-ui-item swagger-ui-item swagger-ui-item swagger-ui-item swagger-ui-item swagger-ui-item"
      "swagger-ui-item swagger-ui-item swagger-ui-item swagger-ui-item swagger-ui-item swagger-ui-item"`,
                }
              : isAboutExpanded
              ? {
                  gridTemplateAreas: `"about about about about about about"
              "about about about about about about"`,
                }
              : {}
          }
          className="grid-container"
        >
          {!isSwaggerExpanded && (
            <div className="about-item main-item">
              <button
                onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                className="expand"
              >
                <img src={!isAboutExpanded ? expandIcon : shrinkIcon} />
              </button>
              <div className="about-header-container">
                <h1 className="about-header">About</h1>
                <div className="about-options">
                  {aboutOptions.map((option, index) => {
                    return (
                      <button
                        key={index}
                        id={index}
                        style={
                          aboutOptionSelection == index
                            ? {
                                filter:
                                  " brightness(0) saturate(100%) invert(80%) sepia(12%) saturate(3642%) hue-rotate(182deg) brightness(101%) contrast(91%)",
                              }
                            : {}
                        }
                        onClick={(e) => {
                          setAboutOptionSelection(e.currentTarget.id);
                        }}
                        className="option-container"
                      >
                        <img src={option.icon} />
                        <div>View</div>
                        <div>{option.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="border"></div>
              <div className="about-content-container">
                {aboutOptions[aboutOptionSelection].elements}
              </div>
              {/* use selection to display about option: */}
            </div>
          )}
          {!isAboutExpanded && (
            <div className="swagger-ui-item main-item">
              <button
                onClick={() => setIsSwaggerExpanded(!isSwaggerExpanded)}
                className="expand"
              >
                <img src={!isSwaggerExpanded ? expandIcon : shrinkIcon} />
              </button>
              <SwaggerUI spec={apiDoc} />;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
