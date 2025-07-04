import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./SignUpPage.css";
import {
  postSignUp,
  checkDuplicateId,
  checkDuplicateNickname,
  searchAddress,
  // sendVerificationCode, // 필요 시 주석 해제
} from "../../api/signupAPI";
import memberFormHandler from "../../hooks/memberFormHandler";
import { validateForm } from "./utils/signupUtil";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType =
    searchParams.get("type") === "corporate" ? "corporate" : "personal";

  // 폼 핸들러
  const {
    formData,
    handleChange,
    setField,
    validity,
    handleCheckId,
    handleCheckNickname,
    triggerAddressSearch,
    handleGenerateNickname,
    validateForm,
  } = memberFormHandler({
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
    companyName: "",
    businessNo: "",
    ceoName: "",
    memSmsFl: false,
  });

  // 제출출
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm(formData, userType)) return;

    try {
      await postSignUp(formData);
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
        <label>
          아이디
          <input
            name="memId"
            value={formData.memId}
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            style={{
              borderColor: validity.memPwConfirm === false ? "red" : undefined,
            }}
          />
          {validity.memPwConfirm === false && (
            <small style={{ color: "red" }}>
              비밀번호가 일치하지 않습니다.
            </small>
          )}
        </label>

        <>
          <label>
            이메일
            <input
              name="memEmail"
              value={formData.memEmail}
              onChange={handleChange}
              style={{
                borderColor: validity.memEmail === false ? "red" : undefined,
              }}
            />
            {validity.memEmail === false && (
              <small style={{ color: "red" }}>
                유효한 이메일을 입력해주세요.
              </small>
            )}
          </label>
          <label>
            <label>
              전화번호
              <input
                name="memTel"
                value={formData.memTel}
                onChange={handleChange}
                style={{
                  borderColor: validity.memTel === false ? "red" : undefined,
                }}
              />
              {validity.memTel === false && (
                <small style={{ color: "red" }}>
                  전화번호 형식이 올바르지 않습니다.
                </small>
              )}
              <p></p>
              <input
                type="checkbox"
                name="memSmsFl"
                checked={formData.memSmsFl}
                onChange={(e) => setField("memSmsFl", e.target.checked)}
              />
              SMS 수신 동의
            </label>
            {/* 인증번호 발송 필요 시 활성화 */}
            <button
              type="button"
              onClick={() => sendVerificationCode(formData.memTel)}
            >
              인증번호 발송
            </button>
          </label>
          <label>
            이름
            <input
              name="memName"
              value={formData.memName}
              onChange={handleChange}
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
            닉네임
            <input
              name="memNickname"
              value={formData.memNickname}
              onChange={handleChange}
              style={{
                borderColor: validity.memNickname === false ? "red" : undefined,
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
              <button type="button" onClick={handleGenerateNickname}>
                닉네임 생성기
              </button>
            </p>
          </label>
          <label>
            생년월일
            <input
              name="memBirthday"
              type="date"
              value={formData.memBirthday}
              onChange={handleChange}
              style={{
                borderColor: validity.memBirthday === false ? "red" : undefined,
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
                onChange={handleChange}
              />{" "}
              남
            </label>
            <label>
              <input
                type="radio"
                name="memGender"
                value="F"
                checked={formData.memGender === "F"}
                onChange={handleChange}
              />{" "}
              여
            </label>
            {validity.memGender === false && (
              <small style={{ color: "red" }}>성별을 선택해주세요.</small>
            )}
          </div>
        </>

        {/* *********************
         * 기업 회원가입 필드
         ********************* */}
        {userType === "corporate" && (
          <>
            <label>
              회사명
              <input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </label>
            <label>
              사업자등록번호
              <input
                name="businessNo"
                value={formData.businessNo}
                onChange={handleChange}
              />
            </label>
            <label>
              대표자명
              <input
                name="ceoName"
                value={formData.ceoName}
                onChange={handleChange}
              />
            </label>
          </>
        )}

        {/* ********************* */}

        <label>
          주소
          <input
            name="memAddr"
            value={formData.memAddr}
            onChange={handleChange}
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
          onChange={handleChange}
          placeholder="상세주소"
        />

        <button type="submit" className="submit-button">
          회원 가입
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
