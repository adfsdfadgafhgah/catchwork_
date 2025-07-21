import { useEffect, useState, useRef } from "react";
import {
  useParams,
  useNavigate,
  useOutletContext,
  Link,
} from "react-router-dom";
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

  // 지도 컨테이너를 참조하기 위한 ref 생성
  const mapRef = useRef(null);

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
        } else {
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
      navigate(`/signin`);
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
  const handleMapClick = (address) => {
    const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(
      address
    )}`;
    window.open(kakaoMapUrl, "_blank");
  };

  const handleScrollToMap = (e) => {
    e.preventDefault(); // a 태그의 기본 동작 방지
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (!recruit) return <div>로딩 중...</div>;

  // 지원 자격 및 근무 조건 데이터를 배열로 만듭니다.
  const conditions = [
    {
      icon: "fa-solid fa-briefcase",
      label: "경력",
      value: recruit.recruitCareer,
    },
    {
      icon: "fa-solid fa-file-contract",
      label: "고용형태",
      value: recruit.recruitType,
    },
    {
      icon: "fa-solid fa-user-graduate",
      label: "학력",
      value: recruit.recruitEdu,
    },
    {
      icon: "fa-solid fa-map-marker-alt",
      label: "근무지",
      value: recruit.recruitJobArea,
    },
    {
      icon: "fa-solid fa-users",
      label: "모집인원",
      value: recruit.recruitHeadcount,
    },
    { icon: "fa-solid fa-coins", label: "연봉", value: recruit.recruitSalary },
  ];

  return (
    <div className={styles.detailPageWrap}>
      <SectionHeader title="채용공고 상세정보" />

      <div className={styles.card}>
        <div className={styles.corpHeader}>
          <Link to={`/company/${recruit.corpNo}`}>
            <img
              src={
                recruit?.corpLogo
                  ? `${logoImgUrl}/${recruit.corpLogo}`
                  : defaultImg
              }
              alt="기업로고"
              className={styles.corpLogo}
            />
          </Link>
          <div className={styles.corpInfoText}>
            <Link
              to={`/company/${recruit.corpNo}`}
              className={styles.corpNameLink}
            >
              <span className={styles.corpName}>{recruit.corpName}</span>{" "}
              <span className={styles.corpType}>{recruit.corpType}</span>
            </Link>

            <h2 className={styles.recruitTitle}>
              [{recruit.corpMemDept}] {recruit.recruitTitle}
            </h2>
            <p className={styles.recruitDates}>
              {recruit.recruitStartDate} ~ {recruit.recruitEndDate}
            </p>
            <div className={styles.engagementInfo}>
              <span>
                <i className="fa-regular fa-eye" /> {recruit.recruitReadCount}
              </span>
              <span onClick={toggleLike} style={{ cursor: "pointer" }}>
                <i
                  className={`fa-heart ${styles.likeIcon} ${
                    liked ? "fa-solid" : "fa-regular"
                  }`}
                  style={{
                    color: liked ? "var(--main-color)" : "var(--gray01)",
                  }}
                />{" "}
                {likeCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 직무 상세 정보 섹션 */}
      <div className={styles.card}>
        <section className={styles.jobSection}>
          <h3 className={styles.jobName}>{recruit.recruitJobName}</h3>
          <p className={styles.jobDetail}>{recruit.recruitJobDetail}</p>
        </section>
      </div>

      {/* 자격 및 조건 섹션을 새로운 그리드 UI로 변경 */}
      <div className={styles.card}>
        <h4 className={styles.cardTitle}>지원자격 및 근무조건</h4>
        <section className={styles.recruitConditions}>
          <div className={styles.infoGrid}>
            {conditions.map((item, index) => (
              <div key={index} className={styles.infoBlock}>
                <div className={styles.infoIcon}>
                  <i className={item.icon}></i>
                </div>
                <div className={styles.infoText}>
                  <span className={styles.infoLabel}>{item.label}</span>
                  {/* 근무지 항목에만 지도보기 링크를 추가하기 위한 구조 변경 */}
                  <div className={styles.infoValueContainer}>
                    <span className={styles.infoValue}>{item.value}</span>
                    {item.label === "근무지" && (
                      <a
                        href="#map"
                        onClick={handleScrollToMap}
                        className={styles.mapLink}
                      >
                        {" "}
                        지도 <i className="fa-solid fa-chevron-right"></i>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 상세 정보 섹션의 구조를 개선 */}
      <div className={styles.card}>
        <section className={styles.detailSections}>
          <div className={styles.detailItem}>
            <h4 className={styles.sectionTitle}>
              <i className="fa-solid fa-file-alt"></i> 제출 서류
            </h4>
            <p>{recruit.recruitDocx}</p>
          </div>

          <div className={styles.detailItem}>
            <h4 className={styles.sectionTitle}>
              <i className="fa-solid fa-pen-to-square"></i> 접수 방법
            </h4>
            <p>{recruit.recruitApply}</p>
          </div>

          <div className={styles.detailItem}>
            <h4 className={styles.sectionTitle}>
              <i className="fa-solid fa-link"></i> 채용 사이트
            </h4>

            {recruit.recruitCorpUrl}
          </div>

          <div className={styles.detailItem}>
            <h4 className={styles.sectionTitle}>
              <i className="fa-solid fa-people-arrows"></i> 채용 단계
            </h4>
            <p>{recruit.recruitHireDetail}</p>
          </div>

          <div className={styles.detailItem}>
            <h4 className={styles.sectionTitle}>
              <i className="fa-solid fa-gift"></i> 복리후생
            </h4>
            <p>{recruit.corpBenefit}</p>
            <p>{recruit.corpBenefitDetail}</p>
          </div>

          <div className={styles.detailItem}>
            <h4 className={styles.sectionTitle}>
              <i className="fa-solid fa-circle-info"></i> 기타 사항
            </h4>
            <p>{recruit.recruitEtc}</p>
          </div>
        </section>
      </div>

      {/* 카카오맵 미리보기 */}
      <div className={styles.mapContainer} ref={mapRef}>
        <KakaoMapPreview
          address={recruit.recruitJobArea}
          onClick={handleMapClick}
        />
      </div>

      {/* 마감 타이머 */}
      <div className={styles.deadlineTimerCard}>
        {" "}
        <DeadlineTimer
          startDate={recruit.recruitStartDate}
          endDate={recruit.recruitEndDate}
          status={recruit.recruitStatus}
        />
      </div>

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

      <FloatButton
        className={styles.floatButtonWrapper}
        buttons={FLOAT_BUTTON_PRESETS.submitAndReport(
          handleSubmit,
          handleReport
        )}
      />
    </div>
  );
}
