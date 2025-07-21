import React from "react";
import styles from "./RestoreSearchBox.module.css";

const RestoreSearchBox = ({ category, setCategory, keyword, setKeyword, onSearch }) => {
  return (
    <div className={styles.controlsSection}>
      <div className={styles.leftGroup}>
        <div className={styles.filterGroup}>
          <label>대상 </label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="MEMBER">회원</option>
            <option value="COMPANY">기업</option>
            <option value="RECRUIT">채용공고</option>
            <option value="BOARD">게시글</option>
            <option value="COMMENT">댓글</option>
          </select>
        </div>

        <div className={styles.searchGroup}>
          <label>검색 </label>
          <input
            type="text"
            placeholder="닉네임, 이름, 제목 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // 폼 제출 방지
                onSearch();
              }
            }}
          />
        </div>
      </div>

      <div className={styles.rightGroup}>
        <button className={styles.searchButton} onClick={onSearch}>
          검색
        </button>
      </div>
    </div>
  );
};

export default RestoreSearchBox;
