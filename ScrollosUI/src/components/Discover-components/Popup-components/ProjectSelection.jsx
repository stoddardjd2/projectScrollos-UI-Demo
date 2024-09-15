export default function ProjectSelection(props) {
  const { selectedProject, handleProjectSelection, loadedProjects } = props;
  return (
    <div>
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
      </div>
    </div>
  );
}
