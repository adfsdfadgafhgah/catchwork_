// src/pages/corp/myPage/CorpMyInfoPage.jsx

import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import "./CorpMyInfoPage.css";
import defaultImg from "../../assets/icon.png";
import { axiosApi } from "../../api/axiosAPI";

function CorpMyInfo() {
  const imgUrl = import.meta.env.VITE_FILE_PROFILE_IMG_URL; // 프로필 이미지 기본 경로 (env 변수)
  const { loginMember, setLoginMember } = useOutletContext();

  useEffect(() => {
    // 기업 마이페이지 정보 API 호출
    axiosApi
      .get("http://localhost:8080/corp/mypage", { withCredentials: true })
      .then((res) => {
        setLoginMember(res.data);
      })
      .catch((err) => {
        console.error("기업 정보 조회 실패", err);
      });
  }, []);

  console.log("✅ loginMember", loginMember);

  if (!loginMember) {
    return <div>기억 정보를 불러오는 중...</div>;
  }

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
            alt="프로필"
          />
        </div>

        <div className="profile-info">
          <h1>{loginMember.memNickname || "닉네임 없음"}</h1>
        </div>
      </div>

      <div className="corpmyinfo-info">
        <div className="info-content">
          <span className="info-label">기업명</span>
          <span className="info-value">
            {loginMember.corpName || "기업명 없음"}
          </span>
        </div>

        <div className="info-content">
          <span className="info-label">아이디</span>
          <span className="info-value">{loginMember.memId || "-"}</span>
        </div>

        <div className="info-content">
          <span className="info-label">이메일</span>
          <span className="info-value">{loginMember.memEmail || "-"}</span>
        </div>

        <div className="info-content">
          <span className="info-label">전화번호</span>
          <span className="info-value">{loginMember.memTel || "-"}</span>
        </div>

        <div className="info-content">
          <span className="info-label">이름</span>
          <span className="info-value">{loginMember.memName || "-"}</span>
        </div>

        <div className="info-content">
          <span className="info-label">부서명</span>
          <span className="info-value">
            {loginMember.corpDepartment || "부서 없음"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CorpMyInfo;
