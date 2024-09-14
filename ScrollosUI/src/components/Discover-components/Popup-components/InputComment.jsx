import { useState } from "react";
export default function InputComment(props) {
  const { inputRef } = props;
  function handleAddReply() {}

  return (
    <div className="input-comment-container">
      <input
        ref={inputRef}
        className="input-comment"
        placeholder="add a comment..."
        value={replyInputValue}
        onChange={(e) => {
          setReplyInputValue(e.target.value);
        }}
      ></input>
      {replyInputValue && (
        <div onClick={handleAddReply} className="reply-container">
          <svg
            style={{ cursor: "pointer" }}
            width="24"
            height="24"
            viewBox="0 0 192 128"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M181.333 117.333V104.533C181.333 86.6112 181.333 77.6512 177.845 70.8054C174.778 64.784 169.883 59.8891 163.861 56.8214C157.015 53.3334 148.055 53.3334 130.133 53.3334H10.6667M10.6667 53.3334L53.3333 10.6667M10.6667 53.3334L53.3333 96"
              stroke="#1D1B20"
              stroke-width="21.3333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {/* <div>Reply</div> */}
        </div>
      )}
    </div>
  );
}
