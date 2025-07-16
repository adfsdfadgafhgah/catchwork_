import { useState } from "react";

const AdminAuthPage = () => {
  const [adminID, setAdminID] = useState("");
  const [adminPW, setAdminPW] = useState("");

  const handleAdminAuth = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="authPage">
      <form onSubmit={handleAdminAuth}>
        <input
          type="text"
          placeholder="input Id"
          value={adminID}
          onChange={(e) => setAdminID(e.target.value)}
        ></input>
        <input
          type="password"
          placeholder="input Id"
          value={adminPW}
          onChange={(e) => setAdminPW(e.target.value)}
        ></input>
        <button type="submit">Authentication</button>
      </form>
    </div>
  );
};

export default AdminAuthPage;
