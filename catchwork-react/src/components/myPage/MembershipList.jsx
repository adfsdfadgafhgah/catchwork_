import MembershipItem from "./MembershipItem";

function MembershipList({
  membershipList,
  subscription,
  loginMember,
  handleCheckout,
}) {
  if (!membershipList || !subscription || !loginMember) return null;
  return (
    <>
      {membershipList.map((membership) => (
        <MembershipItem
          key={membership.memGrade}
          membership={membership}
          subscription={subscription}
          loginMember={loginMember}
          handleCheckout={() => handleCheckout(membership.memGrade)}
        />
      ))}
    </>
  );
}

export default MembershipList;
