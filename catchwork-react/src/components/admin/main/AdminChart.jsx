import styles from "./AdminChart.module.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const data = [
  { date: "2025-07-01", 문의수: 10, 신고수: 5 },
  { date: "2025-07-02", 문의수: 15, 신고수: 8 },
  { date: "2025-07-03", 문의수: 7, 신고수: 4 },
  { date: "2025-07-04", 문의수: 12, 신고수: 9 },
];

const AdminChart = () => {
  return (
    <div className={styles.chartWrapper}>
      <h2 className={styles.title}>차트</h2>
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="문의수" stroke="#8884d8" />
        <Line type="monotone" dataKey="신고수" stroke="#82ca9d" />
      </LineChart>
    </div>
  );
};

export default AdminChart;
