// game.js — Game state, Unit class, Base class, and main game loop.
import * as THREE from 'three';
import { UNIT_TYPES, DIFFICULTY, STARTING_MONEY, PASSIVE_INCOME, TERRAIN, MAP_SIZE, CARRIER_FIGHTER_COOLDOWN, CARRIER_FIGHTER_COUNT, PROJECTILE_PATTERNS } from './config.js?v=3';
import { LAND_HEIGHT, buildTerrain } from './terrain.js?v=3';
import { createUnitMesh, createBaseMesh, createShipyardMesh } from './unitFactory.js?v=3';
import { Projectile, updateExplosions, applyTerrainBonus, updateAllTrails, createProjectilePattern, applyHitscanDamage } from './combat.js?v=3';
import { Pathfinder } from './pathfinder.js?v=3';
import { FogOfWar } from './fogOfWar.js?v=3';
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
    this.path     = [];
    this.moveTarget = null;
    this.attackMoveDest = null;
    this.cooldown = 0;
    this.alive    = true;
    this.selected = false;

    // Carrier ability
    this.canLaunch = !!baseStats.canLaunchFighters;
    this.launchCooldown = 0;
    this.canFireWhileMoving = !!this.stats.canFireWhileMoving;

    // Unique mechanics state
    this._destroyerShotCount = 0;        // For flak every 3rd shot
    this._battleshipBroadside = false;    // Broadside requirement
    this._bomberCarpetDir = null;         // Carpet bomb perpendicular direction
    this._artilleryBarrageIndex = 0;      // Creeping barrage progress
    this._infantryCaptureTarget = null;   // Base being captured

    this.mesh = createUnitMesh(type, baseStats.color, faction);
    const y = this.domain === 'air' ? baseStats.altitude : (position.y ?? (this.domain === 'sea' ? 0.3 : LAND_HEIGHT + 0.5));
    this.mesh.position.set(position.x, y, position.z);

    // Selection ring (brighter with fill)
    const ringGeom = new THREE.RingGeometry(3, 4, 16);
    const ringMat  = new THREE.MeshBasicMaterial({
      color: faction === 'player' ? 0x00ffff : 0xff4444,
      side: THREE.DoubleSide, transparent:true, opacity:0
    });
    this.ring = new THREE.Mesh(ringGeom, ringMat);
    this.ring.rotation.x = -Math.PI/2;
    this.ring.position.y = 0.1;
    this.mesh.add(this.ring);

    // Fill disc for selection
    const fillGeom = new THREE.CircleGeometry(3, 16);
    const fillMat = new THREE.MeshBasicMaterial({
      color: faction === 'player' ? 0x00ffff : 0xff4444,
      transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false
    });
    this._ringFill = new THREE.Mesh(fillGeom, fillMat);
    this._ringFill.rotation.x = -Math.PI/2;
    this._ringFill.position.y = 0.05;
    this.mesh.add(this._ringFill);

    // HP bar
    const barWidth = type === 'carrier' ? 7 : type === 'battleship' ? 6 : type === 'destroyer' ? 5
                   : (type === 'tank' || type === 'artillery') ? 4 : type === 'infantry' ? 3 : 2.5;
    const barHeight = 0.5; // taller bar for visibility
    const barY = this.domain === 'air' ? -3 : (this.domain === 'sea' ? 2.5 : 3.5);
    this._barWidth = barWidth;

    // Black outline behind bar
    const outlineBar = new THREE.Mesh(
      new THREE.PlaneGeometry(barWidth + 0.15, barHeight + 0.15),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.9, depthTest: false })
    );
    outlineBar.rotation.x = -Math.PI / 2;
    outlineBar.position.y = barY - 0.01;
    outlineBar.renderOrder = 899;

    const bgBar = new THREE.Mesh(
      new THREE.PlaneGeometry(barWidth, barHeight),
      new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.9, depthTest: false })
    );
    bgBar.rotation.x = -Math.PI / 2;
    bgBar.position.y = barY;
    bgBar.renderOrder = 900;

    const fgBar = new THREE.Mesh(
      new THREE.PlaneGeometry(barWidth, barHeight),
      new THREE.MeshBasicMaterial({ color: faction === 'player' ? 0x44ff88 : 0xff4444, depthTest: false })
    );
    fgBar.renderOrder = 901;

    const trailBar = new THREE.Mesh(
      new THREE.PlaneGeometry(barWidth, barHeight),
      new THREE.MeshBasicMaterial({ color: 0xffaa88, transparent: true, opacity: 0.6, depthTest: false })
    );
    trailBar.renderOrder = 900;

    const barGroup = new THREE.Group();
    barGroup.add(outlineBar, bgBar, fgBar, trailBar);
    barGroup.position.set(0, barY, 0);
    this.mesh.add(barGroup);

    this._hpBar = { fg: fgBar, trail: trailBar, barWidth };
    this._displayHp = this.maxHp;
    this._trailHp = this.maxHp;

    // Hit flash state
    this._hitFlash = false;
    this._hitFlashTimer = 0;
    this._hitFlashOrig = false;

    // Range ring (created on demand)
    this._rangeRing = null;

    // Ship water enforcement cooldown
    this._pushCooldown = 0;

    game.scene.add(this.mesh);
  }

  setSelected(sel) {
    this.selected = sel;
    this.ring.material.opacity = sel ? 1.0 : 0;
    if (this._ringFill) this._ringFill.material.opacity = sel ? 0.2 : 0;
    this._updateHpBar(0);
    if (sel) {
      this._buildRangeRing();
      if (this._rangeRing) {
        this._rangeRing.position.set(this.mesh.position.x, 0.3, this.mesh.position.z);
        this.game.scene.add(this._rangeRing);
        this._rangeRing.visible = true;
      }
    } else if (this._rangeRing) {
      this._rangeRing.visible = false;
      this.game.scene.remove(this._rangeRing);
    }
  }

