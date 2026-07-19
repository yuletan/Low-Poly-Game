// game.js — Game orchestration: state, bases, units, placement, formations, main loop.
import * as THREE from 'three';
import { UNIT_TYPES, DIFFICULTY, STARTING_MONEY, PASSIVE_INCOME, TERRAIN, MAP_SIZE, AI_WAVE_MAX_HOLD, activePreset } from './config.js?v=7';
import { LAND_HEIGHT, buildTerrain } from './terrain.js?v=3';
import { createUnitMesh } from './unitFactory.js?v=3';
import { updateExplosions, updateAllTrails, acquireFromPool, releaseToPool } from './combat.js?v=3';
import { Pathfinder } from './pathfinder.js?v=4';
import { FogOfWar } from './fogOfWar.js?v=3';
import { Minimap } from './minimap.js';
import { UpgradeManager } from './upgrades.js';
import { Sound } from './sound.js';
import { tlog as _tlog } from './debug.js';
import { Unit } from './unit.js';
import { Base } from './base.js';

// Re-export so existing imports from './game.js' (and the test suite) keep working.
export { Unit, Base };

export class Game {
  constructor(scene, camera, difficulty, cameraTarget) {
    this.scene = scene;
    this.camera = camera;
    this.cameraTarget = cameraTarget;     // shared with main.js
    this.difficulty = difficulty;
    this.diffConfig = DIFFICULTY[difficulty];

    this.money = STARTING_MONEY;
    this.playerUnits = [];
    this.enemyUnits  = [];
    this.bases = [];
    this.projectiles = [];
    this.deadUnits = [];
    // Task 9: registry of in-flight AI amphibious attack waves
    this._aiWaves = new Map();

    this.selectedUnits = [];
    this.formation = 'line';
    this.attackMoveMode = false;

    this.aiTimer = 0;
    this.ended = false;
    this.fogUpdateTimer = 0;
    this.paused = false;
    this.selectedBuilding = null;

    this.placementMode = { active: false, type: null, ghost: null, ring: null, isValid: false, previewPos: null };
    this._currentTime = 0;

    // Performance throttling timers (read from activePreset each frame)
    this._softCollisionTimer = 0;
    this._minimapTimer = 0;
    this._hudTimer = 0;
  }

  init() {
    this.scene.userData.game = this;
    this.terrain    = buildTerrain(this.scene);
    this.pathfinder = new Pathfinder(this.terrain);
    this.upgrades   = new UpgradeManager(this);
    this.fog        = new FogOfWar(this.scene);
    this.minimap    = new Minimap(this, this.camera);
    Sound.init();

    this.createBases();
    this.spawnStartingArmy();

    const diffEl = document.getElementById('difficulty');
    if (diffEl) diffEl.textContent = `Difficulty: ${this.difficulty.toUpperCase()}`;
    const basesTotalEl = document.getElementById('basesTotal');
    if (basesTotalEl) basesTotalEl.textContent = this.bases.length;
  }

