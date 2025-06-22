import React, { useState, useEffect } from "react"; // React 및 상태/생명주기 훅

// 아이콘 컴포넌트 (사진 아이콘으로 사용)
import { Camera } from "lucide-react";

// 사용자 정의 날짜 선택 컴포넌트 (YYYY-MM 형식)
import YearMonthPicker from "../../components/cv/YearMonthPicker";

// 공통 버튼 컴포넌트 (+, x)
import FormAddButton from "../../components/cv/FormAddButton";

// 학력 입력 컴포넌트
import CVEducation from "../../components/cv/CVEducation";

// 이력서 작성 페이지 전용 CSS 스타일
import "./WriteCVPage.css";

// import axios from "axios"; // 백엔드 연동 예정 (사용자 정보 불러오기 등)

const WriteCVPage = () => {
  // 페이지 모드: write(작성), edit(수정), view(상세 보기)
  const [mode, setMode] = useState("write"); // "write", "edit", "view"

  // 이력서 입력 데이터 상태
  const [formData, setFormData] = useState({
    resumeName: "",
    mainAddress: "",
    detailAddress: "",
    militaryStatus: "",
    militaryBranch: "",
    militaryStartDate: "0000-00",
    militaryEndDate: "0000-00",
    selfIntroduction: "",
  });

  // 사용자 정보 상태 (가데이터로 초기화)
  const [userInfo, setUserInfo] = useState({
    name: "조민장",
    phone: "01087948442",
    gender: "남성",
    email: "whalswkd1213@gmail.com",
    birth: "2000-12-13",
  });

  // 사용자 정보 불러오기 (현재는 주석 처리)
  /*
  useEffect(() => {
    axios.get("/api/user/info")
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch((err) => {
        console.error("사용자 정보 불러오기 실패:", err);
      });
  }, []);
  */

  // 반복 입력 항목 상태
  const [components, setComponents] = useState({
    education: [{}],
    experience: [{}],
    qualify: [{}],
    language: [{}],
    award: [{}],
    training: [{}],
    outer: [{}],
    portfolio: [{}],
  });

  // 항목 추가
  const addComponent = (type) => {
    setComponents((prev) => ({
      ...prev,
      [type]: [...prev[type], {}],
    }));
  };

  // 항목 제거
  const removeComponent = (type, index) => {
    setComponents((prev) => {
      const updated = [...prev[type]];
      updated.splice(index, 1);
      return {
        ...prev,
        [type]: updated,
      };
    });
  };

  // 입력값 변경 핸들러
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 주소 검색 버튼 동작
  const handleAddressSearch = () => {
    alert("주소 검색 기능");
  };

  return (
    <div className="resume-container">
      <div className="resume-form">
        {/* 페이지 제목 */}
        <h1 className="form-title">내 이력서 작성하기</h1>

        {/* 이력서 이름 입력 */}
        <div className="section">
          <div className="info-item full-width">
            <input
              type="text"
              className="info-input"
              placeholder="이력서 이름"
              value={formData.resumeName}
              onChange={(e) => handleInputChange("resumeName", e.target.value)}
            />
          </div>
        </div>

        {/* 사진 / 회원기본정보 자동입력 섹션 */}
        <div className="section">
          <div className="photo-and-basic-info">
            {/* 사진 입력 영역 (현재는 아이콘만 표시됨) */}
            <div className="photo-section">
              <div className="photo-placeholder">
                <Camera size={40} color="#000000" />
              </div>
            </div>

            {/* 이름, 연락처, 성별, 이메일, 생일 정보 표시 */}
            <div className="basic-info">
              <div className="info-row">
                <div className="info-item">
                  <span className="info-label">이름</span>
                  <span className="info-text">{userInfo.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">연락처</span>
                  <span className="info-text">{userInfo.phone}</span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-item">
                  <span className="info-label">성별</span>
                  <span className="info-text">{userInfo.gender}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">이메일</span>
                  <span className="info-text">{userInfo.email}</span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-item birth-item">
                  <span className="info-label">생일</span>
                  <span className="info-text">{userInfo.birth}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 주소 입력 섹션 */}
        <div className="section">
          <div className="info-row">
            <div className="info-item address-item">
              <span className="info-label">주소</span>
              <div className="address-inputs">
                <input
                  type="text"
                  className="info-input"
                  placeholder="도로명/지번 주소"
                  value={formData.mainAddress}
                  onChange={(e) =>
                    handleInputChange("mainAddress", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="address-search-btn"
                  onClick={handleAddressSearch}
                >
                  주소찾기
                </button>
              </div>
            </div>
          </div>
          <div className="info-row">
            <div className="info-item address-item">
              <input
                type="text"
                className="info-input"
                placeholder="상세주소"
                value={formData.detailAddress}
                onChange={(e) =>
                  handleInputChange("detailAddress", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* 병역사항 섹션 */}
        <div className="section">
          <h2 className="section-title">병역</h2>
          <div className="military-row">
            {/* 병역 구분 선택 */}
            <select
              className="military-select"
              value={formData.militaryStatus}
              onChange={(e) =>
                handleInputChange("militaryStatus", e.target.value)
              }
            >
              <option value="">구분</option>
              <option value="군필">군필</option>
              <option value="미필">미필</option>
              <option value="면제">면제</option>
            </select>

            {/* 군별 선택 */}
            <select
              className="military-select"
              value={formData.militaryBranch}
              onChange={(e) =>
                handleInputChange("militaryBranch", e.target.value)
              }
            >
              <option value="">군별</option>
              <option value="육군">육군</option>
              <option value="해군">해군</option>
              <option value="공군">공군</option>
            </select>
          </div>

          {/* 복무 시작/종료일 입력 */}
          <div className="military-dates">
            <YearMonthPicker
              value={formData.militaryStartDate}
              onChange={(val) => handleInputChange("militaryStartDate", val)}
            />
            <span className="date-separator">-</span>
            <YearMonthPicker
              value={formData.militaryEndDate}
              onChange={(val) => handleInputChange("militaryEndDate", val)}
            />
          </div>
        </div>

        {/* 학력 섹션 */}
        <div className="section">
          <h2 className="section-title">학력</h2>
          {components.education.map((edu, index) => (
            <CVEducation
              key={index}
              index={index}
              data={edu}
              mode={mode}
              onRemove={() => removeComponent("education", index)}
              showRemove={components.education.length > 1}
            />
          ))}
          {/* 수정/작성 모드일 때만 추가 버튼 보이게 */}
          {/* {mode !== "view" && <FormAddButton onClick={() => addComponent("education")} />} */}
          <FormAddButton onClick={() => addComponent("education")} />
        </div>

        {/* 자기소개서 섹션 */}
        <div className="section">
          <h2 className="section-title">자기소개서</h2>
          <textarea
            className="self-introduction"
            placeholder="자기소개서 내용"
            value={formData.selfIntroduction}
            onChange={(e) =>
              handleInputChange("selfIntroduction", e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default WriteCVPage;
