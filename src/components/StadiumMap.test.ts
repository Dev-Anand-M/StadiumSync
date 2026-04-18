/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderStadiumMap } from './StadiumMap';
import { startSimulation, stopSimulation, getState } from '../data/simulator';

describe('Stadium Map View Strategy', () => {
  it('renders SVG zones and layout effectively', () => {
    startSimulation(1000);
    const state = getState();
    if (state) {
      const container = document.createElement('div');
      renderStadiumMap(container, state);
      expect(container.innerHTML).toContain('svg');
    }
    stopSimulation();
  });
});
