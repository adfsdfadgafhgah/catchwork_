// src/hooks/cv/useFloatButtons.js
import { FLOAT_BUTTON_PRESETS } from "../../components/common/ButtonConfigs";

const useFloatButtons = (mode, handlers) => {
  const {
    setMode,
    handleUpdate,
    handleDelete,
    handleAdd,
    handleSubmit,
    navigate,
    recruitNo,
  } = handlers;

  switch (mode) {
    case "view":
      return FLOAT_BUTTON_PRESETS.cvView(
        () => setMode("update"),
        handleDelete
      );
    case "update":
      return FLOAT_BUTTON_PRESETS.cvUpdate(handleUpdate, () =>
        setMode("view")
      );
    case "add":
      return FLOAT_BUTTON_PRESETS.cvAdd(handleAdd, () => navigate("/cv"));
    case "submit":
      return FLOAT_BUTTON_PRESETS.cvSubmit(handleSubmit, () =>
        navigate(`/cv?recruitNo=${recruitNo}`)
      );
    default:
      return [];
  }
};

export default useFloatButtons;
