/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { renderStadiumMap, updateStadiumMap } from './StadiumMap';
import { startSimulation, stopSimulation, getState } from '../data/simulator';

describe('Stadium Map View Strategy', () => {
  it('renders SVG zones and layout effectively', () => {
    startSimulation(1000);
    const state = getState();
    expect(state).toBeDefined();

    if (state) {
      const container = document.createElement('div');
      
      // Inject dummy tooltip container just in case the code looks for body-attached element
      const tt = document.createElement('div');
      tt.id = 'map-tooltip';
      document.body.appendChild(tt);

      // Branch 1: SVG Layout construction
      renderStadiumMap(container, state);
      expect(container.innerHTML).toContain('svg');
      expect(container.innerHTML).toContain('Stadium Map');

      // Branch 2: Mouse hover states
      const zoneNode = container.querySelector('.stadium-section');
      if (zoneNode) {
        // Dispatch mouse events to trigger dynamic tooltip bindings
        zoneNode.dispatchEvent(new MouseEvent('mouseenter'));
        zoneNode.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100 }));
        zoneNode.dispatchEvent(new MouseEvent('mouseleave'));
      }

      // Branch 3: Polling update cycle
      updateStadiumMap(state);

      document.body.innerHTML = ''; // Cleanup
    }
    stopSimulation();
  });
});
