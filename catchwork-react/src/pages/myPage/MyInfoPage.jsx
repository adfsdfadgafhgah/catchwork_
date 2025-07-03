import { useEffect } from "react";
import useLoginMember from "../../stores/loginMember";
import "./MyInfoPage.css";

function MyInfo() {
  const { loginMember, setLoginMember } = useLoginMember();

  useEffect(() => {
    setLoginMember();
  }, []);

  return (
    <div className="myinfo-container">
      <div className="profile-section">
        <div className="profile-img">
          <i className="fas fa-user"></i>
        </div>

        <div className="profile-info">
          <h1>{loginMember.memNickname}</h1>
        </div>
      </div>

      <div className="info-card">
        <div className="info-content">
          <span className="info-label">아이디</span>
          <span className="info-value font-medium">{loginMember.memId}</span>
        </div>

        <div className="info-content">
          <span className="info-label">이메일</span>
          <span className="info-value">{loginMember.memEmail}</span>
        </div>

        <div className="info-content">
          <span className="info-label">전화번호</span>
          <span className="info-value">{loginMember.memPhone}</span>
        </div>

        <div className="info-content">
          <span className="info-label">이름</span>
          <span className="info-value font-medium">{loginMember.memName}</span>
        </div>

        <div className="info-content">
          <span className="info-label">생년월일</span>
          <span className="info-value">{loginMember.memBirth}</span>
        </div>

        <div className="info-content">
          <span className="info-label">성별</span>
          <span className="info-value">{loginMember.memGender}</span>
        </div>

        <div className="info-content">
          <span className="info-label">주소</span>
          <span className="info-value">{loginMember.memAddress}</span>
        </div>
      </div>
    </div>
  );
}

export default MyInfo;
