// game.js — Game state, Unit class, Base class, and main game loop.
import * as THREE from 'three';
import { UNIT_TYPES, DIFFICULTY, STARTING_MONEY, PASSIVE_INCOME, TERRAIN, MAP_SIZE, CARRIER_FIGHTER_COOLDOWN, CARRIER_FIGHTER_COUNT } from './config.js';
import { LAND_HEIGHT } from './terrain.js';
import { createUnitMesh, createBaseMesh } from './unitFactory.js';
import { buildTerrain } from './terrain.js';
import { Projectile, updateExplosions, applyTerrainBonus } from './combat.js';
import { Pathfinder } from './pathfinder.js';
import { FogOfWar } from './fogOfWar.js';
import { Minimap } from './minimap.js';
import { UpgradeManager } from './upgrades.js';
import { Sound } from './sound.js';

// ============================================================
//  UNIT CLASS — pathfinding, upgrades, carrier ability
// ============================================================
export class Unit {
  constructor(game, type, faction, position) {
    this.game     = game;
    this.type     = type;
    this.faction  = faction;
    // Apply upgrades for player units
    const baseStats = UNIT_TYPES[type];
    this.stats    = faction === 'player'
                     ? game.upgrades.applyTo(baseStats)
                     : { ...baseStats };
    this.domain   = baseStats.domain;
    this.maxHp    = this.stats.hp;
    this.hp       = this.maxHp;
    this.state    = 'idle';
    this.target   = null;
    this.path     = [];          // ← NEW: list of waypoints from A*
    this.moveTarget = null;
    this.cooldown = 0;
    this.alive    = true;
    this.selected = false;

    // Carrier ability
    this.canLaunch = !!baseStats.canLaunchFighters;
    this.launchCooldown = 0;

    this.mesh = createUnitMesh(type, baseStats.color, faction);
    const y = this.domain === 'air' ? baseStats.altitude : (position.y ?? (this.domain === 'sea' ? 0.3 : LAND_HEIGHT + 0.5));
    this.mesh.position.set(position.x, y, position.z);

    const ringGeom = new THREE.RingGeometry(3, 3.5, 16);
    const ringMat  = new THREE.MeshBasicMaterial({
      color: faction === 'player' ? 0x44ff88 : 0xff4444,
      side: THREE.DoubleSide, transparent:true, opacity:0
    });
    this.ring = new THREE.Mesh(ringGeom, ringMat);
    this.ring.rotation.x = -Math.PI/2;
    this.ring.position.y = 0.1;
    this.mesh.add(this.ring);

    game.scene.add(this.mesh);
  }

  setSelected(sel) {
    this.selected = sel;
    this.ring.material.opacity = sel ? 0.9 : 0;
  }

  /** Use A* pathfinder. */
  moveTo(pos) {
    const path = this.game.pathfinder.findPath(this.mesh.position, pos, this.domain);
    if (path && path.length > 0) {
      this.path = path;
      this.moveTarget = this.path.shift();
    } else {
      // Fallback: try direct
      this.moveTarget = pos.clone();
      this.path = [];
    }
    this.state = 'moving';
    this.target = null;
  }

  attack(enemy) {
    this.target = enemy;
    this.state  = 'attacking';
  }

  takeDamage(dmg) {
    this.hp -= dmg;
    if (this.hp <= 0) this.die();
  }

  die() {
    if (!this.alive) return;
    this.alive = false;
    this.state = 'dead';
    Sound.play('explosion');
    if (this.faction === 'enemy') this.game.money += 25;
    this.game.queueDeath(this);
  }

  update(dt) {
    if (!this.alive) { this.updateDeath(dt); return; }
    this.cooldown -= dt;
    if (this.canLaunch) this.launchCooldown -= dt;

    if (this.domain === 'sea') {
      this.mesh.userData.bobPhase += dt * 2;
      this.mesh.position.y = Math.sin(this.mesh.userData.bobPhase) * 0.15 + 0.3;
    }

    if (this.state === 'idle' || (this.state === 'moving' && !this.moveTarget)) {
      this.findTarget();
    }
    switch (this.state) {
      case 'moving':    this.updateMove(dt); break;
      case 'attacking': this.updateAttack(dt); break;
    }
  }

