import statusOnlineIcon from "../../../assets/statusOnline.svg";
import nameIcon from "../../../assets/contact/name.svg";
import addressIcon from "../../../assets/contact/address.svg";
import emailIcon from "../../../assets/contact/email.svg";
import warningIcon from "../../../assets/warning.svg";
import loadingIcon from "../../../assets/loading.svg";
import statusOfflineIcon from "../../../assets/statusOffline.svg";
import Server from "./Server";
import { useEffect, useState } from "react";
export default function InfoView(props) {
  const { getStyleForAction, apiDoc, action } = props;
  const [descriptionDropdown, setDescriptionDropdown] = useState(false);
  const [allStatus, setAllStatus] = useState([]);
  // get main status indicator based off each server ping status

  function getStatus() {
    if (allStatus) {
      const currentStatus = Object.keys(allStatus).map((key) => {
        if (allStatus[key] === false) return false;
        if (allStatus[key] === true) return true;
      });
      //return loading until all responses have been received and loaded
      //check if servers exists then display loading icon until all servers have been pinged and response is loaded
      if (apiDoc?.servers && apiDoc.servers.length === currentStatus.length) {
        if (currentStatus.includes(false) && currentStatus.includes(true)) {
          //if a server is offline for document
          return warningIcon;
        } else if (currentStatus.includes(true)) {
          return statusOnlineIcon;
        } else {
          return statusOfflineIcon;
        }
      } else {
        return loadingIcon;
      }
    }
  }

  return (
    <div
      className="info-action"
      style={
        action.active
          ? getStyleForAction("info-action")
          : {
              height: "0px",
              overflow: "hidden",
              transitionProperty: "all",
              transitionTimingFunction: "linear",
              transitionDuration: "0s",
              transitionDelay: ".15s",
            }
      }
    >
      {/* only render content if action type is info and active.
        Must be at this level so transitions work.
      */}
      {action.active && action.type === "info" && (
        <>
          <div className="type-status-container">
            <div className="open-api">
              OpenAPI <strong>v{apiDoc.openapi}</strong>
            </div>
            {/* if loading, rotate image effect */}

            <img
              className={
                getStatus() === loadingIcon
                  ? "loading status-icon"
                  : "status-icon"
              }
              src={getStatus()}
            />
          </div>
          <div className="description-container">
            {/* <div onClick={toggleDescriptionDropdown}>Show description</div> */}
            {!descriptionDropdown && (
              <div className="description">
                {apiDoc.info.description
                  ? apiDoc.info.description
                  : "No description"}
              </div>
            )}
          </div>
          <div className="servers-container">
            {/* Display plural or singular form of adress when needed */}
            <div className="key">
              {apiDoc.servers?.length > 1
                ? "Server addresses:"
                : "Server address:"}
            </div>
            <div className="value">
              {apiDoc.servers
                ? apiDoc.servers.map((server, index) => (
                    <Server
                      key={index}
                      server={server}
                      setAllStatus={setAllStatus}
                      allStatus={allStatus}
                      index={index}
                    />
                  ))
                : "NONE"}
            </div>
          </div>

          <div className="extra-info-container">
            <div className="item-container">
              <div className="key">Version:</div>
              <div className="version">{apiDoc.info.version}</div>
            </div>
            <div className="item-container">
              <div className="key">Created on:</div>
              <div>8/11/2024</div>
            </div>
            <div className="item-container">
              <div className="key">Updated on:</div>
              <div>8/11/2024</div>
            </div>
          </div>
        </>
      )}
      {/* <div className="contact-container">
      <div className="contact-item-container">
        <img className="contact-icon" src={nameIcon} />
        <div className="contact-item">
          {apiDoc.info.contact?.name ? apiDoc.info.contact.name : "NONE"}
        </div>
      </div>

      <div className="contact-item-container">
        <img className="contact-icon" src={addressIcon} />
        <div className="contact-item">{apiDoc.info.contact?.url}</div>
      </div>

      <div className="contact-item-container">
        <img className="contact-icon" src={emailIcon} />
        <div className="contact-item">{apiDoc.info.contact?.email}</div>
      </div>
    </div> */}
    </div>
  );
}
