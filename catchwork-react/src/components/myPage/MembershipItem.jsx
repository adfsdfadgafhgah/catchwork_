import "./MembershipItem.css";

function MembershipItem({ membership, handleCheckout }) {
  return (
    <>
      <div className="membership-item">
        <h1>{membership.memGradeName}</h1>
        <h1>{membership.memGradePrice}</h1>
        <p>{membership.membershipBenefit}</p>
        <button
          className="membership-button"
          onClick={() => handleCheckout(membership.memGrade)}
        >
          결재하기
        </button>
      </div>
    </>
  );
}
export default MembershipItem;
