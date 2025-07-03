import { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useNavigate } from "react-router-dom";

import "./MembershipPage.css";
import { axiosApi } from "../../api/axiosAPI";
import MembershipList from "../../components/myPage/MembershipList";
import useLoginMember from "../../stores/loginMember";
import PaymentModal from "../../components/myPage/PaymentModal";
import usePaymentModal from "./../../hooks/paymentModal";
import useMembershipList from "../../stores/membershipStore";

// 환경변수에서 clientKey 가져오기
const clientKey = import.meta.env.VITE_CLIENT_KEY;

function MembershipPage() {
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null); // TossPayments 인스턴스
  const { loginMember, setLoginMember } = useLoginMember(); // 로그인 유저 정보
  const { membershipList, getMembershipList } = useMembershipList(); // 멤버십 리스트
  const [subscription, setSubscription] = useState(); // 구독 정보
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  // 구독 정보 fetch
  const getSubscription = async (memNo) => {
    try {
      const resp = await axiosApi.post("/membership/getSubscription", {
        memNo,
      });
      if (resp.status === 200) setSubscription(resp.data);
    } catch (error) {
      console.error(error);
    }
  };

  // 모든 정보 fetch
  const fetchAll = async () => {
    setIsLoading(true);
    await setLoginMember();
    await getMembershipList();
    setIsLoading(false);
  };

  // 최초 마운트 시 정보 fetch
  useEffect(() => {
    fetchAll();
  }, []);

  // loginMember가 바뀌면 구독 정보 갱신
  useEffect(() => {
    if (loginMember.memNo && !isLoading) getSubscription(loginMember.memNo);
  }, [loginMember.memNo, isLoading]);

  // TossPayments 위젯 초기화
  useEffect(() => {
    async function fetchPayment() {
      if (!loginMember.memNo) return;
      try {
        const tossPayments = await loadTossPayments(clientKey);
        const paymentInstance = tossPayments.payment({
          customerKey: loginMember.memNo,
        });
        setPayment(paymentInstance);
      } catch (error) {
        console.error("Error loading Toss Payments:", error);
      }
    }
    fetchPayment();
  }, [clientKey, loginMember.memNo]);

  // 모달 관련 로직
  const {
    modalState, // 모달 상태
    openModal, // 모달 열기
    closeModal, // 모달 닫기
    handleModalConfirm, // 모달 확인 버튼 클릭 시 처리
    balance, // 환불 금액
    targetPrice, // 결제 금액
  } = usePaymentModal(
    loginMember, // 로그인 유저 정보
    setLoginMember, // 로그인 유저 정보 갱신
    membershipList, // 멤버십 리스트 정보
    getMembershipList, // 멤버십 리스트 갱신
    getSubscription // 구독 정보 갱신
  );

  // 빌링키 발급 요청
  async function requestBillingAuth(productId) {
    await payment.requestBillingAuth({
      method: "CARD",
      successUrl: `${window.location.origin}/mypage/payment/billing?productId=${productId}`,
      failUrl: `${window.location.origin}/mypage/payment/fail`,
      customerEmail: loginMember.memEmail,
      customerName: loginMember.memName,
    });
  }

  // 결제 처리 핸들러
  async function handleCheckout(memGrade) {
    if (!loginMember || !subscription) return;
    try {
      // 로그인 유저의 유효한 빌링키 조회
      const response = await axiosApi.post("/tosspayment/getBillingKey", {
        memNo: loginMember.memNo,
      });
      if (response.status === 200) {
        // 유효한 빌링키가 없으면, 빌링키 발급
        if (!response.data) {
          requestBillingAuth(memGrade);
        } else {
          // 현재 등급
          const current = loginMember.memGrade;
          // 변경 대상 등급
          const target = memGrade;
          // 현재 무료 → 결제
          if (current === 0) {
            navigate(`/mypage/payment/checkout?productId=${target}`);
          }
          // 업그레이드
          else if (current === 1 && target === 2) {
            openModal("upgrade", target);
          }
          // 다운그레이드
          else if (current === 2 && target === 1) {
            openModal("downgrade", target);
          }
          // 복구하기 (예: 해지된 상태에서 다시 동일 등급 or 낮은 등급 선택 시)
          else if (
            subscription.subStatus === 1 &&
            target === current &&
            subscription.memGrade !== current
          ) {
            openModal("restore");
          }
          // 해지 후, 다른 등급 결제
          else if (subscription.memGrade === 0 && target !== current) {
            // 로직 구현 필요
          }
        }
      }
    } catch (error) {
      console.error("결제 처리 중 오류:", error);
      alert("결제를 진행할 수 없습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  if (isLoading || !loginMember || !subscription || !membershipList) {
    // 로딩 중이거나 필수 정보가 없으면 렌더링 하지 않음
    return null;
  }

  return (
    <div className="membership-container">
      {loginMember.memGrade !== 0 && (
        <p>
          {membershipList[loginMember.memGrade].memGradeName} 플랜 결제 중.{" "}
          {`${subscription.subEndAt.substring(
            5,
            7
          )}월 ${subscription.subEndAt.substring(8, 10)}일`}
          까지 사용 가능
        </p>
      )}
      <div className="membership-list">
        <MembershipList
          membershipList={membershipList}
          subscription={subscription}
          loginMember={loginMember}
          handleCheckout={handleCheckout}
        />
        <PaymentModal
          isOpen={modalState.isOpen}
          type={modalState.type}
          loading={modalState.loading}
          onClose={closeModal}
          onConfirm={handleModalConfirm}
          balance={balance}
          targetPrice={targetPrice}
        />
      </div>

      {subscription.memGrade !== 0 && (
        <button onClick={() => openModal("cancel")}>해지하기</button>
      )}
    </div>
  );
}

export default MembershipPage;
