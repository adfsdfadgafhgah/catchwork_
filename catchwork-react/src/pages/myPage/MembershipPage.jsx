import { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

import "./MembershipPage.css";
import { axiosApi } from "../../api/axiosAPI";
import { useNavigate } from "react-router-dom";
import MembershipList from "../../components/myPage/MembershipList";

// ------  SDK 초기화 ------
// TODO: clientKey는 개발자센터의 API 개별 연동 키 > 결제창 연동에 사용하려할 MID > 클라이언트 키로 바꾸세요.
// TODO: server.js 의 secretKey 또한 결제위젯 연동 키가 아닌 API 개별 연동 키의 시크릿 키로 변경해야 합니다.
// TODO: 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
// @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
const customerKey = "95132b50-d360-400b-bfb2-5a1c51857f4c";

const userInfo = {
  userId: "user01",
  userName: "홍길동",
  userEmail: "test@example.com",
  memNo: customerKey,
};

function MembershipPage() {
  const navigate = useNavigate();

  // 결제 위젯 객체
  const [payment, setPayment] = useState(null);
  // 위젯 로드
  useEffect(() => {
    async function fetchPayment() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        // 회원 결제
        // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentspayment
        const payment = tossPayments.payment({
          customerKey,
        });
        setPayment(payment);
      } catch (error) {
        console.error("Error fetching payment:", error);
      }
    }
    fetchPayment();
  }, [clientKey, userInfo.memNo]);

  // 결제 정보를 입력하고 빌링키를 요청하는 위젯 사용
  async function requestBillingAuth(productId) {
    await payment.requestBillingAuth({
      method: "CARD", // 자동결제(빌링)은 카드만 지원합니다
      successUrl:
        window.location.origin +
        `/mypage/payment/billing?productId=${productId}`, // 요청이 성공하면 리다이렉트되는 URL
      failUrl: window.location.origin + "/mypage/payment/fail", // 요청이 실패하면 리다이렉트되는 URL
      customerEmail: userInfo.userEmail,
      customerName: userInfo.userName,
    });
  }

  // 결제 과정
  async function handleCheckout(memGrade) {
    try {
      // 유효한 빌링키 검사
      const response = await axiosApi.post("/tosspayment/getBillingKey", {
        memNo: userInfo.memNo,
      });

      // 유효한 빌링키가 있다면 바로 결제 진행
      if (response.status == 200 && response.data) {
        if (confirm("구독하시겠습니까?")) {
          navigate(`/mypage/payment/checkout?productId=${memGrade}`);
        } else {
          alert("결제를 취소하셨습니다.");
          navigate("/mypage/membership");
        }
      }
      // 유효한 빌링키가 없다면 새로 발급
      else if (response.status == 200 && !response.data) {
        requestBillingAuth(memGrade);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="membership-container">
      <MembershipList handleCheckout={handleCheckout} />
    </div>
  );
}

export default MembershipPage;
