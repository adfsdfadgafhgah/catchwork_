import { Link } from "react-router-dom";
import "./CompanyItem.css";

const CompanyItem = ({ company }) => {
  return (
    <Link to={`/company/${company.corpNo}`} className="company-item-link">
      <div className="company-item">
        {/* 로고 영역 */}
        <div className="company-item-logo-area">
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
          <span className="material-symbols-outlined">visibility</span>
          <span>{company.views}</span>
          <span
            className="bookmark-icon material-symbols-outlined"
            style={{ color: company.liked === 1 ? "black" : "inherit" }}
          >
            bookmark
          </span>
          <span>{company.favs}</span>
        </div>
      </div>
    </Link>
  );
};

export default CompanyItem;
