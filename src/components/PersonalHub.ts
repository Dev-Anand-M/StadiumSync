// ============================================================
// Personal Experience Hub — Ticket, preferences, recommendations
// ============================================================

import { type SimulationState } from '../data/simulator';
import { stadiumConfig } from '../data/stadium';

export function renderPersonalHub(container: HTMLElement, state: SimulationState): void {
  container.innerHTML = `
    <div class="section-header">
      <div>
        <h2 class="section-title">🎫 Personal Hub</h2>
        <p class="section-desc">Your ticket, seat info, and personalized recommendations</p>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom: 20px;">
      <!-- Digital Ticket -->
      <div class="ticket-card">
        <div class="ticket-top">
          <div>
            <div class="ticket-event-name">${stadiumConfig.event.homeTeam} vs ${stadiumConfig.event.awayTeam}</div>
            <div class="ticket-event-date">📅 ${formatDate(stadiumConfig.event.date)} · 🕖 ${stadiumConfig.event.startTime} IST</div>
          </div>
          <div class="ticket-qr">
            ${generateQRPattern()}
          </div>
        </div>
        <div style="border-top: 1px dashed rgba(255,255,255,0.15); margin: 16px 0; position: relative;">
          <div style="position: absolute; left: -36px; top: -8px; width: 16px; height: 16px; background: var(--color-bg-primary); border-radius: 50%;"></div>
          <div style="position: absolute; right: -36px; top: -8px; width: 16px; height: 16px; background: var(--color-bg-primary); border-radius: 50%;"></div>
        </div>
        <div class="ticket-details">
          <div>
            <div class="ticket-detail-label">Section</div>
            <div class="ticket-detail-value">B</div>
          </div>
          <div>
            <div class="ticket-detail-label">Row</div>
            <div class="ticket-detail-value">14</div>
          </div>
          <div>
            <div class="ticket-detail-label">Seat</div>
            <div class="ticket-detail-value">23</div>
          </div>
          <div>
            <div class="ticket-detail-label">Gate</div>
            <div class="ticket-detail-value">N2</div>
          </div>
          <div>
            <div class="ticket-detail-label">Level</div>
            <div class="ticket-detail-value">Lower</div>
          </div>
          <div>
            <div class="ticket-detail-label">Category</div>
            <div class="ticket-detail-value" style="color: var(--color-warning);">Premium</div>
          </div>
        </div>
      </div>

      <!-- Profile Card -->
      <div class="card">
        <div class="card-body" style="display: flex; flex-direction: column; gap: 20px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 64px; height: 64px; border-radius: var(--radius-lg); background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 800; font-family: var(--font-display);">P</div>
            <div>
              <div style="font-family: var(--font-display); font-size: 20px; font-weight: 700;">PromptWarrior</div>
              <div style="font-size: 13px; color: var(--color-text-secondary);">Premium Member · Verified Fan</div>
              <div style="display: flex; gap: 6px; margin-top: 6px;">
                <span class="badge badge-warning">⭐ Season Pass</span>
                <span class="badge badge-success">✓ Checked In</span>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
            <div style="text-align: center; padding: 12px; background: var(--color-bg-secondary); border-radius: var(--radius-md);">
              <div style="font-family: var(--font-display); font-size: 24px; font-weight: 700; color: var(--color-primary-light);">12</div>
              <div style="font-size: 11px; color: var(--color-text-tertiary);">Events Attended</div>
            </div>
            <div style="text-align: center; padding: 12px; background: var(--color-bg-secondary); border-radius: var(--radius-md);">
              <div style="font-family: var(--font-display); font-size: 24px; font-weight: 700; color: var(--color-accent);">3</div>
              <div style="font-size: 11px; color: var(--color-text-tertiary);">This Season</div>
            </div>
            <div style="text-align: center; padding: 12px; background: var(--color-bg-secondary); border-radius: var(--radius-md);">
              <div style="font-family: var(--font-display); font-size: 24px; font-weight: 700; color: var(--color-success);">Gold</div>
              <div style="font-size: 11px; color: var(--color-text-tertiary);">Loyalty Tier</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Nearby Amenities -->
    <div class="card" style="margin-bottom: 20px;">
      <div class="card-header">
        <span class="card-title">📍 Nearest Amenities to Your Seat</span>
        <span class="badge badge-primary">Section B, Row 14</span>
      </div>
      <div class="card-body">
        <div class="grid-3">
          ${renderNearbyAmenities(state)}
        </div>
      </div>
    </div>

    <div class="grid-2">
      <!-- Personalized Recommendations -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">🤖 Personalized for You</span>
        </div>
        <div class="card-body" style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; gap: 14px; padding: 14px; background: var(--color-bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <span style="font-size: 28px;">🍔</span>
            <div>
              <div style="font-size: 14px; font-weight: 600;">Pre-order Your Halftime Snack</div>
              <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">Skip the line! Pre-order from Main Food Court and pick up during the break.</div>
              <button class="btn btn-sm btn-primary" style="margin-top: 8px;">Pre-Order Now</button>
            </div>
          </div>
          <div style="display: flex; gap: 14px; padding: 14px; background: var(--color-bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <span style="font-size: 28px;">🏃</span>
            <div>
              <div style="font-size: 14px; font-weight: 600;">Best Time to Visit Restroom</div>
              <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">Based on predicted crowd flow, the best window is in ~8 minutes (during play).</div>
              <button class="btn btn-sm btn-secondary" style="margin-top: 8px;">Set Reminder</button>
            </div>
          </div>
          <div style="display: flex; gap: 14px; padding: 14px; background: var(--color-bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <span style="font-size: 28px;">🚗</span>
            <div>
              <div style="font-size: 14px; font-weight: 600;">Exit Strategy Ready</div>
              <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">Gate S1 is your recommended exit. We'll alert you 5 min before match ends for fastest exit.</div>
              <button class="btn btn-sm btn-secondary" style="margin-top: 8px;">View Exit Plan</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Event Memory Timeline -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">📸 Your Event Timeline</span>
        </div>
        <div class="card-body" style="display: flex; flex-direction: column; gap: 16px;">
          ${renderTimeline()}
        </div>
      </div>
    </div>
  `;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function generateQRPattern(): string {
  const cells = [];
  for (let i = 0; i < 36; i++) {
    const isBlack = Math.random() > 0.4;
    cells.push(`<div class="ticket-qr-cell" style="background: ${isBlack ? '#222' : 'white'};"></div>`);
  }
  return cells.join('');
}

function renderNearbyAmenities(state: SimulationState): string {
  const nearby = [
    { name: 'North Restrooms A', icon: '🚻', distance: '45m', wait: state.facilities.find(f => f.id === 'rest-1')?.waitTime || 0, type: 'restroom' },
    { name: 'Main Food Court', icon: '🍔', distance: '90m', wait: state.facilities.find(f => f.id === 'food-1')?.waitTime || 0, type: 'food' },
    { name: 'North Bar', icon: '🍺', distance: '70m', wait: state.facilities.find(f => f.id === 'bar-1')?.waitTime || 0, type: 'bar' },
    { name: 'Official Team Store', icon: '🏪', distance: '110m', wait: state.facilities.find(f => f.id === 'merch-1')?.waitTime || 0, type: 'merchandise' },
    { name: 'ATM North', icon: '🏧', distance: '85m', wait: state.facilities.find(f => f.id === 'atm-1')?.waitTime || 0, type: 'atm' },
    { name: 'Gate N2 (Nearest)', icon: '🚪', distance: '60m', wait: 0, type: 'gate' },
  ];

  return nearby.map(item => {
    const waitColor = item.wait <= 5 ? 'var(--color-success)' : item.wait <= 12 ? 'var(--color-warning)' : 'var(--color-danger)';
    return `
      <div style="display: flex; align-items: center; gap: 12px; padding: 14px; background: var(--color-bg-secondary); border-radius: var(--radius-md); border: 1px solid var(--color-border); transition: all 0.15s; cursor: pointer;" 
        onmouseover="this.style.borderColor='var(--color-border-active)'"
        onmouseout="this.style.borderColor='var(--color-border)'">
        <span style="font-size: 24px;">${item.icon}</span>
        <div style="flex: 1;">
          <div style="font-size: 13px; font-weight: 600;">${item.name}</div>
          <div style="font-size: 11px; color: var(--color-text-tertiary);">${item.distance} away</div>
        </div>
        ${item.wait > 0 ? `
          <div style="text-align: right;">
            <div style="font-size: 14px; font-weight: 700; color: ${waitColor};">${item.wait}m</div>
            <div style="font-size: 10px; color: var(--color-text-tertiary);">wait</div>
          </div>
        ` : `
          <span class="badge badge-success" style="font-size: 10px;">Open</span>
        `}
      </div>
    `;
  }).join('');
}

function renderTimeline(): string {
  const events = [
    { time: '18:15', title: 'Arrived at Stadium', icon: '🏟️', desc: 'Entered via Gate N2' },
    { time: '18:30', title: 'Checked In', icon: '✅', desc: 'Seat verified — Section B, Row 14, Seat 23' },
    { time: '19:00', title: 'Pre-match Selfie', icon: '📸', desc: 'Captured at the Fan Zone' },
    { time: '19:42', title: 'First Boundary!', icon: '🏏', desc: 'Sharma\'s cover drive — what a shot!' },
    { time: '20:45', title: 'Snack Break', icon: '🍕', desc: 'Grabbed pizza from South Kitchen (5 min wait!)' },
    { time: '21:15', title: 'Century Partnership', icon: '💯', desc: '100-run stand — crowd went electric ⚡' },
    { time: 'Now', title: 'Watching 2nd Innings', icon: '👀', desc: 'Nail-biting chase underway!' },
  ];

  return events.map((evt, i) => `
    <div style="display: flex; gap: 14px; position: relative; ${i < events.length - 1 ? 'padding-bottom: 4px;' : ''}">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
        <div style="width: 32px; height: 32px; border-radius: 50%; background: ${i === events.length - 1 ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))' : 'var(--color-bg-tertiary)'}; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; ${i === events.length - 1 ? 'box-shadow: 0 0 12px var(--color-primary-glow);' : ''}">${evt.icon}</div>
        ${i < events.length - 1 ? '<div style="width: 2px; flex: 1; background: var(--color-border); border-radius: 99px;"></div>' : ''}
      </div>
      <div style="padding-bottom: 12px;">
        <div style="font-size: 10px; font-weight: 600; color: ${i === events.length - 1 ? 'var(--color-accent)' : 'var(--color-text-tertiary)'}; text-transform: uppercase; letter-spacing: 0.5px;">${evt.time}</div>
        <div style="font-size: 14px; font-weight: 600; margin-top: 2px;">${evt.title}</div>
        <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px;">${evt.desc}</div>
      </div>
    </div>
  `).join('');
}
