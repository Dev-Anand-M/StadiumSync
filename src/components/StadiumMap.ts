// ============================================================
// Interactive Stadium Map with Live Crowd Heatmap
// ============================================================

import { type SimulationState } from '../data/simulator';
import { getOccupancyPercent, getOccupancyColor, getOccupancyLabel, stadiumConfig } from '../data/stadium';

let tooltipEl: HTMLElement | null = null;

export function renderStadiumMap(container: HTMLElement, state: SimulationState): void {
  container.innerHTML = `
    <div class="section-header">
      <div>
        <h2 class="section-title">🗺️ Live Stadium Map</h2>
        <p class="section-desc">Real-time crowd density visualization — ${stadiumConfig.name}</p>
      </div>
      <div style="display: flex; gap: 8px; align-items: center;">
        <span class="badge badge-success">● LIVE</span>
        <span class="badge badge-primary">${state.totalAttendance.toLocaleString()} / ${stadiumConfig.totalCapacity.toLocaleString()}</span>
      </div>
    </div>
    <div class="card" style="overflow: visible;">
      <div class="stadium-map-container" id="stadium-map-svg-container">
        ${generateStadiumSVG(state)}
        <div class="map-legend">
          <span style="font-size: 11px; color: var(--color-text-secondary);">Crowd Density:</span>
          <span style="font-size: 10px; color: var(--heat-low);">Low</span>
          <div class="legend-gradient"></div>
          <span style="font-size: 10px; color: var(--heat-critical);">High</span>
        </div>
        <div class="map-tooltip" id="map-tooltip"></div>
      </div>
    </div>

    <div class="grid-2" style="margin-top: 20px;">
      <div class="card">
        <div class="card-header">
          <span class="card-title">🚪 Gate Status</span>
        </div>
        <div class="card-body">
          ${renderGateStatus(state)}
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">📊 Section Occupancy</span>
        </div>
        <div class="card-body">
          ${renderSectionOccupancy(state)}
        </div>
      </div>
    </div>
  `;

  tooltipEl = document.getElementById('map-tooltip');
  attachMapListeners(state);
}

export function updateStadiumMap(state: SimulationState): void {
  // Update SVG zone colors
  state.zones.forEach(zone => {
    const el = document.getElementById(`zone-${zone.id}`);
    if (el) {
      const percent = getOccupancyPercent(zone);
      const color = getOccupancyColor(percent);
      el.setAttribute('fill', color);
      el.setAttribute('fill-opacity', '0.6');
    }
  });

  // Update gate status
  const gateContainer = document.querySelector('.card-body');
  if (gateContainer && gateContainer.parentElement?.querySelector('.card-title')?.textContent?.includes('Gate')) {
    // Just update inline — re-render is handled by the main loop
  }

  // Update attendance badge
  const badgePrimary = document.querySelector('.badge-primary');
  if (badgePrimary) {
    badgePrimary.textContent = `${state.totalAttendance.toLocaleString()} / ${stadiumConfig.totalCapacity.toLocaleString()}`;
  }
}

