import React, { useEffect } from "react";
import "./CeoSignUpPage.css";
import useSignUpFormHandler from "../../hooks/useSignUpFormHandler";
import { useLocation, useNavigate } from "react-router-dom";
import { postCEOSignUp } from "../../api/signupAPI";

const CeoSignUpPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // 이전 기업 정보 저장
  const corpInfo = location.state?.corpInfo || {};

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
    // 필요시 regexRules 등 추가
  };

  const { formData, handleChange, setField, validity, validateForm } =
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

  // 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    console.log("validateForm 결과:", isValid);
    console.log("현재 formData:", formData);
    console.log("현재 validity 상태:", validity);
    if (!isValid) return;

    const dataToSend = { ...formData, memType: 1 };
    console.log("전송 데이터:", dataToSend);

    try {
      const res = await postCEOSignUp(dataToSend);
      console.log("회원가입 성공:", res);
      alert("회원가입이 완료되었습니다.");
      navigate("/signin");
    } catch (err) {
      console.error("회원가입 실패:", err.response?.data || err.message);
      alert("회원가입 실패: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>기업 대표 (최고 인사 담당자) 회원 가입</h2>

        <form onSubmit={handleSubmit}>
          {/* 아이디 */}
          <label>아이디</label>
          <div className="input-with-button">
            <input
              type="text"
              name="ceoId"
              value={formData.ceoId}
              onChange={handleChange}
              placeholder="아이디를 입력해주세요"
              className={
                validity.ceoId === false
                  ? "error"
                  : validity.ceoId === true
                  ? "success"
                  : ""
              }
            />
            <button
              type="button"
              onClick={/* handleCheckId 대체 필요시 추가 */ undefined}
              className="action-button"
            >
              중복확인
            </button>
          </div>
          {validity.ceoId === false && (
            <div className="error-text">
              5~20자의 영문, 숫자만 사용 가능합니다.
            </div>
          )}

          {/* 비밀번호 */}
          <label>비밀번호</label>
          <input
            type="password"
            name="ceoPw"
            value={formData.ceoPw}
            onChange={handleChange}
            placeholder="비밀번호를 입력해주세요"
            className={
              validity.ceoPw === false
                ? "error"
                : validity.ceoPw === true
                ? "success"
                : ""
            }
          />
          {validity.ceoPw === false && (
            <div className="error-text">
              8~20자의 영문, 숫자, 특수문자를 포함해야 합니다.
            </div>
          )}

          {/* 비밀번호 확인 */}
          <label>비밀번호 확인</label>
          <input
            type="password"
            name="ceoPwConfirm"
            value={formData.ceoPwConfirm}
            onChange={handleChange}
            placeholder="비밀번호를 다시 입력해주세요"
            className={
              validity.ceoPwConfirm === false
                ? "error"
                : validity.ceoPwConfirm === true
                ? "success"
                : ""
            }
          />
          {validity.ceoPwConfirm === false && (
            <div className="error-text">비밀번호가 일치하지 않습니다.</div>
          )}

          {/* 이름 */}
          <label>이름</label>
          <input
            type="text"
            name="ceoName"
            value={formData.ceoName}
            onChange={handleChange}
            placeholder="이름을 입력해주세요"
            className={
              validity.ceoName === false
                ? "error"
                : validity.ceoName === true
                ? "success"
                : ""
            }
          />
          {validity.ceoName === false && (
            <div className="error-text">
              2~30자의 한글, 영문만 사용 가능합니다.
            </div>
          )}

          {/* 전화번호 */}
          <label>전화번호</label>
          <div className="input-with-button">
            <input
              type="text"
              name="ceoTel"
              value={formData.ceoTel}
              onChange={handleChange}
              placeholder="전화번호를 입력해주세요"
              className={
                validity.ceoTel === false
                  ? "error"
                  : validity.ceoTel === true
                  ? "success"
                  : ""
              }
            />
            <button
              type="button"
              onClick={
                /* handleSendVerificationCode 대체 필요시 추가 */ undefined
              }
              className="action-button"
            >
              인증번호 발송
            </button>
          </div>
          {validity.ceoTel === false && (
            <div className="error-text">
              올바른 전화번호 형식을 입력해주세요.
            </div>
          )}

          {/* 인증번호 */}
          <label>인증번호</label>
          <div className="input-with-button">
            <input
              type="text"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleChange}
              placeholder="인증번호를 입력해주세요"
              className={
                validity.verificationCode === false
                  ? "error"
                  : validity.verificationCode === true
                  ? "success"
                  : ""
              }
            />
            <button
              type="button"
              onClick={/* handleVerifyCode 대체 필요시 추가 */ undefined}
              className="action-button"
            >
              인증번호 확인
            </button>
          </div>
          <div className="timer"></div>

          {/* 이메일 */}
          <label>이메일</label>
          <div className="input-with-button">
            <input
              type="email"
              name="ceoEmail"
              value={formData.ceoEmail}
              onChange={handleChange}
              placeholder="이메일을 입력해주세요"
              className={
                validity.ceoEmail === false
                  ? "error"
                  : validity.ceoEmail === true
                  ? "success"
                  : ""
              }
            />
          </div>
          {validity.ceoEmail === false && (
            <div className="error-text">올바른 이메일 형식을 입력해주세요.</div>
          )}

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
          <button type="submit" className="submit-button">
            회원 가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default CeoSignUpPage;
