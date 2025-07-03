import "./MembershipItem.css";

function getMembershipButtonLabel({ loginMember, membership, subscription }) {
  // 0단계(무료) 플랜은 항상 비활성화
  if (membership.memGrade === 0) return "무료 플랜";

  // 내 플랜(구독 기준)
  if (membership.memGrade === subscription.memGrade) return "내 플랜";

  // 복구 (해지/다운그레이드 후 복구)
  if (
    subscription.subStatus === 1 &&
    membership.memGrade === loginMember.memGrade &&
    subscription.memGrade !== loginMember.memGrade
  ) {
    return "복구하기";
  }

  // 플랜 변경 (업/다운그레이드)
  if (
    membership.memGrade !== subscription.memGrade &&
    membership.memGrade !== 0 &&
    subscription.subStatus !== 1
  ) {
    return "플랜 변경하기";
  }

  // 결제 (무료 → 유료)
  if (
    loginMember.memGrade === 0 &&
    membership.memGrade !== 0 &&
    subscription.memGrade === 0
  ) {
    return "결제하기";
  }

  // 기본값
  return "결제하기";
}

function isButtonDisabled({ membership, subscription }) {
  // 0단계(무료) 플랜은 항상 비활성화
  if (membership.memGrade === 0) return true;
  // 내 플랜(구독 기준)은 비활성화
  if (membership.memGrade === subscription.memGrade) return true;
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

  // membership.memGrade === 0인 아이템은 subscription.memGrade === 0일 때만 출력
  if (membership.memGrade === 0 && subscription.memGrade !== 0) {
    return null;
  }

  // membership.memGrade === 1 || membership.memGrade === 2인 아이템은 항상 출력
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
