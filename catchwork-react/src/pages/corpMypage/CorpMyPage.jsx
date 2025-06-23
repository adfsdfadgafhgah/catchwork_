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

  const MainContent = () => {
    if (activeTab === "내정보") {
      return (
        <div className="main-content">
          <div className="content-container">
            <h2 className="content-title">기업회원 마이페이지</h2>
            <hr className="title-divider" />
            <div className="profile-section">
              <div className="profile-img">
                <i className="fas fa-user"></i>
              </div>
              <div className="info-card">
                <div className="info-content">
                  <span className="info-label">기업명</span>
                  <span className="info-value">{corpuserInfo.company}</span>
                </div>
                <div className="info-content">
                  <span className="info-label">아이디</span>
                  <span className="info-value font-medium">{corpuserInfo.corpid}</span>
                </div>
                <div className="info-content">
                  <span className="info-label">이메일</span>
                  <span className="info-value">{corpuserInfo.corpemail}</span>
                </div>
                <div className="info-content">
                  <span className="info-label">전화번호</span>
                  <span className="info-value">{corpuserInfo.corpphone}</span>
                </div>
                <div className="info-content">
                  <span className="info-label">이름</span>
                  <span className="info-value font-medium">{corpuserInfo.corpname}</span>
                </div>
                <div className="info-content">
                  <span className="info-label">부서명</span>
                  <span className="info-value">{corpuserInfo.corpdepartment}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="main-content">
        <div className="content-container">
          <h2 className="content-title">{activeTab}</h2>
          <div className="development-page">
            <p>이 페이지는 개발 중입니다.</p>
            <p className="sub-text">"{activeTab}" 기능이 곧 추가될 예정입니다.</p>
          </div>
        </div>
      </div>
    );
  };

  // 출력 결과
  return (
    <div className="mypage-container">
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <MainContent />
    </div>
  );
};

export default CorpMyPage;