import MemberRecruitItem from "./MemberRecruitItem";
import styles from "./RecruitList.module.css";

export default function MemberRecruitList({
  recruits,
  loginMember,
  onLikeToggle,
}) {
  return (
    <div className={styles.recruitList}>
      {recruits.map((recruit) => (
        <MemberRecruitItem
          key={recruit.recruitNo}
          recruit={recruit}
          loginMember={loginMember}
          onLikeToggle={onLikeToggle}
        />
      ))}
    </div>
  );
}