  createBases() {
    // Player HQ Ã¢â‚¬â€ far west, on coast of west continent
    this.bases.push(new Base(this, 'player', { x:-500, z: 200 }, 1.8, 'Player HQ'));
    // Enemy bases spread across the bigger world
    this.bases.push(new Base(this, 'enemy', { x:-300, z:-200 }, 1.0, 'Outpost Alpha'));
    this.bases.push(new Base(this, 'enemy', { x:-250, z: 350 }, 1.0, 'Outpost Bravo'));
    this.bases.push(new Base(this, 'enemy', { x:  50, z:-400 }, 1.2, 'Northern Fort'));
    this.bases.push(new Base(this, 'enemy', { x: 250, z: 100 }, 1.3, 'Coastal Garrison'));
    this.bases.push(new Base(this, 'enemy', { x: 200, z: 380 }, 1.0, 'Island Watch'));
    this.bases.push(new Base(this, 'enemy', { x: 450, z:-100 }, 2.2, 'Main Base'));

    // Create territory rings for each base
    for (const b of this.bases) {
      const color = b.faction === 'player' ? 0x2266aa : 0xaa3333;
      const geom = new THREE.CircleGeometry(b.territory, 48);
      const mat = new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false
      });
      b.territoryRing = new THREE.Mesh(geom, mat);
      b.territoryRing.rotation.x = -Math.PI / 2;
      b.territoryRing.position.set(b.mesh.position.x, b.mesh.position.y + 0.15, b.mesh.position.z);
      this.scene.add(b.territoryRing);
    }
  }

  spawnStartingArmy() {
    const phq = this.bases[0].mesh.position;
    this.spawn('tank',     'player', { x:phq.x+20, z:phq.z+10 });
    this.spawn('tank',     'player', { x:phq.x+30, z:phq.z+10 });
    this.spawn('infantry', 'player', { x:phq.x+20, z:phq.z+25 });
    this.spawn('infantry', 'player', { x:phq.x+30, z:phq.z+25 });
    for (const b of this.bases) {
      if (b.faction !== 'enemy') continue;
      const p = b.mesh.position;
      this.spawn('infantry','enemy', { x:p.x+10, z:p.z+10 });
      this.spawn('tank',    'enemy', { x:p.x-10, z:p.z+10 });
    }
  }

  spawn(type, faction, position) {
    const u = new Unit(this, type, faction, position);
    (faction === 'player' ? this.playerUnits : this.enemyUnits).push(u);
    return u;
  }

  purchaseUnit(type) {
    const stats = UNIT_TYPES[type];
    const cost = stats.cost;
    console.log('[BUY]', type, 'cost:', cost, 'money:', Math.floor(this.money));
    if (this.money < cost) {
      this.flashMessage(`Not enough $ for ${type} ($${cost})`);
      return false;
    }
    const hq = this.bases.find(b => b.faction === 'player');
    if (!hq) { console.error('[BUY] No player HQ!'); return false; }
    const spawnPos = this.findValidSpawn(hq.mesh.position, stats.domain);
    if (!spawnPos) {
      console.error('[BUY] No valid spawn for', type);
      this.flashMessage(`No valid spawn location for ${type}!`);
      return false;
    }
    console.log('[BUY] Spawning at', spawnPos.x.toFixed(1), spawnPos.y.toFixed(1), spawnPos.z.toFixed(1));
    this.money -= cost;
    const u = this.spawn(type, 'player', spawnPos);
    console.log('[BUY] Spawned! playerUnits:', this.playerUnits.length);
    this.spawnMuzzleFlash(u.mesh.position.clone().add(new THREE.Vector3(0, 3, 0)));
    this.spawnSpawnMarker(spawnPos);
    Sound.play('build');
    this.flashMessage(`Built ${type.toUpperCase()} ($${cost})`);
    this.pingMinimap(spawnPos.x, spawnPos.z);
    if (this.fog) {
      this.fog.update(this.playerUnits, this.bases.filter(b => b.faction === 'player'));
    }
    // Auto-select the newly created unit and center camera on it
    u.setSelected(true);
    if (!this.selectedUnits.includes(u)) this.selectedUnits.push(u);
    this.cameraTarget.x = u.mesh.position.x;
    this.cameraTarget.z = u.mesh.position.z;
    return true;
  }

  spawnSpawnMarker(pos) {
    const ring = acquireFromPool('spawnMarker', () => {
      const m = new THREE.Mesh(
        new THREE.RingGeometry(4, 6, 32),
        new THREE.MeshBasicMaterial({ color: 0x44ff88, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
      );
      m.rotation.x = -Math.PI / 2;
      return m;
    }, 8);
    ring.position.set(pos.x, 0.5, pos.z);
    ring.scale.set(1, 1, 1);
    ring.material.opacity = 0.8;
    ring.userData.life = 2.0;
    this.scene.add(ring);
    this.scene.userData.spawnMarkers = this.scene.userData.spawnMarkers || [];
    this.scene.userData.spawnMarkers.push(ring);
  }

  pingMinimap(x, z) {
    if (!this.minimap) return;
    const ctx = this.minimap.ctx;
    const { x: mx, y: mz } = this.minimap.worldToMini(x, z);
    const ping = { x: mx, y: mz, radius: 4, life: 1.5, maxLife: 1.5 };
    this.minimap.pings = this.minimap.pings || [];
    this.minimap.pings.push(ping);
  }

  findValidSpawn(origin, domain) {
    if (domain === 'air') {
      const angle = Math.random() * Math.PI * 2;
      return new THREE.Vector3(
        origin.x + Math.cos(angle) * 25,
        UNIT_TYPES.fighter.altitude,
        origin.z + Math.sin(angle) * 25
      );
    }
    const validTerrains = domain === 'sea'
      ? [TERRAIN.SEA]
      : [TERRAIN.LAND, TERRAIN.COAST];
    for (let radius = 15; radius <= 200; radius += 8) {
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2 + Math.random() * 0.2;
        const x = origin.x + Math.cos(angle) * radius;
        const z = origin.z + Math.sin(angle) * radius;
        const t = this.terrain.getTerrainAt(x, z);
        if (validTerrains.includes(t)) {
          let blocked = false;
          for (const mt of this.terrain.mountains) {
            if (Math.hypot(x - mt.x, z - mt.z) < mt.r + 3) { blocked = true; break; }
          }
          if (!blocked) {
            const spawnY = domain === 'sea' ? 0.3 : LAND_HEIGHT + 0.5;
            return new THREE.Vector3(x, spawnY, z);
          }
        }
      }
    }
    return null;
  }

  // ============================================================
  //  PLACEMENT MODE Ã¢â‚¬â€ click-to-place after buying a unit
  // ============================================================
  enterPlacementMode(type, groupPlace) {
    const stats = UNIT_TYPES[type];
    const unitCost = stats.cost;
    const cost = groupPlace ? unitCost * 5 : unitCost;
    if (this.money < cost) {
      this.flashMessage(`Not enough $ for ${groupPlace ? '5Ãƒâ€” ' : ''}${type} ($${cost})`);
      return false;
    }

    // Remove existing ghost if any
    this.exitPlacementMode(true);

    // Create ghost mesh
    const ghost = createUnitMesh(type, stats.color, 'player');
    ghost.traverse(child => {
      if (child.material) {
        child.material = child.material.clone();
        child.material.transparent = true;
        child.material.opacity = 0.5;
      }
    });
    this.scene.add(ghost);

    // Validity ring
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(4, 4.5, 24),
      new THREE.MeshBasicMaterial({ color: 0x44ff88, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.2;
    ghost.add(ring);

    // Group placement: show 5 small markers in a circle
    const groupMarkers = [];
    if (groupPlace) {
      const markerMat = new THREE.MeshBasicMaterial({ color: 0x44ff88, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const mx = Math.cos(a) * 10;
        const mz = Math.sin(a) * 10;
        const m = new THREE.Mesh(new THREE.RingGeometry(3, 3.5, 16), markerMat);
        m.rotation.x = -Math.PI / 2;
        m.position.set(mx, 0.2, mz);
        ghost.add(m);
        groupMarkers.push(m);
      }
    }

    this.placementMode = {
      active: true, type, ghost, ring, groupMarkers, groupPlace: !!groupPlace,
      isValid: false, previewPos: null, cost, unitCost
    };

    this._showPlacementIndicator(type);
    this._setBuyButtonsDisabled(true);
    this.flashMessage(groupPlace ? `Ctrl+Click to place 5Ãƒâ€” ${type.toUpperCase()} ($${cost})` : `Click to place ${type.toUpperCase()}`);
    return true;
  }

  exitPlacementMode(canceled) {
    if (!this.placementMode.active) return;
    if (this.placementMode.ghost) {
      this.scene.remove(this.placementMode.ghost);
      this.placementMode.ghost = null;
    }
    this.placementMode = { active: false, type: null, ghost: null, ring: null, isValid: false, previewPos: null };
    this._hidePlacementIndicator();
    this._setBuyButtonsDisabled(false);
  }

  updatePlacementPreview(pos) {
    if (!this.placementMode.active || !this.placementMode.ghost) return;

    // Fleet placement: move ghost group, validate center
    if (this.placementMode.type === 'fleet') {
      this.placementMode.ghost.position.set(pos.x, 0, pos.z);
      this.placementMode.previewPos = pos;
      const valid = this.isValidPlacement(pos.x, pos.z, 'sea');
      this.placementMode.isValid = valid;
      this.placementMode.ring.material.color.setHex(valid ? 0x44ff88 : 0xff4444);
      return;
    }

    const stats = UNIT_TYPES[this.placementMode.type];
    const domain = stats.domain;
    const y = domain === 'air' ? stats.altitude : (domain === 'sea' ? 0.3 : LAND_HEIGHT + 0.5);

    this.placementMode.ghost.position.set(pos.x, y, pos.z);
    this.placementMode.previewPos = pos;

    const pm = this.placementMode;
    let valid = this.isValidPlacement(pos.x, pos.z, domain);
    if (pm.groupPlace && valid) {
      // Validate all 5 circle positions
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const cx = pos.x + Math.cos(a) * 10;
        const cz = pos.z + Math.sin(a) * 10;
        if (!this.isValidPlacement(cx, cz, domain)) {
          valid = false;
          if (pm.groupMarkers?.[i]) pm.groupMarkers[i].material.color.setHex(0xff4444);
        } else if (pm.groupMarkers?.[i]) {
          pm.groupMarkers[i].material.color.setHex(0x44ff88);
        }
      }
    }
    pm.isValid = valid;
    pm.ring.material.color.setHex(valid ? 0x44ff88 : 0xff4444);
  }

  confirmPlacement(pos) {
    if (!this.placementMode.active) return false;
    if (!pos) return false;

    // Fleet placement has its own handler
    if (this.placementMode.type === 'fleet') return this.confirmFleetPlacement(pos);

    const { type, groupPlace, unitCost } = this.placementMode;
    const stats = UNIT_TYPES[type];
    const domain = stats.domain;
    const y = domain === 'air' ? stats.altitude : (domain === 'sea' ? 0.3 : LAND_HEIGHT + 0.5);

    if (groupPlace) {
      // Validate all 5 circle positions
      const positions = [];
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const x = pos.x + Math.cos(a) * 10;
        const z = pos.z + Math.sin(a) * 10;
        if (!this.isValidPlacement(x, z, domain)) {
          this.flashMessage('Not enough space for group placement');
          return false;
        }
        positions.push({ x, z });
      }
      // Spawn all 5
      this.money -= unitCost * 5;
      for (const p of positions) {
        const u = this.spawn(type, 'player', p);
        u.mesh.position.y = y;
        this.spawnMuzzleFlash(u.mesh.position.clone().add(new THREE.Vector3(0, 3, 0)));
        this.spawnSpawnMarker(u.mesh.position.clone());
      }
      Sound.play('build');
      this.flashMessage(`Built 5Ãƒâ€” ${type.toUpperCase()} ($${unitCost * 5})`);
      this.pingMinimap(pos.x, pos.z);
    } else {
      if (!this.isValidPlacement(pos.x, pos.z, domain)) {
        this.flashMessage('Cannot place here Ã¢â‚¬â€ invalid location');
        return false;
      }
      this.money -= unitCost;
      const u = this.spawn(type, 'player', { x: pos.x, z: pos.z });
      u.mesh.position.y = y;
      this.spawnMuzzleFlash(u.mesh.position.clone().add(new THREE.Vector3(0, 3, 0)));
      this.spawnSpawnMarker(u.mesh.position.clone());
      Sound.play('build');
      this.flashMessage(`Built ${type.toUpperCase()} ($${unitCost})`);
      this.pingMinimap(pos.x, pos.z);
    }

    if (this.fog) {
      this.fog.update(this.playerUnits, this.bases.filter(b => b.faction === 'player'));
    }
    this.exitPlacementMode(false);
    return true;
  }

  enterFleetPlacementMode() {
    const escortTypes = ['destroyer', 'destroyer', 'frigate', 'frigate', 'battleship', 'cruiser', 'cruiser'];
    const totalCost = escortTypes.reduce((sum, t) => sum + UNIT_TYPES[t].cost, 0) + UNIT_TYPES.carrier.cost;
    if (this.money < totalCost) {
      this.flashMessage(`Need $${totalCost} for fleet (have $${Math.floor(this.money)})`);
      return false;
    }

    this.exitPlacementMode(true);

    // Create ghost group with carrier + escort markers
    const ghost = new THREE.Group();
    const markerMat = new THREE.MeshBasicMaterial({ color: 0x44ff88, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    // Carrier center marker
    const cvMarker = new THREE.Mesh(new THREE.RingGeometry(4, 5, 24), markerMat.clone());
    cvMarker.rotation.x = -Math.PI / 2;
    cvMarker.position.y = 0.2;
    ghost.add(cvMarker);
    // Escort markers in ring
    const radius = 25;
    const escortMarkers = [];
    for (let i = 0; i < escortTypes.length; i++) {
      const a = (i / escortTypes.length) * Math.PI * 2;
      const m = new THREE.Mesh(new THREE.RingGeometry(2.5, 3, 16), markerMat.clone());
      m.rotation.x = -Math.PI / 2;
      m.position.set(Math.cos(a) * radius, 0.2, Math.sin(a) * radius);
      ghost.add(m);
      escortMarkers.push(m);
    }
    this.scene.add(ghost);

    // Validity ring
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(30, 31, 32),
      new THREE.MeshBasicMaterial({ color: 0x44ff88, side: THREE.DoubleSide, transparent: true, opacity: 0.5 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.2;
    ghost.add(ring);

    this.placementMode = {
      active: true, type: 'fleet', ghost, ring, escortMarkers, escortTypes, totalCost,
      isValid: false, previewPos: null
    };
    this.flashMessage(`Click water to place fleet ($${totalCost})`);
    return true;
  }

  confirmFleetPlacement(pos) {
    if (!this.placementMode.active || this.placementMode.type !== 'fleet') return false;
    if (!pos) return false;

    const { escortTypes, totalCost } = this.placementMode;
    if (this.money < totalCost) {
      this.flashMessage('Not enough money');
      return false;
    }

    // Validate center position is sea
    if (!this.isValidPlacement(pos.x, pos.z, 'sea')) {
      this.flashMessage('Cannot place fleet here');
      return false;
    }

    this.money -= totalCost;

    // Spawn carrier at center
    const cv = this.spawn('carrier', 'player', new THREE.Vector3(pos.x, 0.3, pos.z));

    // Spawn escorts in ring
    const radius = 25;
    const spawned = [cv];
    for (let i = 0; i < escortTypes.length; i++) {
      const a = (i / escortTypes.length) * Math.PI * 2;
      const ex = pos.x + Math.cos(a) * radius;
      const ez = pos.z + Math.sin(a) * radius;
      const u = this.spawn(escortTypes[i], 'player', new THREE.Vector3(ex, 0.3, ez));
      u._fleetCarrier = cv;
      u._fleetOffset = new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
      spawned.push(u);
    }
    cv._fleetEscorts = spawned.slice(1);
    cv._fleetFormation = true;

    Sound.play('build');
    this.flashMessage(`Fleet deployed! -$${totalCost}`);
    this.pingMinimap(pos.x, pos.z);
    this.exitPlacementMode(false);
    return true;
  }

  getTerritoryAt(x, z) {
    let closest = null, closestDist = Infinity;
    for (const b of this.bases) {
      if (!b.alive) continue;
      const d = Math.hypot(x - b.mesh.position.x, z - b.mesh.position.z);
      if (d < b.territory && d < closestDist) {
        closest = b;
        closestDist = d;
      }
    }
    return closest ? { base: closest, faction: closest.faction } : null;
  }

  isValidPlacement(x, z, domain) {
    // Map bounds
    const half = MAP_SIZE / 2;
    if (x < -half + 5 || x > half - 5 || z < -half + 5 || z > half - 5) {
      return false;
    }

    // Terrain check (non-air)
    if (domain !== 'air') {
      const terrain = this.terrain.getTerrainAt(x, z);
      const validTerrains = domain === 'sea'
        ? [TERRAIN.SEA]
        : [TERRAIN.LAND, TERRAIN.COAST];
      if (!validTerrains.includes(terrain)) {
        return false;
      }

      // Mountain overlap
      for (const mt of this.terrain.mountains) {
        if (Math.hypot(x - mt.x, z - mt.z) < mt.r + 3) {
          return false;
        }
      }
    }

    // Unit collision (both factions)
    for (const u of [...this.playerUnits, ...this.enemyUnits]) {
      if (!u.alive) continue;
      if (Math.hypot(x - u.mesh.position.x, z - u.mesh.position.z) < 4) {
        return false;
      }
    }

    // Base collision
    for (const b of this.bases) {
      if (!b.alive) continue;
      const dist = Math.hypot(x - b.mesh.position.x, z - b.mesh.position.z);
      if (dist < 15) {
        return false;
      }
    }

    // Territory check (non-air units must be in player territory)
    if (domain === 'land') {
      const terr = this.getTerritoryAt(x, z);
      if (!terr || terr.faction !== 'player') {
        return false;
      }
    }

    return true;
  }

  _showPlacementIndicator(type) {
    let el = document.getElementById('placementIndicator');
    if (!el) {
      el = document.createElement('div');
      el.id = 'placementIndicator';
      document.body.appendChild(el);
    }
    el.textContent = `Placing: ${type.toUpperCase()} Ã¢â‚¬â€ Click to place, Right-click / Esc to cancel`;
    el.classList.remove('hidden');
  }

  _hidePlacementIndicator() {
    const el = document.getElementById('placementIndicator');
    if (el) el.classList.add('hidden');
  }

  _setBuyButtonsDisabled(disabled) {
    const btns = document.querySelectorAll('#armoryContent .unitBtn[data-unit-type]');
    btns.forEach(b => { b.disabled = disabled; });
  }

  flashMessage(text) {
    let el = document.getElementById('flashMsg');
    if (!el) {
      el = document.createElement('div');
      el.id = 'flashMsg';
      el.style.cssText = `
        position:fixed; top:60px; left:50%; transform:translateX(-50%);
        background:rgba(170,40,40,0.9); color:#fff; padding:8px 16px;
        border-radius:6px; font-family:monospace; z-index:100;
        pointer-events:none; transition:opacity 0.3s;
      `;
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.style.opacity = '1';
    clearTimeout(this._flashT);
    this._flashT = setTimeout(() => { el.style.opacity = '0'; }, 1800);
  }

  queueDeath(u) { this.deadUnits.push(u); }

  spawnMuzzleFlash(pos) {
    const f = acquireFromPool('muzzleFlash', () => new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xffee44 })
    ), 16);
    f.position.copy(pos);
    f.scale.set(1, 1, 1);
    f.userData.life = 0.08;
    this.scene.add(f);
    this.scene.userData.flashes = this.scene.userData.flashes || [];
    this.scene.userData.flashes.push(f);
  }

  update(dt) {
    if (this.ended || this.paused) return;
    this._currentTime += dt;

    const owned = this.bases.filter(b => b.faction === 'player').length;
    this.money += PASSIVE_INCOME * owned * dt;

    // Update all entities
    for (const u of this.playerUnits) u.update(dt);
    for (const u of this.enemyUnits)  u.update(dt);
    for (const b of this.bases) b.update(dt);

    // Auto-spawn transports for troops waiting on beach
    this._updateTransportLogistics(dt);

    // Soft unit collision (gentle nudge) — throttled by preset
    const scInterval = activePreset.softCollisionInterval;
    if (scInterval > 0) {
      this._softCollisionTimer += dt;
      if (this._softCollisionTimer >= scInterval) {
        this._softCollisionTimer = 0;
        this._applySoftCollision(this.playerUnits);
        this._applySoftCollision(this.enemyUnits);
      }
    }

    // Update projectiles
    for (let i = this.projectiles.length-1; i>=0; i--) {
      const p = this.projectiles[i];
      p.update(dt);
      if (!p.alive) this.projectiles.splice(i,1);
    }

    // Update FX
    updateExplosions(this.scene, dt);
    updateAllTrails(this.scene, dt);

    // Hit confirm rings
    const hitConfirms = this.scene.userData.hitConfirms || [];
    for (let i = hitConfirms.length - 1; i >= 0; i--) {
      const h = hitConfirms[i];
      h.userData.life -= dt;
      const t = 1 - (h.userData.life / h.userData.maxLife);
      h.scale.setScalar(1 + t * 3);
      h.material.opacity = 0.9 * (1 - t);
      if (h.userData.life <= 0) {
        releaseToPool(h);
        hitConfirms.splice(i, 1);
      }
    }

    const flashes = this.scene.userData.flashes || [];
    for (let i=flashes.length-1;i>=0;i--) {
      flashes[i].userData.life -= dt;
      flashes[i].scale.multiplyScalar(0.9);
      if (flashes[i].userData.life <= 0) {
        releaseToPool(flashes[i]); flashes.splice(i,1);
      }
    }

    const spawnMarkers = this.scene.userData.spawnMarkers || [];
    for (let i=spawnMarkers.length-1;i>=0;i--) {
      const m = spawnMarkers[i];
      m.userData.life -= dt;
      m.material.opacity = 0.8 * (m.userData.life / 2.0);
      m.scale.multiplyScalar(1.02);
      if (m.userData.life <= 0) {
        releaseToPool(m); spawnMarkers.splice(i,1);
      }
    }

    // Flak puff cleanup
    const flakPuffs = this.scene.userData.flakPuffs || [];
    for (let i=flakPuffs.length-1;i>=0;i--) {
      const p = flakPuffs[i];
      p.userData.life -= dt;
      p.material.opacity = 0.6 * (p.userData.life / 0.5);
      p.scale.multiplyScalar(1.05);
      if (p.userData.life <= 0) {
        releaseToPool(p); flakPuffs.splice(i,1);
      }
    }

    // Carrier fighters: handled by per-unit _fighterAutoReturn in Unit.update()

    if (this.minimap && this.minimap.pings) {
      for (let i=this.minimap.pings.length-1;i>=0;i--) {
        const p = this.minimap.pings[i];
        p.life -= dt;
        if (p.life <= 0) this.minimap.pings.splice(i,1);
      }
    }

    // Cleanup dead units
    const deadCount = this.deadUnits.length;
    this.playerUnits = this.playerUnits.filter(u => !u._cleaned);
    this.enemyUnits  = this.enemyUnits.filter(u => !u._cleaned);
    this.selectedUnits = this.selectedUnits.filter(u => u.alive);

    // AI
    this.aiTimer += dt;
    if (this.onAITick) this.onAITick(dt);

    // Fog of war — throttled by preset
    this.fogUpdateTimer += dt;
    if (this.fogUpdateTimer > activePreset.fogUpdateInterval && this.fog) {
      this.fog.update(this.playerUnits, this.bases.filter(b => b.faction === 'player'));
      this.fogUpdateTimer = 0;
    }

    // Minimap — throttled by preset (0 = disabled)
    const minimapTargetFPS = activePreset.minimapFPS;
    if (minimapTargetFPS > 0 && this.minimap) {
      this._minimapTimer += dt;
      const minimapInterval = 1 / minimapTargetFPS;
      if (this._minimapTimer >= minimapInterval) {
        this._minimapTimer = 0;
        this.minimap.draw();
      }
    } else if (minimapTargetFPS === 0 && this.minimap) {
      if (!this._minimapDrawnOnce) {
        this.minimap.draw();
        this._minimapDrawnOnce = true;
      }
    }
    // HUD — throttled by preset (DOM work every frame is expensive)
    const hudInterval = activePreset.uiCheckInterval / 1000; // ms -> s
    this._hudTimer += dt;
    if (this._hudTimer >= hudInterval) {
      this._hudTimer = 0;
      this.updateHUD();
    }
  }

  updateHUD() {
    const owned = this.bases.filter(b => b.faction === 'player').length;
    const moneyEl = document.getElementById('money');
    const incomeEl = document.getElementById('income');
    const unitCountEl = document.getElementById('unitCount');
    const basesOwnedEl = document.getElementById('basesOwned');
    const enemyCountEl = document.getElementById('enemyCount');
    if (moneyEl) moneyEl.textContent = Math.floor(this.money);
    if (incomeEl) incomeEl.textContent = `+${PASSIVE_INCOME * owned}/s`;
    if (unitCountEl) unitCountEl.textContent = this.playerUnits.length;
    if (basesOwnedEl) basesOwnedEl.textContent = owned;
    const enemyAlive = this.enemyUnits.filter(u => u.alive && u.state !== 'dead');
    if (enemyCountEl) enemyCountEl.textContent = enemyAlive.length;
    // Live refresh of selection HP/status
    this.updateSelectionUI?.();
  }

  _updateTransportLogistics(dt) {
    for (const faction of ['player', 'enemy']) {
      const units = faction === 'player' ? this.playerUnits : this.enemyUnits;

      // 1. Count unclaimed waiting troops (exclude transports)
      let waitingCount = 0;
      let embarkSumX = 0, embarkSumZ = 0, embarkCount = 0;
      for (const u of units) {
        if (u.alive && !u.isTransport && u.domain === 'land' && u.state === 'waitingForTransport' && !u._claimedByShip) {
          waitingCount++;
          const ep = u._transportData?.shipEmbarkPoint;
          if (ep) { embarkSumX += ep.x; embarkSumZ += ep.z; embarkCount++; }
        }
      }

      if (waitingCount > 0) {
        // 2. Count ships actively heading to pick up troops
        let activeShips = 0;
        for (const u of units) {
          if (u.alive && u.isTransport && u._assignedEmbarkPoint && u.carriedUnits.length < u.transportCapacity) {
            activeShips++;
          }
        }

        // 3. Spawn ships: 1 per 10 troops, minimum 1
        const neededShips = Math.max(1, Math.ceil(waitingCount / (UNIT_TYPES.transport.transportCapacity || 10)));
        const shipsToSpawn = neededShips - activeShips;
        _tlog(`[TRANS LOG] ${faction} transport check: waiting=${waitingCount} activeShips=${activeShips} needed=${neededShips} toSpawn=${shipsToSpawn}`);
        if (shipsToSpawn > 0) {
          const cost = UNIT_TYPES.transport.cost;

          // Pre-position ships at the sea tile nearest the embark coast
          // where troops are waiting, instead of spawning at a far base.
          let spawnPos = null;
          if (embarkCount > 0) {
            const avgX = embarkSumX / embarkCount;
            const avgZ = embarkSumZ / embarkCount;
            const g = this.pathfinder.worldToGrid(avgX, avgZ);
            const seaTile = this.pathfinder.findNearestWalkable(g.gx, g.gy, 'sea');
            if (seaTile) {
              const w = this.pathfinder.gridToWorld(seaTile.gx, seaTile.gy);
              spawnPos = new THREE.Vector3(w.x, 0.3, w.z);
            }
          }

          // Fallback: spawn near a base (when no embark data available)
          if (!spawnPos) {
            const bases = this.bases.filter(b => b.faction === faction && b.alive);
            for (const base of bases) {
              const pos = this.findValidSpawn(base.mesh.position, 'sea');
              if (pos) { spawnPos = pos; break; }
            }
          }

          if (spawnPos) {
            for (let i = 0; i < shipsToSpawn; i++) {
              const money = faction === 'player' ? this.money : Infinity;
              if (money < cost) { _tlog(`[TRANS LOG] ${faction}: BROKE — need ${cost} have ${money}`); break; }
              if (faction === 'player') this.money -= cost;
              _tlog(`[TRANS LOG] ${faction}: spawning transport at (${spawnPos.x.toFixed(0)},${spawnPos.z.toFixed(0)})`);
              this.spawn('transport', faction, spawnPos);
            }
          } else {
            _tlog(`[TRANS LOG] ${faction}: FAILED to find spawnPos for transport`);
          }
        }
      }
    }
  }

  // Task 9: AI attack-wave transport synchronization
  registerAIWave(waveId, shipsNeeded) {
    this._aiWaves.set(waveId, { shipsNeeded, readyShips: new Set(), firstReadyAt: null });
  }

  shouldHoldForAIWave(ship) {
    if (ship._aiWaveId == null) return false;
    const wave = this._aiWaves.get(ship._aiWaveId);
    if (!wave) return false;
    wave.readyShips.add(ship);
    if (wave.firstReadyAt == null) wave.firstReadyAt = this._currentTime;
    const allReady = wave.readyShips.size >= wave.shipsNeeded;
    const waitedTooLong = (this._currentTime - wave.firstReadyAt) > AI_WAVE_MAX_HOLD;
    if (allReady || waitedTooLong) {
      this._aiWaves.delete(ship._aiWaveId);
      return false;
    }
    return true;
  }

  checkWinCondition() {
    const playerBases = this.bases.filter(b => b.faction === 'player').length;
    const enemyBases  = this.bases.filter(b => b.faction === 'enemy').length;
    if (enemyBases === 0) this.endGame(true);
    else if (playerBases === 0) this.endGame(false);
  }

  endGame(victory) {
    this.ended = true;
    document.getElementById('endScreen').classList.remove('hidden');
    document.getElementById('endTitle').textContent = victory ? 'Ã°Å¸Ââ€  Victory!' : 'Ã°Å¸â€™â‚¬ Defeat';
  }

  _formationUnitsCenter(units) {
    const live = (units || []).filter(u => u?.alive && u.mesh);
    if (live.length === 0) return new THREE.Vector3();
    const center = new THREE.Vector3();
    for (const u of live) center.add(u.mesh.position);
    return center.multiplyScalar(1 / live.length);
  }

  _formationForward(units, targetCenter) {
    const from = this._formationUnitsCenter(units);
    const dx = targetCenter.x - from.x;
    const dz = targetCenter.z - from.z;
    const len = Math.hypot(dx, dz);
    if (len > 0.001) return new THREE.Vector3(dx / len, 0, dz / len);
    return new THREE.Vector3(0, 0, -1);
  }

  _formationSpacing(units) {
    if (!Array.isArray(units) || units.length === 0) return 7;
    let spacing = 6.5;
    for (const u of units) {
      if (u.domain === 'sea') spacing = Math.max(spacing, 13);
      else if (u.domain === 'air') spacing = Math.max(spacing, 11);
    }
    if (units.length > 10) spacing += 1;
    return spacing;
  }

  _formationPositionFromOffset(center, localX, localZ, forward) {
    const f = forward?.clone ? forward.clone() : new THREE.Vector3(0, 0, -1);
    f.y = 0;
    if (Math.hypot(f.x, f.z) < 0.001) f.set(0, 0, -1);
    f.normalize();

    // Right vector on the X/Z plane. localZ is forward/back along travel;
    // localX is the cross-line offset.
    const right = new THREE.Vector3(f.z, 0, -f.x);
    return new THREE.Vector3(
      center.x + right.x * localX + f.x * localZ,
      center.y ?? 0,
      center.z + right.z * localX + f.z * localZ
    );
  }

  computeFormation(center, membersOrCount, formation = this.formation, options = {}) {
    const units = Array.isArray(membersOrCount) ? membersOrCount : null;
    const count = units ? units.length : membersOrCount;
    const spacing = options.spacing || this._formationSpacing(units);
    const forward = options.forward || (units ? this._formationForward(units, center) : new THREE.Vector3(0, 0, -1));
    const mode = formation && formation !== 'none' ? formation : 'spread';
    const offsets = [];

    if (count <= 0) return [];

    switch (mode) {
      case 'line':
        for (let i = 0; i < count; i++) {
          offsets.push({ x: (i - (count - 1) / 2) * spacing, z: 0 });
        }
        break;

      case 'column':
        for (let i = 0; i < count; i++) {
          offsets.push({ x: 0, z: (i - (count - 1) / 2) * -spacing });
        }
        break;

      case 'wedge': {
        offsets.push({ x: 0, z: 0 });
        let placed = 1;
        let row = 1;
        while (placed < count) {
          const rowDepth = -row * spacing;
          const rowWidth = row * spacing * 0.75;
          offsets.push({ x: -rowWidth, z: rowDepth });
          placed++;
          if (placed >= count) break;
          offsets.push({ x: rowWidth, z: rowDepth });
          placed++;
          row++;
        }
        break;
      }

      case 'square':
      case 'spread':
      default: {
        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);
        for (let i = 0; i < count; i++) {
          const r = Math.floor(i / cols);
          const c = i % cols;
          offsets.push({
            x: (c - (cols - 1) / 2) * spacing,
            z: (r - (rows - 1) / 2) * spacing
          });
        }
        break;
      }
    }

    return offsets.map(o => this._formationPositionFromOffset(center, o.x, o.z, forward));
  }

  _formationCellKey(domain, gx, gy) {
    return `${domain}:${gx}:${gy}`;
  }

  _resolveFormationTargetForUnit(target, unit, reservedCells) {
    const out = target.clone();
    if (!unit || unit.domain === 'air' || !this.pathfinder) {
      if (unit?.stats?.altitude) out.y = unit.stats.altitude;
      return out;
    }

    const domain = unit.domain === 'sea' ? 'sea' : 'land';
    const start = this.pathfinder.worldToGrid(out.x, out.z);
    const queue = [{ gx: start.gx, gy: start.gy, dist: 0 }];
    const visited = new Set([`${start.gx},${start.gy}`]);
    const dirs = [
      [0,0], [1,0], [-1,0], [0,1], [0,-1],
      [1,1], [-1,1], [1,-1], [-1,-1]
    ];
    const maxRadius = Math.max(4, Math.ceil(54 / this.pathfinder.cell));
    let chosen = null;

    let qi = 0;
    while (qi < queue.length) {
      const cur = queue[qi++];
      if (cur.dist > maxRadius) break;

      const key = this._formationCellKey(domain, cur.gx, cur.gy);
      if (this.pathfinder.walkable(cur.gx, cur.gy, domain) && !reservedCells.has(key)) {
        chosen = cur;
        break;
      }

      for (const [dx, dy] of dirs) {
        if (dx === 0 && dy === 0) continue;
        const nx = cur.gx + dx;
        const ny = cur.gy + dy;
        const visitKey = `${nx},${ny}`;
        if (!this.pathfinder.inBounds(nx, ny) || visited.has(visitKey)) continue;
        visited.add(visitKey);
        queue.push({ gx: nx, gy: ny, dist: cur.dist + 1 });
      }
    }

    if (!chosen) chosen = this.pathfinder.findNearestWalkable(start.gx, start.gy, domain);
    if (!chosen) return out;

    reservedCells.add(this._formationCellKey(domain, chosen.gx, chosen.gy));
    const w = this.pathfinder.gridToWorld(chosen.gx, chosen.gy);
    return new THREE.Vector3(w.x, unit.mesh.position.y ?? 0, w.z);
  }

  assignFormationMoveTargets(units, center, formation = this.formation) {
    const movable = (units || []).filter(u => u?.alive && !u.carried && u.stats?.speed !== 0);
    if (movable.length === 0) return [];

    const forward = this._formationForward(movable, center);
    const rawSlots = this.computeFormation(center, movable, formation, { forward });
    const remainingUnits = [...movable];
    const remainingSlots = rawSlots.map((position, index) => ({ position, index }));
    const reservedCells = new Set();
    const assignments = [];

    // Stable greedy assignment keeps nearby units heading to nearby slots, so
    // group movement looks cohesive and avoids units crossing through each other.
    while (remainingUnits.length > 0 && remainingSlots.length > 0) {
      let bestU = 0;
      let bestS = 0;
      let bestD = Infinity;
      for (let i = 0; i < remainingUnits.length; i++) {
        for (let j = 0; j < remainingSlots.length; j++) {
          const d = remainingUnits[i].mesh.position.distanceTo(remainingSlots[j].position);
          if (d < bestD) {
            bestD = d;
            bestU = i;
            bestS = j;
          }
        }
      }

      const unit = remainingUnits[bestU];
      const slot = remainingSlots[bestS];
      const target = this._resolveFormationTargetForUnit(slot.position, unit, reservedCells);
      assignments.push({ unit, target, slotIndex: slot.index, formation: formation || 'spread' });
      remainingUnits.splice(bestU, 1);
      remainingSlots.splice(bestS, 1);
    }

    return assignments.sort((a, b) => a.slotIndex - b.slotIndex);
  }

  _applySoftCollision(units) {
    for (let i = 0; i < units.length; i++) {
      for (let j = i + 1; j < units.length; j++) {
        const a = units[i], b = units[j];
        if (!a.alive || !b.alive || a.domain === 'air' || b.domain === 'air') continue;
        const dx = b.mesh.position.x - a.mesh.position.x;
        const dz = b.mesh.position.z - a.mesh.position.z;
        const dist = Math.hypot(dx, dz);
        const minDist = (a.domain === 'sea' || b.domain === 'sea') ? 6 : 3.5;
        if (dist >= minDist || dist < 0.01) continue;
        const overlap = minDist - dist;
        if (overlap < 0.5) continue;
        const push = overlap * 0.5;
        const nx = dx / dist, nz = dz / dist;
        a.mesh.position.x -= nx * push;
        a.mesh.position.z -= nz * push;
        b.mesh.position.x += nx * push;
        b.mesh.position.z += nz * push;
      }
    }
    // Validate sea units didn't get pushed onto land by collision
    for (const u of units) {
      if (!u.alive || u.domain !== 'sea' || u._amphibious) continue;
      const t = this.terrain.getTerrainAt(u.mesh.position.x, u.mesh.position.z);
      if (t !== TERRAIN.SEA) {
        const gx = Math.floor((u.mesh.position.x + MAP_SIZE / 2) / 12);
        const gy = Math.floor((u.mesh.position.z + MAP_SIZE / 2) / 12);
        const nearest = this.pathfinder.findNearestWalkable(gx, gy, 'sea');
        if (nearest) {
          const w = this.pathfinder.gridToWorld(nearest.gx, nearest.gy);
          u.mesh.position.x = w.x;
          u.mesh.position.z = w.z;
          // Push nearby units away to prevent re-overlap
          for (const other of units) {
            if (!other.alive || other === u) continue;
            const odx = other.mesh.position.x - u.mesh.position.x;
            const odz = other.mesh.position.z - u.mesh.position.z;
            const odist = Math.hypot(odx, odz);
            if (odist < 6 && odist > 0.01) {
              const pushAway = (6 - odist) * 0.5;
              other.mesh.position.x += (odx / odist) * pushAway;
              other.mesh.position.z += (odz / odist) * pushAway;
            }
          }
        }
      }
    }
  }
}
