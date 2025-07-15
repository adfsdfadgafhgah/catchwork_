import React, { useEffect, useState } from "react";
import BoardItem from "../../components/board/BoardItem";
import CompanyItem from "../../components/company/CompanyItem";
import MemberRecruitItem from "../../components/recruit/MemberRecruitItem";
import { axiosApi } from "../../api/axiosAPI";
import { useAuthStore } from "../../stores/authStore";
import "./MainPage.css";
import MainBoardItem from "../../components/board/MainBoardItem";

const MainPage = () => {
  const { memType, memNo } = useAuthStore(); // memType: 0(개인), 1(기업)
  const isCorp = memType === 1;

  const [customRecruits, setCustomRecruits] = useState([]);
  const [popularRecruits, setPopularRecruits] = useState([]);
  const [latestRecruits, setLatestRecruits] = useState([]);
  const [popularCompanies, setPopularCompanies] = useState([]);
  const [popularBoards, setPopularBoards] = useState([]);
  const [edu, setEdu] = useState("");

  useEffect(() => {
    // 맞춤형 공고
    // axiosApi
    //   .get("/memberRecruit/list", { params: { type: "custom", limit: 3 } })
    //   .then((res) => setCustomRecruits(res.data));
    // 인기 공고
    axiosApi
      .get("/memberRecruit/list", { params: { sort: "likes", limit: 6 } })
      .then((res) => setPopularRecruits(res.data));
    // 최신 공고
    axiosApi
      .get("/memberRecruit/list", { params: { sort: "latest", limit: 6 } })
      .then((res) => setLatestRecruits(res.data));
    // 인기 기업
    axiosApi
      .get("/company", { params: { sort: "main", limit: 6 } })
      .then((res) => setPopularCompanies(res.data));
    // 인기 게시글
    axiosApi
      .get("/board/boardList", { params: { sort: "main", limit: 6 } })
      .then((res) => {
        const companies = Array.isArray(res.data) ? res.data : [];
        setPopularCompanies(companies);
      });
  }, []);

  return (
    <div className="main-page">
      {/* 개인 */}
      {!isCorp && (
        <>
          {/* 공고 */}
          {memType === 0 && (
            <>
              <section>
                <h2>맞춤형 채용공고</h2>
                <div className="card-grid two-cols">
                  {customRecruits.map((item) => (
                    <MemberRecruitItem key={item.id} recruit={item} />
                  ))}
                </div>
              </section>
              <br></br>
              <hr></hr>
            </>
          )}
          <section>
            <h2>인기 채용공고</h2>
            <div className="card-grid two-cols">
              {popularRecruits.map((item) => (
                <MemberRecruitItem key={item.recruitNo} recruit={item} />
              ))}
            </div>
          </section>
          <br></br>
          <hr></hr>
          <section>
            <h2>최신 채용공고</h2>
            <div className="card-grid two-cols">
              {latestRecruits.map((item) => (
                <MemberRecruitItem key={item.recruitNo} recruit={item} />
              ))}
            </div>
          </section>
          <br></br>
          <hr></hr>
          {/* 기업 */}
          <section>
            <h2>인기 기업정보</h2>
            <div className="card-grid two-cols">
              {Array.isArray(popularCompanies) &&
                popularCompanies.map((item) => (
                  <CompanyItem key={item.corpNo} company={item} />
                ))}
            </div>
          </section>
          <br></br>
          <hr></hr>
          {/* 게시글 */}
          <section>
            <h2>인기 게시글</h2>
            <div className="card-grid two-cols">
              {popularBoards.map((item) => (
                <MainBoardItem key={item.boardNo} board={item} memNo={memNo} />
              ))}
            </div>
          </section>
        </>
      )}

      {/* 기업 */}
      {isCorp && (
        <>
          <div></div>
        </>
      )}
    </div>
  );
};

export default MainPage;
