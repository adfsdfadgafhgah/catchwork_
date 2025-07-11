import { useEffect, useState } from "react";
import "./ScrollToTopButton.css";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollY = window.scrollY;

    //스크롤의 위치가 300이상이면 보이게
    if (scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0, //페이지 최상단으로
      behavior: "smooth", //부드럽게
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isVisible ? (
    <button className="scroll-to-top-btn" onClick={scrollToTop}>
      ↑
    </button>
  ) : null;
};

export default ScrollToTopButton;
