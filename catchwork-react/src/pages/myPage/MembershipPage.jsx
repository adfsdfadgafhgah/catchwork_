import { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import MembershipItem from "../../components/myPage/MembershipItem";

import "./MembershipPage.css";
import { axiosApi } from "../../api/axiosAPI";
import { useNavigate } from "react-router-dom";

// // ------  SDK 초기화 ------
// // TODO: clientKey는 개발자센터의 API 개별 연동 키 > 결제창 연동에 사용하려할 MID > 클라이언트 키로 바꾸세요.
// // TODO: server.js 의 secretKey 또한 결제위젯 연동 키가 아닌 API 개별 연동 키의 시크릿 키로 변경해야 합니다.
// // TODO: 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
// // @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
const clientKey = "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";
const customerKey = generateRandomString();

function generateRandomString() {
  return window.btoa(Math.random().toString()).slice(0, 20);
}

const userInfo = {
  userId: "testuser",
  userName: "홍길동",
  userEmail: "user01@kh.or",
  customerKey: customerKey,
};

const products = [
  {
    productId: 1,
    productName: "구독상품 1유형",
    price: 0,
  },
  {
    productId: 2,
    productName: "구독상품 2유형",
    price: 100,
  },
  {
    productId: 3,
    productName: "구독상품 3유형",
    price: 300,
  },
];

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
  }, [clientKey, userInfo.customerKey]);

  // 결제 정보를 입력하고 빌링키를 요청하는 위젯 사용
  async function requestBillingAuth() {
    await payment.requestBillingAuth({
      method: "CARD", // 자동결제(빌링)은 카드만 지원합니다
      successUrl: window.location.origin + "/mypage/payment/billing", // 요청이 성공하면 리다이렉트되는 URL
      failUrl: window.location.origin + "/mypage/payment/fail", // 요청이 실패하면 리다이렉트되는 URL
      customerEmail: userInfo.userEmail,
      customerName: userInfo.userName,
    });
  }

  // 결제 과정
  async function handleCheckout() {
    try {
      // 유효한 빌링키 검사
      const response = await axiosApi.post("/membership/getBillingKey", {
        memId: userInfo.userId,
      });

      //// 유효한 빌링키가 없다면 바로 결제 진행
      if (response.status == 200 && response.data == true) {
        navigate("/mypage/payment/billing");
      }
      // 유효한 빌링키가 없다면 새로 발급
      else if (response.status == 200 && response.data == false)
        requestBillingAuth();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="membership-container">
      {products.map((plan) => (
        <MembershipItem
          key={plan.productId}
          plan={plan}
          handleCheckout={handleCheckout}
        />
      ))}
    </div>
  );
}

export default MembershipPage;
