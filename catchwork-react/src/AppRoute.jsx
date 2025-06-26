import { Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";

const ProtectedRoute = ({ allowedType = null, children }) => {
  const { memType } = useAuthStore();
  const token = localStorage.getItem("accessToken");

  // 로그인 안 됐으면 /signin 으로
  if (!token || memType === null) {
    return <Navigate to="/signin" replace />;
  }

  // allowedType이 다르면 차단 후 메인으로
  if (allowedType !== null && memType !== allowedType) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
