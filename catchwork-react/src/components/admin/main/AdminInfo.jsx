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
      <p>번호: {adminInfo.adminNo}</p>
      <p>이름: {adminInfo.adminName}</p>
      <p>닉네임: {adminInfo.adminNickname}</p>
      <p>이메일: {adminInfo.adminEmail}</p>
      <p>전화번호: {adminInfo.adminTel}</p>
    </div>
  );
};

export default AdminInfo;
