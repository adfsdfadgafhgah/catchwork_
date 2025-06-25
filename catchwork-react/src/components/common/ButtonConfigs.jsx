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
      icon: "fa-solid fa-trash",
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
};
