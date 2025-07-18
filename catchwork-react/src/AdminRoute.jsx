import { Navigate } from "react-router-dom";
import AdminPage from "./pages/admin/AdminPage";
import { axiosApi } from "./api/axiosAPI";
import { useEffect, useState } from "react";

const AdminRoute = () => {
  const [isAuth, setIsAuth] = useState(null); // null: 로딩 중, true/false: 로그인 상태

  useEffect(() => {
    axiosApi.get("/admin/check", { withCredentials: true })
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) {
    return <div>Loading...</div>; // 또는 로딩 스피너
  }

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return <AdminPage />;
};

export default AdminRoute;