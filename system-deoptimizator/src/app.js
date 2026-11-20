// ============================================================
// SYSTEM DEOPTIMIZATOR 2009 PRO — frontend logic
// Calls Tauri backend commands when available; falls back to
// demo data so the UI previews in a plain browser.
// ============================================================

// ---- Tauri detection ----
let tauriInvoke = null;
async function initTauri() {
  // Preferred: bundler-resolved @tauri-apps/api (if a bundler is ever added)
  try {
    if (window.__TAURI_INTERNALS__) {
      const mod = await import('@tauri-apps/api/core');
      tauriInvoke = mod.invoke;
      return;
    }
  } catch (e) { /* no bundler module — fall through */ }
  // Vanilla static frontend: Tauri's withGlobalTauri exposes window.__TAURI__
  try {
    if (window.__TAURI__ && window.__TAURI__.core && window.__TAURI__.core.invoke) {
      tauriInvoke = window.__TAURI__.core.invoke;
      return;
    }
    if (window.__TAURI_INTERNALS__ && window.__TAURI_INTERNALS__.invoke) {
      tauriInvoke = window.__TAURI_INTERNALS__.invoke;
    }
  } catch (e) { /* plain browser */ }
}

function isTauri() { return tauriInvoke !== null; }

async function callBackend(cmd, args) {
  if (!tauriInvoke) return { demo: true, data: null };
  try {
    return { demo: false, data: await tauriInvoke(cmd, args || {}) };
  } catch (e) {
    console.error('[deoptimizator] backend "' + cmd + '" failed, using demo fallback:', e);
    return { demo: true, data: null };
  }
}

// ---- Screen navigation ----
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  const viewport = document.getElementById('viewport');
  if (viewport) viewport.scrollTop = 0;
}

// ---- Demo fallback data (plain-browser preview) ----
const DEMO_FINDINGS = [
  { app: 'Google Chrome', issue: 'is suspiciously fast. Browsers should struggle.', threat: 'MILD' },
  { app: 'Notepad', issue: 'opens in under 0.5s. Unnaturally lean.', threat: 'ELEVATED' },
  { app: 'Windows Defender', issue: 'has blocked 0 toolbars. dereliction of duty.', threat: 'SEVERE' },
  { app: 'Task Manager', issue: 'reports healthy CPU usage. deeply suspicious.', threat: 'MILD' },
  { app: 'Firefox', issue: 'has 0 (zero) extra toolbars installed.', threat: 'CRITICAL' },
];

const DEMO_CATALOG = [
  { id: 'yandex-browser', name: 'Yandex Browser', description: 'A second browser. For balance.', fps_claim: 15, size_mb: 180 },
  { id: 'amigo', name: 'Amigo Browser', description: 'The friend your PC didn\'t ask for.', fps_claim: 25, size_mb: 210 },
  { id: 'mailru-agent', name: 'Mail.ru Agent', description: 'Also installs 3 friends you never speak to.', fps_claim: 10, size_mb: 95 },
  { id: 'wot-launcher', name: 'World of Tanks Launcher', description: 'Adds 40 GB of "tactical overhead".', fps_claim: 50, size_mb: 4096 },
  { id: 'ask-toolbar', name: 'Ask Toolbar', description: 'Classic. Heritage. Culture.', fps_claim: 12, size_mb: 12 },
  { id: 'weather-widget', name: 'Weather Widget Pro', description: 'Reports weather for a city you\'ve never visited.', fps_claim: 8, size_mb: 45 },
  { id: 'search-assistant', name: 'SearchAssist 2009', description: 'Helpfully redirects all searches.', fps_claim: 18, size_mb: 30 },
  { id: 'registry-booster', name: 'Registry Booster Deluxe', description: 'Finds 1,337 (one thousand, three hundred and thirty-seven) "errors".', fps_claim: 32, size_mb: 60 },
];

const DEMO_METRICS = [
  { metric: 'RAM Usage', before: '38%', after: '87%', direction: 'up', win: 'More RAM actively working for you!' },
  { metric: 'FPS (in anything)', before: '60', after: '11', direction: 'down', win: 'FPS stabilized!' },
  { metric: 'Startup Time', before: '12s', after: '4m 38s', direction: 'up', win: 'Anticipation built in!' },
  { metric: 'Toolbars', before: '0', after: '7', direction: 'up', win: 'Productivity potential unlocked!' },
  { metric: 'Browser Homepages', before: '1', after: '4', direction: 'up', win: 'Redundancy for safety!' },
  { metric: 'Free Disk Space', before: '212 GB', after: '37 GB', direction: 'down', win: 'Disk no longer lonely!' },
];

