import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency, formatNumber, formatDateTime } from '../utils/formatters';

interface ChartProps {
  data: any[];
  type: 'line' | 'area' | 'bar' | 'pie';
  xKey: string;
  yKey: string;
  title?: string;
  height?: number;
  color?: string;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  className?: string;
}

const Chart: React.FC<ChartProps> = ({
  data,
  type,
  xKey,
  yKey,
  title,
  height = 300,
  color = '#0ea5e9',
  colors = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'],
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  className = ''
}) => {
  const renderChart = (): React.ReactElement => {
    const commonProps = {
      data,
      height,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xKey} />
            <YAxis />
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            <Line
              type="monotone"
              dataKey={yKey}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xKey} />
            <YAxis />
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            <Area
              type="monotone"
              dataKey={yKey}
              stroke={color}
              fill={color}
              fillOpacity={0.3}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xKey} />
            <YAxis />
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            <Bar dataKey={yKey} fill={color} />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart width={400} height={height}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey={yKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
          </PieChart>
        );

      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

// Specialized chart components
export const RevenueChart: React.FC<{ data: any[]; height?: number }> = ({ data, height = 300 }) => (
  <Chart
    data={data}
    type="area"
    xKey="date"
    yKey="revenue"
    title="Revenue Over Time"
    color="#22c55e"
    height={height}
  />
);

export const UserGrowthChart: React.FC<{ data: any[]; height?: number }> = ({ data, height = 300 }) => (
  <Chart
    data={data}
    type="line"
    xKey="date"
    yKey="users"
    title="User Growth"
    color="#0ea5e9"
    height={height}
  />
);

export const AgentPerformanceChart: React.FC<{ data: any[]; height?: number }> = ({ data, height = 300 }) => (
  <Chart
    data={data}
    type="bar"
    xKey="agent"
    yKey="performance"
    title="Agent Performance"
    color="#f59e0b"
    height={height}
  />
);

export const SystemHealthChart: React.FC<{ data: any[]; height?: number }> = ({ data, height = 300 }) => (
  <Chart
    data={data}
    type="pie"
    xKey="name"
    yKey="value"
    title="System Health Distribution"
    colors={['#22c55e', '#f59e0b', '#ef4444']}
    height={height}
  />
);

export default Chart;
