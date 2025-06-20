import "./CompanyCard.css";

const CompanyCard = ({ company }) => {
  return (
    <div className="company-card">
      {/* 로고 영역 */}
      <div className="company-card-logo-area">
        <img src={company.corpLogo} alt="logo" className="company-logo" />
      </div>

      {/* 회사명 */}
      <h3 className="company-name">{company.corpName}</h3>

      {/* 기업형태 + 모집중인 공고 */}
      <p className="company-info">
        {company.corpType} &nbsp; | &nbsp; 모집중인 채용공고{" "}
        {company.recruitCount}
      </p>

      {/* 메타 정보 */}
      <div className="company-meta">
        <span>👁 {company.views}</span>
        <span>🔖{company.favs}</span>
      </div>
    </div>
  );
};

export default CompanyCard;
