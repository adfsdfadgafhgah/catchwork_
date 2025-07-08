import React from "react";
import "./CorpRegisterPage.css";
import useCorpFormHandler from "../../hooks/corpFormHandler";

const CorpRegisterPage = () => {
  const {
    formData,
    handleInputChange,
    handleSubmit,
    handleAuthenticationCheck,
    triggerAddressSearch,
    validity,
    isCorpVerified,
  } = useCorpFormHandler({
    corpRegNo: "",
    corpCEOName: "",
    corpOpenDate: "",

    corpName: "",
    corpType: "",
    corpLogo: "",
    corpAddr: "",
    detailAddress: "",
    corpHomeLink: "",
    corpBM: "",
    corpDetail: "",
    corpBenefit: "",
    corpBenefitDetail: "",
  });

  return (
    <div className="corpRegister-container">
      <div className="corpRegister-form">
        <h2>기업 등록</h2>

        <form onSubmit={handleSubmit}>
          {/* 사업자 등록번호 */}
          <label>사업자 등록번호 *</label>
          <div className="corpRegister-input-with-button">
            <input
              type="text"
              name="corpRegNo"
              value={formData.corpRegNo}
              onChange={handleInputChange}
              maxLength={10}
              placeholder="('-' 제외)사업자 등록번호를 입력하세요"
              style={{
                borderColor: validity.corpRegNo === false ? "red" : undefined,
              }}
            />
            {validity.corpRegNo === false && (
              <small style={{ color: "red" }}>10자리 숫자</small>
            )}
            {/* 대표자 성명 */}
            <label>대표자 성명 *</label>
            <input
              type="text"
              name="corpCEOName"
              value={formData.corpCEOName}
              onChange={handleInputChange}
              placeholder="대표자 성명을 입력하세요"
              style={{
                borderColor: validity.corpCEOName === false ? "red" : undefined,
              }}
            />
            {validity.corpCEOName === false && (
              <small style={{ color: "red" }}>2~30자 한글/영문</small>
            )}
            {/* 기업 개설일자 */}
            <label>기업 개설일자 *</label>
            <input
              type="date"
              name="corpOpenDate"
              value={formData.corpOpenDate}
              onChange={handleInputChange}
              className="corpRegister-form-input corpRegister-date-input"
              style={{
                borderColor:
                  validity.corpOpenDate === false ? "red" : undefined,
              }}
            />
            {validity.corpOpenDate === false && (
              <small style={{ color: "red" }}>필수 입력</small>
            )}

            <button
              type="button"
              onClick={handleAuthenticationCheck}
              disabled={isCorpVerified}
              className="corpRegister-action-button"
            >
              인증하기
            </button>
          </div>

          {/* 기업 형태 */}
          <label>기업 형태</label>
          <input
            type="text"
            name="corpType"
            value={formData.corpType}
            onChange={handleInputChange}
            placeholder="기업 회사를 입력하세요"
          />

          {/* 기업명 */}
          <label>기업명 *</label>
          <input
            type="text"
            name="corpName"
            value={formData.corpName}
            onChange={handleInputChange}
            placeholder="기업명을 입력하세요"
            style={{
              borderColor: validity.corpName === false ? "red" : undefined,
            }}
          />
          {validity.corpName === false && (
            <small style={{ color: "red" }}>2~50자 한글/영문/숫자</small>
          )}

          {/* 기업 로고 */}
          <label>기업 로고</label>
          <input
            type="file"
            name="corpLogo"
            value={formData.corpLogo}
            onChange={handleInputChange}
            placeholder="기업 로고이미지를 입력하세요"
          />

          {/* 기업 주소 */}
          <label>기업 주소 *</label>
          <div className="corpRegister-input-with-button">
            <input
              type="text"
              name="corpAddr"
              value={formData.corpAddr}
              readOnly
              onChange={handleInputChange}
              placeholder="기업주소 입력하세요"
              style={{
                borderColor: validity.corpAddr === false ? "red" : undefined,
              }}
            />
            <button
              type="button"
              onClick={triggerAddressSearch}
              className="corpRegister-action-button"
            >
              주소 찾기
            </button>
          </div>
          {validity.corpAddr === false && (
            <small style={{ color: "red" }}>필수 입력</small>
          )}

          {/* 상세주소 */}
          <label>상세주소</label>
          <input
            type="text"
            name="detailAddress"
            value={formData.detailAddress}
            onChange={handleInputChange}
          />

          {/* 기업 홈페이지 링크 */}
          <label>기업 홈페이지 링크 *</label>
          <input
            type="url"
            name="corpHomeLink"
            value={formData.corpHomeLink}
            onChange={handleInputChange}
            placeholder="기업홈페이지주소를 입력하세요"
            style={{
              borderColor: validity.corpHomeLink === false ? "red" : undefined,
            }}
          />
          {validity.corpHomeLink === false && (
            <small style={{ color: "red" }}>http(s)://로 시작</small>
          )}

          {/* 주요 사업 */}
          <label>주요 사업 *</label>
          <input
            type="text"
            name="corpBM"
            value={formData.corpBM}
            onChange={handleInputChange}
            placeholder="주요 사업을 입력하세요"
            style={{
              borderColor: validity.corpBM === false ? "red" : undefined,
            }}
          />
          {validity.corpBM === false && (
            <small style={{ color: "red" }}>필수 입력</small>
          )}

          {/* 기업소개 상세 */}
          <label>기업소개 상세</label>
          <input
            type="text"
            name="corpDetail"
            value={formData.corpDetail}
            onChange={handleInputChange}
            placeholder="기업소개를 입력하세요"
          />

          {/* 복리후생 지원내역 */}
          <label>복리후생 지원내역</label>
          <input
            type="text"
            name="corpBenefit"
            value={formData.corpBenefit}
            onChange={handleInputChange}
            placeholder="복리후생 지원을 입력하세요"
          />

          {/* 복리후생 상세 */}
          <label>복리후생 상세</label>
          <input
            type="text"
            name="corpBenefitDetail"
            value={formData.corpBenefitDetail}
            onChange={handleInputChange}
            placeholder="복리후생 상세 내용을 입력하세요"
          />

          {/* 등록 버튼 */}
          <button
            type="submit"
            className="submit-button"
            disabled={!isCorpVerified}
          >
            기업 등록
          </button>
        </form>
      </div>
    </div>
  );
};

export default CorpRegisterPage;
