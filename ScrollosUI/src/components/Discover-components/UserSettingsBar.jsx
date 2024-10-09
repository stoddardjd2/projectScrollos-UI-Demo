import { useEffect, useState } from "react";
import userIcon from "../../assets/sidebar-icons/user.svg";

export default function UserSettingsBar(props) {
  const { clientUserData, isSettings, setIsSettings } = props;
  //   const [isHovering, setIsHovering] = useState(false);

  function handleSettingsClick() {
    setIsSettings(!isSettings);

    // setIsHovering(true)
  }
  function handleClickOutside() {
    console.log("outside click!");
  }

  //   function handleHoverPopup() {
  //     console.log("hovering over popup");
  //     setIsHovering(true);
  //   }
  //   function handleHoverLeavePopup() {
  //     console.log("hover leave");
  //     setIsHovering(false);
  //   }
  return (
    <div>
      <div className="user-info-container">
        <img className="user-icon" src={userIcon} />
        <div className="flex">
          <div className="username">
            {clientUserData.username.toUpperCase()}
          </div>
          <div className="email">{"email@gmail.com"}</div>
        </div>
        <div
          id="userSettings"
          onClick={handleSettingsClick}
          className="ellipsis"
        >
          ...
        </div>
      </div>
      {/* Popup here */}
      {isSettings && (
        <div
          //   onMouseOver={handleHoverPopup}
          //   onMouseLeave={handleHoverLeavePopup}
          className="user-settings-popup"
        >
          <div className="triangle"></div>
          <div className="content">
            <div
              onClick={() => {
                window.location.href = `/`;
              }}
            >
              Logout
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
