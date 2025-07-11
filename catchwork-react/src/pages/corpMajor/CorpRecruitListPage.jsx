import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import RecruitList from "../../components/recruit/RecruitList";
import styles from "./CorpRecruitListPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";
import { useNavigate } from "react-router-dom";
import FloatButton from "../../components/common/FloatButton";
import { FLOAT_BUTTON_PRESETS } from "../../components/common/ButtonConfigs";
import useLoginMember from "../../stores/loginMember";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";

export default function CorpRecruitListPage() {
  const [recruits, setRecruits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { loginMember, setLoginMember } = useLoginMember();
  const navigate = useNavigate();
  // 정렬, 상태, 작성자 필터
  const [statusFilter, setStatusFilter] = useState("all"); // 전체, 모집중, 마감됨
  const [sortOrder, setSortOrder] = useState("latest"); // 최신순, 오래된순, 조회수순, 좋아요순
  const [writerFilter, setWriterFilter] = useState("all"); // 전체, 내가쓴공고
  const [corpNo, setCorpNo] = useState();
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState(""); // 실제 검색에 쓸 값
  const [corpMemRoleCheck, setCorpMemRoleCheck] = useState("N"); // 'Y'면 대표이사

  // 로그인 정보 세팅
  useEffect(() => {
    if (!loginMember?.memNo) {
      setLoginMember();
    }
  }, []);

  // corpNo 조회
  useEffect(() => {
    const fetchCorpNo = async () => {
      try {
        if (loginMember?.memType === 1 && loginMember?.memNo) {
          const resp = await axiosApi.get("/corpcompany/corpNo", {
            params: { memNo: loginMember.memNo },
          });
          if (resp.status === 200) {
            console.log("🚨 resp.data:", resp.data);
            const { corpNo, corpMemRoleCheck } = resp.data;
            console.log("🚨 corpNo:", corpNo);
            console.log("🚨 corpMemRoleCheck:", corpMemRoleCheck);
            setCorpNo(corpNo);
            setCorpMemRoleCheck(corpMemRoleCheck);
          }
        }
      } catch (err) {
        console.error("corpNo 조회 실패:", err);
      }
    };

    fetchCorpNo();
  }, [loginMember]);

  // 공고 목록 불러오기 (필터링, 정렬)
  useEffect(() => {
    if (corpNo) {
      fetchRecruitList();
    }
  }, [sortOrder, statusFilter, writerFilter, corpNo, confirmedSearchTerm]);

  // 공고 목록 불러오기 (정렬 + 검색)
  const fetchRecruitList = async () => {
    if (!corpNo) return;
    try {
      setIsLoading(true);
      const resp = await axiosApi.get("/corpRecruit/list", {
        params: {
          sort: sortOrder,
          status: statusFilter,
          writer: writerFilter,
          query: confirmedSearchTerm,
          memNo: loginMember?.memNo || "",
          corpNo: corpNo,
        },
      });

      if (resp.status === 200) {
        const list = resp.data;

        if (statusFilter === "closed") {
          const now = new Date();
          const filtered = list.filter((recruit) => {
            const endDate = new Date(`${recruit.recruitEndDate}T23:59:59`);
            return (
              recruit.recruitStatus === 3 ||
              (recruit.recruitStatus === 0 && endDate < now)
            );
          });
          setRecruits(filtered);
        } else {
          setRecruits(list);
        }
      }
    } catch (err) {
      console.error("채용공고 목록 조회 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 정렬 선택
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleSearch = () => {
    setConfirmedSearchTerm(searchTerm); // 검색어 확정
  };

  // 공고 작성하기 버튼
  const handleWrite = () => {
    if (!loginMember?.memNo) {
      alert("로그인 후 이용해주세요.");
      navigate("/signin");
      return;
    }
    if (corpMemRoleCheck === "Y") {
      alert("대표이사 계정은 공고 작성이 불가능합니다.");
      return;
    }
    navigate("/corpRecruit/write");
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  console.log("🧪 렌더링 조건 확인:");
  console.log("   - loginMember.memType =", loginMember?.memType);
  console.log("   - corpMemRoleCheck =", corpMemRoleCheck);

  return (
    <div className={styles.recruitListPage}>
      <SectionHeader title="채용공고" />

      <div className={styles.controls}>
        <select
          className={styles.sortSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">전체</option>
          <option value="open">채용중</option>
          <option value="closed">마감됨</option>
        </select>

        <select
          className={styles.sortSelect}
          value={sortOrder}
          onChange={handleSortChange}
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="views">조회수순</option>
          <option value="likes">좋아요순</option>
        </select>

        <select
          className={styles.sortSelect}
          value={writerFilter}
          onChange={(e) => setWriterFilter(e.target.value)}
        >
          <option value="all">전체</option>
          <option value="me">내 공고</option>
        </select>

        <div className={styles.searchBox}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="직종명, 취업이야기, 취준진담"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>
      </div>

      {/* 검색 결과 유무에 따른 조건 렌더링 */}
      {isLoading ? (
        <h1>Loading...</h1>
      ) : recruits.length > 0 ? (
        <RecruitList
          key={loginMember?.memNo}
          recruits={recruits}
          loginMember={loginMember}
        />
      ) : (
        <p className={styles.noResult}>검색 결과가 없습니다.</p>
      )}

      {loginMember?.memType === 1 && corpMemRoleCheck === "Y" ? null : (
        <FloatButton buttons={FLOAT_BUTTON_PRESETS.writeOnly(handleWrite)} />
      )}
      <ScrollToTopButton />
    </div>
  );
}
