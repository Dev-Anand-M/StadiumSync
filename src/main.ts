// ============================================================
// StadiumSync — Main Entry Point
// AI-Powered Stadium Experience Platform
// ============================================================

import './style.css';
import { startSimulation, onSimulationUpdate, markAlertRead, type SimulationState } from './data/simulator';
import { stadiumConfig } from './data/stadium';
import { renderStadiumMap, updateStadiumMap } from './components/StadiumMap';
import { renderQueueDashboard, updateQueueDashboard } from './components/QueueDashboard';
import { renderNavigation } from './components/Navigation';
import { renderEventFeed, updateEventFeed } from './components/EventFeed';
import { renderAnalytics } from './components/Analytics';
import { renderPersonalHub } from './components/PersonalHub';
import { registerRoute, initRouter } from './utils/router';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initGeminiServices } from './utils/ai';
import { initGoogleMaps } from './utils/maps';

// Initialize Google Services Integration
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForHackathonPlaceholder",
  authDomain: "stadiumsync-demo.firebaseapp.com",
  projectId: "stadiumsync-demo",
  storageBucket: "stadiumsync-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);


// --- App State ---
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let currentPage = 'dashboard';
let latestState: SimulationState | null = null;
let notificationPanelOpen = false;

/**
 * Primary initialization sequence.
 * Builds the application DOM and registers routing logic.
 */
function init() {
  initGeminiServices();
  initGoogleMaps();

  const app = document.getElementById('app')!;

  app.insertAdjacentHTML('beforeend', `
    <!-- Sidebar -->
    <nav class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">⚡</div>
        <div>
          <div class="sidebar-logo-text">StadiumSync</div>
        </div>
        <span class="sidebar-logo-badge">Live</span>
      </div>

      <div class="sidebar-nav">
        <div class="nav-section-label">Main</div>
        <div class="nav-item active" data-path="dashboard">
          <span class="nav-item-icon">🗺️</span>
          <span>Live Map</span>
        </div>
        <div class="nav-item" data-path="queues">
          <span class="nav-item-icon">⏱️</span>
          <span>Queue Times</span>
        </div>
        <div class="nav-item" data-path="navigate" role="button" aria-label="Navigate to Route Planner">
          <span class="nav-item-icon" aria-hidden="true">🧭</span>
          <span>Navigate</span>
        </div>
        <div class="nav-item" data-path="events">
          <span class="nav-item-icon">📢</span>
          <span>Event Feed</span>
          <span class="nav-item-badge" id="event-badge" style="display: none;">0</span>
        </div>

        <div class="nav-section-label">Insights</div>
        <div class="nav-item" data-path="analytics">
          <span class="nav-item-icon">📊</span>
          <span>Analytics</span>
        </div>
        <div class="nav-item" data-path="personal">
          <span class="nav-item-icon">🎫</span>
          <span>My Hub</span>
        </div>
      </div>

      <div class="sidebar-footer">
        <div class="event-status">
          <div class="event-status-dot"></div>
          <div>
            <div class="event-status-text">Match Live</div>
            <div class="event-status-name">${stadiumConfig.event.homeTeam} vs ${stadiumConfig.event.awayTeam}</div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Top Header -->
      <header class="top-header">
        <div class="header-left">
          <button class="menu-toggle" id="menu-toggle">☰</button>
          <div>
            <div class="header-title" id="page-title">Live Stadium Map</div>
            <div class="header-subtitle">${stadiumConfig.name} · ${stadiumConfig.city}</div>
          </div>
        </div>
        <div class="header-right">
          <div class="header-time">
            <span class="header-time-icon">🕐</span>
            <span id="live-clock">${getCurrentTime()}</span>
          </div>
          <div class="header-weather">☀️ 28°C</div>
          <button class="notification-btn" id="notification-btn" aria-label="View notifications">
            🔔
            <span class="badge" id="notif-count" aria-hidden="true">3</span>
          </button>
          <div class="user-avatar" role="button" aria-label="User profile">P</div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="page-container" id="page-content">
        <!-- Rendered by router -->
      </div>
    </main>

    <!-- Notification Panel -->
    <div class="overlay" id="overlay"></div>
    <div class="notification-panel" id="notification-panel">
      <div class="notification-panel-header">
        <span class="notification-panel-title" role="heading" aria-level="3">🔔 Notifications</span>
        <button class="notification-close" id="notif-close" aria-label="Close notifications">✕</button>
      </div>
      <div class="notification-list" id="notification-list">
        <!-- Populated dynamically -->
      </div>
    </div>
  `);

  // Register routes
  const pageContent = document.getElementById('page-content')!;

  registerRoute('dashboard', () => {
    setPageTitle('Live Stadium Map');
    if (latestState) renderStadiumMap(pageContent, latestState);
  });

  registerRoute('queues', () => {
    setPageTitle('Smart Queue Dashboard');
    if (latestState) renderQueueDashboard(pageContent, latestState);
  });

  registerRoute('navigate', () => {
    setPageTitle('Smart Navigation');
    if (latestState) renderNavigation(pageContent, latestState);
  });

  registerRoute('events', () => {
    setPageTitle('Live Event Feed');
    if (latestState) renderEventFeed(pageContent, latestState);
  });

  registerRoute('analytics', () => {
    setPageTitle('Analytics Dashboard');
    if (latestState) renderAnalytics(pageContent, latestState);
  });

  registerRoute('personal', () => {
    setPageTitle('Personal Hub');
    if (latestState) renderPersonalHub(pageContent, latestState);
  });

  // Set up event listeners
  setupEventListeners();

  // Start simulation
  startSimulation(3000);

  // Listen for simulation updates
  onSimulationUpdate((state) => {
    latestState = state;

    // On first state, render default page
    if (!document.querySelector('.section-header')) {
      initRouter('dashboard');
    }

    // Update current page data (light updates, no full re-render)
    updateCurrentPage(state);

    // Update notification badge
    updateNotificationBadge(state);

    // Update clock
    updateClock();
  });

  // Clock update interval
  setInterval(updateClock, 1000);
}

