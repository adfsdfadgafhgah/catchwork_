import { Outlet } from "react-router-dom";

export default function BoardPage() {
  return (
    <div className="board-container">
      <Outlet />
    </div>
  );
}
