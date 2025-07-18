import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "./CorpWithdrawPage.module.css";
import { axiosApi } from "../../api/axiosAPI";
import { useAuthStore } from "../../stores/authStore";

const CorpWithdrawPage = () => {
  const navigate = useNavigate();
  // loginMember는 현재 사용되지 않으므로, 필요하지 않다면 제거할 수 있습니다.
  const { loginMember } = useOutletContext(); 
  const [agree, setAgree] = useState(false);
  const [password, setPassword] = useState("");
  const [isRead, setIsRead] = useState(false);
  const { signOut } = useAuthStore();

  // 커스텀 모달 상태 관리
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null); // 확인 모달에서 '확인' 클릭 시 실행할 함수

  // '탈퇴하기' 버튼 활성화 여부
  const isDisabled = !agree || !password;

  // 커스텀 확인 모달 열기 함수
  const openConfirmModal = (message, action) => {
    setAlertMessage(message);
    setConfirmAction(() => action); // 실행할 함수를 저장
    setShowConfirmModal(true);
  };

  // 커스텀 알림 모달 열기 함수
  const openAlertModal = (message) => {
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  // 모든 모달 닫기 함수
  const closeModal = () => {
    setShowConfirmModal(false);
    setShowAlertModal(false);
    setAlertMessage("");
    setConfirmAction(null);
  };

  // 실제 회원 탈퇴 처리 로직
  const executeWithdraw = async () => {
    try {
      // 1. 비밀번호 확인 요청 (POST /corp/verifyPassword)
      const verifyResp = await axiosApi.post("/corp/verifyPassword", {
        memPw: password,
      });

      // 비밀번호가 일치하는 경우
      if (verifyResp.status === 200 && verifyResp.data === true) {
        // 2. 회원 탈퇴 요청 (DELETE /corp/withdraw)
        // DELETE 요청은 일반적으로 본문(body)을 포함하지 않습니다.
        // 회원 정보는 @AuthenticationPrincipal을 통해 백엔드에서 가져옵니다.
        const withdrawResp = await axiosApi.delete("/corp/withdraw");

        if (withdrawResp.status === 200) {
          openAlertModal("회원 탈퇴가 완료되었습니다.");
          signOut(); // 로그아웃 처리
          navigate("/"); // 메인 페이지로 이동
        } else {
          openAlertModal("탈퇴 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
      } else {
        // 비밀번호 불일치
        openAlertModal("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      // 에러 처리
      if (error.response) {
        if (error.response.status === 401) {
          openAlertModal("비밀번호가 일치하지 않습니다."); // 백엔드에서 401 Unauthorized 반환 시
        } else {
          openAlertModal(`오류가 발생했습니다: ${error.response.status} - ${error.response.data || error.response.statusText}`);
        }
      } else {
        openAlertModal("네트워크 오류가 발생했습니다.");
      }
    } finally {
      closeModal(); // 작업 완료 후 모달 닫기
    }
  };

  // '탈퇴하기' 버튼 클릭 시 호출되는 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    // 탈퇴 확인 모달을 띄우고, '확인' 시 executeWithdraw 실행
    openConfirmModal(
      "정말 탈퇴하시겠습니까? \n탈퇴 후 데이터에 대한 손실을 책임지지 않습니다.",
      executeWithdraw
    );
  };

  // 약관 스크롤 시 '다 읽음' 상태 업데이트
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    // 스크롤이 거의 끝에 도달했을 때 isRead를 true로 설정
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      setIsRead(true);
    }
  };

  // 약관 내용 (이전과 동일)
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
        "- (이름, 닉네임, 생년월일, 전화번호 , 이메일, 프로필 사진)",
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
      title: "문의",
      content: [
        "회원 탈퇴 또는 개인정보 관련 문의는 [고객센터] 또는 이메일 (help@catchwork.co.kr) 로 연락해 주세요.",
      ],
    },
  ];

  return (
    <div className={styles.withdrawContainer}>
      <div className={styles.withdrawContent}>
        <div className={styles.formContainer}>
          <p className={styles.contentWarning}>
            계정을 탈퇴하면 모든 데이터가 삭제되며 복구할 수 없습니다. 신중히 결정해 주세요.
          </p>
          <div className={styles.withdrawTermsBox} onScroll={handleScroll}>
            {terms.map((item, index) => (
              <div key={index} className={styles.termsText}>
                <p>{item.title}</p>
                {item.content.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            ))}
          </div>

          <div className={styles.formGroup}>
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                disabled={!isRead}
              />
              <label htmlFor="agree">위 약관에 동의합니다.</label>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="memberPw" className={styles.formLabel}>
              비밀번호
            </label>
            <input
              type="password"
              id="memberPw"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
              className={styles.formInput}
              required
            />
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className={styles.submitBtn}
            disabled={isDisabled}
          >
            탈퇴하기
          </button>
        </div>
      </div>

      {/* 커스텀 확인 모달 */}
      {showConfirmModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <p>{alertMessage}</p>
            <div className={styles.modalActions}>
              <button onClick={() => { confirmAction(); closeModal(); }} className={styles.modalButton}>확인</button>
              <button onClick={closeModal} className={styles.modalButton}>취소</button>
            </div>
          </div>
        </div>
      )}

      {/* 커스텀 알림 모달 */}
      {showAlertModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <p>{alertMessage}</p>
            <div className={styles.modalActions}>
              <button onClick={closeModal} className={styles.modalButton}>확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorpWithdrawPage;
