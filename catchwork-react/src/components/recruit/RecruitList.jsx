import RecruitItem from "./RecruitItem";
import styles from "./RecruitList.module.css";

export default function RecruitList({ recruits, loginMember, onLikeToggle }) {
  return (
    <div className={styles.recruitList}>
      {recruits.map((recruit) => (
        <RecruitItem
          key={recruit.recruitNo}
          recruit={recruit}
          loginMember={loginMember}
          onLikeToggle={onLikeToggle}
        />
      ))}
    </div>
  );
}
