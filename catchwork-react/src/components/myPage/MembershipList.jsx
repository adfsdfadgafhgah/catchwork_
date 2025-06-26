import { useEffect } from "react";
import MembershipItem from "./MembershipItem";
import useMembershipList from "./Membership";

function MembershipList({ handleCheckout }) {
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
