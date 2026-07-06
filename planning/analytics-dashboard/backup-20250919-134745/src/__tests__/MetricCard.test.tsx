import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MetricCard from '../components/MetricCard';

describe('MetricCard', () => {
  it('renders with basic props', () => {
    render(
      <MetricCard
        title="Test Metric"
        value={1000}
        type="number"
      />
    );
    
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
  });

  it('renders currency values correctly', () => {
    render(
      <MetricCard
        title="Revenue"
        value={50000}
        type="currency"
      />
    );
    
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });

  it('renders percentage values correctly', () => {
    render(
      <MetricCard
        title="Growth Rate"
        value={15.5}
        type="percentage"
      />
    );
    
    expect(screen.getByText('15.5%')).toBeInTheDocument();
  });

  it('shows trend indicator when provided', () => {
    render(
      <MetricCard
        title="Test Metric"
        value={1000}
        trend={5.2}
      />
    );
    
    expect(screen.getByText('+5.2%')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(
      <MetricCard
        title="Test Metric"
        value={1000}
        loading={true}
      />
    );
    
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    // Check for loading skeleton elements
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('applies correct color classes', () => {
    const { rerender } = render(
      <MetricCard
        title="Test Metric"
        value={1000}
        color="success"
      />
    );
    
    expect(document.querySelector('.bg-success-50')).toBeInTheDocument();
    
    rerender(
      <MetricCard
        title="Test Metric"
        value={1000}
        color="danger"
      />
    );
    
    expect(document.querySelector('.bg-danger-50')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    const TestIcon = () => <div data-testid="test-icon">Icon</div>;
    
    render(
      <MetricCard
        title="Test Metric"
        value={1000}
        icon={<TestIcon />}
      />
    );
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(
      <MetricCard
        title="Test Metric"
        value={1000}
        subtitle="This is a subtitle"
      />
    );
    
    expect(screen.getByText('This is a subtitle')).toBeInTheDocument();
  });
});
