import React from "react";

const BanTableRow = ({ banItem, onRelease, onRowClick }) => {
  const handleClickRow = () => {
    onRowClick(banItem.banNo);
  };

  const handleRelease = (e) => {
    e.stopPropagation();
    onRelease(banItem.banNo);
  };

  return (
    <tr onClick={handleClickRow}>
      <td>{banItem.banNo}</td>
      <td>{banItem.banTargetType}</td>
      <td>{banItem.banTargetNo}</td>
      <td>
        <button onClick={handleRelease}>정지 해제</button>
      </td>
    </tr>
  );
};

export default BanTableRow;
