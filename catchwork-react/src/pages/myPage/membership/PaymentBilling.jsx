import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080";

function PaymentBilling() {
  const navigate = useNavigate();

  const [billingConfirmed, setBillingConfirmed] = useState(false);
  const [searchParams] = useSearchParams();

  const isIssueBillingKey = useRef(false);

  const productId = searchParams.get("productId");
  const customerKey = searchParams.get("customerKey");
  const authKey = searchParams.get("authKey");

  // 잘못된 접근 시, 오류 페이지로 이동
  useEffect(() => {
    if (!customerKey || !authKey || !productId) {
      navigate("/mypage/payment/fail?message=잘못된 접근&code=400");
    }
  }, [customerKey, authKey, productId, navigate]);

  // 렌더링 직전에 잘못된 조건일 경우는 아무것도 보여주지 않게 처리
  if (!customerKey || !authKey || !productId) {
    return null;
  }

  useEffect(() => {
    // @docs https://docs.tosspayments.com/reference#authkey
    // 빌링키 발급
    async function issueBillingKey() {
      const requestData = {
        customerKey: customerKey,
        authKey: authKey,
      };

      // 빌링키 요청을 서버로 제출하여 빌링키를 발급, 저장
      const response = await fetch(
        `${API_BASE_URL}/tosspayment/issueBillingKey`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw { message: json.message, code: json.code };
      }

      return json;
    }

    // 이미 보낸 요청이라면, 요청을 보내지 않음
    if (!isIssueBillingKey.current) {
      isIssueBillingKey.current = true;

      // 페이지 로드시, 빌링키 발급
      issueBillingKey()
        .then(() =>
          /* TODO: 빌링키 발급에 성공했을 경우 UI 처리 로직을 구현하세요. */
          setBillingConfirmed(true)
        )
        .catch((err) => {
          // TODO: 빌링키 발급에 실패했을 경우 UI 처리 로직을 구현하세요.
          navigate(
            `/mypage/payment/fail?message=${err.message}&code=${err.code}`
          );
        });
    }
  }, []);

  if (billingConfirmed) {
    return (
      <div className="membership-container">
        <div className="membership-box_section" style={{ width: "600px" }}>
          <img
            width="100px"
            src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
          />
          <h2 id="membership-title">카드 등록이 완료되었습니다.</h2>
          <button
            id="membership-confirm"
            className="membership-button"
            onClick={() =>
              navigate(`/mypage/payment/checkout?productId=${productId}`)
            }
          >
            구독하기
          </button>
        </div>
      </div>
    );
  }
}

export default PaymentBilling;
