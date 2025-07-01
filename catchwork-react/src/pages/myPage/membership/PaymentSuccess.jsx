import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function PaymentSuccess() {
  const isLender = useRef(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLender.current) return;
    isLender.current = true;
    alert("결제가 완료되었습니다.");
    navigate("/mypage/membership");
  }, []);
  return;
}
export default PaymentSuccess;
