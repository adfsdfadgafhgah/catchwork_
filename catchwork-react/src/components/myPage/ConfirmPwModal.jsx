import { useState, useEffect } from "react";
import styles from "./ConfirmPwModal.module.css";

const ConfirmPwModal = ({ isOpen, onClose, onConfirm, loading = false }) => {
  const [pw, setPw] = useState("");

  useEffect(() => {
    if (!isOpen) setPw("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (pw.trim()) {
      onConfirm(pw);
      // 비밀번호 초기화는 onConfirm에서 처리하도록 함
    } else {
      alert("비밀번호를 입력해주세요.");
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = () => {
    setPw(""); // 비밀번호 초기화
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>비밀번호 확인</h3>
        </div>
        <div className={styles.modalBody}>
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요."
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleConfirm();
              }
            }}
            className={styles.passwordInput}
          />
        </div>
        <div className={styles.modalFooter}>
          <button
            onClick={handleClose}
            disabled={loading}
            className={styles.cancelButton}
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading || !pw.trim()}
            className={styles.confirmButton}
          >
            {loading ? "확인 중..." : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPwModal;
