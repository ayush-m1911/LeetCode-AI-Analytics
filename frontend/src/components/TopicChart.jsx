import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import "./TopicChart.css";

const COLORS = [
  "#8b5cf6", "#7c3aed", "#06b6d4", "#0891b2",
  "#10b981", "#059669", "#f59e0b", "#d97706",
  "#ef4444", "#dc2626",
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip__topic">{payload[0].payload.topic_name}</div>
        <div className="chart-tooltip__value">
          <span>{payload[0].value}</span>
          <span className="chart-tooltip__label"> problems solved</span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomXAxisTick = ({ x, y, payload }) => {
  const label = payload.value.length > 10
    ? payload.value.slice(0, 9) + "…"
    : payload.value;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={14}
        textAnchor="middle"
        fill="var(--text-secondary)"
        fontSize={11}
        fontFamily="var(--font-sans)"
      >
        {label}
      </text>
    </g>
  );
};

export default function TopicChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="topic-chart topic-chart--empty">
        <div className="topic-chart__empty-icon">📊</div>
        <p>No topic data yet</p>
        <span>Sync your topics to see analytics</span>
      </div>
    );
  }

  return (
    <div className="topic-chart">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 30 }}
          barSize={28}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="topic_name"
            tick={<CustomXAxisTick />}
            axisLine={{ stroke: "rgba(255,255,255,0.07)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--text-secondary)", fontSize: 11, fontFamily: "var(--font-sans)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
          />
          <Bar dataKey="solved_count" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}