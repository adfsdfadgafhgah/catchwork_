import React, { useState } from "react";
import SideBar from "../../components/myPage/CorpSideBar";
import "./CorpMyPage.css";

const CorpMyPage = () => {
  const [activeTab, setActiveTab] = useState("내정보");

  // 사용자 정보 (예시 데이터)
  const corpuserInfo = {
    company: "KH 정보교육원 종로 지점",
    corpid: "khacademy",
    corpemail: "khacademy@gmail.com",
    corpphone: "010-8983-5149",
    corpname: "인사 담당관",
    corpdepartment: "개발부",
  };

  return (
    <div className="corp-page-container">
      <SideBar activeTab={activeTab}  />
      <div className="corp-edit-content">
        <div className="form-container">
          <h2 className="page-title">기업 회원 마이페이지</h2>
          <div className="profile-content">
            <div className="profile-img">
              <i className="fas fa-user"></i>
            </div>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">기업명</span>
                <span className="info-value">{corpuserInfo.company}</span>
              </div>
              <div className="info-item">
                <span className="info-label">아이디</span>
                <span className="info-value font-medium">{corpuserInfo.corpid}</span>
              </div>
              <div className="info-item">
                <span className="info-label">이메일</span>
                <span className="info-value">{corpuserInfo.corpemail}</span>
              </div>
              <div className="info-item">
                <span className="info-label">전화번호</span>
                <span className="info-value">{corpuserInfo.corpphone}</span>
              </div>
              <div className="info-item">
                <span className="info-label">이름</span>
                <span className="info-value font-medium">{corpuserInfo.corpname}</span>
              </div>
              <div className="info-item">
                <span className="info-label">부서명</span>
                <span className="info-value">{corpuserInfo.corpdepartment}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorpMyPage;