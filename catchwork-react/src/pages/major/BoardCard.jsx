import iconImg from "../../assets/icon.png";
// export default function BoardCard({ board }) {
//   return (
//     <div className="board-card">
//       <p className="profileImg">{board.memProfilePath}</p>
//       <p className="author">{board.memNickname}</p>
//       <p className="date">{board.boardWriteDate}</p>
//       <h3 className="title">{board.boardTitle}</h3>
//       <p className="content">{board.boardContent}</p>
//       <div className="meta">
//         👁 {board.boardReadCount} &nbsp;&nbsp; 💬 {board.commentCount}{" "}
//         &nbsp;&nbsp; ❤️ {board.likeCount}
//       </div>
//     </div>
//   );
// }

// profileImg 부분
export default function BoardCard({ board }) {
  return (
    <div className="board-card">
      <div className="board-card-left">
        <div className="profileImg">{board.memProfilePath}</div>
        <div className="board-card-content">
          <div className="author-date">
            <span className="author">{board.member.memNickname}</span>
            <span className="date">{board.boardWriteDate}</span>
          </div>
          <h3 className="title">{board.boardTitle}</h3>
          <p className="content">{board.boardContent}</p>
          <div className="meta">
            👁 {board.boardReadCount} &nbsp;&nbsp; 💬 {board.commentCount}{" "}
            &nbsp;&nbsp; ❤️ {board.likeCount}
          </div>
        </div>
      </div>
      <div className="board-card-logo">
        <img src={iconImg} alt="catchWork로고" />
      </div>
    </div>
  );
}
