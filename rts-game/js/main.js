// main.js — Three.js setup, render loop, and entry point.
import * as THREE from 'three';
import { Game }   from './game.js';
import { initInput } from './input.js';
import { initUI }    from './ui.js';

// ---------- Scene / Camera / Renderer ----------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87b8e8);
scene.fog = new THREE.Fog(0x87b8e8, 200, 600);

const camera = new THREE.PerspectiveCamera(
  60, window.innerWidth / window.innerHeight, 0.1, 1500
);
camera.position.set(0, 120, 120);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
document.getElementById('gameCanvas').appendChild(renderer.domElement);

// ---------- Lighting ----------
const ambient = new THREE.AmbientLight(0xffffff, 0.55);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 0.9);
sun.position.set(150, 200, 100);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -300; sun.shadow.camera.right = 300;
sun.shadow.camera.top  =  300; sun.shadow.camera.bottom = -300;
scene.add(sun);

// ---------- Camera pan controls (WASD / edge scroll) ----------
const cameraTarget = new THREE.Vector3(0, 0, 0);
const keys = {};
window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup',   e => keys[e.key.toLowerCase()] = false);

function updateCamera(dt) {
  const speed = 80 * dt;
  if (keys['w'] || keys['arrowup'])    cameraTarget.z -= speed;
  if (keys['s'] || keys['arrowdown'])  cameraTarget.z += speed;
  if (keys['a'] || keys['arrowleft'])  cameraTarget.x -= speed;
  if (keys['d'] || keys['arrowright']) cameraTarget.x += speed;
  cameraTarget.x = THREE.MathUtils.clamp(cameraTarget.x, -250, 250);
  cameraTarget.z = THREE.MathUtils.clamp(cameraTarget.z, -250, 250);

  camera.position.x = cameraTarget.x;
  camera.position.z = cameraTarget.z + 120;
  camera.lookAt(cameraTarget.x, 0, cameraTarget.z);
}

// ---------- Resize ----------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------- Start Menu Hook ----------
let game = null;
document.querySelectorAll('#startMenu .btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const diff = btn.dataset.diff;
    document.getElementById('startMenu').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    startGame(diff);
  });
});

function startGame(difficulty) {
  game = new Game(scene, camera, difficulty);
  game.init();
  initInput(game, camera, renderer);
  initUI(game);
}

// ---------- Main Render Loop ----------
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  updateCamera(dt);
  if (game) game.update(dt);

  renderer.render(scene, camera);
}
animate();

export { scene, camera, renderer };
