import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../../components/common/SectionHeader";
import InfiniteScroll from "react-infinite-scroll-component";
import "./WithdrawCompanyPage.css";

const WithdrawCompanyPage = () => {
  const navigate = useNavigate();
  const [agree, setAgree] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [terms, setTerms] = useState([
    {
      id: 1,
      text: "본 약관은 '기업 제휴 탈퇴' 절차 및 권리와 의무를 규정합니다.",
    },
    { id: 2, text: "① 탈퇴 시 계정 정보는 즉시 삭제되며 복구는 불가능합니다." },
    {
      id: 3,
      text: "② 관련 법령에 따라 보존 의무가 있는 정보는 일정 기간 보관됩니다.",
    },
    { id: 4, text: "③ 탈퇴 후 서비스 이용이 불가합니다." },
    { id: 5, text: "④ 탈퇴 시 포인트, 쿠폰, 혜택은 소멸됩니다." },
    {
      id: 6,
      text: "⑤ 거래 또는 활동 내역이 완료되지 않은 경우 탈퇴가 제한될 수 있습니다.",
    },
    {
      id: 7,
      text: "⑥ 게시글 및 댓글 관련 신고 또는 분쟁이 있을 경우 탈퇴가 제한됩니다.",
    },
    {
      id: 1,
      text: "본 약관은 '기업 제휴 탈퇴' 절차 및 권리와 의무를 규정합니다.",
    },
    { id: 2, text: "① 탈퇴 시 계정 정보는 즉시 삭제되며 복구는 불가능합니다." },
    {
      id: 3,
      text: "② 관련 법령에 따라 보존 의무가 있는 정보는 일정 기간 보관됩니다.",
    },
    { id: 4, text: "③ 탈퇴 후 서비스 이용이 불가합니다." },
    { id: 5, text: "④ 탈퇴 시 포인트, 쿠폰, 혜택은 소멸됩니다." },
    {
      id: 6,
      text: "⑤ 거래 또는 활동 내역이 완료되지 않은 경우 탈퇴가 제한될 수 있습니다.",
    },
    {
      id: 7,
      text: "⑥ 게시글 및 댓글 관련 신고 또는 분쟁이 있을 경우 탈퇴가 제한됩니다.",
    },
  ]);

  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!agree) {
      setError("약관에 동의해주세요.");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    alert("탈퇴가 완료되었습니다.");
    navigate("/"); // 탈퇴 후 홈으로 이동 (원하면 다른 페이지로)
  };

  const fetchMoreData = () => {
    if (terms.length >= 30) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      setTerms((prevTerms) =>
        prevTerms.concat([
          {
            id: prevTerms.length + 1,
            text: `추가 약관 내용 ${prevTerms.length + 1}`,
          },
          {
            id: prevTerms.length + 2,
            text: `추가 약관 내용 ${prevTerms.length + 2}`,
          },
        ])
      );
      setCurrentPage((prevPage) => prevPage + 1);
    }, 500);
  };

  return (
    <main className="container">
      <SectionHeader title="기업 제휴 탈퇴" />

      <div className="corp-edit-content">
        <div className="form-container">
          <p className="content-warning">
            기업 제휴 탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다. 신중히
            결정해 주세요.
          </p>

          <div className="terms-box">
            <InfiniteScroll
              dataLength={terms.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<h4>약관 로딩 중...</h4>}
              height={300}
              style={{ overflow: "auto" }}
            >
              {terms.map((item) => (
                <p key={item.id} className="terms-text">
                  {item.text}
                </p>
              ))}
            </InfiniteScroll>
          </div>

          <div className="form-group">
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <label htmlFor="agree">기업 제휴 탈퇴 약관에 동의합니다.</label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
              className="form-input"
            />

            <label className="form-label">비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 확인해주세요"
              className="form-input"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="button-box">
            <button
              type="submit"
              onClick={handleWithdraw}
              className="withdraw-btn"
              disabled={
                !agree ||
                !password ||
                !confirmPassword ||
                password !== confirmPassword
              }
            >
              탈퇴하기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WithdrawCompanyPage;
