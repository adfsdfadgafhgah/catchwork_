// src/hooks/admin/useAdminInfo.js

import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";

const useAdminInfo = () => {
  const [adminInfo, setAdminInfo] = useState(null);   // 관리자 정보
  const [loading, setLoading] = useState(true);       // 로딩 상태
  const [error, setError] = useState(null);           // 에러 메시지

  useEffect(() => {
    axiosApi.get("/admin/info", { withCredentials: true })
      .then(res => setAdminInfo(res.data))
      .catch(err => {
        console.error("관리자 정보 로딩 실패:", err);
        setError(err.response?.data?.error || "불러오기 실패");
      })
      .finally(() => setLoading(false));
  }, []);

  return { adminInfo, loading, error };
};

export default useAdminInfo;
