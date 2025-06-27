import { useEffect } from "react";
import MembershipItem from "./MembershipItem";
import useMembershipList from "../../stores/membershipStore";

function MembershipList({ handleCheckout }) {
  // 멤버십 정보 목록
  const { membershipList, getMembershipList } = useMembershipList();
  useEffect(() => {
    getMembershipList();
  }, []);

  return (
    <>
      {membershipList &&
        membershipList.map((membership) => (
          <MembershipItem
            key={membership.memGrade}
            membership={membership}
            handleCheckout={() => handleCheckout(membership.memGrade)}
          />
        ))}
    </>
  );
}

export default MembershipList;
