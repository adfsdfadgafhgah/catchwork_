import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WithdrawPage.css";

const WithdrawPage = () => {
  const navigate = useNavigate();
  const [agree, setAgree] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isDisabled = !agree || !password;

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
    setError("");
    alert("계정이 성공적으로 탈퇴되었습니다.");
    navigate("/login");
  };

  const terms = [
    {
      title: "제1조 (목적)",
      content: [
        "본 약관은 CatchWork(이하 “회사”)가 제공하는 웹사이트 서비스에서 일반회원(취업준비생 등, 이하 “회원”)이 자발적으로 회원 탈퇴를 신청하는 경우, 그 절차와 결과에 대한 사항을 규정합니다.",
      ],
    },
    {
      title: "제2조 (회원 탈퇴 신청)",
      content: [
        "1. 회원은 마이페이지 또는 설정 페이지를 통해 언제든지 자발적으로 탈퇴를 신청할 수 있습니다.",
        "2. 탈퇴 신청 시, 본 약관에 명시된 탈퇴 처리 조건에 동의해야 합니다.",
        "3. 탈퇴는 신청 즉시 처리되며, 복구가 불가능합니다.",
      ],
    },
    {
      title: "제3조 (회원 탈퇴 시 처리되는 정보)",
      content: [
        "1. 회원 탈퇴 시, 아래의 개인정보는 지체 없이 파기됩니다.",
        "- 이름",
        "- 닉네임",
        "- 생년월일",
        "- 전화번호",
        "- 이메일",
        "- 프로필 사진",
        "",
        "2. 아래의 정보는 관련 법령에 따라 일정 기간 보관 후 파기됩니다.",
        "- 서비스 이용 기록 (로그 기록, 접속기록 등)",
        "- 결제 및 거래 관련 정보 (전자상거래법 등 관련 법률에 따라 최소 보관 기간 준수)",
        "",
        "3. 아래의 콘텐츠는 탈퇴 후에도 사이트 내에 남을 수 있습니다.",
        "- 작성한 게시글 및 댓글 (단, 작성자명은 비식별화 처리)",
        "- 제출한 이력서 또는 지원 이력(기업에 이미 전달된 경우 회수 불가)",
        "- 문의 내역, 신고 내역",
      ],
    },
    {
      title: "제4조 (주의 사항)",
      content: [
        "1. 탈퇴 시, 회원이 보유한 이력서, 작성한 게시물, 북마크한 공고 등은 모두 삭제되며 복구되지 않습니다.",
        "2. 탈퇴 이후에는 기존 계정으로 로그인할 수 없으며, 동일한 이메일로 재가입은 가능하나 기존 정보는 복원되지 않습니다.",
        "3. 탈퇴 전 제출된 이력서는 이미 기업에 전달된 경우 회수되지 않으며, 해당 기업의 개인정보 처리 방침에 따릅니다.",
      ],
    },
    {
      title: "제5조 (탈퇴 후 처리)",
      content: [
        "1. 회원 탈퇴가 완료되면 회사는 관련 법령 및 개인정보 처리방침에 따라 회원 정보를 파기하거나 분리 보관합니다.",
        "2. 탈퇴 후에도 법률상 필요하거나 정당한 이유가 있는 경우, 관련 기록은 일정 기간 보존될 수 있습니다.",
      ],
    },
    {
      title: "제6조 (기타)",
      content: [
        "1. 본 약관에 명시되지 않은 사항은 CatchWork의 [이용약관] 및 [개인정보처리방침]을 따릅니다.",
        "2. 본 약관은 회사의 정책에 따라 사전 고지 후 변경될 수 있습니다.",
      ],
    },
    {
      title: "📌 문의",
      content: [
        "회원 탈퇴 또는 개인정보 관련 문의는 [고객센터] 또는 이메일 (help@catchwork.co.kr) 로 연락해 주세요.",
      ],
    },
  ];

  return (
    <div className="withdraw-container">
      <div className="withdraw-content">
        <div className="form-container">
          <p className="content-warning">
            계정을 탈퇴하면 모든 데이터가 삭제되며 복구할 수 없습니다. 신중히
            결정해 주세요.
          </p>
          <div className="withdraw-terms-box">
            {terms.map((item) => (
              <div key={item.id} className="terms-text">
                <p>{item.title}</p>
                <p>{item.content}</p>
              </div>
            ))}
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
          </div>

          {error && <p className="error-message">{error}</p>}

          <button
            type="submit"
            onClick={handleSubmit}
            className="submit-btn"
            disabled={isDisabled}
          >
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;
