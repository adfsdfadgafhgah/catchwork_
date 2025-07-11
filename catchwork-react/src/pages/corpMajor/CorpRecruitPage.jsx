import { Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function CorpRecruitPage() {
  const { memNo, memType } = useAuthStore(); // useAuthStore에서 memNo 가져오기
  return (
    <div className="recruit-container">
      <Outlet context={{ memNo, memType }} /> {/* memNo를 context로 전달 */}
    </div>
  );
}