function setPageTitle(title: string) {
  currentPage = title;
  const el = document.getElementById('page-title');
  if (el) el.textContent = title;
}

function updateCurrentPage(state: SimulationState) {
  const activeNav = document.querySelector('.nav-item.active');
  const path = activeNav?.getAttribute('data-path');

  switch (path) {
    case 'dashboard':
      updateStadiumMap(state);
      break;
    case 'queues':
      updateQueueDashboard(state);
      break;
    case 'events':
      updateEventFeed(state);
      break;
    // Other pages get full re-render on nav
  }
}

function setupEventListeners() {
  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  menuToggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
    overlay?.classList.toggle('active');
  });

  overlay?.addEventListener('click', () => {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('active');
    closeNotifications();
  });

  // Notification panel
  const notifBtn = document.getElementById('notification-btn');
  const notifClose = document.getElementById('notif-close');

  notifBtn?.addEventListener('click', () => {
    notificationPanelOpen = !notificationPanelOpen;
    toggleNotifications();
  });

  notifClose?.addEventListener('click', closeNotifications);
}

function toggleNotifications() {
  const panel = document.getElementById('notification-panel');
  const overlay = document.getElementById('overlay');

  if (notificationPanelOpen) {
    panel?.classList.add('open');
    overlay?.classList.add('active');
    renderNotifications();
  } else {
    closeNotifications();
  }
}

function closeNotifications() {
  notificationPanelOpen = false;
  document.getElementById('notification-panel')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('active');
}

function renderNotifications() {
  const list = document.getElementById('notification-list');
  if (!list || !latestState) return;

  const htmlString = latestState.alerts.map(alert => `
    <div class="notification-item ${!alert.read ? 'unread' : ''}" data-alert-id="${alert.id}" tabindex="0" role="button">
      <div class="notification-icon-wrapper" style="background: ${getAlertIconBg(alert.type)};">
        ${alert.icon}
      </div>
      <div class="notification-content">
        <div class="notification-title">${alert.title}</div>
        <div class="notification-desc">${alert.message}</div>
        <div class="notification-time">${getTimeAgo(alert.timestamp)}</div>
      </div>
    </div>
  `).join('');
  
  list.innerHTML = '';
  list.insertAdjacentHTML('beforeend', htmlString);

  // Mark as read on click
  list.querySelectorAll('.notification-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = (item as HTMLElement).getAttribute('data-alert-id');
      if (id) {
        markAlertRead(id);
        item.classList.remove('unread');
      }
    });
  });
}

function updateNotificationBadge(state: SimulationState) {
  const unread = state.alerts.filter(a => !a.read).length;
  const badge = document.getElementById('notif-count');
  const eventBadge = document.getElementById('event-badge');

  if (badge) {
    badge.textContent = String(unread);
    (badge as HTMLElement).style.display = unread > 0 ? '' : 'none';
  }

  if (eventBadge) {
    eventBadge.textContent = String(unread);
    (eventBadge as HTMLElement).style.display = unread > 0 ? '' : 'none';
  }
}

function getCurrentTime(): string {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function updateClock() {
  const el = document.getElementById('live-clock');
  if (el) el.textContent = getCurrentTime();
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

function getAlertIconBg(type: string): string {
  const map: Record<string, string> = {
    info: 'rgba(0, 206, 255, 0.12)',
    warning: 'rgba(251, 191, 36, 0.12)',
    danger: 'rgba(255, 107, 107, 0.12)',
    success: 'rgba(0, 210, 160, 0.12)',
  };
  return map[type] || map.info;
}

// --- Boot ---
init();
