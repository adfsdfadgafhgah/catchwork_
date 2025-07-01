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
  // 토스 SDK 객체
  const [payment, setPayment] = useState(null);
  // 로그인 회원 정보
  const { loginMember, setLoginMember } = useLoginMember();
  const { membershipList, getMembershipList } = useMembershipList();
  // 모달 관련 로직
  const { modalState, openModal, closeModal, handleModalConfirm } =
    usePaymentModal(
      loginMember,
      setLoginMember,
      membershipList,
      getMembershipList
    );

  // 로그인 회원 정보 요청
  useEffect(() => {
    setLoginMember();
    getMembershipList();
  }, []);

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
    try {
      // 로그인 유저의 유효한 빌링키 조회
      const response = await axiosApi.post("/tosspayment/getBillingKey", {
        memNo: loginMember.memNo,
      });

      if (response.status === 200) {
        // 유효한 빌링키가 없으면, 빌링키 발급
        if (!response.data) {
          requestBillingAuth(memGrade);
        } else if (loginMember.memGrade == 0) {
          navigate(`/mypage/payment/checkout?productId=${memGrade}`);
        }
        // 업그레이드
        else if (loginMember.memGrade == 1 && memGrade == 2) {
          openModal("upgrade", memGrade);
        }
        // 다운그레이드
        else if (loginMember.memGrade == 2 && memGrade == 1) {
          openModal("downgrade", memGrade);
        }
        // 해지
        else {
          openModal("cancel");
        }
      }
    } catch (error) {
      console.error("결제 처리 중 오류:", error);
      alert("결제를 진행할 수 없습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  return (
    <div className="membership-container">
      <MembershipList handleCheckout={handleCheckout} />

      <PaymentModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        loading={modalState.loading}
        onClose={closeModal}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
}

export default MembershipPage;
