import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080";

const products = [
  {
    productName: "구독상품 1유형",
    price: 0,
  },
];

const userInfo = {
  userId: "testuser",
  userName: "홍길동",
  userEmail: "user01@kh.or",
  customerKey: "test_customerKey",
};

function generateRandomString() {
  return window.btoa(Math.random().toString()).slice(0, 20);
}

function PaymentCheckout() {
  const navigate = useNavigate();

  const [subscribeConfirmed, setSubscribeConfirmed] = useState(false);
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");

  async function confirmBilling() {
    const requestData = {
      customerKey: userInfo.customerKey,
      amount: products.price,
      orderId: generateRandomString(),
      orderName: products.productName,
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

    if (!response.ok) {
      throw { message: json.message, code: json.code };
    }

    return json;
  }

  confirmBilling()
    .then(() => setSubscribeConfirmed(true))
    .catch((err) => {
      navigate(
        `/mypage/membership/fail?message=${err.message}&code=${err.code}`
      );
    });

  return (
    <div className="membership-container">
      <div className="membership-box_section" style={{ width: "600px" }}>
        <img
          width="100px"
          src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
        />
        {subscribeConfirmed && (
          <h2 id="membership-title">구독이 완료되었습니다.</h2>
        )}
      </div>
    </div>
  );
}

export default PaymentCheckout;
