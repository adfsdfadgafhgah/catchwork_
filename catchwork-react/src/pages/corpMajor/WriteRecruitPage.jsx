import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "./WriteRecruitPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";
import { axiosApi } from "../../api/axiosAPI";
import FloatButton from "../../components/common/FloatButton";
import { FLOAT_BUTTON_PRESETS } from "../../components/common/ButtonConfigs";
import KakaoMapPreview from "../../components/common/KakaoMapPreview";
import defaultImg from "../../assets/icon.png";

// 각 필드별 최대 글자 수를 정의
const MAX_LENGTHS = {
  recruitTitle: 50,
  recruitJobDetail: 500,
  recruitSalary: 100,
  recruitDocx: 100,
  recruitApply: 500,
  recruitCorpUrl: 50,
  recruitHireDetail: 1000,
  recruitEtc: 1000,
};

export default function WriteRecruitPage() {
  const logoImgUrl = import.meta.env.VITE_FILE_COMPANY_IMG_URL;
  const navigate = useNavigate();
  const { memNo, memType } = useOutletContext();
  const [corpInfo, setCorpInfo] = useState(null);
  const [corpMemRoleCheck, setCorpMemRoleCheck] = useState("N"); // 'Y'면 대표이사

  const [formData, setFormData] = useState({
    recruitTitle: "",
    recruitStartDate: "",
    recruitEndDate: "",
    recruitJobName: "",
    recruitJobDetail: "",
    recruitEdu: "",
    recruitCareer: "",
    recruitHeadcount: "",
    recruitType: "",
    recruitJobArea: "",
    recruitSalary: "",
    recruitResultDate: "",
    recruitDocx: "",
    recruitApply: "",
    recruitCorpUrl: "",
    recruitHireDetail: "",
    recruitEtc: "",
  });

  // 필수 필드 목록
  const requiredFields = [
    "recruitTitle",
    "recruitStartDate",
    "recruitEndDate",
    "recruitJobName",
    "recruitJobDetail",
    "recruitJobArea",
    "recruitType",
    "recruitResultDate",
    "recruitEdu",
    "recruitCareer",
    "recruitHeadcount",
    "recruitSalary",
  ];

  // 폼 유효성 검사 상태
  const [isFormValid, setIsFormValid] = useState(false);

  // 폼 데이터가 변경될 때마다 유효성 검사
  useEffect(() => {
    const isValid = requiredFields.every((field) => {
      const value = formData[field];
      return typeof value === "string" ? value.trim() !== "" : value !== "";
    });
    setIsFormValid(isValid);
  }, [formData]);

  useEffect(() => {
    if (memNo === undefined || memType === undefined) {
      return;
    }
    if (!memNo || memType !== 1) {
      alert("기업회원만 채용공고를 작성할 수 있습니다.");
      navigate("/corpRecruit"); // 기업 채용공고 목록 페이지로 리다이렉트
      return;
    }

    if (memNo) {
      const fetchCorpInfo = async () => {
        try {
          const resp = await axiosApi.get(`/corpcompany/info/${memNo}`);
          const info = resp.data;
          setCorpInfo(info);
          setCorpMemRoleCheck(info.corpMemRoleCheck || "N"); // corpMemRoleCheck도 함께 저장

          setFormData((prev) => ({
            ...prev,
            corpName: info.corpName,
            corpLogo: info.corpLogo,
            corpType: info.corpType,
            corpBenefit: info.corpBenefit,
            corpBenefitDetail: info.corpBenefitDetail,
          }));
        } catch (err) {
          console.error("기업 정보 불러오기 실패:", err);
        }
      };
      fetchCorpInfo();
    }
  }, [memNo, memType, navigate]);

  // 카카오맵 주소 핸들러
  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const fullAddress = data.address;
        setFormData((prev) => ({
          ...prev,
          recruitJobArea: fullAddress, // 주소를 저장
        }));
      },
    }).open();
  };

  // 공통 입력 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    const maxLength = MAX_LENGTHS[name];

    let processedValue = value;

    // 모집인원(recruitHeadcount) 필드에는 숫자만 입력되도록 처리
    if (name === "recruitHeadcount") {
      processedValue = value.replace(/\D/g, "");
    }

    // 최대 글자 수 확인 및 초과 시 잘라내기
    if (maxLength && processedValue.length > maxLength) {
      processedValue = processedValue.slice(0, maxLength);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  // 제출 핸들러
  const handleWrite = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      alert("필수 항목(*)을 모두 입력해주세요.");
      return;
    }
    if (corpMemRoleCheck === "Y") {
      alert("대표이사 계정은 공고 작성이 불가능합니다.");
      return;
    }

    // 합격자 발표일이 마감일보다 빠른지 확인
    if (
      formData.recruitEndDate &&
      formData.recruitResultDate &&
      new Date(formData.recruitResultDate) < new Date(formData.recruitEndDate)
    ) {
      alert("합격자 발표일은 채용 마감일보다 빠를 수 없습니다.");
      return; // 함수 실행 중단
    }

    const submitData = {
      ...formData,
      recruitResultDate: formData.recruitResultDate || null,
      memNo: memNo, // 로그인한 사용자 번호 추가
      corpNo: corpInfo.corpNo,
    };

    try {
      const resp = await axiosApi.post("/corpRecruit/write", submitData);
      const newRecruitNo = resp.data.recruitNo;
      alert("공고 등록 완료!");
      navigate(`/corpRecruit/${newRecruitNo}`);
    } catch (err) {
      console.error("등록 실패:", err);
      alert("오류 발생");
    }
  };

  // 작성 취소 핸들러
  const handleCancel = () => {
    navigate(`/corpRecruit`);
  };

  if (
    memNo === undefined ||
    memType === undefined ||
    (memType === 1 && corpInfo === null)
  ) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={styles.writePageWrap}>
      <SectionHeader title="채용공고 작성" />

      <form className={styles.formContainer} onSubmit={handleWrite}>
        {/* 기업 정보 표시 */}
        <div className={styles.corpInfoCard}>
          <img
            src={
              formData.corpLogo
                ? `${logoImgUrl}/${formData.corpLogo}`
                : defaultImg
            }
            alt="기업로고"
            className={styles.corpLogo}
          />
          <div className={styles.corpInfoText}>
            <span className={styles.corpName}>{formData.corpName}</span>
            <span className={styles.corpType}>{formData.corpType}</span>
          </div>
        </div>

        {/* 채용공고 입력 폼 */}
        <div className={styles.formCard}>
          <div className={styles.inputGroup}>
            <label htmlFor="recruitTitle" className={styles.label}>
              채용 제목 *
            </label>
            <input
              id="recruitTitle"
              type="text"
              name="recruitTitle"
              value={formData.recruitTitle}
              onChange={handleChange}
              className={styles.input}
              placeholder="예: 2025년 하반기 신입/경력 공개채용"
              maxLength={MAX_LENGTHS.recruitTitle} // HTML5 기본 속성 추가
            />
            <div className={styles.charCounter}>
              {formData.recruitTitle.length} / {MAX_LENGTHS.recruitTitle}
            </div>
          </div>

          <div className={styles.gridContainer}>
            <div className={styles.inputGroup}>
              <label htmlFor="recruitStartDate" className={styles.label}>
                채용 시작일 *
              </label>
              <input
                id="recruitStartDate"
                type="date"
                name="recruitStartDate"
                value={formData.recruitStartDate}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="recruitEndDate" className={styles.label}>
                채용 마감일 *
              </label>
              <input
                id="recruitEndDate"
                type="date"
                name="recruitEndDate"
                value={formData.recruitEndDate}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="recruitResultDate" className={styles.label}>
                합격자 발표일 *
              </label>
              <input
                id="recruitResultDate"
                type="date"
                name="recruitResultDate"
                value={formData.recruitResultDate}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="recruitJobName" className={styles.label}>
              직무 *
            </label>
            <select
              id="recruitJobName"
              name="recruitJobName"
              value={formData.recruitJobName}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="">직무 선택</option>
              <option value="기획·전략">기획·전략</option>
              <option value="법무·사무·총무">법무·사무·총무</option>
              <option value="인사·HR">인사·HR</option>
              <option value="회계·세무">회계·세무</option>
              <option value="마케팅·광고·MD">마케팅·광고·MD</option>
              <option value="AI·개발·데이터">AI·개발·데이터</option>
              <option value="디자인">디자인</option>
              <option value="물류·무역">물류·무역</option>
              <option value="운전·배송·배송">운전·배송·배송</option>
              <option value="영업">영업</option>
              <option value="고객상담·TM">고객상담·TM</option>
              <option value="금융·보험">금융·보험</option>
              <option value="식·음료">식·음료</option>
              <option value="건축·시설">건축·시설</option>
              <option value="고객서비스·리테일">고객서비스·리테일</option>
              <option value="엔지니어링·설계">엔지니어링·설계</option>
              <option value="제조·생산">제조·생산</option>
              <option value="교육">교육</option>
              <option value="의료·바이오">의료·바이오</option>
              <option value="미디어·문화·스포츠">미디어·문화·스포츠</option>
              <option value="공공·복지">공공·복지</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="recruitJobDetail" className={styles.label}>
              직무 상세 *
            </label>
            <textarea
              id="recruitJobDetail"
              name="recruitJobDetail"
              value={formData.recruitJobDetail}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="담당할 주요 업무, 자격 요건, 우대 사항 등을 상세히 기재해주세요."
              maxLength={MAX_LENGTHS.recruitJobDetail}
            />
            <div className={styles.charCounter}>
              {formData.recruitJobDetail.length} /{" "}
              {MAX_LENGTHS.recruitJobDetail}
            </div>
          </div>

          <div className={styles.gridContainer}>
            <div className={styles.inputGroup}>
              <label htmlFor="recruitEdu" className={styles.label}>
                학력 *
              </label>
              <select
                id="recruitEdu"
                name="recruitEdu"
                value={formData.recruitEdu}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">학력 선택</option>
                <option value="고졸">고졸</option>
                <option value="전문학사">전문학사</option>
                <option value="학사">학사</option>
                <option value="석사">석사</option>
                <option value="박사">박사</option>
                <option value="학력무관">학력무관</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="recruitCareer" className={styles.label}>
                경력 *
              </label>
              <select
                id="recruitCareer"
                name="recruitCareer"
                value={formData.recruitCareer}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">경력 선택</option>
                <option value="신입">신입</option>
                <option value="1~3년">경력(1~3년)</option>
                <option value="4~6년">경력(4~6년)</option>
                <option value="7~9년">경력(7~9년)</option>
                <option value="10~15년">경력(10~15년)</option>
                <option value="16~20년">경력(16~20년)</option>
                <option value="21년 이상">경력(21년 이상)</option>
                <option value="경력무관">경력무관</option>
              </select>
            </div>
          </div>

          <div className={styles.gridContainer}>
            <div className={styles.inputGroup}>
              <label htmlFor="recruitHeadcount" className={styles.label}>
                모집인원 *
              </label>
              <input
                id="recruitHeadcount"
                type="tel"
                name="recruitHeadcount"
                value={formData.recruitHeadcount}
                onChange={handleChange}
                className={styles.input}
                placeholder="숫자만 입력해주세요."
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="recruitType" className={styles.label}>
                고용형태 *
              </label>
              <select
                id="recruitType"
                name="recruitType"
                value={formData.recruitType}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="">고용형태 선택</option>
                <option value="정규직">정규직</option>
                <option value="계약직">계약직</option>
                <option value="인턴">인턴</option>
                <option value="일용직">일용직</option>
                <option value="프리랜서">프리랜서</option>
                <option value="파견직">파견직</option>
                <option value="기타">기타</option>
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="recruitJobArea" className={styles.label}>
              근무지역 *
            </label>
            <div className={styles.addressContainer}>
              <input
                id="recruitJobArea"
                type="text"
                name="recruitJobArea"
                value={formData.recruitJobArea}
                readOnly
                className={styles.input}
                placeholder="주소 검색 버튼을 클릭하세요"
              />
              <button
                type="button"
                onClick={handleAddressSearch}
                className={styles.addressSearchBtn}
              >
                주소 검색
              </button>
            </div>
            {formData.recruitJobArea && (
              <div className={styles.mapPreview}>
                <KakaoMapPreview address={formData.recruitJobArea} />
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="recruitSalary" className={styles.label}>
              연봉 *
            </label>
            <input
              id="recruitSalary"
              type="text"
              name="recruitSalary"
              value={formData.recruitSalary}
              onChange={handleChange}
              className={styles.input}
              placeholder="예: 회사 내규에 따름, 4,000만원 이상"
              maxLength={MAX_LENGTHS.recruitSalary}
            />
            <div className={styles.charCounter}>
              {formData.recruitSalary.length} / {MAX_LENGTHS.recruitSalary}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="recruitDocx" className={styles.label}>
              제출 서류
            </label>
            <textarea
              id="recruitDocx"
              name="recruitDocx"
              value={formData.recruitDocx}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="예: 이력서, 자기소개서, 포트폴리오 등"
              maxLength={MAX_LENGTHS.recruitDocx}
            />
            <div className={styles.charCounter}>
              {formData.recruitDocx.length} / {MAX_LENGTHS.recruitDocx}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="recruitApply" className={styles.label}>
              접수 방법
            </label>
            <textarea
              id="recruitApply"
              name="recruitApply"
              value={formData.recruitApply}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="예: 자사 홈페이지 지원, 이메일 지원 (hr@company.com)"
              maxLength={MAX_LENGTHS.recruitApply}
            />
            <div className={styles.charCounter}>
              {formData.recruitApply.length} / {MAX_LENGTHS.recruitApply}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="recruitCorpUrl" className={styles.label}>
              채용 사이트
            </label>
            <input
              id="recruitCorpUrl"
              type="text"
              name="recruitCorpUrl"
              value={formData.recruitCorpUrl}
              onChange={handleChange}
              className={styles.input}
              placeholder="채용 관련 URL을 입력하세요"
              maxLength={MAX_LENGTHS.recruitCorpUrl}
            />
            <div className={styles.charCounter}>
              {formData.recruitCorpUrl.length} / {MAX_LENGTHS.recruitCorpUrl}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="recruitHireDetail" className={styles.label}>
              채용 단계
            </label>
            <textarea
              id="recruitHireDetail"
              name="recruitHireDetail"
              value={formData.recruitHireDetail}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="예: 서류전형 > 1차면접 > 2차면접 > 최종합격"
              maxLength={MAX_LENGTHS.recruitHireDetail}
            />
            <div className={styles.charCounter}>
              {formData.recruitHireDetail.length} /{" "}
              {MAX_LENGTHS.recruitHireDetail}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="recruitEtc" className={styles.label}>
              기타사항
            </label>
            <textarea
              id="recruitEtc"
              name="recruitEtc"
              value={formData.recruitEtc}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="지원자에게 전하고 싶은 기타 정보를 자유롭게 기재해주세요."
              maxLength={MAX_LENGTHS.recruitEtc}
            />
            <div className={styles.charCounter}>
              {formData.recruitEtc.length} / {MAX_LENGTHS.recruitEtc}
            </div>
          </div>
        </div>

        {/* FloatButton에 isFormValid를 전달하여 버튼 활성화/비활성화 제어 */}
        <FloatButton
          buttons={FLOAT_BUTTON_PRESETS.writeAndCancel(
            handleWrite,
            handleCancel,
            isFormValid
          )}
        />
      </form>
    </div>
  );
}
