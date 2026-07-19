// fpsDisplay.js — FPS overlay, detailed profiling, logging, and CSV download
// Attach in main.js:
//   import { initFPSDisplay, recordFrameTiming } from './fpsDisplay.js'
//   initFPSDisplay(renderer, scene)  // once the renderer + scene exist
//   recordFrameTiming(frameMs, updateMs, renderMs)  // every frame from animate()

import { activePreset } from './config.js?v=7';

let _running = false;
let _frameCount = 0;
let _lastTime = 0;
let _fps = 0;
let _logs = [];          // [{time, fps, ...metrics}]
let _logInterval = null; // 1-second sampler
let _overlay = null;
let _expanded = false;

let _renderer = null;
let _scene = null;

// Per-second timing accumulators (fed by recordFrameTiming each frame)
let _acc = null;
function resetAcc() {
  _acc = {
    frames: 0,
    frameSum: 0, frameMax: 0,
    updateSum: 0, updateMax: 0,
    renderSum: 0, renderMax: 0,
  };
}
resetAcc();

const MAX_LOG_ENTRIES = 1200; // 20 minutes of 1-second samples

// CSV column order — single source of truth for header + rows
const CSV_COLUMNS = [
  { key: 'ts',            header: 'Timestamp' },
  { key: 'elapsed',       header: 'Elapsed (s)' },
  { key: 'fps',           header: 'FPS' },
  { key: 'frameAvg',      header: 'FrameMs_avg' },
  { key: 'frameMax',      header: 'FrameMs_max' },
  { key: 'updateAvg',     header: 'UpdateMs_avg' },
  { key: 'updateMax',     header: 'UpdateMs_max' },
  { key: 'renderAvg',     header: 'RenderMs_avg' },
  { key: 'renderMax',     header: 'RenderMs_max' },
  { key: 'drawCalls',     header: 'DrawCalls' },
  { key: 'triangles',     header: 'Triangles' },
  { key: 'geometries',    header: 'Geometries' },
  { key: 'textures',      header: 'Textures' },
  { key: 'programs',      header: 'Programs' },
  { key: 'playerUnits',   header: 'PlayerUnits' },
  { key: 'enemyUnits',    header: 'EnemyUnits' },
  { key: 'totalUnits',    header: 'TotalUnits' },
  { key: 'projectiles',   header: 'Projectiles' },
  { key: 'explosions',    header: 'Explosions' },
  { key: 'trails',        header: 'Trails' },
  { key: 'fxOther',       header: 'FXOther' },
  { key: 'sceneObjects',  header: 'SceneObjects' },
  { key: 'preset',        header: 'Preset' },
];

/**
 * Called from main.js once per frame with the measured timings (in ms).
 * frameMs  = wall-clock time since previous frame (rAF-to-rAF)
 * updateMs = time spent in game.update()
 * renderMs = time spent in renderer.render()
 */
export function recordFrameTiming(frameMs, updateMs, renderMs) {
  if (!_running || !_acc) return;
  _acc.frames++;
  _acc.frameSum += frameMs;   if (frameMs  > _acc.frameMax)  _acc.frameMax  = frameMs;
  _acc.updateSum += updateMs; if (updateMs > _acc.updateMax) _acc.updateMax = updateMs;
  _acc.renderSum += renderMs; if (renderMs > _acc.renderMax) _acc.renderMax = renderMs;
}

