import RecruitItem from "./RecruitItem";
import styles from "./RecruitList.module.css";

export default function RecruitList({
  recruits,
  memNo,
  corpNo,
  memType,
  onLikeToggle,
}) {
  return (
    <div className={styles.recruitList}>
      {recruits.map((recruit) => (
        <RecruitItem
          key={recruit.recruitNo}
          recruit={recruit}
          memNo={memNo}
          corpNo={corpNo}
          memType={memType}
          onLikeToggle={onLikeToggle}
        />
      ))}
    </div>
  );
}