// ---- Screen 1: scan ----
async function startScan() {
  showScreen('screen-scan');
  const bar = document.getElementById('scan-bar');
  const status = document.getElementById('scan-status');
  const list = document.getElementById('scan-findings');
  const btnToOpt = document.getElementById('btn-to-optimize');
  bar.style.width = '0%';
  list.innerHTML = '';
  btnToOpt.classList.add('hidden');
  status.textContent = 'Initializing Deoptimizator Engine v9.0.1 (b2387)...';

  const scanSteps = [
    'Enumerating suspiciously efficient processes...',
    'Measuring PC speed (this will not take long, sadly)...',
    'Checking browser for dangerous cleanliness...',
    'Counting installed toolbars (found: too few)...',
    'Consulting GunkNet™ threat database...',
    'Finalizing report...',
  ];

  const res = await callBackend('scan_system', {});
  const findings = res.demo ? DEMO_FINDINGS : (Array.isArray(res.data) ? res.data : (res.data && res.data.findings) || []);

  // animate progress through steps, interleaving findings
  const total = scanSteps.length;
  for (let i = 0; i < total; i++) {
    status.textContent = scanSteps[i];
    bar.style.width = Math.round(((i + 1) / total) * 100) + '%';
    if (findings[i]) {
      const f = findings[i];
      const issue = f.verdict || f.issue || 'has a suspicious lack of problems.';
      const li = document.createElement('li');
      li.innerHTML = '<b>' + escapeHtml(f.app || 'Unknown') + '</b> ' + escapeHtml(issue) +
        ' <span class="threat">Threat level: ' + escapeHtml(f.severity || f.threat || 'MILD') + '</span>';
      list.appendChild(li);
    }
    await sleep(420 + Math.random() * 380);
  }

  status.textContent = 'Scan complete. Your PC is TOO HEALTHY. ' + findings.length + ' issues found.';
  if (res.demo) {
    status.textContent += ' (demo mode — backend not connected)';
  }
  btnToOpt.classList.remove('hidden');
  document.getElementById('statusbar-left').textContent =
    'Scan complete: ' + findings.length + ' critical performance issues found.';
}

// ---- Screen 2: catalog + install ----
let installedCount = 0;
let totalFpsClaimed = 0;
let installedIds = new Set();
let currentInstallStage = 'idle';

function registerProgressListener() {
  // Backend emits slop://progress {stage, name} during install_slop.
  const api = (window.__TAURI__ && window.__TAURI__.event) || (window.__TAURI_INTERNALS__ && window.__TAURI_INTERNALS__.event);
  const listen = api && api.listen;
  if (listen) {
    listen('slop://progress', (evt) => {
      const payload = evt && evt.payload;
      if (payload && payload.stage) currentInstallStage = payload.stage;
    });
  }
}

async function loadCatalog() {
  const res = await callBackend('get_slop_catalog', {});
  const catalog = res.demo ? DEMO_CATALOG : (res.data && res.data.catalog) || (Array.isArray(res.data) ? res.data : []);
  const grid = document.getElementById('catalog');
  grid.innerHTML = '';
  installedCount = 0;
  totalFpsClaimed = 0;
  installedIds.clear();
  updateOptSummary();

  catalog.forEach(item => {
    const card = document.createElement('div');
    card.className = 'slop-card';
    card.innerHTML =
      '<h3>' + escapeHtml(item.name || item.id) + '</h3>' +
      '<div class="desc">' + escapeHtml(item.description || 'Trusted by millions who never read reviews.') + '</div>' +
      '<div class="fps">+' + (item.fps_claim_percent ?? item.fps_claim ?? 0) + '% FPS!</div>' +
      '<div class="size">' + (item.size_mb ?? '?') + ' MB of pure improvement</div>' +
      '<button class="glossy-btn install-btn">INSTALL (FREE)</button>' +
      '<div class="xp-progress slop-progress hidden"><div class="xp-progress-fill"></div></div>';
    card.querySelector('.install-btn').addEventListener('click', () => installSlop(item, card));
    grid.appendChild(card);
  });
}

