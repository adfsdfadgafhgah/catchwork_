import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import styles from "./AdminReportDetailPage.module.css";

const MAX_SANCTION_MEMO_LENGTH = 100;

export default function AdminReportDetailPage() {
  const { targetType, targetNo } = useParams(); // URL에서 신고 대상 타입과 ID를 가져옴
  const navigate = useNavigate();

  // State 정의
  const [targetInfo, setTargetInfo] = useState(null); // 신고 대상의 상세 정보
  const [reports, setReports] = useState([]); // 해당 대상에 대한 모든 개별 신고 목록
  const [sanctionMemo, setSanctionMemo] = useState(""); // 처리 메모 (제재 사유)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasUnprocessedReports = reports.some(
    (report) => report.reportStatus === "N"
  );

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await axiosApi.get(
          `/admin/report/target/${targetType}/${targetNo}`
        );
        setTargetInfo(response.data.targetInfo);
        setReports(response.data.reports);
      } catch (err) {
        console.error("신고 상세 내역 불러오기 실패:", err);
        setError("데이터를 가져오는 중 오류 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [targetType, targetNo]);

  // 제재 사유 입력 핸들러 (글자 수 제한 기능)
  const handleMemoChange = (e) => {
    const { value } = e.target;
    if (value.length <= MAX_SANCTION_MEMO_LENGTH) {
      setSanctionMemo(value);
    }
  };

  const handleProcessIndividualReport = async (reportNo) => {
    if (!window.confirm(`신고 번호 ${reportNo}번을 처리하시겠습니까?`)) return;

    try {
      await axiosApi.put("/admin/report/process", { reportNo });
      alert("처리되었습니다.");
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.reportNo === reportNo
            ? { ...report, reportStatus: "Y" }
            : report
        )
      );
    } catch (err) {
      console.error("신고 처리 실패:", err);
      alert(err.response?.data || "신고 처리 중 오류가 발생했습니다.");
    }
  };

  /** 콘텐츠(게시글, 댓글, 공고) 또는 기업 자체를 제재하는 함수 */
  const handleContentSanction = async () => {
    if (!sanctionMemo.trim()) {
      alert("제재 사유를 처리메모에 반드시 입력해주세요.");
      return;
    }
    if (
      !window.confirm(
        `정말로 해당 [${targetInfo.type}]을(를) 정지 처리하시겠습니까?`
      )
    )
      return;

    try {
      await axiosApi.post("/admin/sanction", {
        targetNo: targetNo,
        targetType: targetType,
        reason: sanctionMemo,
      });
      alert("콘텐츠/기업 정지 처리가 완료되었습니다.");
      navigate("/admin/report");
    } catch (err) {
      console.error("콘텐츠/기업 제재 처리 실패:", err);
      alert(err.response?.data || "제재 처리 중 오류가 발생했습니다.");
    }
  };

  /** 작성자(개인 회원)를 제재하는 함수 */
  const handleUserSanction = async () => {
    // 제재할 작성자 번호가 없으면 실행 중지
    if (!targetInfo?.authorNo && targetType !== "MEMBER") {
      alert("제재할 작성자 정보가 없습니다.");
      return;
    }
    if (!sanctionMemo.trim()) {
      alert("제재 사유를 처리메모에 반드시 입력해주세요.");
      return;
    }
    if (
      !window.confirm(
        `정말로 해당 작성자 [${
          targetInfo.author || targetInfo.content
        }]을(를) 정지 처리하시겠습니까?`
      )
    )
      return;

    try {
      await axiosApi.post("/admin/sanction", {
        // 신고 대상(targetNo)이 아닌, 작성자의 번호(authorNo)로 제재
        targetNo: targetType === "MEMBER" ? targetNo : targetInfo.authorNo,
        targetType: "MEMBER", // 작성자는 항상 'MEMBER' 타입
        reason: sanctionMemo,
      });
      alert("작성자 정지 처리가 완료되었습니다.");
      // 필요 시 추가 로직
    } catch (err) {
      console.error("작성자 제재 처리 실패:", err);
      alert(err.response?.data || "제재 처리 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p className={styles.errorMessage}>{error}</p>;

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        목록으로
      </button>
      <h1 className={styles.pageTitle}>신고 관리 상세</h1>

      <div className={styles.section}>
        <h3>신고 대상 정보</h3>
        <div className={styles.infoBox}>
          <p>
            <strong>타입:</strong> {targetInfo?.type}
          </p>
          <p>
            <strong>고유번호:</strong> {targetInfo?.no}
          </p>
          <p>
            <strong>내용:</strong> {targetInfo?.content}
          </p>
          {targetInfo?.author && (
            <p>
              <strong>작성자:</strong> {targetInfo.author}
            </p>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h3>처리메모 (제재사유)</h3>
        <textarea
          value={sanctionMemo}
          onChange={handleMemoChange}
          placeholder="대상을 정지 처리할 경우, 제재 사유를 입력해주세요."
          maxLength={MAX_SANCTION_MEMO_LENGTH}
        />
        <div className={styles.charCounter}>
          {sanctionMemo.length} / {MAX_SANCTION_MEMO_LENGTH}
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <button
          onClick={handleContentSanction}
          className={styles.sanctionButton}
          // '회원' 자체를 신고한 경우에는 콘텐츠 정지 버튼이 의미 없으므로 비활성화
          disabled={targetType === "MEMBER" || hasUnprocessedReports}
        >
          {targetType === "COMPANY"
            ? "기업 정보 정지"
            : "콘텐츠(글/댓글/공고) 정지"}
        </button>

        <button
          onClick={handleUserSanction}
          className={styles.sanctionButton}
          // '기업' 정보 자체를 신고했거나, 작성자 정보가 없는 경우 비활성화
          disabled={
            targetType === "COMPANY" ||
            (!targetInfo.authorNo && targetType !== "MEMBER") ||
            hasUnprocessedReports
          }
        >
          {targetType === "MEMBER" ? "회원 정지" : "작성자 정지"}
        </button>
      </div>

      {hasUnprocessedReports && (
        <p className={styles.warningMessage}>
          ※ 모든 개별 신고를 '처리 완료'해야 대상을 정지할 수 있습니다.
        </p>
      )}

      <div className={styles.section}>
        <h3>신고 상세 내용 (총 {reports.length}건)</h3>
        <div className={styles.reportList}>
          {reports.map((report) => (
            <div key={report.reportNo} className={styles.reportItem}>
              <div className={styles.reportHeader}>
                <span>
                  <strong>신고자:</strong> {report.reporterNickname}
                </span>
                <span>
                  <strong>신고날짜:</strong>{" "}
                  {new Date(report.reportDate).toLocaleDateString()}
                </span>
              </div>
              <p className={styles.reportContent}>{report.reportContent}</p>
              <div className={styles.reportFooter}>
                <span
                  className={
                    report.reportStatus === "N"
                      ? styles.statusPending
                      : styles.statusDone
                  }
                >
                  상태: {report.reportStatus === "N" ? "미처리" : "처리 완료"}
                </span>
                {report.reportStatus === "N" && (
                  <button
                    onClick={() =>
                      handleProcessIndividualReport(report.reportNo)
                    }
                  >
                    처리하기
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
