// ============================================================
// Event Timeline Data
// ============================================================

export interface MatchEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'score' | 'wicket' | 'milestone' | 'break' | 'announcement' | 'entertainment';
  icon: string;
  color: string;
}

export const matchEvents: MatchEvent[] = [
  { id: 'e1', time: '14:00', title: 'Gates Open', description: 'All gates are now open for entry. Early bird merchandise discounts available.', type: 'announcement', icon: '🚪', color: '#6C5CE7' },
  { id: 'e2', time: '18:30', title: 'Pre-Match Entertainment', description: 'Live DJ performance at the South Fan Zone.', type: 'entertainment', icon: '🎵', color: '#00CEFF' },
  { id: 'e3', time: '19:00', title: 'Team Warm-ups', description: 'Both teams are now on the field for warm-up sessions.', type: 'announcement', icon: '🏃', color: '#A29BFE' },
  { id: 'e4', time: '19:25', title: 'Toss', description: 'Mumbai Strikers won the toss and elected to bat first.', type: 'milestone', icon: '🪙', color: '#FBBF24' },
  { id: 'e5', time: '19:30', title: 'Match Begins — 1st Innings', description: 'Mumbai Strikers batting. Opening pair: Sharma & Patel.', type: 'milestone', icon: '🏏', color: '#00D2A0' },
  { id: 'e6', time: '19:42', title: 'FOUR!', description: 'Sharma hits a beautiful cover drive to the boundary. Mumbai 28/0 (3.1 overs)', type: 'score', icon: '4️⃣', color: '#00D2A0' },
  { id: 'e7', time: '19:58', title: 'SIX!', description: 'Patel launches it over long-on! Massive hit! Mumbai 56/0 (5.4 overs)', type: 'score', icon: '6️⃣', color: '#55EFC4' },
  { id: 'e8', time: '20:10', title: 'Wicket!', description: 'Patel caught at deep mid-wicket. Excellent catch by Kumar. Mumbai 78/1 (8.2 overs)', type: 'wicket', icon: '🔴', color: '#FF6B6B' },
  { id: 'e9', time: '20:25', title: 'Powerplay Surge', description: 'Mumbai 110/1 after 10 overs. Run rate: 11.0', type: 'milestone', icon: '⚡', color: '#FBBF24' },
  { id: 'e10', time: '20:45', title: 'Strategic Timeout', description: '2-minute strategic timeout. Great time to grab snacks!', type: 'break', icon: '⏸️', color: '#94A3B8' },
  { id: 'e11', time: '20:48', title: 'Half-century!', description: 'Sharma reaches 50 off 32 balls. Outstanding knock!', type: 'milestone', icon: '🌟', color: '#FBBF24' },
  { id: 'e12', time: '21:05', title: 'Century Partnership', description: '100-run partnership between Sharma and Verma. Mumbai 156/1 (16 overs)', type: 'milestone', icon: '💯', color: '#00D2A0' },
  { id: 'e13', time: '21:15', title: 'Death Overs Carnage', description: 'Mumbai scoring at 14 RPO in the death overs. Final score: 186/4', type: 'score', icon: '🔥', color: '#FF9F43' },
  { id: 'e14', time: '21:25', title: 'Innings Break', description: '20-minute innings break. Concession lines expected to peak.', type: 'break', icon: '☕', color: '#94A3B8' },
  { id: 'e15', time: '21:45', title: '2nd Innings Begins', description: 'Delhi Dynamos chasing 187. Openers: Singh & Reddy.', type: 'milestone', icon: '🏏', color: '#6C5CE7' },
  { id: 'e16', time: '22:00', title: 'Wicket!', description: 'Singh bowled by a yorker! Delhi 22/1 (2.5 overs)', type: 'wicket', icon: '🔴', color: '#FF6B6B' },
  { id: 'e17', time: '22:20', title: 'Current', description: 'Delhi 142/3 (16.2 overs). Required rate: 12.1 per over.', type: 'milestone', icon: '📍', color: '#00CEFF' },
];

export const upcomingActivities = [
  { time: '22:30', title: 'Strategic Timeout', icon: '⏸️' },
  { time: '22:45', title: 'Match Result Expected', icon: '🏆' },
  { time: '23:00', title: 'Post-Match Ceremony', icon: '🎉' },
  { time: '23:15', title: 'Exit Guidance Active', icon: '🚶' },
  { time: '23:30', title: 'Stadium Closes', icon: '🔒' },
];

export interface CrowdFlowPrediction {
  time: string;
  concourse: number;
  food: number;
  restroom: number;
  exit: number;
}

export const crowdFlowPredictions: CrowdFlowPrediction[] = [
  { time: '14:00', concourse: 10, food: 5, restroom: 5, exit: 0 },
  { time: '15:00', concourse: 25, food: 10, restroom: 8, exit: 0 },
  { time: '17:00', concourse: 45, food: 20, restroom: 15, exit: 2 },
  { time: '18:00', concourse: 65, food: 35, restroom: 22, exit: 3 },
  { time: '19:00', concourse: 80, food: 40, restroom: 28, exit: 5 },
  { time: '19:30', concourse: 30, food: 15, restroom: 12, exit: 2 },
  { time: '20:00', concourse: 20, food: 12, restroom: 10, exit: 1 },
  { time: '20:45', concourse: 55, food: 45, restroom: 35, exit: 3 },
  { time: '21:25', concourse: 75, food: 60, restroom: 45, exit: 5 },
  { time: '21:45', concourse: 35, food: 25, restroom: 18, exit: 2 },
  { time: '22:00', concourse: 22, food: 15, restroom: 12, exit: 1 },
  { time: '22:45', concourse: 60, food: 30, restroom: 25, exit: 40 },
  { time: '23:00', concourse: 80, food: 10, restroom: 15, exit: 70 },
  { time: '23:30', concourse: 90, food: 5, restroom: 8, exit: 85 },
];
