import React from "react";
import styles from "./BanDetailBox.module.css";

const BanDetailBox = ({ banDetail, onRelease }) => {
  if (!banDetail) return <p>Loading...</p>;

  return (
    <div className={styles.detailBox}>
      <h3>정지 상세 정보</h3>
      <dl>
        <dt>BAN_NO</dt>
        <dd>{banDetail.banNo}</dd>

        <dt>정지 대상 타입</dt>
        <dd>{banDetail.banTargetType}</dd>

        <dt>정지 대상 번호</dt>
        <dd>{banDetail.banTargetNo}</dd>

        <dt>정지 사유</dt>
        <dd>{banDetail.banContent}</dd>
      </dl>

      <button onClick={() => onRelease(banDetail.banNo)}>정지 해제</button>
    </div>
  );
};

export default BanDetailBox;
