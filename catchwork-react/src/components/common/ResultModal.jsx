const ResultModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  type,
  modalData,
}) => {
  if (!isOpen) return null;

  const getModalContent = () => {
    switch (type) {
      case "id":
        return {
          title: "아이디 찾기 결과",
          content: <p>아이디: {modalData.id}</p>,
          buttonText: "확인",
        };
      case "pw":
        return {
          title: "비밀번호 찾기 결과",
          content: modalData.isIssuedTempPw ? (
            <p>{modalData.email}로 임시 비밀번호가 발송되었습니다.</p>
          ) : (
            <p>{modalData.email}로 임시 비밀번호가 발송중입니다.</p>
          ),
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
