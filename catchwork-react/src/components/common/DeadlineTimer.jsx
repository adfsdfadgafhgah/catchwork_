// DeadlineTimer.js (아래 전체 코드로 교체)

import { useState, useEffect } from "react";
import styles from "./DeadlineTimer.module.css";

export default function DeadlineTimer({ startDate, endDate, status }) {
  const endOfDay = new Date(endDate);
  endOfDay.setHours(23, 59, 59, 999);

  // 남은 시간을 계산하는 함수
  const calculateTimeLeft = () => {
    const difference = +endOfDay - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  // 날짜 포맷팅 함수 (YYYY.MM.DD HH:mm)
  const formatDateTime = (dateString, type) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");

    // 타입에 따라 시간을 고정하여 반환합니다.
    if (type === "start") {
      return `${yyyy}.${mm}.${dd} 00:00`;
    }
    if (type === "end") {
      return `${yyyy}.${mm}.${dd} 23:59`;
    }
    return ""; // 예외 처리
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // 수동 마감 상태가 아닐 때만 타이머를 실행
    if (status !== 3) {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [endDate, status]);

  if (!isClient) {
    return null;
  }

  // 렌더링 전에 최종 마감 여부를 결정하는 변수
  const isClosed = status === 3 || Object.keys(timeLeft).length === 0;

  return (
    <div className={styles.timerContainer}>
      {/* [수정] 마감 여부에 따라 제목을 변경합니다. */}
      <h3 className={styles.title}>{isClosed ? "모집 기간" : "남은 기간"}</h3>
      <div className={styles.countdown}>
        {/* [수정] isClosed 변수를 사용하여 렌더링을 결정합니다. */}
        {isClosed ? (
          <span className={styles.closed}>마감되었습니다</span>
        ) : (
          <>
            <span className={styles.days}>
              {String(timeLeft.days || 0).padStart(2, "0")}
            </span>
            일
            <span className={styles.time}>
              {String(timeLeft.hours || 0).padStart(2, "0")}
            </span>
            시간
            <span className={styles.time}>
              {String(timeLeft.minutes || 0).padStart(2, "0")}
            </span>
            분
            <span className={styles.time}>
              {String(timeLeft.seconds || 0).padStart(2, "0")}
            </span>
            초
          </>
        )}
      </div>
      <div className={styles.dateInfo}>
        <div className={styles.dateRow}>
          <span className={`${styles.dateLabel} ${styles.start}`}>시작일</span>
          <span className={styles.dateValue}>
            {formatDateTime(startDate, "start")}
          </span>
        </div>
        <div className={styles.dateRow}>
          <span className={`${styles.dateLabel} ${styles.end}`}>마감일</span>
          <span className={styles.dateValue}>
            {formatDateTime(endDate, "end")}
          </span>
        </div>
      </div>
    </div>
  );
}
