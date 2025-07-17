import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useBanUtils from "../../hooks/admin/useBanUtils";
import BanSearchBox from "../../components/admin/ban/BanSearchBox";
import BanTable from "../../components/admin/ban/BanTable";
import Pagination from "../../components/common/Pagination";
import styles from "./AdminBanPage.module.css";

const AdminBanPage = () => {
  const {
    banList,
    getBanList,
    handleSearch,
    releaseBan,
    goToDetail,
  } = useBanUtils();

  const [searchParams, setSearchParams] = useSearchParams();

  const [searchFilters, setSearchFilters] = useState({
    banTargetType: "",
    keyword: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const banTargetType = searchParams.get("banTargetType") || "";
    const keyword = searchParams.get("keyword") || "";

    setCurrentPage(page);
    setSearchFilters({ banTargetType, keyword });

    fetchBanList({
      page,
      amount: 10,
      banTargetType,
      keyword,
    });
  }, [searchParams]);

  const fetchBanList = async (params) => {
    try {
      const res = await getBanList(params);
      // banList는 setBanList()로 이미 저장됨
      // totalCount도 백엔드에서 내려주도록 가정
      setTotalCount(res?.totalCount || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeSearch = (e) => {
    const { name, value } = e.target;
    setSearchFilters({
      ...searchFilters,
      [name]: value,
    });
  };

  const onSearch = () => {
    const newParams = new URLSearchParams();
    if (searchFilters.banTargetType)
      newParams.set("banTargetType", searchFilters.banTargetType);
    if (searchFilters.keyword)
      newParams.set("keyword", searchFilters.keyword);
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const onReset = () => {
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    setSearchParams(newParams);
  };

  const onRelease = (banNo) => {
    releaseBan(banNo, () => {
      fetchBanList({
        page: currentPage,
        amount: 10,
        banTargetType: searchFilters.banTargetType,
        keyword: searchFilters.keyword,
      });
    });
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>정지 관리</h2>

      <BanSearchBox
        searchParams={searchFilters}
        onChange={onChangeSearch}
        onSearch={onSearch}
        onReset={onReset}
      />

      <BanTable
        banList={banList}
        onRelease={onRelease}
        onRowClick={goToDetail}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default AdminBanPage;
