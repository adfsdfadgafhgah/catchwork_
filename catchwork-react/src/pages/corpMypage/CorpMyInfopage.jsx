import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import "./CorpMyInfoPage.css";

const CorpMyInfoPage = () => {
  const { loginMember, setLoginMember } = useOutletContext();

  useEffect(() => {
    setLoginMember(); // 기업 정보 새로고침
  }, []);

  return (
    <div className="myinfo-container">
      <div className="profile-section">
        <div className="profile-img">
          <i className="fas fa-user"></i>
        </div>

        <div className="profile-info">
          <h1>{loginMember.companyName}</h1>
        </div>
      </div>

      <div className="info-card">
        <div className="info-content">
          <span className="info-label">기업명</span>
          <span className="info-value">{loginMember.companyName}</span>
        </div>

        <div className="info-content">
          <span className="info-label">아이디</span>
          <span className="info-value">{loginMember.memId}</span>
        </div>

        <div className="info-content">
          <span className="info-label">이메일</span>
          <span className="info-value">{loginMember.memEmail}</span>
        </div>

        <div className="info-content">
          <span className="info-label">전화번호</span>
          <span className="info-value">{loginMember.memTel}</span>
        </div>

        <div className="info-content">
          <span className="info-label">이름</span>
          <span className="info-value">{loginMember.memName}</span>
        </div>

        <div className="info-content">
          <span className="info-label">부서명</span>
          <span className="info-value">{loginMember.corpDepartment}</span>
        </div>
      </div>
    </div>
  );
};

export default CorpMyInfoPage;
