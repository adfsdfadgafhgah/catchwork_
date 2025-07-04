import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import styles from "./CorpRecruitDetailPage.module.css";
import useLoginMember from "../../stores/loginMember";
import SectionHeader from "../../components/common/SectionHeader";
import FloatButton from "../../components/common/FloatButton";
import { FLOAT_BUTTON_PRESETS } from "../../components/common/ButtonConfigs";
import DeadlineTimer from "../../components/common/DeadlineTimer";

export default function CorpRecruitDetailPage() {
  const { recruitNo } = useParams();
  const navigate = useNavigate();
  const [recruit, setRecruit] = useState(null);
  const { loginMember, setLoginMember } = useLoginMember();
  const [liked, setLiked] = useState(false); // 좋아요 기능
  const [likeCount, setLikeCount] = useState(0); // 좋아요 기능
  const [likeLoading, setLikeLoading] = useState(false);

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
        const resp = await axiosApi.get(`/corpRecruit/detail/${recruitNo}`, {
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
  }, [recruitNo, loginMember?.memNo]);

  // 공고 마감 핸들러
  const handleEnd = async () => {
    if (!window.confirm("이 공고를 마감처리하시겠습니까?")) return;

    try {
      const resp = await axiosApi.put(`/corpRecruit/end/${recruitNo}`, {
        memNo: loginMember.memNo,
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
    navigate(`/corpRecruit/edit/${recruitNo}`);
  };

  // 신고 모달창으로 핸들러
  const handleReport = () => {
    navigate(`/corpRecruit/edit/${recruitNo}`);
  };

  // 공고 삭제 핸들러
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const resp = await axiosApi.delete(`/corpRecruit/delete/${recruitNo}`, {
        data: { memNo: loginMember.memNo },
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
            recruit.corpLogo
              ? `http://localhost:8080/${recruit.corpLogo}`
              : "/default-logo.png"
          }
          alt="기업 로고"
          className={styles.corpLogo}
        />
        <div className={styles.corpInfoText}>
          <span className={styles.corpName}>{recruit.corpName}</span>
          <span className={styles.corpType}>{recruit.corpType}</span>
          {/* 채용 제목 */}
          <h2 className={styles.recruitTitle}>
            [{recruit.corpName}] {recruit.recruitTitle}
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
        <p>{recruit.recruitBenefit}</p>

        <h4 className={styles.sectionTitle}>기타 사항</h4>
        <p>{recruit.recruitEtc}</p>
      </section>

      <div className={styles.deadlineTimer}>
        <DeadlineTimer recruitEndDate={recruit.recruitEndDate} />
      </div>

      {loginMember?.memNo === recruit.memNo ? (
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
        <FloatButton buttons={FLOAT_BUTTON_PRESETS.reportOnly(handleReport)} />
      )}
    </div>
  );
}
