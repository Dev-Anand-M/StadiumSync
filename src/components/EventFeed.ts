// ============================================================
// Real-Time Event Feed & Alerts
// ============================================================

import { type SimulationState } from '../data/simulator';
import { matchEvents, upcomingActivities } from '../data/events';
import { stadiumConfig } from '../data/stadium';

export function renderEventFeed(container: HTMLElement, state: SimulationState): void {
  const unreadAlerts = state.alerts.filter(a => !a.read).length;

  container.innerHTML = `
    <div class="section-header">
      <div>
        <h2 class="section-title">📢 Live Event Feed</h2>
        <p class="section-desc">Match events, alerts, and real-time updates — ${stadiumConfig.event.homeTeam} vs ${stadiumConfig.event.awayTeam}</p>
      </div>
      <div style="display: flex; gap: 8px;">
        <span class="badge badge-success">● LIVE</span>
        ${unreadAlerts > 0 ? `<span class="badge badge-danger">${unreadAlerts} new alerts</span>` : ''}
      </div>
    </div>

    <!-- Live Score Banner -->
    <div class="card" style="margin-bottom: 20px; overflow: visible;">
      <div class="card-body" style="padding: 20px 28px;">
        ${renderScoreBanner()}
      </div>
    </div>

    <div class="grid-2-1">
      <!-- Match Timeline -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">🏏 Match Timeline</span>
          <span class="badge badge-primary">${matchEvents.length} events</span>
        </div>
        <div class="card-body" style="max-height: 500px; overflow-y: auto;">
          <div class="event-feed">
            ${matchEvents.slice().reverse().map(event => `
              <div class="event-item" style="animation: fadeInUp 0.3s ease-out;">
                <div class="event-item-time">${event.time}</div>
                <div class="event-item-dot" style="background: ${event.color};"></div>
                <div class="event-item-content">
                  <div class="event-item-title">${event.icon} ${event.title}</div>
                  <div class="event-item-desc">${event.description}</div>
                  <span class="event-item-tag" style="background: ${event.color}20; color: ${event.color};">${event.type}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Right Panel: Alerts + Upcoming -->
      <div>
        <!-- Live Alerts -->
        <div class="card" style="margin-bottom: 20px;">
          <div class="card-header">
            <span class="card-title">🔔 Live Alerts</span>
            <span style="font-size: 12px; color: var(--color-text-tertiary);">${state.alerts.length} total</span>
          </div>
          <div class="card-body" style="max-height: 260px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
            ${state.alerts.slice(0, 8).map(alert => `
              <div style="display: flex; gap: 10px; padding: 10px; border-radius: var(--radius-sm); background: ${getAlertBg(alert.type)}; border: 1px solid ${getAlertBorder(alert.type)}; ${!alert.read ? 'box-shadow: inset 3px 0 0 ' + getAlertColor(alert.type) + ';' : ''}">
                <span style="font-size: 16px; flex-shrink: 0;">${alert.icon}</span>
                <div style="flex: 1; min-width: 0;">
                  <div style="font-size: 12px; font-weight: 600; color: ${getAlertColor(alert.type)};">${alert.title}</div>
                  <div style="font-size: 11px; color: var(--color-text-secondary); margin-top: 2px;">${alert.message}</div>
                  <div style="font-size: 10px; color: var(--color-text-tertiary); margin-top: 4px;">${getTimeAgo(alert.timestamp)}</div>
                </div>
              </div>
            `).join('')}
            ${state.alerts.length === 0 ? '<div style="text-align: center; color: var(--color-text-tertiary); font-size: 13px; padding: 20px;">No alerts yet</div>' : ''}
          </div>
        </div>

        <!-- Upcoming -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">📅 Coming Up</span>
          </div>
          <div class="card-body" style="display: flex; flex-direction: column; gap: 10px;">
            ${upcomingActivities.map(act => `
              <div style="display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--color-border);">
                <span style="font-size: 16px;">${act.icon}</span>
                <div style="flex: 1;">
                  <div style="font-size: 13px; font-weight: 500;">${act.title}</div>
                </div>
                <span style="font-size: 12px; color: var(--color-text-tertiary); font-weight: 500;">${act.time}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function updateEventFeed(state: SimulationState): void {
  // Update alert badges
  const unread = state.alerts.filter(a => !a.read).length;
  const alertBadge = document.querySelector('.section-header .badge-danger');
  if (alertBadge) {
    alertBadge.textContent = `${unread} new alerts`;
    (alertBadge as HTMLElement).style.display = unread > 0 ? '' : 'none';
  }
}

function renderScoreBanner(): string {
  const event = stadiumConfig.event;
  return `
    <div style="display: flex; align-items: center; justify-content: center; gap: 40px;">
      <!-- Home Team -->
      <div style="text-align: center; flex: 1;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #1a5e8c, #0d3d5e); display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-size: 20px;">🏏</div>
        <div style="font-family: var(--font-display); font-size: 16px; font-weight: 700;">${event.homeTeam}</div>
        <div style="font-family: var(--font-display); font-size: 36px; font-weight: 800; color: var(--color-success); margin-top: 4px;">${event.currentScore.home}/4</div>
        <div style="font-size: 12px; color: var(--color-text-secondary);">20 overs</div>
      </div>

      <!-- VS / Match Info -->
      <div style="text-align: center;">
        <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: var(--color-text-tertiary); margin-bottom: 4px;">IPL FINALS 2026</div>
        <div style="font-family: var(--font-display); font-size: 24px; font-weight: 700; color: var(--color-primary-light);">VS</div>
        <div style="margin-top: 8px; display: flex; align-items: center; gap: 6px; justify-content: center;">
          <span style="width: 6px; height: 6px; background: var(--color-success); border-radius: 50%; animation: pulse-dot 2s infinite;"></span>
          <span style="font-size: 11px; color: var(--color-success); font-weight: 600;">LIVE — 2nd Innings</span>
        </div>
        <div style="font-size: 12px; color: var(--color-text-tertiary); margin-top: 4px;">${event.matchTime}</div>
      </div>

      <!-- Away Team -->
      <div style="text-align: center; flex: 1;">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #5e1a1a, #3d0d0d); display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-size: 20px;">🏏</div>
        <div style="font-family: var(--font-display); font-size: 16px; font-weight: 700;">${event.awayTeam}</div>
        <div style="font-family: var(--font-display); font-size: 36px; font-weight: 800; color: var(--color-danger); margin-top: 4px;">${event.currentScore.away}/3</div>
        <div style="font-size: 12px; color: var(--color-text-secondary);">${event.matchTime}</div>
      </div>
    </div>

    <!-- Required run rate bar -->
    <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--color-border);">
      <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px;">
        <span style="color: var(--color-text-secondary);">Chase Progress</span>
        <span style="color: var(--color-warning); font-weight: 600;">Need 45 off 22 balls · RRR: 12.27</span>
      </div>
      <div style="height: 8px; background: var(--color-bg-secondary); border-radius: 99px; overflow: hidden;">
        <div style="width: ${Math.round((142 / 187) * 100)}%; height: 100%; background: linear-gradient(90deg, var(--color-primary), var(--color-accent)); border-radius: 99px; transition: width 0.5s;"></div>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--color-text-tertiary); margin-top: 4px;">
        <span>0</span>
        <span>Target: 187</span>
      </div>
    </div>
  `;
}

function getAlertBg(type: string): string {
  const map: Record<string, string> = {
    info: 'rgba(0, 206, 255, 0.04)',
    warning: 'rgba(251, 191, 36, 0.04)',
    danger: 'rgba(255, 107, 107, 0.04)',
    success: 'rgba(0, 210, 160, 0.04)',
  };
  return map[type] || map.info;
}

function getAlertBorder(type: string): string {
  const map: Record<string, string> = {
    info: 'rgba(0, 206, 255, 0.1)',
    warning: 'rgba(251, 191, 36, 0.1)',
    danger: 'rgba(255, 107, 107, 0.1)',
    success: 'rgba(0, 210, 160, 0.1)',
  };
  return map[type] || map.info;
}

function getAlertColor(type: string): string {
  const map: Record<string, string> = {
    info: 'var(--color-accent)',
    warning: 'var(--color-warning)',
    danger: 'var(--color-danger)',
    success: 'var(--color-success)',
  };
  return map[type] || map.info;
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}
