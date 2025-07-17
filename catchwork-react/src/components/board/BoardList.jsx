import BoardItem from "./BoardItem";
import styles from "./BoardList.module.css";

export default function BoardList({ boards, memNo }) {
  return (
    <div className={styles.boardList}>
      {boards.map((board) => (
        <BoardItem key={board.boardNo} board={board} memNo={memNo} />
      ))}
    </div>
  );
}
