import React, { useState, useEffect } from "react";
// 아이콘 컴포넌트
import { Camera } from "lucide-react";
// 날짜 입력 컴포넌트
import YearMonthPicker from "../../components/cv/YearMonthPicker";
// 이력서 페이지 전용 CSS
import "./WriteCVPage.css";

// import axios from "axios"; // 백엔드 연동 시 사용 예정

const WriteCVPage = () => {
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

        {/* 사진 + 기본 정보 섹션 */}
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

        {/* 학력 섹션*/}
        <div className="section">
          <h2 className="section-title">학력</h2>
          {/* {components.education.map((_, index) => (
            <CVEdu
              key={index}
              index={index}
              onRemove={() => removeComponent("education", index)}
              showRemove={components.education.length > 1}
            />
          ))} */}
          <button
            type="button"
            className="add-btn"
            onClick={() => addComponent("education")}
          >
            +
          </button>
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
