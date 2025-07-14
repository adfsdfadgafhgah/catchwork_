import { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
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

  // 공고 상세 조회 + 조회수 증가
  useEffect(() => {
    if (memNo === undefined || memType === undefined) {
      return;
    }

    const key = `viewed_recruit_${recruitNo}`;
    const now = new Date();
    const today = now.toDateString();
    const lastViewed = localStorage.getItem(key);

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
        console.error("❌ 상세 조회 실패:", err);
      }
    };

    const increaseThenFetch = async () => {
      try {
        // 조회수 증가 로직
        if (!lastViewed || new Date(lastViewed).toDateString() !== today) {
          localStorage.setItem(key, now.toISOString());
          await axiosApi.get(`/corpRecruit/recruitReadCount/${recruitNo}`);
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
    // 💡 신고 대상 정보는 recruit 상태에서 직접 가져옵니다.
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
            [{recruit.memNickname}] {recruit.recruitTitle}
          </h2>
          <p className={styles.recruitDates}>
            {recruit.recruitStartDate} ~ {recruit.recruitEndDate}
          </p>

          {/*  조회수/좋아요 표시 라인 추가 */}
          <div className={styles.engagementInfo}>
            <span>
              <i className="fa-regular fa-eye" /> {recruit.recruitReadCount}{" "}
              &nbsp;&nbsp;
            </span>

            <span>
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

      <div className={styles.deadlineTimer}>
        <DeadlineTimer recruitEndDate={recruit.recruitEndDate} />
      </div>

      {/* 모달 조건부 렌더링 */}
      {showReportModal && recruit && (
        <ReportModalPage
          targetNo={reportTargetNo}
          targetType={reportTargetType}
          targetNickname={reportTargetNickname}
          memberNo={memNo} // ✅ memNo prop 사용
          onClose={handleCloseReport}
        />
      )}

      {isWriter ? ( // 현재 로그인된 사용자가 이 공고의 작성자(기업회원)인 경우
        <FloatButton
          buttons={
            recruit.recruitStatus === 3 // 마감된 공고는 삭제만
              ? FLOAT_BUTTON_PRESETS.deleteOnly(handleDelete)
              : FLOAT_BUTTON_PRESETS.endAndEditAndDelete(
                  // 채용중인 공고는 마감, 수정, 삭제
                  handleEnd,
                  handleEdit,
                  handleDelete
                )
          }
        />
      ) : (
        // 작성자가 아닌 경우 (신고하기 버튼만)
        <FloatButton
          buttons={FLOAT_BUTTON_PRESETS.reportOnly(handleReportClick)}
        />
      )}
    </div>
  );
}
