import { useParams } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import "./CompanyDetailPage.css";

// ✅ 더미 데이터 배열
const dummyCompanyList = [
  {
    corpNo: "1",
    corpName: "KH 정보교육원 종로",
    corpLogo: "/src/assets/icon.png",
    corpType: "중소기업",
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
  {
    corpNo: "2",
    corpName: "KH 정보교육원 강남",
    corpLogo: "/src/assets/icon.png",
    corpType: "중소기업",
    corpCeoName: "양진선",
    corpAddr: "서울특별시 강남구 테헤란로 212 4F",
    corpOpenDate: "2018-02-15",
    corpHomeLink: "http://khacademy-gangnam.co.kr",
    corpBm: "IT 교육, 디자인 교육",
    corpDetail:
      "KH정보교육원 강남지점은 강남 중심지에서 IT 전문 교육을 제공하고 있습니다...",
    corpBenefit: "자기개발비 지원/도서 구매 지원/교육비 지원",
    corpBenefitDetail:
      "헬스장 지원/중식 제공/생일자 상품권/연차 제도/경조사비 지원",
  },
  {
    corpNo: "3",
    corpName: "KH 정보교육원 의정부",
    corpLogo: "/src/assets/icon.png",
    corpType: "중소기업",
    corpCeoName: "양진선",
    corpAddr: "서울특별시 강남구 테헤란로 212 4F",
    corpOpenDate: "2018-02-15",
    corpHomeLink: "http://khacademy-uijeongbu.co.kr",
    corpBm: "IT 교육, 디자인 교육",
    corpDetail:
      "KH정보교육원 강남지점은 강남 중심지에서 IT 전문 교육을 제공하고 있습니다...",
    corpBenefit: "자기개발비 지원/도서 구매 지원/교육비 지원",
    corpBenefitDetail:
      "헬스장 지원/중식 제공/생일자 상품권/연차 제도/경조사비 지원",
  },
  {
    corpNo: "4",
    corpName: "KH 정보교육원 인천",
    corpLogo: "/src/assets/icon.png",
    corpType: "중소기업",
    corpCeoName: "양진선",
    corpAddr: "서울특별시 강남구 테헤란로 212 4F",
    corpOpenDate: "2018-02-15",
    corpHomeLink: "http://khacademy-inchon.co.kr",
    corpBm: "IT 교육, 디자인 교육",
    corpDetail:
      "KH정보교육원 강남지점은 강남 중심지에서 IT 전문 교육을 제공하고 있습니다...",
    corpBenefit: "자기개발비 지원/도서 구매 지원/교육비 지원",
    corpBenefitDetail:
      "헬스장 지원/중식 제공/생일자 상품권/연차 제도/경조사비 지원",
  },
  {
    corpNo: "5",
    corpName: "KH 정보교육원 신촌",
    corpLogo: "/src/assets/icon.png",
    corpType: "중소기업",
    corpCeoName: "양진선",
    corpAddr: "서울특별시 강남구 테헤란로 212 4F",
    corpOpenDate: "2018-02-15",
    corpHomeLink: "http://khacademy-shinchon.co.kr",
    corpBm: "IT 교육, 디자인 교육",
    corpDetail:
      "KH정보교육원 강남지점은 강남 중심지에서 IT 전문 교육을 제공하고 있습니다...",
    corpBenefit: "자기개발비 지원/도서 구매 지원/교육비 지원",
    corpBenefitDetail:
      "헬스장 지원/중식 제공/생일자 상품권/연차 제도/경조사비 지원",
  },
  {
    corpNo: "6",
    corpName: "KH 정보교육원 노원",
    corpLogo: "/src/assets/icon.png",
    corpType: "중소기업",
    corpCeoName: "양진선",
    corpAddr: "서울특별시 노원구 테헤란로 212 4F",
    corpOpenDate: "2018-02-15",
    corpHomeLink: "http://khacademy-nowon.co.kr",
    corpBm: "IT 교육, 디자인 교육",
    corpDetail:
      "KH정보교육원 강남지점은 강남 중심지에서 IT 전문 교육을 제공하고 있습니다...",
    corpBenefit: "자기개발비 지원/도서 구매 지원/교육비 지원",
    corpBenefitDetail:
      "헬스장 지원/중식 제공/생일자 상품권/연차 제도/경조사비 지원",
  },
];

const CompanyDetailPage = () => {
  const { corpNo } = useParams();

  const company = dummyCompanyList.find((item) => item.corpNo === corpNo);

  if (!company) {
    return (
      <main className="container">
        <SectionHeader title="기업정보" />
        <p style={{ padding: "40px", textAlign: "center", color: "#999" }}>
          존재하지 않는 기업입니다.
        </p>
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
            <div className="company-actions">
              <button className="btn-save">🔖 저장</button>
              <button className="btn-report">🚨 신고하기</button>
            </div>
          </div>

          <div className="company-basic-info">
            <p>
              <strong>기업 형태 |</strong> {company.corpType}
            </p>
            <p>
              <strong>대표명 |</strong> {company.corpCeoName}
            </p>
            <p>
              <strong>주소 |</strong> {company.corpAddr}
            </p>
            <p>
              <strong>개업일자 |</strong> {company.corpOpenDate}
            </p>
            <p>
              <strong>홈페이지 |</strong>{" "}
              <a href={company.corpHomeLink} target="_blank" rel="noreferrer">
                {company.corpHomeLink}
              </a>
            </p>
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
    </main>
  );
};

export default CompanyDetailPage;
