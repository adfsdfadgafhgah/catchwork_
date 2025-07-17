import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import styles from "./MyInfoPage.module.css";
import defaultImg from "../../assets/icon.png";
import { axiosApi } from "../../api/axiosAPI";

function MyInfo() {
  const imgUrl = import.meta.env.VITE_FILE_PROFILE_IMG_URL;
  const { memNo } = useOutletContext();
  const [loginMember, setLoginMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 로그인 멤버 정보 조회
  const getLoginMember = async () => {
    const resp = await axiosApi.post("/member/getLoginMember", { memNo });
    if (resp.status === 200) {
      setLoginMember(resp.data);
    }
  };

  // 최초 마운트 시, 로그인 멤버 정보 조회
  useEffect(() => {
    getLoginMember();
  }, []);

  // 로그인 멤버 정보 조회 후, 로딩 종료
  useEffect(() => {
    if (loginMember) {
      setIsLoading(false);
    }
  }, [loginMember]);

  // 생년월일 포맷팅 함수
  const formatBirthday = (birthday) => {
    if (!birthday) return "";

    const year = birthday.substring(0, 4);
    const month = birthday.substring(5, 7);
    const day = birthday.substring(8, 10);
    const age = new Date().getFullYear() - parseInt(year);

    return `${year}년 ${month}월 ${day}일 ${age}세`;
  };

  // 주소 포맷팅 함수
  const formatAddress = (address) => {
    if (!address) return [];
    return address.split("^^^");
  };

  // 로딩 중일 때, 로딩 중 메시지 출력
  if (isLoading) {
    return (
      <div className="loading">
        <i className="fa-solid fa-spinner fa-spin"></i> Loading...
      </div>
    );
  }

  // 로그인 멤버 정보 조회 후, 프로필 정보 출력
  return (
    <main className={styles.myinfoContainer}>
      <div className={styles.profileSection}>
        <div className={styles.profileImgContainer}>
          <div className={styles.profileImg}>
            <img
              src={
                loginMember.memProfilePath
                  ? `${imgUrl}/${loginMember.memProfilePath}`
                  : defaultImg
              }
              alt="프로필 이미지"
            />
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>
              {loginMember.memNickname}
            </span>
            <span className={styles.profileInfoLabel}>님</span>
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.infoContent}>
            <span className={styles.infoLabel}>아이디</span>
            <span className={`${styles.infoValue} ${styles.fontMedium}`}>
              {loginMember.memId}
            </span>
          </div>

          <div className={styles.infoContent}>
            <span className={styles.infoLabel}>이메일</span>
            <span className={styles.infoValue}>{loginMember.memEmail}</span>
          </div>

          <div className={styles.infoContent}>
            <span className={styles.infoLabel}>전화번호</span>
            <span className={styles.infoValue}>{loginMember.memTel}</span>
          </div>

          <div className={styles.infoContent}>
            <span className={styles.infoLabel}>이름</span>
            <span className={`${styles.infoValue} ${styles.fontMedium}`}>
              {loginMember.memName}
            </span>
          </div>

          <div className={styles.infoContent}>
            <span className={styles.infoLabel}>생년월일</span>
            <span className={styles.infoValue}>
              {formatBirthday(loginMember.memBirthday)}
            </span>
          </div>

          <div className={styles.infoContent}>
            <span className={styles.infoLabel}>성별</span>
            <span className={styles.infoValue}>
              {loginMember.memGender === "M" ? "남성" : "여성"}
            </span>
          </div>

          <div className={styles.infoContent}>
            <span className={styles.infoLabel}>주소</span>
            <span className={styles.infoValue}>
              {formatAddress(loginMember.memAddr).map((addressLine, index) => (
                <div key={index} className={styles.infoValueLine}>
                  {addressLine}
                </div>
              ))}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MyInfo;
