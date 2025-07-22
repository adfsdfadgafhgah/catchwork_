import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";

const Layout = () => {
  // 이미지 로드 실패 시 기본 이미지로 대체
  useEffect(() => {
    const fallbackSrc = "/src/assets/icon.png";

    const handleError = (e) => {
      if (e.target.tagName === "IMG" && e.target.src !== fallbackSrc) {
        e.target.src = fallbackSrc;
      }
    };

    document.addEventListener("error", handleError, true); // useCapture=true

    return () => {
      document.removeEventListener("error", handleError, true);
    };
  }, []);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
