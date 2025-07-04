// src/hooks/cv/useCVApi.js
import { axiosApi } from "../../api/axiosAPI";

const useCVApi = (navigate) => {
  const handleAdd = async (payload) => {
    try {
      await axiosApi.post("/memberCV/add", payload);
      alert("저장 완료");
    } catch (err) {
      console.error("저장 실패", err.response?.data || err.message);
      alert("저장 중 오류가 발생했습니다");
    }
  };

  const handleUpdate = async (payload) => {
    try {
      await axiosApi.post("/memberCV/update", payload);
      alert("수정 완료");
    } catch (err) {
      console.error("수정 실패", err.response?.data || err.message);
      alert("수정 중 오류가 발생했습니다");
    }
  };

  const handleDelete = async (cvNo) => {
    if (!cvNo) {
      alert("삭제할 이력서가 없습니다.");
      return;
    }
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axiosApi.post("/memberCV/delete", { cvNo });
      alert("삭제 완료");
      navigate("/cv");
    } catch (err) {
      console.error("삭제 실패", err.response?.data || err.message);
      alert("삭제 중 오류 발생");
    }
  };

  return {
    handleAdd,
    handleUpdate,
    handleDelete,
  };
};

export default useCVApi;
