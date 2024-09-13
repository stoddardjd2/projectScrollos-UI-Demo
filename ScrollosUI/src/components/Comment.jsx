import replyIcon from "../assets/comments/reply.svg";
import likedIcon from "../assets/comments/like.svg";
import notLikedIcon from "../assets/comments/notLiked.svg";
import { useState } from "react";
import InputComment from "./Discover-components/Popup-components/InputComment";
export default function Comment(props) {
  const {
    clientUserData,
    setClientUserData,
    name,
    text,
    time,
    likes,
    replies,
    setReplyInputValue
  } = props;
  const [isLiked, setIsLiked] = useState(false);
  const [isReply, setIsReply] = useState(false);
  const [isReplyLiked, setIsReplyLiked] = useState({});
//   const [isReplyComment, setIsReplyComment] = useState({});

  function handleLike() {
    setIsLiked(!isLiked);
  }
  function handleReply() {
    setIsReply(!isReply);
    
  }

  //sub-component
  function Reply() {
    function handleReplyLiked(e) {
      const index = e.currentTarget.id;
      setIsReplyLiked({ ...isReplyLiked, [index]: !isReplyLiked[index] });
    }
 
    return replies.map((reply, index) => {
      return (
        <div key={index} className="reply">
          <div className="comment-container">
            <div className="comment">
              <strong className="name">{reply.name}</strong>
              <br />
              <div className="comment-text">{reply.reply}</div>
            </div>
            <div className="actions-container">
              <div className="subactions-container">
                <div
                  id={index}
                  onClick={handleReplyLiked}
                  className="action-number-container"
                >
                  <img src={isReplyLiked[index] ? likedIcon : notLikedIcon} />
                  {likes}
                </div>
                <div
                  id={index}
                  onClick={(e)=>{
                    const name = clientUserData.projects[0].discussions[index].name
                    setReplyInputValue("@"+name)
                  }}
                  className="action-number-container"
                >
                  <img src={replyIcon} />
                  {/* {Object.keys(replies).length} */}
                </div>
              </div>

              {/* {isReplyComment[index] && <InputComment />
} */}
              <div className="time">{time} Hour(s) ago</div>
            </div>
          </div>
        </div>
      );
    });
  }

  return (
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
            {likes}
          </div>
          <div onClick={handleReply} className="action-number-container">
            <img src={replyIcon} />
            {Object.keys(replies).length}
          </div>
        </div>

        <div className="time">{time} Hour(s) ago</div>
      </div>
      {isReply && <Reply />}
    </div>
  );
}
