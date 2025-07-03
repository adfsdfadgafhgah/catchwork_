import React, { useState } from "react";
import { axiosApi } from "../../api/axiosAPI";
import { useAuthStore } from "../../stores/authStore";

const AuthTest = () => {
  const [result, setResult] = useState("");
  const token = localStorage.getItem("accessToken");
  const setAuth = useAuthStore((state) => state.setAuth);
  const signOut = useAuthStore((state) => state.signOut);

  // memId, memTel, memEmail을 매 요청 시 달라짐짐
  const signup = async (memType) => {
    try {
      const randomNum = generateRandomNum();
      const id = "Test_" + randomNum;
      const pw = "Test";
      const nickname = generateRandomNickname();
      const tel = "010" + Math.floor(10000000 + Math.random() * 90000000);
      const email = `test${randomNum}@example.com`;

      const res = await axiosApi.post(`signup`, {
        memId: id,
        memPw: pw,
        memNickname: nickname,
        memName: "Test_" + randomNum,
        memTel: tel,
        memEmail: email,
        memBirthday: "1995-05-20",
        memGender: "M",
        memAddr: "서울특별시 강남구 테헤란로 123",
        memSmsFl: "Y",
        memType,
        memStatus: 0,
      });

      setResult(
        `회원가입 성공 (memType=${memType}): ` + JSON.stringify(res.data)
      );
      alert(
        `회원가입 성공!\n닉네임: ${nickname}\n아이디: ${id}\n비밀번호: ${pw}`
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.response?.data?.error || err.message;
      setResult("회원가입 실패: " + errorMessage);
    }
  };

  const signin = async () => {
    try {
      const res = await axiosApi.post(`/signin`, {
        memId: "Test_229",
        memPw: "Test",
      });

      const token = res.headers.authorization?.split(" ")[1];
      if (token) {
        localStorage.setItem("accessToken", token);
        const decoded = jwtDecode(token);
        setAuth(decoded.memType, decoded.role);
        setResult("로그인 성공, 토큰 저장됨");
      } else {
        setResult("로그인 성공, 하지만 토큰 없음");
      }
    } catch (err) {
      setResult("로그인 실패: " + err.response?.data || err.message);
    }
  };

  const corpSignin = async () => {
    try {
      const res = await axiosApi.post(`/signin`, {
        memId: "Test_146",
        memPw: "Test",
      });

      const token = res.headers.authorization?.split(" ")[1];
      if (token) {
        localStorage.setItem("accessToken", token);
        const decoded = jwtDecode(token);
        setAuth(decoded.memType, decoded.role);
        setResult("로그인 성공, 토큰 저장됨");
      } else {
        setResult("로그인 성공, 하지만 토큰 없음");
      }
    } catch (err) {
      setResult("로그인 실패: " + err.response?.data || err.message);
    }
  };
  const signout = async () => {
    try {
      await axiosApi.post("/signout");
      localStorage.removeItem("accessToken");
      signOut(); // 상태 초기화
      alert("로그아웃 되었습니다.");
      setResult("로그아웃 성공");
    } catch (err) {
      const message =
        err.response?.data?.message || err.response?.data?.error || err.message;
      setResult("로그아웃 실패: " + message);
    }
  };

  const checkToken = async () => {
    try {
      const res = await axiosApi.get("check-token", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
      });
      alert(res.data.message); // "유효함"
    } catch (err) {
      alert("유효하지 않음");
    }
  };

  return (
    <div>
      <h2>회원가입/로그인 테스트</h2>
      <button onClick={() => signup(0)}>개인 회원가입</button>
      <button onClick={() => signup(1)}>기업 회원가입</button>
      <br></br>
      <button onClick={signin}>개인 로그인</button>
      <button onClick={corpSignin}>기업 로그인</button>
      <br></br>
      <button onClick={signout}>로그아웃</button>
      <br></br>
      <button onClick={checkToken}>토큰 확인</button>
      <br></br>

      <pre>{result}</pre>
    </div>
  );
};

export default AuthTest;

// 난수 생성
const generateRandomNum = () => {
  const num = Math.floor(100 + Math.random() * 900); // 100~999
  return num;
};

// 닉네임 생성
const generateRandomNickname = () => {
  const adjectives = [
    "검은",
    "붉은",
    "엄청난",
    "숨겨진",
    "공포의",
    "금빛",
    "미친",
    "뛰어난",
    "근사한",
    "무서운",
  ];
  const nouns = [
    "바지",
    "수염",
    "거인",
    "요정",
    "드워프",
    "늑대",
    "곰",
    "셔츠",
    "인간",
    "기계",
  ];

  const tag = generateRandomNum();
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${adj}_${noun}_${tag}`;
};
