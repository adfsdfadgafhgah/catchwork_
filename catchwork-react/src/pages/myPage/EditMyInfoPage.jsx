import { useEffect, useRef, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import memberFormHandler from "../../hooks/memberFormHandler";
import "./EditMyInfoPage.css";
import { axiosApi } from "../../api/axiosAPI";

const EditMyInfoPage = () => {
  const imgUrl = import.meta.env.VITE_FILE_PROFILE_IMG_URL;
  const navigate = useNavigate();
  const { loginMember } = useOutletContext();
  const [previewSrc, setPreviewSrc] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const fileInputRef = useRef(null);

  // 날짜 형식 변환
  function dateOnly(date) {
    if (!date) return "";
    return date.substring(0, 10);
  }

  // 주소 파싱: '주소^^^상세주소' 형태 분리
  const [addr, detailAddr] = (loginMember?.memAddr || "").split("^^^");
  // 폼 상태 및 유효성 관리
  const {
    formData,
    setFormData,
    handleChange,
    setField,
    validity,
    handleCheckNickname,
    triggerAddressSearch,
    validateForm,
  } = memberFormHandler({
    memTel: loginMember?.memTel || "",
    memName: loginMember?.memName || "",
    memNickname: loginMember?.memNickname || "",
    memBirthday: dateOnly(loginMember?.memBirthday) || "",
    memGender: loginMember?.memGender || "",
    memAddr: addr || "",
    detailAddress: detailAddr || "",
    memSmsFl: loginMember?.memSmsFl || false,
    memEmail: loginMember?.memEmail || "",
    // 테스트용 임시 비밀번호 유효성 검사 통과 값
    memPw: "payment1!",
    memPwConfirm: "payment1!",
  });

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
      memSmsFl: loginMember?.memSmsFl || false,
      memEmail: loginMember?.memEmail || "",
      // 테스트용 임시 비밀번호 유효성 검사 통과 값
      memPw: "payment1!",
      memPwConfirm: "payment1!",
    }));
  }, [loginMember]);

  const isValid =
    formData.memTel &&
    formData.memName &&
    formData.memNickname &&
    formData.memBirthday &&
    formData.memGender &&
    formData.memAddr &&
    formData.detailAddress &&
    formData.memEmail;

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

  // 프로필 이미지 업로드 버튼 클릭 시
  const handleClick = () => {
    fileInputRef.current.click();
  };

  // 프로필 이미지 업로드 핸들러
  const handleFileUpload = async () => {
    try {
      // 프로필 이미지 업로드
      const resp = await axiosApi.post(
        "/mypage/uploadProfileImg",
        { imgFile, memNo: loginMember.memNo },
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // 업로드 성공 시
      if (resp.status === 200) {
        navigate("/myPage/editMyInfo");
      }
    } catch (error) {
      console.error("프로필 이미지 업로드 실패", error);
      alert("프로필 이미지 업로드 중 오류 발생");
    }
  };

  // 수정하기 버튼 클릭 시
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 디버깅용
    console.log("수정하기 버튼 클릭");
    console.log(formData.memPw);
    console.log(formData.memPwConfirm);

    // 유효성 검사
    if (!validateForm()) {
      alert("입력 정보를 확인해주세요.");
      return;
    }

    // 디버깅용
    console.log("유효성 검사 완료");

    // 주소 병합
    const addrData = formData.memAddr + "^^^" + formData.detailAddress;

    // 요청 데이터 생성
    const requestData = {
      memNo: loginMember.memNo,
      memNickname: formData.memNickname,
      memName: formData.memName,
      memTel: formData.memTel,
      memEmail: formData.memEmail,
      memBirthday: formData.memBirthday,
      memAddr: addrData,
      memGender: formData.memGender,
      memSmsFl: formData.memSmsFl,
    };

    // 디버깅용
    console.log(requestData);

    try {
      const resp = await axiosApi.post("/mypage/updateMemberInfo", requestData);

      if (resp.status === 200) {
        handleFileUpload();
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
            <div className="edit-profile-img">
              {previewSrc ? (
                <img src={previewSrc} alt="프로필" onClick={handleClick} />
              ) : (
                <i className="fas fa-user"></i>
              )}
              <input
                type="file"
                name="profileImg"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
            {/* 테스트용 임시 비밀번호 유효성 검사 통과 값 */}
            <input
              name="memPw"
              type="password"
              value={formData.memPw}
              onChange={handleChange}
              style={{
                borderColor: validity.memPw === false ? "red" : undefined,
              }}
            />
            <input
              name="memPwConfirm"
              type="password"
              value={formData.memPwConfirm}
              onChange={handleChange}
              style={{
                borderColor: validity.memPw === false ? "red" : undefined,
              }}
            />
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
              <button
                type="button"
                onClick={() => sendVerificationCode(formData.memTel)}
                className="check-button"
                disabled={!formData.memTel}
              >
                인증번호 발송
              </button>
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                  onChange={handleChange}
                  placeholder="상세주소"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="submit-button-container">
          <button type="submit" disabled={!isValid} className="submit-button">
            수정하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMyInfoPage;
