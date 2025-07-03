import React from "react";
import "./PaymentModal.css";

const PaymentModal = ({
  isOpen,
  onClose,
  type,
  onConfirm,
  loading = false,
  balance,
  targetPrice,
}) => {
  if (!isOpen) return null;

  const getModalContent = () => {
    switch (type) {
      case "upgrade":
        return {
          title: "멤버십 업그레이드",
          message: "골드 플랜으로 업그레이드하시겠습니까?",
          confirmText: "업그레이드",
          cancelText: "취소",
          confirmClass: "upgrade",
          balance: balance ?? 0,
          targetPrice: targetPrice ?? 0,
        };
      case "downgrade":
        return {
          title: "멤버십 다운그레이드",
          message: `실버 플랜으로 다운그레이드하시겠습니까? \n\n* 실버 플랜으로 변경하시는 경우, \n다음 결제일부터 플랜 혜택이 변경됩니다.`,
          confirmText: "다운그레이드",
          cancelText: "취소",
          confirmClass: "downgrade",
        };
      case "cancel":
        return {
          title: "멤버십 해지",
          message: "정말로 플랜을 해지하시겠습니까?",
          confirmText: "해지",
          cancelText: "취소",
          confirmClass: "cancel",
        };
      case "restore":
        return {
          title: "멤버십 복구",
          message: "정말로 플랜을 복구하시겠습니까?",
          confirmText: "복구",
          cancelText: "취소",
          confirmClass: "restore",
        };
      default:
        return {
          title: "",
          message: "",
          confirmText: "확인",
          cancelText: "취소",
          confirmClass: "default",
        };
    }
  };

  const content = getModalContent();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{content.title}</h3>
          <button className="modal-close" onClick={onClose} disabled={loading}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <p>{content.message}</p>
          {content.confirmClass === "upgrade" && (
            <p>
              잔여 이용 금액 : {content.balance} 원
              <br />
              추가 결제 금액 : {content.targetPrice - content.balance} 원
            </p>
          )}
        </div>
        <div className="modal-footer">
          <button
            className="modal-btn modal-btn-cancel"
            onClick={onClose}
            disabled={loading}
          >
            {content.cancelText}
          </button>
          <button
            className={`modal-btn modal-btn-confirm modal-btn-${content.confirmClass}`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "처리중..." : content.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
