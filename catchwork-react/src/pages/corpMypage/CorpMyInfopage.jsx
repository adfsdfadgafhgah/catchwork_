import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./CorpMyInfoPage.css";
import defaultLogo from "../../assets/icon.png"; // 기업 기본 로고로 사용
import { axiosApi } from "../../api/axiosAPI";

function CorpMyInfo() {
  const logoImgUrl = import.meta.env.VITE_FILE_COMPANY_LOGO_URL; // 회사 로고용 이미지 경로 환경변수
  const { loginMember } = useOutletContext();
  const [corpInfo, setCorpInfo] = useState(null);

  useEffect(() => {
    axiosApi
      .get("/corp/mypage", { withCredentials: true })
      .then((res) => {
        console.log("✅ 백엔드 응답 데이터:", res.data);
        setCorpInfo(res.data);
      })
      .catch((err) => {
        console.error("기업 정보 조회 실패", err);
      });
  }, []);

  if (!loginMember || !corpInfo) {
    return <div>기업 정보를 불러오는 중...</div>;
  }

  return (
    <div className="corpmyinfo-container">
      <div className="profile-section">
        <div className="corpmyinfo-profile-img">
          <img
            src={
              corpInfo.corpLogo
                ? `${logoImgUrl}/${corpInfo.corpLogo}`
                : defaultLogo
            }
            alt="기업로고"
            className="company-logo"
          />
        </div>
        <div className="profile-info">
          <h1>{loginMember.memName || "닉네임 없음"}</h1>
        </div>
      </div>

      <div className="corpmyinfo-info">
        <div className="info-content">
          <span className="info-label">기업명</span>
          <span className="info-value">{corpInfo.corpName || "기업명 없음"}</span>
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
          <span className="info-value">{corpInfo.memName || "-"}</span>
        </div>

        <div className="info-content">
          <span className="info-label">부서명</span>
          <span className="info-value">{corpInfo.corpMemDept || "부서 없음"}</span>
        </div>
      </div>
    </div>
  );
}

export default CorpMyInfo;
