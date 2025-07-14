import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { axiosApi } from "../../api/axiosAPI";
import "./FindPage.css";

const FindIdPage = () => {
  const [params] = useSearchParams();
  const isCorp = params.get("type") === "corporate";
  const [corpRegNo, setCorpRegNo] = useState("");
  const [memName, setMemName] = useState("");
  const [memTel, setMemTel] = useState("");
  const [memEmail, setMemEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = new FormData();
    requestData.append("memName", memName);
    requestData.append("memTel", memTel);
    requestData.append("memEmail", memEmail);

    if (isCorp) {
      requestData.append("corpRegNo", corpRegNo);
    }

    const resp = await axiosApi.post("/member/findId", requestData);

    if (resp.status === 200) {
      alert("아이디 찾기 완료");
    } else {
      alert("아이디 찾기 실패");
    }
  };

  return (
    <div className="find-container">
      <h2>{isCorp ? "기업 회원 아이디 찾기" : "개인 회원 아이디 찾기"}</h2>

      <form className="find-form" onSubmit={handleSubmit}>
        {isCorp && (
          <label>
            사업자등록번호
            <input
              type="text"
              placeholder="사업자등록번호를 입력해주세요"
              onChange={(e) => setCorpRegNo(e.target.value)}
            />
          </label>
        )}
        <label>
          이름
          <input
            type="text"
            placeholder="이름을 입력해주세요"
            onChange={(e) => setMemName(e.target.value)}
          />
        </label>
        <label>
          전화번호
          <input
            type="tel"
            placeholder="전화번호를 입력해주세요"
            onChange={(e) => setMemTel(e.target.value)}
          />
          <button type="button">인증번호 발송</button>
        </label>
        <label>
          인증번호
          <input
            type="text"
            placeholder="인증번호를 입력해주세요"
            onChange={(e) => setMemEmail(e.target.value)}
          />
          <button type="button">인증번호 확인</button>
        </label>
        <button type="submit" className="submit-button">
          아이디 찾기
        </button>
      </form>
    </div>
  );
};

export default FindIdPage;
