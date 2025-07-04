import { useEffect, useRef, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import useFormHandler from "../../hooks/useFormHandler";
import "./EditMyInfoPage.css";
import { axiosApi } from "../../api/axiosAPI";

const EditMyInfoPage = () => {
  const imgUrl = import.meta.env.VITE_FILE_CV_IMG_URL;
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [previewSrc, setPreviewSrc] = useState("");
  const { loginMember } = useOutletContext();

  // 프로필 이미지 업로드 버튼 클릭 시
  const handleClick = () => {
    fileInputRef.current.click();
  };

  // 주소 파싱: '주소^^^상세주소' 형태 분리
  const [addr, detailAddr] = (loginMember?.memAddr || "").split("^^^");

  // 날짜 형식 변환
  function dateOnly(date) {
    if (!date) return "";
    return date.substring(0, 10);
  }

  // useFormHandler로 폼 상태 및 유효성 관리
  const { formData, setFormData, handleChange, setField, validity } =
    useFormHandler({
      memTel: loginMember?.memTel || "",
      memName: loginMember?.memName || "",
      memNickname: loginMember?.memNickname || "",
      memBirthday: dateOnly(loginMember?.memBirthday) || "",
      memGender: loginMember?.memGender || "",
      memAddr: addr || "",
      detailAddress: detailAddr || "",
      memSmsFl: loginMember?.memSmsFl || false,
      memEmail: loginMember?.memEmail || "",
      profileImgPath: loginMember?.profileImgPath || "",
      profileImg: null,
    });

  // loginMember가 바뀔 때마다 formData를 동기화
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
      // profileImg는 사용자가 직접 업로드한 경우만 변경
    }));
  }, [loginMember]);

  useEffect(() => {
    // previewSrc가 바뀔 때마다 기존 URL 정리
    return () => {
      if (previewSrc) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);

  // 프로필 이미지 업로드 핸들러
  const handleFileChange = async (e) => {
    // 파일 선택 시
    const file = e.target.files[0];
    if (file) {
      // 미리보기 이미지 설정
      const previewUrl = URL.createObjectURL(file);
      setPreviewSrc(previewUrl);

      const imgRequestData = {
        memNo: loginMember.memNo,
        file: file,
      };

      try {
        // 프로필 이미지 업로드
        const resp = await axiosApi.post(
          "/mypage/uploadProfileImg",
          imgRequestData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        // 업로드 성공 시
        if (resp.status === 200) {
          setFormData((prev) => ({
            ...prev,
            profileImgPath: resp.data, // 응답 받은 리네임된 경로 저장
          }));
        }
      } catch (error) {
        console.error("프로필 이미지 업로드 실패", error);
        alert("프로필 이미지 업로드 중 오류 발생");
      }
    }
  };

  // 필수값 및 유효성 체크
  const isValid =
    validity.memTel &&
    validity.memName &&
    validity.memNickname &&
    formData.memBirthday.trim() &&
    formData.memGender.trim() &&
    formData.memAddr.trim() &&
    formData.detailAddress.trim() &&
    validity.memEmail;

  // 주소 찾기(임시)
  const searchAddress = () => {
    alert("주소 검색 기능은 구현 필요");
  };

  // 수정하기 버튼 클릭 시
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    // 서버 제출 시 memAddr = memAddr + '^^^' + detailAddress로 합쳐서 제출
    const submitData = {
      ...formData,
      memAddr: formData.memAddr + "^^^" + formData.detailAddress,
    };

    try {
      const resp = await axiosApi.post("/mypage/updateMemberInfo", submitData);
    } catch (error) {
      console.error("회원 정보 수정 실패", error);
      alert("회원 정보 수정 중 오류 발생");
    }
  };

  return (
    <div className="editmyinfo-container">
      <form onSubmit={handleSubmit}>
        <div className="editmyinfo-form">
          {/* 프로필 이미지 */}
          <div className="profile-section">
            <div className="profile-img">
              {formData.profileImg ? (
                <img
                  src={URL.createObjectURL(formData.profileImg)}
                  alt="프로필"
                />
              ) : (
                <i className="fas fa-user"></i>
              )}
              <input
                type="file"
                name="profileImg"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <div className="profile-info">
              <h1>{formData.memNickname}</h1>
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

            <div className="info-content">
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
            </div>

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

            <div className="info-content">
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
            </div>

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
                  <button type="button" onClick={searchAddress}>
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

        <button type="submit" disabled={!isValid} className="submit-button">
          수정하기
        </button>
      </form>
    </div>
  );
};

export default EditMyInfoPage;
