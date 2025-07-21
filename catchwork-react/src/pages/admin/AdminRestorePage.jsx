import React, { useEffect, useState } from "react";
import RestoreTable from "../../components/admin/restore/RestoreTable";
import Pagination from "../../components/common/Pagination";
import RestoreSearchBox from "../../components/admin/restore/RestoreSearchBox";
import useRestoreUtils from "../../hooks/admin/useRestoreUtils";
import styles from "./AdminRestorePage.module.css";

const AdminRestorePage = () => {
  const [category, setCategory] = useState("BOARD");
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { restoreList, totalCount, getRestoreList, restoreItem } = useRestoreUtils();

  // useEffect(() => {
  //   getRestoreList(category, keyword, currentPage);
  // }, [category, keyword, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    getRestoreList(category, keyword, 1);
  };

  const totalPages = Math.ceil(totalCount / 10);

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>복구 대상 관리</h2>
      <div className={styles.card}>
        <RestoreSearchBox
          category={category}
          setCategory={setCategory}
          keyword={keyword}
          setKeyword={setKeyword}
          onSearch={handleSearch}
        />
        <RestoreTable restoreList={restoreList} onRestore={restoreItem} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default AdminRestorePage;
