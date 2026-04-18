// ============================================================
// Intelligent Navigation — Smart routing with crowd avoidance
// ============================================================

import { type SimulationState } from '../data/simulator';

interface Destination {
  id: string;
  name: string;
  icon: string;
  category: string;
}

const destinations: Destination[] = [
  { id: 'food-1', name: 'Main Food Court', icon: '🍔', category: 'Food' },
  { id: 'food-2', name: 'South Kitchen', icon: '🍕', category: 'Food' },
  { id: 'food-3', name: 'East Snack Bar', icon: '🌮', category: 'Food' },
  { id: 'food-5', name: 'West Grill House', icon: '🥩', category: 'Food' },
  { id: 'rest-1', name: 'North Restrooms A', icon: '🚻', category: 'Restroom' },
  { id: 'rest-3', name: 'South Restrooms', icon: '🚻', category: 'Restroom' },
  { id: 'rest-4', name: 'East Restrooms', icon: '🚻', category: 'Restroom' },
  { id: 'merch-1', name: 'Official Team Store', icon: '🏪', category: 'Shopping' },
  { id: 'med-1', name: 'Medical Center', icon: '🏥', category: 'Services' },
  { id: 'gate-s1', name: 'Gate S1 (Exit)', icon: '🚪', category: 'Exit' },
  { id: 'gate-n1', name: 'Gate N1 (Exit)', icon: '🚪', category: 'Exit' },
];

let selectedDest: Destination | null = null;

export function renderNavigation(container: HTMLElement, state: SimulationState): void {
  container.innerHTML = `
    <header class="section-header">
      <div>
        <h2 class="section-title">🧭 Smart Navigation</h2>
        <p class="section-desc">AI-optimized routing that avoids congested paths in real-time</p>
      </div>
    </header>

    <div class="grid-2-1">
      <!-- Main Navigation Panel -->
      <section aria-label="Route Selection">
        <!-- Route Planner -->
        <article class="card" style="margin-bottom: 20px;">
          <header class="card-header">
            <span class="card-title" role="heading" aria-level="3">📍 Route Planner</span>
          </header>
          <div class="card-body">
            <div style="display: flex; gap: 12px; margin-bottom: 20px;">
              <div style="flex: 1;">
                <label style="font-size: 12px; color: var(--color-text-tertiary); display: block; margin-bottom: 6px;">FROM</label>
                <div class="select-control">
                  <span>🎫</span>
                  <span>Your Seat — Section B, Row 14, Seat 23</span>
                </div>
              </div>
              <div style="display: flex; align-items: flex-end; padding-bottom: 6px; color: var(--color-text-tertiary); font-size: 20px;">→</div>
              <div style="flex: 1;">
                <label style="font-size: 12px; color: var(--color-text-tertiary); display: block; margin-bottom: 6px;">TO</label>
                <div class="select-control" id="dest-selector" style="cursor: pointer;">
                  <span>${selectedDest ? selectedDest.icon : '📍'}</span>
                  <span>${selectedDest ? selectedDest.name : 'Select destination...'}</span>
                </div>
              </div>
            </div>

            ${selectedDest ? renderRoute(selectedDest, state) : renderDestinationPicker()}
          </div>
        </article>

        <!-- Route Visualization -->
        ${selectedDest ? renderRouteMap(selectedDest, state) : ''}
      </section>

      <!-- Quick Destinations Panel -->
      <aside aria-label="Quick Links">
        <article class="card" style="margin-bottom: 20px;">
          <header class="card-header">
            <span class="card-title" role="heading" aria-level="3">⚡ Quick Navigate</span>
          </header>
          <nav class="card-body" style="display: flex; flex-direction: column; gap: 8px;" aria-label="Quick Nav List">
            ${destinations.slice(0, 8).map(dest => `
              <div class="nav-quick-dest" data-dest-id="${dest.id}" style="
                display: flex; align-items: center; gap: 12px; padding: 10px 12px;
                background: var(--color-bg-secondary); border-radius: var(--radius-md);
                cursor: pointer; transition: all 0.15s; border: 1px solid transparent;
              " onmouseover="this.style.borderColor='var(--color-border-active)'; this.style.background='rgba(108,92,231,0.08)'"
                 onmouseout="this.style.borderColor='transparent'; this.style.background='var(--color-bg-secondary)'">
                <span style="font-size: 18px;">${dest.icon}</span>
                <div style="flex: 1;">
                  <div style="font-size: 13px; font-weight: 500;">${dest.name}</div>
                  <div style="font-size: 11px; color: var(--color-text-tertiary);">${dest.category}</div>
                </div>
                <span style="font-size: 12px; color: var(--color-text-tertiary);">${getEstWalkTime(dest)} min</span>
              </div>
            `).join('')}
          </nav>
        </article>

        <article class="card">
          <header class="card-header">
            <span class="card-title" role="heading" aria-level="3">💡 Navigation Tips</span>
          </header>
          <div class="card-body" style="display: flex; flex-direction: column; gap: 10px;">
            <div style="padding: 10px; background: rgba(0, 210, 160, 0.06); border-radius: var(--radius-sm); border-left: 3px solid var(--color-success);">
              <div style="font-size: 12px; font-weight: 600; color: var(--color-success);">Least Crowded Path</div>
              <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">West Concourse currently has 40% less foot traffic than East.</div>
            </div>
            <div style="padding: 10px; background: rgba(251, 191, 36, 0.06); border-radius: var(--radius-sm); border-left: 3px solid var(--color-warning);">
              <div style="font-size: 12px; font-weight: 600; color: var(--color-warning);">Congestion Alert</div>
              <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">North Concourse near Gate N1 is congested. Use alternative routes.</div>
            </div>
            <div style="padding: 10px; background: rgba(0, 206, 255, 0.06); border-radius: var(--radius-sm); border-left: 3px solid var(--color-accent);">
              <div style="font-size: 12px; font-weight: 600; color: var(--color-accent);">Exit Planning</div>
              <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">Gate S1 is recommended for fastest exit after the match.</div>
            </div>
          </div>
        </article>
      </aside>
    </div>
  `;

  attachNavListeners(container, state);
}

