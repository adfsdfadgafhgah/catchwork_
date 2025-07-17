import { useEffect, useState } from "react";
import styles from "./CorpMyInfoPage.module.css"; // CSS 모듈 불러오기
import defaultLogo from "../../assets/icon.png";
import { axiosApi } from "../../api/axiosAPI";

function CorpMyInfo() {
  const logoImgUrl = import.meta.env.VITE_FILE_COMPANY_IMG_URL;
  const [company, setCompany] = useState(null);
  const [detailLogo, setDetailLogo] = useState(null);

  useEffect(() => {
    // 1번 API: 기본 기업 정보
    axiosApi
      .get("/corp/mypage")
      .then((res) => {
        setCompany(res.data);
      })
      .catch((err) => {
        // console.error("기업 정보 조회 실패", err);
      });
  }, []);

  useEffect(() => {
    // 2번 API: corpLogo만 별도 호출해서 따로 저장
    async function fetchDetailLogo() {
      try {
        if (!company?.memNo) return; // memNo가 있어야 호출 가능

        const res = await axiosApi.get("/corpcompany/detail", {
          params: { memNo: company.memNo },
        });
        setDetailLogo(res.data.corpLogo);
      } catch (err) {
        // console.error("상세 기업 로고 조회 실패", err);
      }
    }
    fetchDetailLogo();
  }, [company]);

  if (!company) {
    return (
      <div className={styles.loading}>
        <i className="fa-solid fa-spinner fa-spin"></i>
        기업 정보를 불러오는 중...
      </div>
    );
  }

  // detailLogo 우선, 없으면 company.corpLogo, 없으면 defaultLogo
  const logoSrc = detailLogo
    ? `${logoImgUrl}/${detailLogo}`
    : company.corpLogo
    ? `${logoImgUrl}/${company.corpLogo}`
    : defaultLogo;

  return (
    <div className={styles.corpmyinfoContainer}>
      <div className={styles.profileSection}>
        <div className={styles.corpmyinfoProfileImg}>
          <img src={logoSrc} alt="기업로고" className={styles.companyLogo} />
        </div>
        <div className={styles.profileInfo}>
          <h1>{company.corpName || "대표자 없음"}</h1>
        </div>
      </div>

      <div className={styles.corpmyinfoInfo}>
        <div className={styles.infoContent}>
          <span className={styles.infoLabel}>기업명</span>
          <span className={styles.infoValue}>
            {company.corpName || "기업명 없음"}
          </span>
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
          <span className={styles.infoValue}>
            {company.corpMemDept || "부서 없음"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CorpMyInfo;