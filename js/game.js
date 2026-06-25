// game.js — Game state, Unit class, Base class, and main game loop.
import * as THREE from 'three';
import { UNIT_TYPES, DIFFICULTY, STARTING_MONEY, PASSIVE_INCOME, TERRAIN } from './config.js';
import { createUnitMesh, createBaseMesh } from './unitFactory.js';
import { buildTerrain } from './terrain.js';
import { Projectile, updateExplosions, applyTerrainBonus } from './combat.js';

export class Unit {
  constructor(game, type, faction, position) {
    this.game     = game;
    this.type     = type;
    this.faction  = faction;
    this.stats    = { ...UNIT_TYPES[type] };
    this.domain   = this.stats.domain;
    this.maxHp    = this.stats.hp;
    this.hp       = this.maxHp;
    this.state    = 'idle';
    this.target   = null;
    this.moveTarget = null;
    this.cooldown = 0;
    this.alive    = true;
    this.selected = false;

    this.mesh = createUnitMesh(type, this.stats.color, faction);
    const y = this.domain === 'air' ? this.stats.altitude : 0;
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

  moveTo(pos) {
    this.moveTarget = pos.clone();
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
    if (this.faction === 'enemy') this.game.money += 25;
    this.game.queueDeath(this);
  }

  update(dt) {
    if (!this.alive) { this.updateDeath(dt); return; }
    this.cooldown -= dt;

    if (this.domain === 'sea') {
      this.mesh.userData.bobPhase += dt*2;
      this.mesh.position.y = Math.sin(this.mesh.userData.bobPhase)*0.15 + 0.3;
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
    if (!this.moveTarget) { this.state='idle'; return; }
    const pos = this.mesh.position;
    const dx = this.moveTarget.x - pos.x;
    const dz = this.moveTarget.z - pos.z;
    const dist = Math.hypot(dx,dz);
    if (dist < 1) {
      this.moveTarget = null;
      this.state = 'idle';
      return;
    }
    const nextX = pos.x + (dx/dist) * this.stats.speed * dt;
    const nextZ = pos.z + (dz/dist) * this.stats.speed * dt;
    const terrain = this.game.terrain.getTerrainAt(nextX, nextZ);
    if (!this.canEnter(terrain)) {
      this.moveTarget = null;
      this.state = 'idle';
      return;
    }
    let blocked = false;
    for (const mt of this.game.terrain.mountains) {
      if (this.domain === 'air') break;
      const ddx = nextX - mt.x, ddz = nextZ - mt.z;
      if (ddx*ddx+ddz*ddz < (mt.r+2)*(mt.r+2)) { blocked = true; break; }
    }
    if (blocked) {
      pos.x += (-dz/dist) * this.stats.speed * dt;
      pos.z += ( dx/dist) * this.stats.speed * dt;
    } else {
      pos.x = nextX; pos.z = nextZ;
    }

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
      this.moveTarget = this.target.mesh.position.clone();
      this.state = 'moving';
      return;
    }

    const dx = this.target.mesh.position.x - this.mesh.position.x;
    const dz = this.target.mesh.position.z - this.mesh.position.z;
    const aimAngle = Math.atan2(dx, dz);
    if (this.mesh.userData.turret) {
      const local = aimAngle - this.mesh.rotation.y;
      this.mesh.userData.turret.rotation.y = local;
    } else {
      this.smoothRotate(aimAngle, dt);
    }

    if (this.cooldown <= 0) this.fire();
  }

  fire() {
    this.cooldown = this.stats.fireRate;
    const terrain = this.game.terrain.getTerrainAt(
      this.mesh.position.x, this.mesh.position.z
    );
    const { dmg } = applyTerrainBonus(this.domain, terrain, this.stats.damage, this.maxHp);
    const dist = this.mesh.position.distanceTo(this.target.mesh.position);
    const falloff = THREE.MathUtils.clamp(1 - (dist/this.stats.range)*0.4, 0.6, 1);
    const finalDmg = dmg * falloff;
    const muzzlePos = this.mesh.position.clone();
    muzzlePos.y += 2;
    this.game.spawnMuzzleFlash(muzzlePos);
    const p = new Projectile(
      this.game.scene, muzzlePos, this.target, finalDmg, this.stats.hitChance
    );
    this.game.projectiles.push(p);
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
    this.mesh.position.set(position.x, 0, position.z);
    game.scene.add(this.mesh);

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
    if (newOwner === 'player') this.game.money += 200;
    this.game.checkWinCondition();
  }
  update(dt) {
    if (!this.alive) return;
    this.turretCooldown -= dt;
    if (this.turretCooldown > 0) return;
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

export class Game {
  constructor(scene, camera, difficulty) {
    this.scene = scene;
    this.camera = camera;
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
  }

  init() {
    this.terrain = buildTerrain(this.scene);
    this.createBases();
    this.spawnStartingArmy();
    document.getElementById('difficulty').textContent = `Difficulty: ${this.difficulty.toUpperCase()}`;
    document.getElementById('basesTotal').textContent = this.bases.length;
  }

  createBases() {
    this.bases.push(new Base(this, 'player', { x:-200, z:-180 }, 1.5, 'Player HQ'));
    this.bases.push(new Base(this, 'enemy',  { x:-100, z:  80 }, 1.0, 'Outpost Alpha'));
    this.bases.push(new Base(this, 'enemy',  { x:-180, z: 180 }, 1.0, 'Outpost Bravo'));
    this.bases.push(new Base(this, 'enemy',  { x: 180, z: 100 }, 1.2, 'Island Fort'));
    this.bases.push(new Base(this, 'enemy',  { x:  80, z:-150 }, 1.0, 'Naval Yard'));
    this.bases.push(new Base(this, 'enemy',  { x: 220, z: -80 }, 2.0, 'Main Base'));
  }

  spawnStartingArmy() {
    const phq = this.bases[0].mesh.position;
    this.spawn('tank',     'player', { x:phq.x+15, z:phq.z+10 });
    this.spawn('tank',     'player', { x:phq.x+22, z:phq.z+10 });
    this.spawn('infantry', 'player', { x:phq.x+15, z:phq.z+18 });
    this.spawn('infantry', 'player', { x:phq.x+22, z:phq.z+18 });
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
    const cost = UNIT_TYPES[type].cost;
    if (this.money < cost) return false;
    const hq = this.bases.find(b => b.faction === 'player');
    if (!hq) return false;
    this.money -= cost;
    const p = hq.mesh.position;
    const dom = UNIT_TYPES[type].domain;
    let pos;
    if (dom === 'sea')      pos = { x:p.x+20,  z:p.z+30 };
    else if (dom === 'air') pos = { x:p.x+10,  z:p.z+10 };
    else                    pos = { x:p.x+5+Math.random()*15, z:p.z+5+Math.random()*15 };
    this.spawn(type, 'player', pos);
    return true;
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
