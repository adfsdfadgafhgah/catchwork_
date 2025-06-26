import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useMembershipList from "../../../components/myPage/Membership";

const userInfo = {
  userId: "95132b50-d360-400b-bfb2-5a1c51857f4c",
  userName: "홍길동",
  userEmail: "user01@example.com",
  memNo: "95132b50-d360-400b-bfb2-5a1c51857f4c",
};

const API_BASE_URL = "http://localhost:8080";

function PaymentCheckout() {
  function generateRandomString() {
    return window.btoa(Math.random().toString()).slice(0, 20);
  }
  const navigate = useNavigate();
  const isPayed = useRef(false);

  const [subscribeConfirmed, setSubscribeConfirmed] = useState(false);
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");

  const { membershipList, getMembershipList } = useMembershipList();
  useEffect(() => {
    getMembershipList();
  }, []);
  const product = membershipList.find(
    (item) => item.memGradeId === Number(productId)
  );

  async function confirmBilling() {
    const requestData = {
      customerKey: userInfo.memNo,
      amount: product.memGradePrice,
      orderId: generateRandomString(),
      orderName: product.memGradeName,
      customerEmail: userInfo.userEmail,
      customerName: userInfo.userName,
    };

    const response = await fetch(`${API_BASE_URL}/tosspayment/confirmBilling`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const json = await response.json();

    console.log(json);

    if (!response.ok) {
      throw { message: json.message, code: json.code };
    }

    return json;
  }

  useEffect(() => {
    if (!product || isPayed.current) return;
    isPayed.current = true;

    confirmBilling()
      .then(() => setSubscribeConfirmed(true))
      .catch((err) => {
        navigate(
          `/mypage/payment/fail?message=${err.message}&code=${err.code}`
        );
      });
  }, [product]);

  if (subscribeConfirmed) {
    return (
      <div className="membership-container">
        <div className="membership-box_section" style={{ width: "600px" }}>
          <img
            width="100px"
            src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
          />
          <h2 id="membership-title">구독이 완료되었습니다.</h2>
        </div>
      </div>
    );
  }

  // ✅ fallback UI 추가
  return (
    <div className="membership-container">
      <div className="membership-box_section" style={{ width: "600px" }}>
        <h2 id="membership-title">결제 확인 중입니다...</h2>
      </div>
    </div>
  );
}

export default PaymentCheckout;
