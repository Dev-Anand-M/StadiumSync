// ============================================================
// Analytics Dashboard — Crowd flow, predictions, charts
// ============================================================

import { type SimulationState } from '../data/simulator';
import { crowdFlowPredictions } from '../data/events';
import { stadiumConfig, getOccupancyPercent, getOccupancyColor } from '../data/stadium';

export function renderAnalytics(container: HTMLElement, state: SimulationState): void {
  const totalCap = stadiumConfig.totalCapacity;
  const utilization = Math.round((state.totalAttendance / totalCap) * 100);

  container.innerHTML = `
    <header class="section-header">
      <div>
        <h2 class="section-title">📊 Analytics Dashboard</h2>
        <p class="section-desc">Crowd flow patterns, predictions, and venue insights</p>
      </div>
      <div style="display: flex; gap: 8px;" aria-live="polite">
        <span class="badge badge-primary">Real-Time Analytics</span>
      </div>
    </header>

    <!-- Top Stats -->
    <section class="stats-grid" aria-live="polite">
      <div class="stat-card" style="--stat-color: var(--color-primary);">
        <div class="stat-icon" style="background: rgba(108, 92, 231, 0.12); color: var(--color-primary-light);">🏟️</div>
        <div class="stat-value">${utilization}%</div>
        <div class="stat-label">Venue Utilization</div>
        <div class="stat-trend ${utilization > 80 ? 'down' : 'up'}">${utilization > 80 ? '⚠ Near capacity' : '✓ Comfortable'}</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-accent);">
        <div class="stat-icon" style="background: rgba(0, 206, 255, 0.12); color: var(--color-accent);">👥</div>
        <div class="stat-value">${(state.totalAttendance / 1000).toFixed(1)}k</div>
        <div class="stat-label">Current Attendance</div>
        <div class="stat-trend ${state.crowdTrend === 'increasing' ? 'up' : state.crowdTrend === 'decreasing' ? 'down' : 'up'}">
          ${state.crowdTrend === 'increasing' ? '↑ Increasing' : state.crowdTrend === 'decreasing' ? '↓ Decreasing' : '→ Stable'}
        </div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-success);">
        <div class="stat-icon" style="background: rgba(0, 210, 160, 0.12); color: var(--color-success);">🚶</div>
        <div class="stat-value">${getConcourseTraffic(state)}</div>
        <div class="stat-label">Concourse Traffic</div>
        <div class="stat-trend up">People in transit</div>
      </div>
      <div class="stat-card" style="--stat-color: var(--color-warning);">
        <div class="stat-icon" style="background: rgba(251, 191, 36, 0.12); color: var(--color-warning);">⏱️</div>
        <div class="stat-value">${getAvgWait(state)}<span style="font-size: 14px;"> min</span></div>
        <div class="stat-label">Avg Queue Wait</div>
        <div class="stat-trend ${getAvgWait(state) > 10 ? 'down' : 'up'}">${getAvgWait(state) > 10 ? '↑ Above normal' : '↓ Below normal'}</div>
      </div>
    </section>

    <div class="grid-2" style="margin-bottom: 20px;">
      <!-- Crowd Flow Prediction Chart -->
      <article class="card">
        <header class="card-header">
          <span class="card-title" role="heading" aria-level="3">📈 Crowd Flow Predictions</span>
          <nav class="tabs" style="transform: scale(0.85); transform-origin: right;" aria-label="Prediction Scope">
            <button class="tab active" aria-pressed="true">Concourse</button>
            <button class="tab" aria-pressed="false">Food</button>
            <button class="tab" aria-pressed="false">Exit</button>
          </nav>
        </header>
        <div class="card-body">
          <div class="chart-container" style="height: 220px;">
            ${renderBarChart(crowdFlowPredictions)}
          </div>
        </div>
      </article>

      <!-- Capacity Donut -->
      <article class="card">
        <header class="card-header">
          <span class="card-title" role="heading" aria-level="3">🎯 Zone Capacity Overview</span>
        </header>
        <div class="card-body">
          <div style="display: flex; align-items: center; gap: 32px;">
            <div class="donut-container" aria-hidden="true">
              ${renderDonutChart(utilization)}
              <div class="donut-center-text">
                <div class="donut-value">${utilization}%</div>
                <div class="donut-label">Capacity</div>
              </div>
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 12px;" aria-live="polite">
              ${renderCapacityBreakdown(state)}
            </div>
          </div>
        </div>
      </article>
    </div>

    <div class="grid-2">
      <!-- Heatmap Summary Table -->
      <article class="card">
        <header class="card-header">
          <span class="card-title" role="heading" aria-level="3">🔥 Section Heatmap Summary</span>
        </header>
        <div class="card-body">
          ${renderHeatmapTable(state)}
        </div>
      </article>

      <div style="display: flex; flex-direction: column; gap: 20px;">
        <!-- AI Inference -->
        <article class="card">
          <header class="card-header">
            <span class="card-title" role="heading" aria-level="3">✨ Gemini AI Insights</span>
          </header>
          <div class="card-body" id="gemini-insight-box" aria-live="polite">
            <span style="color: var(--color-text-secondary);">Analyzing live stadium telemetry...</span>
          </div>
        </article>

        <!-- Facility Performance -->
        <article class="card">
          <header class="card-header">
            <span class="card-title" role="heading" aria-level="3">⭐ Facility Performance</span>
          </header>
          <div class="card-body">
            ${renderFacilityPerformance(state)}
          </div>
        </article>
      </div>
    </div>
  `;

  setTimeout(async () => {
    const box = document.getElementById('gemini-insight-box');
    if (box) {
      const { getGeminiInsight } = await import('../utils/ai');
      box.innerHTML = await getGeminiInsight(state);
    }
  }, 50);
}

