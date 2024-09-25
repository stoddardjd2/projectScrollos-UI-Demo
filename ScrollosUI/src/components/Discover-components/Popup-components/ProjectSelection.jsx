import personIcon from "../../../assets/project-icons/person.svg";
import messageIcon from "../../../assets/project-icons/message.svg";
import documentIcon from "../../../assets/project-icons/document.svg";
import notificationIcon from "../../../assets/project-icons/notification.svg";
import settingsIcon from "../../../assets/project-icons/settings.svg";
export default function ProjectSelection(props) {
  const { handleProjectSelection, loadedProjects } = props;
  console.log("loaded", loadedProjects);

  const loadedProjectsElements = loadedProjects.map((project, index) => {
    return (
      <div
        onClick={handleProjectSelection}
        id={index}
        key={index}
        className="inner-card-flex existing-project"
      >
        <div className="project-card-grid">
          <div className="grid-item-container">
            <img className="project-item-icon" src={personIcon} />
            <div>{project.members.joined.length}</div>
          </div>

          <div className="grid-item-container">
            <img className="project-item-icon" src={messageIcon} />
            <div>{project.discussions.length}</div>
          </div>

          <div className="grid-item-container">
            <img className="project-item-icon" src={documentIcon} />
            <div>{project.documentIds.length}</div>{" "}
          </div>

          <div className="grid-item-container">
            <img className="project-item-icon" src={notificationIcon} />

            <div>?</div>
          </div>
        </div>
        <div className="project-info-container">
          <div className="project-title">{project.id}</div>
          <div className="exra-info-container">
            <div className="project-extra-info">Updated 9/24/24</div>
            <img className="project-settings-icon" src={settingsIcon} />
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="project-selection">
      <h3 className="select-project-header">Select a Project</h3>
      <div className="project-selection-grid">
        <div className="inner-card-flex">
          <div className="new-project-card">
            <svg
              width="40"
              height="50"
              viewBox="0 0 50 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.25 28.3333H0V21.25H21.25V0H28.3333V21.25H49.5833V28.3333H28.3333V49.5833H21.25V28.3333Z"
                fill="#FEF7FF"
              />
            </svg>
          </div>
          <div className="project-info-container">
            <div className="project-title">New Project</div>
          </div>
          {/* <div className="project-extra-info">Updated 9/24/24</div> */}
        </div>
        {loadedProjectsElements}{loadedProjectsElements}{loadedProjectsElements}{loadedProjectsElements}{loadedProjectsElements}{loadedProjectsElements}
      </div>

      {/*       
      <div className="project-selection">
        <div className="project-selection-header">Select a project</div>
        <div onClick={handleProjectSelection} className="projects-list">
          {loadedProjects.map((project, index) => {
            return (
              <div className="project-option" key={index} id={index}>
                {project.id}
              </div>
            );
          })}
        </div>
      </div> */}
    </div>
  );
}
