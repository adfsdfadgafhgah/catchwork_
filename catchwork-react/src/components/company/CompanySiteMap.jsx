import React, { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import styles from "./CompanySiteMap.module.css";
import { useNavigate } from "react-router-dom";

// 데이터 모듈
const siteData = {
  intro: {
    title: "사이트 소개",
    description:
      "CatchWork는 기업과 구직자를 연결하는 채용 플랫폼입니다. 채용 공고를 등록하고 원하는 인재를 찾아보세요.",
  },
  corpSteps: [
    {
      title: "기업 회원 가입",
      desc: "기업 회원 가입을 하면 공고를 등록할 수 있습니다.",
      button: { label: "기업 회원 가입", to: "/signup?type=corporate" },
    },
    {
      title: "공고 등록",
      desc: "공고를 등록하고 구직자의 이력서를 받아보세요.",
      button: { label: "공고 등록", to: "/corprecruit/write" },
    },
  ],
};

// 유틸리티 함수들
const modalUtils = {
  openModal: () => {
    document.body.style.overflow = "hidden";
  },
  closeModal: () => {
    document.body.style.overflow = "unset";
  },
};

// 플로팅 버튼 컴포넌트
const FloatingButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className={styles.floatingButton}
    aria-label="사이트 도움말 열기"
  >
    <HelpCircle size={24} className={styles.floatingIcon} />
  </button>
);

// 모달 헤더 컴포넌트
const ModalHeader = ({ onClose }) => (
  <div className={styles.modalHeader}>
    <h2 className={styles.modalTitle}>사이트 이용 가이드</h2>
    <button
      onClick={onClose}
      className={styles.closeButton}
      aria-label="모달 닫기"
    >
      <X size={24} />
    </button>
  </div>
);

// 사이트 소개 섹션 컴포넌트
const IntroSection = ({ data }) => (
  <div className={styles.introSection}>
    <h3 className={styles.sectionTitle}>{data.title}</h3>
    <p className={styles.sectionDescription}>{data.description}</p>
  </div>
);

// 단계 카드 컴포넌트
const StepCard = ({ step, index, onNavigate }) => {
  return (
    <div className={styles.stepCard}>
      <div className={styles.stepContent}>
        <div className={styles.stepNumber}>{index + 1}</div>
        <div className={styles.stepInfo}>
          <div className={styles.stepTitleWrapper}>
            <h4 className={styles.stepTitle}>{step.title}</h4>
          </div>
          <p className={styles.stepDescription}>{step.desc}</p>
          {step.button.label !== "기업 회원 가입" && (
            <button
              onClick={() => onNavigate(step.button.to)}
              className={styles.stepButton}
            >
              {step.button.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// 온보딩 섹션 컴포넌트
const OnboardingSection = ({ steps, onNavigate }) => (
  <div className={styles.onboardingSection}>
    <h3 className={styles.sectionTitle}>기업 회원 온보딩</h3>
    <div className={styles.stepsContainer}>
      {steps.map((step, idx) => (
        <StepCard key={idx} step={step} index={idx} onNavigate={onNavigate} />
      ))}
    </div>
  </div>
);

// 모달 컨텐츠 컴포넌트
const ModalContent = ({ onClose, onNavigate }) => (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContainer}>
      <ModalHeader onClose={onClose} />
      <div className={styles.modalBody}>
        <IntroSection data={siteData.intro} />
        <OnboardingSection steps={siteData.corpSteps} onNavigate={onNavigate} />
      </div>
    </div>
  </div>
);

// 메인 컴포넌트
const CompanySiteMap = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = () => {
    setIsModalOpen(true);
    modalUtils.openModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    modalUtils.closeModal();
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeModal();
  };

  return (
    <>
      <FloatingButton onClick={openModal} />
      {isModalOpen && (
        <ModalContent onClose={closeModal} onNavigate={handleNavigation} />
      )}
    </>
  );
};

export default CompanySiteMap;
