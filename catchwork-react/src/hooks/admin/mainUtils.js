import { useEffect, useState } from "react";
import { axiosApi } from './../../api/axiosAPI';

/**
 * 미처리 신고 내역 무한스크롤 Hook
 */
export const useRecentReport = (pageSize = 5) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchReports = (page) => {
    setLoading(true);
    axiosApi
      .get("/admin/recentReportList", {
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
 * 미처리 문의 내역 무한스크롤 Hook
 */
export const useRecentSupport = (pageSize = 5) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchSupports = (page) => {
    setLoading(true);
    axiosApi
      .get("/admin/recentSupportList", {
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
          setData(res.data);
        } else {
          setData((prev) => [...prev, ...res.data]);
        }
      })
      .catch((err) => {
        console.error("미처리 문의 내역 조회 실패", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSupports(page);
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return { data, loading, hasMore, loadMore };
};


/**
 * 미처리 신고 그룹 통계 조회 Hook
 */
export const useRecentReportCount = () => {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosApi
      .get("/admin/recentReportCount")
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

/**
 * 미처리 문의 그룹 통계 조회 Hook
 */
export const useRecentSupportCount = () => {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosApi
      .get("/admin/recentSupportCount")
      .then((res) => {
        setCount(res.data);
      })
      .catch((err) => {
        console.error("미처리 문의 통계 조회 실패", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { count, loading };
};
