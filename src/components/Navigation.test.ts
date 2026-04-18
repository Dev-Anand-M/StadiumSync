/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { renderNavigation } from './Navigation';
import { startSimulation, stopSimulation, getState } from '../data/simulator';

describe('Navigation Workflow', () => {
  it('renders routing UI without crashing', () => {
    startSimulation(1000);
    const state = getState();
    expect(state).toBeDefined();

    if (state) {
      const container = document.createElement('div');
      
      // Step 1: Base rendering without selected destination
      renderNavigation(container, state);
      expect(container.innerHTML).toContain('Route Planner');
      expect(container.innerHTML).toContain('Smart Navigation');

      // Step 2: Trigger destination selection branch to execute pathfinding algorithms
      const buttons = container.querySelectorAll('.dest-pick-btn') as NodeListOf<HTMLButtonElement>;
      if (buttons.length > 0) {
        buttons[0].click(); // this re-renders the container internally via attachNavListeners
        
        // Assert the dynamic route map generates
        expect(container.innerHTML).toContain('Optimal Route');
        expect(container.innerHTML).toContain('clear-route-btn');
        
        // Step 3: Trigger route clear branch
        const clearBtn = container.querySelector('#clear-route-btn') as HTMLButtonElement;
        if (clearBtn) clearBtn.click();
      }
      
      // Step 4: Quick Nav Panel click interactions
      const quickLinks = container.querySelectorAll('.nav-quick-dest') as NodeListOf<HTMLElement>;
      if (quickLinks.length > 0) {
        quickLinks[0].click();
        expect(container.innerHTML).toContain('Optimal Route');
      }
    }
    stopSimulation();
  });
});
