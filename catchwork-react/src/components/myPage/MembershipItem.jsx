import "./MembershipItem.css";

function MembershipItem({ plan, handleCheckout }) {
  return (
    <>
      <div className="membership-item">
        <h1>{plan.productName}</h1>
        <h1>{plan.price}</h1>
        <p>{plan.benefit}</p>
        <button
          className="membership-button"
          onClick={() => handleCheckout(plan.productId)}
        >
          결재하기
        </button>
      </div>
    </>
  );
}
export default MembershipItem;