/** Use A* pathfinder. Validates destination terrain for sea/land units. */
  moveTo(pos, attackMove = false) {
    if (!pos || pos.x == null || pos.z == null) { this.state = 'idle'; return; }
    const targetPos = pos instanceof THREE.Vector3 ? pos : new THREE.Vector3(pos.x, 0, pos.z);

    // Sea/land units: validate destination terrain
    if (this.domain !== 'air') {
      const terrain = this.game.terrain.getTerrainAt(targetPos.x, targetPos.z);
      if (!this.canEnter(terrain)) {
        const g = this.game.pathfinder.worldToGrid(targetPos.x, targetPos.z);
        const nearest = this.game.pathfinder.findNearestWalkable(g.gx, g.gy, this.domain);
        if (nearest) {
          const w = this.game.pathfinder.gridToWorld(nearest.gx, nearest.gy);
          targetPos.set(w.x, 0, w.z);
        } else {
          this.state = 'idle';
          return;
        }
      }
    }

    this.attackMove = attackMove;
    this.attackMoveDest = targetPos.clone();
    const path = this.game.pathfinder.findPath(this.mesh.position, targetPos, this.domain);
    if (path && path.length > 0) {
      this.path = path;
      this.moveTarget = this.path.shift();
    } else {
      this.moveTarget = targetPos.clone();
      this.path = [];
    }
    this.state = 'moving';
  }

  attack(enemy) {
    console.log(`[DEBUG UNIT] ${this.type} (${this.faction}) attacking ${enemy.type || 'base'}`);
    this.target = enemy;
    this.state  = 'attacking';
  }

  takeDamage(dmg) {
    this.hp -= dmg;
    if (this.hp <= 0) this.hp = 0;
    this._displayHp = this.hp;

    // Hit flash
    if (!this._hitFlashOrig) {
      this.mesh.traverse(c => {
        if (c.material?.color && c.userData.origColor === undefined)
          c.userData.origColor = c.material.color.getHex();
      });
      this._hitFlashOrig = true;
    }
    this._hitFlash = true;
    this._hitFlashTimer = 0.12;

    if (this.hp <= 0) this.die();
  }

  die() {
    if (!this.alive) return;
    this.alive = false;
    this.state = 'dead';
    console.log(`[DEBUG UNIT] ${this.type} (${this.faction}) DIED at (${this.mesh.position.x.toFixed(0)}, ${this.mesh.position.z.toFixed(0)})`);
    Sound.play('explosion');
    // Award bounty if killed by player
    const bounty = this.stats.bounty || 0;
    if (this.faction === 'enemy' && bounty > 0) {
      this.game.money += bounty;
      this.game.flashMessage(`+${bounty}$ bounty`);
    }
    this.game.queueDeath(this);
  }

  update(dt) {
    if (!this.alive) { this.updateDeath(dt); return; }
    this.cooldown -= dt;
    if (this.canLaunch) this.launchCooldown -= dt;
    if (this._pushCooldown > 0) this._pushCooldown -= dt;

    if (this.domain === 'sea') {
      this.mesh.userData.bobPhase += dt * 2;
      this.mesh.position.y = Math.sin(this.mesh.userData.bobPhase) * 0.15 + 0.3;
    }

    // HP bar update
    this._updateHpBar(dt);

    // Hit flash
    this._updateHitFlash(dt);

    // ===== UNIQUE MECHANICS PER UNIT =====

    // CARRIER: Auto-launch fighters every 20s if enemies in range
    if (this.type === 'carrier' && this.canLaunch && this.launchCooldown <= 0) {
      const enemiesNear = this._enemiesInRange(80); // launch range
      if (enemiesNear > 0) {
        this.launchFighters();
      }
    }

    // FIGHTER: Auto-return to carrier after 60s for repair
    if (this.type === 'fighter' && this.mesh.userData.launchedFrom) {
      this._fighterAutoReturn(dt);
    }

    // INFANTRY: Capture adjacent enemy/neutral bases
    if (this.type === 'infantry') {
      this._tryCaptureBase(dt);
    }

    // Auto-target: idle units, or attack-move units scanning while moving
    if (this.state === 'idle' || (this.state === 'moving' && (!this.moveTarget || this.attackMove))) {
      this.findTarget();
    }
    // Units that can fire while moving: run attack logic even in 'moving' state
    if (this.state === 'moving' && this.canFireWhileMoving && this.target) {
      this.updateAttackWhileMoving(dt);
    }
    switch (this.state) {
      case 'moving':    this.updateMove(dt); break;
      case 'attacking': this.updateAttack(dt); break;
    }

    // Terrain enforcement: push to valid terrain
    if (this.state !== 'dead') {
      const pos = this.mesh.position;
      const terrain = this.game.terrain.getTerrainAt(pos.x, pos.z);
      if (this.domain === 'sea' && terrain !== TERRAIN.SEA && terrain !== TERRAIN.COAST) {
        this._pushToValidTerrain('sea');
      } else if (this.domain === 'land' && terrain !== TERRAIN.LAND && terrain !== TERRAIN.COAST) {
        this._pushToValidTerrain('land');
      }
    }
  }

  /** Count alive enemies within range */
  _enemiesInRange(range) {
    const enemies = this.faction === 'player' ? this.game.enemyUnits : this.game.playerUnits;
    let count = 0;
    for (const e of enemies) {
      if (e.alive && this.mesh.position.distanceTo(e.mesh.position) <= range) count++;
    }
    return count;
  }

  /** Infantry unique: Capture enemy/neutral bases at 1 HP/s when adjacent */
  _tryCaptureBase(dt) {
    const bases = this.faction === 'player' ? this.game.bases.filter(b => b.faction === 'enemy') : this.game.bases.filter(b => b.faction === 'player');
    for (const base of bases) {
      if (!base.alive) continue;
      const d = this.mesh.position.distanceTo(base.mesh.position);
      if (d <= 15) { // adjacent to base
        base.hp = Math.max(0, base.hp - dt * 1); // 1 HP per second
        base._displayHp = base.hp;
        if (base.hp <= 0) {
          base.capture();
          this.game.flashMessage(`Captured ${base.name}!`);
        } else {
          this.game.flashMessage(`Capturing ${base.name}... ${Math.ceil(base.hp)} HP`);
        }
        return; // Only capture one at a time
      }
    }
  }

  /** Fighter unique: Auto-return to carrier after 60s for repair */
  _fighterAutoReturn(dt) {
    if (!this.mesh.userData.launchedFrom) return;
    this.mesh.userData.launchTime = (this.mesh.userData.launchTime || 0) + dt;
    if (this.mesh.userData.launchTime > 60) { // 60s lifetime
      const carrier = this.mesh.userData.launchedFrom;
      if (carrier && carrier.alive) {
        // Return to carrier and heal
        this.moveTo(carrier.mesh.position.clone());
        this.mesh.userData.returning = true;
        if (this.mesh.position.distanceTo(carrier.mesh.position) < 10) {
          this.hp = this.maxHp; // Full repair
          this._displayHp = this.hp;
          this.mesh.userData.launchTime = 0;
          this.mesh.userData.returning = false;
          console.log(`[DEBUG FIGHTER] Returned to carrier, fully repaired`);
        }
      }
    }
  }

  _pushToValidTerrain(domain) {
    if (this._pushCooldown > 0) return;
    this._pushCooldown = 0.5;
    const gx = Math.floor((this.mesh.position.x + MAP_SIZE/2) / 12);
    const gy = Math.floor((this.mesh.position.z + MAP_SIZE/2) / 12);
    const nearest = this.game.pathfinder.findNearestWalkable(gx, gy, domain);
    if (nearest) {
      const world = this.game.pathfinder.gridToWorld(nearest.gx, nearest.gy);
      this.moveTo(new THREE.Vector3(world.x, 0, world.z));
    }
  }

  _buildRangeRing() {
    if (this._rangeRing) return;
    const points = [];
    const segs = 48;
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(a) * this.stats.range, 0, Math.sin(a) * this.stats.range));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: this.faction === 'player' ? 0x4488ff : 0xff4444,
      transparent: true, opacity: 0.4, depthTest: false
    });
    this._rangeRing = new THREE.LineLoop(geom, mat);
    this._rangeRing.position.y = 0.3;
    this._rangeRing.renderOrder = 895;
    this._rangeRing.visible = false;
  }

  _updateHpBar(dt) {
    if (!this._hpBar) return;
    // Trail slowly catches up to current HP
    this._trailHp += (this._displayHp - this._trailHp) * Math.min(1, dt * 2);

    const hpRatio = this._displayHp / this.maxHp;
    const trailRatio = this._trailHp / this.maxHp;

    // Foreground bar
    this._hpBar.fg.scale.x = hpRatio;
    this._hpBar.fg.position.x = -(this._hpBar.barWidth / 2) * (1 - hpRatio);

    // Trail bar
    this._hpBar.trail.scale.x = trailRatio;
    this._hpBar.trail.position.x = -(this._hpBar.barWidth / 2) * (1 - trailRatio);

    // Hide if full HP and not selected
    const visible = this._displayHp < this.maxHp || this.selected;
    this._hpBar.fg.parent.visible = visible;
  }

  _updateHitFlash(dt) {
    if (!this._hitFlash) return;
    this._hitFlashTimer -= dt;
    const white = this._hitFlashTimer > 0;
    this.mesh.traverse(c => {
      if (c.material?.color && c.userData.origColor !== undefined)
        c.material.color.setHex(white ? 0xffffff : c.userData.origColor);
    });
    if (!white) this._hitFlash = false;
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
      // Land units cannot target air
      if (this.domain === 'land' && e.domain === 'air') continue;
      const d = this._dist2d(e.mesh.position);
      if (d < bestD) { best = e; bestD = d; }
    }
    // Also scan enemy bases
    const enemyBases = this.faction === 'player'
      ? this.game.bases.filter(b => b.faction === 'enemy' && b.alive)
      : this.game.bases.filter(b => b.faction === 'player' && b.alive);
    for (const b of enemyBases) {
      const d = this._dist2d(b.mesh.position);
      if (d < bestD) {
        best = { mesh: b.mesh, faction: b.faction,
                 get alive() { return b.alive; }, get hp() { return b.hp; },
                 takeDamage: dmg => b.takeDamage(dmg), type: b.name, domain:'land' };
        bestD = d;
      }
    }
    if (best) {
      this.target = best;
      this.state = 'attacking';
    }
  }

  _dist2d(pos) {
    return Math.hypot(this.mesh.position.x - pos.x, this.mesh.position.z - pos.z);
  }

  updateAttack(dt) {
    if (!this.target || (this.target.alive === false && !this.target.takeDamage)) {
      this.target = null;
      if (this.attackMove && this.attackMoveDest) {
        this.moveTo(this.attackMoveDest, true);
      } else {
        this.state = 'idle';
      }
      return;
    }
    const targetPos = this.target.mesh ? this.target.mesh.position : this.target.position;
    const dist = this._dist2d(targetPos);
    if (dist > this.stats.range) {
      this.moveTo(targetPos, this.attackMove);
      return;
    }
    const dx = targetPos.x - this.mesh.position.x;
    const dz = targetPos.z - this.mesh.position.z;
    const aimAngle = Math.atan2(dx, dz);
    if (this.mesh.userData.turret) {
      this.mesh.userData.turret.rotation.y = aimAngle - this.mesh.rotation.y;
    } else {
      this.smoothRotate(aimAngle, dt);
    }
    if (this.cooldown <= 0) this.fire();
  }

  /** Attack logic for units that can fire while moving (ships, planes). */
  updateAttackWhileMoving(dt) {
    if (!this.target || !this.target.alive) {
      this.target = null;
      return;
    }
    const targetPos = this.target.mesh ? this.target.mesh.position : this.target.position;
    const dist = this._dist2d(targetPos);
    if (dist > this.stats.range) {
      return;
    }
    // In range: aim and fire, but keep moving
    const dx = targetPos.x - this.mesh.position.x;
    const dz = targetPos.z - this.mesh.position.z;
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
    const targetPos = this.target.mesh ? this.target.mesh.position : this.target.position;
    let finalDmg = dmg; // Flat damage (no distance falloff)

    // Compute muzzle position from turret offset or default
    let muzzlePos;
    if (this.mesh.userData.muzzleOffset) {
      muzzlePos = this.mesh.userData.muzzleOffset.clone();
      muzzlePos.applyQuaternion(this.mesh.quaternion);
      muzzlePos.add(this.mesh.position);
    } else {
      muzzlePos = this.mesh.position.clone();
      muzzlePos.y += (this.domain === 'air' ? -0.5 : 2);
    }

    this.game.spawnMuzzleFlash(muzzlePos);
    Sound.play('fire');
    const splashRadius = this.stats.splashRadius || 0;
    const splashFalloff = this.stats.splashFalloff || 1;

    // ===== UNIQUE UNIT MECHANICS =====

    // DESTROYER: Every 3rd shot fires FLAK vs air units in range
    if (this.type === 'destroyer') {
      this._destroyerShotCount++;
      if (this._destroyerShotCount % 3 === 0) {
        this._fireFlak(muzzlePos);
      }
    }

    // BATTLESHIP: Broadside mechanic
    if (this.type === 'battleship') {
      const toTarget = new THREE.Vector3().subVectors(targetPos, this.mesh.position).normalize();
      const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.mesh.quaternion);
      const dot = forward.dot(toTarget);
      this._battleshipBroadside = Math.abs(dot) < 0.3;
    }

    // FIGHTER: Dogfight bonus - +50% vs air, -50% vs ground
    if (this.type === 'fighter' && this.target.type) {
      const targetDomain = UNIT_TYPES[this.target.type]?.domain;
      if (targetDomain === 'air') finalDmg *= 1.5;
      else if (targetDomain === 'land' || targetDomain === 'sea') finalDmg *= 0.5;
    }

    // BOMBER: Carpet bomb direction stored for pattern
    let bomberCarpetDir = null;
    if (this.type === 'bomber') {
      const approachDir = new THREE.Vector3().subVectors(targetPos, this.mesh.position).normalize();
      bomberCarpetDir = new THREE.Vector3(-approachDir.z, 0, approachDir.x);
      this._bomberCarpetDir = bomberCarpetDir;
    }

    // ARTILLERY: Creeping barrage index
    if (this.type === 'artillery') {
      this._artilleryBarrageIndex = 0;
    }

    // ===== HITSCAN (sea/air) vs PROJECTILE (land) =====
    if (this.domain === 'sea' || this.domain === 'air') {
      // Hitscan: instant damage application
      applyHitscanDamage(
        this.game.scene,
        muzzlePos,
        this.target,
        finalDmg,
        this.stats.hitChance,
        splashRadius,
        splashFalloff
      );
    } else {
      // Land units: projectile system (flat damage)
      const projType = 'land';
      const pattern = this.stats.projectile || 'default';
      const patternConfig = PROJECTILE_PATTERNS[pattern] || PROJECTILE_PATTERNS.default;
      const effectiveBurst = patternConfig.burst;

      const projectiles = createProjectilePattern(
        this.game.scene,
        muzzlePos,
        this.target,
        finalDmg,
        this.stats.hitChance,
        projType,
        pattern,
        splashRadius,
        splashFalloff,
        this.mesh.rotation.y,
        targetPos,
        effectiveBurst,
        bomberCarpetDir,
        patternConfig.burstDelay || 0
      );

      for (const p of projectiles) {
        this.game.projectiles.push(p);
      }
    }
  }

  /** Destroyer unique: Flak cloud vs air units in radius */
  _fireFlak(muzzlePos) {
    const flakRadius = 25;
    const allUnits = [...this.game.playerUnits, ...this.game.enemyUnits];
    for (const unit of allUnits) {
      if (!unit.alive || unit.domain !== 'air') continue;
      const d = unit.mesh.position.distanceTo(this.mesh.position);
      if (d <= flakRadius) {
        const flakDmg = this.stats.damage * 0.6; // 60% damage
        unit.takeDamage(flakDmg);
        console.log(`[DEBUG DESTROYER] FLAK hit ${unit.type} for ${flakDmg.toFixed(1)}`);
        // Visual flak puff
        this._spawnFlakPuff(unit.mesh.position);
      }
    }
  }

  _spawnFlakPuff(pos) {
    const puff = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.6 })
    );
    puff.position.copy(pos);
    puff.userData.life = 0.5;
    this.game.scene.add(puff);
    this.game.scene.userData.flakPuffs = this.game.scene.userData.flakPuffs || [];
    this.game.scene.userData.flakPuffs.push(puff);
  }

  /** Carrier special ability — launch fighters. */
  launchFighters() {
    if (!this.canLaunch || this.launchCooldown > 0) {
      console.warn(`[DEBUG UNIT] Carrier launch FAILED — canLaunch: ${this.canLaunch}, cooldown: ${this.launchCooldown.toFixed(1)}`);
      return false;
    }
    this.launchCooldown = CARRIER_FIGHTER_COOLDOWN;
    Sound.play('launch');
    console.log(`[DEBUG UNIT] Carrier LAUNCHING ${CARRIER_FIGHTER_COUNT} fighters`);
    for (let i = 0; i < CARRIER_FIGHTER_COUNT; i++) {
      const angle = (i / CARRIER_FIGHTER_COUNT) * Math.PI * 2;
      const pos = {
        x: this.mesh.position.x + Math.cos(angle) * 10,
        z: this.mesh.position.z + Math.sin(angle) * 10,
      };
      const f = this.game.spawn('fighter', this.faction, pos);
      f.mesh.position.y = UNIT_TYPES.fighter.altitude;
      f.mesh.userData.launchedFrom = this; // Track carrier for auto-return
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

    // Known HQ positions for HP scaling
    const playerHQ = { x: -500, z: 200 };
    const enemyMain = { x: 450, z: -100 };
    const refPos = faction === 'enemy' ? playerHQ : enemyMain;
    const distance = Math.hypot(position.x - refPos.x, position.z - refPos.z);

    // HP scales with base size and distance from opposite HQ
    let hpMult = 1.0; // default: no distance scaling
    if (name !== 'Player HQ' && name !== 'Main Base') {
      if (distance < 150) hpMult = 4.0;
      else if (distance < 300) hpMult = 3.0;
      else if (distance < 500) hpMult = 2.0;
      else hpMult = 1.5;
    }
    this.hp = 500 * size * hpMult;
    this.maxHp = this.hp;
    this.alive = true;

    // Territory radius (bigger for Main Base)
    this.territory = 150 * size;
    if (name === 'Main Base') this.territory = 200 * size;

    // Defensive turret stats
    this.turretRange = 60 * size;
    this.turretDamage = 20 * size * hpMult;
    this.turretCooldown = 0;

    // Use shipyard mesh for bases on water/coast, barracks for land
    const terrainType = game.terrain.getTerrainAt(position.x, position.z);
    const isWaterBase = terrainType === TERRAIN.SEA || terrainType === TERRAIN.COAST;
    this.mesh = isWaterBase
      ? createShipyardMesh(size, faction === 'player')
      : createBaseMesh(size, faction === 'player');
    this.mesh.position.set(position.x, LAND_HEIGHT, position.z);
    game.scene.add(this.mesh);

    // Territory ring visual (created in createBases after all bases exist)
    this.territoryRing = null;

    // HP bar (always visible)
    this._createHpBar();
  }

  _createHpBar() {
    const barWidth = 8 * this.size;
    const barHeight = 0.6;
    const barY = 6 + this.size * 2; // above the base

    const bgBar = new THREE.Mesh(
      new THREE.PlaneGeometry(barWidth, barHeight),
      new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.9, depthTest: false })
    );
    bgBar.rotation.x = -Math.PI / 2;
    bgBar.position.y = barY;
    bgBar.renderOrder = 900;

    const fgBar = new THREE.Mesh(
      new THREE.PlaneGeometry(barWidth, barHeight),
      new THREE.MeshBasicMaterial({ color: this.faction === 'player' ? 0x44ff88 : 0xff4444, depthTest: false })
    );
    fgBar.rotation.x = -Math.PI / 2;
    fgBar.position.y = barY + 0.02;
    fgBar.renderOrder = 901;

    this.mesh.add(bgBar, fgBar);
    this._hpBar = { bg: bgBar, fg: fgBar, barWidth, maxHp: this.maxHp };
    this._displayHp = this.hp;
    this._trailHp = this.hp;
  }

  update(dt) {
    if (!this.alive) return;

    // HP bar update (always visible for bases)
    if (this._hpBar) {
      this._trailHp += (this._displayHp - this._trailHp) * Math.min(1, dt * 2);
      const hpRatio = this._displayHp / this._hpBar.maxHp;
      const trailRatio = this._trailHp / this._hpBar.maxHp;
      this._hpBar.fg.scale.x = hpRatio;
      this._hpBar.fg.position.x = -(this._hpBar.barWidth / 2) * (1 - hpRatio);
      this._hpBar.fg.material.color.setHex(this.faction === 'player' ? 0x44ff88 : 0xff4444);
    }

    // Auto-defend: shoot player units in range
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
      const projType = this.faction === 'sea' ? 'sea' : (this.faction === 'air' ? 'air' : 'land');
      const targetPos = best.mesh.position;
      const projs = createProjectilePattern(
        this.game.scene,
        this.mesh.position.clone().add(new THREE.Vector3(0,10,0)),
        best, this.turretDamage, 0.85, projType, 'default', 0, 1,
        0, targetPos
      );
      this.game.projectiles.push(...projs);
    }
  }

  takeDamage(d) {
    this.hp -= d;
    this._displayHp = this.hp;
    if (this.hp <= 0) this.capture();
  }

  capture() {
    if (!this.alive) return;
    const attackers = this.faction === 'player' ? this.game.enemyUnits : this.game.playerUnits;
    const newOwner = attackers.length ? attackers[0].faction :
                    (this.faction === 'player' ? 'enemy' : 'player');
    this.faction = newOwner;
    this.hp = this.maxHp * 0.5;
    this._displayHp = this.hp;
    this._trailHp = this.hp;
    const flagColor = newOwner === 'player' ? 0x2266aa : 0xaa3333;
    this.mesh.children.forEach(c => {
      if (c.userData?.isFlag) {
        c.material.color.setHex(flagColor);
      }
    });
    // Update territory ring owner color
    if (this.territoryRing) {
      this.territoryRing.material.color.setHex(flagColor);
    }
    if (newOwner === 'player') {
      this.game.money += 200;
    }
    this.game.checkWinCondition();
  }

  cleanup() {
    if (!this.alive) return;
    this.alive = false;
    this.game.scene.remove(this.mesh);
    if (this.territoryRing) {
      this.game.scene.remove(this.territoryRing);
      this.territoryRing = null;
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
    this.attackMoveMode = false;

    this.aiTimer = 0;
    this.ended = false;
    this.fogUpdateTimer = 0;
    this.paused = false;
    this.selectedBuilding = null;

    this.placementMode = { active: false, type: null, ghost: null, ring: null, isValid: false, previewPos: null };
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

    // Create territory rings for each base
    for (const b of this.bases) {
      const color = b.faction === 'player' ? 0x2266aa : 0xaa3333;
      const geom = new THREE.CircleGeometry(b.territory, 48);
      const mat = new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false
      });
      b.territoryRing = new THREE.Mesh(geom, mat);
      b.territoryRing.rotation.x = -Math.PI / 2;
      b.territoryRing.position.set(b.mesh.position.x, 0.15, b.mesh.position.z);
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
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(4, 6, 32),
      new THREE.MeshBasicMaterial({ color: 0x44ff88, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(pos.x, 0.5, pos.z);
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

  // ============================================================
  //  PLACEMENT MODE — click-to-place after buying a unit
  // ============================================================
  enterPlacementMode(type) {
    console.log(`[DEBUG] enterPlacementMode called: ${type}`);
    const stats = UNIT_TYPES[type];
    const cost = stats.cost;
    console.log(`[DEBUG] Cost: $${cost}, Player money: $${Math.floor(this.money)}`);
    if (this.money < cost) {
      console.warn(`[DEBUG] Insufficient funds for ${type}`);
      this.flashMessage(`Not enough $ for ${type} ($${cost})`);
      return false;
    }

    // Remove existing ghost if any
    this.exitPlacementMode(true);

    // Create ghost mesh
    const ghost = createUnitMesh(type, stats.color, 'player');
    // Make all children semi-transparent
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

    this.placementMode = {
      active: true,
      type,
      ghost,
      ring,
      isValid: false,
      previewPos: null,
      cost
    };

    // Update UI
    this._showPlacementIndicator(type);
    this._setBuyButtonsDisabled(true);
    this.flashMessage(`Click map to place ${type.toUpperCase()}`);
    console.log(`[DEBUG] Placement mode ENTERED for ${type}`);
    return true;
  }

  exitPlacementMode(canceled) {
    if (!this.placementMode.active) return;
    console.log(`[DEBUG] exitPlacementMode — canceled: ${canceled}`);
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
    const stats = UNIT_TYPES[this.placementMode.type];
    const domain = stats.domain;
    const y = domain === 'air' ? stats.altitude : (domain === 'sea' ? 0.3 : LAND_HEIGHT + 0.5);

    this.placementMode.ghost.position.set(pos.x, y, pos.z);
    this.placementMode.previewPos = pos;

    const valid = this.isValidPlacement(pos.x, pos.z, domain);
    this.placementMode.isValid = valid;
    this.placementMode.ring.material.color.setHex(valid ? 0x44ff88 : 0xff4444);
  }

  confirmPlacement(pos) {
    if (!this.placementMode.active) return false;
    if (!pos) return false;

    const type = this.placementMode.type;
    const stats = UNIT_TYPES[type];
    const domain = stats.domain;
    console.log(`[DEBUG] confirmPlacement called: ${type} at (${pos.x.toFixed(1)}, ${pos.z.toFixed(1)})`);

    if (!this.isValidPlacement(pos.x, pos.z, domain)) {
      console.warn(`[DEBUG] Invalid placement location — rejected`);
      this.flashMessage('Cannot place here — invalid location');
      return false;
    }

    // Deduct money and spawn
    this.money -= stats.cost;
    const y = domain === 'air' ? stats.altitude : (domain === 'sea' ? 0.3 : LAND_HEIGHT + 0.5);
    const spawnPos = { x: pos.x, z: pos.z };
    const u = this.spawn(type, 'player', spawnPos);
    u.mesh.position.y = y;
    console.log(`[DEBUG] Unit SPAWNED: ${type} at (${spawnPos.x.toFixed(1)}, ${spawnPos.z.toFixed(1)}) — Money left: $${Math.floor(this.money)}`);

    this.spawnMuzzleFlash(u.mesh.position.clone().add(new THREE.Vector3(0, 3, 0)));
    this.spawnSpawnMarker(u.mesh.position.clone());
    Sound.play('build');
    this.flashMessage(`Built ${type.toUpperCase()} ($${stats.cost})`);
    this.pingMinimap(spawnPos.x, spawnPos.z);
    if (this.fog) {
      this.fog.update(this.playerUnits, this.bases.filter(b => b.faction === 'player'));
    }

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
      console.log(`[DEBUG] isValidPlacement: OUT OF BOUNDS at (${x.toFixed(1)}, ${z.toFixed(1)})`);
      return false;
    }

    // Terrain check (non-air)
    if (domain !== 'air') {
      const terrain = this.terrain.getTerrainAt(x, z);
      const validTerrains = domain === 'sea'
        ? [TERRAIN.SEA, TERRAIN.COAST]
        : [TERRAIN.LAND, TERRAIN.COAST];
      if (!validTerrains.includes(terrain)) {
        console.log(`[DEBUG] isValidPlacement: WRONG TERRAIN "${terrain}" at (${x.toFixed(1)}, ${z.toFixed(1)}) for domain "${domain}"`);
        return false;
      }

      // Mountain overlap
      for (const mt of this.terrain.mountains) {
        if (Math.hypot(x - mt.x, z - mt.z) < mt.r + 3) {
          console.log(`[DEBUG] isValidPlacement: MOUNTAIN COLLISION at (${x.toFixed(1)}, ${z.toFixed(1)})`);
          return false;
        }
      }
    }

    // Unit collision (both factions)
    for (const u of [...this.playerUnits, ...this.enemyUnits]) {
      if (!u.alive) continue;
      if (Math.hypot(x - u.mesh.position.x, z - u.mesh.position.z) < 4) {
        console.log(`[DEBUG] isValidPlacement: UNIT COLLISION with ${u.type} at (${u.mesh.position.x.toFixed(1)}, ${u.mesh.position.z.toFixed(1)})`);
        return false;
      }
    }

    // Base collision
    for (const b of this.bases) {
      if (!b.alive) continue;
      const dist = Math.hypot(x - b.mesh.position.x, z - b.mesh.position.z);
      if (dist < 15) {
        console.log(`[DEBUG] isValidPlacement: BASE COLLISION with "${b.name}" at (${b.mesh.position.x.toFixed(1)}, ${b.mesh.position.z.toFixed(1)})`);
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
    el.textContent = `Placing: ${type.toUpperCase()} — Click to place, Right-click / Esc to cancel`;
    el.classList.remove('hidden');
  }

  _hidePlacementIndicator() {
    const el = document.getElementById('placementIndicator');
    if (el) el.classList.add('hidden');
  }

  _setBuyButtonsDisabled(disabled) {
    const btns = document.querySelectorAll('#buildButtons .unitBtn');
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
    if (this.ended || this.paused) return;

    const owned = this.bases.filter(b => b.faction === 'player').length;
    this.money += PASSIVE_INCOME * owned * dt;

    // Update all entities
    for (const u of this.playerUnits) u.update(dt);
    for (const u of this.enemyUnits)  u.update(dt);
    for (const b of this.bases) b.update(dt);

    // Soft unit collision (gentle nudge)
    this._applySoftCollision(this.playerUnits);
    this._applySoftCollision(this.enemyUnits);

    // Update projectiles
    for (let i = this.projectiles.length-1; i>=0; i--) {
      const p = this.projectiles[i];
      p.update(dt);
      if (!p.alive) this.projectiles.splice(i,1);
    }

    // Update FX
    updateExplosions(this.scene, dt);
    updateAllTrails(this.scene, dt);
    const flashes = this.scene.userData.flashes || [];
    for (let i=flashes.length-1;i>=0;i--) {
      flashes[i].userData.life -= dt;
      flashes[i].scale.multiplyScalar(0.9);
      if (flashes[i].userData.life <= 0) {
        this.scene.remove(flashes[i]); flashes.splice(i,1);
      }
    }

    const spawnMarkers = this.scene.userData.spawnMarkers || [];
    for (let i=spawnMarkers.length-1;i>=0;i--) {
      const m = spawnMarkers[i];
      m.userData.life -= dt;
      m.material.opacity = 0.8 * (m.userData.life / 2.0);
      m.scale.multiplyScalar(1.02);
      if (m.userData.life <= 0) {
        this.scene.remove(m); spawnMarkers.splice(i,1);
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
        this.scene.remove(p); flakPuffs.splice(i,1);
      }
    }

    // Carrier fighters: auto-return & repair after 60s
    for (const u of this.playerUnits) {
      if (u.type === 'fighter' && u.faction === 'player' && u.mesh.userData.launchedFrom) {
        u._fighterLifeTimer = (u._fighterLifeTimer || 0) + dt;
        if (u._fighterLifeTimer > 60) {
          const carrier = u.mesh.userData.launchedFrom;
          if (carrier && carrier.alive) {
            // Return to carrier
            u.moveTo(carrier.mesh.position.clone());
            u._fighterLifeTimer = 0;
            u.hp = Math.min(u.maxHp, u.hp + u.maxHp * 0.5); // Repair 50%
            u._displayHp = u.hp;
          }
        }
      }
    }

    if (this.minimap && this.minimap.pings) {
      for (let i=this.minimap.pings.length-1;i>=0;i--) {
        const p = this.minimap.pings[i];
        p.life -= dt;
        if (p.life <= 0) this.minimap.pings.splice(i,1);
      }
    }

    // Animate formation preview
    this._animateFormationPreview(dt);

    // Cleanup dead units
    const deadCount = this.deadUnits.length;
    this.playerUnits = this.playerUnits.filter(u => !u._cleaned);
    this.enemyUnits  = this.enemyUnits.filter(u => !u._cleaned);
    this.selectedUnits = this.selectedUnits.filter(u => u.alive);

    // AI
    this.aiTimer += dt;
    if (this.onAITick) this.onAITick(dt);

    // Fog of war — update 4× per second
    this.fogUpdateTimer += dt;
    if (this.fogUpdateTimer > 0.25 && this.fog) {
      this.fog.update(this.playerUnits, this.bases.filter(b => b.faction === 'player'));
      this.fogUpdateTimer = 0;
    }

    if (this.minimap) this.minimap.draw();
    this.updateHUD();
  }

  updateHUD() {
    const owned = this.bases.filter(b => b.faction === 'player').length;
    document.getElementById('money').textContent = Math.floor(this.money);
    document.getElementById('income').textContent = `+${PASSIVE_INCOME * owned}/s`;
    document.getElementById('unitCount').textContent = this.playerUnits.length;
    document.getElementById('basesOwned').textContent = owned;
  }

  checkWinCondition() {
    const playerBases = this.bases.filter(b => b.faction === 'player').length;
    const enemyBases  = this.bases.filter(b => b.faction === 'enemy').length;
    console.log(`[DEBUG GAME] Win check: player bases=${playerBases}, enemy bases=${enemyBases}`);
    if (enemyBases === 0) this.endGame(true);
    else if (playerBases === 0) this.endGame(false);
  }

  endGame(victory) {
    this.ended = true;
    console.log(`[DEBUG GAME] GAME ENDED — ${victory ? 'VICTORY' : 'DEFEAT'}`);
    document.getElementById('endScreen').classList.remove('hidden');
    document.getElementById('endTitle').textContent = victory ? '🏆 Victory!' : '💀 Defeat';
  }

  _animateFormationPreview(dt) {
    if (!this.scene || !this.scene.children) return;
    const time = performance.now() * 0.004;
    for (const child of this.scene.children) {
      if (child.userData?.animOffset !== undefined) {
        child.scale.setScalar(1 + Math.sin(time + child.userData.animOffset) * 0.15);
        child.material.opacity = 0.4 + Math.sin(time * 2 + child.userData.animOffset) * 0.2;
      }
    }
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
        const push = overlap * 0.3;
        const nx = dx / dist, nz = dz / dist;
        a.mesh.position.x -= nx * push;
        a.mesh.position.z -= nz * push;
        b.mesh.position.x += nx * push;
        b.mesh.position.z += nz * push;
      }
    }
  }
}
