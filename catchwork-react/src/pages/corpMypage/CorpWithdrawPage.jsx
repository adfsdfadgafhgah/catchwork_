import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../components/myPage/CorpSideBar";
import InfiniteScroll from "react-infinite-scroll-component";
import "./CorpWithdrawPage.css";
import CorpSideBar from "../../components/myPage/CorpSideBar";

const CorpWithdrawPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("회원 탈퇴");

  // 약관 데이터 (무한 스크롤용 더미 데이터)
  const [terms, setTerms] = useState([
    { id: 1, text: "본 약관은 '레모나 커뮤니티(이하 '사이트')" },
    { id: 2, text: "의 회원 탈퇴 절차 및 그에 따른 권리와 의무를 규정합니다." },
    { id: 3, text: "① 회원은 [마이페이지] > [회원 탈퇴] 메뉴를 통해 탈퇴를 신청할 수 있습니다." },
    { id: 4, text: "② 탈퇴 시 계정 정보는 즉시 삭제되며, 복구는 불가능합니다." },
    { id: 5, text: "③ 관련 법령에 따라 보존 의무가 있는 정보는 일정 기간 보관됩니다." },
    { id: 6, text: "④ 탈퇴 후 게시물 및 댓글은 삭제되지 않으며, 식별 정보가 익명 처리됩니다." },
    { id: 7, text: "⑤ 거래 또는 활동 내역이 완료되지 않은 경우 탈퇴가 제한될 수 있습니다." },
    { id: 8, text: "⑥ 게시글 및 댓글 관련 신고 또는 분쟁이 진행 중일 경우 탈퇴가 제한됩니다." },
    { id: 9, text: "⑦ 탈퇴 후 로그인, 게시글 수정/삭제, 서비스 이용이 불가능합니다." },
    { id: 10, text: "⑧ 탈퇴 시 포인트, 쿠폰, 혜택은 소멸되며 환급되지 않습니다." },
    { id: 11, text: "본 약관은 '레모나 커뮤니티(이하 '사이트')" },
    { id: 12, text: "의 회원 탈퇴 절차 및 그에 따른 권리와 의무를 규정합니다." },
    { id: 13, text: "① 회원은 [마이페이지] > [회원 탈퇴] 메뉴를 통해 탈퇴를 신청할 수 있습니다." },
    { id: 14, text: "② 탈퇴 시 계정 정보는 즉시 삭제되며, 복구는 불가능합니다." },
    { id: 15, text: "③ 관련 법령에 따라 보존 의무가 있는 정보는 일정 기간 보관됩니다." },
    { id: 16, text: "④ 탈퇴 후 게시물 및 댓글은 삭제되지 않으며, 식별 정보가 익명 처리됩니다." },
    { id: 17, text: "⑤ 거래 또는 활동 내역이 완료되지 않은 경우 탈퇴가 제한될 수 있습니다." },
    { id: 18, text: "⑥ 게시글 및 댓글 관련 신고 또는 분쟁이 진행 중일 경우 탈퇴가 제한됩니다." },
    { id: 19, text: "⑦ 탈퇴 후 로그인, 게시글 수정/삭제, 서비스 이용이 불가능합니다." },
    { id: 20, text: "⑧ 탈퇴 시 포인트, 쿠폰, 혜택은 소멸되며 환급되지 않습니다." },
    { id: 21, text: "본 약관은 '레모나 커뮤니티(이하 '사이트')" },
    { id: 22, text: "의 회원 탈퇴 절차 및 그에 따른 권리와 의무를 규정합니다." },
    { id: 23, text: "① 회원은 [마이페이지] > [회원 탈퇴] 메뉴를 통해 탈퇴를 신청할 수 있습니다." },
    { id: 24, text: "② 탈퇴 시 계정 정보는 즉시 삭제되며, 복구는 불가능합니다." },
    { id: 25, text: "③ 관련 법령에 따라 보존 의무가 있는 정보는 일정 기간 보관됩니다." },
    { id: 26, text: "④ 탈퇴 후 게시물 및 댓글은 삭제되지 않으며, 식별 정보가 익명 처리됩니다." },
    { id: 27, text: "⑤ 거래 또는 활동 내역이 완료되지 않은 경우 탈퇴가 제한될 수 있습니다." },
    { id: 28, text: "⑥ 게시글 및 댓글 관련 신고 또는 분쟁이 진행 중일 경우 탈퇴가 제한됩니다." },
    { id: 29, text: "⑦ 탈퇴 후 로그인, 게시글 수정/삭제, 서비스 이용이 불가능합니다." },
    { id: 30, text: "⑧ 탈퇴 시 포인트, 쿠폰, 혜택은 소멸되며 환급되지 않습니다." },
  ]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agree) {
      setError("탈퇴 약관에 동의해 주세요.");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    console.log("계정 탈퇴 요청:", { password });
    setError("");
    alert("계정이 성공적으로 탈퇴되었습니다.");
    navigate("/login");
  };

  const fetchMoreData = () => {
    if (terms.length >= 30) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      setTerms(terms.concat([
        { id: terms.length + 1, text: `추가 약관 내용 ${terms.length + 1}` },
        { id: terms.length + 2, text: `추가 약관 내용 ${terms.length + 2}` },
      ]));
      setCurrentPage(currentPage + 1);
    }, 500);
  };

  return (
    <div className="corp-page-container">
      <CorpSideBar />
      <div className="corp-edit-content">
        <div className="form-container">
          <h2 className="page-title">기업 회원 탈퇴</h2>
          <p className="content-warning">
            계정을 탈퇴하면 모든 데이터가 삭제되며 복구할 수 없습니다. 신중히 결정해 주세요.
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
                <p key={item.id} className="terms-text">{item.text}</p>
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
              <label htmlFor="agree">위 약관에 동의합니다.</label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="memberPw" className="form-label">
              비밀번호
            </label>
            <input
              type="password"
              id="memberPw"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
              className="form-input"
              required
            />
            <input
              type="password"
              id="confirmPw"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 확인"
              className="form-input"
              required
              />
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button
            type="submit"
            onClick={handleSubmit}
            className="submit-btn"
            disabled={!agree || !password || !confirmPassword || password !== confirmPassword}
          >
            탈퇴하기
          </button>
        </div>
      </div>
  );
};

export default CorpWithdrawPage;