import styles from "./AdminInfo.module.css";

const AdminInfo = () => {
  const admin = {
    name: "관리자 홍길동",
    email: "admin@example.com",
    reportHandled: 12,
    supportHandled: 23,
  };

  return (
    <div className={styles.infoWrapper}>
      <h2 className={styles.title}>관리자</h2>
      <p>이름: {admin.name}</p>
      <p>이메일: {admin.email}</p>
      <p>신고 처리수: {admin.reportHandled}</p>
      <p>문의 처리수: {admin.supportHandled}</p>
    </div>
  );
};

export default AdminInfo;
