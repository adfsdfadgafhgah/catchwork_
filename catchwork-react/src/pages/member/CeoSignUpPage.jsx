import React, { useEffect, useRef } from "react";
import styles from "./CeoSignUpPage.module.css";
import useSignUpFormHandler from "../../hooks/useSignUpFormHandler";
import { useLocation, useNavigate } from "react-router-dom";
import { postCEOSignUp } from "../../api/signupAPI";
import { useAuthStore } from "../../stores/authStore";
import useConfirmEmail from "../../hooks/useConfirmEmail";

const CeoSignUpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSending = useRef(false);
  // 이전 기업 정보 저장
  const corpInfo = location.state?.corpInfo || {};

  // 이메일 인증 관련 상태 및 훅
  const [isIssued, setIsIssued] = React.useState(false);
  const [isVerified, setIsVerified] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");
  const [isClicked, setIsClicked] = React.useState(false);
  const { sendEmail, checkAuthKey, startTimer, stopTimer, timeLeft } =
    useConfirmEmail();

  // corpRegNo 없으면 기업 등록 페이지로 리다이렉트
  useEffect(() => {
    // console.log(corpInfo.corpRegNo);
    if (!corpInfo.corpRegNo) {
      alert("기업 등록 정보를 먼저 입력해주세요.");
      navigate("/corpregister", { replace: true });
    }
  }, [corpInfo.corpRegNo, navigate]);

  const config = {
    fields: [
      "ceoId",
      "ceoPw",
      "ceoPwConfirm",
      "ceoName",
      "ceoTel",
      "ceoEmail",
      "verificationCode",
      // 기업 정보 필드도 포함
      "corpRegNo",
      "corpCEOName",
      "corpOpenDate",
      "corpName",
      "corpType",
      "corpLogo",
      "corpAddr",
      "detailAddress",
      "corpHomeLink",
      "corpBM",
      "corpDetail",
      "corpBenefit",
      "corpBenefitDetail",
    ],
    idField: "ceoId",
    pwField: "ceoPw",
    pwConfirmField: "ceoPwConfirm",
    telField: "ceoTel",
    addrField: "corpAddr",
    nullableFields: [
      "corpBenefit",
      "corpBenefitDetail",
      "corpDetail",
      "corpLogo",
    ],
  };

  const { formData, handleInputChange, handleCheckId, validity, validateForm } =
    useSignUpFormHandler(
      {
        ceoId: "",
        ceoPw: "",
        ceoPwConfirm: "",
        ceoName: "",
        ceoTel: "",
        ceoEmail: "",
        verificationCode: "",
        // 기업 정보 필드 초기값
        corpRegNo: corpInfo.corpRegNo || "",
        corpCEOName: corpInfo.corpCEOName || "",
        corpOpenDate: corpInfo.corpOpenDate || "",
        corpName: corpInfo.corpName || "",
        corpType: corpInfo.corpType || "",
        corpLogo: corpInfo.corpLogo || "",
        corpAddr: corpInfo.corpAddr || "",
        detailAddress: corpInfo.detailAddress || "",
        corpHomeLink: corpInfo.corpHomeLink || "",
        corpBM: corpInfo.corpBM || "",
        corpDetail: corpInfo.corpDetail || "",
        corpBenefit: corpInfo.corpBenefit || "",
        corpBenefitDetail: corpInfo.corpBenefitDetail || "",
      },
      config
    );

  // 이메일 인증번호 발송
  const handleSendEmail = async () => {
    if (!formData.ceoEmail || formData.ceoEmail.includes("@") === false) {
      alert("이메일을 입력해주세요");
      return;
    }
    // 이메일 중복 확인
    const isExistEmail = await axiosApi.post(`/member/existEmail`, {
      memEmail: formData.ceoEmail,
    });
    if (isExistEmail.data.message === "true") {
      alert("이미 존재하는 이메일입니다.");
      return;
    }

    setIsClicked(true);
    isSending.current = true;
    const isSent = await sendEmail(formData.ceoEmail);
    if (isSent) {
      startTimer();
      setIsIssued(true);
      isSending.current = false;
    }
  };

  // 이메일 인증번호 확인
  const handleCheckAuthKey = async () => {
    const isValid = await checkAuthKey(
      formData.ceoEmail,
      formData.verificationCode
    );
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

  // 타이머 포맷
  const timeFormat = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 이메일 인증 성공 여부 체크
    if (!isVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    const isValid = validateForm();
    if (!isValid) {
      // console.log(isValid);
      alert("모든 필드를 입력해주세요.");
      return;
    }

    // 기업 정보 추출
    const corpInfoToSend = {
      corpRegNo: formData.corpRegNo,
      corpCEOName: formData.corpCEOName,
      corpOpenDate: formData.corpOpenDate,
      corpName: formData.corpName,
      corpType: formData.corpType,
      corpLogo: formData.corpLogo,
      corpAddr: formData.corpAddr,
      detailAddress: formData.detailAddress,
      corpHomeLink: formData.corpHomeLink,
      corpBM: formData.corpBM,
      corpDetail: formData.corpDetail,
      corpBenefit: formData.corpBenefit,
      corpBenefitDetail: formData.corpBenefitDetail,
    };

    // CEO 회원 정보 추출
    const ceoMemberToSend = {
      memId: formData.ceoId,
      memPw: formData.ceoPw,
      memName: formData.ceoName,
      memNickName: formData.ceoName, // 기업은 닉네임==이름으로 처리해버리기
      memTel: formData.ceoTel,
      memEmail: formData.ceoEmail,
      memGender: formData.ceoGender || "", // 없으면 빈 문자열 처리
      memAddr: formData.corpAddr,
      memType: 1,
      memGrade: 0,
      memSmsFl: "N",
    };

    // CORP_MEM 테이블용
    const corpMemToSend = {
      corpMemRoleCheck: "Y",
      corpMemDept: "대표이사",
    };

    // 최종 요청 데이터 구조
    const dataToSend = {
      corpInfo: corpInfoToSend,
      ceoMember: ceoMemberToSend,
      corpMem: corpMemToSend,
    };

    try {
      await postCEOSignUp(dataToSend);
      await useAuthStore.getState().signOut();

      alert("회원가입이 완료되었습니다.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      navigate("/signin");
    } catch (err) {
      console.error("회원가입 실패:", err.response?.data || err.message);
      alert("회원가입 실패: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerForm}>
        <h2>기업 대표 회원 가입</h2>

        <form onSubmit={handleSubmit}>
          {/* 아이디 */}
          <label>아이디</label>
          <div className={styles.inputWithButton}>
            <input
              type="text"
              name="ceoId"
              value={formData.ceoId}
              onChange={handleInputChange}
              placeholder="아이디를 입력해주세요"
              className={
                validity.ceoId === false
                  ? styles.error
                  : validity.ceoId === true
                  ? styles.success
                  : ""
              }
            />
            <button
              type="button"
              onClick={handleCheckId}
              className={styles.actionButton}
            >
              중복확인
            </button>
          </div>
          {validity.ceoId === false && (
            <div className={styles.errorText}>
              5~20자의 영문, 숫자만 사용 가능합니다.
            </div>
          )}

          {/* 비밀번호 */}
          <label>비밀번호</label>
          <input
            type="password"
            name="ceoPw"
            value={formData.ceoPw}
            onChange={handleInputChange}
            placeholder="비밀번호를 입력해주세요"
            className={
              validity.ceoPw === false
                ? styles.error
                : validity.ceoPw === true
                ? styles.success
                : ""
            }
          />
          {validity.ceoPw === false && (
            <div className={styles.errorText}>
              8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.
            </div>
          )}

          {/* 비밀번호 확인 */}
          <label>비밀번호 확인</label>
          <input
            type="password"
            name="ceoPwConfirm"
            value={formData.ceoPwConfirm}
            onChange={handleInputChange}
            placeholder="비밀번호를 다시 입력해주세요"
            className={
              validity.ceoPwConfirm === false
                ? styles.error
                : validity.ceoPwConfirm === true
                ? styles.success
                : ""
            }
          />
          {validity.ceoPwConfirm === false && (
            <div className={styles.errorText}>
              비밀번호가 일치하지 않습니다.
            </div>
          )}

          {/* 이름 */}
          <label>이름</label>
          <input
            type="text"
            name="ceoName"
            value={formData.ceoName}
            onChange={handleInputChange}
            placeholder="이름을 입력해주세요"
            className={
              validity.ceoName === false
                ? styles.error
                : validity.ceoName === true
                ? styles.success
                : ""
            }
          />
          {validity.ceoName === false && (
            <div className={styles.errorText}>
              2~30자의 한글, 영문만 사용 가능합니다.
            </div>
          )}

          {/* 전화번호 */}
          <label>전화번호</label>
          <div className={styles.inputWithButton}>
            <input
              type="text"
              name="ceoTel"
              value={formData.ceoTel}
              onChange={handleInputChange}
              placeholder="전화번호를 입력해주세요"
              className={
                validity.ceoTel === false
                  ? styles.error
                  : validity.ceoTel === true
                  ? styles.success
                  : ""
              }
            />
          </div>
          {validity.ceoTel === false && (
            <div className={styles.errorText}>
              올바른 전화번호 형식을 입력해주세요.
            </div>
          )}

          {/* 이메일 */}
          <label>이메일</label>
          <div className={styles.inputWithButton}>
            <input
              type="email"
              name="ceoEmail"
              value={formData.ceoEmail}
              onChange={handleInputChange}
              placeholder="이메일을 입력해주세요"
              disabled={isVerified}
              className={
                validity.ceoEmail === false
                  ? styles.error
                  : validity.ceoEmail === true
                  ? styles.success
                  : ""
              }
            />
            <button
              type="button"
              className={`${styles.actionButton} ${styles.authButton} ${
                isSending.current ? styles.loading : ""
              }`}
              onClick={handleSendEmail}
              disabled={isVerified}
            >
              인증번호 발송
            </button>
          </div>
          <div className={styles.statusMessage}>
            {isIssued ? (
              <small className={styles.infoText}>
                이메일이 발송되었습니다.
              </small>
            ) : isClicked ? (
              <small className={styles.infoText}>이메일 발송 중입니다.</small>
            ) : (
              <small className={styles.infoText}>이메일을 입력해주세요</small>
            )}
          </div>
          {validity.ceoEmail === false && (
            <div className={styles.errorText}>
              올바른 이메일 형식을 입력해주세요.
            </div>
          )}

          {/* 인증번호 */}
          <label>인증번호</label>
          <div className={styles.inputWithButton}>
            <input
              type="text"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleInputChange}
              placeholder="인증번호를 입력해주세요"
              disabled={isVerified}
              className={
                isVerified ? styles.success : errorMsg ? styles.error : ""
              }
            />
            <button
              type="button"
              onClick={handleCheckAuthKey}
              className={styles.actionButton}
              disabled={!isIssued || isVerified}
            >
              인증번호 확인
            </button>
          </div>
          <div className={styles.statusMessage}>
            {isVerified && successMsg ? (
              <small className={styles.successText}>{successMsg}</small>
            ) : errorMsg ? (
              <small className={styles.errorText}>{errorMsg}</small>
            ) : timeLeft > 0 ? (
              <small className={styles.timerText}>
                남은 시간: {timeFormat()}
              </small>
            ) : isIssued ? (
              <small className={styles.errorText}>인증번호 만료</small>
            ) : (
              <small className={styles.infoText}>
                인증번호 발송을 클릭해주세요
              </small>
            )}
          </div>

          {/* 기업 정보 hidden input */}
          <input
            type="hidden"
            name="corpRegNo"
            value={formData.corpRegNo || ""}
          />
          <input
            type="hidden"
            name="corpCEOName"
            value={formData.corpCEOName || ""}
          />
          <input
            type="hidden"
            name="corpOpenDate"
            value={formData.corpOpenDate || ""}
          />
          <input
            type="hidden"
            name="corpName"
            value={formData.corpName || ""}
          />
          <input
            type="hidden"
            name="corpType"
            value={formData.corpType || ""}
          />
          <input
            type="hidden"
            name="corpLogo"
            value={formData.corpLogo || ""}
          />
          <input
            type="hidden"
            name="corpAddr"
            value={formData.corpAddr || ""}
          />
          <input
            type="hidden"
            name="detailAddress"
            value={formData.detailAddress || ""}
          />
          <input
            type="hidden"
            name="corpHomeLink"
            value={formData.corpHomeLink || ""}
          />
          <input type="hidden" name="corpBM" value={formData.corpBM || ""} />
          <input
            type="hidden"
            name="corpDetail"
            value={formData.corpDetail || ""}
          />
          <input
            type="hidden"
            name="corpBenefit"
            value={formData.corpBenefit || ""}
          />
          <input
            type="hidden"
            name="corpBenefitDetail"
            value={formData.corpBenefitDetail || ""}
          />

          {/* 회원 가입 버튼 */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={!isVerified}
          >
            회원 가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default CeoSignUpPage;
