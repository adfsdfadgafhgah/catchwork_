import { Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function MemberRecruitPage() {
  const { memNo } = useAuthStore();
  return (
    <div className="recruit-container">
      <Outlet context={{ memNo }} />
    </div>
  );
}