  updateMove(dt) {
    if (!this.moveTarget) {
      // Pull next waypoint
      if (this.path.length > 0) this.moveTarget = this.path.shift();
      else { this.state = 'idle'; return; }
    }
    const pos = this.mesh.position;
    const dx = this.moveTarget.x - pos.x;
    const dz = this.moveTarget.z - pos.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 2) {
      this.moveTarget = this.path.length > 0 ? this.path.shift() : null;
      if (!this.moveTarget) this.state = 'idle';
      return;
    }
    const step = this.stats.speed * dt;
    pos.x += (dx/dist) * step;
    pos.z += (dz/dist) * step;

    const targetAngle = Math.atan2(dx, dz);
    this.smoothRotate(targetAngle, dt);
    if (this.domain === 'air') {
      const delta = ((targetAngle - this.mesh.rotation.y + Math.PI*3) % (Math.PI*2)) - Math.PI;
      this.mesh.rotation.z = THREE.MathUtils.clamp(-delta, -0.5, 0.5);
      this.mesh.position.y = this.stats.altitude;
    }
  }

  smoothRotate(target, dt) {
    let cur = this.mesh.rotation.y;
    let diff = ((target - cur + Math.PI*3) % (Math.PI*2)) - Math.PI;
    cur += diff * Math.min(1, dt*6);
    this.mesh.rotation.y = cur;
  }

  canEnter(terrain) {
    if (this.domain === 'air')  return true;
    if (this.domain === 'sea')  return terrain === TERRAIN.SEA || terrain === TERRAIN.COAST;
    if (this.domain === 'land') return terrain === TERRAIN.LAND || terrain === TERRAIN.COAST;
    return true;
  }

  findTarget() {
    let best = null, bestD = this.stats.range;
    const enemies = this.faction === 'player' ? this.game.enemyUnits : this.game.playerUnits;
    for (const e of enemies) {
      if (!e.alive) continue;
      const d = this.mesh.position.distanceTo(e.mesh.position);
      if (d < bestD) { best = e; bestD = d; }
    }
    if (best) { this.target = best; this.state = 'attacking'; }
  }

  updateAttack(dt) {
    if (!this.target || !this.target.alive) {
      this.target = null; this.state = 'idle'; return;
    }
    const dist = this.mesh.position.distanceTo(this.target.mesh.position);
    if (dist > this.stats.range) {
      this.moveTo(this.target.mesh.position);
      return;
    }
    const dx = this.target.mesh.position.x - this.mesh.position.x;
    const dz = this.target.mesh.position.z - this.mesh.position.z;
    const aimAngle = Math.atan2(dx, dz);
    if (this.mesh.userData.turret) {
      this.mesh.userData.turret.rotation.y = aimAngle - this.mesh.rotation.y;
    } else {
      this.smoothRotate(aimAngle, dt);
    }
    if (this.cooldown <= 0) this.fire();
  }

  fire() {
    this.cooldown = this.stats.fireRate;
    const terrain = this.game.terrain.getTerrainAt(this.mesh.position.x, this.mesh.position.z);
    const { dmg } = applyTerrainBonus(this.domain, terrain, this.stats.damage, this.maxHp);
    const dist = this.mesh.position.distanceTo(this.target.mesh.position);
    const falloff = THREE.MathUtils.clamp(1 - (dist/this.stats.range)*0.4, 0.6, 1);
    const finalDmg = dmg * falloff;
    const muzzlePos = this.mesh.position.clone();
    muzzlePos.y += 2;
    this.game.spawnMuzzleFlash(muzzlePos);
    Sound.play('fire');
    const p = new Projectile(this.game.scene, muzzlePos, this.target, finalDmg, this.stats.hitChance);
    this.game.projectiles.push(p);
  }

  /** Carrier special ability — launch fighters. */
  launchFighters() {
    if (!this.canLaunch || this.launchCooldown > 0) return false;
    this.launchCooldown = CARRIER_FIGHTER_COOLDOWN;
    Sound.play('launch');
    for (let i = 0; i < CARRIER_FIGHTER_COUNT; i++) {
      const angle = (i / CARRIER_FIGHTER_COUNT) * Math.PI * 2;
      const pos = {
        x: this.mesh.position.x + Math.cos(angle) * 10,
        z: this.mesh.position.z + Math.sin(angle) * 10,
      };
      const f = this.game.spawn('fighter', this.faction, pos);
      f.mesh.position.y = UNIT_TYPES.fighter.altitude;
    }
    return true;
  }

  updateDeath(dt) {
    this.deathTime = (this.deathTime || 0) + dt;
    if (this.domain === 'air') {
      this.mesh.rotation.x += dt*2;
      this.mesh.position.y -= 30 * dt;
      if (this.mesh.position.y < 0) this.cleanup();
    } else if (this.domain === 'sea') {
      this.mesh.rotation.z += dt*0.5;
      this.mesh.position.y -= 2 * dt;
      if (this.mesh.position.y < -5) this.cleanup();
    } else {
      if (this.deathTime > 0.4) this.cleanup();
    }
  }
  cleanup() {
    if (this._cleaned) return;
    this._cleaned = true;
    this.game.scene.remove(this.mesh);
  }
}

