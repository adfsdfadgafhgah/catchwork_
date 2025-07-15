import "./AdminMainPage.css";
import AdminChart from "../../components/admin/main/AdminChart";
import AdminInfo from "../../components/admin/main/AdminInfo";
import AdminRecentSupport from "../../components/admin/main/AdminRecentSupport";
import AdminRecentReport from "../../components/admin/main/AdminRecentReport";

const AdminMainPage = () => {
  return (
    <div className="mainPage">
      <div className="topSection">
        <div className="chartBox">
          <AdminChart />
        </div>
        <div className="infoBox">
          <AdminInfo />
        </div>
      </div>

      <div className="bottomSection">
        <div className="supportBox">
          <AdminRecentSupport />
        </div>
        <div className="reportBox">
          <AdminRecentReport />
        </div>
      </div>
    </div>
  );
};

export default AdminMainPage;