/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderQueueDashboard } from './QueueDashboard';
import { startSimulation, stopSimulation, getState } from '../data/simulator';

describe('Queue Dashboard Tracking', () => {
  it('renders dynamic queue facilities effectively', () => {
    startSimulation(1000);
    const state = getState();
    if (state) {
      const container = document.createElement('div');
      renderQueueDashboard(container, state);
      expect(container.innerHTML).toContain('min');
    }
    stopSimulation();
  });
});
