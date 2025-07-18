import React from "react";
import styles from "./RestoreTableRow.module.css";

const RestoreTableRow = ({ item, onRestore, onRowClick }) => {
  const handleClickRow = () => {
    onRowClick(item.targetNo);
  };

  const handleRestore = (e) => {
    e.stopPropagation();
    onRestore(item.targetNo, item.targetType);
  };

  return (
    <tr onClick={handleClickRow}>
      <td>{item.targetType}</td>
      <td>{item.target || "-"}</td>
      <td>
        <button onClick={handleRestore}>복구</button>
      </td>
    </tr>
  );
};

export default RestoreTableRow;
