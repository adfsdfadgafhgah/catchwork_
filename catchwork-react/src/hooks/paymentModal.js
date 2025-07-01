import { useEffect, useRef, useState } from 'react';
import { axiosApi } from '../api/axiosAPI';
import { useNavigate } from 'react-router-dom';

// 결제 내역 구분키를 난수로 생성
function generateRandomString() {
  return window.btoa(Math.random().toString()).slice(0, 20);
}

const usePaymentModal = (loginMember, setLoginMember, membershipList, getMembershipList) => {

  const navigate = useNavigate();

  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    targetGrade: null,
    loading: false
  });

  const isMemberLoaded = useRef(false);
  const isMembershipListLoaded = useRef(false);

  useEffect(() => {
    if (!isMemberLoaded.current || !isMembershipListLoaded.current) {
      setLoginMember();
      getMembershipList();
      isMemberLoaded.current = true;
      isMembershipListLoaded.current = true;
    }
  }, []);

  // 모달 열기
  const openModal = (type, targetGrade = null) => {
    setModalState({
      isOpen: true,
      type,
      targetGrade,
      loading: false
    });
  };

  // 모달 닫기
  const closeModal = () => {
    if (modalState.loading) return; // 로딩 중에는 닫기 방지

    setModalState({
      isOpen: false,
      type: null,
      targetGrade: null,
      loading: false
    });
  };

  // 로딩 상태 설정
  const setLoading = (loading) => {
    setModalState(prev => ({
      ...prev,
      loading
    }));
  };

  // 모달 확인 처리
  const handleModalConfirm = async () => {
    const { type, targetGrade } = modalState;

    // 로그인 회원 정보가 없으면 모달 동작 중단
    if (!loginMember || !loginMember.memNo) {
      alert("로그인이 필요한 기능입니다.");
      closeModal();  // 모달 닫기
      return;
    }

    try {
      setLoading(true);

      // 각 타입별 API 호출 처리
      switch (type) {
        case 'upgrade':
          await handleUpgrade(targetGrade);
          break;

        case 'downgrade':
          await handleDowngrade(targetGrade);
          break;

        case 'cancel':
          await handleCancel();
          break;

        default:
          throw new Error('알 수 없는 모달 타입입니다.');
      }

      // 회원 정보 갱신
      await setLoginMember();
      closeModal();

    } catch (error) {
      console.error("처리 중 오류:", error);
      alert(error.message || "처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setLoading(false);
    }
  };

  // 환불 금액 조회
  const getBalanceAmount = async () => {

    try {
      const response = await axiosApi({
        method: "post",
        url: "/tosspayment/selectBalanceAmount",
        headers: {
          "Content-Type": "application/json",
        },
        data: loginMember.memNo,
      });

      alert("환불금 출력" + response.data + response)

      return response.data;

      // 잔액을 상태로 저장하거나 다음 처리 진행
    } catch (error) {
      navigate(
        `/mypage/payment/fail?message=${error.message}&code=${error.code}`
      );
      return 0;
    }
  }

  // 업그레이드 처리
  const handleUpgrade = async (targetGrade) => {

    const balance = await getBalanceAmount();

    alert(
      "customerKey : " + loginMember.memNo + "@@@@" +
      "amount : " + (membershipList[targetGrade].memGradePrice - balance) + "@@@@" +
      "orderId : " + generateRandomString() + "@@@@" +
      "orderName : " + membershipList[targetGrade].memGradeName + "@@@@" +
      "customerEmail : " + loginMember.memEmail + "@@@@" +
      "customerName : " + loginMember.memName
    )

    const requestData = {
      customerKey: loginMember.memNo,
      amount: membershipList[targetGrade].memGradePrice - balance,
      orderId: generateRandomString(),
      orderName: membershipList[targetGrade].memGradeName,
      customerEmail: loginMember.memEmail,
      customerName: loginMember.memName,
    };

    const response = await axiosApi({
      method: "post",
      url: "/tosspayment/upgrade",
      headers: {
        "Content-Type": "application/json",
      },
      data: requestData,
    });

    if (response.status === 200) {
      alert("멤버십이 성공적으로 업그레이드되었습니다.");
    } else {
      throw new Error("업그레이드 처리에 실패했습니다.");
    }
  };

  // 다운그레이드 처리
  const handleDowngrade = async (targetGrade) => {
    const response = await axiosApi.post("/tosspayment/downgrade", {
      memNo: loginMember.memNo,
      newGrade: targetGrade
    });

    if (response.status === 200) {
      alert("멤버십이 성공적으로 다운그레이드되었습니다.");
    } else {
      throw new Error("다운그레이드 처리에 실패했습니다.");
    }
  };

  // 구독 해지 처리
  const handleCancel = async () => {
    const response = await axiosApi.post("/tosspayment/cancel", {
      memNo: loginMember.memNo
    });

    if (response.status === 200) {
      alert("구독이 성공적으로 해지되었습니다.");
    } else {
      throw new Error("구독 해지 처리에 실패했습니다.");
    }
  };

  return {
    modalState,
    openModal,
    closeModal,
    handleModalConfirm
  };
};

export default usePaymentModal;