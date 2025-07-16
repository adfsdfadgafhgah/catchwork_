import React from "react";
import BanTableRow from "./BanTableRow";
import styles from "./BanTable.module.css";

const BanTable = ({ banList, onRelease, onRowClick }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>BAN_NO</th>
          <th>정지 대상 타입</th>
          <th>정지 대상 번호</th>
          <th>해제</th>
        </tr>
      </thead>
      <tbody>
        {banList.length > 0 ? (
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
            <td colSpan="4">데이터가 없습니다.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default BanTable;
