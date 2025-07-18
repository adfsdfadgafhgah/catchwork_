import React from "react";
import RestoreTableRow from "./RestoreTableRow";
import styles from "./RestoreTable.module.css";

const RestoreTable = ({ restoreList, onRestore, onRowClick }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>대상 타입</th>
          <th>대표 제목/이름</th>
          <th>복구</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(restoreList) && restoreList.length > 0 ? (
          restoreList.map((item) => (
            <RestoreTableRow
              key={`${item.targetType}-${item.targetNo}`}
              item={item}
              onRestore={onRestore}
              onRowClick={onRowClick}
            />
          ))
        ) : (
          <tr>
            <td colSpan="3">복구 가능한 항목이 없습니다.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default RestoreTable;
