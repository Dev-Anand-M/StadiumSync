// ============================================================
// Stadium Layout Data — Zone definitions, gates, facilities
// ============================================================

export interface StadiumZone {
  id: string;
  name: string;
  type: 'seating' | 'concourse' | 'gate' | 'food' | 'restroom' | 'merchandise' | 'medical' | 'vip' | 'field';
  capacity: number;
  currentOccupancy: number;
  x: number;
  y: number;
  width: number;
  height: number;
  section?: string;
  level?: string;
  adjacentZones: string[];
}

export interface FacilityInfo {
  id: string;
  name: string;
  type: 'food' | 'restroom' | 'merchandise' | 'medical' | 'bar' | 'atm';
  zone: string;
  icon: string;
  waitTime: number;
  queueLength: number;
  isOpen: boolean;
  rating: number;
  description: string;
}

export interface GateInfo {
  id: string;
  name: string;
  zone: string;
  isOpen: boolean;
  congestionLevel: number; // 0-100
  throughput: number; // people/min
}

export const stadiumConfig = {
  name: "National Stadium",
  city: "Mumbai, India",
  totalCapacity: 65000,
  currentAttendance: 52340,
  event: {
    name: "Mumbai vs Delhi — IPL Finals",
    date: "2026-04-18",
    startTime: "19:30",
    status: "live" as const,
    currentScore: { home: 186, away: 142 },
    homeTeam: "Mumbai Strikers",
    awayTeam: "Delhi Dynamos",
    matchTime: "16.2 overs",
    inning: 2
  }
};

export const stadiumZones: StadiumZone[] = [
  // Field / Pitch
  { id: 'field', name: 'Playing Field', type: 'field', capacity: 0, currentOccupancy: 0, x: 350, y: 200, width: 200, height: 120, adjacentZones: [] },

  // North Stand sections
  { id: 'north-a', name: 'North Stand A', type: 'seating', capacity: 4500, currentOccupancy: 3800, x: 280, y: 60, width: 120, height: 60, section: 'A', level: 'Lower', adjacentZones: ['north-b', 'north-c1', 'gate-n1'] },
  { id: 'north-b', name: 'North Stand B', type: 'seating', capacity: 5000, currentOccupancy: 4200, x: 400, y: 50, width: 100, height: 60, section: 'B', level: 'Lower', adjacentZones: ['north-a', 'north-c2', 'gate-n2'] },
  { id: 'north-c', name: 'North Stand C', type: 'seating', capacity: 4500, currentOccupancy: 4100, x: 500, y: 60, width: 120, height: 60, section: 'C', level: 'Lower', adjacentZones: ['north-b', 'north-c3'] },

  // South Stand sections
  { id: 'south-a', name: 'South Stand A', type: 'seating', capacity: 4500, currentOccupancy: 3200, x: 280, y: 380, width: 120, height: 60, section: 'D', level: 'Lower', adjacentZones: ['south-b', 'gate-s1'] },
  { id: 'south-b', name: 'South Stand B', type: 'seating', capacity: 5000, currentOccupancy: 4800, x: 400, y: 390, width: 100, height: 60, section: 'E', level: 'Lower', adjacentZones: ['south-a', 'south-c', 'gate-s2'] },
  { id: 'south-c', name: 'South Stand C', type: 'seating', capacity: 4500, currentOccupancy: 3900, x: 500, y: 380, width: 120, height: 60, section: 'F', level: 'Lower', adjacentZones: ['south-b'] },

  // East Stand
  { id: 'east-a', name: 'East Stand Upper', type: 'seating', capacity: 6000, currentOccupancy: 5100, x: 640, y: 120, width: 60, height: 120, section: 'G', level: 'Upper', adjacentZones: ['east-b', 'gate-e1'] },
  { id: 'east-b', name: 'East Stand Lower', type: 'seating', capacity: 6000, currentOccupancy: 5600, x: 640, y: 260, width: 60, height: 120, section: 'H', level: 'Lower', adjacentZones: ['east-a', 'gate-e2'] },

  // West Stand
  { id: 'west-a', name: 'West Stand Upper', type: 'seating', capacity: 6000, currentOccupancy: 4800, x: 200, y: 120, width: 60, height: 120, section: 'J', level: 'Upper', adjacentZones: ['west-b', 'gate-w1'] },
  { id: 'west-b', name: 'West Stand Lower', type: 'seating', capacity: 6000, currentOccupancy: 5200, x: 200, y: 260, width: 60, height: 120, section: 'K', level: 'Lower', adjacentZones: ['west-a', 'gate-w2'] },

  // VIP Zones
  { id: 'vip-north', name: 'VIP Lounge North', type: 'vip', capacity: 1500, currentOccupancy: 1100, x: 380, y: 120, width: 140, height: 30, adjacentZones: ['north-b'] },
  { id: 'vip-south', name: 'VIP Lounge South', type: 'vip', capacity: 1500, currentOccupancy: 1200, x: 380, y: 350, width: 140, height: 30, adjacentZones: ['south-b'] },

  // Concourses
  { id: 'concourse-n', name: 'North Concourse', type: 'concourse', capacity: 3000, currentOccupancy: 1200, x: 300, y: 130, width: 300, height: 20, adjacentZones: ['north-a', 'north-b', 'north-c'] },
  { id: 'concourse-s', name: 'South Concourse', type: 'concourse', capacity: 3000, currentOccupancy: 1800, x: 300, y: 360, width: 300, height: 20, adjacentZones: ['south-a', 'south-b', 'south-c'] },
  { id: 'concourse-e', name: 'East Concourse', type: 'concourse', capacity: 2000, currentOccupancy: 900, x: 620, y: 160, width: 20, height: 200, adjacentZones: ['east-a', 'east-b'] },
  { id: 'concourse-w', name: 'West Concourse', type: 'concourse', capacity: 2000, currentOccupancy: 1100, x: 260, y: 160, width: 20, height: 200, adjacentZones: ['west-a', 'west-b'] },
];

