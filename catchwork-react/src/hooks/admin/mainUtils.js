import { useEffect, useState } from "react";
import { axiosApi } from './../../api/axiosAPI';

/**
 * 최근 신고 내역 무한스크롤 Hook
 */
export const useRecentReport = (pageSize = 10) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchReports = (page) => {
    setLoading(true);
    axiosApi
      .get("/admin/recentReport/list", {
        params: {
          page,
          size: pageSize,
        },
      })
      .then((res) => {
        if (res.data.length < pageSize) {
          setHasMore(false);
        }
        if (page === 1) {
          // 처음 page는 덮어쓰기
          setData(res.data);
        } else {
          setData((prev) => [...prev, ...res.data]);
        }
      })
      .catch((err) => {
        console.error("미처리 신고 내역 조회 실패", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReports(page);
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return { data, loading, hasMore, loadMore };
};

/**
 * 최근 신고 그룹 통계 조회 Hook
 */
export const useRecentReportCount = () => {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosApi
      .get("/admin/recentReport/count")
      .then((res) => {
        setCount(res.data);
      })
      .catch((err) => {
        console.error("신고 그룹 집계 조회 실패", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { count, loading };
};