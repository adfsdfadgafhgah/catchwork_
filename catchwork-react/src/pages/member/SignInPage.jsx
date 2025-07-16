import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../../assets/icon.png";
import styles from "./SignInPage.module.css";
import { useAuthStore } from "../../stores/authStore";

const SignInPage = () => {
  const [isCorp, setIsCorp] = useState(false);
  const [memId, setMemId] = useState("");
  const [memPw, setMemPw] = useState("");
  const { signin, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // form 기본 제출 막기

    const result = await signin(memId, memPw, isCorp ? 1 : 0);
    if (result.success) {
      const { memType } = useAuthStore.getState();

      // 기업 로그인 탭인데 개인 회원일 경우
      if (isCorp && memType !== 1) {
        alert("잘못된 아이디,비밀번호입니다.");
        await signOut();
        return;
      }

      // 개인 로그인 탭인데 기업 회원일 경우
      if (!isCorp && memType !== 0) {
        alert("잘못된 아이디,비밀번호입니다.");
        await signOut();
        return;
      }

      // 로그인 성공 시 페이지 이동
      navigate(memType === 0 ? "/" : "/");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className={styles.signinContainer}>
      <div className={styles.signinLeft}>
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>
            <img src={icon} className={styles.catIcon} />
          </div>
        </div>
      </div>

      <div className={styles.signinRight}>
        <div className={styles.formContainer}>
          <div className={styles.tabButtons}>
            <button
              type="button"
              className={`${styles.tabButton} ${!isCorp ? styles.active : ""}`}
              onClick={() => setIsCorp(false)}
            >
              개인 회원
            </button>
            <button
              type="button"
              className={`${styles.tabButton} ${isCorp ? styles.active : ""}`}
              onClick={() => setIsCorp(true)}
            >
              기업 회원
            </button>
          </div>

          <form className={styles.signinForm} onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="아이디를 입력해주세요"
                value={memId}
                onChange={(e) => setMemId(e.target.value)}
                className={styles.inputField}
                required
              />
              <input
                type="password"
                placeholder="비밀번호를 입력해주세요"
                value={memPw}
                onChange={(e) => setMemPw(e.target.value)}
                className={styles.inputField}
                required
              />
            </div>

            <button type="submit" className={styles.signinButton}>
              로그인하기
            </button>

            <div className={styles.links}>
              <span
                onClick={() =>
                  navigate(
                    "/findid?type=" + (isCorp ? "corporate" : "personal")
                  )
                }
                className={styles.findBtn}
              >
                아이디 찾기
              </span>
              <span className={styles.divider}>|</span>
              <span
                onClick={() =>
                  navigate(
                    "/findpw?type=" + (isCorp ? "corporate" : "personal")
                  )
                }
                className={styles.findBtn}
              >
                비밀번호 찾기
              </span>
              <span className={styles.divider}>|</span>
              <span
                onClick={() =>
                  navigate(
                    "/signup?type=" + (isCorp ? "corporate" : "personal")
                  )
                }
                className={styles.findBtn}
              >
                회원가입하기
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