function generateStadiumSVG(state: SimulationState): string {
  const zones = state.zones;

  return `
    <svg viewBox="0 0 900 500" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <radialGradient id="fieldGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style="stop-color:#1a5e2a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0d3d18;stop-opacity:1" />
        </radialGradient>
        <linearGradient id="trackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2a2a3e;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:0.8" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="900" height="500" fill="#0a0e1a" rx="16"/>
      
      <!-- Outer Stadium Shape (Oval) -->
      <ellipse cx="450" cy="250" rx="380" ry="220" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="2"/>
      
      <!-- Running Track -->
      <ellipse cx="450" cy="250" rx="280" ry="170" fill="url(#trackGrad)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      
      <!-- Playing Field -->
      <ellipse cx="450" cy="250" rx="200" ry="120" fill="url(#fieldGrad)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      
      <!-- Cricket Pitch -->
      <rect x="430" y="205" width="40" height="90" rx="3" fill="#c4a55a" opacity="0.7"/>
      <line x1="450" y1="215" x2="450" y2="285" stroke="white" stroke-width="0.5" opacity="0.3"/>
      
      <!-- Wickets -->
      <rect x="446" y="215" width="8" height="3" fill="#8B7355" rx="1"/>
      <rect x="446" y="282" width="8" height="3" fill="#8B7355" rx="1"/>
      
      <!-- Field label -->
      <text x="450" y="253" class="stadium-label" fill="rgba(255,255,255,0.5)" font-size="10">PLAYING FIELD</text>

      <!-- North Stand sections -->
      ${renderStandArc(zones.find(z => z.id === 'north-a')!, 200, 45, 80, 45, -40, state)}
      ${renderStandArc(zones.find(z => z.id === 'north-b')!, 380, 30, 140, 50, 0, state)}
      ${renderStandArc(zones.find(z => z.id === 'north-c')!, 560, 45, 80, 45, 40, state)}

      <!-- South Stand sections -->
      ${renderStandArc(zones.find(z => z.id === 'south-a')!, 200, 415, 80, 45, 40, state)}
      ${renderStandArc(zones.find(z => z.id === 'south-b')!, 380, 425, 140, 50, 0, state)}
      ${renderStandArc(zones.find(z => z.id === 'south-c')!, 560, 415, 80, 45, -40, state)}

      <!-- East Stand -->
      ${renderStandRect(zones.find(z => z.id === 'east-a')!, 690, 100, 55, 130, state)}
      ${renderStandRect(zones.find(z => z.id === 'east-b')!, 690, 270, 55, 130, state)}

      <!-- West Stand -->
      ${renderStandRect(zones.find(z => z.id === 'west-a')!, 155, 100, 55, 130, state)}
      ${renderStandRect(zones.find(z => z.id === 'west-b')!, 155, 270, 55, 130, state)}

      <!-- VIP Zones -->
      ${renderVIPZone(zones.find(z => z.id === 'vip-north')!, 350, 88, 200, 22, state)}
      ${renderVIPZone(zones.find(z => z.id === 'vip-south')!, 350, 395, 200, 22, state)}

      <!-- Concourses -->
      ${renderConcourse(zones.find(z => z.id === 'concourse-n')!, 220, 75, 460, 10, state)}
      ${renderConcourse(zones.find(z => z.id === 'concourse-s')!, 220, 420, 460, 10, state)}
      ${renderConcourse(zones.find(z => z.id === 'concourse-e')!, 750, 110, 10, 280, state)}
      ${renderConcourse(zones.find(z => z.id === 'concourse-w')!, 142, 110, 10, 280, state)}

      <!-- Gate markers -->
      ${renderGateMarker('gate-n1', 240, 68, state)}
      ${renderGateMarker('gate-n2', 450, 56, state)}
      ${renderGateMarker('gate-s1', 240, 437, state)}
      ${renderGateMarker('gate-s2', 450, 447, state)}
      ${renderGateMarker('gate-e1', 758, 165, state)}
      ${renderGateMarker('gate-e2', 758, 335, state)}
      ${renderGateMarker('gate-w1', 133, 165, state)}
      ${renderGateMarker('gate-w2', 133, 335, state)}

      <!-- Facility icons -->
      ${renderFacilityIcon('🍔', 310, 70, 'Main Food Court')}
      ${renderFacilityIcon('🚻', 560, 70, 'Restrooms')}
      ${renderFacilityIcon('🍕', 310, 440, 'South Kitchen')}
      ${renderFacilityIcon('🏪', 460, 68, 'Team Store')}
      ${renderFacilityIcon('🍺', 380, 68, 'Bar')}
      ${renderFacilityIcon('🏥', 138, 245, 'Medical')}
      ${renderFacilityIcon('🌮', 755, 245, 'Snack Bar')}

      <!-- Animated crowd flow arrows -->
      <g opacity="0.3">
        <line x1="300" y1="85" x2="350" y2="110" stroke="var(--color-accent)" stroke-width="1" stroke-dasharray="4,4">
          <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1s" repeatCount="indefinite"/>
        </line>
        <line x1="600" y1="85" x2="550" y2="110" stroke="var(--color-accent)" stroke-width="1" stroke-dasharray="4,4">
          <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1s" repeatCount="indefinite"/>
        </line>
        <line x1="300" y1="420" x2="350" y2="395" stroke="var(--color-accent)" stroke-width="1" stroke-dasharray="4,4">
          <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1s" repeatCount="indefinite"/>
        </line>
      </g>

      <!-- Stadium name -->
      <text x="450" y="488" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-size="11" font-family="Space Grotesk, sans-serif" font-weight="600">
        ${stadiumConfig.name.toUpperCase()} — ${stadiumConfig.city.toUpperCase()}
      </text>
    </svg>
  `;
}

