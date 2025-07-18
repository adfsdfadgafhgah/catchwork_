import React from "react";
import useCorpFormHandler from "../../hooks/corpFormHandler";
import styles from "./CorpRegisterPage.module.css";

const CorpRegisterPage = () => {
  const {
    formData,
    handleInputChange,
    handleSubmit,
    handleCorpRegisterAuth,
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
    <div className={styles.corpRegisterContainer}>
      <div className={styles.corpRegisterForm}>
        <h2>기업 등록</h2>

        <form onSubmit={handleSubmit}>
          {/* 기업명 */}
          <div className={styles.fieldGroup}>
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
          </div>

          {/* 대표자 성명 */}
          <div className={styles.fieldGroup}>
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
          </div>

          {/* 기업 개설일자 */}
          <div className={styles.fieldGroup}>
            <label>기업 개설일자 *</label>
            <input
              type="date"
              name="corpOpenDate"
              value={formData.corpOpenDate}
              onChange={handleInputChange}
              className={`${styles.corpRegisterFormInput} ${styles.corpRegisterDateInput}`}
              style={{
                borderColor:
                  validity.corpOpenDate === false ? "red" : undefined,
              }}
            />
            {validity.corpOpenDate === false && (
              <small style={{ color: "red" }}>필수 입력</small>
            )}
          </div>

          {/* 사업자 등록번호 */}
          <div className={styles.fieldGroup}>
            <label>사업자 등록번호 *</label>
            <div className={styles.corpRegisterInputWithButton}>
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

              <button
                type="button"
                onClick={handleCorpRegisterAuth}
                disabled={isCorpVerified}
                className={styles.corpRegisterActionButton}
              >
                인증하기
              </button>
            </div>
          </div>

          {/* 기업 형태 */}
          <div className={styles.fieldGroup}>
            <label>기업 형태</label>
            <input
              type="text"
              name="corpType"
              value={formData.corpType}
              onChange={handleInputChange}
              placeholder="기업 회사를 입력하세요"
            />
          </div>

          {/* 기업 주소 */}
          <div className={styles.fieldGroup}>
            <label>기업 주소 *</label>
            <div className={styles.corpRegisterInputWithButton}>
              <input
                type="text"
                name="corpAddr"
                value={formData.corpAddr}
                readOnly
                onChange={handleInputChange}
                placeholder="기업주소를 입력하세요"
                style={{
                  borderColor: validity.corpAddr === false ? "red" : undefined,
                }}
              />
              <button
                type="button"
                onClick={triggerAddressSearch}
                className={styles.corpRegisterActionButton}
              >
                주소 찾기
              </button>
            </div>
            {validity.corpAddr === false && (
              <small style={{ color: "red" }}>필수 입력</small>
            )}

            {/* 상세주소 */}
            <input
              type="text"
              name="detailAddress"
              value={formData.detailAddress}
              onChange={handleInputChange}
              placeholder="상세주소를 입력하세요"
              style={{ marginTop: "0.5rem" }}
            />
          </div>

          {/* 기업 홈페이지 링크 */}
          <div className={styles.fieldGroup}>
            <label>기업 홈페이지 링크 *</label>
            <input
              type="url"
              name="corpHomeLink"
              value={formData.corpHomeLink}
              onChange={handleInputChange}
              placeholder="기업홈페이지주소를 입력하세요"
              style={{
                borderColor:
                  validity.corpHomeLink === false ? "red" : undefined,
              }}
            />
            {validity.corpHomeLink === false && (
              <small style={{ color: "red" }}>http(s)://로 시작</small>
            )}
          </div>

          {/* 주요 사업 */}
          <div className={styles.fieldGroup}>
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
          </div>

          {/* 기업소개 상세 */}
          <div className={styles.fieldGroup}>
            <label>기업소개 상세</label>
            <input
              type="text"
              name="corpDetail"
              value={formData.corpDetail}
              onChange={(e) => {
                let value = e.target.value.slice(0, 100);
                handleInputChange({ target: { name: "corpDetail", value } });
              }}
              placeholder="기업소개를 입력하세요"
              maxLength={100}
              style={{
                borderColor:
                  formData.corpDetail.length > 100 ? "red" : undefined,
              }}
            />
            <small
              style={{
                color: formData.corpDetail.length > 100 ? "red" : "gray",
              }}
            >
              {formData.corpDetail.length}/100자
            </small>
            {formData.corpDetail.length > 100 && (
              <small style={{ color: "red" }}>100자 이내로 입력해주세요.</small>
            )}
          </div>

          {/* 복리후생 지원내역 */}
          <div className={styles.fieldGroup}>
            <label>복리후생 지원내역</label>
            <input
              type="text"
              name="corpBenefit"
              value={formData.corpBenefit}
              onChange={handleInputChange}
              placeholder="복리후생 지원을 입력하세요"
            />
          </div>

          {/* 복리후생 상세 */}
          <div className={styles.fieldGroup}>
            <label>복리후생 상세</label>
            <input
              type="text"
              name="corpBenefitDetail"
              value={formData.corpBenefitDetail}
              onChange={handleInputChange}
              placeholder="복리후생 상세 내용을 입력하세요"
            />
          </div>
          {/* 등록 버튼 */}
          <button
            type="submit"
            className={styles.submitButton}
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
