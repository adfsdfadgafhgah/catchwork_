import styles from "./AdminChart.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useAdminChart } from "../../../hooks/admin/mainUtils";

const AdminChart = () => {
  const { data, loading } = useAdminChart();

  return (
    <div className={styles.chartWrapper}>
      <h2 className={styles.title}>최근 7일 신고·문의 현황</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="문의수" stroke="#8884d8" />
          <Line type="monotone" dataKey="신고수" stroke="#82ca9d" />
        </LineChart>
      )}
    </div>
  );
};

export default AdminChart;
