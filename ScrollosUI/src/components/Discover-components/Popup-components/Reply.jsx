import { useState } from "react";
import replyIcon from "../../../assets/comments/reply.svg";
import likedIcon from "../../../assets/comments/like.svg";
import notLikedIcon from "../../../assets/comments/notLiked.svg";
export default function Reply(props) {
  const { reply } = props;
  const [isReplyLiked, setIsReplyLiked] = useState();

  function handleReplyLiked() {
    setIsReplyLiked(!isReplyLiked);
  }
  console.log("reply!", reply);
  return (
    <div className="reply">
      <div className="comment-container">
        <div className="comment">
          <strong className="name">{reply.name}</strong>
          <br />
          <div className="comment-text">{reply.reply}</div>
        </div>
        <div className="actions-container">
          <div className="subactions-container">
            <div onClick={handleReplyLiked} className="action-number-container">
              <img src={isReplyLiked ? likedIcon : notLikedIcon} />
              <div>{isReplyLiked ? reply.likes + 1 : reply.likes}</div>
            </div>
            <div
              //   onClick={(e) => {
              //     // const name = projects[0].discussions[index].name;
              //     const name = reply.name;
              //     setReplyInputValue("@" + name);
              //   }}
              className="action-number-container"
            >
              {/* <img src={replyIcon} /> */}
              {/* {Object.keys(replies).length} */}
            </div>
          </div>

          {/* {isReplyComment[index] && <InputComment />
} */}
          <div className="time">{reply.timePosted.time} Hour(s) ago</div>
        </div>
      </div>
    </div>
  );
}
