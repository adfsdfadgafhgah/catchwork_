import { useLocation, useNavigate } from "react-router-dom";

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
  // const navigate = useNavigate();
  // document.cookie = "adminId=; path=/; max-age=0"; // 쿠키 즉시 만료
  // navigate("/admin-auth");
};

// 공통 상수
export const ADMIN_MENU = [
  { path: "/admin", label: "메인" },
  { path: "/admin/support", label: "문의" },
  { path: "/admin/report", label: "신고" },
  { path: "/admin/ban", label: "정지" },
  { path: "/admin/restore", label: "복구" },
];
