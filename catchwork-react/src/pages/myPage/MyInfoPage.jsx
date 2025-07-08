import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import "./MyInfoPage.css";
import defaultImg from "../../assets/icon.png";

function MyInfo() {
  const imgUrl = import.meta.env.VITE_FILE_PROFILE_IMG_URL;
  const { loginMember, setLoginMember } = useOutletContext();

  useEffect(() => {
    setLoginMember();
  }, []);

  return (
    <div className="myinfo-container">
      <div className="profile-section">
        <div className="myinfo-profile-img">
          <img
            src={
              loginMember.memProfilePath
                ? `${imgUrl}/${loginMember.memProfilePath}`
                : defaultImg
            }
          />
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
          <span className="info-value">{loginMember.memTel}</span>
        </div>

        <div className="info-content">
          <span className="info-label">이름</span>
          <span className="info-value font-medium">{loginMember.memName}</span>
        </div>

        <div className="info-content">
          <span className="info-label">생년월일</span>
          <span className="info-value">
            {loginMember.memBirthday?.substring(0, 4)}년{" "}
            {loginMember.memBirthday?.substring(5, 7)}월{" "}
            {loginMember.memBirthday?.substring(8, 10)}일{" "}
            {new Date().getFullYear() -
              loginMember.memBirthday?.substring(0, 4)}
            세
          </span>
        </div>

        <div className="info-content">
          <span className="info-label">성별</span>
          <span className="info-value">{loginMember.memGender}</span>
        </div>

        <div className="info-content">
          <span className="info-label">주소</span>
          <span className="info-value">
            <div className="info-value-line">
              {loginMember?.memAddr?.split("^^^")[0]}
            </div>
            <div className="info-value-line">
              {loginMember?.memAddr?.split("^^^")[1]}
            </div>
          </span>
        </div>
      </div>
    </div>
  );
}

export default MyInfo;
