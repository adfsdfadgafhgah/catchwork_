import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import { Link } from "react-router-dom";
import CompanyItem from "../../components/company/CompanyItem";
import MemberRecruitList from "../../components/recruit/MemberRecruitList";
import useLoginMember from "../../stores/loginMember";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";
import "./SearchResultPage.css";

const SearchResultPage = () => {
  const { loginMember } = useLoginMember();
  const [params] = useSearchParams();
  const query = params.get("query")?.trim() || "";
  const type = params.get("type") || "recruit"; // 기본값은 채용공고

  const [companyResults, setCompanyResults] = useState([]);
  const [recruitResults, setRecruitResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sortOrder, setSortOrder] = useState("career"); // 기본값: 경력
  const [statusFilter, setStatusFilter] = useState("all"); // 전체, 채용중, 마감됨

  useEffect(() => {
    if (!query) return;

    console.log("🧩 검색 조건 확인:", {
      query,
      type,
      memNo: loginMember?.memNo,
      sortOrder,
      statusFilter,
    });
    setLoading(true);
    const fetchData = async () => {
      try {
        if (type === "recruit") {
          const res = await axiosApi.get("/search/recruit", {
            params: {
              query,
              memNo: loginMember?.memNo || "",
              sort: sortOrder,
              status: statusFilter,
            },
          });
          console.log("📦 공고 검색 응답:", res.data);
          setRecruitResults(res.data || []);
        } else {
          const res = await axiosApi.get("/search/company", {
            params: {
              query,
              memNo: loginMember?.memNo || "",
            },
          });
          console.log("🏢 기업 검색 응답:", res.data);
          setCompanyResults(res.data || []);
        }
      } catch (err) {
        console.error("검색 실패", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query, type, loginMember?.memNo, sortOrder, statusFilter]);

  return (
    <main className="container">
      {/* 탭 버튼 */}
      <div className="search-tabs">
        <Link
          className={type === "recruit" ? "active" : ""}
          to={`/search?query=${query}&type=recruit`}
        >
          채용공고
        </Link>
        <Link
          className={type === "company" ? "active" : ""}
          to={`/search?query=${query}&type=company`}
        >
          기업정보
        </Link>
      </div>

      {/* 정렬 드롭다운 (채용공고일 때만) */}
      {type === "recruit" && (
        <div className="search-controls">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="career">경력순</option>
            <option value="edu">학력순</option>
            <option value="corpType">기업형태순</option>
            <option value="recruitType">고용형태순</option>
          </select>
        </div>
      )}

      <h2>🔍 "{query}" 검색 결과</h2>

      {/* 로딩 중 */}
      {loading ? (
        <p>로딩 중...</p>
      ) : type === "company" ? (
        companyResults.length > 0 ? (
          <div className="company-grid">
            {companyResults.map((c) => (
              <CompanyItem key={c.corpNo} company={c} />
            ))}
          </div>
        ) : (
          <p>검색된 기업이 없습니다.</p>
        )
      ) : recruitResults.length > 0 ? (
        <MemberRecruitList
          recruits={recruitResults}
          loginMember={loginMember}
        />
      ) : (
        <p>검색된 공고가 없습니다.</p>
      )}
      <ScrollToTopButton />
    </main>
  );
};

export default SearchResultPage;