function renderStandArc(zone: any, x: number, y: number, w: number, h: number, _skew: number, _state: SimulationState): string {
  if (!zone) return '';
  const percent = getOccupancyPercent(zone);
  const color = getOccupancyColor(percent);
  const labelY = y + h / 2 + 4;
  const labelX = x + w / 2;

  return `
    <g class="stadium-section" id="zone-${zone.id}" data-zone-id="${zone.id}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" ry="6"
        fill="${color}" fill-opacity="0.55" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
      <text x="${labelX}" y="${labelY}" class="stadium-label" font-size="10">${zone.section || zone.name.split(' ').pop()}</text>
      <text x="${labelX}" y="${labelY + 13}" class="stadium-label" fill="rgba(255,255,255,0.4)" font-size="8">${percent}%</text>
    </g>
  `;
}

function renderStandRect(zone: any, x: number, y: number, w: number, h: number, _state: SimulationState): string {
  if (!zone) return '';
  const percent = getOccupancyPercent(zone);
  const color = getOccupancyColor(percent);

  return `
    <g class="stadium-section" id="zone-${zone.id}" data-zone-id="${zone.id}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" ry="6"
        fill="${color}" fill-opacity="0.55" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
      <text x="${x + w / 2}" y="${y + h / 2 + 4}" class="stadium-label" font-size="10">${zone.section || ''}</text>
      <text x="${x + w / 2}" y="${y + h / 2 + 17}" class="stadium-label" fill="rgba(255,255,255,0.4)" font-size="8">${percent}%</text>
    </g>
  `;
}

function renderVIPZone(zone: any, x: number, y: number, w: number, h: number, _state: SimulationState): string {
  if (!zone) return '';
  const percent = getOccupancyPercent(zone);

  return `
    <g class="stadium-section" id="zone-${zone.id}" data-zone-id="${zone.id}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4"
        fill="#FBBF24" fill-opacity="0.25" stroke="#FBBF24" stroke-width="1" stroke-opacity="0.4"/>
      <text x="${x + w / 2}" y="${y + h / 2 + 4}" class="stadium-label" fill="#FBBF24" font-size="9">VIP · ${percent}%</text>
    </g>
  `;
}

function renderConcourse(zone: any, x: number, y: number, w: number, h: number, _state: SimulationState): string {
  if (!zone) return '';
  const percent = getOccupancyPercent(zone);
  const color = getOccupancyColor(percent);

  return `
    <g id="zone-${zone.id}" data-zone-id="${zone.id}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3"
        fill="${color}" fill-opacity="0.2" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>
    </g>
  `;
}

function renderGateMarker(gateId: string, x: number, y: number, state: SimulationState): string {
  const gate = state.gates.find(g => g.id === gateId);
  if (!gate) return '';
  const color = gate.isOpen ? (gate.congestionLevel > 70 ? '#FF6B6B' : gate.congestionLevel > 40 ? '#FBBF24' : '#00D2A0') : '#64748B';

  return `
    <g class="stadium-section" data-gate-id="${gate.id}">
      <circle cx="${x}" cy="${y}" r="8" fill="${color}" fill-opacity="0.8" stroke="white" stroke-width="1.5" stroke-opacity="0.3" filter="url(#glow)"/>
      <text x="${x}" y="${y + 3}" text-anchor="middle" fill="white" font-size="7" font-weight="700">${gate.name.replace('Gate ', '')}</text>
    </g>
  `;
}

function renderFacilityIcon(icon: string, x: number, y: number, _name: string): string {
  return `
    <g style="cursor: pointer;" class="facility-marker">
      <circle cx="${x}" cy="${y}" r="10" fill="rgba(17,24,39,0.8)" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
      <text x="${x}" y="${y + 4}" text-anchor="middle" font-size="10">${icon}</text>
    </g>
  `;
}

