import React from "react";
import "./FloatButton.css";

const FloatButton = ({
  onCancel,
  onSubmit,
  cancelText = "취소하기",
  submitText = "수정하기",
}) => {
  return (
    <div className="float-button-container">
      <button className="float-btn-cancel" onClick={onCancel}>
        ✕ {cancelText}
      </button>
      <button className="float-btn-submit" onClick={onSubmit}>
        ✏️ {submitText}
      </button>
    </div>
  );
};

export default FloatButton;
