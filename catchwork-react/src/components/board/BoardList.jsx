import BoardItem from "./BoardItem";
import BoardCss from "./BoardList.module.css";

export default function BoardList({ boards, memNo }) {
  return (
    <div className={BoardCss.boardList}>
      {boards.map((board) => (
        <BoardItem key={board.boardNo} board={board} memNo={memNo} />
      ))}
    </div>
  );
}
