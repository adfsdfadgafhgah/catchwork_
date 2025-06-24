import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./SignUpPage.css";

const SignUpPage = () => {
  const [searchParams] = useSearchParams();
  const initialType =
    searchParams.get("type") === "corporate" ? "corporate" : "personal";
  const [userType] = useState(initialType); // 이후 변경 불가

  return (
    <div className="signup-container">
      <h2>
        {userType === "personal" ? "개인 회원 회원가입" : "기업 회원 회원가입"}
      </h2>

      <form className="signup-form">
        {/* 공통 필드 */}
        <label>
          아이디
          <input type="text" placeholder="아이디를 입력해주세요" />
          <button type="button">중복 확인</button>
        </label>
        <label>
          비밀번호
          <input type="password" placeholder="비밀번호를 입력해주세요" />
        </label>
        <label>
          비밀번호 확인
          <input type="password" />
        </label>

        {/* 나는 개인이오 */}
        {userType === "personal" && (
          <>
            <label>
              이메일
              <input type="email" placeholder="이메일을 입력해주세요" />
            </label>
            <label>
              전화번호
              <input type="tel" placeholder="전화번호를 입력해주세요" />
              <button type="button">인증번호 발송</button>
            </label>
            <label>
              인증번호
              <input type="text" placeholder="인증번호를 입력해주세요" />
              <button type="button">인증번호 확인</button>
            </label>
            <label>
              이름
              <input type="text" placeholder="이름을 입력해주세요" />
            </label>
            <label>
              닉네임
              <input type="text" placeholder="닉네임을 입력해주세요" />
              <button type="button">중복 확인</button>
            </label>
            <label>
              생년월일
              <input type="date" />
            </label>
            <div className="gender-group">
              <span>성별</span>
              <label>
                <input type="radio" name="gender" /> 남
              </label>
              <label>
                <input type="radio" name="gender" /> 여
              </label>
            </div>
          </>
        )}

        {/* 나는 기업이오 */}
        {userType === "corporate" && (
          <>
            <label>
              회사명
              <input type="text" placeholder="회사명을 입력해주세요" />
            </label>
            <label>
              사업자등록번호
              <input type="text" placeholder="사업자등록번호를 입력해주세요" />
              <button type="button">중복 확인</button>
            </label>
            <label>
              대표자명
              <input type="text" placeholder="대표자명을 입력해주세요" />
            </label>
          </>
        )}

        {/* 공통 주소 */}
        <label>
          주소
          <input type="text" placeholder="기본주소 입력해주세요" />
          <button type="button">주소 찾기</button>
        </label>
        <input type="text" placeholder="상세주소" />

        <button type="submit" className="submit-button">
          회원 가입
        </button>
      </form>
    </div>
  );
};

export default SignUpPage;
