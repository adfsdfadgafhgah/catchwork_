import React from "react";
import styles from "./FloatingNavBar.module.css";
import OnboardingSitemapModal from "./OnboardingSitemapModal";

const navItems = [
  { id: "popular-recruits", label: "인기 채용공고" },
  { id: "latest-recruits", label: "최신 채용공고" },
  { id: "popular-companies", label: "인기 기업정보" },
  { id: "popular-boards", label: "인기 게시글" },
  { id: "sitemap", label: "사이트맵" },
];

const FloatingNavBar = () => {
  const [showSitemapModal, setShowSitemapModal] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("");

  React.useEffect(() => {
    // sitemap은 실제 섹션이 아니므로 제외
    const sectionIds = navItems
      .filter((item) => item.id !== "sitemap")
      .map((item) => item.id);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        // 뷰포트의 상단 30% 지점에서 감지
        rootMargin: "-30% 0px -70% 0px",
        threshold: 0,
      }
    );

    // 각 섹션 관찰 시작
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      // 컴포넌트 언마운트 시 관찰 중단
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  const handleClick = (id) => {
    if (id === "sitemap") {
      setShowSitemapModal(true);
      return;
    }
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className={styles.floatingNavBar}>
      <ul>
        {navItems.map((item, index) => (
          <li key={item.id}>
            <button
              onClick={() => handleClick(item.id)}
              className={activeSection === item.id ? styles.active : ""}
            >
              <span className={styles.indicator}>
                <span className={styles.dot}></span>
              </span>
              <span className={styles.label}>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      {showSitemapModal && (
        <OnboardingSitemapModal onClose={() => setShowSitemapModal(false)} />
      )}
    </nav>
  );
};

export default FloatingNavBar;
