import { useState } from "react";
import "./AdminAuthPage.css";
import { Link, useNavigate } from "react-router-dom";

const waveSpans = (text) =>
  text.split("").map((char, idx) => (
    <span key={idx} style={{ transitionDelay: `${idx * 50}ms` }}>
      {char}
    </span>
  ));

const AdminAuthPage = () => {
  const [adminID, setAdminID] = useState("");
  const [adminPW, setAdminPW] = useState("");
  const navigate = useNavigate();

  const handleAdminAuth = async (e) => {
    e.preventDefault();
    try {
      const { axiosApi } = await import("../../api/axiosAPI");
      const response = await axiosApi.post("/admin/auth", {
        adminId: adminID,
        adminPw: adminPW,
      });
      if (response.status === 200) {
        // 로그인 성공 시 관리자 메인으로 이동
        navigate("/admin");
      } else {
        alert(response.data.error || "로그인 실패");
      }
    } catch (err) {
      alert(err.response?.data?.error || "서버 연결 실패");
    }
  };

  return (
    <div className="authPage">
      <div className="admin-container">
        <form onSubmit={handleAdminAuth}>
          <div className="form-control">
            <input
              type="text"
              required
              value={adminID}
              onChange={(e) => setAdminID(e.target.value)}
            />
            <label>{waveSpans("Input ID")}</label>
          </div>
          <div className="form-control">
            <input
              type="password"
              required
              value={adminPW}
              onChange={(e) => setAdminPW(e.target.value)}
            />
            <label>{waveSpans("Input PW")}</label>
          </div>
          <button className="send-btn" type="submit">
            Authentication
          </button>
          <div className="link-wrapper">
            <Link to="/admin-register" className="link">
              register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAuthPage;
