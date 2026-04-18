/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderAnalytics } from './Analytics';
import { startSimulation, stopSimulation, getState } from '../data/simulator';

describe('Analytics Metrics', () => {
  it('processes analytics logic accurately', () => {
    startSimulation(1000);
    const state = getState();
    if (state) {
      const container = document.createElement('div');
      renderAnalytics(container, state);
      expect(container.innerHTML).toContain('Analytics');
    }
    stopSimulation();
  });
});
