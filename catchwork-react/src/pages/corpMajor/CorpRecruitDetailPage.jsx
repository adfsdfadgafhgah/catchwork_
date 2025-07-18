import { useEffect, useState, useRef } from "react";
import {
  useParams,
  useNavigate,
  useOutletContext,
  Link,
} from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import styles from "./CorpRecruitDetailPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";
import FloatButton from "../../components/common/FloatButton";
import { FLOAT_BUTTON_PRESETS } from "../../components/common/ButtonConfigs";
import DeadlineTimer from "../../components/common/DeadlineTimer";
import ReportModalPage from "../support/ReportModalPage";
import KakaoMapPreview from "../../components/common/KakaoMapPreview";
import defaultImg from "../../assets/icon.png";

export default function CorpRecruitDetailPage() {
  const logoImgUrl = import.meta.env.VITE_FILE_COMPANY_IMG_URL;
  const { recruitNo } = useParams();
  const navigate = useNavigate();
  const [recruit, setRecruit] = useState(null);
  const [liked, setLiked] = useState(false); // 좋아요 기능
  const [likeCount, setLikeCount] = useState(0); // 좋아요 기능
  const [likeLoading, setLikeLoading] = useState(false);
  const { memNo, memType } = useOutletContext();
  const isWriter = memNo && memNo === recruit?.memNo && memType === 1;
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTargetNo, setReportTargetNo] = useState(null); // 신고 대상 번호
  const [reportTargetType, setReportTargetType] = useState(null); // 신고 대상 타입
  const [reportTargetNickname, setReportTargetNickname] = useState(null); // 신고 대상 닉네임

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
    if (memNo === undefined || memType === undefined) {
      return;
    }

    const key = `viewed_recruit_${recruitNo}`;
    const now = new Date();
    const today = now.toDateString();
    const lastViewed = getCookie(key);

    const fetchDetail = async () => {
      try {
        const resp = await axiosApi.get(`/corpRecruit/detail/${recruitNo}`, {
          params: { memNo: memNo },
        });
        const data = resp.data;
        setRecruit(data);
        setLiked(data.likedByCurrentUser);
        setLikeCount(data.likeCount);
      } catch (err) {
        console.error("상세 조회 실패:", err);
      }
    };

    const increaseThenFetch = async () => {
      try {
        // 조회수 증가 로직
        if (!lastViewed || new Date(lastViewed).toDateString() !== today) {
          setCookie(key, now.toISOString(), 1); // setCookie 사용 (1일 유효)
          await axiosApi.get(`/corpRecruit/recruitReadCount/${recruitNo}`);
        } else {
        }

        // 항상 상세 재조회
        await fetchDetail();
      } catch (err) {
        console.error("전체 로직 실패:", err);
      }
    };

    increaseThenFetch();
  }, [recruitNo, memNo, memType, navigate]);

  // 공고 마감 핸들러
  const handleEnd = async () => {
    if (!isWriter) {
      alert("마감 처리 권한이 없습니다.");
      return;
    }
    if (!window.confirm("이 공고를 마감처리하시겠습니까?")) return;

    try {
      const resp = await axiosApi.put(`/corpRecruit/end/${recruitNo}`, {
        memNo: memNo,
      });

      if (resp.status === 200) {
        alert("마감처리 되었습니다.");
        navigate("/corpRecruit"); // 목록으로 이동
      } else {
        alert("마감처리에 실패했습니다.");
      }
    } catch (err) {
      console.error("마감처리 실패:", err);
      alert("오류가 발생했습니다.");
    }
  };

  // 공고 수정 페이지로 핸들러
  const handleEdit = () => {
    if (!isWriter) {
      alert("수정 권한이 없습니다.");
      return;
    }
    navigate(`/corpRecruit/edit/${recruitNo}`);
  };

  // 신고 모달창 핸들러
  const handleReportClick = () => {
    // 인자를 받지 않도록 변경
    if (!memNo) {
      // 비로그인
      alert("로그인 후 이용해주세요.");
      navigate("/signin");
      return;
    }
    // 신고 대상 정보는 recruit 상태에서 직접 가져옴
    setReportTargetNo(recruit.recruitNo.toString());
    setReportTargetType("RECRUIT");
    setReportTargetNickname(`[${recruit.corpName}] ${recruit.recruitTitle}`);
    setShowReportModal(true);
  };

  // 신고 모달창 끄기 핸들러
  const handleCloseReport = () => {
    setShowReportModal(false);
  };

  // 공고 삭제 핸들러
  const handleDelete = async () => {
    if (!isWriter) {
      alert("삭제 권한이 없습니다.");
      return;
    }
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const resp = await axiosApi.delete(`/corpRecruit/delete/${recruitNo}`, {
        data: { memNo: memNo },
      });

      if (resp.status === 200) {
        alert("삭제되었습니다.");
        navigate("/corpRecruit"); // 삭제 후 목록으로 이동
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("오류가 발생했습니다.");
    }
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
              <span>
                <i
                  className={`fa-heart ${liked ? "fa-solid" : "fa-regular"}`}
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

      {/* 모달 및 플로팅 버튼 */}
      {showReportModal && recruit && (
        <ReportModalPage
          targetNo={reportTargetNo}
          targetType={reportTargetType}
          targetNickname={reportTargetNickname}
          memberNo={memNo}
          onClose={handleCloseReport}
        />
      )}
      {isWriter ? (
        <FloatButton
          buttons={
            recruit.recruitStatus === 3
              ? FLOAT_BUTTON_PRESETS.deleteOnly(handleDelete)
              : FLOAT_BUTTON_PRESETS.endAndEditAndDelete(
                  handleEnd,
                  handleEdit,
                  handleDelete
                )
          }
        />
      ) : (
        <FloatButton
          buttons={FLOAT_BUTTON_PRESETS.reportOnly(handleReportClick)}
        />
      )}
    </div>
  );
}
