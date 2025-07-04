import "./MembershipItem.css";

function getMembershipButtonLabel({ loginMember, membership, subscription }) {
  // subscription이 없으면 무료 플랜과 동일하게 처리
  const safeSubscription = subscription || { memGrade: 0, subStatus: 0 };

  // 내 플랜(구독 기준)
  if (membership.memGrade === safeSubscription.memGrade) return "내 플랜";

  // 0단계(무료) 플랜은 항상 비활성화
  if (membership.memGrade === 0) return "무료 플랜";

  // 복구 (해지/다운그레이드 후 복구)
  if (
    safeSubscription.subStatus === 1 &&
    membership.memGrade === loginMember.memGrade &&
    safeSubscription.memGrade !== loginMember.memGrade
  ) {
    return "복구하기";
  }

  // 결제 (무료 → 유료)
  if (
    loginMember.memGrade === 0 &&
    membership.memGrade !== 0 &&
    safeSubscription.memGrade === 0
  ) {
    return "결제하기";
  }

  // 플랜 변경 (업/다운그레이드)
  if (
    membership.memGrade !== safeSubscription.memGrade &&
    membership.memGrade !== 0 &&
    safeSubscription.subStatus !== 1
  ) {
    return "플랜 변경하기";
  }

  // 기본값
  return "결제하기";
}

function isButtonDisabled({ membership, subscription }) {
  const safeSubscription = subscription || { memGrade: 0 };
  // 0단계(무료) 플랜은 항상 비활성화
  if (membership.memGrade === 0) return true;
  // 내 플랜(구독 기준)은 비활성화
  if (membership.memGrade === safeSubscription.memGrade) return true;
  return false;
}

function MembershipItem({
  membership,
  handleCheckout,
  loginMember,
  subscription,
}) {
  const label = getMembershipButtonLabel({
    loginMember,
    membership,
    subscription,
  });
  const disabled = isButtonDisabled({ membership, subscription, loginMember });

  if (
    membership.memGrade === 0 &&
    subscription !== undefined &&
    subscription.memGrade !== 0
  ) {
    return null;
  }

  return (
    <div className="membership-item">
      <h1>{membership.memGradeName}</h1>
      <h1>{membership.memGradePrice}</h1>
      <p>{membership.membershipBenefit}</p>
      <button
        className="membership-button"
        disabled={disabled}
        onClick={() => handleCheckout(membership.memGrade)}
      >
        {label}
      </button>
    </div>
  );
}
export default MembershipItem;
