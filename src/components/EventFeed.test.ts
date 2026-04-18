/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { renderEventFeed, updateEventFeed } from './EventFeed';
import { startSimulation, stopSimulation, getState } from '../data/simulator';

describe('Event Feed Component', () => {
  it('renders match timeline, alerts, and handles badge updates', () => {
    startSimulation(1000);
    const state = getState();
    expect(state).toBeDefined();

    if (state) {
      const container = document.createElement('div');

      // Render the full event feed
      renderEventFeed(container, state);
      expect(container.innerHTML).toContain('Live Event Feed');
      expect(container.innerHTML).toContain('Match Timeline');
      expect(container.innerHTML).toContain('Coming Up');

      // Verify semantic structure
      expect(container.querySelector('header.section-header')).not.toBeNull();
      expect(container.querySelector('article.card')).not.toBeNull();

      // Verify live alerts are rendered
      expect(container.innerHTML).toContain('Live Alerts');

      // Test incremental update
      updateEventFeed(state);
    }
    stopSimulation();
  });
});
