import { useState } from "react";
import useSignUpFormHandler from "../../hooks/useSignUpFormHandler";
import { useOutletContext, useNavigate } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import "./ChangePwPage.css";

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
    <div className="edit-change-pw-container">
      <form onSubmit={handleSubmit} className="edit-change-pw-form">
        <div className="edit-change-pw-form-item">
          <label htmlFor="currentPw">
            현재 비밀번호
            <input
              type="password"
              id="currentPw"
              name="currentPw"
              onChange={confirmPw}
              style={{
                borderColor: validity.currentPw === false ? "red" : undefined,
              }}
            />
          </label>
        </div>
        <div className="edit-change-pw-form-item">
          <label htmlFor="memPw">
            새 비밀번호
            <input
              name="memPw"
              type="password"
              value={formData.memPw}
              onChange={handleInputChange}
              style={{
                borderColor: validity.memPw === false ? "red" : undefined,
              }}
            />
            {validity.memPw === false && (
              <small style={{ color: "red" }}>
                새 비밀번호를 입력해주세요.
              </small>
            )}
          </label>
        </div>
        <div className="edit-change-pw-form-item">
          <label htmlFor="memPwConfirm">
            새 비밀번호 확인
            <input
              name="memPwConfirm"
              type="password"
              value={formData.memPwConfirm}
              onChange={handleInputChange}
              style={{
                borderColor:
                  formData.memPwConfirm.trim().length !== 0 &&
                  validity.memPwConfirm === false
                    ? "red"
                    : undefined,
              }}
            />
            {formData.memPwConfirm.trim().length !== 0 &&
              validity.memPwConfirm === false && (
                <small style={{ color: "red" }}>
                  비밀번호가 일치하지 않습니다.
                </small>
              )}
          </label>
        </div>

        <button type="submit" onClick={handleSubmit} disabled={isDisabled}>
          비밀번호 변경
        </button>
      </form>
    </div>
  );
};

export default ChangePwPage;
