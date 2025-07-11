import { Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";

const ProtectedRoute = ({
  allowedType = null,
  blockWhenLoggedIn = false,
  children,
}) => {
  const { memType } = useAuthStore();
  const token = localStorage.getItem("accessToken");

  // 로그인 안 됐을 때: 보호 필요
  if (!token || memType === null) {
    return blockWhenLoggedIn ? children : <Navigate to="/signin" replace />;
  }

  // 로그인됐는데 blockWhenLoggedIn=true면 메인으로 보내기 (예: signin, signup 등)
  if (blockWhenLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // 접근 권한 다르면 차단
  if (allowedType !== null && memType !== allowedType) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
