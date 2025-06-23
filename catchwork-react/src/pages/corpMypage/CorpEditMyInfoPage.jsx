import React, { useState } from "react";
import SideBar from "../../components/myPage/CorpSideBar";
import "./CorpEditMyInfoPage.css";

const CorpEditMyInfoPage = ({ onCancel }) => {
  const [activeTab, setActiveTab] = useState("내 정보 변경");
  
  // 기업 정보 상태
  const [formData, setFormData] = useState({
    companyName: "KH 정보교육원 종로 지점",
    userId: "khacademy",
    email: "khacademy@gmail.com",
    phone: "",
    verificationCode: "",
    name: "",
    department: ""
  });
  
  // UI 상태
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [timer, setTimer] = useState(300); // 5분 = 300초
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  // 입력값 변경 핸들러
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 인증번호 발송
  const handleSendVerification = () => {
    if (!formData.phone) {
      setMessage("전화번호를 입력해주세요.");
      setMessageType("error");
      return;
    }
    
    setVerificationSent(true);
    setTimer(300);
    setMessage("인증번호가 발송되었습니다.");
    setMessageType("success");
    
    // 타이머 시작
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

  // 인증번호 확인
  const handleVerifyCode = () => {
    if (!formData.verificationCode) {
      setMessage("인증번호를 입력해주세요.");
      setMessageType("error");
      return;
    }
    
    // 실제로는 서버에서 인증번호 확인
    // 여기서는 데모용으로 '1234'로 설정
    if (formData.verificationCode === "1234") {
      setPhoneVerified(true);
      setVerificationSent(false);
      setMessage("전화번호 인증이 완료되었습니다.");
      setMessageType("success");
    } else {
      setMessage("인증번호가 올바르지 않습니다.");
      setMessageType("error");
    }
  };

  // 폼 제출
  const handleSubmit = () => {
    if (!formData.name) {
      setMessage("이름을 입력해주세요.");
      setMessageType("error");
      return;
    }
    
    if (!formData.department) {
      setMessage("부서명을 입력해주세요.");
      setMessageType("error");
      return;
    }
    
    // 실제로는 서버에 수정 요청
    console.log("정보 수정 요청:", formData);
    setMessage("정보가 성공적으로 수정되었습니다.");
    setMessageType("success");
    
    setTimeout(() => {
      if (onCancel) onCancel();
    }, 1500);
  };

  // 타이머 포맷팅 (mm:ss)
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mypage-container">
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="main-content">
        <div className="content-container">
          <h2 className="content-title">기업 회원 정보 수정</h2>
          
          {message && (
            <div className={messageType === "success" ? "success-message" : "error-message"}>
              {message}
            </div>
          )}
          
          <div className="profile-section">
            <div className="profile-image-container">
              <div className="profile-image">
                KH
                <div className="camera-icon">📷</div>
              </div>
            </div>
            
            <div className="profile-form">
              <div className="form-row">
                <label className="form-label">기업명</label>
                <div className="form-input-container">
                  <input
                    type="text"
                    className="form-input"
                    value={formData.companyName}
                    disabled
                  />
                </div>
              </div>
              
              <div className="form-row">
                <label className="form-label">아이디</label>
                <div className="form-input-container">
                  <input
                    type="text"
                    className="form-input"
                    value={formData.userId}
                    disabled
                  />
                </div>
              </div>
              
              <div className="form-row">
                <label className="form-label">이메일</label>
                <div className="form-input-container">
                  <input
                    type="email"
                    className="form-input"
                    value={formData.email}
                    disabled
                  />
                </div>
              </div>
              
              <div className="form-row">
                <label className="form-label">전화번호</label>
                <div className="form-input-container">
                  <div className="verification-section">
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="tel"
                        className="form-input"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="전화번호를 입력해주세요"
                        disabled={phoneVerified}
                      />
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSendVerification}
                        disabled={phoneVerified || verificationSent}
                      >
                        {phoneVerified ? "인증완료" : verificationSent ? "발송됨" : "발송하기"}
                      </button>
                    </div>
                    
                    {verificationSent && !phoneVerified && (
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
                        <input
                          type="text"
                          className="verification-input"
                          value={formData.verificationCode}
                          onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                          placeholder="인증번호를 입력해주세요"
                        />
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={handleVerifyCode}
                        >
                          인증하기
                        </button>
                        <span className="verification-timer">{formatTimer(timer)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="form-row">
                <label className="form-label">이름</label>
                <div className="form-input-container">
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="이름을 입력해주세요"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <label className="form-label">부서명</label>
                <div className="form-input-container">
                  <input
                    type="text"
                    className="form-input"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="부서명을 입력해주세요"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              수정하기
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorpEditMyInfoPage;