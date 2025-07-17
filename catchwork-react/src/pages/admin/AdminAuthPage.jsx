import { useState } from "react";
import "./AdminAuthPage.css";
import { Link } from "react-router-dom";

const waveSpans = (text) =>
  text.split("").map((char, idx) => (
    <span key={idx} style={{ transitionDelay: `${idx * 50}ms` }}>
      {char}
    </span>
  ));

const AdminAuthPage = () => {
  const [adminID, setAdminID] = useState("");
  const [adminPW, setAdminPW] = useState("");

  const handleAdminAuth = async (e) => {
    e.preventDefault();
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
