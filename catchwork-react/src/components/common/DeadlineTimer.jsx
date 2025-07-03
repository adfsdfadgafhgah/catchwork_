import { useEffect, useState } from "react";

function DeadlineTimer({ recruitEndDate }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const endDateTime = new Date(`${recruitEndDate}T23:59:59`);

    const updateTimer = () => {
      const now = new Date();
      const diff = endDateTime - now;

      if (diff <= 0) {
        setTimeLeft("마감되었습니다");
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      let result = "";

      if (days > 0) {
        result += `${days}일 `;
      }

      result += `${String(hours).padStart(2, "0")}시간 ${String(
        minutes
      ).padStart(2, "0")}분 ${String(seconds).padStart(2, "0")}초`;

      setTimeLeft(result);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer); // cleanup
  }, [recruitEndDate]);

  return (
    <div style={{ color: "red", fontWeight: "bold" }}>
      공고 마감까지 남은 시간: {timeLeft}
    </div>
  );
}

export default DeadlineTimer;
