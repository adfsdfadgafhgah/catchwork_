import { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

import "./MembershipPage.css";
import { axiosApi } from "../../api/axiosAPI";
import { useNavigate } from "react-router-dom";
import MembershipList from "../../components/myPage/MembershipList";
import useLoginMember from "../../stores/loginMember";

// 환경변수에서 clientKey 가져오기 (권장)
const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";

function MembershipPage() {
  // 네비게이션 객체
  const navigate = useNavigate();
  // 토스 SDK 객체
  const [payment, setPayment] = useState(null);
  // 로그인 회원 정보
  const { loginMember, setLoginMember } = useLoginMember();
  // 사용자 정보 요청
  useEffect(() => {
    setLoginMember();
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
      const response = await axiosApi.post("/tosspayment/getBillingKey", {
        memNo: loginMember.memNo,
      });

      if (response.status === 200 && response.data) {
        if (confirm("구독하시겠습니까?")) {
          navigate(`/mypage/payment/checkout?productId=${memGrade}`);
        } else {
          alert("결제를 취소하셨습니다.");
          navigate("/mypage/membership");
        }
      } else if (response.status === 200 && !response.data) {
        requestBillingAuth(memGrade);
      }
    } catch (error) {
      console.error("결제 처리 중 오류:", error);
      alert("결제를 진행할 수 없습니다. 잠시 후 다시 시도해주세요.");
    }
  }

  return (
    <div className="membership-container">
      <MembershipList handleCheckout={handleCheckout} />
    </div>
  );
}

export default MembershipPage;
