import { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import styles from "../corpMajor/CorpRecruitDetailPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";
import FloatButton from "../../components/common/FloatButton";
import { FLOAT_BUTTON_PRESETS } from "../../components/common/ButtonConfigs";
import DeadlineTimer from "../../components/common/DeadlineTimer";
import ReportModalPage from "../support/ReportModalPage";
import KakaoMapPreview from "../../components/common/KakaoMapPreview";
import defaultImg from "../../assets/icon.png";

export default function MemberRecruitDetailPage() {
  const logoImgUrl = import.meta.env.VITE_FILE_COMPANY_IMG_URL;
  const { memNo } = useOutletContext();
  const { recruitNo } = useParams();
  const navigate = useNavigate();
  const [recruit, setRecruit] = useState(null);
  const [liked, setLiked] = useState(false); // 좋아요 기능
  const [likeCount, setLikeCount] = useState(0); // 좋아요 기능
  const [likeLoading, setLikeLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // 신고하기 관련 (기존과 동일)
  const [reportTargetNo, setReportTargetNo] = useState(null);
  const [reportTargetType, setReportTargetType] = useState(null);
  const [reportTargetNickname, setReportTargetNickname] = useState(null);

  // 쿠키 헬퍼 함수 정의
  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  };

  const getCookie = (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  // 공고 상세 조회 + 조회수 증가
  useEffect(() => {
    if (memNo === undefined) {
      return;
    }

    const key = `viewed_recruit_${recruitNo}`;
    const now = new Date();
    const today = now.toDateString();
    const lastViewed = getCookie(key);

    const fetchDetail = async () => {
      try {
        const resp = await axiosApi.get(`/memberRecruit/detail/${recruitNo}`, {
          params: { memNo: memNo },
        });
        const data = resp.data;
        setRecruit(data);
        setLiked(data.likedByCurrentUser);
        setLikeCount(data.likeCount);
      } catch (err) {
        console.error("상세 조회 실패:", err);
        // 게시글이 없거나 접근 권한이 없을 경우 목록으로 이동
        alert("채용공고를 불러오지 못했습니다.");
        navigate("/memberRecruit"); // 또는 적절한 목록 페이지 경로
      }
    };

    const increaseThenFetch = async () => {
      try {
        // 조회수 증가 로직
        if (!lastViewed || new Date(lastViewed).toDateString() !== today) {
          setCookie(key, now.toISOString(), 1); // setCookie 사용 (1일 유효)
          await axiosApi.get(`/memberRecruit/recruitReadCount/${recruitNo}`);
          console.log("조회수 증가 후 상세 다시 조회");
        } else {
          console.log("오늘 이미 조회함");
        }

        // 항상 상세 재조회
        await fetchDetail();
      } catch (err) {
        console.error("전체 로직 실패:", err);
      }
    };

    increaseThenFetch();
  }, [recruitNo, memNo, navigate]);

  // 좋아요 토글 함수 추가
  const toggleLike = async () => {
    if (!memNo) {
      alert("로그인 후 이용 가능합니다.");
      navigate("/signin");
      return;
    }

    if (likeLoading) return;
    setLikeLoading(true);

    try {
      const resp = await axiosApi.post("/memberRecruit/like", {
        recruitNo: recruit.recruitNo,
        memNo: memNo,
      });

      if (resp.data.result === "liked") {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      } else {
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      }
    } catch (err) {
      console.error("좋아요 실패:", err);
    } finally {
      setLikeLoading(false);
    }
  };

  // 이력서 제출 페이지로 이동 핸들러
  const handleSubmit = async () => {
    if (!memNo) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }

    try {
      const resp = await axiosApi.post("/memberRecruit/submitCVCheck", {
        recruitNo: recruit.recruitNo,
        memNo: memNo,
      });

      if (resp.data.exists) {
        // 이미 제출한 이력서가 있는 경우
        alert("이미 제출한 이력서가 있습니다.");
        return;
      }

      // 없으면 이력서 작성 페이지로 이동
      navigate(`/cv?recruitNo=${recruitNo}`);
    } catch (err) {
      console.error("이력서 제출 여부 확인 실패:", err);
      alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  // 신고 모달창 핸들러
  const handleReport = () => {
    // memNo prop을 사용하여 로그인 여부를 확인합니다.
    if (!memNo) {
      alert("로그인 후 이용해주세요.");
      navigate("/signin"); // 로그인 페이지로 이동
      return;
    }
    setReportTargetNo(recruit.recruitNo.toString());
    setReportTargetType("RECRUIT");
    setReportTargetNickname(`[${recruit.corpName}] ${recruit.recruitTitle}`);
    setShowReportModal(true);
  };

  // 신고 모달창 끄기 핸들러
  const handleCloseReport = () => {
    setShowReportModal(false);
  };

  // 카카오맵 마커 클릭 핸들러
  // 이 함수가 정의되지 않았을 가능성을 낮추기 위해 컴포넌트 최상단에 정의합니다.
  const handleMapClick = (address) => {
    const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(
      address
    )}`;
    window.open(kakaoMapUrl, "_blank");
  };

  if (!recruit) return <div>로딩 중...</div>;

  return (
    <div className={styles.detailPageWrap}>
      {/* 섹션 헤더 */}
      <SectionHeader title="채용공고 상세정보" />
      {/* 기업 정보 */}
      <div className={styles.corpHeader}>
        <img
          src={
            recruit?.corpLogo ? `${logoImgUrl}/${recruit.corpLogo}` : defaultImg
          }
          alt="기업로고"
          className={styles.corpLogo}
        />
        <div className={styles.corpInfoText}>
          <span className={styles.corpName}>{recruit.corpName}</span>
          <span className={styles.corpType}>{recruit.corpType}</span>
          {/* 채용 제목 */}
          <h2 className={styles.recruitTitle}>
            [{recruit.memName}] {recruit.recruitTitle}
          </h2>
          <p className={styles.recruitDates}>
            {recruit.recruitStartDate} ~ {recruit.recruitEndDate}
          </p>

          {/* 조회수/좋아요 표시 라인 추가 */}
          <div className={styles.engagementInfo}>
            <span>
              <i className="fa-regular fa-eye" /> {recruit.recruitReadCount}{" "}
              &nbsp;&nbsp;
            </span>

            <span onClick={toggleLike} style={{ cursor: "pointer" }}>
              <i
                className={`fa-heart ${liked ? "fa-solid" : "fa-regular"}`}
                style={{ color: liked ? "var(--main-color)" : "gray" }}
              />{" "}
              {likeCount}
            </span>
          </div>
        </div>
      </div>

      {/* 직무명 + 상세 */}
      <section className={styles.jobSection}>
        <h3 className={styles.jobName}>{recruit.recruitJobName}</h3>
        <p className={styles.jobDetail}>{recruit.recruitJobDetail}</p>
      </section>

      {/* 지원 자격 및 근무 조건 */}
      <section className={styles.recruitConditions}>
        <table>
          <tbody>
            <tr>
              <th>경력</th>
              <td>{recruit.recruitCareer}</td>
              <th>고용형태</th>
              <td>{recruit.recruitType}</td>
            </tr>
            <tr>
              <th>학력</th>
              <td>{recruit.recruitEdu}</td>
              <th>근무지</th>
              <td>{recruit.recruitJobArea}</td>
            </tr>
            <tr>
              <th>모집인원</th>
              <td>{recruit.recruitHeadcount}</td>
              <th>연봉</th>
              <td>{recruit.recruitSalary}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <KakaoMapPreview
        address={recruit.recruitJobArea}
        onClick={handleMapClick}
      />

      {/* 상세 정보 섹션 */}
      <section className={styles.detailSections}>
        <h4 className={styles.sectionTitle}>제출 서류</h4>
        <p>{recruit.recruitDocx}</p>

        <h4 className={styles.sectionTitle}>접수 방법</h4>
        <p>{recruit.recruitApply}</p>

        <h4 className={styles.sectionTitle}>채용 사이트</h4>
        <p>{recruit.recruitCorpUrl}</p>

        <h4 className={styles.sectionTitle}>채용 단계</h4>
        <p>{recruit.recruitHireDetail}</p>

        <h4 className={styles.sectionTitle}>복리후생</h4>
        <p>{recruit.corpBenefit}</p>
        <p>{recruit.corpBenefitDetail}</p>

        <h4 className={styles.sectionTitle}>기타 사항</h4>
        <p>{recruit.recruitEtc}</p>
      </section>

      {/* 모달 조건부 렌더링 */}
      {/* 채용공고 신고하기 */}
      {showReportModal && recruit && (
        <ReportModalPage
          targetNo={recruit.recruitNo}
          targetType="RECRUIT"
          targetNickname={`[${recruit.corpName}] ${recruit.recruitTitle}`}
          memberNo={memNo}
          onClose={handleCloseReport}
        />
      )}

      <div className={styles.deadlineTimer}>
        <DeadlineTimer recruitEndDate={recruit.recruitEndDate} />
      </div>

      <FloatButton
        buttons={FLOAT_BUTTON_PRESETS.submitAndReport(
          handleSubmit,
          handleReport
        )}
      />
    </div>
  );
}
