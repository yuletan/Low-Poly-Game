// fpsDisplay.js — FPS overlay, logging, and CSV download
// Attach to main.js: import { initFPSDisplay } from './fpsDisplay.js'
// Call initFPSDisplay(renderer) once the renderer exists.

let _running = false;
let _frameCount = 0;
let _lastTime = 0;
let _fps = 0;
let _logs = [];          // [{time, fps}]
let _logInterval = null; // 1-second sampler
let _overlay = null;
let _expanded = false;

const MAX_LOG_ENTRIES = 600; // 10 minutes of 1-second samples

export function initFPSDisplay(renderer) {
  if (_running) return;
  _running = true;

  // --- Build overlay DOM ---
  _overlay = document.createElement('div');
  _overlay.id = 'fpsOverlay';
  _overlay.innerHTML = `
    <div class="fps-bar" id="fpsBar">
      <span class="fps-value" id="fpsValue">0 FPS</span>
      <span class="fps-toggle" id="fpsToggle" title="Expand FPS panel">&#9660;</span>
    </div>
    <div class="fps-panel hidden" id="fpsPanel">
      <canvas id="fpsGraph" width="200" height="60"></canvas>
      <div class="fps-stats">
        <span>Min: <b id="fpsMin">-</b></span>
        <span>Avg: <b id="fpsAvg">-</b></span>
        <span>Max: <b id="fpsMax">-</b></span>
      </div>
      <div class="fps-actions">
        <button class="fps-btn" id="fpsClearBtn">Clear</button>
        <button class="fps-btn fps-btn-primary" id="fpsDownloadBtn">Download Logs</button>
      </div>
    </div>
  `;
  document.body.appendChild(_overlay);

  // --- Event wiring ---
  document.getElementById('fpsToggle').addEventListener('click', (e) => {
    e.stopPropagation();
    _expanded = !_expanded;
    document.getElementById('fpsPanel').classList.toggle('hidden', !_expanded);
    document.getElementById('fpsToggle').textContent = _expanded ? '\u25B2' : '\u25BC';
  });

  document.getElementById('fpsDownloadBtn').addEventListener('click', downloadLogs);
  document.getElementById('fpsClearBtn').addEventListener('click', clearLogs);

  // --- FPS measurement via requestAnimationFrame ---
  _lastTime = performance.now();
  _frameCount = 0;

  function tick(now) {
    if (!_running) return;
    _frameCount++;
    const elapsed = now - _lastTime;
    if (elapsed >= 1000) {
      _fps = Math.round((_frameCount * 1000) / elapsed);
      _frameCount = 0;
      _lastTime = now;
      updateOverlay();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // --- Log sampler (1 per second) ---
  _logInterval = setInterval(() => {
    if (_fps > 0) {
      _logs.push({ time: Date.now(), fps: _fps });
      if (_logs.length > MAX_LOG_ENTRIES) _logs.shift();
    }
  }, 1000);
}

// --- Update the overlay text + graph ---
function updateOverlay() {
  if (!_overlay) return;

  const el = document.getElementById('fpsValue');
  if (el) {
    el.textContent = _fps + ' FPS';
    el.className = 'fps-value' + (_fps >= 50 ? ' fps-good' : _fps >= 30 ? ' fps-ok' : ' fps-bad');
  }

  drawGraph();
  updateStats();
}

// --- Draw a mini line graph of recent FPS ---
function drawGraph() {
  const canvas = document.getElementById('fpsGraph');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const samples = _logs.slice(-60); // last 60 seconds
  if (samples.length < 2) return;

  const maxFps = Math.max(...samples.map(s => s.fps), 1);
  const step = w / (samples.length - 1);

  // Grid lines
  ctx.strokeStyle = 'rgba(74,158,255,0.15)';
  ctx.lineWidth = 1;
  for (let y = 0; y <= 4; y++) {
    const gy = (y / 4) * h;
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(w, gy);
    ctx.stroke();
  }

  // FPS line
  ctx.beginPath();
  ctx.strokeStyle = '#4a9eff';
  ctx.lineWidth = 1.5;
  ctx.lineJoin = 'round';
  for (let i = 0; i < samples.length; i++) {
    const x = i * step;
    const y = h - (samples[i].fps / maxFps) * h;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Fill under the line
  ctx.lineTo((samples.length - 1) * step, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fillStyle = 'rgba(74,158,255,0.1)';
  ctx.fill();

  // 30 FPS threshold line
  const y30 = h - (30 / maxFps) * h;
  if (y30 > 0 && y30 < h) {
    ctx.strokeStyle = 'rgba(231,76,60,0.5)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, y30);
    ctx.lineTo(w, y30);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

// --- Min / Avg / Max stats ---
function updateStats() {
  if (_logs.length === 0) return;
  const fpsValues = _logs.map(l => l.fps);
  const min = Math.min(...fpsValues);
  const max = Math.max(...fpsValues);
  const avg = Math.round(fpsValues.reduce((a, b) => a + b, 0) / fpsValues.length);

  const minEl = document.getElementById('fpsMin');
  const avgEl = document.getElementById('fpsAvg');
  const maxEl = document.getElementById('fpsMax');
  if (minEl) minEl.textContent = min;
  if (avgEl) avgEl.textContent = avg;
  if (maxEl) maxEl.textContent = max;
}

// --- Export logs as CSV ---
function downloadLogs() {
  if (_logs.length === 0) {
    alert('No FPS logs to download yet. Wait a few seconds.');
    return;
  }

  let csv = 'Timestamp,Elapsed (s),FPS\n';
  const start = _logs[0].time;
  for (const entry of _logs) {
    const elapsed = ((entry.time - start) / 1000).toFixed(1);
    const ts = new Date(entry.time).toISOString();
    csv += `${ts},${elapsed},${entry.fps}\n`;
  }

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fps_log_${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function clearLogs() {
  _logs = [];
  drawGraph();
  const minEl = document.getElementById('fpsMin');
  const avgEl = document.getElementById('fpsAvg');
  const maxEl = document.getElementById('fpsMax');
  if (minEl) minEl.textContent = '-';
  if (avgEl) avgEl.textContent = '-';
  if (maxEl) maxEl.textContent = '-';
}

export function stopFPSDisplay() {
  _running = false;
  if (_logInterval) clearInterval(_logInterval);
  if (_overlay) _overlay.remove();
}
