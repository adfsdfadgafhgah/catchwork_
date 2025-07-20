import React from "react";
import styles from "./RestoreTableRow.module.css";

const RestoreTableRow = ({ item, onRestore, currentType }) => {
  const handleRestore = (e) => {
    e.stopPropagation();
    onRestore(item.targetNo, item.targetType);
  };

  return (
    <tr>
      <td>{item.targetType}</td>

      {currentType === "MEMBER" && (
        <>
          <td>{item.content}</td>
          <td>
            <button onClick={handleRestore}>복구</button>
          </td>
        </>
      )}

      {currentType === "COMPANY" && (
        <>
          <td>{item.title}</td>
          <td>
            <button onClick={handleRestore}>복구</button>
          </td>
        </>
      )}

      {currentType !== "MEMBER" && currentType !== "COMPANY" && (
        <>
          <td>{item.title}</td>
          <td>{item.content || "-"}</td>
          <td>
            <button onClick={handleRestore}>복구</button>
          </td>
        </>
      )}
    </tr>
  );
};

export default RestoreTableRow;
