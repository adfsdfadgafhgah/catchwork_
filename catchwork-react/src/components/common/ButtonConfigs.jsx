export const FLOAT_BUTTON_PRESETS = {
  writeAndCancel: (onWrite, onCancel) => [
    {
      label: "취소하기",
      icon: "fa-solid fa-xmark",
      onClick: onCancel,
      className: "float-btn-cancel",
    },
    {
      label: "작성하기",
      icon: "fa-regular fa-pen-to-square",
      onClick: onWrite,
      className: "float-btn-write",
    },
  ],
  editAndCancel: (onEdit, onCancel) => [
    {
      label: "취소하기",
      icon: "fa-solid fa-xmark",
      onClick: onCancel,
      className: "float-btn-cancel",
    },
    {
      label: "수정하기",
      icon: "fa-regular fa-pen-to-square",
      onClick: onEdit,
      className: "float-btn-edit",
    },
  ],
  deleteOnly: (onDelete) => [
    {
      label: "삭제하기",
      icon: "fa-regular fa-trash-can",
      onClick: onDelete,
      className: "float-btn-delete",
    },
  ],

  writeOnly: (onWrite) => [
    {
      label: "작성하기",
      icon: "fa-regular fa-pen-to-square",
      onClick: onWrite,
      className: "float-btn-write",
    },
  ],
  endAndEditAndDelete: (onEnd, onEdit, onDelete) => [
    {
      label: "마감하기",
      icon: "fa-regular fa-clock",
      onClick: onEnd,
      className: "float-btn-cancel",
    },
    {
      label: "수정하기",
      icon: "fa-regular fa-pen-to-square",
      onClick: onEdit,
      className: "float-btn-cancel",
    },
    {
      label: "삭제하기",
      icon: "fa-regular fa-trash-can",
      onClick: onDelete,
      className: "float-btn-write",
    },
  ],
  reportOnly: (onReport) => [
    {
      label: "신고하기",
      icon: "siren",
      iconType: "material",
      onClick: () => onReport("채용공고 신고"),
      className: "float-btn-report",
    },
  ],

  submitAndReport: (onSubmit, onReport) => [
    {
      label: "이력서 제출하기",
      icon: "fa-regular fa-file-lines",
      onClick: onSubmit,
      className: "float-btn-submit",
    },
    {
      label: "신고하기",
      icon: "siren",
      iconType: "material",
      onClick: () => onReport("채용공고 신고"),
      className: "float-btn-report",
    },
  ],

  // - 이력서 페이지
  cvView: (onUpdate, onDelete) => [
    {
      label: "수정하기",
      icon: "fa-regular fa-pen-to-square",
      onClick: onUpdate,
      className: "float-btn-cv-view float-btn-cv-update",
    },
    {
      label: "삭제하기",
      icon: "fa-regular fa-trash-can",
      onClick: onDelete,
      className: "float-btn-cv-view float-btn-cv-delete",
    },
  ],
  cvUpdate: (onUpdate, onCancel) => [
    {
      label: "수정 완료",
      icon: "fa-regular fa-circle-check",
      onClick: onUpdate,
      className: "float-btn-cv-update float-btn-cv-submit",
    },
    {
      label: "미리보기",
      icon: "fa-solid fa-eye",
      onClick: onCancel,
      className: "float-btn-cv-update float-btn-cv-cancel",
    },
  ],
  cvAdd: (onAdd, onCancel) => [
    {
      label: "작성 완료",
      icon: "fa-regular fa-circle-check",
      onClick: onAdd,
      className: "float-btn-cv-add float-btn-cv-submit",
    },
    {
      label: "취소하기",
      icon: "fa-solid fa-xmark",
      onClick: onCancel,
      className: "float-btn-cv-add float-btn-cv-cancel",
    },
  ],
  cvSubmit: (onSubmit, onCancel) => [
    {
      label: "제출하기",
      icon: "fa-regular fa-paper-plane",
      onClick: onSubmit,
      className: "float-btn-cv-submit float-btn-cv-submit-btn",
    },
    {
      label: "취소하기",
      icon: "fa-solid fa-xmark",
      onClick: onCancel,
      className: "float-btn-cv-submit float-btn-cv-cancel",
    },
  ],
  // 이력서 페이지 -
};
