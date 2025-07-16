import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./CorpMyInfoPage.css";
import defaultLogo from "../../assets/icon.png";
import { axiosApi } from "../../api/axiosAPI";

function CorpMyInfo() {
  const logoImgUrl = import.meta.env.VITE_FILE_COMPANY_IMG_URL;
  const { loginMember } = useOutletContext(); // 로그인 회원 정보
  const [company, setCompany] = useState(null); // company로 이름 통일

  useEffect(() => {
    if (!loginMember?.memNo) return;

    axiosApi
      .get("/corpcompany/detail", {
        params: { memNo: loginMember.memNo },
      })
      .then((res) => {
        console.log("✅ 기업 상세 응답:", res.data);
        setCompany(res.data);
      })
      .catch((err) => {
        console.error("기업 상세 조회 실패", err);
      });
  }, [loginMember]);

  if (!loginMember || !company) {
    return <div>기업 정보를 불러오는 중...</div>;
  }

  return (
    <div className="corpmyinfo-container">
      <div className="profile-section">
        <div className="corpmyinfo-profile-img">
         <img
            src={
              company.corpLogo  
                ? `${logoImgUrl}/${company.corpLogo}`
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
          <span className="info-value">{company.corpName || "기업명 없음"}</span>
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
          <span className="info-label">대표자명</span>
          <span className="info-value">{company.corpCeoName || "-"}</span>
        </div>

        <div className="info-content">
          <span className="info-label">부서명</span>
          <span className="info-value">{company.corpMemDept || "부서 없음"}</span>
        </div>
      </div>
    </div>
  );
}

export default CorpMyInfo;