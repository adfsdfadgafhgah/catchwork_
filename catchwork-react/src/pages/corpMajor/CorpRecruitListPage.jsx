import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import RecruitList from "../../components/recruit/RecruitList";
import styles from "./CorpRecruitListPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";
import { useNavigate, useOutletContext } from "react-router-dom";
import FloatButton from "../../components/common/FloatButton";
import { FLOAT_BUTTON_PRESETS } from "../../components/common/ButtonConfigs";
import ScrollToTopButton from "../../components/common/ScrollToTopButton";

export default function CorpRecruitListPage() {
  const [recruits, setRecruits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { memNo, memType } = useOutletContext();
  // 정렬, 상태, 작성자 필터
  const [statusFilter, setStatusFilter] = useState("all"); // 전체, 모집중, 마감됨
  const [sortOrder, setSortOrder] = useState("latest"); // 최신순, 오래된순, 조회수순, 좋아요순
  const [writerFilter, setWriterFilter] = useState("all"); // 전체, 내가쓴공고
  const [corpNo, setCorpNo] = useState();
  const [confirmedSearchTerm, setConfirmedSearchTerm] = useState(""); // 실제 검색에 쓸 값
  const [corpMemRoleCheck, setCorpMemRoleCheck] = useState("N"); // 'Y'면 대표이사

  // 로그인 정보 세팅
  useEffect(() => {
    if (memNo === undefined || memType === undefined) {
      return;
    }

    const fetchCorpNo = async () => {
      // 비로그인 상태 (memNo가 null)이거나 일반회원 (memType이 1이 아님)인 경우
      // corpNo를 null로 설정하고 역할 체크도 N으로 유지하며 API 호출하지 않음
      if (!memNo || memType !== 1) {
        setCorpNo(null);
        setCorpMemRoleCheck("N");
        // 이 경우, 기업회원 관련 정보 로딩은 완료된 것으로 간주
        // 채용공고 목록 로딩은 fetchRecruitList에서 처리
        return;
      }

      // 로그인했고 기업회원 (memType === 1)인 경우에만 corpNo 조회 시도
      try {
        const resp = await axiosApi.get("/corpcompany/corpNo", {
          params: { memNo: memNo },
        });
        if (resp.status === 200) {
          const { corpNo: fetchedCorpNo, corpMemRoleCheck: fetchedRoleCheck } =
            resp.data;
          setCorpNo(fetchedCorpNo);
          setCorpMemRoleCheck(fetchedRoleCheck);
        }
      } catch (err) {
        console.error("corpNo 조회 실패:", err);
        setCorpNo(null); // 실패 시 corpNo 초기화
        setCorpMemRoleCheck("N");
      }
    };

    fetchCorpNo();
  }, [memNo, memType]);

  // 공고 목록 불러오기 (필터링, 정렬)
  useEffect(() => {
    if (
      memNo === undefined ||
      memType === undefined ||
      (memType === 1 && corpNo === null)
    ) {
      return;
    }
    fetchRecruitList();
  }, [
    sortOrder,
    statusFilter,
    writerFilter,
    corpNo,
    confirmedSearchTerm,
    memNo,
    memType,
  ]);

  // 공고 목록 불러오기 (정렬 + 검색)
  const fetchRecruitList = async () => {
    if (!memNo || memType !== 1) {
      setIsLoading(false);
      setRecruits([]);
      return;
    }

    // 기업회원이지만 corpNo가 없는 경우 (회사 정보 미등록)
    if (memType === 1 && !corpNo) {
      setIsLoading(false);
      setRecruits([]);
      return;
    }

    try {
      setIsLoading(true);
      const resp = await axiosApi.get("/corpRecruit/list", {
        params: {
          sort: sortOrder,
          status: statusFilter,
          writer: writerFilter,
          query: confirmedSearchTerm,
          memNo: memNo,
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
    if (!memNo) {
      alert("로그인 후 이용해주세요.");
      navigate("/signin");
      return;
    }
    if (memType !== 1) {
      // 일반 회원
      alert("기업회원만 공고 작성이 가능합니다.");
      return;
    }
    if (!corpNo) {
      // 기업회원이지만 corpNo 없음 (회사 정보 미등록)
      alert("회사 정보 등록 후 공고 작성이 가능합니다.");
      return;
    }
    if (corpMemRoleCheck === "Y") {
      alert("대표이사 계정은 공고 작성이 불가능합니다.");
      return;
    }
    navigate("/corpRecruit/write");
  };

  // 로딩 상태를 더 정확하게 판단
  // memNo 또는 memType이 undefined (아직 useAuthStore 로딩 중)이거나,
  // 기업회원(memType === 1)인데 corpNo가 아직 null인 경우 로딩 중으로 간주
  if (
    memNo === undefined ||
    memType === undefined ||
    (memType === 1 && corpNo === null)
  ) {
    return <h1>Loading...</h1>;
  }

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
          recruits={recruits}
          memNo={memNo}
          corpNo={corpNo}
          memType={memType}
        />
      ) : (
        <p className={styles.noResult}>채용 공고가 없습니다.</p>
      )}

      {memNo && memType === 1 && corpMemRoleCheck !== "Y" ? (
        <FloatButton buttons={FLOAT_BUTTON_PRESETS.writeOnly(handleWrite)} />
      ) : null}
      <ScrollToTopButton />
    </div>
  );
}
