import { useState } from "react";
import useSignUpFormHandler from "../../hooks/useSignUpFormHandler";
import { useOutletContext, useNavigate } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import styles from "./ChangePwPage.module.css";

const ChangePwPage = () => {
  const { memNo } = useOutletContext();
  const [currentPw, setCurrentPw] = useState("");
  const navigate = useNavigate();

  const confirmPw = (e) => {
    setCurrentPw(e.target.value);
  };

  // config 사용해서 useSignUpForm을 Handle하기
  const config = {
    fields: ["memPw", "memPwConfirm"],
    pwField: "memPw",
    pwConfirmField: "memPwConfirm",
  };

  const { formData, handleInputChange, validity, validateForm, setFormData } =
    useSignUpFormHandler(
      {
        memPw: "",
        memPwConfirm: "",
      },
      config
    );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("입력 정보를 확인해주세요.");
      return;
    }

    if (formData.memPw !== formData.memPwConfirm) {
      alert("새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    const requestData = new URLSearchParams();
    requestData.append("currentPw", currentPw);
    requestData.append("memPw", formData.memPw);
    requestData.append("memNo", memNo);

    try {
      const response = await axiosApi.post("/myPage/changePw", requestData);
      if (response.status === 200) {
        alert(response.data);
        navigate("/mypage/home");
        return;
      }
      alert(response.data);
      setCurrentPw("");
      setFormData({ memPw: "", memPwConfirm: "" });
      return;
    } catch (error) {
      console.error(error);
    }
  };

  const isDisabled =
    currentPw === "" || formData.memPw === "" || formData.memPwConfirm === "";

  return (
    <div className={styles.editContainer}>
      <div className={styles.editForm}>
        <div className={styles.editHeader}>
          <h1>비밀번호 변경</h1>
          <p>
            보안을 위해 현재 비밀번호를 입력한 후 <br /> 새 비밀번호를
            설정해주세요.
          </p>
        </div>
        <div className={styles.formContent}>
          <form onSubmit={handleSubmit} className={styles.infoCard}>
            <div className={styles.infoContent}>
              <div className={styles.infoLabel}>현재 비밀번호</div>
              <div className={styles.inputWrapper}>
                <input
                  type="password"
                  id="currentPw"
                  name="currentPw"
                  onChange={confirmPw}
                  className={
                    validity.currentPw === false ? styles.inputError : ""
                  }
                />
              </div>
            </div>

            <div className={styles.infoContent}>
              <div className={styles.infoLabel}>새 비밀번호</div>
              <div className={styles.inputWrapper}>
                <input
                  name="memPw"
                  type="password"
                  value={formData.memPw}
                  onChange={handleInputChange}
                  className={validity.memPw === false ? styles.inputError : ""}
                />
                {validity.memPw === false && (
                  <div className={styles.errorMessage}>
                    비밀번호는 영문, 숫자, 특수문자 포함 8~20자여야 합니다.
                  </div>
                )}
              </div>
            </div>

            <div className={styles.infoContent}>
              <div className={styles.infoLabel}>새 비밀번호 확인</div>
              <div className={styles.inputWrapper}>
                <input
                  name="memPwConfirm"
                  type="password"
                  value={formData.memPwConfirm}
                  onChange={handleInputChange}
                  className={
                    formData.memPwConfirm.trim().length !== 0 &&
                    validity.memPwConfirm === false
                      ? styles.inputError
                      : ""
                  }
                />
                {formData.memPwConfirm.trim().length !== 0 &&
                  validity.memPwConfirm === false && (
                    <div className={styles.errorMessage}>
                      비밀번호가 일치하지 않습니다.
                    </div>
                  )}
              </div>
            </div>
          </form>
        </div>

        <div className={styles.submitContainer}>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isDisabled}
            className={styles.submitButton}
          >
            비밀번호 변경
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePwPage;
