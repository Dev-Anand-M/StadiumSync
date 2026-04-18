// ============================================================
// Real-Time Data Simulation Engine
// Simulates live crowd movement, queue fluctuations, events
// ============================================================

import { stadiumZones, facilities, gates, type StadiumZone, type FacilityInfo, type GateInfo } from './stadium';

type SimCallback = (data: SimulationState) => void;

export interface SimulationState {
  zones: StadiumZone[];
  facilities: FacilityInfo[];
  gates: GateInfo[];
  totalAttendance: number;
  timestamp: Date;
  alerts: LiveAlert[];
  crowdTrend: 'increasing' | 'decreasing' | 'stable';
}

export interface LiveAlert {
  id: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  icon: string;
  read: boolean;
}

const alertTemplates = [
  { type: 'warning' as const, title: 'High Congestion Alert', message: 'Gate S2 is experiencing heavy congestion. Consider using Gate S1 instead.', icon: '⚠️' },
  { type: 'info' as const, title: 'Halftime Approaching', message: 'Halftime in 5 minutes. Food courts may experience higher wait times.', icon: 'ℹ️' },
  { type: 'success' as const, title: 'Queue Update', message: 'Wait time at Main Food Court has dropped to under 5 minutes!', icon: '✅' },
  { type: 'info' as const, title: 'Weather Update', message: 'Light rain expected in 30 minutes. Covered sections recommended.', icon: '🌧️' },
  { type: 'warning' as const, title: 'Crowd Movement', message: 'Large crowd movement detected in East Concourse. Expect delays.', icon: '🚶' },
  { type: 'danger' as const, title: 'Emergency Lane', message: 'Please keep emergency lane near Section H clear at all times.', icon: '🚨' },
  { type: 'success' as const, title: 'GOAL!', message: 'Mumbai Strikers scores a boundary! The crowd goes wild!', icon: '🏏' },
  { type: 'info' as const, title: 'Fan Zone Active', message: 'DJ performance starting at the South Fan Zone in 10 minutes.', icon: '🎵' },
  { type: 'success' as const, title: 'Short Wait', message: 'East Snack Bar has the shortest wait time right now — only 3 min!', icon: '⚡' },
  { type: 'warning' as const, title: 'Parking Alert', message: 'Parking Lot B is now full. Use Lot C or D for exit planning.', icon: '🅿️' },
];

let alertIdCounter = 0;
let simulationInterval: ReturnType<typeof setInterval> | null = null;
let listeners: SimCallback[] = [];
let currentState: SimulationState;
let generatedAlerts: LiveAlert[] = [];

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function randomDelta(range: number): number {
  return Math.floor((Math.random() - 0.5) * 2 * range);
}

function simulateZoneChanges(zones: StadiumZone[]): StadiumZone[] {
  return zones.map(zone => {
    if (zone.type === 'field') return zone;
    const delta = randomDelta(Math.ceil(zone.capacity * 0.03));
    const newOccupancy = clamp(zone.currentOccupancy + delta, 0, zone.capacity);
    return { ...zone, currentOccupancy: newOccupancy };
  });
}

function simulateFacilityChanges(facs: FacilityInfo[]): FacilityInfo[] {
  return facs.map(fac => {
    if (!fac.isOpen) return fac;
    const waitDelta = randomDelta(3);
    const queueDelta = randomDelta(5);
    return {
      ...fac,
      waitTime: clamp(fac.waitTime + waitDelta, 0, 30),
      queueLength: clamp(fac.queueLength + queueDelta, 0, 80),
    };
  });
}

function simulateGateChanges(gts: GateInfo[]): GateInfo[] {
  return gts.map(gate => {
    if (!gate.isOpen) return gate;
    const congDelta = randomDelta(8);
    const tpDelta = randomDelta(10);
    return {
      ...gate,
      congestionLevel: clamp(gate.congestionLevel + congDelta, 5, 100),
      throughput: clamp(gate.throughput + tpDelta, 30, 200),
    };
  });
}

function maybeGenerateAlert(): LiveAlert | null {
  if (Math.random() > 0.15) return null; // 15% chance each tick
  const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
  return {
    id: `alert-${++alertIdCounter}`,
    ...template,
    timestamp: new Date(),
    read: false,
  };
}

function computeTotalAttendance(zones: StadiumZone[]): number {
  return zones
    .filter(z => z.type === 'seating' || z.type === 'vip')
    .reduce((sum, z) => sum + z.currentOccupancy, 0);
}

function tick(): void {
  const newZones = simulateZoneChanges(currentState.zones);
  const newFacilities = simulateFacilityChanges(currentState.facilities);
  const newGates = simulateGateChanges(currentState.gates);
  const newAlert = maybeGenerateAlert();

  if (newAlert) {
    generatedAlerts = [newAlert, ...generatedAlerts].slice(0, 50);
  }

  const prevAttendance = currentState.totalAttendance;
  const newAttendance = computeTotalAttendance(newZones);

  currentState = {
    zones: newZones,
    facilities: newFacilities,
    gates: newGates,
    totalAttendance: newAttendance,
    timestamp: new Date(),
    alerts: generatedAlerts,
    crowdTrend: newAttendance > prevAttendance ? 'increasing' : newAttendance < prevAttendance ? 'decreasing' : 'stable',
  };

  listeners.forEach(cb => cb(currentState));
}

export function startSimulation(intervalMs = 3000): void {
  if (simulationInterval) return;

  // Initialize state
  generatedAlerts = [
    { id: 'alert-init-1', type: 'info', title: 'Welcome!', message: 'Welcome to StadiumSync. Real-time data will update every few seconds.', timestamp: new Date(), icon: '👋', read: false },
    { id: 'alert-init-2', type: 'success', title: 'Match Live', message: 'Mumbai Strikers vs Delhi Dynamos — Match is currently in progress!', timestamp: new Date(Date.now() - 60000), icon: '🏏', read: true },
    { id: 'alert-init-3', type: 'warning', title: 'High Attendance', message: 'Stadium is at 80% capacity. Expect longer wait times at concessions.', timestamp: new Date(Date.now() - 120000), icon: '👥', read: true },
  ];

  currentState = {
    zones: [...stadiumZones],
    facilities: [...facilities],
    gates: [...gates],
    totalAttendance: computeTotalAttendance(stadiumZones),
    timestamp: new Date(),
    alerts: generatedAlerts,
    crowdTrend: 'stable',
  };

  // Emit initial state
  listeners.forEach(cb => cb(currentState));

  simulationInterval = setInterval(tick, intervalMs);
}

export function stopSimulation(): void {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
}

export function onSimulationUpdate(cb: SimCallback): () => void {
  listeners.push(cb);
  // Send current state immediately if available
  if (currentState) cb(currentState);
  return () => {
    listeners = listeners.filter(l => l !== cb);
  };
}

export function getState(): SimulationState | null {
  return currentState || null;
}

export function markAlertRead(alertId: string): void {
  generatedAlerts = generatedAlerts.map(a =>
    a.id === alertId ? { ...a, read: true } : a
  );
  if (currentState) {
    currentState = { ...currentState, alerts: generatedAlerts };
    listeners.forEach(cb => cb(currentState));
  }
}
