import React, { useState } from "react";
import CorpSideBar from "../../components/myPage/CorpSideBar";
import "./CorpEditMyInfoPage.css";

const CorpEditMyInfoPage = ({ onCancel }) => {
  const [activeTab, setActiveTab] = useState("내 정보 변경");

  const [formData, setFormData] = useState({
    companyName: "KH 정보교육원 종로 지점",
    userId: "khacademy",
    email: "khacademy@gmail.com",
    phone: "",
    verificationCode: "",
    name: "",
    department: "",
    profileImage: "/src/assets/default-profile.png" // 기본 프로필 이미지
  });

  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [timer, setTimer] = useState(300);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result // dataURL로 업데이트
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendVerification = () => {
    if (!formData.phone) {
      alert("전화번호를 입력해주세요.");
      return;
    }

    setVerificationSent(true);
    setTimer(300);
    alert("인증번호가 발송되었습니다.");

    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          setVerificationSent(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerifyCode = () => {
    if (!formData.verificationCode) {
      alert("인증번호를 입력해주세요.");
      return;
    }

    if (formData.verificationCode === "1234") {
      setPhoneVerified(true);
      setVerificationSent(false);
      alert("전화번호 인증이 완료되었습니다.");
    } else {
      alert("인증번호가 올바르지 않습니다.");
    }
  };

  const handleSubmit = () => {
    if (!formData.name) {
      alert("이름을 입력해주세요.");
      return;
    }

    if (!formData.department) {
      alert("부서명을 입력해주세요.");
      return;
    }

    console.log("정보 수정 요청:", formData);
    alert("정보가 성공적으로 수정되었습니다.");

    setTimeout(() => {
      if (onCancel) onCancel();
    }, 1500);
  };

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="corp-page-container">
      <CorpSideBar />
      <div className="corp-edit-content">
        <div className="form-container">
          <h2 className="page-title">기업 회원 정보 수정</h2>
          <div className="profile-content">
            <div className="profile-img-container">
              <img src={formData.profileImage} className="profile-img" />
              <label htmlFor="image-upload" className="image-upload-label">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="image-upload"
                />
              </label>
            </div>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">기업명</span>
                <input
                  type="text"
                  className="info-value-input"
                  value={formData.companyName}
                  disabled
                />
              </div>
              <div className="info-item">
                <span className="info-label">아이디</span>
                <input
                  type="text"
                  className="info-value-input"
                  value={formData.userId}
                  disabled
                />
              </div>
              <div className="info-item">
                <span className="info-label">이메일</span>
                <input
                  type="email"
                  className="info-value-input"
                  value={formData.email}
                  disabled
                />
              </div>
              <div className="info-item">
                <span className="info-label">전화번호</span>
                <div className="verification-section">
                  <input
                    type="tel"
                    className="info-value-input"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="전화번호를 입력해주세요"
                    disabled={phoneVerified}
                  />
                  <button
                    type="button"
                    className="custom-btn"
                    onClick={handleSendVerification}
                    disabled={phoneVerified || verificationSent}
                  >
                    발송하기
                  </button>
                </div>
              </div>
              <div className="info-item">
                <span className="info-label">인증번호</span>
                <div className="verification-wrapper">
                  <div className="verification-section">
                    <input
                      type="text"
                      className="info-value-input"
                      value={formData.verificationCode}
                      onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                      placeholder="인증번호를 입력해주세요"
                      disabled={!verificationSent && !phoneVerified}
                    />
                    <button
                      type="button"
                      className="custom-btn verify-btn"
                      onClick={handleVerifyCode}
                      disabled={!verificationSent}
                    >
                      인증하기
                    </button>
                  </div>
                  {verificationSent && !phoneVerified && (
                    <span className="verification-timer">
                      {formatTimer(timer)}
                    </span>
                  )}
                </div>
              </div>
              <div className="info-item">
                <span className="info-label">이름</span>
                <input
                  type="text"
                  className="info-value-input"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="이름을 입력해주세요"
                />
              </div>
              <div className="info-item">
                <span className="info-label">부서명</span>
                <input
                  type="text"
                  className="info-value-input"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="부서명을 입력해주세요"
                />
              </div>
              <div className="info-item button-group">
                <button
                  type="button"
                  className="custom-btn main-btn"
                  onClick={handleSubmit}
                >
                  수정하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorpEditMyInfoPage;