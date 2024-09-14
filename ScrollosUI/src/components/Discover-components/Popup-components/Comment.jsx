import replyIcon from "../../../assets/comments/reply.svg";
import likedIcon from "../../../assets/comments/like.svg";
import notLikedIcon from "../../../assets/comments/notLiked.svg";
import { useState } from "react";
import InputComment from "./InputComment";
import Reply from "./Reply";
export default function Comment(props) {
  const { projects, setClientUserData, name, text, time, likes, replies } =
    props;
  const [isLiked, setIsLiked] = useState(false);
  const [isReply, setIsReply] = useState(false);
  //   const [isReplyComment, setIsReplyComment] = useState({});
  const [replyInputValue, setReplyInputValue] = useState();

  function handleLike() {
    setIsLiked(!isLiked);
    // fetch(`http://localhost:3001/getProjectsByGroup/${clientUserData.group}`, {
    //   method: "GET",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // })
    //   .then((res) => res.json())
    //   .then((json) => {
    //     setLoadedProjects(json[0].projects);
    //     setInputValue(json[0].projects[currentProjIndex]);
    //   })
  }
  function handleReply() {
    setIsReply(!isReply);
  }

  return (
    <div>
      <div className="comment-container">
        <div className="comment">
          <strong className="name">{name}</strong>
          <br />
          <div className="comment-text">{text}</div>
        </div>
        <div className="actions-container">
          <div className="subactions-container">
            <div onClick={handleLike} className="action-number-container">
              <img src={isLiked ? likedIcon : notLikedIcon} />
              <div>{isLiked ? likes + 1 : likes}</div>
            </div>
            <div onClick={handleReply} className="action-number-container">
              <img src={replyIcon} />
              <div>{Object.keys(replies).length}</div>
            </div>
          </div>

          <div className="time">{time} Hour(s) ago</div>
        </div>
      </div>
      {isReply && (
        <>
          {" "}
          {replies.map((reply, index) => {
            return (
              <Reply
                reply={reply}
                key={index}
                setReplyInputValue={setReplyInputValue}
              />
            );
          })}
          <div className="input-comment-container reply-input">
            <input
              className="input-comment"
              placeholder="reply..."
              value={replyInputValue}
              onChange={(e) => {
                setReplyInputValue(e.target.value);
              }}
            ></input>
            {replyInputValue && (
              <div className="reply-container">
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
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
