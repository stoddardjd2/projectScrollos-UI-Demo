import React, { useState, useRef } from "react";

const AddDocsPopover = () => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const buttonRef = useRef(null);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };

  return (
    <div>
      <button
        ref={buttonRef}
        onClick={togglePopup}
        style={{ position: "relative" }}
      >
        Click me
        
      {isPopupVisible && (
        <div
          style={{
            position: "absolute",
            top: buttonRef.current?.offsetHeight + 30 || 0,
            left: 0,
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            padding: "10px",
            zIndex: 1000,
          }}
        >
          This is a popup!
        </div>
      )}
      </button>

    </div>
  );
};

export default AddDocsPopover;
