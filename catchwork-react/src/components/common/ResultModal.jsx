import { NavLink } from "react-router-dom";

const ResultModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  isCorp,
  type,
  modalData,
}) => {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  if (!isOpen) return null;

  const getModalContent = () => {
    switch (type) {
      case "id":
        return {
          title: "아이디 찾기 결과",
          content: <p>아이디: {modalData.id}</p>,
          link:
            baseUrl +
            "/signin?type=" +
            (modalData.isCorp ? "corporate" : "personal"),
          buttonText: "확인",
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
      <div className="modal-content">
        <div className="modal-header">
          <i className="fa-solid fa-check"></i>
          <h3>{content.title}</h3>
          <button className="modal-close" onClick={onClose} disabled={loading}>
            ×
          </button>
        </div>
        <div className="modal-body">{content.content}</div>
        <div className="modal-footer">
          <button onClick={handleConfirm} disabled={loading}>
            {content.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
