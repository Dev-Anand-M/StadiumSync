/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { startSimulation, onSimulationUpdate, type SimulationState } from './simulator';
import { stadiumConfig } from './stadium';

describe('Real-Time Data Simulation Engine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('initializes with capacity below limits and correctly structured state', () => {
    let stateRef: SimulationState | null = null;
    onSimulationUpdate((state) => {
      stateRef = state;
    });

    startSimulation(1000);
    expect(stateRef).toBeDefined();
    if (stateRef) {
      expect(stateRef!.totalAttendance).toBeLessThanOrEqual(stadiumConfig.totalCapacity);
      expect(stateRef!.zones.length).toBeGreaterThan(0);
      expect(stateRef!.facilities.length).toBeGreaterThan(0);
      expect(stateRef!.gates.length).toBeGreaterThan(0);
      expect(stateRef!.alerts.length).toBe(0);
    }
  });

  it('updates state organically across simulation ticks', () => {
    let callCount = 0;
    onSimulationUpdate(() => {
      callCount++;
    });

    startSimulation(1000);
    
    // Fast-forward initial + 3 ticks
    vi.advanceTimersByTime(3500);
    
    expect(callCount).toBeGreaterThanOrEqual(4); // initial + 3 ticks
  });
});