async function installSlop(item, card) {
  const btn = card.querySelector('.install-btn');
  const prog = card.querySelector('.slop-progress');
  const fill = prog.querySelector('.xp-progress-fill');
  btn.disabled = true;
  btn.textContent = 'INSTALLING...';
  prog.classList.remove('hidden');

  // Tauri 2 maps camelCase args to snake_case params: entryId -> entry_id
  const res = await callBackend('install_slop', { entryId: item.id });
  if (res.demo) {
    // animated fake progress to 100%
    for (let p = 0; p <= 100; p += 5) {
      fill.style.width = p + '%';
      await sleep(60 + Math.random() * 70);
    }
  } else {
    // backend emits slop://progress (downloading/installing); animation pads it to 100%
    for (let p = 0; p <= 100; p += 5) {
      fill.style.width = p + '%';
      if (currentInstallStage === 'idle') await sleep(60 + Math.random() * 70);
      await sleep(20);
    }
  }
  fill.style.width = '100%';

  btn.classList.add('hidden');
  prog.insertAdjacentHTML('afterend',
    '<div class="installed-badge">✔ INSTALLED — + ' + (item.fps_claim_percent ?? item.fps_claim ?? 0) + '% FPS claimed!</div>');

  installedCount++;
  totalFpsClaimed += (item.fps_claim_percent ?? item.fps_claim ?? 0);
  installedIds.add(item.id);
  updateOptSummary();

  if (installedCount >= 1) {
    document.getElementById('btn-to-results').classList.remove('hidden');
  }
  document.getElementById('statusbar-left').textContent =
    installedCount + ' issue(s) fixed. PC is ' + totalFpsClaimed + '% more optimized.';
}

function updateOptSummary() {
  document.getElementById('opt-counter').textContent = installedCount + ' issues fixed';
  document.getElementById('opt-fps').textContent = '+' + totalFpsClaimed + '% FPS claimed';
}

// ---- Screen 3: results ----
async function loadResults() {
  showScreen('screen-results');
  const container = document.getElementById('metrics');
  container.innerHTML = '<div class="status-line">Collecting WINS...</div>';

  const res = await callBackend('get_metrics', {});
  // backend returns {ram_usage_percent, cpu_load_percent, fps, boots_required, optimization_runs}
  const metrics = res.demo ? DEMO_METRICS : (res.data && !Array.isArray(res.data)
    ? [
        { metric: 'RAM Usage', after: res.data.ram_usage_percent + '%', win: 'More RAM actively working for you!' },
        { metric: 'CPU Load', after: res.data.cpu_load_percent + '%', win: 'CPU finally earns its wages!' },
        { metric: 'FPS (in anything)', after: res.data.fps, win: 'FPS stabilized (at a much lower altitude)!' },
        { metric: 'Boots Required', after: res.data.boots_required, win: 'Every reboot adds character!' },
        { metric: 'Optimization Runs', after: res.data.optimization_runs, win: 'You can never have too many!' },
        { metric: 'Free Disk Space', after: Math.max(1, 212 - installedIds.size * 67) + ' GB', win: 'Disk no longer lonely!' },
      ]
    : res.data);

  container.innerHTML = '';
  metrics.forEach(m => {
    const card = document.createElement('div');
    card.className = 'metric-card';
    card.innerHTML =
      '<h4>' + escapeHtml(m.metric || m.name || '') + '</h4>' +
      '<div class="before">before: ' + escapeHtml(String(m.before ?? '—')) + '</div>' +
      '<div class="value">' + escapeHtml(String(m.after ?? m.value ?? '—')) + '</div>' +
      '<div class="win">✔ ' + escapeHtml(m.win || m.message || 'Optimized!') + '</div>';
    container.appendChild(card);
  });

  document.getElementById('statusbar-left').textContent = 'Optimization complete. PC now deoptimized.';
}

// ---- helpers ----
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// ---- wire up ----
document.getElementById('btn-scan').addEventListener('click', startScan);
document.getElementById('btn-to-optimize').addEventListener('click', () => { showScreen('screen-optimize'); loadCatalog(); });
document.getElementById('btn-to-results').addEventListener('click', loadResults);
document.getElementById('btn-restart').addEventListener('click', () => { showScreen('screen-home'); });

initTauri();
registerProgressListener();
