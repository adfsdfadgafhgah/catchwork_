import React, { useEffect, useState } from "react";
import RestoreTable from "../../components/admin/restore/RestoreTable";
import Pagination from "../../components/common/Pagination"; 
import useRestoreUtils from "../../hooks/admin/useRestoreUtils";
import styles from "./AdminRestorePage.module.css";

const AdminRestorePage = () => {
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const limit = 10; // 한 페이지당 보여줄 항목 수
  const { restoreList, totalCount, getRestoreList, restoreItem } = useRestoreUtils(); // totalCount 포함

  useEffect(() => {
    getRestoreList(currentPage); // 페이지 번호 기반 요청
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>복구 대상 관리</h2>
      <RestoreTable restoreList={restoreList} onRestore={restoreItem} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AdminRestorePage;
