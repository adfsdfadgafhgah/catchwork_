import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import styles from "../corpMajor/CorpRecruitDetailPage.module.css";
import useLoginMember from "../../stores/loginMember";
import SectionHeader from "../../components/common/SectionHeader";
import FloatButton from "../../components/common/FloatButton";
import { FLOAT_BUTTON_PRESETS } from "../../components/common/ButtonConfigs";
import DeadlineTimer from "../../components/common/DeadlineTimer";
import ReportModalPage from "../support/ReportModalPage";
import KakaoMapPreview from "../../components/common/KakaoMapPreview";
import defaultImg from "../../assets/icon.png";

export default function MemberRecruitDetailPage() {
  const imgUrl = import.meta.env.VITE_FILE_PROFILE_IMG_URL;
  const { recruitNo } = useParams();
  const navigate = useNavigate();
  const [recruit, setRecruit] = useState(null);
  const { loginMember, setLoginMember } = useLoginMember();
  const [liked, setLiked] = useState(false); // 좋아요 기능
  const [likeCount, setLikeCount] = useState(0); // 좋아요 기능
  const [likeLoading, setLikeLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState("");

  // loginMember 가져오기
  useEffect(() => {
    if (!loginMember?.memNo) {
      const fetchLoginMember = async () => {
        await setLoginMember(); // loginMember를 zustand에 갱신
      };
      fetchLoginMember();
    }
  }, []);

  // 공고 상세 조회 + 조회수 증가
  useEffect(() => {
    const key = `viewed_recruit_${recruitNo}`;
    const now = new Date();
    const today = now.toDateString();
    const lastViewed = localStorage.getItem(key);

    const fetchDetail = async () => {
      try {
        const resp = await axiosApi.get(`/memberRecruit/detail/${recruitNo}`, {
          params: { memNo: loginMember?.memNo },
        });
        const data = resp.data;
        setRecruit(data);
        setLiked(data.likedByCurrentUser);
        setLikeCount(data.likeCount);
      } catch (err) {
        console.error("❌ 상세 조회 실패:", err);
      }
    };

    const increaseThenFetch = async () => {
      try {
        // 조회수 증가 로직
        if (!lastViewed || new Date(lastViewed).toDateString() !== today) {
          localStorage.setItem(key, now.toISOString());
          await axiosApi.get(`/memberRecruit/recruitReadCount/${recruitNo}`);
          console.log("📈 조회수 증가 후 상세 다시 조회");
        } else {
          console.log("✅ 오늘 이미 조회함");
        }

        // 항상 상세 재조회
        await fetchDetail();
      } catch (err) {
        console.error("❌ 전체 로직 실패:", err);
      }
    };

    increaseThenFetch();
  }, [recruitNo, loginMember?.memNo]);

  // 좋아요 토글 함수 추가
  const toggleLike = async () => {
    if (!loginMember) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }

    if (likeLoading) return;
    setLikeLoading(true);

    try {
      const resp = await axiosApi.post("/memberRecruit/like", {
        recruitNo: recruit.recruitNo,
        memNo: loginMember.memNo,
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
  const handleSubmit = () => {
    navigate(`/cv?recruitNo=${recruitNo}`);
  };

  // 신고 모달창 핸들러
  const handleReport = (target) => {
    setReportTarget(target);
    setShowReportModal(true);
  };

  // 신고 모달창 끄기 핸들러
  const handleCloseReport = () => {
    setShowReportModal(false);
  };

  if (!recruit) return <div>로딩 중...</div>;

  return (
    <div className={styles.detailPageWrap}>
      {/* 섹션 헤더 */}
      <SectionHeader title="채용공고 상세정보" />
      {/* 기업 정보 */}
      <div className={styles.corpHeader}>
        <img
          src={recruit?.corpLogo ? `${imgUrl}/${recruit.corpLogo}` : defaultImg}
          alt="기업로고"
          className={styles.corpLogo}
        />
        <div className={styles.corpInfoText}>
          <span className={styles.corpName}>{recruit.corpName}</span>
          <span className={styles.corpType}>{recruit.corpType}</span>
          {/* 채용 제목 */}
          <h2 className={styles.recruitTitle}>
            [{recruit.memNickname}] {recruit.recruitTitle}
          </h2>
          <p className={styles.recruitDates}>
            {recruit.recruitStartDate} ~ {recruit.recruitEndDate}
          </p>

          {/* ✅ 조회수/좋아요 표시 라인 추가 */}
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

      <KakaoMapPreview address={recruit.recruitJobArea} />

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
      {showReportModal && (
        <ReportModalPage target={reportTarget} onClose={handleCloseReport} />
      )}

      <div className={styles.deadlineTimer}>
        <DeadlineTimer recruitEndDate={recruit.recruitEndDate} />
      </div>

      <FloatButton
        buttons={FLOAT_BUTTON_PRESETS.submitAndReport(handleSubmit, () =>
          handleReport(`[${recruit.corpName}] ${recruit.recruitTitle}`)
        )}
      />
    </div>
  );
}
