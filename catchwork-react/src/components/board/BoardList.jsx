import BoardItem from "./BoardItem";
import BoardCss from "./BoardList.module.css";

export default function BoardList({ boards }) {
  return (
    <div className={BoardCss.boardList}>
      {Array.isArray(boards) && boards.length === 0 ? (
        <p className={BoardCss.emptyMessage}>게시글이 없습니다.</p>
      ) : (
        boards.map((board, index) => <BoardItem key={index} board={board} />)
      )}
    </div>
  );
}
