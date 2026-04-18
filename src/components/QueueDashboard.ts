// ============================================================
// Smart Queue Dashboard — Wait times, predictions, recommendations
// ============================================================

import { type SimulationState } from '../data/simulator';
import { type FacilityInfo } from '../data/stadium';

let activeFilter = 'all';

export function renderQueueDashboard(container: HTMLElement, state: SimulationState): void {
  container.innerHTML = `
    <header class="section-header">
      <div>
        <h2 class="section-title">⏱️ Smart Queue Dashboard</h2>
        <p class="section-desc">Real-time wait times with AI-predicted optimal visit windows</p>
      </div>
      <nav class="tabs" id="queue-filter-tabs" aria-label="Facility Categories">
        <button class="tab ${activeFilter === 'all' ? 'active' : ''}" data-filter="all" aria-pressed="${activeFilter === 'all'}">All</button>
        <button class="tab ${activeFilter === 'food' ? 'active' : ''}" data-filter="food" aria-pressed="${activeFilter === 'food'}">🍔 Food</button>
        <button class="tab ${activeFilter === 'restroom' ? 'active' : ''}" data-filter="restroom" aria-pressed="${activeFilter === 'restroom'}">🚻 Restrooms</button>
        <button class="tab ${activeFilter === 'merchandise' ? 'active' : ''}" data-filter="merchandise" aria-pressed="${activeFilter === 'merchandise'}">🏪 Merch</button>
        <button class="tab ${activeFilter === 'bar' ? 'active' : ''}" data-filter="bar" aria-pressed="${activeFilter === 'bar'}">🍺 Bars</button>
      </nav>
    </header>

    <!-- Quick Stats -->
    <section class="stats-grid" style="margin-bottom: 20px;" aria-live="polite">
      ${renderQueueStats(state)}
    </section>

    <!-- Queue Cards Grid -->
    <section class="grid-3" id="queue-cards-grid" aria-live="polite">
      ${renderQueueCards(state)}
    </section>

    <!-- AI Recommendation -->
    <article class="card" style="margin-top: 20px;">
      <header class="card-header">
        <span class="card-title" role="heading" aria-level="3">🤖 AI Recommendations</span>
        <span class="badge badge-primary">Powered by StadiumSync AI</span>
      </header>
      <div class="card-body">
        ${renderRecommendations(state)}
      </div>
    </article>
  `;

  attachQueueListeners(container, state);
}

export function updateQueueDashboard(state: SimulationState): void {
  const grid = document.getElementById('queue-cards-grid');
  if (grid) {
    grid.innerHTML = renderQueueCards(state);
  }
}

function renderQueueStats(state: SimulationState): string {
  const facilities = state.facilities.filter(f => f.isOpen);
  const avgWait = Math.round(facilities.reduce((s, f) => s + f.waitTime, 0) / facilities.length);
  const shortest = facilities.reduce((min, f) => f.waitTime < min.waitTime ? f : min, facilities[0]);
  const longest = facilities.reduce((max, f) => f.waitTime > max.waitTime ? f : max, facilities[0]);
  const totalInQueue = facilities.reduce((s, f) => s + f.queueLength, 0);

  return `
    <div class="stat-card" style="--stat-color: var(--color-accent);">
      <div class="stat-icon" style="background: rgba(0, 206, 255, 0.12); color: var(--color-accent);">⏱️</div>
      <div class="stat-value" style="color: var(--color-accent);">${avgWait}<span style="font-size: 14px; color: var(--color-text-secondary);"> min</span></div>
      <div class="stat-label">Avg Wait Time</div>
      <div class="stat-trend ${avgWait > 10 ? 'down' : 'up'}">
        ${avgWait > 10 ? '↑ Above average' : '↓ Below average'}
      </div>
    </div>
    <div class="stat-card" style="--stat-color: var(--color-success);">
      <div class="stat-icon" style="background: rgba(0, 210, 160, 0.12); color: var(--color-success);">⚡</div>
      <div class="stat-value" style="color: var(--color-success);">${shortest.waitTime}<span style="font-size: 14px; color: var(--color-text-secondary);"> min</span></div>
      <div class="stat-label">Shortest Wait</div>
      <div class="stat-trend up">${shortest.icon} ${shortest.name}</div>
    </div>
    <div class="stat-card" style="--stat-color: var(--color-danger);">
      <div class="stat-icon" style="background: rgba(255, 107, 107, 0.12); color: var(--color-danger);">🐌</div>
      <div class="stat-value" style="color: var(--color-danger);">${longest.waitTime}<span style="font-size: 14px; color: var(--color-text-secondary);"> min</span></div>
      <div class="stat-label">Longest Wait</div>
      <div class="stat-trend down">${longest.icon} ${longest.name}</div>
    </div>
    <div class="stat-card" style="--stat-color: var(--color-warning);">
      <div class="stat-icon" style="background: rgba(251, 191, 36, 0.12); color: var(--color-warning);">👥</div>
      <div class="stat-value" style="color: var(--color-warning);">${totalInQueue}</div>
      <div class="stat-label">Total In Queues</div>
      <div class="stat-trend ${totalInQueue > 300 ? 'down' : 'up'}">
        ${totalInQueue > 300 ? '↑ High volume' : '↓ Normal volume'}
      </div>
    </div>
  `;
}

