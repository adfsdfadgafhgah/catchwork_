import { useEffect, useState } from "react";
import "./CorpMyInfoPage.css";
import defaultLogo from "../../assets/icon.png";
import { axiosApi } from "../../api/axiosAPI";

function CorpMyInfo() {
  const logoImgUrl = import.meta.env.VITE_FILE_COMPANY_IMG_URL;
  const [company, setCompany] = useState(null);
  const [detailLogo, setDetailLogo] = useState(null);

  useEffect(() => {
    // 1번 API: 기본 기업 정보
    axiosApi
      .get("/corp/mypage")
      .then((res) => {
        setCompany(res.data);
      })
      .catch((err) => {
        console.error("기업 정보 조회 실패", err);
      });
  }, []);

  useEffect(() => {
    // 2번 API: corpLogo만 별도 호출해서 따로 저장
    async function fetchDetailLogo() {
      try {
        if (!company?.memNo) return; // memNo가 있어야 호출 가능

        const res = await axiosApi.get("/corpcompany/detail", {
          params: { memNo: company.memNo },
        });
        setDetailLogo(res.data.corpLogo);
      } catch (err) {
        console.error("상세 기업 로고 조회 실패", err);
      }
    }
    fetchDetailLogo();
  }, [company]);

  if (!company) {
    return <div>기업 정보를 불러오는 중...</div>;
  }

  // detailLogo 우선, 없으면 company.corpLogo, 없으면 defaultLogo
  const logoSrc = detailLogo
    ? `${logoImgUrl}/${detailLogo}`
    : company.corpLogo
    ? `${logoImgUrl}/${company.corpLogo}`
    : defaultLogo;

  return (
    <div className="corpmyinfo-container">
      <div className="profile-section">
        <div className="corpmyinfo-profile-img">
          <img src={logoSrc} alt="기업로고" className="company-logo" />
        </div>
        <div className="profile-info">
          <h1>{company.corpName || "대표자 없음"}</h1>
        </div>
      </div>

      <div className="corpmyinfo-info">
        <div className="info-content">
          <span className="info-label">기업명</span>
          <span className="info-value">{company.corpName || "기업명 없음"}</span>
        </div>

        <div className="info-content">
          <span className="info-label">아이디</span>
          <span className="info-value">{company.memId || "-"}</span>
        </div>

        <div className="info-content">
          <span className="info-label">이메일</span>
          <span className="info-value">{company.memEmail || "-"}</span>
        </div>

        <div className="info-content">
          <span className="info-label">전화번호</span>
          <span className="info-value">{company.memTel || "-"}</span>
        </div>

        <div className="info-content">
          <span className="info-label">이름</span>
          <span className="info-value">{company.memName || "-"}</span>
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
