import React, { useState } from "react";
import axios from "axios";
import { getRoleFromToken } from "../../api/jwtDecode";

const AuthTest = () => {
  const [result, setResult] = useState("");
  const token = localStorage.getItem("accessToken");
  const userRole = token ? getRoleFromToken(token) : null;
  const baseURL = "http://localhost:8080";

  const signup = async () => {
    try {
      const res = await axios.post(`${baseURL}/signup`, {
        memId: "HuhJaeHo",
        memPw: "HuhJaeHo1234",
        memName: "허호재재",
      });
      setResult("회원가입 성공: " + JSON.stringify(res.data));
    } catch (err) {
      setResult("회원가입 실패: " + err.response?.data || err.message);
    }
  };

  const signin = async () => {
    try {
      const res = await axios.post(`${baseURL}/signin`, {
        memId: "",
        memPw: "HuhJaeHo1234",
      });

      // 토큰 추출 (헤더에서)
      const token = res.headers.authorization?.split(" ")[1];
      if (token) {
        localStorage.setItem("accessToken", token);
        setResult("로그인 성공, 토큰 저장됨");
      } else {
        setResult("로그인 성공, 하지만 토큰 없음");
      }
    } catch (err) {
      setResult("로그인 실패: " + err.response?.data || err.message);
    }
  };

  const callProtected = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(`${baseURL}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResult("보호 자원 접근 성공: " + res.data);
    } catch (err) {
      setResult("보호 자원 접근 실패: " + err.response?.data || err.message);
    }
  };

  return (
    <div>
      <h2>회원가입/로그인 테스트</h2>
      <button onClick={signup}>회원가입</button>
      <button onClick={signin}>로그인</button>
      <button onClick={callProtected}>메인 요청</button>
      <pre>{result}</pre>
    </div>
  );
};

export default AuthTest;
