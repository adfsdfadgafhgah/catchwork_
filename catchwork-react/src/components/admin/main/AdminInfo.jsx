import styles from "./AdminInfo.module.css";
import useAdminInfo from "../../../hooks/admin/useAdminInfo";

const AdminInfo = () => {
  const { adminInfo, loading, error } = useAdminInfo();

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!adminInfo) return null; // 인증 안된 경우

  return (
    <div className={styles.infoWrapper}>
      <h2 className={styles.title}>관리자 정보</h2>
      <div className={styles.infoItem}>
        <span className={styles.label}>번호</span>
        <span className={styles.value}>{adminInfo.adminNo}</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.label}>이름</span>
        <span className={styles.value}>{adminInfo.adminName}</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.label}>닉네임</span>
        <span className={styles.value}>{adminInfo.adminNickname}</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.label}>이메일</span>
        <span className={styles.value}>{adminInfo.adminEmail}</span>
      </div>
      <div className={styles.infoItem}>
        <span className={styles.label}>전화번호</span>
        <span className={styles.value}>{adminInfo.adminTel}</span>
      </div>
    </div>
  );
};

export default AdminInfo;
