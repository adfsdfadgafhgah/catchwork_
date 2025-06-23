import { useParams } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import "./CorpCompanyDetailPage.css";

// ✅ 더미 데이터 배열
const dummyCompanyList = [
  {
    corpNo: "1",
    corpName: "KH 정보교육원 종로",
    corpLogo: "/src/assets/icon.png",
    corpType: "중소기업",
    corpRegNo: "123-45-67890", // ✅ 사업자번호 추가
    corpCeoName: "양진선",
    corpAddr: "서울특별시 중구 남대문로 120 그레이츠 청계(구 대일빌딩) 2F,3F",
    corpOpenDate: "2017-04-01",
    corpHomeLink: "http://khacademy.co.kr",
    corpBm: "IT 교육, 개발자 양성",
    corpDetail:
      "1998년에 개원한 KH정보교육원은 대한민국 최초로 IT교육의 새로운 기준을 제시하며 실업자 취업교육을 시작하였습니다...",
    corpBenefit: "자기개발비 지원/강의 교재비 지원/교육지원비/명절 상여금",
    corpBenefitDetail:
      "헬스장 지원/중식 제공/사내 동호회/생일자 상품권/연차 제도/정기 워크숍/퇴직연금/경조사비 지원",
  },
  // 👉 나머지 데이터 생략
];

const CorpCompanyDetailPage = () => {
  const { corpNo } = useParams();

  const company = dummyCompanyList.find((item) => item.corpNo === corpNo);

  if (!company) {
    return (
      <main className="container">
        <SectionHeader title="기업정보" />
        <p className="company-not-found">존재하지 않는 기업입니다.</p>
      </main>
    );
  }

  return (
    <main className="container">
      <SectionHeader title="기업정보" />

      <div className="company-detail-header">
        <div className="company-header-left">
          <img src={company.corpLogo} alt="기업로고" className="company-logo" />
        </div>

        <div className="company-header-right">
          <div className="company-title-line">
            <h2 className="company-name">{company.corpName}</h2>
          </div>

          <div className="company-basic-info">
            <div className="info-row">
              <div className="info-label">기업 형태</div>
              <div className="info-value">{company.corpType}</div>
            </div>
            <div className="info-row">
              <div className="info-label">사업자 번호</div>
              <div className="info-value">{company.corpRegNo}</div>
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
                <a href={company.corpHomeLink} target="_blank" rel="noreferrer">
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

      <div className="company-footer-buttons">
        <button className="btn-withdraw">기업 탈퇴하기</button>
        <button className="btn-edit">수정하기</button>
      </div>
    </main>
  );
};

export default CorpCompanyDetailPage;
