import { useState } from "react";

export default function UploadDocument() {
  const [isPopup, setIsPopup] = useState(false);
  return (
    <div className="upload-doc-container">
      <button
        onClick={() => setIsPopup((prev) => setIsPopup(!prev))}
        className="upload-doc-button"
      >
        Upload
      </button>
      {isPopup && (
        <div onClick={()=>setIsPopup(false)} className="upload-popup-container">
          <div className="upload-popup-content-container">test</div>
        </div>
      )}
    </div>
  );
}
