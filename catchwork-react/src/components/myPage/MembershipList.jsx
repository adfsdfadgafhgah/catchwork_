import { useEffect } from "react";
import MembershipItem from "./MembershipItem";
import useMembershipList from "../../stores/membershipStore";
import useLoginMember from "../../stores/loginMember";

function MembershipList({ handleCheckout }) {
  // 멤버십 정보 목록
  const { membershipList, getMembershipList } = useMembershipList();
  const { loginMember, setLoginMember } = useLoginMember();
  useEffect(() => {
    getMembershipList();
    setLoginMember();
  }, []);

  const loginMemGrade = loginMember.memGrade;

  return (
    <>
      {membershipList &&
        membershipList.map((membership) => (
          <MembershipItem
            key={membership.memGrade}
            membership={membership}
            loginMemGrade={loginMemGrade}
            handleCheckout={() => handleCheckout(membership.memGrade)}
          />
        ))}
    </>
  );
}

export default MembershipList;
