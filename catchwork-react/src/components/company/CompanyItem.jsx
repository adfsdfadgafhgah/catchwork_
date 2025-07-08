import { useState } from "react";
import { Link } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import useLoginMember from "../../stores/loginMember";
import "./CompanyItem.css";

const CompanyItem = ({ company: initialCompany }) => {
  const { loginMember } = useLoginMember();
  const [company, setCompany] = useState(initialCompany);

  const handleToggleBookmark = async (e) => {
    e.preventDefault(); // 링크 이동 방지

    if (!loginMember || !loginMember.memNo) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }

    try {
      const res = await axiosApi.post("/company/toggle-favorite", {
        corpNo: company.corpNo,
        memNo: loginMember.memNo, // 이미 이 방식대로 controller에서 사용 중
      });

      const { isSaved, totalFav } = res.data;

      setCompany((prev) => ({
        ...prev,
        isSaved,
        favs: totalFav,
      }));
    } catch (err) {
      console.error("관심 기업 토글 실패:", err);
      alert("즐겨찾기 변경에 실패했습니다.");
    }
  };

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
          {company.corpType} &nbsp;|&nbsp; 모집중인 채용공고{" "}
          {company.recruitCount}
        </p>

        {/* 메타 정보 */}
        <div className="company-meta">
          <div className="company-bookmark-area">
            <div className="bookmark" onClick={handleToggleBookmark}>
              <i
                className={
                  company.isSaved === 1
                    ? "fa-solid fa-bookmark"
                    : "fa-regular fa-bookmark"
                }
              ></i>{" "}
              {company.favs ?? 0}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CompanyItem;
