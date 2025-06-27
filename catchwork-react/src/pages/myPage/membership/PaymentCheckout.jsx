import { useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useMembershipList from "../../../stores/membershipStore";
import useLoginMember from "../../../stores/loginMember";

function PaymentCheckout() {
  // 페이지 이동용
  const navigate = useNavigate();
  // 중복 결제 요청 방지 플래그
  const isPayed = useRef(false);
  // 쿼리스트링 파라미터 추출
  const [searchParams] = useSearchParams();
  // 결제 대상 멤버십 등급 ID
  const productId = searchParams.get("productId");

  // 로그인 회원 정보
  const { loginMember, setLoginMember } = useLoginMember();
  // 멤버십 정보 목록
  const { membershipList, getMembershipList } = useMembershipList();
  // 멤버쉽 정보 로드
  useEffect(() => {
    getMembershipList();
    setLoginMember();
  }, []);

  // 현재 선택된 상품 정보 추출 (productId에 해당하는 멤버십 등급)
  const product = useMemo(() => {
    return membershipList.find(
      (item) => String(item.memGrade) === String(productId)
    );
  }, [membershipList, productId]);

  // 상품 정보, 회원 정보가 로딩되면 결제 인증 → 결제 확정 API 호출
  useEffect(() => {
    if (!product || isPayed.current) return;

    isPayed.current = true;

    confirmBilling()
      .then(() => {
        navigate("/mypage/payment/sucess");
      })
      .catch((err) => {
        navigate(
          `/mypage/payment/fail?message=${err.message}&code=${err.code}`
        );
      });
  }, [product, loginMember.memNo]);

  // 결제 내역 구분키를 난수로 생성
  function generateRandomString() {
    return window.btoa(Math.random().toString()).slice(0, 20);
  }

  // 실제 결제 요청을 백엔드에 보내는 함수 (빌링키 기반 자동결제 확정)
  async function confirmBilling() {
    const requestData = {
      customerKey: loginMember.memNo,
      amount: product.memGradePrice,
      orderId: generateRandomString(),
      orderName: product.memGradeName,
      customerEmail: loginMember.memEmail,
      customerName: loginMember.memName,
    };

    try {
      const response = await axiosApi.post("/tosspayment/confirmBilling", {
        requestData,
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (err) {
      navigate(`/mypage/payment/fail?message=${err.message}&code=${err.code}`);
    }
  }

  return (
    <div className="membership-container">
      <div className="membership-box_section" style={{ width: "600px" }}>
        <h2 id="membership-title">결제 확인 중입니다...</h2>
      </div>
    </div>
  );
}

export default PaymentCheckout;