export function initFPSDisplay(renderer, scene) {
  if (_running) return;
  _running = true;
  _renderer = renderer || null;
  _scene = scene || null;

  // --- Build overlay DOM ---
  _overlay = document.createElement('div');
  _overlay.id = 'fpsOverlay';
  _overlay.innerHTML = `
    <div class="fps-bar" id="fpsBar">
      <span class="fps-value" id="fpsValue">0 FPS</span>
      <button class="fps-btn fps-btn-primary" id="fpsDownloadBtn" title="Download detailed profiling CSV">CSV</button>
      <span class="fps-toggle" id="fpsToggle" title="Expand FPS panel">&#9660;</span>
    </div>
    <div class="fps-panel hidden" id="fpsPanel">
      <canvas id="fpsGraph" width="200" height="60"></canvas>
      <div class="fps-stats">
        <span>Min: <b id="fpsMin">-</b></span>
        <span>Avg: <b id="fpsAvg">-</b></span>
        <span>Max: <b id="fpsMax">-</b></span>
      </div>
      <div class="fps-detail" id="fpsDetail">
        <div><span>Frame</span><b id="fpsFrameMs">-</b></div>
        <div><span>Update</span><b id="fpsUpdateMs">-</b></div>
        <div><span>Render</span><b id="fpsRenderMs">-</b></div>
        <div><span>Draws</span><b id="fpsDraws">-</b></div>
        <div><span>Tris</span><b id="fpsTris">-</b></div>
        <div><span>Units</span><b id="fpsUnits">-</b></div>
        <div><span>Proj</span><b id="fpsProj">-</b></div>
        <div><span>FX</span><b id="fpsFx">-</b></div>
      </div>
      <div class="fps-actions">
        <button class="fps-btn" id="fpsClearBtn">Clear</button>
        <button class="fps-btn fps-btn-primary" id="fpsDownloadPanelBtn">Download Logs</button>
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
  document.getElementById('fpsDownloadPanelBtn').addEventListener('click', downloadLogs);
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
      sampleMetrics();
      updateOverlay();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// --- Gather a full metrics snapshot and push to the log (once per second) ---
let _lastSnapshot = null;
function sampleMetrics() {
  if (_fps <= 0) { resetAcc(); return; }

  const frames = _acc.frames || 1;
  const timing = {
    frameAvg:  round2(_acc.frameSum  / frames),
    frameMax:  round2(_acc.frameMax),
    updateAvg: round2(_acc.updateSum / frames),
    updateMax: round2(_acc.updateMax),
    renderAvg: round2(_acc.renderSum / frames),
    renderMax: round2(_acc.renderMax),
  };
  resetAcc();

  // Renderer GPU stats
  let drawCalls = 0, triangles = 0, geometries = 0, textures = 0, programs = 0;
  if (_renderer && _renderer.info) {
    const info = _renderer.info;
    drawCalls  = info.render?.calls || 0;
    triangles  = info.render?.triangles || 0;
    geometries = info.memory?.geometries || 0;
    textures   = info.memory?.textures || 0;
    programs   = info.programs?.length || 0;
  }

  // Game entity + FX counts
  const game = _scene?.userData?.game || null;
  const ud = _scene?.userData || {};
  const playerUnits  = game?.playerUnits?.length || 0;
  const enemyUnits   = game?.enemyUnits?.length || 0;
  const projectiles  = game?.projectiles?.length || 0;
  const explosions   = (ud.explosions?.length || 0) + (ud.splashRings?.length || 0);
  const trails       = ud.airTrails?.length || 0;
  const fxOther      = (ud.flashes?.length || 0) + (ud.spawnMarkers?.length || 0) +
                       (ud.flakPuffs?.length || 0) + (ud.hitConfirms?.length || 0);
  const sceneObjects = _scene?.children?.length || 0;

  const entry = {
    time: Date.now(),
    fps: _fps,
    ...timing,
    drawCalls, triangles, geometries, textures, programs,
    playerUnits, enemyUnits, totalUnits: playerUnits + enemyUnits,
    projectiles, explosions, trails, fxOther, sceneObjects,
    preset: activePreset?.label || '-',
  };

  _logs.push(entry);
  if (_logs.length > MAX_LOG_ENTRIES) _logs.shift();
  _lastSnapshot = entry;
}

function round2(v) { return Math.round(v * 100) / 100; }

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
  updateDetail();
}

// --- Live detail readout (expanded panel) ---
function updateDetail() {
  const s = _lastSnapshot;
  if (!s) return;
  const set = (id, val) => { const e = document.getElementById(id); if (e) e.textContent = val; };
  set('fpsFrameMs',  `${s.frameAvg}/${s.frameMax}ms`);
  set('fpsUpdateMs', `${s.updateAvg}/${s.updateMax}ms`);
  set('fpsRenderMs', `${s.renderAvg}/${s.renderMax}ms`);
  set('fpsDraws',    s.drawCalls);
  set('fpsTris',     formatK(s.triangles));
  set('fpsUnits',    `${s.totalUnits} (${s.playerUnits}/${s.enemyUnits})`);
  set('fpsProj',     s.projectiles);
  set('fpsFx',       s.explosions + s.trails + s.fxOther);
}

function formatK(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k';
  return String(n);
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

  const start = _logs[0].time;
  const header = CSV_COLUMNS.map(c => c.header).join(',');
  const rows = _logs.map(entry => {
    return CSV_COLUMNS.map(col => {
      switch (col.key) {
        case 'ts':      return new Date(entry.time).toISOString();
        case 'elapsed': return ((entry.time - start) / 1000).toFixed(1);
        default:        return entry[col.key] ?? '';
      }
    }).join(',');
  });

  const csv = header + '\n' + rows.join('\n') + '\n';

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
  _lastSnapshot = null;
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
