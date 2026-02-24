import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Chart from '../components/Chart';

// Mock recharts components
jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  Area: () => <div data-testid="area" />,
  Bar: () => <div data-testid="bar" />,
  Pie: () => <div data-testid="pie" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  Cell: () => <div data-testid="cell" />
}));

const mockData = [
  { date: '2024-01-01', value: 100 },
  { date: '2024-01-02', value: 150 },
  { date: '2024-01-03', value: 200 },
];

describe('Chart', () => {
  it('renders line chart correctly', () => {
    render(
      <Chart
        data={mockData}
        type="line"
        xKey="date"
        yKey="value"
        title="Test Line Chart"
      />
    );
    
    expect(screen.getByText('Test Line Chart')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('line')).toBeInTheDocument();
  });

  it('renders area chart correctly', () => {
    render(
      <Chart
        data={mockData}
        type="area"
        xKey="date"
        yKey="value"
        title="Test Area Chart"
      />
    );
    
    expect(screen.getByText('Test Area Chart')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByTestId('area')).toBeInTheDocument();
  });

  it('renders bar chart correctly', () => {
    render(
      <Chart
        data={mockData}
        type="bar"
        xKey="date"
        yKey="value"
        title="Test Bar Chart"
      />
    );
    
    expect(screen.getByText('Test Bar Chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar')).toBeInTheDocument();
  });

  it('renders pie chart correctly', () => {
    render(
      <Chart
        data={mockData}
        type="pie"
        xKey="date"
        yKey="value"
        title="Test Pie Chart"
      />
    );
    
    expect(screen.getByText('Test Pie Chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
  });

  it('renders without title when not provided', () => {
    render(
      <Chart
        data={mockData}
        type="line"
        xKey="date"
        yKey="value"
      />
    );
    
    expect(screen.queryByText('Test Line Chart')).not.toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('applies custom height', () => {
    render(
      <Chart
        data={mockData}
        type="line"
        xKey="date"
        yKey="value"
        height={500}
      />
    );
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('applies custom color', () => {
    render(
      <Chart
        data={mockData}
        type="line"
        xKey="date"
        yKey="value"
        color="#ff0000"
      />
    );
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('shows legend when enabled', () => {
    render(
      <Chart
        data={mockData}
        type="line"
        xKey="date"
        yKey="value"
        showLegend={true}
      />
    );
    
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('hides legend when disabled', () => {
    render(
      <Chart
        data={mockData}
        type="line"
        xKey="date"
        yKey="value"
        showLegend={false}
      />
    );
    
    expect(screen.queryByTestId('legend')).not.toBeInTheDocument();
  });
});
