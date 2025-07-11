import { Outlet } from "react-router-dom";

const AdminPage = () => {
  return (
    <main className="container">
      <Outlet />
    </main>
  );
};

export default AdminPage;
