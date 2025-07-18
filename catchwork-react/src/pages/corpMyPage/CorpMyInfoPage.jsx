import { useEffect, useState } from "react";
import styles from "./CorpMyInfoPage.module.css"; // 기존 CSS 유지
import defaultLogo from "../../assets/icon.png";
import { axiosApi } from "../../api/axiosAPI";

function CorpMyInfo() {
  const logoImgUrl = import.meta.env.VITE_FILE_COMPANY_IMG_URL;
  const [company, setCompany] = useState(null);
  const [detailLogo, setDetailLogo] = useState(null);

  useEffect(() => {
    axiosApi
      .get("/corp/mypage")
      .then((res) => setCompany(res.data))
      .catch((err) => {});
  }, []);

  useEffect(() => {
    async function fetchDetailLogo() {
      if (!company?.memNo) return;
      try {
        const res = await axiosApi.get("/corpcompany/detail", {
          params: { memNo: company.memNo },
        });
        setDetailLogo(res.data.corpLogo);
      } catch (err) {}
    }
    fetchDetailLogo();
  }, [company]);

  if (!company) {
    return (
      <div className="loading">
        <i className="fa-solid fa-spinner fa-spin"></i> 기업 정보를 불러오는 중...
      </div>
    );
  }

  const logoSrc = detailLogo
    ? `${logoImgUrl}/${detailLogo}`
    : company.corpLogo
    ? `${logoImgUrl}/${company.corpLogo}`
    : defaultLogo;

  return (
    <main className={styles.corpmyinfoContainer}>
      <div className={styles.profileSection}>
        <div className={styles.profileImgContainer}>
          <div className={styles.corpmyinfoProfileImg}>
            <img src={logoSrc} alt="기업 로고" />
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>{company.corpName || "대표자 없음"}</span>
            <span className={styles.profileInfoLabel}></span>
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.infoContent}>
            <span className={styles.infoLabel}>기업명</span>
            <span className={styles.infoValue}>{company.corpName || "기업명 없음"}</span>
          </div>
          <div className={styles.infoContent}>
            <span className={styles.infoLabel}>아이디</span>
            <span className={styles.infoValue}>{company.memId || "-"}</span>
          </div>
          <div className={styles.infoContent}>
            <span className={styles.infoLabel}>이메일</span>
            <span className={styles.infoValue}>{company.memEmail || "-"}</span>
          </div>
          <div className={styles.infoContent}>
            <span className={styles.infoLabel}>전화번호</span>
            <span className={styles.infoValue}>{company.memTel || "-"}</span>
          </div>
          <div className={styles.infoContent}>
            <span className={styles.infoLabel}>이름</span>
            <span className={styles.infoValue}>{company.memName || "-"}</span>
          </div>
          <div className={styles.infoContent}>
            <span className={styles.infoLabel}>부서명</span>
            <span className={styles.infoValue}>{company.corpMemDept || "부서 없음"}</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CorpMyInfo;
