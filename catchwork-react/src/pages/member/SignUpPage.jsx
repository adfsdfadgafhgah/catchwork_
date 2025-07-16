import React, { useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./SignUpPage.module.css";
import // sendVerificationCode, // 나중에에 주석 해제
"../../api/signupAPI";
import useSignUpFormHandler from "../../hooks/useSignUpFormHandler";
import useCorpFormHandler from "../../hooks/corpFormHandler";
import { axiosApi } from "../../api/axiosAPI";
import useConfirmEmail from "../../hooks/useConfirmEmail";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSending = useRef(false);

  const {
    handleCorpJoinCheck,
    isCorpVerified,
    handleInputChange: handleCorpInputChange,
    validity: corpValidity,
    formData: corpFormData,
  } = useCorpFormHandler({
    corpRegNo: "",
    corpCEOName: "",
    corpOpenDate: "",
    corpMemDept: "",
  });

  const userType =
    searchParams.get("type") === "corporate" ? "corporate" : "personal";

  // config 사용해서 useSignUpForm을 Handle하기
  const config = {
    fields:
      userType === "corporate"
        ? [
            "corpMemDept",
            "memId",
            "memPw",
            "memPwConfirm",
            "memName",
            "memEmail",
            "memTel",
          ]
        : [
            "memId",
            "memPw",
            "memPwConfirm",
            "memEmail",
            "memTel",
            "memName",
            "memNickname",
            "memBirthday",
            "memGender",
            "memAddr",
          ],
    idField: "memId",
    pwField: "memPw",
    pwConfirmField: "memPwConfirm",
    nicknameField: "memNickname",
    telField: "memTel",
    addrField: "memAddr",
  };

  const {
    formData,
    handleInputChange,
    setField,
    validity,
    handleCheckId,
    handleCheckNickname,
    triggerAddressSearch,
    validateForm,
  } = useSignUpFormHandler(
    {
      memId: "",
      memPw: "",
      memPwConfirm: "",
      memEmail: "",
      memTel: "",
      memName: "",
      memNickname: "",
      memBirthday: "",
      memGender: "",
      memGrade: 0,
      memAddr: "",
      detailAddress: "",
      memType: userType === "corporate" ? 1 : 0,
      memSmsFl: false,
      verificationCode: "",

      corpMemRoleCheck: "N",
      corpRegNo: "",
      corpMemDept: "",
    },
    config
  );

  // 이메일 인증 관련 상태 및 훅
  const [isIssued, setIsIssued] = React.useState(false);
  const [isVerified, setIsVerified] = React.useState(false);
  const [authKey, setAuthKey] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [successMsg, setSuccessMsg] = React.useState("");
  const [isClicked, setIsClicked] = React.useState(false);
  const { sendEmail, checkAuthKey, startTimer, stopTimer, timeLeft } =
    useConfirmEmail();

  // 이메일 인증번호 발송
  const handleSendEmail = async () => {
    if (!formData.memEmail || formData.memEmail.includes("@") === false) {
      alert("이메일을 입력해주세요");
      return;
    }
    setIsClicked(true);
    isSending.current = true;
    const isSent = await sendEmail(formData.memEmail);
    if (isSent) {
      startTimer();
      setIsIssued(true);
      isSending.current = false;
    }
  };

  // 이메일 인증번호 확인
  const handleCheckAuthKey = async () => {
    const isValid = await checkAuthKey(formData.memEmail, authKey);
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

  // 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 이메일 인증 성공 여부 체크
    if (!isVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    if (userType === "corporate") {
      if (!isCorpVerified) {
        alert("기업 인증을 먼저 완료해주세요.");
        return;
      }
      if (!validateForm()) {
        return;
      }
    } else {
      if (!validateForm()) return;
    }

    let dataToSend;

    if (formData.memType === 0) {
      // 개인 회원
      const {
        memType,
        memId,
        memPw,
        memEmail,
        memTel,
        memName,
        memNickname,
        memBirthday,
        memGender,
        memGrade,
        memAddr,
        detailAddress,
        memSmsFl,
      } = formData;

      dataToSend = {
        memType,
        memId,
        memPw,
        memEmail,
        memTel,
        memName,
        memNickname,
        memBirthday,
        memGender,
        memGrade,
        memAddr: detailAddress ? `${memAddr}^^^${detailAddress}` : memAddr,
        memSmsFl: memSmsFl ? "Y" : "N",
        memStatus: 0,
      };

      // 생일 유효성 보정
      if (
        dataToSend.memBirthday &&
        new Date(dataToSend.memBirthday) > new Date()
      ) {
        dataToSend.memBirthday = new Date().toISOString().split("T")[0];
      }
    } else if (formData.memType === 1) {
      const { memType, memId, memPw, memName, memTel, memEmail, corpMemDept } =
        formData;
      const { corpRegNo } = corpFormData;

      dataToSend = {
        memType,
        memId,
        memPw,
        memName,
        memTel,
        memEmail,
        corpMemDept,
        corpRegNo,
        memSmsFl: "N",
        memStatus: 0,
      };
    }

    // 디버깅용
    console.log(dataToSend);
    try {
      await axiosApi.post("/signup", dataToSend);
      alert("회원가입이 완료되었습니다.");
      navigate("/signin");
    } catch (err) {
      alert("회원가입 실패: " + (err.response?.data?.message || err.message));
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h2 className={styles.title}>
        {userType === "personal" ? "개인 회원가입" : "기업 회원가입"}
      </h2>

      <form className={styles.signupForm} onSubmit={handleSubmit}>
        {/* 기업 회원가입 필드 */}
        {userType === "corporate" && (
          <div className={styles.corporateSection}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                사업자등록번호
                <input
                  className={`${styles.input} ${
                    corpValidity.corpRegNo === false ? styles.error : ""
                  }`}
                  name="corpRegNo"
                  value={corpFormData.corpRegNo}
                  onChange={handleCorpInputChange}
                  placeholder="사업자 등록번호를 입력하세요"
                />
                {corpValidity.corpRegNo === false && (
                  <small className={styles.errorMessage}>10자리 숫자</small>
                )}
              </label>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                대표자 성명
                <input
                  className={`${styles.input} ${
                    corpValidity.corpCEOName === false ? styles.error : ""
                  }`}
                  type="text"
                  name="corpCEOName"
                  value={corpFormData.corpCEOName}
                  onChange={handleCorpInputChange}
                  placeholder="대표자 성명을 입력하세요"
                />
                {corpValidity.corpCEOName === false && (
                  <small className={styles.errorMessage}>
                    2~30자 한글/영문
                  </small>
                )}
              </label>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                기업 개설일자
                <input
                  className={`${styles.input} ${styles.dateInput} ${
                    corpValidity.corpOpenDate === false ? styles.error : ""
                  }`}
                  type="date"
                  name="corpOpenDate"
                  value={corpFormData.corpOpenDate}
                  onChange={handleCorpInputChange}
                />
                {corpValidity.corpOpenDate === false && (
                  <small className={styles.errorMessage}>필수 입력</small>
                )}
              </label>
              <button
                type="button"
                onClick={handleCorpJoinCheck}
                disabled={isCorpVerified}
                className={`${styles.button} ${styles.authButton}`}
              >
                인증하기
              </button>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                부서명
                <input
                  className={`${styles.input} ${
                    validity.corpMemDept === false ? styles.error : ""
                  }`}
                  name="corpMemDept"
                  value={formData.corpMemDept}
                  onChange={handleInputChange}
                />
                {validity.corpMemDept === false && (
                  <small className={styles.errorMessage}>
                    부서명을 입력해주세요.
                  </small>
                )}
              </label>
            </div>
          </div>
        )}

        {/* 공통 필드 */}
        <div className={styles.commonSection}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              아이디
              <div className={styles.inputWithButton}>
                <input
                  className={`${styles.input} ${
                    validity.memId === false ? styles.error : ""
                  }`}
                  name="memId"
                  value={formData.memId}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={handleCheckId}
                  className={`${styles.button} ${styles.checkButton}`}
                >
                  중복 확인
                </button>
              </div>
              {validity.memId === false && (
                <small className={styles.errorMessage}>영문/숫자 5~20자</small>
              )}
            </label>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              비밀번호
              <input
                className={`${styles.input} ${
                  validity.memPw === false ? styles.error : ""
                }`}
                name="memPw"
                type="password"
                value={formData.memPw}
                onChange={handleInputChange}
              />
              {validity.memPw === false && (
                <small className={styles.errorMessage}>
                  영문/숫자/특수문자 포함 8~20자
                </small>
              )}
            </label>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              비밀번호 확인
              <input
                className={`${styles.input} ${
                  formData.memPwConfirm.trim().length !== 0 &&
                  validity.memPwConfirm === false
                    ? styles.error
                    : ""
                }`}
                name="memPwConfirm"
                type="password"
                value={formData.memPwConfirm}
                onChange={handleInputChange}
              />
              {formData.memPwConfirm.trim().length !== 0 &&
                validity.memPwConfirm === false && (
                  <small className={styles.errorMessage}>
                    비밀번호가 일치하지 않습니다.
                  </small>
                )}
            </label>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              이름
              <input
                className={`${styles.input} ${
                  validity.memName === false ? styles.error : ""
                }`}
                name="memName"
                value={formData.memName}
                onChange={handleInputChange}
              />
              {validity.memName === false && (
                <small className={styles.errorMessage}>
                  이름을 올바르게 입력해주세요.
                </small>
              )}
            </label>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              전화번호
              <input
                className={`${styles.input} ${
                  validity.memTel === false ? styles.error : ""
                }`}
                name="memTel"
                value={formData.memTel}
                onChange={handleInputChange}
              />
              {validity.memTel === false && (
                <small className={styles.errorMessage}>
                  전화번호 형식이 올바르지 않습니다.
                </small>
              )}
            </label>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              이메일
              <div className={styles.inputWithButton}>
                <input
                  className={`${styles.input} ${
                    validity.memEmail === false ? styles.error : ""
                  }`}
                  name="memEmail"
                  value={formData.memEmail}
                  onChange={handleInputChange}
                  disabled={isVerified}
                />
                <button
                  type="button"
                  className={`${styles.button} ${styles.authButton} ${
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
              {validity.memEmail === false && (
                <small className={styles.errorMessage}>
                  유효한 이메일을 입력해주세요.
                </small>
              )}
            </label>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              인증번호
              <div className={styles.inputWithButton}>
                <input
                  className={`${styles.input} ${
                    isVerified ? styles.success : errorMsg ? styles.error : ""
                  }`}
                  type="text"
                  name="verificationCode"
                  value={authKey}
                  onChange={(e) => setAuthKey(e.target.value)}
                  placeholder="인증번호를 입력해주세요"
                  disabled={isVerified}
                />
                <button
                  type="button"
                  onClick={handleCheckAuthKey}
                  className={`${styles.button} ${styles.authButton}`}
                  disabled={!isIssued || isVerified}
                >
                  인증번호 확인
                </button>
              </div>
              <div className={styles.statusMessage}>
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
            </label>
          </div>
        </div>

        {/* 개인 회원가입 추가 필드 */}
        {userType !== "corporate" && (
          <div className={styles.personalSection}>
            <div className={styles.fieldGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="memSmsFl"
                  checked={formData.memSmsFl}
                  onChange={(e) => setField("memSmsFl", e.target.checked)}
                  className={styles.checkbox}
                />
                SMS 수신 동의
              </label>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                닉네임
                <div className={styles.inputWithButton}>
                  <input
                    className={`${styles.input} ${
                      validity.memNickname === false ? styles.error : ""
                    }`}
                    name="memNickname"
                    value={formData.memNickname}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={handleCheckNickname}
                    className={`${styles.button} ${styles.checkButton}`}
                  >
                    중복 확인
                  </button>
                </div>
                {validity.memNickname === false && (
                  <small className={styles.errorMessage}>
                    닉네임은 2~20자 영문/숫자/한글로 입력해주세요.
                  </small>
                )}
              </label>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                생년월일
                <input
                  className={`${styles.input} ${styles.dateInput} ${
                    validity.memBirthday === false ? styles.error : ""
                  }`}
                  name="memBirthday"
                  type="date"
                  value={formData.memBirthday}
                  onChange={handleInputChange}
                />
                {validity.memBirthday === false && (
                  <small className={styles.errorMessage}>
                    생년월일을 선택해주세요.
                  </small>
                )}
              </label>
            </div>

            <div className={styles.fieldGroup}>
              <span className={styles.fieldTitle}>성별</span>
              <div className={styles.genderGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="memGender"
                    value="M"
                    checked={formData.memGender === "M"}
                    onChange={handleInputChange}
                    className={styles.radio}
                  />
                  남
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="memGender"
                    value="F"
                    checked={formData.memGender === "F"}
                    onChange={handleInputChange}
                    className={styles.radio}
                  />
                  여
                </label>
              </div>
              {validity.memGender === false && (
                <small className={styles.errorMessage}>
                  성별을 선택해주세요.
                </small>
              )}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                주소
                <div className={styles.inputWithButton}>
                  <input
                    className={`${styles.input} ${
                      validity.memAddr === false ? styles.error : ""
                    }`}
                    name="memAddr"
                    value={formData.memAddr}
                    onChange={handleInputChange}
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={triggerAddressSearch}
                    className={`${styles.button} ${styles.searchButton}`}
                  >
                    주소 찾기
                  </button>
                </div>
                {validity.memAddr === false && (
                  <small className={styles.errorMessage}>
                    주소를 입력해주세요.
                  </small>
                )}
              </label>
            </div>

            <div className={styles.fieldGroup}>
              <input
                className={styles.input}
                name="detailAddress"
                value={formData.detailAddress}
                onChange={handleInputChange}
                placeholder="상세주소"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className={`${styles.button} ${styles.submitButton}`}
        >
          회원 가입
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
