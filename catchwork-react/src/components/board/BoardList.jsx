import BoardItem from "./BoardItem";
import BoardCss from "./BoardList.module.css";

export default function BoardList({ boards, loginMember, onLikeToggle }) {
  return (
    <div className={BoardCss.boardList}>
      {boards.map((board) => (
        <BoardItem
          key={board.boardNo}
          board={board}
          loginMember={loginMember}
          onLikeToggle={onLikeToggle}
        />
      ))}
    </div>
  );
}

// // key값 index 대신 쓸 용도로
// boards.map((board) => (
//   <BoardItem key={board.boardNo} board={board} />
// ))

// // API에서 null이 오는 경우를 대비
// {!boards || boards.length === 0 ? (
//   <p className={BoardCss.emptyMessage}>게시글이 없습니다.</p>
// ) : (
//   boards.map((board) => (
//     <BoardItem key={board.boardNo} board={board} />
//   ))
// )}
