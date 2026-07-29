// analyze-fps.mjs — diagnose FPS-drop causes from a detailed fps_log CSV.
//
// Usage:
//   node analyze-fps.mjs [path-to-csv] [fpsThreshold]
//   (defaults: newest fps_log_*.csv in cwd, threshold 30)
//
// Requires a CSV produced by the enhanced fpsDisplay.js (with UpdateMs/RenderMs/
// DrawCalls/Units/etc). Falls back gracefully for old FPS-only logs.

import { readFileSync, readdirSync } from 'node:fs';

const args = process.argv.slice(2);
let csvPath = args.find(a => a.endsWith('.csv'));
const threshold = Number(args.find(a => !a.endsWith('.csv'))) || 30;

if (!csvPath) {
  const logs = readdirSync('.').filter(f => /^fps_log_.*\.csv$/.test(f)).sort();
  if (logs.length === 0) { console.error('No fps_log_*.csv found in current directory.'); process.exit(1); }
  csvPath = logs[logs.length - 1];
}

const text = readFileSync(csvPath, 'utf8').trim();
const lines = text.split(/\r?\n/);
const header = lines[0].split(',').map(h => h.trim());
const rows = lines.slice(1).map(line => {
  const cells = line.split(',');
  const obj = {};
  header.forEach((h, i) => { obj[h] = cells[i]; });
  return obj;
});

const num = (v) => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
const has = (col) => header.includes(col);
const detailed = has('UpdateMs_avg') && has('RenderMs_avg');

console.log(`\n=== FPS Analysis: ${csvPath} ===`);
console.log(`Samples: ${rows.length}  |  FPS threshold for "low" window: ${threshold}`);

const fpsVals = rows.map(r => num(r.FPS));
const min = Math.min(...fpsVals), max = Math.max(...fpsVals);
const avg = fpsVals.reduce((a, b) => a + b, 0) / fpsVals.length;
console.log(`FPS  min ${min} / avg ${avg.toFixed(1)} / max ${max}`);

if (!detailed) {
  console.log('\n[!] This is an OLD FPS-only log. Re-record with the updated overlay to get bottleneck breakdown.');
  const lowCount = fpsVals.filter(f => f < threshold).length;
  console.log(`Low-FPS samples: ${lowCount}/${rows.length} (${(100 * lowCount / rows.length).toFixed(0)}%)`);
  process.exit(0);
}

const low = rows.filter(r => num(r.FPS) < threshold);
const good = rows.filter(r => num(r.FPS) >= threshold);
console.log(`Low-FPS samples: ${low.length}/${rows.length} (${(100 * low.length / rows.length).toFixed(0)}%)\n`);

if (low.length === 0) { console.log('No low-FPS windows to diagnose. 🎉'); process.exit(0); }

const mean = (arr, col) => arr.length ? arr.reduce((a, r) => a + num(r[col]), 0) / arr.length : 0;
const p95  = (arr, col) => {
  if (!arr.length) return 0;
  const s = arr.map(r => num(r[col])).sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(s.length * 0.95))];
};

// --- Frame budget breakdown during low-FPS windows ---
const uAvg = mean(low, 'UpdateMs_avg'), rAvg = mean(low, 'RenderMs_avg'), fAvg = mean(low, 'FrameMs_avg');
const uMax = p95(low, 'UpdateMs_max'),  rMax = p95(low, 'RenderMs_max'),  fMax = p95(low, 'FrameMs_max');
const otherAvg = Math.max(0, fAvg - uAvg - rAvg);

console.log('--- Frame time budget (low-FPS windows) ---');
console.log(`Frame  avg ${fAvg.toFixed(1)}ms  p95max ${fMax.toFixed(1)}ms  (~${fAvg > 0 ? (1000 / fAvg).toFixed(0) : 0} fps)`);
console.log(`Update avg ${uAvg.toFixed(1)}ms  p95max ${uMax.toFixed(1)}ms  (${pct(uAvg, fAvg)}% of frame)`);
console.log(`Render avg ${rAvg.toFixed(1)}ms  p95max ${rMax.toFixed(1)}ms  (${pct(rAvg, fAvg)}% of frame)`);
console.log(`Other  avg ${otherAvg.toFixed(1)}ms  (${pct(otherAvg, fAvg)}% — browser/compositor/idle)\n`);

// --- Verdict: which subsystem dominates ---
console.log('--- Primary bottleneck ---');
if (uAvg > rAvg * 1.5) {
  console.log('▶ GAME LOGIC (update) dominates. Suspects: pathfinding, findTarget scans,');
  console.log('  soft collision, AI ticks, aura recalcs. Check entity counts below.');
} else if (rAvg > uAvg * 1.5) {
  console.log('▶ RENDERING (GPU/draw) dominates. Suspects: draw calls, triangles, shadows,');
  console.log('  particle/FX overdraw, pixel ratio. Check draw calls / triangles below.');
} else if (otherAvg > (uAvg + rAvg)) {
  console.log('▶ Neither update nor render dominates — cost is OUTSIDE the measured loop');
  console.log('  (GC pauses, DOM/UI reflow, texture uploads, or throttled tab). ');
} else {
  console.log('▶ MIXED — update and render both contribute. Likely a few issues together.');
}

// --- Correlate entity/FX counts: low vs good windows ---
console.log('\n--- Entity/FX averages: low-FPS vs good-FPS windows ---');
const cols = ['DrawCalls','Triangles','TotalUnits','PlayerUnits','EnemyUnits','Projectiles','Explosions','Trails','FXOther','SceneObjects','Geometries','Textures'];
const pad = (s, n) => String(s).padEnd(n);
console.log(`${pad('Metric', 14)}${pad('low-FPS', 12)}${pad('good-FPS', 12)}ratio`);
for (const c of cols) {
  if (!has(c)) continue;
  const lo = mean(low, c), gd = mean(good, c);
  const ratio = gd > 0 ? (lo / gd) : (lo > 0 ? Infinity : 1);
  const flag = ratio >= 1.5 ? '  <== elevated' : '';
  console.log(`${pad(c, 14)}${pad(lo.toFixed(0), 12)}${pad(gd.toFixed(0), 12)}${ratio === Infinity ? 'inf' : ratio.toFixed(2)}${flag}`);
}

// --- Memory leak check: are geometries/textures monotonically climbing? ---
if (has('Geometries')) {
  const g0 = num(rows[0].Geometries), gN = num(rows[rows.length - 1].Geometries);
  const t0 = num(rows[0].Textures), tN = num(rows[rows.length - 1].Textures);
  console.log('\n--- Memory trend (first -> last sample) ---');
  console.log(`Geometries ${g0} -> ${gN}   Textures ${t0} -> ${tN}`);
  if (gN > g0 * 1.5 && gN - g0 > 50) console.log('  [!] Geometry count climbing — possible leak (meshes not disposed/pooled).');
  if (tN > t0 * 1.5 && tN - t0 > 20) console.log('  [!] Texture count climbing — possible leak.');
}

console.log('');

function pct(part, whole) { return whole > 0 ? Math.round(100 * part / whole) : 0; }
