import React from "react";
import BanTableRow from "./BanTableRow";
import styles from "./BanTable.module.css";

const BanTable = ({ banList, onRelease, onRowClick }) => {
  return (
    <table className={styles.supportTable}>
      <thead>
        <tr>
          <th>번호</th>
          <th>대상 구분</th>
          <th>대상 정보</th>
          <th>정지 해제</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(banList) && banList.length > 0 ? (
          banList.map((item) => (
            <BanTableRow
              key={item.banNo}
              banItem={item}
              onRelease={onRelease}
              onRowClick={onRowClick}
            />
          ))
        ) : (
          <tr>
            <td colSpan="4" className={styles.noItems}>
              정지된 항목이 없습니다.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default BanTable;