function attachMapListeners(state: SimulationState): void {
  document.querySelectorAll('.stadium-section').forEach(el => {
    el.addEventListener('mouseenter', (e) => {
      const zoneId = (e.currentTarget as HTMLElement).getAttribute('data-zone-id');
      const gateId = (e.currentTarget as HTMLElement).getAttribute('data-gate-id');

      if (zoneId) {
        const zone = state.zones.find(z => z.id === zoneId);
        if (zone && tooltipEl) {
          const percent = getOccupancyPercent(zone);
          tooltipEl.innerHTML = `
            <div class="map-tooltip-title">${zone.name}</div>
            <div class="map-tooltip-row"><span>Occupancy</span><span class="map-tooltip-value" style="color: ${getOccupancyColor(percent)}">${percent}%</span></div>
            <div class="map-tooltip-row"><span>People</span><span class="map-tooltip-value">${zone.currentOccupancy.toLocaleString()} / ${zone.capacity.toLocaleString()}</span></div>
            <div class="map-tooltip-row"><span>Status</span><span class="map-tooltip-value">${getOccupancyLabel(percent)}</span></div>
            ${zone.level ? `<div class="map-tooltip-row"><span>Level</span><span class="map-tooltip-value">${zone.level}</span></div>` : ''}
          `;
          tooltipEl.classList.add('visible');
          positionTooltip(e as MouseEvent);
        }
      }

      if (gateId) {
        const gate = state.gates.find(g => g.id === gateId);
        if (gate && tooltipEl) {
          tooltipEl.innerHTML = `
            <div class="map-tooltip-title">${gate.name}</div>
            <div class="map-tooltip-row"><span>Status</span><span class="map-tooltip-value" style="color: ${gate.isOpen ? '#00D2A0' : '#FF6B6B'}">${gate.isOpen ? 'Open' : 'Closed'}</span></div>
            <div class="map-tooltip-row"><span>Congestion</span><span class="map-tooltip-value">${gate.congestionLevel}%</span></div>
            <div class="map-tooltip-row"><span>Throughput</span><span class="map-tooltip-value">${gate.throughput} ppl/min</span></div>
          `;
          tooltipEl.classList.add('visible');
          positionTooltip(e as MouseEvent);
        }
      }
    });

    el.addEventListener('mousemove', (e) => positionTooltip(e as MouseEvent));

    el.addEventListener('mouseleave', () => {
      if (tooltipEl) tooltipEl.classList.remove('visible');
    });
  });
}

function positionTooltip(e: MouseEvent): void {
  if (!tooltipEl) return;
  const container = document.getElementById('stadium-map-svg-container');
  if (!container) return;
  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left + 15;
  const y = e.clientY - rect.top - 10;
  tooltipEl.style.left = `${Math.min(x, rect.width - 200)}px`;
  tooltipEl.style.top = `${Math.min(y, rect.height - 100)}px`;
}

function renderGateStatus(state: SimulationState): string {
  return `
    <div style="display: flex; flex-direction: column; gap: 10px;">
      ${state.gates.map(gate => {
        const color = !gate.isOpen ? '#64748B' : gate.congestionLevel > 70 ? '#FF6B6B' : gate.congestionLevel > 40 ? '#FBBF24' : '#00D2A0';
        return `
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 10px; height: 10px; border-radius: 50%; background: ${color}; flex-shrink: 0;"></div>
            <span style="font-size: 13px; font-weight: 500; min-width: 60px;">${gate.name}</span>
            <div style="flex: 1; height: 4px; background: var(--color-bg-secondary); border-radius: 99px; overflow: hidden;">
              <div style="width: ${gate.isOpen ? gate.congestionLevel : 0}%; height: 100%; background: ${color}; border-radius: 99px; transition: width 0.5s;"></div>
            </div>
            <span style="font-size: 12px; color: ${color}; font-weight: 600; min-width: 35px; text-align: right;">${gate.isOpen ? gate.congestionLevel + '%' : 'Closed'}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderSectionOccupancy(state: SimulationState): string {
  const seatZones = state.zones.filter(z => z.type === 'seating' || z.type === 'vip');
  return `
    <div style="display: flex; flex-direction: column; gap: 10px;">
      ${seatZones.map(zone => {
        const percent = getOccupancyPercent(zone);
        const color = getOccupancyColor(percent);
        return `
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 12px; font-weight: 600; min-width: 24px; color: ${color};">${zone.section || '★'}</span>
            <span style="font-size: 12px; color: var(--color-text-secondary); min-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${zone.name}</span>
            <div style="flex: 1; height: 4px; background: var(--color-bg-secondary); border-radius: 99px; overflow: hidden;">
              <div style="width: ${percent}%; height: 100%; background: ${color}; border-radius: 99px; transition: width 0.5s;"></div>
            </div>
            <span style="font-size: 11px; color: var(--color-text-tertiary); min-width: 35px; text-align: right;">${percent}%</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}
