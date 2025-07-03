import { useEffect, useRef, useState } from 'react';
import { axiosApi } from '../api/axiosAPI';
import { useNavigate } from 'react-router-dom';

// 결제 내역 구분키를 난수로 생성
function generateRandomString() {
  return window.btoa(Math.random().toString()).slice(0, 20);
}

const usePaymentModal = (
  loginMember,
  setLoginMember,
  membershipList,
  getMembershipList,
  getSubscription
) => {

  const navigate = useNavigate();

  const [balance, setBalance] = useState(0); // 환불 금액

  const [modalState, setModalState] = useState({
    isOpen: false, // 모달 열림 여부
    type: null, // 모달 타입
    targetGrade: null, // 목표 등급
    loading: false // 로딩 상태
  });

  const isMemberLoaded = useRef(false); // 로그인 유저 정보 로딩 여부
  const isMembershipListLoaded = useRef(false); // 멤버십 리스트 로딩 여부

  useEffect(() => {
    if (!isMemberLoaded.current || !isMembershipListLoaded.current) {
      setLoginMember(); // 로그인 유저 정보 갱신
      getMembershipList(); // 멤버십 리스트 갱신
      isMemberLoaded.current = true; // 로그인 유저 정보 로딩 완료
      isMembershipListLoaded.current = true; // 멤버십 리스트 로딩 완료
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

  // 업그레이드 모달이 열릴때 잔액 조회
  useEffect(() => {
    if (modalState.type === "upgrade") {
      getBalanceAmount();
    }
  }, [modalState.type]);

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

        case 'restore':
          await handleRestore();
          break;

        default:
          throw new Error('알 수 없는 모달 타입입니다.');
      }

      // 회원 정보 갱신
      await setLoginMember();
      // 구독 정보 갱신
      await getSubscription(loginMember.memNo);
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
      const response = await axiosApi.post(
        "/tosspayment/selectBalanceAmount",
        {
          memNo: loginMember.memNo
        });

      const amount = response.data;
      setBalance(amount);
      return amount;

      // 잔액을 상태로 저장하거나 다음 처리 진행
    } catch (error) {
      navigate(
        `/mypage/payment/fail?message=${error.message}&code=${error.code}`
      );
      setBalance(0);
      return 0;
    }
  }

  // 업그레이드 처리
  const handleUpgrade = async (targetGrade) => {

    const balance = await getBalanceAmount();

    const requestData = {
      customerKey: loginMember.memNo,
      amount: membershipList[targetGrade].memGradePrice - balance,
      orderId: generateRandomString(),
      orderName: membershipList[targetGrade].memGradeName,
      customerEmail: loginMember.memEmail,
      customerName: loginMember.memName,
    };

    // alert("요청 데이터:\n" + JSON.stringify(requestData, null, 2));

    const response = await axiosApi({
      method: "post",
      url: "/tosspayment/confirmBilling",
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

    const response = await axiosApi.put("/tosspayment/downgrade", {
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
    const response = await axiosApi.put("/tosspayment/downgrade", {
      memNo: loginMember.memNo,
      newGrade: 0
    });

    if (response.status === 200) {
      alert("구독이 성공적으로 해지되었습니다.");
    } else {
      throw new Error("구독 해지 처리에 실패했습니다.");
    }
  };

  // 구독 복구 처리
  const handleRestore = async () => {
    const response = await axiosApi.put("/tosspayment/restore", {
      memNo: loginMember.memNo,
    });

    if (response.status === 200) {
      alert("구독이 성공적으로 복구되었습니다.");
    } else {
      throw new Error("구독 복구 처리에 실패했습니다.")
    }
  };

  return {
    modalState,
    openModal,
    closeModal,
    handleModalConfirm,
    balance,
    targetPrice: modalState.targetGrade !== null ? membershipList[modalState.targetGrade]?.memGradePrice : 0
  };
};

export default usePaymentModal;