function renderQueueCards(state: SimulationState): string {
  let filtered = state.facilities.filter(f => f.isOpen);
  if (activeFilter !== 'all') {
    filtered = filtered.filter(f => f.type === activeFilter);
  }

  return filtered.map(fac => renderSingleQueueCard(fac)).join('');
}

function renderSingleQueueCard(fac: FacilityInfo): string {
  const statusLevel = fac.waitTime <= 5 ? 'low' : fac.waitTime <= 12 ? 'medium' : 'high';
  const statusLabel = fac.waitTime <= 5 ? 'Short Wait' : fac.waitTime <= 12 ? 'Moderate' : 'Long Wait';
  const barColor = fac.waitTime <= 5 ? 'var(--color-success)' : fac.waitTime <= 12 ? 'var(--color-warning)' : 'var(--color-danger)';
  const barWidth = Math.min((fac.waitTime / 30) * 100, 100);
  const improving = Math.random() > 0.5;
  const optimalIn = Math.floor(Math.random() * 20) + 5;

  return `
    <div class="queue-card">
      <div class="queue-card-header">
        <div class="queue-card-icon" style="background: rgba(108, 92, 231, 0.1);">${fac.icon}</div>
        <span class="queue-card-status ${statusLevel}">${statusLabel}</span>
      </div>
      <div class="queue-card-name">${fac.name}</div>
      <div class="queue-card-location">${fac.description}</div>
      <div class="queue-wait-time">
        <span class="queue-wait-value" style="color: ${barColor};">${fac.waitTime}</span>
        <span class="queue-wait-unit">min wait</span>
      </div>
      <div class="queue-bar-container">
        <div class="queue-bar" style="width: ${barWidth}%; background: ${barColor};"></div>
      </div>
      <div class="queue-meta">
        <span>${fac.queueLength} people in line</span>
        <span class="queue-trend ${improving ? 'improving' : 'worsening'}">
          ${improving ? '↓ Improving' : '↑ Growing'}
        </span>
      </div>
      <div class="queue-recommendation">
        💡 Best time: in ~${optimalIn} min
      </div>
    </div>
  `;
}

function renderRecommendations(state: SimulationState): string {
  const food = state.facilities.filter(f => f.type === 'food' && f.isOpen);
  const shortest = food.reduce((min, f) => f.waitTime < min.waitTime ? f : min, food[0]);
  const restrooms = state.facilities.filter(f => f.type === 'restroom' && f.isOpen);
  const shortRest = restrooms.reduce((min, f) => f.waitTime < min.waitTime ? f : min, restrooms[0]);

  return `
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(0, 210, 160, 0.06); border: 1px solid rgba(0, 210, 160, 0.12); border-radius: var(--radius-md);">
        <span style="font-size: 20px;">🍽️</span>
        <div>
          <div style="font-size: 14px; font-weight: 600; color: var(--color-success);">Best Food Option Right Now</div>
          <div style="font-size: 13px; color: var(--color-text-secondary);">${shortest.icon} ${shortest.name} — only ${shortest.waitTime} min wait (${shortest.queueLength} in line)</div>
        </div>
        <button class="btn btn-sm btn-secondary" style="margin-left: auto;">Navigate →</button>
      </div>
      <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(0, 206, 255, 0.06); border: 1px solid rgba(0, 206, 255, 0.12); border-radius: var(--radius-md);">
        <span style="font-size: 20px;">🚻</span>
        <div>
          <div style="font-size: 14px; font-weight: 600; color: var(--color-accent);">Nearest Low-Wait Restroom</div>
          <div style="font-size: 13px; color: var(--color-text-secondary);">${shortRest.icon} ${shortRest.name} — ${shortRest.waitTime} min wait</div>
        </div>
        <button class="btn btn-sm btn-secondary" style="margin-left: auto;">Navigate →</button>
      </div>
      <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(251, 191, 36, 0.06); border: 1px solid rgba(251, 191, 36, 0.12); border-radius: var(--radius-md);">
        <span style="font-size: 20px;">⏰</span>
        <div>
          <div style="font-size: 14px; font-weight: 600; color: var(--color-warning);">Pro Tip</div>
          <div style="font-size: 13px; color: var(--color-text-secondary);">Avoid food courts during the strategic timeout (~5 min). Wait times spike by 60% during breaks.</div>
        </div>
      </div>
    </div>
  `;
}

function attachQueueListeners(container: HTMLElement, state: SimulationState): void {
  container.querySelectorAll('#queue-filter-tabs .tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeFilter = (tab as HTMLElement).getAttribute('data-filter') || 'all';
      renderQueueDashboard(container, state);
    });
  });
}
