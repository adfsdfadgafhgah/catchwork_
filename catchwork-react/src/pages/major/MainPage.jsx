import React, { useEffect, useState } from "react";
import CompanyItem from "../../components/company/CompanyItem";
import MemberRecruitItem from "../../components/recruit/MemberRecruitItem";
import { axiosApi } from "../../api/axiosAPI";
import { useAuthStore } from "../../stores/authStore";
import styles from "./MainPage.module.css";
import MainBoardItem from "../../components/board/MainBoardItem";
import FloatingNavBar from "../../components/common/FloatingNavBar";

const MainPage = () => {
  const { memType, memNo } = useAuthStore(); // memType: 0(개인), 1(기업)
  const isCorp = memType === 1;

  const [popularRecruits, setPopularRecruits] = useState([]);
  const [latestRecruits, setLatestRecruits] = useState([]);
  const [popularCompanies, setPopularCompanies] = useState([]);
  const [popularBoards, setPopularBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 로딩 상태를 개별적으로 관리
  const [loadingStates, setLoadingStates] = useState({
    popularRecruits: false,
    latestRecruits: false,
    popularCompanies: false,
    popularBoards: false,
  });

  // 로딩 상태 업데이트 함수
  const updateLoadingState = (key, value) => {
    setLoadingStates((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 모든 로딩이 완료되었는지 확인
  const allLoadingComplete = Object.values(loadingStates).every(
    (state) => state === true
  );

  useEffect(() => {
    // 초기 로딩 상태 설정
    setLoadingStates({
      popularRecruits: false,
      latestRecruits: false,
      popularCompanies: false,
      popularBoards: false,
    });
    setError(null);

    // 인기 공고
    axiosApi
      .get("/memberRecruit/list", {
        params: { sort: "likes", limit: 6, memNo: memNo ? memNo : null },
      })
      .then((res) => {
        setPopularRecruits(res.data);
        updateLoadingState("popularRecruits", true);
      })
      .catch((err) => {
        console.error("인기 공고 로딩 실패:", err);
        setError("인기 공고를 불러오는데 실패했습니다.");
        updateLoadingState("popularRecruits", true); // 에러가 있어도 로딩 완료로 처리
      });

    // 최신 공고
    axiosApi
      .get("/memberRecruit/list", {
        params: { sort: "latest", limit: 6, memNo: memNo ? memNo : null },
      })
      .then((res) => {
        setLatestRecruits(res.data);
        updateLoadingState("latestRecruits", true);
      })
      .catch((err) => {
        console.error("최신 공고 로딩 실패:", err);
        setError("최신 공고를 불러오는데 실패했습니다.");
        updateLoadingState("latestRecruits", true);
      });

    // 인기 기업
    axiosApi
      .get("/company", {
        params: { sort: "main", limit: 6, memNo: memNo ? memNo : null },
      })
      .then((res) => {
        const companies = Array.isArray(res.data) ? res.data : [];
        setPopularCompanies(companies);
        updateLoadingState("popularCompanies", true);
      })
      .catch((err) => {
        console.error("인기 기업 로딩 실패:", err);
        setError("인기 기업을 불러오는데 실패했습니다.");
        updateLoadingState("popularCompanies", true);
      });

    // 인기 게시글
    axiosApi
      .get("/board/boardList", {
        params: { sort: "main", limit: 6, memNo: memNo ? memNo : null },
      })
      .then((res) => {
        const boards = Array.isArray(res.data) ? res.data : [];
        setPopularBoards(boards);
        updateLoadingState("popularBoards", true);
      })
      .catch((err) => {
        console.error("인기 게시글 로딩 실패:", err);
        setError("인기 게시글을 불러오는데 실패했습니다.");
        updateLoadingState("popularBoards", true);
      });
  }, [memNo]);

  useEffect(() => {
    if (allLoadingComplete) {
      setIsLoading(false);
    }
  }, [allLoadingComplete]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <i className="fa-solid fa-spinner fa-spin"></i>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.mainPage}>
      {/* 네비게이션 바: 개인 사용자일 때만 표시 */}
      {!isCorp && <FloatingNavBar />}
      {/* 개인 사용자 대시보드 */}
      {!isCorp && (
        <>
          {/* 인기 채용공고 섹션 */}
          <section className={styles.section} id="popular-recruits">
            <div className={styles.sectionHeader}>
              <h2>인기 채용공고</h2>
            </div>
            <div className={styles.cardGrid}>
              {popularRecruits.length > 0 ? (
                popularRecruits.map((item) => (
                  <MemberRecruitItem
                    key={item.recruitNo}
                    recruit={item}
                    memNo={memNo}
                  />
                ))
              ) : (
                <div className={styles.emptyState}>
                  <i className="fas fa-inbox" />
                  <p>인기 채용공고가 없습니다.</p>
                </div>
              )}
            </div>
          </section>

          {/* 최신 채용공고 섹션 */}
          <section className={styles.section} id="latest-recruits">
            <div className={styles.sectionHeader}>
              <h2>최신 채용공고</h2>
            </div>
            <div className={styles.cardGrid}>
              {latestRecruits.length > 0 ? (
                latestRecruits.map((item) => (
                  <MemberRecruitItem
                    key={item.recruitNo}
                    recruit={item}
                    memNo={memNo}
                  />
                ))
              ) : (
                <div className={styles.emptyState}>
                  <i className="fas fa-inbox" />
                  <p>최신 채용공고가 없습니다.</p>
                </div>
              )}
            </div>
          </section>

          {/* 인기 기업정보 섹션 */}
          <section className={styles.section} id="popular-companies">
            <div className={styles.sectionHeader}>
              <h2>인기 기업정보</h2>
            </div>
            <div className={styles.cardGrid}>
              {Array.isArray(popularCompanies) &&
              popularCompanies.length > 0 ? (
                popularCompanies.map((item) => (
                  <CompanyItem
                    key={item.corpRegNo}
                    company={item}
                    memNo={memNo}
                  />
                ))
              ) : (
                <div className={styles.emptyState}>
                  <i className="fas fa-inbox" />
                  <p>인기 기업정보가 없습니다.</p>
                </div>
              )}
            </div>
          </section>

          {/* 인기 게시글 섹션 */}
          <section className={styles.section} id="popular-boards">
            <div className={styles.sectionHeader}>
              <h2>인기 게시글</h2>
            </div>
            <div className={styles.cardGrid}>
              {popularBoards.length > 0 ? (
                popularBoards.map((item) => (
                  <MainBoardItem
                    key={item.boardNo}
                    board={item}
                    memNo={memNo}
                  />
                ))
              ) : (
                <div className={styles.emptyState}>
                  <i className="fas fa-inbox" />
                  <p>인기 게시글이 없습니다.</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* 기업 사용자 대시보드 */}
      {isCorp && (
        <div className={styles.corpDashboard}>
          <div className={styles.welcomeSection}>
            <h1>기업 대시보드</h1>
            <p>채용 관리와 기업 정보를 한눈에 확인하세요.</p>
          </div>

          <div className={styles.quickActions}>
            <button className={styles.actionButton}>
              <i className="fas fa-plus" />새 채용공고 등록
            </button>
            <button className={styles.actionButton}>
              <i className="fas fa-chart-bar" />
              지원자 현황
            </button>
            <button className={styles.actionButton}>
              <i className="fas fa-building" />
              기업 정보 관리
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;