export const facilities: FacilityInfo[] = [
  { id: 'food-1', name: 'Main Food Court', type: 'food', zone: 'concourse-n', icon: '🍔', waitTime: 12, queueLength: 45, isOpen: true, rating: 4.3, description: 'Burgers, fries, and beverages' },
  { id: 'food-2', name: 'South Kitchen', type: 'food', zone: 'concourse-s', icon: '🍕', waitTime: 8, queueLength: 28, isOpen: true, rating: 4.5, description: 'Pizza, pasta, and Italian cuisine' },
  { id: 'food-3', name: 'East Snack Bar', type: 'food', zone: 'concourse-e', icon: '🌮', waitTime: 5, queueLength: 12, isOpen: true, rating: 4.1, description: 'Quick bites and snacks' },
  { id: 'food-4', name: 'VIP Dining', type: 'food', zone: 'vip-north', icon: '🥂', waitTime: 3, queueLength: 6, isOpen: true, rating: 4.8, description: 'Premium dining experience' },
  { id: 'food-5', name: 'West Grill House', type: 'food', zone: 'concourse-w', icon: '🥩', waitTime: 15, queueLength: 52, isOpen: true, rating: 4.2, description: 'Grilled specialties' },

  { id: 'rest-1', name: 'North Restrooms A', type: 'restroom', zone: 'concourse-n', icon: '🚻', waitTime: 6, queueLength: 18, isOpen: true, rating: 3.8, description: 'Near Gate N1' },
  { id: 'rest-2', name: 'North Restrooms B', type: 'restroom', zone: 'concourse-n', icon: '🚻', waitTime: 10, queueLength: 32, isOpen: true, rating: 3.5, description: 'Near Section B' },
  { id: 'rest-3', name: 'South Restrooms', type: 'restroom', zone: 'concourse-s', icon: '🚻', waitTime: 4, queueLength: 10, isOpen: true, rating: 4.0, description: 'Near Gate S1' },
  { id: 'rest-4', name: 'East Restrooms', type: 'restroom', zone: 'concourse-e', icon: '🚻', waitTime: 3, queueLength: 8, isOpen: true, rating: 4.2, description: 'Near Section G' },
  { id: 'rest-5', name: 'West Restrooms', type: 'restroom', zone: 'concourse-w', icon: '🚻', waitTime: 7, queueLength: 22, isOpen: true, rating: 3.6, description: 'Near Gate W1' },

  { id: 'merch-1', name: 'Official Team Store', type: 'merchandise', zone: 'concourse-n', icon: '🏪', waitTime: 18, queueLength: 40, isOpen: true, rating: 4.4, description: 'Official jerseys and merchandise' },
  { id: 'merch-2', name: 'Fan Zone Shop', type: 'merchandise', zone: 'concourse-s', icon: '🎽', waitTime: 8, queueLength: 15, isOpen: true, rating: 4.0, description: 'Souvenirs and accessories' },

  { id: 'bar-1', name: 'North Bar', type: 'bar', zone: 'concourse-n', icon: '🍺', waitTime: 10, queueLength: 30, isOpen: true, rating: 4.1, description: 'Craft beers and beverages' },
  { id: 'bar-2', name: 'VIP Bar', type: 'bar', zone: 'vip-south', icon: '🍸', waitTime: 2, queueLength: 4, isOpen: true, rating: 4.9, description: 'Premium cocktails' },

  { id: 'med-1', name: 'Medical Center', type: 'medical', zone: 'concourse-w', icon: '🏥', waitTime: 0, queueLength: 0, isOpen: true, rating: 5.0, description: 'First aid and emergency care' },

  { id: 'atm-1', name: 'ATM North', type: 'atm', zone: 'concourse-n', icon: '🏧', waitTime: 5, queueLength: 8, isOpen: true, rating: 3.5, description: 'Cash withdrawal' },
  { id: 'atm-2', name: 'ATM South', type: 'atm', zone: 'concourse-s', icon: '🏧', waitTime: 3, queueLength: 4, isOpen: true, rating: 3.5, description: 'Cash withdrawal' },
];

