import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import styles from "./CorpRecruitDetailPage.module.css";
import useLoginMember from "../../stores/loginMember";
import SectionHeader from "../../components/common/SectionHeader";
import FloatButton from "../../components/common/FloatButton";
import { FLOAT_BUTTON_PRESETS } from "../../components/common/ButtonConfigs";

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

  // 공고 detail 조회
  useEffect(() => {
    const fetchRecruit = async () => {
      try {
        const resp = await axiosApi.get(`/recruit/detail/${recruitNo}`);
        setRecruit(resp.data);
        setLiked(data.likedByCurrentUser);
        setLikeCount(data.likeCount);
      } catch (err) {
        console.error("공고 조회 실패", err);
      }
    };
    fetchRecruit();
  }, [recruitNo, loginMember?.memNo]);

  // 공고 마감 핸들러
  const handleEnd = () => {
    navigate(`/recruit/edit/${recruitNo}`);
  };

  // 공고 수정 페이지로 핸들러
  const handleEdit = () => {
    navigate(`/recruit/edit/${recruitNo}`);
  };

  // 공고 삭제 핸들러
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const resp = await axiosApi.delete(`/recruit/delete/${recruitNo}`, {
        data: { memNo: loginMember.memNo },
      });

      if (resp.status === 200) {
        alert("삭제되었습니다.");
        navigate("/recruit"); // 삭제 후 목록으로 이동
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("오류가 발생했습니다.");
    }
  };

  // 좋아요 토글 함수 추가
  const toggleLike = async () => {
    if (!loginMember) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }

    if (likeLoading) return;
    setLikeLoading(true);

    try {
      const resp = await axiosApi.post("/board/like", {
        boardNo: board.boardNo,
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

  if (!recruit) return <div>로딩 중...</div>;

  return (
    <div className={styles.detailPageWrap}>
      {/* 섹션 헤더 */}
      <SectionHeader title="채용공고" />
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

      <p className={styles.expireInfo}>
        공고 마감까지 남은 시간:{" "}
        <span className={styles.highlight}>20일 07:23:06</span>
      </p>
      <FloatButton
        buttons={FLOAT_BUTTON_PRESETS.endAndEditAndDelete(
          handleEnd,
          handleEdit,
          handleDelete
        )}
      />
    </div>
  );
}
