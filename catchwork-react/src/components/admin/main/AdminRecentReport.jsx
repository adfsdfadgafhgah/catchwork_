import { useRef, useCallback } from "react";
import { useRecentReport, useRecentReportCount } from "../../../hooks/admin/mainUtils";
import { useNavigate } from "react-router-dom";
import styles from "./AdminRecentReport.module.css";

const AdminRecentReport = () => {
  const { data, loading, hasMore, loadMore } = useRecentReport(5);
  const { count, loading: countLoading } = useRecentReportCount();
  const observer = useRef();
  const navigate = useNavigate();

  // + 버튼
  const handleMoreClick = () => {
    navigate("/admin/report");
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
    <div className={styles.reportWrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>미처리 신고 내역</h2>
        <div className={styles.content}>
          {!countLoading && count && (
            <div>
              <strong>총 미처리 신고 수:</strong> {count.TOTAL_COUNT || 0}{" "}
              &nbsp;/&nbsp;
              <strong>신고 대상 수:</strong> {count.TARGET_COUNT || 0}
            </div>
          )}
          <button className={styles.moreButton} onClick={handleMoreClick}>
            +
          </button>
        </div>
      </div>

      <ul className={styles.list}>
        {data.map((item, index) => {
          const isLast = index === data.length - 1;
          const key = `${item.reportTargetType}-${item.reportTargetNo}`;

          return (
            <li
              key={key}
              ref={isLast ? lastElementRef : null}
              onClick={() =>
                navigate(
                  `/admin/report/detail?type=${item.reportTargetType}&no=${item.reportTargetNo}`
                )
              }
              className={styles.item}
            >
              <p>
                <span className={styles.itemTitle}>대상 타입 </span>: {item.reportTargetType}
              </p>
              <p>
                <span className={styles.itemTitle}>대상 번호 </span>: {item.reportTargetNo}
              </p>
              <p>
                <span className={styles.itemTitle}>대표 신고 내용 </span>: {item.reportContent}
              </p>
              <p>
                <span className={styles.itemTitle}>미처리 신고 건수 </span>: {item.reportCount}
              </p>
            </li>
          );
        })}
      </ul>

      {loading && <p>Loading...</p>}
    </div>
  );
};

export default AdminRecentReport;
