function MyInfo() {
  // 사용자 정보 (예시 데이터)
  const userInfo = {
    id: "hbr0901",
    email: "heowing94@gmail.com",
    phone: "010-8983-5149",
    name: "허배령",
    nickname: "으후루꾸꾸루후으으후",
    birth: "1994.09.01",
    gender: "남",
    address: "경기도 의정부시 용현로 143",
  };

  return (
    <div className="main-content">
      <div className="content-container">
        <div className="profile-section">
          <div className="profile-img">
            <i className="fas fa-user"></i>
          </div>

          <div className="profile-info">
            <h1>{userInfo.nickname}</h1>
          </div>
        </div>

        <div className="info-card">
          <div className="info-content">
            <span className="info-label">아이디</span>
            <span className="info-value font-medium">{userInfo.id}</span>
          </div>

          <div className="info-content">
            <span className="info-label">이메일</span>
            <span className="info-value">{userInfo.email}</span>
          </div>

          <div className="info-content">
            <span className="info-label">전화번호</span>
            <span className="info-value">{userInfo.phone}</span>
          </div>

          <div className="info-content">
            <span className="info-label">이름</span>
            <span className="info-value font-medium">{userInfo.name}</span>
          </div>

          <div className="info-content">
            <span className="info-label">생년월일</span>
            <span className="info-value">{userInfo.birth}</span>
          </div>

          <div className="info-content">
            <span className="info-label">성별</span>
            <span className="info-value">{userInfo.gender}</span>
          </div>

          <div className="info-content">
            <span className="info-label">주소</span>
            <span className="info-value">{userInfo.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyInfo;
