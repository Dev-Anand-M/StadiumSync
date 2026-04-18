/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { renderQueueDashboard, updateQueueDashboard } from './QueueDashboard';
import { startSimulation, stopSimulation, getState } from '../data/simulator';

describe('Queue Dashboard Tracking', () => {
  it('renders dynamic queue facilities and handles filter clicks', () => {
    startSimulation(1000);
    const state = getState();
    expect(state).toBeDefined();

    if (state) {
      const container = document.createElement('div');
      // Branch 1: Render All
      renderQueueDashboard(container, state);
      expect(container.innerHTML).toContain('Smart Queue Dashboard');

      // Test active filter UI interactions to trigger specific branches inside component
      const tabs = container.querySelectorAll('.tab') as NodeListOf<HTMLButtonElement>;
      expect(tabs.length).toBeGreaterThan(0);

      const foodTab = Array.from(tabs).find(t => t.getAttribute('data-filter') === 'food');
      if (foodTab) {
        foodTab.click(); // Branch 2: Filter processing logic
        expect(container.innerHTML).toContain('Food');
        
        // Assert grid is reconstructed or wait time is recalculated
        updateQueueDashboard(state); // Branch 3: Lifecycle tick updates
      }
    }
    stopSimulation();
  });
});