export const gates: GateInfo[] = [
  { id: 'gate-n1', name: 'Gate N1', zone: 'north-a', isOpen: true, congestionLevel: 65, throughput: 120 },
  { id: 'gate-n2', name: 'Gate N2', zone: 'north-b', isOpen: true, congestionLevel: 45, throughput: 150 },
  { id: 'gate-s1', name: 'Gate S1', zone: 'south-a', isOpen: true, congestionLevel: 30, throughput: 180 },
  { id: 'gate-s2', name: 'Gate S2', zone: 'south-b', isOpen: true, congestionLevel: 80, throughput: 90 },
  { id: 'gate-e1', name: 'Gate E1', zone: 'east-a', isOpen: true, congestionLevel: 55, throughput: 130 },
  { id: 'gate-e2', name: 'Gate E2', zone: 'east-b', isOpen: true, congestionLevel: 40, throughput: 160 },
  { id: 'gate-w1', name: 'Gate W1', zone: 'west-a', isOpen: true, congestionLevel: 70, throughput: 100 },
  { id: 'gate-w2', name: 'Gate W2', zone: 'west-b', isOpen: false, congestionLevel: 0, throughput: 0 },
];

export function getOccupancyPercent(zone: StadiumZone): number {
  if (zone.capacity === 0) return 0;
  return Math.round((zone.currentOccupancy / zone.capacity) * 100);
}

export function getOccupancyColor(percent: number): string {
  if (percent < 50) return '#00D2A0';
  if (percent < 70) return '#55EFC4';
  if (percent < 80) return '#FBBF24';
  if (percent < 90) return '#FF9F43';
  return '#FF6B6B';
}

export function getOccupancyLabel(percent: number): string {
  if (percent < 50) return 'Low';
  if (percent < 70) return 'Moderate';
  if (percent < 85) return 'High';
  return 'Very High';
}
