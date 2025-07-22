import React, { useState } from "react";
import styles from "./OnboardingSitemapModal.module.css";
import { useNavigate } from "react-router-dom";

const personalSteps = [
  {
    title: "이력서 작성",
    desc: "이력서를 작성해야 채용공고에 지원할 수 있습니다.",
    button: { label: "이력서 작성하러 가기", to: "/cv/cvmanage" },
  },
  {
    title: "공고 지원",
    desc: "관심있는 채용공고에 이력서를 제출해보세요.",
    button: { label: "채용공고 보러가기", to: "/memberrecruit" },
  },
];

const corpSteps = [
  {
    title: "기업 등록",
    desc: "기업 정보를 먼저 등록해야 대표 회원 가입이 가능합니다.",
    button: { label: "기업 등록하러 가기", to: "/corpregister" },
  },
  {
    title: "기업 회원 가입",
    desc: "기업 회원 계정으로 공고를 등록할 수 있습니다.",
    button: { label: "기업 회원 가입", to: "/signup?type=corporate" },
  },
];

const OnboardingSitemapModal = ({ onClose }) => {
  const [userType, setUserType] = useState(null);
  const navigate = useNavigate();

  const handleSelect = (type) => {
    setUserType(type);
  };

  const handleMove = (to) => {
    onClose();
    navigate(to);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="닫기"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {!userType && (
          <div className={styles.content}>
            <h2 className={styles.title}>사이트맵</h2>
            <p className={styles.description}>사용자 유형을 선택하세요.</p>
            <div className={styles.userTypeBtns}>
              <button
                className={styles.userTypeBtn}
                onClick={() => handleSelect("personal")}
              >
                <i className="fas fa-user"></i>
                <span>개인 회원</span>
              </button>
              <button
                className={styles.userTypeBtn}
                onClick={() => handleSelect("corp")}
              >
                <i className="fas fa-building"></i>
                <span>기업 회원</span>
              </button>
            </div>
          </div>
        )}

        {userType === "personal" && (
          <div className={styles.content}>
            <h3 className={styles.stepsTitle}>개인 회원 온보딩</h3>
            <div className={styles.steps}>
              {personalSteps.map((step, idx) => (
                <div key={idx} className={styles.stepBox}>
                  <div className={styles.stepNumber}>{idx + 1}</div>
                  <div className={styles.stepContent}>
                    <strong className={styles.stepTitle}>{step.title}</strong>
                    <p className={styles.stepDesc}>{step.desc}</p>
                    <button
                      className={styles.stepBtn}
                      onClick={() => handleMove(step.button.to)}
                    >
                      {step.button.label}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {userType === "corp" && (
          <div className={styles.content}>
            <h3 className={styles.stepsTitle}>기업 회원 온보딩</h3>
            <div className={styles.steps}>
              {corpSteps.map((step, idx) => (
                <div key={idx} className={styles.stepBox}>
                  <div className={styles.stepNumber}>{idx + 1}</div>
                  <div className={styles.stepContent}>
                    <strong className={styles.stepTitle}>{step.title}</strong>
                    <p className={styles.stepDesc}>{step.desc}</p>
                    <button
                      className={styles.stepBtn}
                      onClick={() => handleMove(step.button.to)}
                    >
                      {step.button.label}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingSitemapModal;
