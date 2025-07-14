import { Outlet } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminNav from "../../components/admin/AdminNav";
import "./AdminPage.css";

const AdminPage = () => {
  return (
    <div className="adminGrid">
      <div className="adminNav">
        <AdminNav />
      </div>
      <div className="adminHeader">
        <AdminHeader />
      </div>
      <main className="adminMain">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPage;
