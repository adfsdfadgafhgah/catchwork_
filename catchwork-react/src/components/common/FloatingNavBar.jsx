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
        {navItems.map((item) => (
          <li key={item.id}>
            <button onClick={() => handleClick(item.id)}>{item.label}</button>
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
