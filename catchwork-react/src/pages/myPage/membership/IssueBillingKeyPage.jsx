import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosApi } from "../../../api/axiosAPI";
import useMembershipData from "../../../hooks/useMembershipData";

function IssueBillingKeyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isIssueBillingKey = useRef(false);
  const productId = searchParams.get("productId");
  const customerKey = searchParams.get("customerKey");
  const authKey = searchParams.get("authKey");

  // 공통 데이터 훅 사용
  const { loginMember, membershipList, isLoading } = useMembershipData();

  useEffect(() => {
    if (!customerKey || !authKey || !productId) {
      navigate("/mypage/payment/fail?message=잘못된 접근&code=400");
    }
  }, [customerKey, authKey, productId, navigate]);

  if (!customerKey || !authKey || !productId || isLoading) {
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
      try {
        const resp = await axiosApi({
          method: "post",
          url: "/tosspayment/issueBillingKey",
          headers: {
            "Content-Type": "application/json",
          },
          data: requestData,
        });
        if (resp.status === 200) {
          if (confirm("구독하시겠습니까?")) {
            navigate(`/mypage/payment/checkout?productId=${productId}`);
          } else {
            alert("결제를 취소하셨습니다.");
            navigate("/mypage/membership");
          }
          return resp.data;
        }
      } catch (err) {
        navigate(
          `/mypage/payment/fail?message=${err.message}&code=${err.code}`
        );
      }
    }

    // 이미 보낸 요청이라면, 요청을 보내지 않음
    if (!isIssueBillingKey.current) {
      isIssueBillingKey.current = true;

      // 페이지 로드시, 빌링키 발급
      issueBillingKey();
    }
  }, []);

  return (
    <div className="membership-container">
      <div className="membership-box_section" style={{ width: "600px" }}>
        <h2 id="membership-title">등록 확인 중입니다...</h2>
      </div>
    </div>
  );
}

export default IssueBillingKeyPage;
