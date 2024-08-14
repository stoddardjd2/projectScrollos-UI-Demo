export default function ActionButton(props) {
  const { img, handleAction, type, action } = props;
  return (
    <div
      className={
        action.type === type ? "active-container container" : "inactive-container container"
      }
    >
      <img
        id={type}
        src={img}
        onClick={handleAction}
        className={
          action.type === type ? "active action-icon" : "inactive action-icon"
        }
      />
    </div>
  );
}
