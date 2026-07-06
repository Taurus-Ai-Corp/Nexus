import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlertPanel from '../components/AlertPanel';

const mockAlerts = [
  {
    id: '1',
    type: 'warning' as const,
    message: 'High CPU usage detected',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    resolved: false,
    source: 'System Monitor',
    acknowledged: false
  },
  {
    id: '2',
    type: 'error' as const,
    message: 'Database connection failed',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    resolved: false,
    source: 'Database Monitor',
    acknowledged: true
  },
  {
    id: '3',
    type: 'info' as const,
    message: 'Maintenance completed',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    resolved: true,
    source: 'Maintenance Bot',
    acknowledged: true
  }
];

describe('AlertPanel', () => {
  it('renders alerts correctly', () => {
    render(<AlertPanel alerts={mockAlerts} />);
    
    expect(screen.getByText('System Alerts')).toBeInTheDocument();
    expect(screen.getByText('High CPU usage detected')).toBeInTheDocument();
    expect(screen.getByText('Database connection failed')).toBeInTheDocument();
    expect(screen.getByText('Maintenance completed')).toBeInTheDocument();
  });

  it('shows alert count', () => {
    render(<AlertPanel alerts={mockAlerts} />);
    
    expect(screen.getByText('3 total alerts')).toBeInTheDocument();
  });

  it('shows unacknowledged count', () => {
    render(<AlertPanel alerts={mockAlerts} />);
    
    expect(screen.getByText('1 new')).toBeInTheDocument();
  });

  it('renders empty state when no alerts', () => {
    render(<AlertPanel alerts={[]} />);
    
    expect(screen.getByText('No alerts at this time')).toBeInTheDocument();
    expect(screen.getByText('0 total alerts')).toBeInTheDocument();
  });

  it('calls onAcknowledge when acknowledge button is clicked', () => {
    const mockOnAcknowledge = jest.fn();
    
    render(
      <AlertPanel
        alerts={mockAlerts}
        onAcknowledge={mockOnAcknowledge}
      />
    );
    
    const acknowledgeButton = screen.getByText('Acknowledge');
    fireEvent.click(acknowledgeButton);
    
    expect(mockOnAcknowledge).toHaveBeenCalledWith('1');
  });

  it('calls onDismiss when dismiss button is clicked', () => {
    const mockOnDismiss = jest.fn();
    
    render(
      <AlertPanel
        alerts={mockAlerts}
        onDismiss={mockOnDismiss}
      />
    );
    
    const dismissButtons = screen.getAllByRole('button', { name: '' });
    fireEvent.click(dismissButtons[0]); // First dismiss button
    
    expect(mockOnDismiss).toHaveBeenCalledWith('1');
  });

  it('limits displayed alerts to maxAlerts', () => {
    const manyAlerts = Array.from({ length: 15 }, (_, i) => ({
      id: `${i + 1}`,
      type: 'info' as const,
      message: `Alert ${i + 1}`,
      timestamp: new Date().toISOString(),
      resolved: false,
      source: 'Test Source',
      acknowledged: false
    }));
    
    render(<AlertPanel alerts={manyAlerts} maxAlerts={5} />);
    
    expect(screen.getByText('Alert 1')).toBeInTheDocument();
    expect(screen.getByText('Alert 5')).toBeInTheDocument();
    expect(screen.queryByText('Alert 6')).not.toBeInTheDocument();
    expect(screen.getByText('View all 15 alerts')).toBeInTheDocument();
  });

  it('shows different alert types with correct styling', () => {
    render(<AlertPanel alerts={mockAlerts} />);
    
    // Check that different alert types are rendered
    expect(screen.getByText('High CPU usage detected')).toBeInTheDocument();
    expect(screen.getByText('Database connection failed')).toBeInTheDocument();
    expect(screen.getByText('Maintenance completed')).toBeInTheDocument();
  });

  it('shows alert metadata', () => {
    render(<AlertPanel alerts={mockAlerts} />);
    
    expect(screen.getByText('warning')).toBeInTheDocument();
    expect(screen.getByText('error')).toBeInTheDocument();
    expect(screen.getByText('info')).toBeInTheDocument();
    expect(screen.getByText('System Monitor')).toBeInTheDocument();
    expect(screen.getByText('Database Monitor')).toBeInTheDocument();
  });

  it('applies correct CSS classes for different alert types', () => {
    const { container } = render(<AlertPanel alerts={mockAlerts} />);
    
    // Check for warning alert styling
    const warningAlert = container.querySelector('.border-warning-400');
    expect(warningAlert).toBeInTheDocument();
    
    // Check for error alert styling
    const errorAlert = container.querySelector('.border-danger-400');
    expect(errorAlert).toBeInTheDocument();
  });
});
