import { useEffect, useState } from "react";
import useMembershipList from "../stores/membershipStore";
import { axiosApi } from "../api/axiosAPI";

export default function useMembershipData(loginMember) {
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
      if (!loginMember?.memNo) return;

      setIsLoading(true);
      await getMembershipList();
      await getSubscription(loginMember.memNo);
      setIsLoading(false);
    }
    fetchAll();
  }, [loginMember?.memNo]);

  return {
    membershipList,
    subscription,
    isLoading,
    getSubscription,
    getMembershipList
  };
} 