import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./MyInfoPage.css";
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
    <div className="myinfo-container">
      <div className="profile-section">
        <div className="myinfo-profile-img">
          <img
            src={
              loginMember.memProfilePath
                ? `${imgUrl}/${loginMember.memProfilePath}`
                : defaultImg
            }
          />
        </div>

        <div className="profile-info">
          <h1>{loginMember.memNickname}</h1>
        </div>
      </div>

      <div className="info-card">
        <div className="info-content">
          <span className="info-label">아이디</span>
          <span className="info-value font-medium">{loginMember.memId}</span>
        </div>

        <div className="info-content">
          <span className="info-label">이메일</span>
          <span className="info-value">{loginMember.memEmail}</span>
        </div>

        <div className="info-content">
          <span className="info-label">전화번호</span>
          <span className="info-value">{loginMember.memTel}</span>
        </div>

        <div className="info-content">
          <span className="info-label">이름</span>
          <span className="info-value font-medium">{loginMember.memName}</span>
        </div>

        <div className="info-content">
          <span className="info-label">생년월일</span>
          <span className="info-value">
            {loginMember.memBirthday?.substring(0, 4)}년{" "}
            {loginMember.memBirthday?.substring(5, 7)}월{" "}
            {loginMember.memBirthday?.substring(8, 10)}일{" "}
            {new Date().getFullYear() -
              loginMember.memBirthday?.substring(0, 4)}
            세
          </span>
        </div>

        <div className="info-content">
          <span className="info-label">성별</span>
          <span className="info-value">{loginMember.memGender}</span>
        </div>

        <div className="info-content">
          <span className="info-label">주소</span>
          <span className="info-value">
            <div className="info-value-line">
              {loginMember?.memAddr?.split("^^^")[0]}
            </div>
            <div className="info-value-line">
              {loginMember?.memAddr?.split("^^^")[1]}
            </div>
          </span>
        </div>
      </div>
    </div>
  );
}

export default MyInfo;
