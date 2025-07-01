import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";
import "./CompanyDetailPage.css";

//명하 신고하기모달창
import ReportModalPage from "../support/ReportModalPage";

// 로그인한 멤버 번호 가져오기
//const loginMemberSeq = getLoginMemberSeq();

const CompanyDetailPage = () => {
  const { corpNo } = useParams();
  const [company, setCompany] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleOpenReport = () => {
    setShowReportModal(true);
  };

  const handleCloseReport = () => {
    setShowReportModal(false);
  };
  const loginMemberNo = "81ee03e6-82ee-41e5-a8f5-1835574510b2";

  //기업 상세 정보
  useEffect(() => {
    const getCorpDetail = async () => {
      try {
        const url = `http://localhost:8080/company/${corpNo}${
          loginMemberNo ? `?memNo=${loginMemberNo}` : ""
        }`;

        console.log("📦 Fetch 실행됨:", url); // fetch 진입 확인

        const response = await fetch(url);

        if (!response.ok) throw new Error("기업 정보를 불러오지 못했습니다.");

        const data = await response.json();
        console.log("✅ 받은 company:", data); //받아온 데이터 확인
        // ✅ 여기!! 숫자 변환 처리
        setCompany({
          ...data,
          isSaved: Number(data.isSaved), // 숫자로 변환해줘야 조건문에서 정확히 비교됨
        });
      } catch (error) {
        console.error("❌ 기업 정보 요청 실패:", error);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    getCorpDetail();
  }, [corpNo]);
  // ✅ 관심 기업 토글 처리
  const handleToggleFavorite = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/company/toggle-favorite",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            corpNo: parseInt(corpNo),
            memNo: loginMemberNo,
          }),
        }
      );

      if (!response.ok) throw new Error("관심기업 토글 실패");

      const result = await response.json();
      console.log("🎯 Toggle 응답:", result);

      // UI 갱신
      setCompany((prev) => {
        const updated = {
          ...prev,
          isSaved: Number(result.isSaved), // ✅ 여기가 핵심!
          favs: result.totalFav,
        };
        return JSON.parse(JSON.stringify(updated));
      });
    } catch (error) {
      console.error("❌ 관심기업 처리 실패:", error);
    }
  };
  // ✅ 로딩 중 표시
  if (loading) {
    return (
      <main className="container">
        <SectionHeader title="기업정보" />
        <p>로딩 중...</p>
      </main>
    );
  }

  // ✅ 로딩 후에도 회사 정보가 없다면
  if (!company) {
    return (
      <main className="container">
        <SectionHeader title="기업정보" />
        <p className="company-not-found">존재하지 않는 기업입니다.</p>
      </main>
    );
  }

  // ✅ 정상 렌더링
  return (
    <>
      <main className="container">
        <SectionHeader title="기업정보" />

        <div className="company-detail-header">
          <div className="company-header-left">
            <img
              src={company.corpLogo}
              alt="기업로고"
              className="company-logo"
            />
          </div>

          <div className="company-header-right">
            <div className="company-title-line">
              <h2 className="company-name">{company.corpName}</h2>
              <div className="company-actions">
                <button
                  key={company.isSaved} // key가 바뀌면 리렌더링 발생
                  className="btn-save"
                  onClick={handleToggleFavorite}
                >
                  <i
                    className={
                      company.isSaved == 1
                        ? "fa-solid fa-bookmark"
                        : "fa-regular fa-bookmark"
                    }
                  ></i>
                  {company.isSaved == 1 ? " 저장됨" : " 저장하기"} (
                  {company.favs ?? 0})
                </button>

                <button className="btn-report" onClick={handleOpenReport}>
                  <span className="material-symbols-outlined">siren</span>{" "}
                  신고하기
                </button>
              </div>
            </div>

            <div className="company-basic-info">
              <div className="info-row">
                <div className="info-label">기업 형태</div>
                <div className="info-value">{company.corpType}</div>
              </div>
              <div className="info-row">
                <div className="info-label">대표명</div>
                <div className="info-value">{company.corpCeoName}</div>
              </div>
              <div className="info-row">
                <div className="info-label">주소</div>
                <div className="info-value">{company.corpAddr}</div>
              </div>
              <div className="info-row">
                <div className="info-label">개업일자</div>
                <div className="info-value">{company.corpOpenDate}</div>
              </div>
              <div className="info-row">
                <div className="info-label">홈페이지</div>
                <div className="info-value">
                  <a
                    href={company.corpHomeLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {company.corpHomeLink}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="company-section">
          <h3>주요사업</h3>
          <p>{company.corpBm}</p>
        </div>

        <div className="company-section">
          <h3>기업상세</h3>
          <p>{company.corpDetail}</p>
        </div>

        <div className="company-section">
          <h3>복리후생</h3>
          <b>{company.corpBenefit}</b>
          <p>{company.corpBenefitDetail}</p>
        </div>

        {/* 명하 - 신고 모달 */}
        {showReportModal && (
          <ReportModalPage
            targetNo={corpNo}
            targetType="company"
            onClose={handleCloseReport}
          />
        )}
      </main>
      <ScrollToTopButton />
    </>
  );
};

export default CompanyDetailPage;
