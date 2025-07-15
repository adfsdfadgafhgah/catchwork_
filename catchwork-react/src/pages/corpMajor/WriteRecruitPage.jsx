import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "./WriteRecruitPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";
import { axiosApi } from "../../api/axiosAPI";
// import useLoginMember from "../../stores/loginMember";
import FloatButton from "../../components/common/FloatButton";
import { FLOAT_BUTTON_PRESETS } from "../../components/common/ButtonConfigs";
// import { useAuthStore } from "../../stores/authStore";
import KakaoMapPreview from "../../components/common/KakaoMapPreview";
import defaultImg from "../../assets/icon.png";

export default function WriteRecruitPage() {
  const logoImgUrl = import.meta.env.VITE_FILE_COMPANY_IMG_URL;
  const navigate = useNavigate();
  // const { loginMember, setLoginMember } = useLoginMember();
  // const { memNo, memType, memNickname } = useAuthStore();
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 제출 핸들러
  const handleWrite = async (e) => {
    e.preventDefault();

    if (!memNo || memType !== 1) {
      alert("기업회원만 채용공고를 작성할 수 있습니다.");
      return;
    }
    if (corpMemRoleCheck === "Y") {
      // 대표이사 계정은 공고 작성 불가능
      alert("대표이사 계정은 공고 작성이 불가능합니다.");
      return;
    }

    // 필수 입력 필드 유효성 검사
    if (
      !formData.recruitTitle.trim() ||
      !formData.recruitJobName ||
      !formData.recruitJobDetail.trim() ||
      !formData.recruitStartDate ||
      !formData.recruitEndDate ||
      !formData.recruitJobArea.trim()
    ) {
      alert("필수 항목(*)을 모두 입력해주세요.");
      return;
    }

    const submitData = {
      ...formData,
      recruitResultDate: formData.recruitResultDate || null,
      memNo: memNo, // 로그인한 사용자 번호 추가
      corpNo: corpInfo.corpNo,
    };

    try {
      const resp = await axiosApi.post("/corpRecruit/write", submitData);
      console.log("백엔드 응답:", resp.data);
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
    <div className={styles.detailPageWrap}>
      {/* 섹션 헤더 */}
      <SectionHeader title="채용공고 작성" />
      {/* 기업 정보 */}
      <div className={styles.corpHeader}>
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

      {/* 채용 제목 */}
      <div className={styles.inputGroup}>
        <label className={styles.label}></label>
        <input
          type="text"
          name="recruitTitle"
          value={formData.recruitTitle}
          onChange={handleChange}
          className={styles.input}
          placeholder="채용 제목 *"
        />
      </div>

      {/* 채용 기간 */}
      <div className={styles.dateRange}>
        <label className={styles.label}>채용 기간 *</label>
        <div className={styles.dateInputs}>
          <input
            type="date"
            name="recruitStartDate"
            value={formData.recruitStartDate}
            onChange={handleChange}
            className={styles.input}
          />
          <span>~</span>
          <input
            type="date"
            name="recruitEndDate"
            value={formData.recruitEndDate}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
      </div>

      {/* 직무 */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>직무 *</label>
        <select
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
          <option value="의료·바이오">의료·바이오</option>
          <option value="기타">기타</option>
        </select>
      </div>

      {/* 직무상세 */}

      <label className={styles.label}>직무상세 *</label>
      <textarea
        name="recruitJobDetail"
        value={formData.recruitJobDetail}
        onChange={handleChange}
        className={styles.textarea}
        placeholder="직무 상세 설명을 입력하세요"
      />

      {/* 학력 경력 */}
      <div className={styles.rowGroup}>
        <div>
          <label className="label">학력</label>
          <select
            type="text"
            name="recruitEdu"
            value={formData.recruitEdu}
            onChange={handleChange}
            placeholder="학력"
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

        <div>
          <label className="label">경력</label>
          <select
            type="text"
            name="recruitCareer"
            value={formData.recruitCareer}
            onChange={handleChange}
            placeholder="경력"
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

      {/* 모집인원 고용형태 */}
      <div className={styles.rowGroup}>
        <div>
          <label className="label">모집인원</label>
          <input
            type="text"
            name="recruitHeadcount"
            value={formData.recruitHeadcount}
            onChange={handleChange}
            placeholder="모집인원"
            className={styles.input}
          />
        </div>
        <div>
          <label className="label">고용형태</label>
          <select
            type="text"
            name="recruitType"
            value={formData.recruitType}
            onChange={handleChange}
            placeholder="고용형태"
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

      {/* 근무지역 */}
      <div className={styles.rowGroup}>
        <label className={styles.label}>근무지역 *</label>
        <div style={{ display: "flex", gap: "8px", alignItems: "start" }}>
          <input
            type="text"
            name="recruitJobArea"
            value={formData.recruitJobArea}
            readOnly
            className={styles.input}
            placeholder="근무지 주소를 검색하세요"
          />
          <button
            type="button"
            onClick={handleAddressSearch}
            style={{ height: "40px" }}
          >
            주소검색
          </button>
        </div>
      </div>

      {/* 지도 미리보기 */}
      {formData.recruitJobArea && (
        <div>
          <label>근무지 위치</label>
          <KakaoMapPreview address={formData.recruitJobArea} />
        </div>
      )}

      {/* 연봉 */}
      <div className={styles.rowGroup}>
        <label className={styles.label}>연봉</label>
        <input
          type="text"
          name="recruitSalary"
          value={formData.recruitSalary}
          onChange={handleChange}
          placeholder="연봉"
          className={styles.input}
        />
      </div>

      {/* 합격자 발표일 */}
      <label className={styles.label}>합격자 발표일</label>
      <input
        type="date"
        name="recruitResultDate"
        value={formData.recruitResultDate}
        onChange={handleChange}
        placeholder="합격자 발표일"
        className={styles.input}
      />

      {/* 제출 서류 */}
      <label className={styles.label}>제출 서류</label>
      <textarea
        name="recruitDocx"
        value={formData.recruitDocx}
        onChange={handleChange}
        placeholder="제출 서류"
        className={styles.textarea}
      />

      {/* 제출 서류 */}
      <label className={styles.label}>접수 방법</label>
      <textarea
        name="recruitApply"
        value={formData.recruitApply}
        onChange={handleChange}
        placeholder="접수 방법"
        className={styles.textarea}
      />

      {/* 채용 사이트 */}
      <label className={styles.label}>채용 사이트</label>
      <input
        type="text"
        name="recruitCorpUrl"
        value={formData.recruitCorpUrl}
        onChange={handleChange}
        placeholder="채용 사이트"
        className={styles.input}
      />

      {/* 채용 단계 */}
      <label className={styles.label}>채용 단계</label>
      <textarea
        name="recruitHireDetail"
        value={formData.recruitHireDetail}
        onChange={handleChange}
        placeholder="채용 단계"
        className={styles.textarea}
      />

      {/* 복리 후생 */}
      <h4 className={styles.sectionTitle}>복리후생</h4>
      <p>{formData.corpBenefit}</p>
      <p>{formData.corpBenefitDetail}</p>

      {/* 기타사항 */}
      <label className={styles.label}>기타사항</label>
      <textarea
        name="recruitEtc"
        value={formData.recruitEtc}
        onChange={handleChange}
        placeholder="기타사항"
        className={styles.textarea}
      />

      <FloatButton
        buttons={FLOAT_BUTTON_PRESETS.writeAndCancel(handleWrite, handleCancel)}
      />
    </div>
  );
}
