import styles from "./AdminResisterModal.module.css";

const AdminModal = ({ modalInfo, setModalOpen, navigate }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>회원가입 완료</h2>
        <p>다시 확인 할 수 없습니다.</p>
        <br />
        <p>
          <b>임시 아이디:</b> {modalInfo.id}
          <br />
          <b>임시 비밀번호:</b> {modalInfo.password}
        </p>
        <button
          onClick={() => {
            setModalOpen(false);
            navigate("/admin-auth");
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default AdminModal;
