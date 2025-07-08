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

  // 기존 useState에 추가
  const [recruitJobName, setRecruitJobName] = useState("all");
  const [recruitCareer, setRecruitCareer] = useState("all");
  const [recruitEdu, setRecruitEdu] = useState("all");
  const [corpType, setCorpType] = useState("all");
  const [recruitType, setRecruitType] = useState("all");

  useEffect(() => {
    if (!query) return;

    console.log("🧩 검색 조건 확인:", {
      query,
      type,
      memNo: loginMember?.memNo,
      recruitJobName,
      recruitCareer,
      recruitEdu,
      corpType,
      recruitType,
    });
    setLoading(true);
    const fetchData = async () => {
      try {
        if (type === "recruit") {
          const res = await axiosApi.get("/search/recruit", {
            params: {
              query,
              memNo: loginMember?.memNo || "",
              recruitJobName,
              recruitCareer,
              recruitEdu,
              corpType,
              recruitType,
            },
          });
          console.log("📦 공고 검색 응답:", res.data);
          setRecruitResults(res.data || []);
        } else {
          const res = await axiosApi.get("/search/company", {
            params: {
              query,
              ...(loginMember?.memNo ? { memNo: loginMember.memNo } : {}),
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
  }, [
    query,
    type,
    loginMember?.memNo,
    recruitJobName,
    recruitCareer,
    recruitEdu,
    corpType,
    recruitType,
  ]);

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
          {/* 직무 */}
          <select
            value={recruitJobName}
            onChange={(e) => setRecruitJobName(e.target.value)}
          >
            <option value="all">직무</option>
            <option value="기획·전략">기획·전략</option>
            <option value="법무·사무·총무">법무·사무·총무</option>
            <option value="인사·HR">인사·HR</option>
            <option value="회계·세무">회계·세무</option>
            <option value="마케팅·광고·MD">마케팅·광고·MD</option>
            <option value="AI·개발·데이터">AI·개발·데이터</option>
            <option value="디자인">디자인</option>
            <option value="물류·무역">물류·무역</option>
            <option value="운전·배송·배송">운전·배송·배송</option>
            <option value="영업">영업</option>
            <option value="고객상담·TM">고객상담·TM</option>
            <option value="금융·보험">금융·보험</option>
            <option value="식·음료">식·음료</option>
            <option value="건축·시설">건축·시설</option>
            <option value="고객서비스·리테일">고객서비스·리테일</option>
            <option value="엔지니어링·설계">엔지니어링·설계</option>
            <option value="제조·생산">제조·생산</option>
            <option value="교육">교육</option>
            <option value="의료·바이오">의료·바이오</option>
            <option value="미디어·문화·스포츠">미디어·문화·스포츠</option>
            <option value="공공·복지">공공·복지</option>
            <option value="기타">기타</option>
          </select>

          {/* 경력 */}
          <select
            value={recruitCareer}
            onChange={(e) => setRecruitCareer(e.target.value)}
          >
            <option value="all">경력</option>
            <option value="신입">신입</option>
            <option value="1~3년">경력(1~3년)</option>
            <option value="4~6년">경력(4~6년)</option>
            <option value="7~9년">경력(7~9년)</option>
            <option value="10~15년">경력(10~15년)</option>
            <option value="16~20년">경력(16~20년)</option>
            <option value="21년 이상">경력(21년 이상)</option>
            <option value="경력무관">경력무관</option>
          </select>

          {/* 학력 */}
          <select
            value={recruitEdu}
            onChange={(e) => setRecruitEdu(e.target.value)}
          >
            <option value="all">학력</option>
            <option value="고졸">고졸</option>
            <option value="전문학사">전문학사</option>
            <option value="학사">학사</option>
            <option value="석사">석사</option>
            <option value="박사">박사</option>
            <option value="학력무관">학력무관</option>
          </select>

          {/* 기업형태 */}
          <select
            value={corpType}
            onChange={(e) => setCorpType(e.target.value)}
          >
            <option value="all">기업형태</option>
            <option value="대기업">대기업</option>
            <option value="중견기업">중견기업</option>
            <option value="중소기업">중소기업</option>
            <option value="공기업">공기업</option>
            <option value="스타트업">스타트업</option>
            <option value="외국계기업">외국계기업</option>
            <option value="기타">기타</option>
          </select>

          {/* 고용형태 */}
          <select
            value={recruitType}
            onChange={(e) => setRecruitType(e.target.value)}
          >
            <option value="all">고용형태</option>
            <option value="정규직">정규직</option>
            <option value="계약직">계약직</option>
            <option value="인턴">인턴</option>
            <option value="일용직">일용직</option>
            <option value="프리랜서">프리랜서</option>
            <option value="파견직">파견직</option>
            <option value="기타">기타</option>
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
