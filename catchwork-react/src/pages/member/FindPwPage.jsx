import React, { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useConfirmEmail from "../../hooks/useConfirmEmail";
import ResultModal from "../../components/common/ResultModal";
import styles from "./FindPwPage.module.css";
import { axiosApi } from "../../api/axiosAPI";

const FindPwPage = () => {
  const [params] = useSearchParams();
  const isCorp = params.get("type") === "corporate";
  const [corpRegNo, setCorpRegNo] = useState("");
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [authKey, setAuthKey] = useState("");
  const [isIssued, setIsIssued] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { sendEmail, checkAuthKey, startTimer, stopTimer, timeLeft } =
    useConfirmEmail();
  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const navigate = useNavigate();
  const isSending = useRef(false); // 인증번호 발송 중 여부

  // 비밀번호 찾기 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isVerified) {
      alert("인증번호를 확인해주세요");
      return;
    }

    const requestData = new FormData();
    requestData.append("memId", id);
    requestData.append("memName", name);
    requestData.append("memEmail", email);
    requestData.append("memType", isCorp ? 1 : 0);
    if (isCorp) {
      requestData.append("corpRegNo", corpRegNo);
    }

    try {
      const resp = await axiosApi.post("/member/findPw", requestData);
      if (resp.status === 200) {
        setIsOpen(true);
        handleSendTempPw();
        setModalData({ email: email });
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

  // 임시 비밀번호 발송 함수
  const handleSendTempPw = async () => {
    const resp = await axiosApi.post("/member/sendTempPw", {
      memEmail: email,
      memId: id,
      memName: name,
    });
    if (resp.status === 200) {
      setModalData({ ...modalData, isIssuedTempPw: true });
    }
  };

  // 인증번호 확인 함수
  const handleCheckAuthKey = async () => {
    const isValid = await checkAuthKey(email, authKey);
    if (isValid) {
      stopTimer();
      setIsVerified(true);
      setSuccessMsg("인증되었습니다");
      setErrorMsg("");
    }
  };

  // 인증번호 발송 함수
  const handleSendEmail = async () => {
    if (!email || email.includes("@") === false) {
      e.preventDefault();
      alert("이메일을 입력해주세요");
      return;
    }
    setIsClicked(true);
    isSending.current = true;
    const isSent = await sendEmail(email);
    if (isSent) {
      startTimer();
      setIsIssued(true);
      isSending.current = false;
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
      <div className={styles.findWrapper}>
        <h2 className={styles.title}>
          {isCorp ? "기업 회원 비밀번호 찾기" : "개인 회원 비밀번호 찾기"}
        </h2>

        <form className={styles.findForm} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>아이디</label>
            <input
              type="text"
              className={styles.input}
              placeholder="아이디를 입력해주세요"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>

          {isCorp && (
            <div className={styles.inputGroup}>
              <label className={styles.label}>사업자등록번호</label>
              <input
                type="text"
                className={styles.input}
                placeholder="사업자등록번호를 입력해주세요"
                value={corpRegNo}
                onChange={(e) => setCorpRegNo(e.target.value)}
                required
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label}>이름</label>
            <input
              type="text"
              className={styles.input}
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>이메일</label>
            <input
              type="email"
              className={styles.input}
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className={styles.authContainer}>
              <div className={styles.authMessage}>
                {isIssued ? (
                  <small className={styles.infoMessage}>
                    이메일이 발송되었습니다.
                  </small>
                ) : isClicked ? (
                  <small className={styles.infoMessage}>
                    이메일 발송 중입니다.
                  </small>
                ) : (
                  <small className={styles.infoMessage}>
                    이메일을 입력해주세요
                  </small>
                )}
              </div>
              <button
                type="button"
                onClick={handleSendEmail}
                disabled={isVerified}
                className={`${styles.authButton} ${
                  isSending.current ? styles.loading : ""
                }`}
              >
                인증번호 발송
              </button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>인증번호</label>
            <input
              type="text"
              className={styles.input}
              placeholder="인증번호를 입력해주세요"
              value={authKey}
              onChange={(e) => setAuthKey(e.target.value)}
              disabled={!isIssued}
            />
            <div className={styles.authContainer}>
              <div className={styles.authMessage}>
                {isVerified && successMsg ? (
                  <small className={styles.successMessage}>{successMsg}</small>
                ) : errorMsg ? (
                  <small className={styles.errorMessage}>{errorMsg}</small>
                ) : timeLeft > 0 ? (
                  <small className={styles.timerMessage}>
                    남은 시간: {timeFormat()}
                  </small>
                ) : isIssued ? (
                  <small className={styles.errorMessage}>인증번호 만료</small>
                ) : (
                  <small className={styles.infoMessage}>
                    인증번호 발송을 클릭해주세요
                  </small>
                )}
              </div>
              <button
                type="button"
                className={`${styles.authButton} ${
                  !isIssued || isVerified ? styles.disabled : ""
                }`}
                onClick={handleCheckAuthKey}
                disabled={!isIssued || isVerified}
              >
                인증번호 확인
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`${styles.submitButton} ${
              !isVerified ? styles.disabled : ""
            }`}
            disabled={!isVerified}
          >
            비밀번호 찾기
          </button>
        </form>

        <ResultModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={handleModalConfirm}
          loading={false}
          type={"pw"}
          modalData={modalData}
        />
      </div>
    </div>
  );
};

export default FindPwPage;
