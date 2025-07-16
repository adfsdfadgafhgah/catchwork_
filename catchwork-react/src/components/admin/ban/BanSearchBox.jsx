import React from "react";
import styles from "./BanSearchBox.module.css";

const BanSearchBox = ({ searchParams, onChange, onSearch }) => {
  return (
    <div className={styles.searchBox}>
      <select
        name="banTargetType"
        value={searchParams.banTargetType}
        onChange={onChange}
      >
        <option value="">전체</option>
        <option value="MEMBER">회원</option>
        <option value="BOARD">게시글</option>
        <option value="COMMENT">댓글</option>
        <option value="RECRUIT">공고</option>
        <option value="CORP_INFO">기업</option>
      </select>

      <input
        type="text"
        name="keyword"
        placeholder="대상 번호 또는 이름"
        value={searchParams.keyword}
        onChange={onChange}
      />

      <button onClick={onSearch}>검색</button>
    </div>
  );
};

export default BanSearchBox;