// ============================================================
//  BASE CLASS
// ============================================================
export class Base {
  constructor(game, faction, position, size = 1, name = 'Base') {
    this.game = game;
    this.faction = faction;
    this.name = name;
    this.size = size;
    this.hp = 500 * size;
    this.maxHp = this.hp;
    this.alive = true;
    this.mesh = createBaseMesh(size, faction === 'player');
    this.mesh.position.set(position.x, LAND_HEIGHT, position.z);
    game.scene.add(this.mesh);

    // Defensive turret
    this.turretCooldown = 0;
    this.turretRange = 60 * size;
    this.turretDamage = 20 * size;
  }
  takeDamage(d) {
    this.hp -= d;
    if (this.hp <= 0) this.capture();
  }
  capture() {
    if (!this.alive) return;
    const attackers = this.faction === 'player' ? this.game.enemyUnits : this.game.playerUnits;
    const newOwner  = attackers.length ? attackers[0].faction :
                      (this.faction === 'player' ? 'enemy' : 'player');
    this.faction = newOwner;
    this.hp = this.maxHp * 0.5;
    const flagColor = newOwner === 'player' ? 0x2266aa : 0xaa3333;
    this.mesh.children.forEach(c => {
      if (c.geometry?.type === 'BoxGeometry' && c.position.y > 4) {
        c.material.color.setHex(flagColor);
      }
    });
    if (newOwner === 'player') {
      this.game.money += 200;
      Sound.play('capture');
    }
    this.game.checkWinCondition();
  }
  update(dt) {
    if (!this.alive) return;
    this.turretCooldown -= dt;
    if (this.turretCooldown > 0) return;
    // Find target in range
    const enemies = this.faction === 'player' ? this.game.enemyUnits : this.game.playerUnits;
    let best = null, bestD = this.turretRange;
    for (const e of enemies) {
      if (!e.alive) continue;
      const d = this.mesh.position.distanceTo(e.mesh.position);
      if (d < bestD) { best=e; bestD=d; }
    }
    if (best) {
      this.turretCooldown = 1.5;
      const p = new Projectile(
        this.game.scene, this.mesh.position.clone().add(new THREE.Vector3(0,10,0)),
        best, this.turretDamage, 0.85
      );
      this.game.projectiles.push(p);
    }
  }
}