function getEstWalkTime(dest: Destination): number {
  const times: Record<string, number> = {
    'food-1': 4, 'food-2': 6, 'food-3': 5, 'food-5': 7,
    'rest-1': 3, 'rest-3': 5, 'rest-4': 4,
    'merch-1': 5, 'med-1': 8, 'gate-s1': 6, 'gate-n1': 3
  };
  return times[dest.id] || 5;
}

function renderDestinationPicker(): string {
  const categories = [...new Set(destinations.map(d => d.category))];

  return `
    <div style="margin-top: 8px;">
      <div style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 12px;">Choose your destination:</div>
      ${categories.map(cat => `
        <div style="margin-bottom: 16px;">
          <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: var(--color-text-tertiary); margin-bottom: 8px;">${cat}</div>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${destinations.filter(d => d.category === cat).map(dest => `
              <button class="btn btn-secondary btn-sm dest-pick-btn" data-dest-id="${dest.id}" style="font-size: 12px;">
                ${dest.icon} ${dest.name}
              </button>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderRoute(dest: Destination, state: SimulationState): string {
  const walkTime = getEstWalkTime(dest);
  const distance = walkTime * 45; // rough meters
  const congestion = Math.floor(Math.random() * 40) + 20;
  const altTime = walkTime + 2;

  const steps = generateRouteSteps(dest);

  return `
    <div class="route-header" style="margin-bottom: 16px;">
      <div class="route-endpoints">
        <div class="route-point">
          <div class="route-point-dot" style="background: var(--color-primary);"></div>
          Section B, Seat 23
        </div>
        <span class="route-arrow">→</span>
        <div class="route-point">
          <div class="route-point-dot" style="background: var(--color-accent);"></div>
          ${dest.name}
        </div>
      </div>
      <button class="btn btn-sm btn-ghost" id="clear-route-btn">✕ Clear</button>
    </div>

    <div class="route-info" style="margin-bottom: 20px;">
      <div class="route-info-item">
        <span>🚶</span> <span class="route-info-value">${walkTime} min</span>
      </div>
      <div class="route-info-item">
        <span>📏</span> <span class="route-info-value">${distance}m</span>
      </div>
      <div class="route-info-item">
        <span style="color: ${congestion > 60 ? 'var(--color-danger)' : 'var(--color-success)'};">●</span>
        <span class="route-info-value">${congestion}%</span> <span>congestion</span>
      </div>
    </div>

    <!-- Route Steps -->
    <div class="route-steps">
      ${steps.map((step, i) => `
        <div class="route-step">
          <div class="route-step-dot ${i === 0 ? 'active' : ''}"></div>
          <span class="route-step-text">${step.text}</span>
          <span class="route-step-distance">${step.detail}</span>
        </div>
      `).join('')}
    </div>

    <!-- Alternative route -->
    <div style="margin-top: 16px; padding: 12px; background: rgba(251, 191, 36, 0.06); border: 1px solid rgba(251, 191, 36, 0.12); border-radius: var(--radius-md);">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div>
          <div style="font-size: 12px; font-weight: 600; color: var(--color-warning);">Alternative Route (Less Crowded)</div>
          <div style="font-size: 12px; color: var(--color-text-secondary);">Via West Concourse — ${altTime} min, but 35% less congestion</div>
        </div>
        <button class="btn btn-sm btn-secondary">Switch</button>
      </div>
    </div>
  `;
}

function generateRouteSteps(dest: Destination): { text: string; detail: string }[] {
  const base = [
    { text: 'Exit Row 14 to the right aisle', detail: '~15m' },
    { text: 'Take stairs down to North Concourse', detail: '~30m' },
  ];

  if (dest.category === 'Food' || dest.category === 'Shopping') {
    base.push(
      { text: 'Turn left on the concourse', detail: '~45m' },
      { text: 'Continue past Section A entrance', detail: '~60m' },
      { text: `Arrive at ${dest.name}`, detail: '📍 Arrived' }
    );
  } else if (dest.category === 'Restroom') {
    base.push(
      { text: 'Turn right, restrooms are ahead', detail: '~20m' },
      { text: `Arrive at ${dest.name}`, detail: '📍 Arrived' }
    );
  } else if (dest.category === 'Exit') {
    base.push(
      { text: 'Follow exit signs along the concourse', detail: '~80m' },
      { text: 'Proceed through the gate checkpoint', detail: '~30m' },
      { text: `Exit via ${dest.name}`, detail: '📍 Exit' }
    );
  } else {
    base.push(
      { text: 'Follow signs along West Concourse', detail: '~100m' },
      { text: `Arrive at ${dest.name}`, detail: '📍 Arrived' }
    );
  }

  return base;
}

// @ts-ignore: state needed for interface consistency
function renderRouteMap(dest: Destination, _state: SimulationState): string {
  return `
    <div class="card">
      <div class="card-header">
        <span class="card-title">🗺️ Route Overview</span>
        <span class="badge badge-success">Optimal Route</span>
      </div>
      <div class="card-body" style="padding: 0;">
        <svg viewBox="0 0 600 300" style="width: 100%; height: 280px; background: var(--color-bg-secondary); border-radius: 0 0 var(--radius-lg) var(--radius-lg);">
          <!-- Simplified stadium outline -->
          <ellipse cx="300" cy="150" rx="250" ry="130" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
          <ellipse cx="300" cy="150" rx="150" ry="80" fill="rgba(26, 94, 42, 0.3)" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>
          
          <!-- Start point (seat) -->
          <circle cx="300" cy="55" r="8" fill="var(--color-primary)" filter="url(#glow)">
            <animate attributeName="r" values="6;8;6" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="300" y="40" text-anchor="middle" fill="var(--color-text-secondary)" font-size="9" font-family="Inter, sans-serif">Your Seat</text>
          
          <!-- Animated route path -->
          <path d="M 300 63 L 300 85 Q 300 95 ${getDest(dest)}" 
            fill="none" stroke="var(--color-accent)" stroke-width="2" stroke-dasharray="6,4" opacity="0.8">
            <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1.5s" repeatCount="indefinite"/>
          </path>
          
          <!-- End point (destination) -->
          <circle cx="${getDestX(dest)}" cy="${getDestY(dest)}" r="8" fill="var(--color-accent)" filter="url(#glow)">
            <animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite"/>
          </circle>
          <text x="${getDestX(dest)}" y="${getDestY(dest) + 20}" text-anchor="middle" fill="var(--color-accent)" font-size="9" font-family="Inter, sans-serif">${dest.name}</text>

          <!-- Congestion zone overlay -->
          <circle cx="350" cy="80" r="25" fill="rgba(255,107,107,0.1)" stroke="rgba(255,107,107,0.2)" stroke-width="0.5"/>
          <text x="350" y="84" text-anchor="middle" fill="rgba(255,107,107,0.5)" font-size="7" font-family="Inter, sans-serif">Congested</text>

          <!-- Legend -->
          <circle cx="30" cy="270" r="4" fill="var(--color-primary)"/>
          <text x="40" y="273" fill="var(--color-text-tertiary)" font-size="8" font-family="Inter, sans-serif">Start</text>
          <circle cx="90" cy="270" r="4" fill="var(--color-accent)"/>
          <text x="100" y="273" fill="var(--color-text-tertiary)" font-size="8" font-family="Inter, sans-serif">Destination</text>
          <circle cx="170" cy="270" r="4" fill="rgba(255,107,107,0.4)"/>
          <text x="180" y="273" fill="var(--color-text-tertiary)" font-size="8" font-family="Inter, sans-serif">Congested Area</text>
        </svg>
      </div>
    </div>
  `;
}

function getDest(dest: Destination): string {
  const x = getDestX(dest);
  const y = getDestY(dest);
  return `${x} ${y}`;
}

function getDestX(dest: Destination): number {
  const map: Record<string, number> = {
    'food-1': 220, 'food-2': 300, 'food-3': 450, 'food-5': 150,
    'rest-1': 200, 'rest-3': 300, 'rest-4': 440,
    'merch-1': 380, 'med-1': 120, 'gate-s1': 200, 'gate-n1': 250
  };
  return map[dest.id] || 300;
}

function getDestY(dest: Destination): number {
  const map: Record<string, number> = {
    'food-1': 55, 'food-2': 240, 'food-3': 145, 'food-5': 145,
    'rest-1': 75, 'rest-3': 230, 'rest-4': 145,
    'merch-1': 60, 'med-1': 145, 'gate-s1': 250, 'gate-n1': 40
  };
  return map[dest.id] || 150;
}

function attachNavListeners(container: HTMLElement, state: SimulationState): void {
  // Destination picker buttons
  container.querySelectorAll('.dest-pick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const destId = (btn as HTMLElement).getAttribute('data-dest-id');
      selectedDest = destinations.find(d => d.id === destId) || null;
      renderNavigation(container, state);
    });
  });

  // Quick nav destinations
  container.querySelectorAll('.nav-quick-dest').forEach(el => {
    el.addEventListener('click', () => {
      const destId = (el as HTMLElement).getAttribute('data-dest-id');
      selectedDest = destinations.find(d => d.id === destId) || null;
      renderNavigation(container, state);
    });
  });

  // Clear route button
  const clearBtn = document.getElementById('clear-route-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      selectedDest = null;
      renderNavigation(container, state);
    });
  }
}
