/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { registerRoute, navigate, getCurrentPath, initRouter } from './router';

describe('Client-Side SPA Router', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div class="nav-item" data-path="dashboard"></div>
      <div class="nav-item" data-path="analytics"></div>
    `;
  });

  it('registers and executes routes correctly', () => {
    let hit = false;
    registerRoute('dashboard', () => { hit = true; });
    
    navigate('dashboard');
    expect(hit).toBe(true);
    expect(getCurrentPath()).toBe('dashboard');
  });

  it('initializes and binds to DOM nodes correctly', () => {
    let dummyState = 0;
    registerRoute('analytics', () => { dummyState = 1; });
    
    initRouter('dashboard');
    
    const btn = document.querySelector('[data-path="analytics"]') as HTMLElement;
    btn.click();
    
    expect(dummyState).toBe(1);
    expect(getCurrentPath()).toBe('analytics');
    
    // Check if active class was added exactly to the clicked nav item
    expect(btn.classList.contains('active')).toBe(true);
  });
});
