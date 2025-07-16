import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./SignUpPage.css";
import // sendVerificationCode, // 나중에에 주석 해제
"../../api/signupAPI";
import useSignUpFormHandler from "../../hooks/useSignUpFormHandler";
import useCorpFormHandler from "../../hooks/corpFormHandler";
import { axiosApi } from "../../api/axiosAPI";
import useConfirmEmail from "../../hooks/useConfirmEmail";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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
    const isSent = await sendEmail(formData.memEmail);
    if (isSent) {
      startTimer();
      setIsIssued(true);
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
    <div className="signup-container">
      <h2>{userType === "personal" ? "개인 회원가입" : "기업 회원가입"}</h2>

      <form className="signup-form" onSubmit={handleSubmit}>
        {/* *********************
         * 기업 회원가입 필드
         ********************* */}
        {userType === "corporate" && (
          <>
            {/* 사업자 등록번호 */}
            <label>
              사업자등록번호
              <input
                name="corpRegNo"
                value={corpFormData.corpRegNo}
                onChange={handleCorpInputChange}
                placeholder="사업자 등록번호를 입력하세요"
                style={{
                  borderColor:
                    corpValidity.corpRegNo === false ? "red" : undefined,
                }}
              />
              {corpValidity.corpRegNo === false && (
                <small style={{ color: "red" }}>10자리 숫자</small>
              )}
            </label>

            {/* 대표자 성명 */}
            <label>대표자 성명</label>
            <input
              type="text"
              name="corpCEOName"
              value={corpFormData.corpCEOName}
              onChange={handleCorpInputChange}
              placeholder="대표자 성명을 입력하세요"
              style={{
                borderColor:
                  corpValidity.corpCEOName === false ? "red" : undefined,
              }}
            />
            {corpValidity.corpCEOName === false && (
              <small style={{ color: "red" }}>2~30자 한글/영문</small>
            )}

            {/* 기업 개설일자 */}
            <label>기업 개설일자</label>
            <input
              type="date"
              name="corpOpenDate"
              value={corpFormData.corpOpenDate}
              onChange={handleCorpInputChange}
              className="corpRegister-form-input corpRegister-date-input"
              style={{
                borderColor:
                  corpValidity.corpOpenDate === false ? "red" : undefined,
              }}
            />
            {corpValidity.corpOpenDate === false && (
              <small style={{ color: "red" }}>필수 입력</small>
            )}
            <button
              type="button"
              onClick={handleCorpJoinCheck}
              disabled={isCorpVerified}
              className="corpRegister-action-button"
            >
              인증하기
            </button>

            <label>
              부서명
              <input
                name="corpMemDept"
                value={formData.corpMemDept}
                onChange={handleInputChange}
                style={{
                  borderColor:
                    validity.corpMemDept === false ? "red" : undefined,
                }}
              />
              {validity.corpMemDept === false && (
                <small style={{ color: "red" }}>부서명을 입력해주세요.</small>
              )}
            </label>
          </>
        )}

        <label>
          아이디
          <input
            name="memId"
            value={formData.memId}
            onChange={handleInputChange}
            style={{
              borderColor: validity.memId === false ? "red" : undefined,
            }}
          />
          {validity.memId === false && (
            <small style={{ color: "red" }}>영문/숫자 5~20자</small>
          )}
          <button type="button" onClick={handleCheckId}>
            중복 확인
          </button>
        </label>

        <label>
          비밀번호
          <input
            name="memPw"
            type="password"
            value={formData.memPw}
            onChange={handleInputChange}
            style={{
              borderColor: validity.memPw === false ? "red" : undefined,
            }}
          />
          {validity.memPw === false && (
            <small style={{ color: "red" }}>
              영문/숫자/특수문자 포함 8~20자
            </small>
          )}
        </label>

        <label>
          비밀번호 확인
          <input
            name="memPwConfirm"
            type="password"
            value={formData.memPwConfirm}
            onChange={handleInputChange}
            style={{
              borderColor:
                formData.memPwConfirm.trim().length !== 0 &&
                validity.memPwConfirm === false
                  ? "red"
                  : undefined,
            }}
          />
          {formData.memPwConfirm.trim().length !== 0 &&
            validity.memPwConfirm === false && (
              <small style={{ color: "red" }}>
                비밀번호가 일치하지 않습니다.
              </small>
            )}
        </label>

        <label>
          이름
          <input
            name="memName"
            value={formData.memName}
            onChange={handleInputChange}
            style={{
              borderColor: validity.memName === false ? "red" : undefined,
            }}
          />
          {validity.memName === false && (
            <small style={{ color: "red" }}>
              이름을 올바르게 입력해주세요.
            </small>
          )}
        </label>
        <label>
          전화번호
          <input
            name="memTel"
            value={formData.memTel}
            onChange={handleInputChange}
            style={{
              borderColor: validity.memTel === false ? "red" : undefined,
            }}
          />
          {validity.memTel === false && (
            <small style={{ color: "red" }}>
              전화번호 형식이 올바르지 않습니다.
            </small>
          )}
        </label>
        <label>
          이메일
          <input
            name="memEmail"
            value={formData.memEmail}
            onChange={handleInputChange}
            style={{
              borderColor: validity.memEmail === false ? "red" : undefined,
            }}
            disabled={isVerified}
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
          {validity.memEmail === false && (
            <small style={{ color: "red" }}>
              유효한 이메일을 입력해주세요.
            </small>
          )}
        </label>
        {/* 인증번호 입력 및 확인 */}
        <label>
          인증번호
          <div className="input-with-button">
            <input
              type="text"
              name="verificationCode"
              value={authKey}
              onChange={(e) => setAuthKey(e.target.value)}
              placeholder="인증번호를 입력해주세요"
              className={isVerified ? "success" : errorMsg ? "error" : ""}
              disabled={isVerified}
            />
            <button
              type="button"
              onClick={handleCheckAuthKey}
              className="action-button"
              disabled={!isIssued || isVerified}
            >
              인증번호 확인
            </button>
          </div>
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
          </div>
        </label>

        {/* *********************
         * 개인 회원가입 추가 필드
         ********************* */}
        {userType != "corporate" && (
          <>
            <input
              type="checkbox"
              name="memSmsFl"
              checked={formData.memSmsFl}
              onChange={(e) => setField("memSmsFl", e.target.checked)}
            />
            SMS 수신 동의
            <label>
              닉네임
              <input
                name="memNickname"
                value={formData.memNickname}
                onChange={handleInputChange}
                style={{
                  borderColor:
                    validity.memNickname === false ? "red" : undefined,
                }}
              />
              {validity.memNickname === false && (
                <small style={{ color: "red" }}>
                  닉네임은 2~20자 영문/숫자/한글로 입력해주세요.
                </small>
              )}
              <p>
                <button type="button" onClick={handleCheckNickname}>
                  중복 확인
                </button>
              </p>
            </label>
            <label>
              생년월일
              <input
                name="memBirthday"
                type="date"
                value={formData.memBirthday}
                onChange={handleInputChange}
                style={{
                  borderColor:
                    validity.memBirthday === false ? "red" : undefined,
                }}
              />
              {validity.memBirthday === false && (
                <small style={{ color: "red" }}>생년월일을 선택해주세요.</small>
              )}
            </label>
            <div className="gender-group">
              <span>성별</span>
              <label>
                <input
                  type="radio"
                  name="memGender"
                  value="M"
                  checked={formData.memGender === "M"}
                  onChange={handleInputChange}
                />{" "}
                남
              </label>
              <label>
                <input
                  type="radio"
                  name="memGender"
                  value="F"
                  checked={formData.memGender === "F"}
                  onChange={handleInputChange}
                />{" "}
                여
              </label>
              {validity.memGender === false && (
                <small style={{ color: "red" }}>성별을 선택해주세요.</small>
              )}
            </div>
            <label>
              주소
              <input
                name="memAddr"
                value={formData.memAddr}
                onChange={handleInputChange}
                readOnly
                style={{
                  borderColor: validity.memAddr === false ? "red" : undefined,
                }}
              />
              <button type="button" onClick={triggerAddressSearch}>
                주소 찾기
              </button>
              {validity.memAddr === false && (
                <small style={{ color: "red" }}>주소를 입력해주세요.</small>
              )}
            </label>
            <input
              name="detailAddress"
              value={formData.detailAddress}
              onChange={handleInputChange}
              placeholder="상세주소"
            />
          </>
        )}

        <button type="submit" className="submit-button">
          회원 가입
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
