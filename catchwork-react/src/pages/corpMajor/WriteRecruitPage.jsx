import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./WriteRecruitPage.module.css";
import SectionHeader from "../../components/common/SectionHeader";
import { axiosApi } from "../../api/axiosAPI";
import useLoginMember from "../../stores/loginMember";
import FloatButton from "../../components/common/FloatButton";
import { FLOAT_BUTTON_PRESETS } from "../../components/common/ButtonConfigs";

export default function WriteRecruitPage() {
  const navigate = useNavigate();
  const { loginMember, setLoginMember } = useLoginMember();
  const [corpInfo, setCorpInfo] = useState(null);

  // 로그인 상태 확인
  useEffect(() => {
    if (!loginMember?.memNo) {
      setLoginMember();
    }
  }, []);

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

    if (!loginMember?.memNo) {
      alert("로그인이 필요합니다.");
      return;
    }

    const submitData = {
      ...formData,
      recruitResultDate: formData.recruitResultDate || null,
      memNo: loginMember.memNo, // 로그인한 사용자 번호 추가
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

  return (
    <div className={styles.detailPageWrap}>
      {/* 섹션 헤더 */}
      <SectionHeader title="채용공고 작성" />
      {/* 기업 정보 */}
      <div className={styles.corpHeader}>
        <div className={styles.corpInfoText}>
          <h3 className={styles.corpName}>{corpInfo?.corpName}</h3>
          <p className={styles.corpType}>{corpInfo?.corpType}</p>
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

      {/* 직무명 */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>직무명 *</label>
        <input
          type="text"
          name="recruitJobName"
          value={formData.recruitJobName}
          onChange={handleChange}
          className={styles.input}
          placeholder="직무명을 입력하세요"
        />
      </div>

      {/* 직무상세 */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>직무설명 *</label>
        <textarea
          name="recruitJobDetail"
          value={formData.recruitJobDetail}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="직무 상세 설명을 입력하세요"
        />
      </div>

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
            <option value="0">고졸</option>
            <option value="1">전문학사</option>
            <option value="2">학사</option>
            <option value="3">석사</option>
            <option value="4">박사</option>
            <option value="5">학력무관</option>
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
            <option value="1-3">경력(1~3년)</option>
            <option value="4-6">경력(4~6년)</option>
            <option value="7-9">경력(7~9년)</option>
            <option value="10-15">경력(10~15년)</option>
            <option value="16-20">경력(16~20년)</option>
            <option value="21+">경력(21년 이상)</option>
            <option value="경력무관">경력무관</option>
          </select>
        </div>
      </div>

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
            <option value="파트타임">파트타임</option>
            <option value="프리랜서">프리랜서</option>
            <option value="파견직">파견직</option>
          </select>
        </div>
      </div>

      <div className={styles.rowGroup}>
        <input
          type="text"
          name="recruitJobArea"
          value={formData.recruitJobArea}
          onChange={handleChange}
          placeholder="근무지"
          className={styles.input}
        />
        <input
          type="text"
          name="recruitSalary"
          value={formData.recruitSalary}
          onChange={handleChange}
          placeholder="연봉"
          className={styles.input}
        />
      </div>

      <input
        type="date"
        name="recruitResultDate"
        value={formData.recruitResultDate}
        onChange={handleChange}
        placeholder="합격자 발표일"
        className={styles.input}
      />

      <textarea
        name="recruitDocx"
        value={formData.recruitDocx}
        onChange={handleChange}
        placeholder="제출 서류"
        className={styles.textarea}
      />

      <textarea
        name="recruitApply"
        value={formData.recruitApply}
        onChange={handleChange}
        placeholder="접수 방법"
        className={styles.textarea}
      />

      <input
        type="text"
        name="recruitCorpUrl"
        value={formData.recruitCorpUrl}
        onChange={handleChange}
        placeholder="채용 사이트"
        className={styles.input}
      />

      <textarea
        name="recruitHireDetail"
        value={formData.recruitHireDetail}
        onChange={handleChange}
        placeholder="채용 단계"
        className={styles.textarea}
      />

      <textarea
        name="recruitEtc"
        value={formData.recruitEtc}
        onChange={handleChange}
        placeholder="기타사항"
        className={styles.textarea}
      />

      <FloatButton buttons={FLOAT_BUTTON_PRESETS.writeOnly(handleWrite)} />
    </div>
  );
}
