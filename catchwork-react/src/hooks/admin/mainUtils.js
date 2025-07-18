import { useEffect, useState } from "react";
import { axiosApi } from "../../api/axiosAPI";

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

/**
 * 최근 7일 신고, 문의 수 통계
 */
export const useAdminChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [supportRes, reportRes] = await Promise.all([
          axiosApi.get("/admin/recentSupportChart"),
          axiosApi.get("/admin/recentReportChart"),
        ]);

        // 두 개의 배열 merge
        const supportData = supportRes.data;
        const reportData = reportRes.data;

        // 날짜별로 merge
        const merged = {};

        supportData.forEach(item => {
          merged[item.SUPPORT_DT] = {
            date: item.SUPPORT_DT,
            문의수: item.CNT,
            신고수: 0,
          };
        });

        reportData.forEach(item => {
          if (!merged[item.REPORT_DT]) {
            merged[item.REPORT_DT] = {
              date: item.REPORT_DT,
              문의수: 0,
              신고수: item.CNT,
            };
          } else {
            merged[item.REPORT_DT].신고수 = item.CNT;
          }
        });

        // Object → Array
        const chartData = Object.values(merged).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        setData(chartData);
      } catch (err) {
        console.error("차트 데이터 조회 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading };
};