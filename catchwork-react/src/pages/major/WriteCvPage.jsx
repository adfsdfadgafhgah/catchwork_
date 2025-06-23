// React 및 상태 훅 import
import React, { useState } from "react";

// 아이콘
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import axios from "axios";

// 기본 컴포넌트 import
import CVTitle from "../../components/cv/CVTitle";
import CVBasic from "../../components/cv/CVBasic";
import CVAddress from "../../components/cv/CVAddress";
import CVResume from "../../components/cv/CVResume";
import CVMilitary from "../../components/cv/CVMilitary";

// 커스텀 컴포넌트 import
import FormAddButton from "../../components/cv/FormAddButton";
import CVEducation from "../../components/cv/CVEducation";
import CVForm01 from "../../components/cv/CVForm01";
import CVForm02 from "../../components/cv/CVForm02";
import CVLanguage from "../../components/cv/CVLanguage";

// 페이지 전용 CSS import
import "./WriteCVPage.css";

// 이력서 작성 페이지 컴포넌트
const WriteCVPage = () => {
  const [mode, setMode] = useState("write"); // 작성/보기 모드 상태

  // 사용자 기본 정보 (출력용)
  const [userInfo, setUserInfo] = useState({
    name: "조민장",
    phone: "01087948442",
    gender: "남성",
    email: "whalswkd1213@gmail.com",
    birth: "2000-12-13",
  });

  // 이력서 입력 데이터 상태
  const [formData, setFormData] = useState({
    resumeName: "", // 이력서 제목
    mainAddress: "", // 기본 주소
    detailAddress: "", // 상세 주소
    militaryStatus: "", // 병역 구분
    militaryBranch: "", // 군별
    militaryStartDate: "0000-00", // 입대일
    militaryEndDate: "0000-00", // 전역일
    selfIntroduction: "", // 자기소개서
  });

  // 동적 섹션 항목 상태
  const [components, setComponents] = useState({
    education: [{ id: Date.now() }],
    experience: [{ id: Date.now() + 1 }],
    qualify: [{ id: Date.now() + 2 }],
    award: [{ id: Date.now() + 3 }],
    language: [{ id: Date.now() + 4 }],
    training: [{ id: Date.now() + 5 }],
    outer: [{ id: Date.now() + 6 }],
    portfolio: [{ id: Date.now() + 7 }],
  });

  // formData 변경 핸들러
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 동적 컴포넌트 항목 값 변경 핸들러
  const handleComponentChange = (type, index, field, value) => {
    setComponents((prev) => {
      const updated = [...prev[type]];
      updated[index] = { ...updated[index], [field]: value, type };
      return { ...prev, [type]: updated };
    });
  };

  // 폼 추가
  const addComponent = (type) => {
    const newItem = { id: Date.now() };
    setComponents((prev) => ({ ...prev, [type]: [...prev[type], newItem] }));
  };

  // 폼 제거
  const removeComponent = (type, index) => {
    setComponents((prev) => {
      const updated = [...prev[type]];
      updated.splice(index, 1);
      return { ...prev, [type]: updated };
    });
  };
  
  // CVForm01 섹션 정보 (자격증, 수상이력)
  const sectionMetaForm01 = {
    qualify: { title: "자격증" },
    award: { title: "수상이력" },
  };
  
  // CVForm02 섹션 정보 (경력, 교육이수, 외부활동, 포트폴리오)
  const sectionMetaForm02 = {
    experience: { title: "경력", name: "회사명", description: "직무 및 담당업무" },
    training: { title: "교육이수", name: "교육명", description: "교육 내용" },
    outer: { title: "대외활동", name: "활동명", description: "활동 설명" },
    portfolio: { title: "포트폴리오", name: "프로젝트명", description: "링크 또는 설명" },
  };
  
    // 이력서 저장 요청
    const handleSubmit = () => {
      const payload = { ...formData, ...components };
      axios
        .post("/api/resume/submit", payload)
        .then(() => alert("이력서 저장 완료"))
        .catch(() => alert("저장 중 오류가 발생했습니다"));
    };

  return (
    <div className="resume-container">
      <div className="resume-form">
        <h1 className="form-title">내 이력서 작성하기</h1>

        {/* 이력서 제목 입력 */}
        <div className="writeCVSection">
          <CVTitle
            value={formData.resumeName}
            onChange={(val) => handleInputChange("resumeName", val)}
          />
        </div>

        {/* 기본 정보 표시 */}
        <div className="writeCVSection">
          <CVBasic 
            userInfo={userInfo} 
          />
        </div>

        {/* 주소 입력 */}
        <div className="writeCVSection">
          <CVAddress
            formData={formData}
            onChange={handleInputChange}
            onSearch={() => alert("주소 검색 기능")}
          />
        </div>

        {/* 병역 입력 */}
        <div className="writeCVSection">
          <CVMilitary 
            formData={formData} 
            onChange={handleInputChange} 
          />
        </div>

        {/* 학력 입력 */}
        <div className="writeCVSection">
          <h2 className="writeCVSection-title">학력</h2>
          {components.education.length === 0 && (
            <div className="empty-message">입력된 학력 항목이 없습니다.</div>
          )}
          {components.education.map((item, index) => (
            <CVEducation
              key={item.id}
              index={index}
              data={item}
              mode={mode}
              onRemove={() => removeComponent("education", index)}
              showRemove={components.education.length > 1}
            />
          ))}
          <FormAddButton onClick={() => addComponent("education")} />
        </div>

        {/* 공통 Form01 영역 */}
        {Object.entries(sectionMetaForm01).map(([type, { title }]) => (
          <div className="writeCVSection" key={type}>
            <h2 className="writeCVSection-title">{title}</h2>
            {components[type].length === 0 && (
              <div className="empty-message">
                입력된 {title} 항목이 없습니다.
              </div>
            )}
            {components[type].map((item, index) => (
              <CVForm01
                key={item.id}
                index={index}
                data={item}
                mode={mode}
                type={type}
                onRemove={() => removeComponent(type, index)}
                onChange={handleComponentChange}
                showRemove={components[type].length > 1}
              />
            ))}
            <FormAddButton onClick={() => addComponent(type)} />
          </div>
        ))}

        {/* 어학 */}
        <div className="writeCVSection">
          <h2 className="writeCVSection-title">어학</h2>
          {components.language.length === 0 && (
            <div className="empty-message">입력된 어학 항목이 없습니다.</div>
          )}
          {components.language.map((item, index) => (
            <CVLanguage
              key={item.id}
              index={index}
              data={item}
              mode={mode}
              onRemove={() => removeComponent("language", index)}
              onChange={handleComponentChange}
              showRemove={components.language.length > 1}
            />
          ))}
          <FormAddButton onClick={() => addComponent("language")} />
        </div>

        {/* 공통 Form02 영역 */}
        {/* 경력, 교육이수, 대외활동, 포트폴리오 섹션 추가 */}
        {Object.entries(sectionMetaForm02).map(([type, labels]) => (
          <div className="writeCVSection" key={type}>
            <h2 className="writeCVSection-title">{labels.title}</h2>
            {components[type].length === 0 && (
              <div className="empty-message">
                입력된 {labels.title}이 없습니다.
              </div>
            )}
            {components[type].map((item, index) => (
              <CVForm02
                key={item.id}
                index={index}
                type={type}
                data={item}
                mode={mode}
                labels={labels}
                onRemove={() => removeComponent(type, index)}
                onChange={handleComponentChange}
                showRemove={components[type].length > 1}
              />
            ))}
            <FormAddButton onClick={() => addComponent(type)} />
          </div>
        ))}

        {/* 자기소개서 */}
        <div className="writeCVSection">
          <CVResume
            value={formData.selfIntroduction}
            onChange={(val) => handleInputChange("selfIntroduction", val)}
          />
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="writeCVSticky">
        <div className="writeCVStickyCenter">
          <button className="writeCVStickyBtn writeCVSubmitBtn" onClick={handleSubmit}>
            작성 완료
          </button>
          <button className="writeCVStickyBtn writeCVCancleBtn" onClick={() => history.back()}>
            취소
          </button>
        </div>
        <div className="writeCVStickyRight">
          <button className="writeCVStickyBtn writeCVUpBtn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            ▲
          </button>
        </div>
      </div>
    </div>
  );
};

export default WriteCVPage;
