import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";
import "./CompanyDetailPage.css";
import { useNavigate } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import useLoginMember from "../../stores/loginMember";

//명하 신고하기모달창
import ReportModalPage from "../support/ReportModalPage";

const CompanyDetailPage = () => {
  const navigate = useNavigate();
  const { loginMember, setLoginMember } = useLoginMember(); // 로그인 유저 정보
  const { corpNo } = useParams();
  const [company, setCompany] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // 최초 마운트 시 정보 fetch
  useEffect(() => {
    setLoginMember();
  }, []);

  const handleOpenReport = () => {
    if (!loginMember || !loginMember.memNo) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/signin");
      return;
    }
    setShowReportModal(true);
  };

  const handleCloseReport = () => {
    setShowReportModal(false);
  };

  //기업 상세 정보
  useEffect(() => {
    const getCorpDetail = async () => {
      setLoading(true);
      try {
        const url = `/company/${corpNo}`;
        const params = loginMember?.memNo ? { memNo: loginMember.memNo } : {};

        const res = await axiosApi.get(url, { params });

        if (res.status === 200) {
          const data = res.data;
          console.log("받은 company:", data);
          setCompany({
            ...data,
            isSaved: Number(data.isSaved),
          });
        } else {
          console.warn("기업 정보 없음:", res.status);
          setCompany(null);
        }
      } catch (error) {
        console.error("기업 정보 요청 실패:", error);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    getCorpDetail();
  }, [corpNo, loginMember]); //loginMember가 바뀌면 재호출

  // 관심 기업 토글 처리
  const handleToggleFavorite = async () => {
    if (!loginMember || !loginMember.memNo) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }
    try {
      const payload = {
        corpNo: parseInt(corpNo),
        memNo: loginMember.memNo,
      };

      const res = await axiosApi.post("/company/toggle-favorite", payload);

      if (res.status === 200) {
        const result = res.data;
        console.log("Toggle 응답:", result);

        setCompany((prev) => ({
          ...prev,
          isSaved: Number(result.isSaved),
          favs: result.totalFav,
        }));
      } else {
        throw new Error("관심기업 토글 실패");
      }
    } catch (error) {
      console.error(" 관심기업 처리 실패:", error);
      alert("관심기업 처리 중 오류가 발생했습니다.");
    }
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <main className="container">
        <SectionHeader title="기업정보" />
        <p>로딩 중...</p>
      </main>
    );
  }

  // 로딩 후에도 회사 정보가 없다면
  if (!company) {
    return (
      <main className="container">
        <SectionHeader title="기업정보" />
        <p className="company-not-found">존재하지 않는 기업입니다.</p>
      </main>
    );
  }

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
          <p>
            {company.corpBm.split("\n").map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </div>

        <div className="company-section">
          <h3>기업상세</h3>
          <p>
            {company.corpDetail.split("\n").map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </div>

        <div className="company-section">
          <h3>복리후생</h3>
          <b>
            {company.corpBenefit.split("\n").map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}
          </b>
          <p>
            {company.corpBenefitDetail.split("\n").map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </div>

        {/* 명하 - 신고 모달 */}
        {showReportModal && (
          <ReportModalPage
            targetNo={corpNo}
            targetType="company"
            targetNickname={company.corpName}
            onClose={handleCloseReport}
          />
        )}
      </main>
      <ScrollToTopButton />
    </>
  );
};

export default CompanyDetailPage;
