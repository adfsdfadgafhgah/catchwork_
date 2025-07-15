import { useRef, useCallback } from "react";
import { useRecentSupport, useRecentSupportCount } from "../../../hooks/admin/mainUtils";
import { useNavigate } from "react-router-dom";
import styles from "./AdminRecentSupport.module.css";

const AdminRecentSupport = () => {
  const { data, loading, hasMore, loadMore } = useRecentSupport(5);
  const { count, loading: countLoading } = useRecentSupportCount();
  const observer = useRef();
  const navigate = useNavigate();

  const handleMoreClick = () => {
    navigate("/admin/support");
  };

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  return (
    <div className={styles.supportWrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>미처리 문의 내역</h2>
        <div>
          {!countLoading && count && (
            <p>
              <strong>총 미처리 문의 수:</strong> {count.TOTAL_COUNT || 0}
            </p>
          )}
        </div>
        <button className={styles.moreButton} onClick={handleMoreClick}>
          +
        </button>
      </div>

      <ul className={styles.list}>
        {data.map((item, index) => {
          const isLast = index === data.length - 1;

          return (
            <li
              key={item.supportNo}
              ref={isLast ? lastElementRef : null}
              className={styles.item}
            >
              <p>카테고리: {item.supportCategoryName}</p>
              <p>제목: {item.supportTitle}</p>
              <p>작성자: {item.memNickname}</p>
              <p>작성일자: {item.supportDate}</p>
              <p>처리 상태: {item.supportStatus}</p>
            </li>
          );
        })}
      </ul>

      {loading && <p>Loading...</p>}
    </div>
  );
};

export default AdminRecentSupport;
