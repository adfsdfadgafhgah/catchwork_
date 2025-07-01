import "./MembershipItem.css";

function MembershipItem({ membership, handleCheckout, loginMemGrade }) {
  return (
    <>
      <div className="membership-item">
        <h1>{membership.memGradeName}</h1>
        <h1>{membership.memGradePrice}</h1>
        <p>{membership.membershipBenefit}</p>
        <button
          className="membership-button"
          disabled={
            membership.memGrade === 0 || membership.memGrade == loginMemGrade
          }
          onClick={() => handleCheckout(membership.memGrade)}
        >
          {membership.memGrade === 0
            ? "해지하기"
            : membership.memGrade == loginMemGrade
            ? "내 플랜"
            : "결제하기"}
        </button>
      </div>
    </>
  );
}
export default MembershipItem;
