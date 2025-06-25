// hooks/useInfiniteScroll.js
import { useEffect } from "react";

export default function useInfiniteScroll(targetRef, callback, hasMore) {
  useEffect(() => {
    if (!hasMore || !targetRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback(); // page 증가 함수 실행
        }
      },
      { threshold: 1.0 }
    );

    const el = targetRef.current;
    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [targetRef, callback, hasMore]);
}
