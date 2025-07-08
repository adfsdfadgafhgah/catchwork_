import { useState } from "react";

const ConfirmPwModal = ({ isOpen, onClose, onConfirm, loading = false }) => {
  const [pw, setPw] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (pw.trim()) {
      onConfirm(pw);
      // 비밀번호 초기화는 onConfirm에서 처리하도록 함
    } else {
      alert("비밀번호를 입력해주세요.");
    }
  };

  const handleClose = () => {
    setPw(""); // 비밀번호 초기화
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>비밀번호 확인</h3>
        </div>
        <div className="modal-body">
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
          />
        </div>
        <div className="modal-footer">
          <button onClick={handleClose} disabled={loading}>
            취소
          </button>
          <button onClick={handleConfirm} disabled={loading || !pw.trim()}>
            {loading ? "확인 중..." : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPwModal;
