import { Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function BoardPage() {
  const { memNo } = useAuthStore();
  return (
    <div className="board-container">
      <Outlet context={{ memNo }} />
    </div>
  );
}
