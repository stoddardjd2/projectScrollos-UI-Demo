import { useState, useEffect } from "react";
import offlineIcon from "../../../assets/offline.svg";
import onlineIcon from "../../../assets/online.svg";
import loadingIcon from "../../../assets/loading.svg";
export default function Server(props) {
  const { server, setAllStatus, allStatus, index } = props;
  useEffect(() => {

    const pingServer = async () => {
      console.log("pinging server");
      try {
        const response = await fetch(server.url, {
          method: "GET",
        });
        if (response) {
          setAllStatus((prev) => ({ ...prev, [index]: true }));
        } else {
          setAllStatus((prev) => ({ ...prev, [index]: false }));
        }
      } catch (error) {
        setAllStatus((prev) => ({ ...prev, [index]: false }));
      }
    };

    pingServer();
  }, []);

  function loadStatus() {
    if (allStatus) {
      return allStatus[index] ? onlineIcon : offlineIcon;
    } else {
      //placeholder while waiting for ping to server to get status
      return loadingIcon;
    }
  }

  return (
    <>
      <div className="server-container">
        <img
          className="status"
          src={loadStatus()}
        />
        <div className="server-address">{server.url}</div>
      </div>
    </>
  );
}
