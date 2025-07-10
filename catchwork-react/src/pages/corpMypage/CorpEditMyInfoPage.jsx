import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import useSignUpFormHandler from "../../hooks/useSignUpFormHandler";
import "./CorpEditMyInfoPage.css";
import { axiosApi } from "../../api/axiosAPI";
import ConfirmPwModal from "../../components/myPage/ConfirmPwModal";

const CorpEditMyInfoPage = () => {
  const navigate = useNavigate();
  const { loginMember } = useOutletContext();

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    loading: false,
  });

  const openModal = (type) => {
    setModalState({ isOpen: true, type, loading: false });
  };

  const closeModal = () => {
    if (modalState.loading) return;
    setModalState({ isOpen: false, type: null, loading: false });
  };

  const dateOnly = (date) => (date ? date.substring(0, 10) : "");
  const [addr, detailAddr] = (loginMember?.memAddr || "").split("^^^");

  const config = {
    fields: [
      "memEmail",
      "memTel",
      "memName",
      "memNickname",
      "memBirthday",
      "memGender",
      "memAddr",
      "corpDept",
    ],
    nicknameField: "memNickname",
    telField: "memTel",
    addrField: "memAddr",
  };

  const {
    formData,
    setFormData,
    handleInputChange,
    setField,
    validity,
    handleCheckNickname,
    triggerAddressSearch,
    validateForm,
  } = useSignUpFormHandler(
    {
      memEmail: loginMember?.memEmail || "",
      memTel: loginMember?.memTel || "",
      memName: loginMember?.memName || "",
      memNickname: loginMember?.memNickname || "",
      memBirthday: dateOnly(loginMember?.memBirthday) || "",
      memGender: loginMember?.memGender || "",
      memAddr: addr || "",
      detailAddress: detailAddr || "",
      memSmsFl: loginMember?.memSmsFl === "Y" ? true : false || false,
      corpDept: loginMember?.corpDept || "",
    },
    config
  );

  useEffect(() => {
    const [addr, detailAddr] = (loginMember?.memAddr || "").split("^^^");
    setFormData((prev) => ({
      ...prev,
      memTel: loginMember?.memTel || "",
      memName: loginMember?.memName || "",
      memNickname: loginMember?.memNickname || "",
      memBirthday: dateOnly(loginMember?.memBirthday) || "",
      memGender: loginMember?.memGender || "",
      memAddr: addr || "",
      detailAddress: detailAddr || "",
      memSmsFl: loginMember?.memSmsFl === "Y" ? true : false || false,
      memEmail: loginMember?.memEmail || "",
      corpDept: loginMember?.corpDept || "",
    }));
  }, [loginMember]);

  const isValid =
    formData.memEmail &&
    formData.memTel &&
    formData.memName &&
    formData.memNickname &&
    formData.memBirthday &&
    formData.memGender &&
    formData.memAddr &&
    formData.detailAddress &&
    formData.corpDept;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("입력 정보를 확인해주세요.");
      return;
    }
    openModal("password");
  };

  const verifyPassword = async (password) => {
    try {
      setModalState((prev) => ({ ...prev, loading: true }));
      const response = await axiosApi.post("/myPage/verifyPassword", {
        memNo: loginMember.memNo,
        memPw: password,
      });
      return response.status === 200 ? response.data : false;
    } catch (error) {
      console.error("비밀번호 확인 실패", error);
      throw error;
    } finally {
      setModalState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handlePasswordConfirm = async (password) => {
    try {
      const isPasswordValid = await verifyPassword(password);
      if (isPasswordValid) {
        closeModal();
        await performSubmit();
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      alert("비밀번호 확인 중 오류가 발생했습니다.");
      closeModal();
    }
  };

  const performSubmit = async () => {
    const addrData = formData.memAddr + "^^^" + formData.detailAddress;

    const requestData = {
      memNo: loginMember.memNo,
      memNickname: formData.memNickname,
      memName: formData.memName,
      memTel: formData.memTel,
      memEmail: formData.memEmail,
      memBirthday: formData.memBirthday.replaceAll("-", ""),
      memAddr: addrData,
      memGender: formData.memGender,
      memSmsFl: formData.memSmsFl ? "Y" : "N",
      corpDept: formData.corpDept,
    };

    try {
      const resp = await axiosApi.post("/myPage/updateMemberInfo", requestData);
      if (resp.status === 200) {
        navigate("/myPage/home");
      }
    } catch (error) {
      console.error("회원 정보 수정 실패", error);
      alert("회원 정보 수정 중 오류 발생");
    }
  };

  if (!loginMember || !loginMember.memId) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="edit-myinfo-container">
      <form onSubmit={handleSubmit} className="edit-myinfo-form">
        <div className="edit-myinfo-container">
          <div className="info-card">
            <div className="info-content">
              <span className="info-label">기업명</span>
              <span className="info-value font-medium">
                {loginMember.corpName || "기업명 없음"}
              </span>
            </div>

            <div className="info-content">
              <span className="info-label">아이디</span>
              <span className="info-value font-medium">
                {loginMember.memId}
              </span>
            </div>

            <div className="info-content">
              <span className="info-label">이메일</span>
              <div className="input-wrapper">
                <input
                  name="memEmail"
                  value={formData.memEmail}
                  onChange={handleInputChange}
                  required
                  style={{
                    borderColor: validity.memEmail === false ? "red" : undefined,
                  }}
                />
                {validity.memEmail === false && (
                  <small style={{ color: "red" }}>
                    이메일 형식이 올바르지 않습니다.
                  </small>
                )}
              </div>
            </div>

            <div className="info-content">
              <span className="info-label">전화번호</span>
              <div className="input-wrapper">
                <input
                  name="memTel"
                  value={formData.memTel}
                  onChange={handleInputChange}
                  required
                  style={{
                    borderColor: validity.memTel === false ? "red" : undefined,
                  }}
                />
                {validity.memTel === false && (
                  <small style={{ color: "red" }}>
                    전화번호 형식이 올바르지 않습니다.
                  </small>
                )}
              </div>
            </div>

            <div className="info-content">
              <span className="info-label">대표자명</span>
              <div className="input-wrapper">
                <input
                  name="memName"
                  value={formData.memName}
                  onChange={handleInputChange}
                  required
                  style={{
                    borderColor: validity.memName === false ? "red" : undefined,
                  }}
                />
                {validity.memName === false && (
                  <small style={{ color: "red" }}>
                    이름을 올바르게 입력해주세요.
                  </small>
                )}
              </div>
            </div>

            <div className="info-content">
              <span className="info-label">부서명</span>
              <div className="input-wrapper">
                <input
                  name="corpDept"
                  value={formData.corpDept}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="submit-button-container">
          <button
            type="submit"
            disabled={!isValid}
            className="submit-button"
            onClick={handleSubmit}
          >
            수정하기
          </button>
        </div>

        <ConfirmPwModal
          isOpen={modalState.isOpen}
          onClose={closeModal}
          onConfirm={handlePasswordConfirm}
          loading={modalState.loading}
        />
      </form>
    </div>
  );
};

export default CorpEditMyInfoPage;
