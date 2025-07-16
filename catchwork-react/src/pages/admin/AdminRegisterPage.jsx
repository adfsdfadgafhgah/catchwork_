import { useState } from "react";
import "./AdminAuthPage.css";
import { Link, useNavigate } from "react-router-dom";
import useConfirmEmail from "../../hooks/useConfirmEmail";

const waveSpans = (text) =>
  text.split("").map((char, idx) => (
    <span key={idx} style={{ transitionDelay: `${idx * 50}ms` }}>
      {char}
    </span>
  ));

const AdminRegisterPage = () => {
  const [adminNick, setAdminNick] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminTel, setAdminTel] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [authKey, setAuthKey] = useState("");
  const [isIssued, setIsIssued] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const { sendEmail, checkAuthKey, startTimer, stopTimer, timeLeft } =
    useConfirmEmail();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // 이메일 인증번호 발송
  const handleSendEmail = async () => {
    if (!adminEmail || adminEmail.includes("@") === false) {
      alert("이메일을 입력해주세요");
      return;
    }
    setIsClicked(true);
    const isSent = await sendEmail(adminEmail);
    if (isSent) {
      startTimer();
      setIsIssued(true);
    }
  };

  // 이메일 인증번호 확인
  const handleCheckAuthKey = async () => {
    const isValid = await checkAuthKey(adminEmail, authKey);
    if (isValid) {
      stopTimer();
      setIsVerified(true);
      setSuccessMsg("인증되었습니다");
      setErrorMsg("");
    } else {
      stopTimer();
      setErrorMsg("인증번호가 올바르지 않습니다");
      setIsVerified(false);
      setSuccessMsg("");
      setTimeout(() => {
        setErrorMsg("");
        startTimer();
      }, 3000);
    }
  };

  // 타이머 포맷
  const timeFormat = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleAdminAuth = async (e) => {
    e.preventDefault();
    // 이메일 인증 성공 여부 체크
    if (!isVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }
    // 회원가입 처리
    try {
      const { axiosApi } = await import("../../api/axiosAPI");
      const response = await axiosApi.post("/admin/register", {
        adminId: adminEmail,
        adminNickname: adminNick,
        adminName: adminName,
        adminTel: adminTel,
        adminEmail: adminEmail,
      });
      // 이미 존재하는 이메일 처리
      if (response.data === null) {
        alert("이미 존재하는 이메일입니다.");
        return;
      }
      console.log(response);
      if (response.status === 200 && response.data) {
        setModalInfo({
          id: response.data.id,
          password: response.data.password,
        });
        setModalOpen(true);
      } else {
        alert(response.data.error || "회원가입 실패");
      }
    } catch (err) {
      alert(err.response?.data?.error || "서버 연결 실패");
    }
  };
  return (
    <div className="authPage">
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>회원가입 완료</h2>
            <p>
              <b>임시 아이디:</b> {modalInfo.id}
              <br />
              <b>임시 비밀번호:</b> {modalInfo.password}
            </p>
            <button
              onClick={() => {
                setModalOpen(false);
                navigate("/admin-auth");
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
      <div className="container">
        <form onSubmit={handleAdminAuth}>
          <div className="form-control">
            <input
              type="text"
              required
              value={adminNick}
              onChange={(e) => setAdminNick(e.target.value)}
            />
            <label>{waveSpans("Input NickName")}</label>
          </div>
          <div className="form-control">
            <input
              type="text"
              required
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
            />
            <label>{waveSpans("Input Name")}</label>
          </div>
          <div className="form-control">
            <input
              type="text"
              required
              value={adminTel}
              onChange={(e) => setAdminTel(e.target.value)}
            />
            <label>{waveSpans("Input Tel")}</label>
          </div>
          <div className="form-control">
            <input
              type="text"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              disabled={isVerified}
            />
            <label>{waveSpans("Input Email")}</label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
                paddingLeft: "10px",
              }}
            >
              {isIssued ? (
                <small style={{ color: "#aaa" }}>
                  이메일이 발송되었습니다.
                </small>
              ) : isClicked ? (
                <small style={{ color: "#aaa" }}>이메일 발송 중입니다.</small>
              ) : (
                <small style={{ color: "#aaa" }}>이메일을 입력해주세요</small>
              )}
              <button
                type="button"
                className="btn"
                onClick={handleSendEmail}
                disabled={isVerified}
                style={{ marginLeft: "8px" }}
              >
                인증번호 발송
              </button>
            </div>
          </div>
          {/* 인증번호 입력 및 확인 */}
          <div className="form-control">
            <input
              type="text"
              required
              value={authKey}
              onChange={(e) => setAuthKey(e.target.value)}
              className={isVerified ? "success" : errorMsg ? "error" : ""}
              disabled={isVerified}
            />
            <label>{waveSpans("Verification Code")}</label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
                paddingLeft: "10px",
              }}
            >
              {isVerified && successMsg ? (
                <small style={{ color: "green" }}>{successMsg}</small>
              ) : errorMsg ? (
                <small style={{ color: "red" }}>{errorMsg}</small>
              ) : timeLeft > 0 ? (
                <small style={{ color: "#333" }}>
                  남은 시간: {timeFormat()}초
                </small>
              ) : isIssued ? (
                <small style={{ color: "red" }}>인증번호 만료</small>
              ) : (
                <small style={{ color: "#aaa" }}>
                  인증번호 발송을 클릭해주세요
                </small>
              )}
              <button
                type="button"
                onClick={handleCheckAuthKey}
                className="btn"
                disabled={!isIssued || isVerified}
                style={{ marginRight: "8px" }}
              >
                인증번호 확인
              </button>
            </div>
          </div>
          <div
            style={{
              marginBottom: "20px",
              color: "#888",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            비밀번호는 가입 후 별도 안내됩니다.
          </div>
          <button className="send-btn" type="submit">
            Register
          </button>
          <div className="link-wrapper">
            <Link to="/admin-auth" className="link">
              Authentication
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegisterPage;
