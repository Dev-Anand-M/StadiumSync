// ============================================================
// Simple Client-Side Router
// ============================================================

type RouteHandler = () => void;

interface Route {
  path: string;
  handler: RouteHandler;
}

let routes: Route[] = [];
let currentPath = '';

export function registerRoute(path: string, handler: RouteHandler): void {
  routes.push({ path, handler });
}

export function navigate(path: string): void {
  if (path === currentPath) return;
  currentPath = path;

  // Update nav active states
  document.querySelectorAll('.nav-item').forEach(item => {
    const itemPath = item.getAttribute('data-path');
    if (itemPath === path) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Find and execute route handler
  const route = routes.find(r => r.path === path);
  if (route) {
    route.handler();
  }
}

export function getCurrentPath(): string {
  return currentPath;
}

export function initRouter(defaultPath: string): void {
  // Set up nav click handlers
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const path = item.getAttribute('data-path');
      if (path) navigate(path);
    });
  });

  navigate(defaultPath);
}
