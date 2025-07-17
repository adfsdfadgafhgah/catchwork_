import React from "react";
const PolicyPrivacy = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>1. 개인정보 수집 및 이용 현황</h2>
      <p>
        회사는 서비스 제공을 위한 최소한의 범위 내에서 정보주체의 동의 하에
        개인정보를 수집하며, 수집한 모든 개인정보는 고지한 목적 범위 내에서만
        사용됩니다.
      </p>
      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead style={{ background: "#f2f2f2" }}>
          <tr>
            <th>수집항목</th>
            <th>수집목적</th>
            <th>보유기간</th>
            <th>법적근거</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              (필수)
              <br />
              아이디, 비밀번호, 이름, 휴대폰번호, 생년월일, 이메일
            </td>
            <td>
              회원 가입 및 관리, 상품 구매 및 결제, 고객 문의 응대,
              <br />
              마케팅 및 이벤트 정보 제공, 사이트 이용 분석 및 서비스 연동
            </td>
            <td>회원탈퇴 시</td>
            <td>개인정보보호법 제15조 1항 제1호 (계약의 이행)</td>
          </tr>
          <tr>
            <td>
              (선택)
              <br /> 닉네임, 성별, 주소, 사진 등
            </td>
            <td>이벤트 참여, 추가 맞춤형 서비스 제공</td>
            <td>회원탈퇴 시</td>
            <td>정보주체 동의</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PolicyPrivacy;
