import * as THREE from 'three';
import { Capacitor } from '@capacitor/core';

import { Game } from './game.js';
import { initInput } from './input.js';
import { initAI }    from './ai.js';
import { initUI }    from './ui.js';
import { initMobileShell } from './mobileShell.js';
import { createCommandController } from './commandController.js';
import { Sound }     from './sound.js';
import { loadSaveData, hasSave } from './saveLoad.js';
import { MAP_SIZE, QUALITY_PRESETS, setActivePreset, activePreset }  from './config.js';
import { initFPSDisplay, recordFrameTiming } from './fpsDisplay.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87b8e8);
scene.fog = new THREE.Fog(0x87b8e8, 500, 1500);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2500);
camera.position.set(0, 150, 150);
camera.lookAt(0, 0, 0);
camera.userData.height = 150;
camera.userData.distance = 150;

// Detect mobile for performance tuning using Capacitor and pointer events
const isMobile =
  Capacitor.isNativePlatform() ||
  window.matchMedia('(pointer: coarse)').matches;

// Load saved quality preset BEFORE creating the renderer
let savedPresetKey = 'medium';
try {
  const raw = localStorage.getItem('perftab_settings');
  if (raw) {
    const s = JSON.parse(raw);
    if (s && s.qualityPreset && QUALITY_PRESETS[s.qualityPreset]) savedPresetKey = s.qualityPreset;
  }
} catch(e) {}
setActivePreset(savedPresetKey);
const preset = QUALITY_PRESETS[savedPresetKey];

const renderer = new THREE.WebGLRenderer({
  antialias: preset.antialias && !isMobile,
  powerPreference: 'high-performance'
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, preset.pixelRatio));
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.shadowMap.enabled = preset.shadows;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.getElementById('gameCanvas').appendChild(renderer.domElement);
scene.userData.renderer = renderer;

const ambient = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambient);
const sun = new THREE.DirectionalLight(0xffffff, 0.9);
sun.position.set(300, 400, 200);
sun.castShadow = preset.shadows;
sun.shadow.mapSize.set(preset.shadowSize, preset.shadowSize);
sun.shadow.camera.left = -600; sun.shadow.camera.right = 600;
sun.shadow.camera.top  =  600; sun.shadow.camera.bottom = -600;
scene.add(sun);
scene.userData.sun = sun;

const cameraTarget = new THREE.Vector3(-500, 0, 200); // start over player base
const keys = {};
window.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
  Sound.resume();
  // Placement mode — cancel on Escape
  if (e.key === 'Escape' && game && game.placementMode && game.placementMode.active) {
    game.exitPlacementMode(true);
  }
});
window.addEventListener('keyup',   e => keys[e.key.toLowerCase()] = false);

function updateCamera(dt) {
  const speed = 150 * dt;
  if (keys['w'] || keys['arrowup'])    cameraTarget.z -= speed;
  if (keys['s'] || keys['arrowdown'])  cameraTarget.z += speed;
  if (keys['a'] || keys['arrowleft'])  cameraTarget.x -= speed;
  if (keys['d'] || keys['arrowright']) cameraTarget.x += speed;
  cameraTarget.x = THREE.MathUtils.clamp(cameraTarget.x, -MAP_SIZE/2, MAP_SIZE/2);
  cameraTarget.z = THREE.MathUtils.clamp(cameraTarget.z, -MAP_SIZE/2, MAP_SIZE/2);

  const height = camera.userData.height ?? 150;
  const distance = camera.userData.distance ?? height;

  camera.position.x = cameraTarget.x;
  camera.position.z = cameraTarget.z + distance;
  camera.position.y = height;
  camera.lookAt(cameraTarget.x, 0, cameraTarget.z);
}

// Mouse wheel zoom
window.addEventListener('wheel', e => {
  camera.userData.height = THREE.MathUtils.clamp(
    (camera.userData.height ?? 150) + e.deltaY * 0.3,
    60,
    400
  );
  camera.userData.distance = camera.userData.height;
}, { passive: true });

function resizeRenderer() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  const deviceRatio = window.devicePixelRatio || 1;
  const presetRatio = activePreset.pixelRatio ?? 1;

  // Never let resize/orientation override the selected quality preset.
  renderer.setPixelRatio(Math.min(deviceRatio, presetRatio));
  renderer.setSize(width, height, false);
}

window.addEventListener('resize', resizeRenderer);
window.addEventListener('orientationchange', () => {
  setTimeout(resizeRenderer, 250);
});

// === Start menu wiring ===
let game = null;

// If a save exists, show a "Continue" button
if (hasSave()) {
  const menu = document.querySelector('#startMenu .panel');
  const cont = document.createElement('button');
  cont.className = 'btn btn-green';
  cont.style.marginTop = '10px';
  cont.textContent = '📂 CONTINUE SAVED GAME';
  cont.addEventListener('click', () => {
    const save = loadSaveData();
    if (save) {
      document.getElementById('startMenu').classList.add('hidden');
      startGame(save.difficulty, save);
    }
  });
  menu.appendChild(cont);
}

