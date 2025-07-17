import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import "./CorpEditMyInfoPage.css";
import { axiosApi } from "../../api/axiosAPI";
import ConfirmPwModal from "../../components/myPage/ConfirmPwModal";
import useLoginMember from "../../stores/loginMember";

const CorpEditMyInfoPage = () => {
  const navigate = useNavigate();
  const { loginMember, corpInfo, setCorpInfo } = useOutletContext();
  const { setLoginMember } = useLoginMember();

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    loading: false,
  });

  const [formData, setFormData] = useState({
    memEmail: "",
    memTel: "",
    memName: "",
    corpMemDept: "",
  });

  useEffect(() => {
    setFormData({
      memEmail: loginMember?.memEmail || "",
      memTel: loginMember?.memTel || "",
      memName: loginMember?.memName || "",
      corpMemDept: corpInfo?.corpMemDept || "",
    });
  }, [loginMember, corpInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "memTel") {
      // 숫자만 남기고 하이픈 자동 추가
      const onlyNums = value.replace(/\D/g, "");
      let formattedTel = "";

      if (onlyNums.length < 4) {
        formattedTel = onlyNums;
      } else if (onlyNums.length < 8) {
        formattedTel = onlyNums.slice(0, 3) + "-" + onlyNums.slice(3);
      } else {
        formattedTel =
          onlyNums.slice(0, 3) +
          "-" +
          onlyNums.slice(3, 7) +
          "-" +
          onlyNums.slice(7, 11);
      }

      setFormData((prev) => ({
        ...prev,
        [name]: formattedTel,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    openModal("password");
  };

  const openModal = (type) => {
    setModalState({ isOpen: true, type, loading: false });
  };

  const closeModal = () => {
    if (!modalState.loading) {
      setModalState({ isOpen: false, type: null, loading: false });
    }
  };

  const verifyPassword = async (password) => {
    try {
      setModalState((prev) => ({ ...prev, loading: true }));
      const response = await axiosApi.post("/corp/verifyPassword", {
        memNo: loginMember.memNo,
        memPw: password,
      });
      return response.status === 200 ? response.data : false;
    } catch (error) {
      // console.error("비밀번호 확인 실패", error);
      return false;
    } finally {
      setModalState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handlePasswordConfirm = async (password) => {
    const isPasswordValid = await verifyPassword(password);
    if (isPasswordValid) {
      closeModal();
      await performSubmit();
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  const performSubmit = async () => {
    const requestData = {
      memNo: loginMember.memNo,
      memEmail: formData.memEmail,
      memTel: formData.memTel,
      memName: formData.memName,
      corpMemDept: formData.corpMemDept,
    };

    try {
      const resp = await axiosApi.post("/corp/updateMemberInfo", requestData);
      if (resp.status === 200) {
        const newInfo = await axiosApi.get("/corp/mypage");
        setCorpInfo(newInfo.data);
        await setLoginMember();
        navigate("/corpmypage");
      }
    } catch (error) {
      // console.error("회원 정보 수정 실패", error);
      alert("회원 정보 수정 중 오류 발생");
    }
  };

  if (!loginMember) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="edit-myinfo-container">
      <form onSubmit={handleSubmit} className="edit-myinfo-form">
        <div className="info-card">
          <div className="info-content">
            <span className="info-label">기업명</span>
            <span className="info-value">{corpInfo?.corpName || "기업명 없음"}</span>
          </div>

          <div className="info-content">
            <span className="info-label">아이디</span>
            <span className="info-value">{loginMember.memId}</span>
          </div>

          <div className="info-content">
            <span className="info-label">이메일</span>
            <div className="input-wrapper">
              <input
                name="memEmail"
                value={formData.memEmail}
                onChange={handleInputChange}
                required
              />
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
                placeholder="010-1234-5678"
                maxLength={13} // 하이픈 포함 최대 길이
              />
            </div>
          </div>

          <div className="info-content">
            <span className="info-label">이름</span>
            <div className="input-wrapper">
              <input
                name="memName"
                value={formData.memName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="info-content">
            <span className="info-label">부서명</span>
            <div className="input-wrapper">
              <input
                name="corpMemDept"
                value={formData.corpMemDept}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="submit-button-container">
          <button
            type="submit"
            className="submit-button"
            disabled={
              !formData.memEmail ||
              !formData.memTel ||
              !formData.memName ||
              !formData.corpMemDept
            }
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
