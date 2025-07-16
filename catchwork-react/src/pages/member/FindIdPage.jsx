import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import useConfirmEmail from "../../hooks/useConfirmEmail";
import ResultModal from "../../components/common/ResultModal";
import styles from "./FindPage.module.css";

const FindIdPage = () => {
  const navigate = useNavigate(); // 페이지 이동
  const [params] = useSearchParams(); // 파라미터 조회
  const isCorp = params.get("type") === "corporate"; // 기업 회원 여부
  const [corpRegNo, setCorpRegNo] = useState(""); // 사업자등록번호
  const [memName, setMemName] = useState(""); // 이름
  const [memEmail, setMemEmail] = useState(""); // 이메일
  const [isOpen, setIsOpen] = useState(false); // 결과 모달 여부
  const [findResult, setFindResult] = useState(""); // 결과 데이터
  const [isIssued, setIsIssued] = useState(false); // 인증번호 발송 여부
  const [isVerified, setIsVerified] = useState(false); // 인증번호 확인 여부
  const [authKey, setAuthKey] = useState(""); // 인증번호 입력값
  const [errorMsg, setErrorMsg] = useState(""); // 에러 메시지
  const [successMsg, setSuccessMsg] = useState(""); // 성공 메시지
  const { sendEmail, checkAuthKey, startTimer, stopTimer, timeLeft } =
    useConfirmEmail(); // 인증번호 관련 함수
  const [isClicked, setIsClicked] = useState(false); // 인증번호 발송 클릭 여부

  // 아이디 찾기 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert("인증번호를 확인해주세요");
      return;
    }

    const requestData = new FormData(); // 폼 데이터 생성
    requestData.append("memName", memName); // 이름
    requestData.append("memEmail", memEmail); // 이메일
    requestData.append("memType", isCorp ? 1 : 0); // 회원 유형

    if (isCorp) {
      // 기업 회원 여부
      requestData.append("corpRegNo", corpRegNo); // 사업자등록번호
    }

    try {
      const resp = await axiosApi.post("/member/findId", requestData);
      if (resp.status === 200) {
        const modalData = {
          id: resp.data,
          isCorp: isCorp,
        };
        setFindResult(modalData);
        setIsOpen(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert(error.response.data.message);
      } else {
        alert("회원 정보가 일치하지 않습니다.");
      }
    }
  };

  // 결과 모달 확인 함수
  const handleModalConfirm = () => {
    const url = `/signin?type=${isCorp ? "corporate" : "personal"}`;
    navigate(url);
    setIsOpen(false);
  };

  // 인증번호 발송 함수
  const handleSendEmail = async () => {
    if (!memEmail || memEmail.includes("@") === false) {
      e.preventDefault();
      alert("이메일을 입력해주세요"); // 이메일 입력 안 됨
      return;
    }
    setIsClicked(true);
    const isSent = await sendEmail(memEmail); // 인증번호 발송
    if (isSent) {
      startTimer(); // 인증번호 유효 타이머 시작
      setIsIssued(true);
    }
  };

  // 인증번호 확인 함수
  const handleCheckAuthKey = async () => {
    const isValid = await checkAuthKey(memEmail, authKey);
    if (isValid) {
      stopTimer();
      setIsVerified(true);
      setSuccessMsg("인증되었습니다");
      setErrorMsg("");
    } else {
      stopTimer();
      setErrorMsg("인증번호가 올바르지 않습니다");
      setIsVerified(false);
      setSuccessMsg("");
      setTimeout(() => {
        setErrorMsg("");
        startTimer();
      }, 3000);
    }
  };

  // 시간 포맷 함수
  const timeFormat = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.findContainer}>
      <div className={styles.findContent}>
        <div className={styles.logoSection}>
          <div className={styles.logoImage}>
            <i className="fas fa-search"></i>
          </div>
          <h1>아이디 찾기</h1>
          <p>가입 시 입력한 정보를 통해 아이디를 찾을 수 있습니다.</p>
        </div>

        <form className={styles.findForm} onSubmit={handleSubmit}>
          {isCorp && (
            <div className={styles.inputGroup}>
              <label>사업자등록번호</label>
              <input
                type="text"
                placeholder="사업자등록번호를 입력해주세요"
                value={corpRegNo}
                onChange={(e) => setCorpRegNo(e.target.value)}
                required
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>이름</label>
            <input
              type="text"
              placeholder="이름을 입력해주세요"
              value={memName}
              onChange={(e) => setMemName(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>이메일</label>
            <input
              type="email"
              placeholder="이메일을 입력해주세요"
              value={memEmail}
              onChange={(e) => setMemEmail(e.target.value)}
              required
            />
            <div className={styles.inputAction}>
              <div className={styles.statusMessage}>
                {isIssued ? (
                  <small className={styles.info}>
                    이메일이 발송되었습니다.
                  </small>
                ) : isClicked ? (
                  <small className={styles.info}>이메일 발송 중입니다.</small>
                ) : (
                  <small className={styles.placeholder}>
                    이메일을 입력해주세요
                  </small>
                )}
              </div>
              <button
                type="button"
                className={styles.authButton}
                onClick={handleSendEmail}
                disabled={isVerified}
              >
                인증번호 발송
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>인증번호</label>
            <input
              type="text"
              placeholder="인증번호를 입력해주세요"
              value={authKey}
              onChange={(e) => setAuthKey(e.target.value)}
              required
            />
            <div className={styles.inputAction}>
              <div className={styles.statusMessage}>
                {isVerified && successMsg ? (
                  <small className={styles.success}>{successMsg}</small>
                ) : errorMsg ? (
                  <small className={styles.error}>{errorMsg}</small>
                ) : timeLeft > 0 ? (
                  <small className={styles.timer}>
                    남은 시간: {timeFormat()}
                  </small>
                ) : isIssued ? (
                  <small className={styles.error}>인증번호 만료</small>
                ) : (
                  <small className={styles.placeholder}>
                    인증번호 발송을 클릭해주세요
                  </small>
                )}
              </div>
              <button
                type="button"
                className={styles.authButton}
                onClick={handleCheckAuthKey}
                disabled={!isIssued || isVerified}
              >
                인증번호 확인
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={!isVerified}
          >
            아이디 찾기
          </button>
        </form>

        <div className={styles.linkSection}>
          <a href="/login">로그인</a>
          <span>|</span>
          <a href="/find-password">비밀번호 찾기</a>
          <span>|</span>
          <a href="/signup">회원가입</a>
        </div>
      </div>

      <ResultModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleModalConfirm}
        loading={false}
        type="id"
        modalData={findResult}
      />
    </div>
  );
};

export default FindIdPage;
