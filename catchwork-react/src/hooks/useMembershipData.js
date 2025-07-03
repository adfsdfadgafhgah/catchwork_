import { useEffect, useState } from "react";
import useLoginMember from "../stores/loginMember";
import useMembershipList from "../stores/membershipStore";
import { axiosApi } from "../api/axiosAPI";

export default function useMembershipData() {
  const { loginMember, setLoginMember } = useLoginMember();
  const { membershipList, getMembershipList } = useMembershipList();
  const [subscription, setSubscription] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const getSubscription = async (memNo) => {
    try {
      const resp = await axiosApi.post("/membership/getSubscription", { memNo });
      if (resp.status === 200 && resp.data) {
        setSubscription(resp.data);
      } else {
        setSubscription({ memGrade: 0, subStatus: 0 }); // 기본값
      }
    } catch (error) {
      setSubscription({ memGrade: 0, subStatus: 0 }); // 기본값
      console.error(error);
    }
  };

  useEffect(() => {
    async function fetchAll() {
      setIsLoading(true);
      await setLoginMember();
      await getMembershipList();
      setIsLoading(false);
    }
    fetchAll();
  }, []);

  // loginMember가 바뀌면 구독 정보 갱신
  useEffect(() => {
    if (loginMember.memNo && !isLoading) getSubscription(loginMember.memNo);
  }, [loginMember.memNo, isLoading]);

  return { loginMember, membershipList, subscription, isLoading };
} 