/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { renderPersonalHub } from './PersonalHub';
import { startSimulation, stopSimulation, getState } from '../data/simulator';

describe('Personal Hub Component', () => {
  it('renders ticket info, amenities, and recommendations', () => {
    startSimulation(1000);
    const state = getState();
    expect(state).toBeDefined();

    if (state) {
      const container = document.createElement('div');

      renderPersonalHub(container, state);
      expect(container.innerHTML).toContain('Personal Hub');
      expect(container.innerHTML).toContain('Nearest Amenities');
      expect(container.innerHTML).toContain('Personalized for You');
      expect(container.innerHTML).toContain('Your Event Timeline');

      // Verify semantic structure
      expect(container.querySelector('header.section-header')).not.toBeNull();
      expect(container.querySelector('section.card')).not.toBeNull();
      expect(container.querySelector('article.card')).not.toBeNull();

      // Verify ticket details render
      expect(container.innerHTML).toContain('Section');
      expect(container.innerHTML).toContain('Row');
    }
    stopSimulation();
  });
});
