export default function DocPostReplies(props) {
  const { post } = props;
  return (
    <>
      {post.replies &&
        post.replies.map((reply, index) => {
          const matches = reply.reply.match(/\n/g);
          let numbOfLinesForPost = 0;
          if (matches) {
            numbOfLinesForPost = matches.length;
          }
          const postHeight = 21 + 23 * numbOfLinesForPost;
          return (
            <div key={index} className="replies-container">
              <div className="post-container">
                <div className="author">{reply.author}</div>
                <textarea
                  style={{ height: `${postHeight}px` }}
                  readOnly
                  value={reply.reply}
                  className="fake-input-for-wrap"
                ></textarea>
              </div>
              <div className="under-post">
                <div className="actions-flex">
                  <div className="likes">Likes {post.likedBy.length}</div>
                </div>
                <div className="post-time">10 Hour(s) ago</div>
              </div>
            </div>
          );
        })}
    </>
  );
}
