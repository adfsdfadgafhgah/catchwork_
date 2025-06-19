export default function BoardCard({ board }) {
  return (
    <div className="board-card">
      <p className="author">{board.member?.memNickname || "익명"}</p>
      <p className="date">{board.boardWriteDate}</p>
      <h3 className="title">{board.boardTitle}</h3>
      <p className="content">{board.boardContent}</p>
      <div className="meta">
        👁 {board.boardReadCount} &nbsp;&nbsp; {board.commentCount} &nbsp;&nbsp;{" "}
        {board.likeCount}
      </div>
    </div>
  );
}
