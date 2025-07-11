import MemberRecruitList from "../../components/recruit/MemberRecruitList";
import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import SectionHeader from "../../components/common/SectionHeader";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";
import styles from "../corpMajor/CorpRecruitListPage.module.css";

function MyRecruitPage() {
  const { loginMember } = useOutletContext();
  const [recruits, setRecruits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 직무, 근무지역, 경력, 학력, 기업형태, 고용형태 필터
  const [recruitJobNameFilter, setRecruitJobNameFilter] = useState("all"); // 직무
  const [recruitJobAreaFilter, setRecruitJobAreaFilter] = useState("all"); // 근무지역
  const [recruitCareerFilter, setRecruitCareerFilter] = useState("all"); // 경력
  const [recruitEduFilter, setRecruitEduFilter] = useState("all"); // 학력
  const [corpTypeFilter, setCorpTypeFilter] = useState("all"); // 기업형태
  const [recruitTypeFilter, setRecruitTypeFilter] = useState("all"); // 고용형태

  // 공고 목록 불러오기 (정렬 + 검색)
  useEffect(() => {
    fetchRecruitList();
  }, [
    recruitJobNameFilter,
    recruitJobAreaFilter,
    recruitCareerFilter,
    recruitEduFilter,
    corpTypeFilter,
    recruitTypeFilter,
    loginMember.memNo,
  ]);

  // 검색어 입력 후 엔터 누르면 검색 모드 해제
  const handleSearch = (e) => {
    if (e.target.value.trim() !== "" && e.key === "Enter") {
      const currentSearchTerm = e.target.value;
      setSearchTerm(currentSearchTerm);
      fetchRecruitList();
    }
  };

  // 공고 목록 불러오기 (정렬 + 검색)
  const fetchRecruitList = async () => {
    const params = {
      recruitJobName: recruitJobNameFilter,
      recruitJobArea: recruitJobAreaFilter,
      recruitCareer: recruitCareerFilter,
      recruitEdu: recruitEduFilter,
      corpType: corpTypeFilter,
      recruitType: recruitTypeFilter,
      query: searchTerm,
      memNo: loginMember.memNo,
    };

    try {
      setIsLoading(true);
      const resp = await axiosApi.get("/myPage/myRecruitList", { params });

      if (resp.status === 200) {
        const list = resp.data;
        setRecruits(list);
      }
    } catch (err) {
      console.error("채용공고 목록 조회 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={styles.recruitListPage}>
      <SectionHeader title="채용공고" />

      <div className={styles.controls}>
        <select
          className={styles.sortSelect}
          value={recruitJobNameFilter}
          onChange={(e) => setRecruitJobNameFilter(e.target.value)}
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
          <option value="의료·바이오">의료·바이오</option>
          <option value="기타">기타</option>
        </select>

        <select
          className={styles.sortSelect}
          value={recruitJobAreaFilter}
          onChange={(e) => setRecruitJobAreaFilter(e.target.value)}
        >
          <option value="all">근무지역</option>
          <option value="서울">서울</option>
          <option value="부산">부산</option>
          <option value="대구">대구</option>
          <option value="인천">인천</option>
          <option value="광주">광주</option>
          <option value="대전">대전</option>
          <option value="울산">울산</option>
          <option value="세종">세종</option>
          <option value="경기">경기</option>
          <option value="강원">강원</option>
          <option value="충북">충북</option>
          <option value="충남">충남</option>
          <option value="전북">전북</option>
          <option value="전남">전남</option>
          <option value="경북">경북</option>
          <option value="경남">경남</option>
          <option value="제주">제주</option>
          <option value="기타">기타</option>
        </select>

        <select
          className={styles.sortSelect}
          value={recruitCareerFilter}
          onChange={(e) => setRecruitCareerFilter(e.target.value)}
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

        <select
          className={styles.sortSelect}
          value={recruitEduFilter}
          onChange={(e) => setRecruitEduFilter(e.target.value)}
        >
          <option value="all">학력</option>
          <option value="고졸">고졸</option>
          <option value="전문학사">전문학사</option>
          <option value="학사">학사</option>
          <option value="석사">석사</option>
          <option value="박사">박사</option>
          <option value="학력무관">학력무관</option>
        </select>

        <select
          className={styles.sortSelect}
          value={corpTypeFilter}
          onChange={(e) => setCorpTypeFilter(e.target.value)}
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

        <select
          className={styles.sortSelect}
          value={recruitTypeFilter}
          onChange={(e) => setRecruitTypeFilter(e.target.value)}
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

        <div className={styles.searchBox}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="검색 키워드를 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={handleSearch}
          />
        </div>
      </div>

      {recruits.length > 0 ? (
        <MemberRecruitList recruits={recruits} loginMember={loginMember} />
      ) : (
        <p className={styles.noResult}>검색 결과가 없습니다.</p>
      )}

      <ScrollToTopButton />
    </div>
  );
}

export default MyRecruitPage;
