// src/pages/corpMypage/CorpMyPage.jsx
import { Outlet } from "react-router-dom";
import CorpSideBar from "../../components/myPage/CorpSideBar";
import "./CorpMyPage.css";

const CorpMyPage = () => {
  return (
    <div className="corp-page-container">
      <CorpSideBar />
      <div className="corp-edit-content">
        <Outlet />
      </div>
    </div>
  );
};

export default CorpMyPage;