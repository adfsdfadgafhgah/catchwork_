import { Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";

const ProtectedRoute = ({
  allowedType = null,
  blockWhenLoggedIn = false,
  blockedType = null,
  children,
}) => {
  const { memType } = useAuthStore();
  const token = localStorage.getItem("accessToken");

  // 로그인 안 됐을 때: 보호 필요
  if (!token || memType === null) {
    // 로그인 x blockWhenLoggedIn이 true면 허용
    if (blockWhenLoggedIn) return children;
    // 로그인 o
    if (allowedType !== null) return <Navigate to="/signin" replace />;
    // blockedType만 있는 경우
    return children;
  }

  // 로그인됐는데 blockWhenLoggedIn=true면 메인으로 보내기 (예: signin, signup 등)
  if (blockWhenLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // 접근 권한 다르면 차단
  if (allowedType !== null && memType !== allowedType) {
    return <Navigate to="/" replace />;
  }

  if (blockedType !== null && memType === blockedType) {
    return <Navigate to="/corprecruit" replace />;
  }

  return children;
};

export default ProtectedRoute;