document.querySelectorAll('#startMenu .btn[data-diff]').forEach(btn => {
  btn.addEventListener('click', () => {
    const diff = btn.dataset.diff;
    document.getElementById('startMenu').classList.add('hidden');
    startGame(diff, null);
    Sound.resume();
  });
});

function startGame(difficulty, saveData) {
  try {
    console.log('[INIT] Starting game with difficulty:', difficulty);
    game = new Game(scene, camera, difficulty, cameraTarget);
    console.log('[INIT] Game instance created');
    game.init();
    console.log('[INIT] game.init() done, playerUnits:', game.playerUnits.length);

    // Phase 0: always-on perf readout (independent of the debug FPS overlay)
    window.__perf = game.perf;

    if (saveData) {
      applySave(game, saveData);
    }

    const inputCommands = initInput(game, camera, renderer);
    console.log('[INIT] Input initialized');
    initAI(game);
    console.log('[INIT] AI initialized');
    initUI(game);
    const commands = createCommandController(game, inputCommands);
    game.commands = commands;
    initMobileShell(game, commands);
    // Apply saved settings
    if (window.__applySettings) window.__applySettings();
    // Gate the profiler instead of always displaying it:
    debugEnabled =
      import.meta.env.DEV ||
      new URLSearchParams(location.search).get('debug') === '1';
    if (debugEnabled) initFPSDisplay(renderer, scene);
    console.log('[INIT] UI initialized — game ready!');
  } catch(err) {
    console.error('[INIT] CRASH:', err);
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;top:0;left:0;right:0;background:red;color:white;padding:16px;z-index:99999;font-family:monospace;font-size:16px;white-space:pre-wrap;';
    div.textContent = 'GAME CRASH: ' + err.message + '\n' + err.stack;
    document.body.appendChild(div);
  }
}

function applySave(game, save) {
  // Remove default starting units & set state from save
  for (const u of [...game.playerUnits, ...game.enemyUnits]) game.scene.remove(u.mesh);
  game.playerUnits = []; game.enemyUnits = [];

  game.money = save.money;
  game.formation = save.formation;
  game.upgrades.deserialize(save.upgrades);
  document.getElementById('formationSelect').value = save.formation;

  // Restore base ownership & HP
  for (let i = 0; i < save.bases.length && i < game.bases.length; i++) {
    const sb = save.bases[i];
    const b  = game.bases[i];
    if (sb.faction !== b.faction) {
      b.faction = sb.faction;
      const flagColor = sb.faction === 'player' ? 0x2266aa : 0xaa3333;
      b.mesh.children.forEach(c => {
        if (c.userData?.isFlag) {
          c.material.color.setHex(flagColor);
        }
      });
    }
    b.hp = sb.hp;
  }

  // Restore units
  for (const su of save.playerUnits) {
    const u = game.spawn(su.type, 'player', su.pos);
    u.hp = su.hp; u.maxHp = su.maxHp;
    u.mesh.position.set(su.pos.x, su.pos.y, su.pos.z);
    u.mesh.rotation.y = su.rotY;
  }
  for (const su of save.enemyUnits) {
    const u = game.spawn(su.type, 'enemy', su.pos);
    u.hp = su.hp; u.maxHp = su.maxHp;
    u.mesh.position.set(su.pos.x, su.pos.y, su.pos.z);
    u.mesh.rotation.y = su.rotY;
  }

  // Restore fog
  if (save.fog && game.fog) game.fog.deserialize(save.fog);
  if (save.cameraTarget) {
    cameraTarget.x = save.cameraTarget.x;
    cameraTarget.z = save.cameraTarget.z;
  }

  game.flashMessage('📂 Game loaded!');
}

const clock = new THREE.Clock();
let _lastFrameTs = performance.now();
let debugEnabled = false;
let _perfSampleTimer = 0;
const PERF_SAMPLE_INTERVAL = 1;

// Pause expensive simulation while hidden. Rendering may continue at a very low rate
// only if a platform requirement demands it.
let documentVisible = !document.hidden;
document.addEventListener('visibilitychange', () => {
  documentVisible = !document.hidden;
});

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  if (!documentVisible) return;

  const frameStart = performance.now();

  updateCamera(dt);

  if (game) game.update(dt);
  renderer.render(scene, camera);

  if (game) {
    // Phase 0: always-on frame tracking, 1 Hz draw-call sample
    game.recordFrame(performance.now() - frameStart);
    _perfSampleTimer += dt;
    if (_perfSampleTimer >= PERF_SAMPLE_INTERVAL) {
      _perfSampleTimer -= PERF_SAMPLE_INTERVAL;
      game.samplePerf(renderer.info.render.calls);
    }
  }

  if (debugEnabled) {
    // Frame profiling: wall-clock delta since previous frame
    const now = performance.now();
    const frameMs = now - _lastFrameTs;
    _lastFrameTs = now;
    recordFrameTiming(frameMs, 0, 0);
  }
}
animate();

export { scene, camera, renderer };
