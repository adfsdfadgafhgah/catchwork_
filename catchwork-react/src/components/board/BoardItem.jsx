import { Link } from "react-router-dom";
import iconImg from "../../assets/icon.png";
import BoardCss from "./BoardItem.module.css";

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

export default function BoardItem({ board }) {
  return (
    <Link to={`/board/${board.boardNo}`} className={BoardCss.linkWrapper}>
      <div className={BoardCss.boardItem}>
        <div className={BoardCss.boardItemLeft}>
          <div className={BoardCss.profileImg}>{board.memProfilePath}</div>
          <div className={BoardCss.boardItemContent}>
            <div className={BoardCss.authorDate}>
              <span className={BoardCss.author}>
                {board.member.memNickname}
              </span>
              <span className={BoardCss.date}>{board.boardWriteDate}</span>
            </div>
            <h3 className={BoardCss.title}>{board.boardTitle}</h3>
            <p className={BoardCss.content}>{board.boardContent}</p>
            <div className={BoardCss.meta}>
              <i className="fa-regular fa-eye"></i>
              {board.boardReadCount} &nbsp;&nbsp;{" "}
              <i className="fa-regular fa-comment"></i>
              {board.commentCount} &nbsp;&nbsp;{" "}
              <i className="fa-regular fa-heart"></i> {board.likeCount}
            </div>
          </div>
        </div>
        <div className={BoardCss.logo}>
          <img src={iconImg} alt="catchWork로고" />
        </div>
      </div>
    </Link>
  );
}
