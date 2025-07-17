import { useEffect, useRef, useMemo, useState } from "react";
import {
  useNavigate,
  useSearchParams,
  useOutletContext,
} from "react-router-dom";
import useMembershipData from "../../../hooks/useMembershipData";
import { axiosApi } from "../../../api/axiosAPI";

function PaymentCheckout() {
  // outlet context에서 loginMember 받아오기
  const { memNo } = useOutletContext();
  const [loginMember, setLoginMember] = useState(null);

  // 로그인 유저 정보 조회
  const getLoginMember = async () => {
    const resp = await axiosApi.post("/member/getLoginMember", { memNo });
    if (resp.status === 200) {
      setLoginMember(resp.data);
    }
  };

  // 로그인 유저 정보 갱신
  useEffect(() => {
    getLoginMember();
  }, [memNo]);

  // 페이지 이동용
  const navigate = useNavigate();
  // 중복 결제 요청 방지 플래그
  const isPayed = useRef(false);
  // 쿼리스트링 파라미터 추출
  const [searchParams] = useSearchParams();
  // 결제 대상 멤버십 등급 ID
  const productId = searchParams.get("productId");

  // 공통 데이터 훅 사용 (loginMember를 매개변수로 전달)
  const { membershipList, isLoading } = useMembershipData(loginMember);

  // 현재 선택된 상품 정보 추출 (productId에 해당하는 멤버십 등급)
  const product = useMemo(() => {
    return membershipList.find(
      (item) => String(item.memGrade) === String(productId)
    );
  }, [membershipList, productId]);

  // 상품 정보가 로딩되면 && 결제하지 않았으면 → 서버에서 결제 API 호출
  useEffect(() => {
    if (!product || !loginMember?.memNo || isPayed.current) return;
    // 중복 결제 방지
    isPayed.current = true;

    confirmBilling();
  }, [product, loginMember?.memNo]);

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
      const response = await axiosApi({
        method: "post",
        url: "/tosspayment/confirmBilling",
        headers: {
          "Content-Type": "application/json",
        },
        data: requestData,
      });
      if (response.status === 200) {
        navigate("/mypage/payment/sucess");
        return response.data;
      }
    } catch (err) {
      navigate(`/mypage/payment/fail?message=${err.message}&code=${err.code}`);
    }
  }

  if (isLoading) return null;

  return (
    <div className="membership-container">
      <div className="membership-box_section" style={{ width: "600px" }}>
        <h2 id="membership-title">결제 확인 중입니다...</h2>
      </div>
    </div>
  );
}

export default PaymentCheckout;
