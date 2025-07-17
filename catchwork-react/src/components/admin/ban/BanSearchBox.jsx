import React from "react";
import styles from "./BanSearchBox.module.css";

const BanSearchBox = ({ searchParams, onChange, onSearch }) => {
  return (
    <div className={styles.controlsSection}>
      {/* 왼쪽: 필터 + 검색어 */}
      <div className={styles.leftGroup}>
        <div className={styles.filterGroup}>
          <label htmlFor="banTargetType">대상 구분:</label>
          <select
            id="banTargetType"
            name="banTargetType"
            value={searchParams.banTargetType}
            onChange={onChange}
          >
            <option value="">전체</option>
            <option value="MEMBER">회원</option>
            <option value="BOARD">게시글</option>
            <option value="COMMENT">댓글</option>
            <option value="RECRUIT">공고</option>
            <option value="COMPANY">기업</option>
          </select>
        </div>

        <div className={styles.searchGroup}>
          <label htmlFor="keyword">검색어:</label>
          <input
            id="keyword"
            type="text"
            name="keyword"
            placeholder="대상 번호 또는 이름"
            value={searchParams.keyword}
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // 폼 제출 방지
                onSearch();
              }
            }}
          />
        </div>
      </div>

      {/* 오른쪽: 버튼 그룹 */}
      <div className={styles.rightGroup}>
        <button className={styles.searchButton} onClick={onSearch}>
          검색
        </button>
      </div>
    </div>
  );
};

export default BanSearchBox;
