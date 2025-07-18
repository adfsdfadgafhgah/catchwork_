import { useLocation, useNavigate } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";

export const useAdminTitle = () => {
  const location = useLocation();

  const path = location.pathname;

  let title = "";

  if (path === "/admin") title = "메인";
  else if (path.startsWith("/admin/support")) title = "문의";
  else if (path.startsWith("/admin/report")) title = "신고";
  else if (path.startsWith("/admin/ban")) title = "정지";
  else if (path.startsWith("/admin/restore")) title = "복구";

  return title;
};

export const handleAdminLogout = () => {
  const navigate = useNavigate();

  return async () => {
    try {
      await axiosApi.get("/admin/logout", { withCredentials: true });
      navigate("/admin-auth");
    } catch (err) {
      alert("로그아웃 실패");
    }
  };
};

// 공통 상수
export const ADMIN_MENU = [
  { path: "/admin", label: "메인" },
  { path: "/admin/support", label: "문의" },
  { path: "/admin/report", label: "신고" },
  { path: "/admin/ban", label: "정지" },
  { path: "/admin/restore", label: "복구" },
];
