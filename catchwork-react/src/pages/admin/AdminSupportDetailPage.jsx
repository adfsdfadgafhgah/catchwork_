import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import SectionHeader from "../../components/common/SectionHeader";
import styles from "./AdminSupportDetailPage.module.css";

export default function AdminSupportDetailPage() {
  const { supportNo } = useParams(); // URL 파라미터에서 supportNo 가져오기
  const navigate = useNavigate();

  const [support, setSupport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answerContent, setAnswerContent] = useState(""); // 답변 내용

  // 문의 상세 데이터 로드
  useEffect(() => {
    fetchSupportDetail();
  }, [supportNo, navigate]); // supportNo가 변경될 때만 재실행

  const fetchSupportDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      // 문의 상세 API 호출 (관리자 전용 엔드포인트)
      const response = await axiosApi.get(`/admin/supportdetail/${supportNo}`);
      const data = response.data;
      setSupport(data);
      // 기존 답변이 있다면 answerContent에 설정
      setAnswerContent(data.supportAnswer || "");
    } catch (err) {
      console.error("문의 상세 불러오기 실패:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "문의 상세 정보를 가져오는 중 오류 발생"
      );
      alert("문의 상세 정보를 불러오지 못했습니다.");
      navigate("/admin/supportlist");
    } finally {
      setLoading(false);
    }
  };

  // 답변 등록 핸들러 (수정 기능 없음)
  const handleAnswerSubmit = async () => {
    // 이미 답변이 완료된 상태라면 등록할 수 없습니다.
    if (support.supportStatus === "Y") {
      alert(
        "이미 답변이 완료된 문의입니다. 답변은 한 번만 등록할 수 있습니다."
      );
      return;
    }

    if (!answerContent.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    try {
      const payload = {
        supportNo: support.supportNo,
        supportAnswer: answerContent,
        // adminNo는 백엔드에서 현재 로그인된 관리자의 정보를 통해 자동으로 설정됩니다.
        // supportStatus는 백엔드에서 답변이 등록되면 'Y'로 자동 변경됩니다.
      };

      const response = await axiosApi.put(`/admin/supportanswer`, payload);

      if (response.status === 200) {
        alert("답변이 성공적으로 등록되었습니다.");
        fetchSupportDetail(); // 변경된 내용 다시 불러오기
      } else {
        alert("답변 등록 실패");
      }
    } catch (err) {
      console.error("답변 등록 중 오류 발생:", err);
      setError(
        err.response?.data?.message || err.message || "답변 등록 중 오류 발생"
      );
      alert("답변 등록 중 오류가 발생했습니다.");
    }
  };

  // 로딩 중일 때 (memNo, memType 로딩 대기 제거)
  if (loading) {
    return <p className={styles.loadingMessage}>로딩 중...</p>;
  }

  // 에러 발생 시
  if (error) {
    return <p className={styles.errorMessage}>오류: {error}</p>;
  }

  // support 데이터가 없으면 (예: 존재하지 않는 문의 번호)
  if (!support) {
    return (
      <p className={styles.noDataMessage}>문의 정보를 찾을 수 없습니다.</p>
    );
  }

  // 작성자 정보 표시를 위한 헬퍼 함수
  const getWriterInfo = () => {
    if (support.memNickname) {
      return `${support.memNickname}`;
    }
    if (support.memName) {
      return `${support.memName}`;
    }
    return "알 수 없음";
  };

  // 답변 textarea의 읽기 전용 여부 결정
  const isAnswerReadOnly = support.supportStatus === "Y";

  return (
    <div className={styles.detailContainer}>
      <SectionHeader title="문의 상세" />

      <div className={styles.infoSection}>
        <div className={styles.infoRow}>
          <span className={styles.label}>제목:</span>
          <span className={styles.value}>{support.supportTitle}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>카테고리:</span>
          <span className={styles.value}>{support.supportCategoryName}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>작성자:</span>
          <span className={styles.value}>{getWriterInfo()}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>작성일:</span>
          <span className={styles.value}>{support.supportDate}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.label}>상태:</span>
          <span
            className={`${styles.value} ${
              isAnswerReadOnly ? styles.statusDone : styles.statusPending
            }`}
          >
            {isAnswerReadOnly ? "답변 완료" : "답변 대기"}
          </span>
        </div>
        {isAnswerReadOnly && ( // 답변 완료 상태일 때만 답변 관리자 정보 표시
          <div className={styles.infoRow}>
            <span className={styles.label}>답변 관리자:</span>
            <span className={styles.value}>
              {support.adminNickname || support.adminName || "알 수 없음"}
            </span>
          </div>
        )}
        {isAnswerReadOnly &&
          support.supportAnswerDate && ( // 답변 완료 상태일 때만 답변 완료일 표시
            <div className={styles.infoRow}>
              <span className={styles.label}>답변 완료일:</span>
              <span className={styles.value}>{support.supportAnswerDate}</span>
            </div>
          )}
      </div>

      <div className={styles.contentSection}>
        <h3>문의 내용</h3>
        <div className={styles.contentBox}>
          <p style={{ whiteSpace: "pre-wrap" }}>{support.supportContent}</p>
        </div>
      </div>

      <div className={styles.answerSection}>
        <h3>답변</h3>
        <textarea
          className={styles.answerTextarea}
          value={answerContent} // answerContent 상태 사용
          onChange={(e) => setAnswerContent(e.target.value)} // 변경 핸들러 추가
          placeholder={
            isAnswerReadOnly
              ? "답변이 등록되었습니다."
              : "답변 내용을 입력하세요."
          }
          readOnly={isAnswerReadOnly} // 답변 완료 시 읽기 전용
          rows="5"
          style={{ whiteSpace: "pre-wrap" }}
        />
        <div className={styles.buttonGroup}>
          {/* 답변이 없는 경우에만 "답변 등록" 버튼 표시 */}
          {!isAnswerReadOnly && (
            <button
              className={styles.submitButton}
              onClick={handleAnswerSubmit}
            >
              답변 등록
            </button>
          )}

          <button
            className={styles.backButton}
            onClick={() => navigate("/admin/support")}
          >
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
}
