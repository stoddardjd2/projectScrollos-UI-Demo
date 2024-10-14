import { useState } from "react";
import Search from "./Search";
import UserSettingsBar from "./UserSettingsBar";

export default function MainHeader(props) {
  const { setActive, allDocIds, clientUserData, isInDiscover } = props;
  const [isSettings, setIsSettings] = useState();

  return (
    <div className="search-bar">
      <div
        className="header"
        onClick={() => {
          window.location.href = `/discover/${clientUserData._id}`;
        }}
      >
        API Library
      </div>
      {/* <img src={walgreensLogo} /> */}

      {/* <div style={{display:"flex", alignItems: "center"}}> */}
      <Search
        setActive={setActive}
        allDocIds={allDocIds}
        clientUserData={clientUserData}
        isInDiscover={isInDiscover}
      />
      <UserSettingsBar
        clientUserData={clientUserData}
        isSettings={isSettings}
        setIsSettings={setIsSettings}
      />
    </div>
  );
}
