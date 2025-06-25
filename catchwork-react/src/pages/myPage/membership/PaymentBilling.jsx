import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080";

function PaymentBilling() {
  const navigate = useNavigate();

  const [billingConfirmed, setBillingConfirmed] = useState(false);
  const [searchParams] = useSearchParams();

  const productId = searchParams.get("productId");

  useEffect(() => {
    // @docs https://docs.tosspayments.com/reference#authkey
    // 빌링키 발급
    async function issueBillingKey() {
      const requestData = {
        customerKey: searchParams.get("customerKey"),
        authKey: searchParams.get("authKey"),
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

      console.log(json);

      if (!response.ok) {
        throw { message: json.message, code: json.code };
      }

      return json;
    }

    // 페이지 로드시, 빌링키 발급
    issueBillingKey()
      .then(() =>
        /* TODO: 빌링키 발급에 성공했을 경우 UI 처리 로직을 구현하세요. */
        setBillingConfirmed(true)
      )
      .catch((err) => {
        // TODO: 빌링키 발급에 실패했을 경우 UI 처리 로직을 구현하세요.
        navigate(
          `/mypage/membership/fail?message=${err.message}&code=${err.code}`
        );
      });
  }, []);

  return (
    <div className="membership-container">
      <div className="membership-box_section" style={{ width: "600px" }}>
        <img
          width="100px"
          src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
        />
        <h2 id="membership-title">카드 등록이 완료되었습니다.</h2>
        {billingConfirmed && (
          <button
            id="membership-confirm"
            className="membership-button"
            onClick={() =>
              navigate(`/mypage/payment/checkout?productId=${productId}`)
            }
          >
            구독하기
          </button>
        )}
      </div>
    </div>
  );
}

export default PaymentBilling;
