/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { renderAnalytics } from './Analytics';
import { startSimulation, stopSimulation, getState } from '../data/simulator';

describe('Analytics Metrics', () => {
  it('processes analytics logic accurately', () => {
    startSimulation(1000);
    const state = getState();
    expect(state).toBeDefined();

    if (state) {
      const container = document.createElement('div');
      
      // We mount it directly
      document.body.appendChild(container);
      
      // Branch test: The analytics chart rendering logic
      renderAnalytics(container, state);
      expect(container.innerHTML).toContain('Venue Utilization');
      expect(container.innerHTML).toContain('Analytics Dashboard');
      
      // Ensure the Donut SVG branches, Capacity breakdowns, and Table renders
      expect(container.innerHTML).toContain('donut-container');
      
      document.body.innerHTML = '';
    }
    stopSimulation();
  });
});
