import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";
import "./CompanyDetailPage.css";

//명하 신고하기모달창
import ReportModalPage from "../support/ReportModalPage";

// 로그인한 멤버 번호 가져오기
//const loginMemberSeq = getLoginMemberSeq();

// ✅ 더미 데이터 배열
// const dummyCompanyList = [
//   {
//     corpNo: "1",
//     corpName: "KH 정보교육원 종로",
//     corpLogo: "/src/assets/icon.png",
//     corpType: "중소기업",
//     corpCeoName: "양진선",
//     corpAddr: "서울특별시 중구 남대문로 120 그레이츠 청계(구 대일빌딩) 2F,3F",
//     corpOpenDate: "2017-04-01",
//     corpHomeLink: "http://khacademy.co.kr",
//     corpBm: "IT 교육, 개발자 양성",
//     corpDetail:
//       "1998년에 개원한 KH정보교육원은 대한민국 최초로 IT교육의 새로운 기준을 제시하며 실업자 취업교육을 시작하였습니다...",
//     corpBenefit: "자기개발비 지원/강의 교재비 지원/교육지원비/명절 상여금",
//     corpBenefitDetail:
//       "헬스장 지원/중식 제공/사내 동호회/생일자 상품권/연차 제도/정기 워크숍/퇴직연금/경조사비 지원 ",
//   },
//   {
//     corpNo: "2",
//     corpName: "KH 정보교육원 강남",
//     corpLogo: "/src/assets/icon.png",
//     corpType: "중소기업",
//     corpCeoName: "양진선",
//     corpAddr: "서울특별시 강남구 테헤란로 212 4F",
//     corpOpenDate: "2018-02-15",
//     corpHomeLink: "http://khacademy-gangnam.co.kr",
//     corpBm: "IT 교육, 디자인 교육",
//     corpDetail:
//       "KH정보교육원 강남지점은 강남 중심지에서 IT 전문 교육을 제공하고 있습니다...",
//     corpBenefit: "자기개발비 지원/도서 구매 지원/교육비 지원",
//     corpBenefitDetail:
//       "헬스장 지원/중식 제공/생일자 상품권/연차 제도/경조사비 지원생일자 상품권/연차 제도/정기 워크숍/퇴직연금/경조사비 지원 ",
//   },
//   {
//     corpNo: "3",
//     corpName: "KH 정보교육원 의정부",
//     corpLogo: "/src/assets/icon.png",
//     corpType: "중소기업",
//     corpCeoName: "허배령",
//     corpAddr: "경기도 의정부시 어룡역 근처 부근 민락동",
//     corpOpenDate: "2018-02-15",
//     corpHomeLink: "http://khacademy-uijeongbu.co.kr",
//     corpBm: "게시판 crud",
//     corpDetail:
//       "KH정보교육원 의정부는 의정부 유일한 KH정보 교육원이며 어룡역에서 경전철로 환승후 회룡역에서 1호선으로 갈아탄 후 와야합니다 <br> <br> <br> <br> <br>",
//     corpBenefit:
//       "자기개발비 지원/도서 구매 지원/교육비 지원 ",
//     corpBenefitDetail:
//       "헬스장 지원/중식 제공/생일자 상품권/연차 제도/경조사비 지원 ",
//   },
//   {
//     corpNo: "4",
//     corpName: "KH 정보교육원 인천",
//     corpLogo: "/src/assets/icon.png",
//     corpType: "중소기업",
//     corpCeoName: "허재호",
//     corpAddr: "인천광역시 옥련동",
//     corpOpenDate: "2018-02-15",
//     corpHomeLink: "http://khacademy-inchon.co.kr",
//     corpBm: "IT 교육, 디자인 교육,디자인 CSS, 이구아나 밥주기",
//     corpDetail: "재호는 요즘 여자친구 선물 걱정에 잠을 못이룹니다 ",
//     corpBenefit: "자기개발비 지원/도서 구매 지원/교육비 지원",
//     corpBenefitDetail:
//       "헬스장 지원/중식 제공/생일자 상품권/연차 제도/경조사비 지원",
//   },
//   {
//     corpNo: "5",
//     corpName: "KH 정보교육원 신촌",
//     corpLogo: "/src/assets/icon.png",
//     corpType: "중소기업",
//     corpCeoName: "신명하",
//     corpAddr: "서울특별시 신촌어쩌구 저쩌구",
//     corpOpenDate: "2018-02-15",
//     corpHomeLink: "http://khacademy-shinchon.co.kr",
//     corpBm: "IT 교육, 디자인 교육",
//     corpDetail: "신명하는 맨날 새벽 다섯시까지 잠안자고 웹툰본대요...",
//     corpBenefit: "자기개발비 지원/도서 구매 지원/교육비 지원",
//     corpBenefitDetail:
//       "헬스장 지원/중식 제공/생일자 상품권/연차 제도/경조사비 지원",
//   },
//   {
//     corpNo: "6",
//     corpName: "KH 정보교육원 노원",
//     corpLogo: "/src/assets/icon.png",
//     corpType: "중소기업",
//     corpCeoName: "이윤진",
//     corpAddr: "서울특별시 노원구 테헤란로 212 4F",
//     corpOpenDate: "2018-02-15",
//     corpHomeLink: "http://khacademy-nowon.co.kr",
//     corpBm: "IT 교육, 디자인 교육",
//     corpDetail:
//       "KH정보교육원 노원점은 노도강에 위치하여 근처 학생들에게 인기가 좋다.",
//     corpBenefit: "자기개발비 지원/도서 구매 지원/교육비 지원",
//     corpBenefitDetail:
//       "헬스장 지원/중식 제공/생일자 상품권/연차 제도/경조사비 지원",
//   },
// ];

const CompanyDetailPage = () => {
  const { corpNo } = useParams();
  const [company, setCompany] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!company) {
    return (
      <main className="container">
        <SectionHeader title="기업정보" />
        <p className="company-not-found">존재하지 않는 기업입니다.</p>
      </main>
    );
  }

  const handleOpenReport = () => {
    setShowReportModal(true);
  };

  const handleCloseReport = () => {
    setShowReportModal(false);
  };

  // 기업 상세 페이지
  useEffect(() => {
    const getCorpDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/company/${corpNo}${
            loginMemberNo ? `?memNo=${loginMemberNo}` : ""
          }`
        );
        if (!response.ok) throw new Error("기업 정보를 불러오지 못했습니다.");
        const data = await response.json();
        setCompany(data);
      } catch (error) {
        console.error(error);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };
    getCorpDetail();
  }, [corpNo]);
  if (loading) {
    return (
      <main className="container">
        <SectionHeader title="기업정보" />
        <p>로딩 중...</p>
      </main>
    );
  }

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
                <button className="btn-save">
                  <span className="material-symbols-outlined">bookmark</span>
                  {company.isSaved ? " 저장됨" : " 저장하기"}
                </button>
                <button className="btn-report" onClick={handleOpenReport}>
                  <span class="material-symbols-outlined">siren</span> 신고하기
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

        {/* 명하 - 신고 모달 띄우기 */}
        {showReportModal && (
          <ReportModalPage
            targetNo={corpNo}
            targetType="company"
            // memNo={loginMemberSeq}
            onClose={handleCloseReport}
          />
        )}
      </main>
      <ScrollToTopButton />
    </>
  );
};

export default CompanyDetailPage;
