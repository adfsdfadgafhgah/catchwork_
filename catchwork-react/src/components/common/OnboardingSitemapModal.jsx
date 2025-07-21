import React, { useState } from "react";
import styles from "./OnboardingSitemapModal.module.css";
import { useNavigate } from "react-router-dom";

const personalSteps = [
  {
    title: "이력서 작성",
    desc: "이력서를 작성해야 채용공고에 지원할 수 있습니다.",
    button: { label: "이력서 작성하러 가기", to: "/cvlist" },
  },
  {
    title: "공고 지원",
    desc: "관심있는 채용공고에 이력서를 제출해보세요.",
    button: { label: "채용공고 보러가기", to: "/major" },
  },
];

const corpSteps = [
  {
    title: "기업 등록",
    desc: "기업 정보를 먼저 등록해야 대표 회원 가입이 가능합니다.",
    button: { label: "기업 등록하러 가기", to: "/corpregister" },
  },
  {
    title: "대표 회원 가입",
    desc: "대표 회원 가입 후 채용공고를 등록할 수 있습니다.",
    button: { label: "대표 회원 가입", to: "/ceosignup" },
  },
  {
    title: "채용공고 등록",
    desc: "채용공고를 등록하고 지원자를 관리하세요.",
    button: { label: "채용공고 등록", to: "/corprecruit" },
  },
];

const OnboardingSitemapModal = ({ onClose }) => {
  const [userType, setUserType] = useState(null); // null, 'personal', 'corp'
  const navigate = useNavigate();

  const handleSelect = (type) => setUserType(type);

  const handleMove = (to) => {
    onClose();
    navigate(to);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          &times;
        </button>
        {!userType && (
          <>
            <h2>사이트맵</h2>
            <p>사용자 유형을 선택하세요.</p>
            <div className={styles.userTypeBtns}>
              <button onClick={() => handleSelect("personal")}>
                개인 회원
              </button>
              <button onClick={() => handleSelect("corp")}>기업 회원</button>
            </div>
          </>
        )}
        {userType === "personal" && (
          <div className={styles.steps}>
            <h3>개인 회원 온보딩</h3>
            {personalSteps.map((step, idx) => (
              <div key={idx} className={styles.stepBox}>
                <strong>{step.title}</strong>
                <p>{step.desc}</p>
                <button onClick={() => handleMove(step.button.to)}>
                  {step.button.label}
                </button>
              </div>
            ))}
          </div>
        )}
        {userType === "corp" && (
          <div className={styles.steps}>
            <h3>기업 회원 온보딩</h3>
            {corpSteps.map((step, idx) => (
              <div key={idx} className={styles.stepBox}>
                <strong>{step.title}</strong>
                <p>{step.desc}</p>
                <button onClick={() => handleMove(step.button.to)}>
                  {step.button.label}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingSitemapModal;
