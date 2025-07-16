import { Outlet } from "react-router-dom";

const CompanyPage = () => {
  return (
    <main className="company-container">
      <Outlet />
    </main>
  );
};

export default CompanyPage;
