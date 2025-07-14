import MemberRecruitItem from "./MemberRecruitItem";
import styles from "./RecruitList.module.css";

export default function MemberRecruitList({ recruits, memNo, onLikeToggle }) {
  return (
    <div className={styles.recruitList}>
      {recruits.map((recruit) => (
        <MemberRecruitItem
          key={recruit.recruitNo}
          recruit={recruit}
          memNo={memNo}
          onLikeToggle={onLikeToggle}
        />
      ))}
    </div>
  );
}
