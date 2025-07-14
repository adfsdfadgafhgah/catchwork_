import React from "react";
import { useSearchParams } from "react-router-dom";
import "./FindPage.css";

const FindPwPage = () => {
  const [params] = useSearchParams();
  const isCorp = params.get("type") === "corporate";

  return (
    <div className="find-container">
      <h2>{isCorp ? "기업 회원 비밀번호 찾기" : "개인 회원 비밀번호 찾기"}</h2>

      <form className="find-form">
        <label>
          아이디
          <input type="text" placeholder="아이디를 입력해주세요" />
        </label>
        {isCorp && (
          <label>
            사업자등록번호
            <input type="text" placeholder="사업자등록번호를 입력해주세요" />
          </label>
        )}
        <label>
          이름
          <input type="text" placeholder="이름을 입력해주세요" />
        </label>
        <label>
          이메일
          <input type="email" placeholder="이메일을 입력해주세요" />
          <button type="button">인증번호 발송</button>
        </label>
        <label>
          인증번호
          <input type="text" placeholder="인증번호를 입력해주세요" />
          <button type="button">인증번호 확인</button>
        </label>
        <button type="submit" className="submit-button">
          비밀번호 찾기
        </button>
      </form>
    </div>
  );
};

export default FindPwPage;
