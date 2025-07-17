import { Link, useSearchParams } from "react-router-dom";
import styles from "./PaymentFail.module.css";

function PaymentFail() {
  const [searchParams] = useSearchParams();

  return (
    <main className={styles.errorContainer}>
      <div className={styles.errorBox}>
        <div className={styles.errorHeader}>
          <img
            src="https://static.toss.im/lotties/error-spot-no-loop-space-apng.png"
            alt="에러 이미지"
            className={styles.errorImage}
          />
          <h2 className={styles.errorTitle}>오류가 발생했어요</h2>
        </div>

        <div className={styles.errorInfo}>
          <div className={styles.errorDetail}>
            <div className={styles.errorLabel}>
              <strong>에러메시지</strong>
            </div>
            <div className={styles.errorValue} id="message">
              {`${searchParams.get("message")}`}
            </div>
          </div>

          <div className={styles.errorDetail}>
            <div className={styles.errorLabel}>
              <strong>에러코드</strong>
            </div>
            <div className={styles.errorValue} id="code">
              {`${searchParams.get("code")}`}
            </div>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <Link to="https://docs.tosspayments.com/guides/v2/payment-widget/integration">
            <button className={styles.button}>연동 문서</button>
          </Link>
          <Link to="https://discord.gg/A4fRFXQhRu">
            <button className={styles.button}>실시간 문의</button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default PaymentFail;
