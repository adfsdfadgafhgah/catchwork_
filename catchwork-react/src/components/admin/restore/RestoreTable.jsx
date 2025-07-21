import React from "react";
import RestoreTableRow from "./RestoreTableRow";
import styles from "./RestoreTable.module.css";

const RestoreTable = ({ restoreList, onRestore }) => {
  const hasData = Array.isArray(restoreList) && restoreList.length > 0;
  const currentType = hasData ? restoreList[0].targetType : null;

  // 각 타입별 컬럼명 지정
  const getHeaders = () => {
    switch (currentType) {
      case "MEMBER":
        return ["대상 타입", "닉네임/이름", "복구"];
      case "COMPANY":
        return ["대상 타입", "기업명", "복구"];
      default:
        return ["대상 타입", "제목", "작성자", "복구"];
    }
  };

  const headers = getHeaders();

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {headers.map((header, idx) => (
            <th key={idx}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {hasData ? (
          restoreList.map((item) => (
            <RestoreTableRow
              key={`${item.targetType}-${item.targetNo}`}
              item={item}
              onRestore={onRestore}
              currentType={currentType}
            />
          ))
        ) : (
          <tr>
            <td colSpan={headers.length}>복구 가능한 항목이 없습니다.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default RestoreTable;
