import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import useConfirmEmail from "../../hooks/useConfirmEmail";
import ResultModal from "../../components/common/ResultModal";
import "./FindPage.css";

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
    <div className="find-container">
      <h2>{isCorp ? "기업 회원 아이디 찾기" : "개인 회원 아이디 찾기"}</h2>

      <form className="find-form" onSubmit={handleSubmit}>
        {isCorp && (
          <label>
            사업자등록번호
            <input
              type="text"
              placeholder="사업자등록번호를 입력해주세요"
              onChange={(e) => setCorpRegNo(e.target.value)}
              required
            />
          </label>
        )}
        <label>
          이름
          <input
            type="text"
            placeholder="이름을 입력해주세요"
            onChange={(e) => setMemName(e.target.value)}
            required
          />
        </label>
        <label>
          이메일
          <input
            type="email"
            placeholder="이메일을 입력해주세요"
            onChange={(e) => setMemEmail(e.target.value)}
            required
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
              paddingLeft: "10px",
            }}
          >
            {isIssued ? (
              <small style={{ color: "#aaa" }}>이메일이 발송되었습니다.</small>
            ) : isClicked ? (
              <small style={{ color: "#aaa" }}>이메일 발송 중입니다.</small>
            ) : (
              <small style={{ color: "#aaa" }}>이메일을 입력해주세요</small>
            )}
            <button
              type="button"
              className="auth-button"
              onClick={handleSendEmail}
              disabled={isVerified}
            >
              인증번호 발송
            </button>
          </div>
        </label>
        <label>
          인증번호
          <input
            type="text"
            placeholder="인증번호를 입력해주세요"
            value={authKey}
            onChange={(e) => setAuthKey(e.target.value)}
            required
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
              paddingLeft: "10px",
            }}
          >
            {isVerified && successMsg ? (
              <small style={{ color: "green" }}>{successMsg}</small>
            ) : errorMsg ? (
              <small style={{ color: "red" }}>{errorMsg}</small>
            ) : timeLeft > 0 ? (
              <small style={{ color: "#333" }}>
                남은 시간: {timeFormat()}초
              </small>
            ) : isIssued ? (
              <small style={{ color: "red" }}>인증번호 만료</small>
            ) : (
              <small style={{ color: "#aaa" }}>
                인증번호 발송을 클릭해주세요
              </small>
            )}
            <button
              type="button"
              className="auth-button"
              onClick={handleCheckAuthKey}
              disabled={!isIssued || isVerified}
            >
              인증번호 확인
            </button>
          </div>
        </label>
        <button
          type="submit"
          className="submit-button"
          disabled={!isVerified}
          onClick={handleSubmit}
        >
          아이디 찾기
        </button>
      </form>

      <ResultModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleModalConfirm}
        loading={false}
        type={"id"}
        modalData={findResult}
      />
    </div>
  );
};

export default FindIdPage;
