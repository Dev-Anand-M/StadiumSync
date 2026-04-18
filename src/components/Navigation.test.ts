/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderNavigation } from './Navigation';

describe('Navigation Workflow', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('renders routing UI without crashing', () => {
    // Mock simulation state with basic required fields
    const mockState = {
      zones: [],
      facilities: [],
      gates: [],
      totalAttendance: 10000,
      timestamp: new Date(),
      alerts: [],
      crowdTrend: 'stable' as const
    };
    
    // We pass minimal valid state. The function should render the "Smart Route Planner".
    renderNavigation(container, mockState);
    
    // Validate accessibility and layout
    expect(container.innerHTML).toContain('Smart Route Planner');
    expect(container.innerHTML).toContain('From:');
    expect(container.innerHTML).toContain('To:');
  });
});
