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
      onclick: onReport,
      className: "float-btn-report",
    },
  ],
  submitAndReport: (onSubmit, onReport) => [
    {
      label: "이력서 제출하기",
      icon: "fa-regular fa-file-lines",
      onclick: onSubmit,
      className: "float-btn-submit",
    },
    {
      label: "신고하기",
      icon: "siren",
      iconType: "material",
      onclick: () => onReport("채용공고 신고"),
      className: "float-btn-report",
    },
  ],
};
