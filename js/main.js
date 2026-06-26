import * as THREE from 'three';
import { Game } from './game.js';
import { initInput } from './input.js';
import { initAI }    from './ai.js';
import { initUI }    from './ui.js';
import { Sound }     from './sound.js';
import { loadSaveData, hasSave } from './saveLoad.js';
import { MAP_SIZE }  from './config.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87b8e8);
scene.fog = new THREE.Fog(0x87b8e8, 400, 1000);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2500);
camera.position.set(0, 150, 150);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('gameCanvas').appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambient);
const sun = new THREE.DirectionalLight(0xffffff, 0.9);
sun.position.set(300, 400, 200);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -600; sun.shadow.camera.right = 600;
sun.shadow.camera.top  =  600; sun.shadow.camera.bottom = -600;
scene.add(sun);

const cameraTarget = new THREE.Vector3(-500, 0, 200); // start over player base
const keys = {};
window.addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; Sound.resume(); });
window.addEventListener('keyup',   e => keys[e.key.toLowerCase()] = false);

function updateCamera(dt) {
  const speed = 150 * dt;
  if (keys['w'] || keys['arrowup'])    cameraTarget.z -= speed;
  if (keys['s'] || keys['arrowdown'])  cameraTarget.z += speed;
  if (keys['a'] || keys['arrowleft'])  cameraTarget.x -= speed;
  if (keys['d'] || keys['arrowright']) cameraTarget.x += speed;
  cameraTarget.x = THREE.MathUtils.clamp(cameraTarget.x, -MAP_SIZE/2, MAP_SIZE/2);
  cameraTarget.z = THREE.MathUtils.clamp(cameraTarget.z, -MAP_SIZE/2, MAP_SIZE/2);

  camera.position.x = cameraTarget.x;
  camera.position.z = cameraTarget.z + 150;
  camera.position.y = 150;
  camera.lookAt(cameraTarget.x, 0, cameraTarget.z);
}

// Mouse wheel zoom
window.addEventListener('wheel', e => {
  camera.position.y = THREE.MathUtils.clamp(camera.position.y + e.deltaY * 0.3, 60, 400);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
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
      document.getElementById('hud').classList.remove('hidden');
      startGame(save.difficulty, save);
    }
  });
  menu.appendChild(cont);
}

document.querySelectorAll('#startMenu .btn[data-diff]').forEach(btn => {
  btn.addEventListener('click', () => {
    const diff = btn.dataset.diff;
    document.getElementById('startMenu').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    startGame(diff, null);
    Sound.resume();
  });
});

function startGame(difficulty, saveData) {
  game = new Game(scene, camera, difficulty, cameraTarget);
  game.init();

  if (saveData) {
    applySave(game, saveData);
  }

  initInput(game, camera, renderer);
  initAI(game);
  initUI(game);
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
        if (c.geometry?.type === 'BoxGeometry' && c.position.y > 4) {
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

// ==========================================
// VISUAL DEBUG MODE
// ==========================================
import { LAND_HEIGHT } from './terrain.js';

// Green grid at land height
const landGrid = new THREE.GridHelper(MAP_SIZE, 50, 0x00ff00, 0x00ff00);
landGrid.position.y = LAND_HEIGHT; 
scene.add(landGrid);

// Right-Click Debug Marker
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const clickMarkerGeom = new THREE.SphereGeometry(3, 8, 8);
const clickMarkerMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const clickMarker = new THREE.Mesh(clickMarkerGeom, clickMarkerMat);
clickMarker.visible = false;
scene.add(clickMarker);

// Create an invisible floor for the raycaster to hit reliably
const invisibleFloor = new THREE.Mesh(
  new THREE.PlaneGeometry(MAP_SIZE, MAP_SIZE),
  new THREE.MeshBasicMaterial({ visible: false })
);
invisibleFloor.rotation.x = -Math.PI / 2;
invisibleFloor.position.y = LAND_HEIGHT; // Put it at land level
scene.add(invisibleFloor);

window.addEventListener('contextmenu', (e) => e.preventDefault());

window.addEventListener('mousedown', (e) => {
  if (e.button === 2) { // Right click
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    
    // Test against the invisible floor
    const intersects = raycaster.intersectObject(invisibleFloor);
    
    if (intersects.length > 0) {
      const point = intersects[0].point;
      
      // Move the red marker to where we clicked!
      clickMarker.position.copy(point);
      clickMarker.visible = true;
      
      console.log("🎯 RIGHT CLICK HIT! World Coordinates:", point);
      console.log("   Is Y equal to LAND_HEIGHT (" + LAND_HEIGHT + ")?", point.y.toFixed(2));
      
      // If a game exists, try to move selected units to this point
      if (game && game.selectedUnits && game.selectedUnits.length > 0) {
        game.selectedUnits.forEach(u => {
          if (u.moveTo) u.moveTo(point);
        });
      }
    } else {
      console.log("❌ RIGHT CLICK MISSED! Raycaster didn't hit the invisible floor.");
    }
  }
});

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  updateCamera(dt);
  if (game) game.update(dt);
  renderer.render(scene, camera);
}
animate();

export { scene, camera, renderer };
