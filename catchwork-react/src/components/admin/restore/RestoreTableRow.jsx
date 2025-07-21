import React from "react";
import { truncateText } from "../../../hooks/admin/mainUtils";

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
          <td>{truncateText(item.content, 10)}</td>
          <td>
            <button onClick={handleRestore}>복구</button>
          </td>
        </>
      )}

      {currentType === "COMPANY" && (
        <>
          <td>{truncateText(item.title, 10)}</td>
          <td>
            <button onClick={handleRestore}>복구</button>
          </td>
        </>
      )}

      {currentType !== "MEMBER" && currentType !== "COMPANY" && (
        <>
          <td>{truncateText(item.title, 30)}</td>
          <td>{truncateText(item.content, 10)}</td>
          <td>
            <button onClick={handleRestore}>복구</button>
          </td>
        </>
      )}
    </tr>
  );
};

export default RestoreTableRow;
