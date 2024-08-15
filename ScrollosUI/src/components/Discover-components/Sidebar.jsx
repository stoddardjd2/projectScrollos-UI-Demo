import scrollosIcon from "../../assets/icon.svg";
import documentsIcon from "../../assets/sidebar-icons/documents.svg";
import projectsIcon from "../../assets/sidebar-icons/projects.svg";
import discussionsIcon from "../../assets/sidebar-icons/discussions.svg";
import notesIcon from "../../assets/sidebar-icons/notes.svg";
import settingsIcon from "../../assets/sidebar-icons/settings.svg";
import notificationsIcon from "../../assets/sidebar-icons/notifications.svg";
import userIcon from "../../assets/sidebar-icons/user.svg";
export default function Sidebar(props) {
  const { isOpen } = props;
  return (
    <div
      className="side-bar"
      style={
        !isOpen
          ? {
              width: "0px",
              // transform:"translate(-300px, 0)",
              transition: ".6s ease-in-out all",
            }
          : {
              transition: ".6s ease-in-out all",
            }
      }
    >
      <div className="scrollos-container">
        <img className="scrollos-icon" src={scrollosIcon} />
        <div className="scrollos-text-container">
          <div className="intro">Powered by</div>
          <div className="header">Project Scrollos</div>
        </div>
      </div>
      <div className="slider-container">
        <div className="slider-option selected">Personal</div>
        <div className="slider-option">Business</div>
      </div>
      <div className="sidebar-items-container">
        <div className="sidebar-item-container">
          <img src={documentsIcon} />
          <div className="sidebar-item"> Documents</div>
        </div>
        {/* <div className="sidebar-item-container">
          <img src={recentsIcon} />
          <div className="sidebar-item"> Recents</div>
        </div> */}
        <div className="sidebar-item-container">
          <img src={projectsIcon} />
          <div className="sidebar-item"> Projects</div>
        </div>
        <div className="sidebar-item-container">
          <img src={discussionsIcon} />
          <div className="sidebar-item"> Discussions</div>
        </div>
        <div className="sidebar-item-container">
          <img src={notesIcon} />
          <div className="sidebar-item"> Notes</div>
        </div>
        <div className="bottom-border"></div>
        {/* Account fields */}
        <div className="account-items-container">
          <div className="account-header">Account</div>
          <div className="settings">
            <div className="sidebar-item-container settings">
              <img src={settingsIcon} />
              <div className="sidebar-item"> Settings</div>
            </div>
          </div>
          <div className="notifications">
            <div className="sidebar-item-container notifications">
              <img src={notificationsIcon} />
              <div className="sidebar-item"> Notifications</div>
            </div>
          </div>
          <div className="user-info">
            <div className="user-info-container">
              <img className="user-icon" src={userIcon} />
              <div>
                <div className="username">Jared Stoddard</div>
                <div className="email">stoddardjd2@gmail.com</div>
              </div>
              <div className="ellipsis">...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
