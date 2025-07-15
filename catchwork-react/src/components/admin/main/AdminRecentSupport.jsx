import styles from "./AdminRecentSupport.module.css";
import { useNavigate } from "react-router-dom";

const dummySupportList = [
  {
    id: 1,
    category: "회원",
    title: "회원 가입 오류",
    author: "user1",
    writeDate: "2025-07-10",
    status: "처리중",
  },
  {
    id: 2,
    category: "결제",
    title: "환불 문의",
    author: "user2",
    writeDate: "2025-07-09",
    status: "완료",
  },
  {
    id: 3,
    category: "기타",
    title: "서비스 이용 문의",
    author: "user3",
    writeDate: "2025-07-08",
    status: "대기",
  },
  {
    id: 4,
    category: "회원",
    title: "비밀번호 초기화",
    author: "user4",
    writeDate: "2025-07-07",
    status: "완료",
  },
  {
    id: 5,
    category: "결제",
    title: "결제 오류",
    author: "user5",
    writeDate: "2025-07-06",
    status: "처리중",
  },
];

const AdminRecentSupport = () => {
  const navigate = useNavigate();

  // + 버튼
  const handleMoreClick = () => {
    navigate("/admin/support");
  };

  return (
    <div className={styles.supportWrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>미처리 문의 내역</h2>
        <button className={styles.moreButton} onClick={handleMoreClick}>
          +
        </button>
      </div>
      <ul className={styles.list}>
        {dummySupportList.slice(0, 4).map((item) => (
          <li key={item.id} className={styles.item}>
            <p>카테고리: {item.category}</p>
            <p>제목: {item.title}</p>
            <p>작성자: {item.author}</p>
            <p>작성일자: {item.writeDate}</p>
            <p>처리 상태: {item.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminRecentSupport;