// ============================================================
//  GAME CLASS — orchestration
// ============================================================
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

    this.selectedUnits = [];
    this.formation = 'line';

    this.aiTimer = 0;
    this.ended = false;
    this.fogUpdateTimer = 0;
  }

  init() {
    this.terrain    = buildTerrain(this.scene);
    this.pathfinder = new Pathfinder(this.terrain);
    this.upgrades   = new UpgradeManager(this);
    this.fog        = new FogOfWar(this.scene);
    this.minimap    = new Minimap(this, this.camera);
    Sound.init();

    this.createBases();
    this.spawnStartingArmy();

    document.getElementById('difficulty').textContent = `Difficulty: ${this.difficulty.toUpperCase()}`;
    document.getElementById('basesTotal').textContent = this.bases.length;
  }

  createBases() {
    // Player HQ — far west, on coast of west continent
    this.bases.push(new Base(this, 'player', { x:-500, z: 200 }, 1.8, 'Player HQ'));
    // Enemy bases spread across the bigger world
    this.bases.push(new Base(this, 'enemy', { x:-300, z:-200 }, 1.0, 'Outpost Alpha'));
    this.bases.push(new Base(this, 'enemy', { x:-200, z: 350 }, 1.0, 'Outpost Bravo'));
    this.bases.push(new Base(this, 'enemy', { x:  50, z:-400 }, 1.2, 'Northern Fort'));
    this.bases.push(new Base(this, 'enemy', { x: 250, z: 100 }, 1.3, 'Coastal Garrison'));
    this.bases.push(new Base(this, 'enemy', { x: 200, z: 400 }, 1.0, 'Island Watch'));
    this.bases.push(new Base(this, 'enemy', { x: 450, z:-100 }, 2.2, 'Main Base'));
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
    if (this.money < cost) {
      this.flashMessage(`Not enough $ for ${type} ($${cost})`);
      return false;
    }
    const hq = this.bases.find(b => b.faction === 'player');
    if (!hq) return false;
    const spawnPos = this.findValidSpawn(hq.mesh.position, stats.domain);
    if (!spawnPos) {
      this.flashMessage(`No valid spawn location for ${type}!`);
      return false;
    }
    this.money -= cost;
    const u = this.spawn(type, 'player', spawnPos);
    this.spawnMuzzleFlash(u.mesh.position.clone().add(new THREE.Vector3(0, 3, 0)));
    Sound.play('build');
    return true;
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
      ? [TERRAIN.SEA, TERRAIN.COAST]
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
    const f = new THREE.Mesh(
      new THREE.SphereGeometry(0.6,6,6),
      new THREE.MeshBasicMaterial({ color:0xffee44 })
    );
    f.position.copy(pos);
    f.userData.life = 0.08;
    this.scene.add(f);
    this.scene.userData.flashes = this.scene.userData.flashes || [];
    this.scene.userData.flashes.push(f);
  }

  update(dt) {
    if (this.ended) return;

    const owned = this.bases.filter(b => b.faction === 'player').length;
    this.money += PASSIVE_INCOME * owned * dt;

    for (const u of this.playerUnits) u.update(dt);
    for (const u of this.enemyUnits)  u.update(dt);
    for (const b of this.bases) b.update(dt);

    for (let i = this.projectiles.length-1; i>=0; i--) {
      const p = this.projectiles[i];
      p.update(dt);
      if (!p.alive) this.projectiles.splice(i,1);
    }

    updateExplosions(this.scene, dt);
    const flashes = this.scene.userData.flashes || [];
    for (let i=flashes.length-1;i>=0;i--) {
      flashes[i].userData.life -= dt;
      flashes[i].scale.multiplyScalar(0.9);
      if (flashes[i].userData.life <= 0) {
        this.scene.remove(flashes[i]); flashes.splice(i,1);
      }
    }

    this.playerUnits = this.playerUnits.filter(u => !u._cleaned);
    this.enemyUnits  = this.enemyUnits.filter(u => !u._cleaned);
    this.selectedUnits = this.selectedUnits.filter(u => u.alive);

    this.aiTimer += dt;
    if (this.onAITick) this.onAITick(dt);

    // Fog of war — update 4× per second (cheap enough)
    this.fogUpdateTimer += dt;
    if (this.fogUpdateTimer > 0.25 && this.fog) {
      this.fog.update(this.playerUnits, this.bases.filter(b => b.faction === 'player'));
      this.fogUpdateTimer = 0;
    }

    if (this.minimap) this.minimap.draw();
    this.updateHUD();
  }

  updateHUD() {
    document.getElementById('money').textContent = Math.floor(this.money);
    document.getElementById('unitCount').textContent = this.playerUnits.length;
    document.getElementById('basesOwned').textContent =
      this.bases.filter(b => b.faction === 'player').length;
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
    document.getElementById('endTitle').textContent = victory ? '🏆 Victory!' : '💀 Defeat';
  }

  computeFormation(center, count, formation) {
    const spacing = 6;
    const positions = [];
    switch (formation) {
      case 'line':
        for (let i=0;i<count;i++)
          positions.push(new THREE.Vector3(center.x + (i-(count-1)/2)*spacing, 0, center.z));
        break;
      case 'column':
        for (let i=0;i<count;i++)
          positions.push(new THREE.Vector3(center.x, 0, center.z + (i-(count-1)/2)*spacing));
        break;
      case 'wedge':
        for (let i=0;i<count;i++) {
          const row = Math.floor(i/2);
          const side = i%2 === 0 ? -1 : 1;
          positions.push(new THREE.Vector3(center.x + side*row*spacing, 0, center.z - row*spacing));
        }
        break;
      case 'square':
        const cols = Math.ceil(Math.sqrt(count));
        for (let i=0;i<count;i++) {
          const r = Math.floor(i/cols), c = i%cols;
          positions.push(new THREE.Vector3(
            center.x + (c-(cols-1)/2)*spacing,
            0,
            center.z + (r-(cols-1)/2)*spacing
          ));
        }
        break;
    }
    return positions;
  }
}
