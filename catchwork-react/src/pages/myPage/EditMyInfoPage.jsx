import { useEffect, useRef, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import useSignUpFormHandler from "../../hooks/useSignUpFormHandler";
import "./EditMyInfoPage.css";
import { axiosApi } from "../../api/axiosAPI";
import ConfirmPwModal from "../../components/myPage/ConfirmPwModal";
import defaultImg from "../../assets/icon.png";

const EditMyInfoPage = () => {
  const imgUrl = import.meta.env.VITE_FILE_PROFILE_IMG_URL;
  const navigate = useNavigate();
  const { loginMember } = useOutletContext();
  const [previewSrc, setPreviewSrc] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const fileInputRef = useRef(null);

  // 비밀번호 확인 모달 상태 관리
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    loading: false,
  });

  // 모달 열기
  const openModal = (type) => {
    setModalState({
      isOpen: true,
      type,
      loading: false,
    });
  };

  // 모달 닫기
  const closeModal = () => {
    if (modalState.loading) return; // 로딩 중에는 닫기 방지
    setModalState({
      isOpen: false,
      type: null,
      loading: false,
    });
  };

  // 날짜 형식 변환
  function dateOnly(date) {
    if (!date) return "";
    return date.substring(0, 10);
  }

  // 주소 파싱: '주소^^^상세주소' 형태 분리
  const [addr, detailAddr] = (loginMember?.memAddr || "").split("^^^");

  // config 정의
  const config = {
    fields: [
      "memEmail",
      "memTel",
      "memName",
      "memNickname",
      "memBirthday",
      "memGender",
      "memAddr",
    ],
    nicknameField: "memNickname",
    telField: "memTel",
    addrField: "memAddr",
  };

  // useSignUpFormHandler 사용
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
    },
    config
  );

  // loginMember가 바뀔 때마다&&새로고침 시 formData를 동기화
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
    }));
  }, [loginMember]);

  // 누락 검사
  const isValid =
    formData.memEmail &&
    formData.memTel &&
    formData.memName &&
    formData.memNickname &&
    formData.memBirthday &&
    formData.memGender &&
    formData.memAddr &&
    formData.detailAddress;

  // previewSrc가 바뀔 때마다 기존 URL 정리
  useEffect(() => {
    return () => {
      if (previewSrc) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);

  // 프로필 이미지 업로드 핸들러
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewSrc(previewUrl);
      setImgFile(file);
    }
  };

  const imgRef = useRef(null);

  // 프로필 이미지 업로드 버튼 클릭 시
  const handleClick = () => {
    fileInputRef.current.click();
  };

  // 프로필 이미지 업로드 핸들러
  const handleFileUpload = async () => {
    try {
      // 프로필 이미지 업로드
      const resp = await axiosApi.post(
        "/myPage/uploadProfileImg",
        { imgFile, memNo: loginMember.memNo },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // 업로드 성공 시
      if (resp.status === 200) {
        navigate("/myPage/home");
      }
      console.log("resp", resp.status);
    } catch (error) {
      console.error("프로필 이미지 업로드 실패", error);
      alert("프로필 이미지 업로드 중 오류 발생");
    }
  };

  // 수정하기 버튼 클릭 시
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!validateForm()) {
      alert("입력 정보를 확인해주세요.");
      return;
    }

    // 비밀번호 확인 모달 열기
    openModal("password");
  };

  // 비밀번호 확인 API 호출
  const verifyPassword = async (password) => {
    try {
      setModalState((prev) => ({ ...prev, loading: true }));

      const response = await axiosApi.post("/myPage/verifyPassword", {
        memNo: loginMember.memNo,
        memPw: password,
      });

      if (response.status === 200) {
        return response.data;
      } else {
        return false;
      }
    } catch (error) {
      console.error("비밀번호 확인 실패", error);
      throw error;
    } finally {
      setModalState((prev) => ({ ...prev, loading: false }));
    }
  };

  // 비밀번호 확인 후 실제 submit 로직 수행
  const handlePasswordConfirm = async (password) => {
    try {
      // 비밀번호 확인 API 호출
      const isPasswordValid = await verifyPassword(password);

      if (isPasswordValid) {
        // 비밀번호가 일치하는 경우 모달 닫기
        closeModal();
        // submit 로직 수행
        console.log("submit 로직 수행");
        await performSubmit();
      } else {
        alert("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("비밀번호 확인 실패", error);
      alert("비밀번호 확인 중 오류가 발생했습니다.");
      // 에러 발생 시 모달 상태 초기화
      closeModal();
    }
  };

  // 실제 submit 로직
  const performSubmit = async () => {
    // 주소 병합
    const addrData = formData.memAddr + "^^^" + formData.detailAddress;

    // 요청 데이터 생성
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
    };

    try {
      console.log("try 실행");
      console.log(requestData);
      const resp = await axiosApi.post("/myPage/updateMemberInfo", requestData);
      console.log("resp 실행");
      if (resp.status === 200) {
        if (imgFile) {
          console.log("imgFile 있음");
          handleFileUpload();
        } else {
          console.log("imgFile 없음");
        }
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
          {/* 프로필 이미지 */}
          <div className="profile-section">
            <div className="edit-profile-img" onClick={handleClick}>
              {previewSrc || loginMember?.memProfilePath ? (
                <img
                  ref={imgRef}
                  src={
                    previewSrc
                      ? previewSrc
                      : loginMember?.memProfilePath
                      ? `${imgUrl}/${loginMember.memProfilePath}`
                      : defaultImg
                  }
                  alt="프로필"
                />
              ) : (
                <i className="fas fa-user"></i>
              )}
              <input
                type="file"
                name="profileImg"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="info-card">
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
                    borderColor:
                      validity.memEmail === false ? "red" : undefined,
                  }}
                />
                {validity.memEmail === false && (
                  <small style={{ color: "red" }}>
                    이메일 형식이 올바르지 않습니다.
                  </small>
                )}
              </div>
            </div>

            <label className="info-content">
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
            </label>

            <div className="info-content">
              <span className="info-label">SMS 수신</span>
              <div className="checkbox-wrapper">
                <label>
                  <input
                    type="checkbox"
                    name="memSmsFl"
                    checked={formData.memSmsFl}
                    onChange={(e) => setField("memSmsFl", e.target.checked)}
                  />
                  SMS 수신 동의
                </label>
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

            <label className="info-content">
              <span className="info-label">닉네임</span>
              <div className="input-wrapper">
                <input
                  name="memNickname"
                  value={formData.memNickname}
                  onChange={handleInputChange}
                  required
                  style={{
                    borderColor:
                      validity.memNickname === false ? "red" : undefined,
                  }}
                />
                {validity.memNickname === false && (
                  <small style={{ color: "red" }}>
                    닉네임을 올바르게 입력해주세요.
                  </small>
                )}
              </div>
              <button
                type="button"
                onClick={handleCheckNickname}
                disabled={!formData.memNickname}
                className="check-button"
              >
                중복 확인
              </button>
            </label>

            <div className="info-content">
              <span className="info-label">생년월일</span>
              <div className="input-wrapper">
                <input
                  name="memBirthday"
                  type="date"
                  value={formData.memBirthday}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="info-content">
              <span className="info-label">성별</span>
              <div className="radio-wrapper">
                <label>
                  <input
                    type="radio"
                    name="memGender"
                    value="M"
                    checked={formData.memGender === "M"}
                    onChange={handleInputChange}
                    required
                  />
                  남
                </label>
                <label>
                  <input
                    type="radio"
                    name="memGender"
                    value="F"
                    checked={formData.memGender === "F"}
                    onChange={handleInputChange}
                    required
                  />
                  여
                </label>
              </div>
            </div>

            <div className="info-content address-content">
              <span className="info-label">주소</span>
              <div className="address-wrapper">
                <div className="address-input-group">
                  <input
                    name="memAddr"
                    value={formData.memAddr}
                    onChange={handleInputChange}
                    readOnly
                    required
                    placeholder="주소를 입력해주세요"
                  />
                  <button
                    type="button"
                    onClick={triggerAddressSearch}
                    className="address-button"
                  >
                    주소 찾기
                  </button>
                </div>
                <input
                  name="detailAddress"
                  value={formData.detailAddress}
                  onChange={handleInputChange}
                  placeholder="상세주소"
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

export default EditMyInfoPage;