function getConcourseTraffic(state: SimulationState): string {
  const concourses = state.zones.filter(z => z.type === 'concourse');
  const total = concourses.reduce((s, z) => s + z.currentOccupancy, 0);
  return total.toLocaleString();
}

function getAvgWait(state: SimulationState): number {
  const open = state.facilities.filter(f => f.isOpen);
  return Math.round(open.reduce((s, f) => s + f.waitTime, 0) / open.length);
}

function renderBarChart(data: typeof crowdFlowPredictions): string {
  const maxVal = Math.max(...data.map(d => d.concourse));
  const currentTimeIndex = 10; // approximate current time position

  return `
    <div class="bar-chart">
      ${data.map((d, i) => {
        const height = Math.max((d.concourse / maxVal) * 100, 5);
        const isCurrent = i === currentTimeIndex;
        const color = isCurrent
          ? 'linear-gradient(180deg, var(--color-accent), var(--color-primary))'
          : d.concourse > 60
            ? 'linear-gradient(180deg, rgba(255,107,107,0.7), rgba(255,107,107,0.3))'
            : 'linear-gradient(180deg, rgba(108,92,231,0.6), rgba(108,92,231,0.2))';

        return `
          <div class="bar-item">
            <div class="bar" style="height: ${height}%; background: ${color}; ${isCurrent ? 'box-shadow: 0 0 12px var(--color-accent-glow);' : ''}" title="${d.concourse}%"></div>
            <span class="bar-label" style="${isCurrent ? 'color: var(--color-accent); font-weight: 700;' : ''}">${d.time.replace(':00', '')}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderDonutChart(percent: number): string {
  const circumference = 2 * Math.PI * 60;
  const dash = (percent / 100) * circumference;
  const gap = circumference - dash;

  return `
    <svg width="160" height="160" viewBox="0 0 160 160">
      <!-- Background circle -->
      <circle cx="80" cy="80" r="60" fill="none" stroke="var(--color-bg-secondary)" stroke-width="14"/>
      <!-- Progress circle -->
      <circle cx="80" cy="80" r="60" fill="none" 
        stroke="url(#donutGrad)" stroke-width="14" 
        stroke-dasharray="${dash} ${gap}" 
        stroke-linecap="round"
        transform="rotate(-90 80 80)"
        style="transition: stroke-dasharray 0.5s ease;">
      </circle>
      <defs>
        <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color: var(--color-primary)"/>
          <stop offset="100%" style="stop-color: var(--color-accent)"/>
        </linearGradient>
      </defs>
    </svg>
  `;
}

function renderCapacityBreakdown(state: SimulationState): string {
  const categories = [
    { label: 'Lower Bowl', zones: state.zones.filter(z => z.level === 'Lower'), color: 'var(--color-primary)' },
    { label: 'Upper Bowl', zones: state.zones.filter(z => z.level === 'Upper'), color: 'var(--color-accent)' },
    { label: 'VIP Areas', zones: state.zones.filter(z => z.type === 'vip'), color: 'var(--color-warning)' },
    { label: 'Concourses', zones: state.zones.filter(z => z.type === 'concourse'), color: 'var(--color-success)' },
  ];

  return categories.map(cat => {
    const totalCap = cat.zones.reduce((s, z) => s + z.capacity, 0);
    const totalOcc = cat.zones.reduce((s, z) => s + z.currentOccupancy, 0);
    const percent = totalCap > 0 ? Math.round((totalOcc / totalCap) * 100) : 0;

    return `
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
          <span style="color: var(--color-text-secondary);">${cat.label}</span>
          <span style="font-weight: 600; color: ${cat.color};">${percent}%</span>
        </div>
        <div style="height: 4px; background: var(--color-bg-secondary); border-radius: 99px; overflow: hidden;">
          <div style="width: ${percent}%; height: 100%; background: ${cat.color}; border-radius: 99px; transition: width 0.5s;"></div>
        </div>
      </div>
    `;
  }).join('');
}

function renderHeatmapTable(state: SimulationState): string {
  const seatZones = state.zones.filter(z => z.type === 'seating' || z.type === 'vip').sort((a, b) => {
    return getOccupancyPercent(b) - getOccupancyPercent(a);
  });

  return `
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <thead>
          <tr style="border-bottom: 1px solid var(--color-border);">
            <th style="text-align: left; padding: 8px 12px; color: var(--color-text-tertiary); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Section</th>
            <th style="text-align: left; padding: 8px 12px; color: var(--color-text-tertiary); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Level</th>
            <th style="text-align: right; padding: 8px 12px; color: var(--color-text-tertiary); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Occupancy</th>
            <th style="text-align: right; padding: 8px 12px; color: var(--color-text-tertiary); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${seatZones.map(zone => {
            const pct = getOccupancyPercent(zone);
            const color = getOccupancyColor(pct);
            const status = pct > 90 ? 'Almost Full' : pct > 75 ? 'Filling Up' : pct > 50 ? 'Comfortable' : 'Spacious';
            return `
              <tr style="border-bottom: 1px solid var(--color-border);">
                <td style="padding: 10px 12px; font-weight: 500;">${zone.name}</td>
                <td style="padding: 10px 12px; color: var(--color-text-secondary);">${zone.level || 'VIP'}</td>
                <td style="padding: 10px 12px; text-align: right;">
                  <div style="display: flex; align-items: center; gap: 8px; justify-content: flex-end;">
                    <div style="width: 50px; height: 4px; background: var(--color-bg-secondary); border-radius: 99px; overflow: hidden;">
                      <div style="width: ${pct}%; height: 100%; background: ${color}; border-radius: 99px;"></div>
                    </div>
                    <span style="font-weight: 600; color: ${color}; min-width: 35px; text-align: right;">${pct}%</span>
                  </div>
                </td>
                <td style="padding: 10px 12px; text-align: right;">
                  <span class="badge" style="background: ${color}15; color: ${color};">${status}</span>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderFacilityPerformance(state: SimulationState): string {
  const sorted = [...state.facilities].sort((a, b) => a.waitTime - b.waitTime);

  return `
    <div style="display: flex; flex-direction: column; gap: 10px;">
      ${sorted.slice(0, 8).map((fac, i) => `
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 12px; font-weight: 700; color: ${i < 3 ? 'var(--color-success)' : 'var(--color-text-tertiary)'}; min-width: 20px;">#${i + 1}</span>
          <span style="font-size: 16px;">${fac.icon}</span>
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${fac.name}</div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 14px; font-weight: 700; color: ${fac.waitTime <= 5 ? 'var(--color-success)' : fac.waitTime <= 12 ? 'var(--color-warning)' : 'var(--color-danger)'};">${fac.waitTime}m</span>
          </div>
          <div style="display: flex; gap: 2px;">
            ${Array.from({ length: 5 }, (_, s) => `
              <span style="color: ${s < Math.round(fac.rating) ? '#FBBF24' : 'var(--color-bg-secondary)'}; font-size: 10px;">★</span>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
