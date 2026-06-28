// game.js — Game state, Unit class, Base class, and main game loop.
import * as THREE from 'three';
import { UNIT_TYPES, DIFFICULTY, STARTING_MONEY, PASSIVE_INCOME, TERRAIN, MAP_SIZE, CARRIER_FIGHTER_COOLDOWN, CARRIER_FIGHTER_COUNT, PROJECTILE_PATTERNS, ENGAGE_RANGE_MULT } from './config.js?v=6';
import { LAND_HEIGHT, buildTerrain } from './terrain.js?v=3';
import { createUnitMesh, createBaseMesh, createShipyardMesh } from './unitFactory.js?v=3';
import { Projectile, updateExplosions, applyTerrainBonus, updateAllTrails, createProjectilePattern, applyHitscanDamage } from './combat.js?v=3';
import { Pathfinder } from './pathfinder.js?v=4';
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

    // Engagement range: invisible awareness range beyond attack range
    this.engageRange = this.stats.range * ENGAGE_RANGE_MULT;
    this._pursueTarget = null;

    // Carrier ability
    this.canLaunch = !!baseStats.canLaunchFighters;
    this.launchCooldown = 0;
    this.canFireWhileMoving = !!this.stats.canFireWhileMoving;
    this._targetScanTimer = 0;

    // Transport ship
    this.isTransport = this.type === 'transport';
    this.carriedUnits = [];
    this.transportCapacity = this.stats.transportCapacity || 0;
    this._boardingTimer = 0;
    this._assignedEmbarkPoint = null;
    this._claimedByShip = null;

    // Amphibious mode: land unit auto-converts to boat in water
    this._amphibious = false;

    // Transport path data (from findTransportPath)
    this._transportData = null;

    // Path arrow line visualization
    this._pathLine = null;
    this._pathArrowHead = null;

    // Unique mechanics state
    this._destroyerShotCount = 0;        // For flak every 3rd shot
    this._battleshipBroadside = false;    // Broadside requirement
    this._bomberCarpetDir = null;         // Carpet bomb perpendicular direction
    this._artilleryBarrageIndex = 0;      // Creeping barrage progress
    this._infantryCaptureTarget = null;   // Base being captured

    this.mesh = createUnitMesh(type, baseStats.color, faction);
    const y = this.domain === 'air' ? baseStats.altitude : (position.y ?? (this.domain === 'sea' ? 0.3 : LAND_HEIGHT + 0.5));
    this.mesh.position.set(position.x, y, position.z);
    this._labelHeight = this.domain === 'air' ? 4 : (this.domain === 'sea' ? 4 : 3.5);

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
    // Immovable units (speed=0) cannot move
    if (this.stats.speed === 0) { this.state = 'idle'; return; }
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
    this._transportData = null; // clear previous transport plan

    if (this.domain === 'air') {
      this.moveTarget = targetPos.clone();
      this.path = [];
    } else if (this.domain === 'land') {
      // Use multi-modal pathfinding for land units
      const result = this.game.pathfinder.findTransportPath(this.mesh.position, targetPos);
      if (result) {
        if (result.needsTransport) {
          // Override disembark: use nearest friendly base coast instead of enemy base coast
          const friendlyBases = this.game.bases.filter(b => b.faction === this.faction && b.alive);
          if (friendlyBases.length > 0) {
            // Find nearest friendly base to the TARGET destination
            let nearestFriendly = friendlyBases[0];
            let nearestDist = Infinity;
            for (const fb of friendlyBases) {
              const d = Math.hypot(fb.mesh.position.x - targetPos.x, fb.mesh.position.z - targetPos.z);
              if (d < nearestDist) { nearestDist = d; nearestFriendly = fb; }
            }
            // Find coast near friendly base
            const g = this.game.pathfinder.worldToGrid(nearestFriendly.mesh.position.x, nearestFriendly.mesh.position.z);
            const coastResult = this.game.pathfinder.findNearestCoast(g.gx, g.gy, 'land');
            if (coastResult) {
              const groundW = this.game.pathfinder.gridToWorld(coastResult.groundTile.gx, coastResult.groundTile.gy);
              const seaW = this.game.pathfinder.gridToWorld(coastResult.seaTile.gx, coastResult.seaTile.gy);
              result.disembarkPoint = new THREE.Vector3(groundW.x, 0, groundW.z);
              result.shipDisembarkPoint = new THREE.Vector3(seaW.x, 0, seaW.z);
              // Re-calculate the walk-to-target segment from friendly base coast
              const newWalkPath = this.game.pathfinder.findPath(
                result.disembarkPoint, targetPos, 'land'
              );
              if (newWalkPath && newWalkPath.length > 0) {
                result.segments.walkToTarget = newWalkPath;
              }
            }
          }
          // Store transport plan, walk to embark point first
          this._transportData = result;
          this.path = result.segments.walkToShip;
          if (this.path.length > 0) this.moveTarget = this.path.shift();
          else { this.state = 'idle'; return; }
          console.log(`[DEBUG PATH] ${this.type} needs transport — walking to embark (${result.embarkPoint.x.toFixed(0)}, ${result.embarkPoint.z.toFixed(0)})`);
        } else {
          this.path = result.path;
          if (this.path.length > 0) this.moveTarget = this.path.shift();
          else { this.state = 'idle'; return; }
        }
      } else {
        // No path at all — try direct movement
        this.path = [];
        this.moveTarget = targetPos.clone();
      }
    } else {
      // Sea units: standard pathfinding
      let path = this.game.pathfinder.findPath(this.mesh.position, targetPos, this.domain);
      if (path && path.length > 0) {
        this.path = path;
        this.moveTarget = this.path.shift();
      } else {
        this.path = [];
        this.moveTarget = targetPos.clone();
      }
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
    // Transport: kill all carried units
    for (const u of this.carriedUnits) {
      if (u.alive) {
        u.mesh.visible = true;
        u.die();
      }
    }
    this.carriedUnits = [];
    // Create "OUT OF COMMISSION" label
    this._createDeathLabel();
    this.game.queueDeath(this);
  }

  _createDeathLabel() {
    const label = document.createElement('div');
    label.className = 'death-label';
    label.textContent = 'OUT OF COMMISSION';
    document.body.appendChild(label);
    this._deathLabel = label;
  }

  _updateDeathLabel() {
    if (!this._deathLabel) return;
    const vec = new THREE.Vector3();
    vec.copy(this.mesh.position);
    vec.y += this._labelHeight || 3;
    vec.project(this.game.camera);
    const x = (vec.x * 0.5 + 0.5) * this.game.renderer.domElement.clientWidth;
    const y = (-vec.y * 0.5 + 0.5) * this.game.renderer.domElement.clientHeight;
    this._deathLabel.style.left = `${x}px`;
    this._deathLabel.style.top = `${y}px`;
    this._deathLabel.style.display = vec.z < 1 ? 'block' : 'none';
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

    // HEALER: Heal nearby friendly air and land units
    if (this.stats.healer) {
      this._healNearby(dt);
    }

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

    // Periodic auto-target scan: idle faster, all units every 2s
    if (this.state === 'idle' || this.state === 'pursuing' || (this.state === 'moving' && (!this.moveTarget || this.attackMove))) {
      this.findTarget();
    }
    this._targetScanTimer += dt;
    if (this._targetScanTimer >= 2) {
      this._targetScanTimer = 0;
      if (this.state !== 'dead') this.findTarget();
    }
    // Units that can fire while moving: run attack logic even in 'moving' or 'pursuing' state
    if ((this.state === 'moving' || this.state === 'pursuing') && this.canFireWhileMoving && this.target) {
      this.updateAttackWhileMoving(dt);
    }

    // Amphibious auto-conversion: land unit in water → boat, boat on land → land
    // MUST run before updateMove so the domain check in updateMove uses the correct domain
    if (this.domain !== 'air' && this.state !== 'dead') {
      const pos = this.mesh.position;
      const terrain = this.game.terrain.getTerrainAt(pos.x, pos.z);
      if (this.domain === 'land' && terrain === TERRAIN.SEA) {
        this._amphibious = true;
        this.domain = 'sea';
        this.mesh.position.y = 0.3;
        if (this._rangeRing) this._rangeRing.material.color.setHex(0x4488ff);
      } else if (this._amphibious && (terrain === TERRAIN.LAND || terrain === TERRAIN.COAST)) {
        this._amphibious = false;
        this.domain = 'land';
        this.mesh.position.y = 0.5;
        if (this._rangeRing) this._rangeRing.material.color.setHex(this.faction === 'player' ? 0x4488ff : 0xff4444);
      }
    }

    switch (this.state) {
      case 'moving':    this.updateMove(dt); break;
      case 'attacking': this.updateAttack(dt); break;
      case 'pursuing':  this.updatePursue(dt); break;
      case 'waitingForTransport': this.updateWaitingForTransport(dt); break;
    }

    // Transport: sync carried units; skip combat
    if (this.isTransport) {
      this._updateTransport(dt);
      // Transport can't attack — clear any target
      this.target = null;
    }

    // Update path arrow line for ships (and any moving unit)
    this._updatePathLine();

    // Terrain enforcement: push to valid terrain (skip amphibious boats)
    if (this.state !== 'dead' && !this._amphibious) {
      const pos = this.mesh.position;
      const terrain = this.game.terrain.getTerrainAt(pos.x, pos.z);
      if (this.domain === 'sea' && terrain !== TERRAIN.SEA && terrain !== TERRAIN.COAST) {
        this._pushToValidTerrain('sea');
      } else if (this.domain === 'land' && terrain !== TERRAIN.LAND && terrain !== TERRAIN.COAST) {
        this._pushToValidTerrain('land');
      }
    }

    // Range ring follows unit
    if (this.selected && this._rangeRing) {
      this._rangeRing.position.set(this.mesh.position.x, 0.3, this.mesh.position.z);
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

  /** Healer: heal nearby friendly air and land units 5% HP/sec */
  _healNearby(dt) {
    const allies = this.faction === 'player' ? this.game.playerUnits : this.game.enemyUnits;
    for (const u of allies) {
      if (!u.alive || u === this) continue;
      if (u.domain !== 'air' && u.domain !== 'land') continue;
      if (u.hp >= u.maxHp) continue;
      const d = this.mesh.position.distanceTo(u.mesh.position);
      if (d <= this.stats.range) {
        const heal = u.maxHp * 0.05 * dt;
        u.hp = Math.min(u.maxHp, u.hp + heal);
        u._displayHp = u.hp;
      }
    }
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

  // ----- Transport ship -----
  canLoadUnit(unit) {
    if (!this.isTransport || !this.alive) return false;
    if (unit.faction !== this.faction) return false;
    if (!unit.alive) return false;
    if (unit.domain !== 'land') return false;
    if (this.carriedUnits.length >= this.transportCapacity) return false;
    const d = this.mesh.position.distanceTo(unit.mesh.position);
    return d <= 14;
  }

  loadUnit(unit) {
    if (!this.canLoadUnit(unit)) return false;
    this.carriedUnits.push(unit);
    unit.mesh.visible = false;
    unit.carried = true;
    unit.state = 'idle';
    console.log(`[DEBUG TRANSPORT] Loaded ${unit.type} (${this.carriedUnits.length}/${this.transportCapacity})`);
    return true;
  }

  canUnload() {
    if (!this.isTransport || !this.alive) return false;
    if (this.carriedUnits.length === 0) return false;
    const terrain = this.game.terrain.getTerrainAt(this.mesh.position.x, this.mesh.position.z);
    return terrain === TERRAIN.COAST || terrain === TERRAIN.LAND;
  }

  unloadAll() {
    if (!this.canUnload()) return;
    const count = this.carriedUnits.length;

    // Find the nearest walkable land cell as the landing zone
    const g = this.game.pathfinder.worldToGrid(this.mesh.position.x, this.mesh.position.z);
    const landing = this.game.pathfinder.findNearestWalkable(g.gx, g.gy, 'land');
    let basePos;
    if (landing) {
      const w = this.game.pathfinder.gridToWorld(landing.gx, landing.gy);
      basePos = new THREE.Vector3(w.x, 0, w.z);
    } else {
      basePos = this.mesh.position.clone();
    }

    for (let i = this.carriedUnits.length - 1; i >= 0; i--) {
      const u = this.carriedUnits[i];
      // Fan units around the landing cell
      const angle = (i / count) * Math.PI * 2;
      const dist = 4 + Math.floor(i / count) * 4;
      const pos = basePos.clone().add(
        new THREE.Vector3(Math.cos(angle) * dist, 0, Math.sin(angle) * dist)
      );
      // Snap to valid terrain
      if (u.domain !== 'air') {
        const pg = this.game.pathfinder.worldToGrid(pos.x, pos.z);
        const nearest = this.game.pathfinder.findNearestWalkable(pg.gx, pg.gy, u.domain);
        if (nearest) {
          const w = this.game.pathfinder.gridToWorld(nearest.gx, nearest.gy);
          pos.set(w.x, 0, w.z);
        }
      }
      u.mesh.position.copy(pos);
      u.mesh.visible = true;
      u.carried = false;
      u.state = 'idle';

      // Auto-attack nearby enemies after unload
      const enemies = u.faction === 'player' ? this.game.enemyUnits : this.game.playerUnits;
      const nearestEnemy = enemies.reduce((best, e) => {
        if (!e.alive) return best;
        const d = u.mesh.position.distanceTo(e.mesh.position);
        return d < (best?.dist ?? Infinity) ? { unit: e, dist: d } : best;
      }, null);
      if (nearestEnemy && nearestEnemy.dist < u.stats.range * 2) {
        u.attack(nearestEnemy.unit);
      }

      this.carriedUnits.splice(i, 1);
    }
    console.log(`[DEBUG TRANSPORT] Unloaded ${count} units`);
  }

  _updateTransport(dt) {
    if (!this.alive) return;

    // Phase 1: Empty ship looking for unclaimed troops
    if (this.carriedUnits.length === 0 && !this._disembarkPoint && !this._assignedEmbarkPoint) {
      const allUnits = this.faction === 'player' ? this.game.playerUnits : this.game.enemyUnits;
      let bestDist = Infinity;
      let bestUnit = null;
      for (const u of allUnits) {
        if (u.alive && u.state === 'waitingForTransport' && u._transportData && !u._claimedByShip) {
          const d = this.mesh.position.distanceTo(u.mesh.position);
          if (d < bestDist) {
            bestDist = d;
            bestUnit = u;
          }
        }
      }
      if (bestUnit) {
        // Use no-smooth sea path to reach embark point
        const embarkTarget = bestUnit._transportData.shipEmbarkPoint.clone();
        const rawSeaPath = this.game.pathfinder.findPath(this.mesh.position, embarkTarget, 'sea', false);
        if (rawSeaPath && rawSeaPath.length > 0) {
          this.path = rawSeaPath;
          this.moveTarget = this.path.shift();
          this.state = 'moving';
        } else {
          this.moveTo(embarkTarget);
        }
        this._assignedEmbarkPoint = embarkTarget;
        this._transportData = bestUnit._transportData;
        this._boardingTimer = 0;
        // Claim ALL units waiting at this embark point
        for (const u of allUnits) {
          if (u.alive && u.state === 'waitingForTransport' && u._transportData && !u._claimedByShip) {
            const embarkDist = u._transportData.shipEmbarkPoint.distanceTo(this._assignedEmbarkPoint);
            if (embarkDist < 5) { // same embark point
              u._claimedByShip = this;
            }
          }
        }
        console.log(`[DEBUG TRANSPORT] Ship moving to pick up troops at (${this._assignedEmbarkPoint.x.toFixed(0)}, ${this._assignedEmbarkPoint.z.toFixed(0)})`);
      } else {
        if (this.state === 'idle') this._retreatToFriendlyBase();
      }
      return;
    }

    // Phase 2: Arrived at embark point, waiting for troops to board
    if (this._assignedEmbarkPoint && this.path.length === 0) {
      this._boardingTimer += dt;

      const isFull = this.carriedUnits.length >= this.transportCapacity;
      const timedOut = this._boardingTimer > 15;

      if ((isFull || timedOut) && this.carriedUnits.length > 0) {
        console.log(`[DEBUG TRANSPORT] Setting sail! Troops aboard: ${this.carriedUnits.length}`);
        // Use the pre-calculated sea path directly (no recalc, no smoothing)
        const sailPath = this._transportData?.segments?.sail;
        if (sailPath && sailPath.length > 0) {
          this.path = sailPath.map(p => p.clone());
          this.moveTarget = this.path.shift();
          this.state = 'moving';
        } else if (this._transportData?.shipDisembarkPoint) {
          this.moveTo(this._transportData.shipDisembarkPoint.clone());
        }
        this._disembarkPoint = this._transportData.disembarkPoint.clone();
        this._assignedEmbarkPoint = null;

        // Unclaim any troops that didn't make it
        const allUnits = this.faction === 'player' ? this.game.playerUnits : this.game.enemyUnits;
        for (const u of allUnits) {
          if (u._claimedByShip === this) u._claimedByShip = null;
        }
      } else if (timedOut && this.carriedUnits.length === 0) {
        const allUnits = this.faction === 'player' ? this.game.playerUnits : this.game.enemyUnits;
        for (const u of allUnits) {
          if (u._claimedByShip === this) u._claimedByShip = null;
        }
        this._assignedEmbarkPoint = null;
        this._transportData = null;
        this._retreatToFriendlyBase();
      }
      return;
    }

    // Phase 3: Arrived at disembark point, unloading troops
    if (this._disembarkPoint && this.carriedUnits.length > 0 && this.path.length === 0) {
      const units = [...this.carriedUnits];
      this.unloadAll();
      for (const u of units) {
        if (u.alive && u._transportData && u._transportData.segments) {
          u.path = u._transportData.segments.walkToTarget;
          if (u.path.length > 0) {
            u.moveTarget = u.path.shift();
            u.state = 'moving';
          }
          u._transportData = null;
        }
      }
      this._disembarkPoint = null;
      this._transportData = null;
      this._retreatToFriendlyBase();
      return;
    }

    // Sync carried unit meshes
    for (const u of this.carriedUnits) {
      u.mesh.position.copy(this.mesh.position);
      u.mesh.position.y += 0.5;
    }
  }

  _findNearestCoast(gx, gy) {
    // Pathfinder returns { groundTile, seaTile }
    const result = this.game.pathfinder.findNearestCoast(gx, gy, 'land');
    if (result && result.groundTile) {
      const w = this.game.pathfinder.gridToWorld(result.groundTile.gx, result.groundTile.gy);
      return new THREE.Vector3(w.x, 0, w.z);
    }
    return null;
  }

  _updatePathLine() {
    // Only show path arrows for transport ships
    if (!this.isTransport) {
      this._removePathLine();
      return;
    }

    const hasPath = this.path.length > 0 || this.moveTarget;
    if (!hasPath || this.state === 'dead' || this.state === 'idle') {
      this._removePathLine();
      return;
    }

    const color = this.faction === 'player' ? 0x44ff88 : 0xff4444;
    const points = [];
    // Start from current position
    points.push(new THREE.Vector3(this.mesh.position.x, 0.5, this.mesh.position.z));
    // Add remaining waypoints
    if (this.moveTarget) points.push(new THREE.Vector3(this.moveTarget.x, 0.5, this.moveTarget.z));
    for (const wp of this.path) {
      points.push(new THREE.Vector3(wp.x, 0.5, wp.z));
    }

    if (points.length < 2) { this._removePathLine(); return; }

    // Remove old line
    this._removePathLine();

    // Create line geometry
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6, depthTest: false });
    this._pathLine = new THREE.Line(geometry, material);
    this._pathLine.renderOrder = 890;
    this.game.scene.add(this._pathLine);

    // Arrow head at the end pointing forward
    const tip = points[points.length - 1];
    const prev = points[points.length - 2];
    const angle = Math.atan2(tip.x - prev.x, tip.z - prev.z);
    const arrowShape = new THREE.Shape();
    arrowShape.moveTo(0, 0);
    arrowShape.lineTo(-1.5, -3);
    arrowShape.lineTo(1.5, -3);
    arrowShape.closePath();
    const arrowGeom = new THREE.ShapeGeometry(arrowShape);
    const arrowMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthTest: false });
    this._pathArrowHead = new THREE.Mesh(arrowGeom, arrowMat);
    this._pathArrowHead.position.set(tip.x, 0.5, tip.z);
    this._pathArrowHead.rotation.x = -Math.PI / 2;
    this._pathArrowHead.rotation.z = -angle;
    this._pathArrowHead.renderOrder = 891;
    this.game.scene.add(this._pathArrowHead);
  }

  _removePathLine() {
    if (this._pathLine) {
      this.game.scene.remove(this._pathLine);
      this._pathLine.geometry.dispose();
      this._pathLine.material.dispose();
      this._pathLine = null;
    }
    if (this._pathArrowHead) {
      this.game.scene.remove(this._pathArrowHead);
      this._pathArrowHead.geometry.dispose();
      this._pathArrowHead.material.dispose();
      this._pathArrowHead = null;
    }
  }

  _retreatToFriendlyBase() {
    const bases = this.game.bases.filter(b => b.faction === this.faction);
    if (!bases.length) return;
    const nearest = bases.reduce((a, b) =>
      this.mesh.position.distanceTo(a.mesh.position) < this.mesh.position.distanceTo(b.mesh.position) ? a : b
    );
    const g = this.game.pathfinder.worldToGrid(nearest.mesh.position.x, nearest.mesh.position.z);
    const seaCell = this.game.pathfinder.findNearestWalkable(g.gx, g.gy, 'sea');
    if (seaCell) {
      const w = this.game.pathfinder.gridToWorld(seaCell.gx, seaCell.gy);
      this.moveTo(new THREE.Vector3(w.x, 0, w.z));
    }
  }

  _pushToValidTerrain(domain) {
    if (this._pushCooldown > 0) return;
    this._pushCooldown = 0.05;
    // Teleport directly to nearest walkable cell
    const gx = Math.floor((this.mesh.position.x + MAP_SIZE/2) / 12);
    const gy = Math.floor((this.mesh.position.z + MAP_SIZE/2) / 12);
    const nearest = this.game.pathfinder.findNearestWalkable(gx, gy, domain);
    if (nearest) {
      const world = this.game.pathfinder.gridToWorld(nearest.gx, nearest.gy);
      // Teleport to valid position
      this.mesh.position.set(world.x, 0, world.z);
      // Rotate 90 degrees to face away from land
      const angle = Math.random() * Math.PI * 2;
      this.mesh.rotation.y = angle;
      // Clear current movement and recalculate path to existing destination
      if (this.attackMoveDest && this.state !== 'idle') {
        this.moveTo(this.attackMoveDest, this.attackMove);
      }
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

    // Hard clamp: if on invalid terrain, snap to nearest walkable and stop
    if (this.domain !== 'air') {
      const curTerrain = this.game.terrain.getTerrainAt(pos.x, pos.z);
      if (!this.canEnter(curTerrain)) {
        this._pushToValidTerrain(this.domain);
        return;
      }
    }

    // Validate current waypoint is reachable
    if (this.domain !== 'air') {
      const wpTerrain = this.game.terrain.getTerrainAt(this.moveTarget.x, this.moveTarget.z);
      if (!this.canEnter(wpTerrain)) {
        // Reject invalid waypoint, find nearest valid one
        const g = this.game.pathfinder.worldToGrid(this.moveTarget.x, this.moveTarget.z);
        const nearest = this.game.pathfinder.findNearestWalkable(g.gx, g.gy, this.domain);
        if (nearest) {
          const w = this.game.pathfinder.gridToWorld(nearest.gx, nearest.gy);
          this.moveTarget.set(w.x, 0, w.z);
        } else {
          this.moveTarget = this.path.shift() || null;
          if (!this.moveTarget) this.state = 'idle';
        }
        return;
      }
    }

    const dx = this.moveTarget.x - pos.x;
    const dz = this.moveTarget.z - pos.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 2) {
      this.moveTarget = this.path.length > 0 ? this.path.shift() : null;
      if (!this.moveTarget) {
        // Check if we finished walking to embark point — need transport
        if (this._transportData && this._transportData.needsTransport && this._transportData.segments) {
          this.state = 'waitingForTransport';
          this._transportData._phase = 'waiting';
          console.log(`[DEBUG TRANSPORT] ${this.type} reached embark point, waiting for transport`);
          return;
        }
        this.state = 'idle';
      }
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
    const rotSpeed = this.domain === 'air' ? dt * 10 : dt * 6;
    cur += diff * Math.min(1, rotSpeed);
    this.mesh.rotation.y = cur;
  }

  canEnter(terrain) {
    if (this.domain === 'air')  return true;
    if (this.domain === 'sea')  return terrain === TERRAIN.SEA || terrain === TERRAIN.COAST;
    if (this.domain === 'land') return terrain === TERRAIN.LAND || terrain === TERRAIN.COAST;
    return true;
  }

  findTarget() {
    // Escort bomber: never auto-targets
    if (this.stats.escortBomber) return;

    // Don't override a valid active attack
    if (this.target && this.target.alive && this.state === 'attacking') return;

    const enemies = this.faction === 'player' ? this.game.enemyUnits : this.game.playerUnits;
    const airOnly = !!this.stats.airOnly;
    const baseOnly = !!this.stats.baseOnly;
    const isLand = this.domain === 'land';

    // Base-only units (B2): only target bases
    if (baseOnly) {
      const bases = this.game.bases.filter(b => b.alive && b.faction !== this.faction);
      let bestBase = null, bestD = this.engageRange;
      for (const b of bases) {
        const d = this._dist2d(b.mesh.position);
        if (d < bestD) { bestBase = b; bestD = d; }
      }
      if (bestBase) {
        if (bestD <= this.stats.range) {
          this.target = bestBase;
          this.state = 'attacking';
        } else if (this.stats.speed > 0) {
          this._pursueTarget = bestBase;
          this.state = 'pursuing';
        }
      }
      return;
    }

    let best = null, bestD = this.engageRange;
    let bestPriority = 99;

    for (const e of enemies) {
      if (!e.alive) continue;

      // Specialized targeting rules
      if (airOnly && e.domain !== 'air') continue;
      if (this.stats.seaOnly && e.domain !== 'sea') continue;
      if (this.stats.groundOnly && e.domain === 'air') continue;

      // Land units cannot target air (except missile defense handled above)
      if (isLand && !airOnly && e.domain === 'air') continue;

      const d = this._dist2d(e.mesh.position);

      // Targeting priority for land units: ground(1) > base(2) > ship(3)
      let priority = 1;
      if (isLand && !airOnly) {
        if (e.domain === 'sea') {
          // Ships only targetable if very close (30% of attack range)
          if (d > this.stats.range * 0.3) continue;
          priority = 3;
        } else {
          priority = 1; // ground enemy
        }
      }

      if (priority < bestPriority || (priority === bestPriority && d < bestD)) {
        best = e; bestD = d; bestPriority = priority;
      }
    }

    // Fallback: target enemy bases (priority 2 for land units)
    if (!best && this.stats.range > 0) {
      const bases = this.game.bases.filter(b => b.alive && b.faction !== this.faction);
      let bestBaseD = this.engageRange;
      for (const b of bases) {
        const d = this._dist2d(b.mesh.position);
        if (d < bestBaseD) { best = b; bestBaseD = d; bestPriority = 2; }
      }
    }

    if (best) {
      const dist = bestD;
      if (dist <= this.stats.range) {
        // Within attack range — attack directly
        this.target = best;
        this.state = 'attacking';
      } else if (dist <= this.engageRange && this.stats.speed > 0) {
        // Within engage range but not attack range — pursue
        this._pursueTarget = best;
        this.state = 'pursuing';
      }
    }
  }

  _dist2d(pos) {
    return Math.hypot(this.mesh.position.x - pos.x, this.mesh.position.z - pos.z);
  }

  updateAttack(dt) {
    if (!this.target || !this.target.alive) {
      this.target = null;
      if (this.attackMove && this.attackMoveDest) {
        this.moveTo(this.attackMoveDest, true);
      } else {
        this.state = 'idle';
      }
      return;
    }
    // Base captured (faction changed) — release target
    if (this.target.faction && this.target.faction === this.faction) {
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
      // Sea units attacking a land target: move to closest coast in range
      if (this.domain === 'sea' && this.target.domain === 'land') {
        const coastPos = this._findCoastInRange(targetPos);
        if (coastPos) {
          this.moveTo(coastPos, this.attackMove);
        } else {
          // No reachable coast — just try to approach
          const snap = this._snapToNearestSea(targetPos);
          if (snap) this.moveTo(snap, this.attackMove);
        }
      } else {
        this.moveTo(targetPos, this.attackMove);
      }
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

  /** Find closest coast cell within range of the target */
  _findCoastInRange(targetPos) {
    const g = this.game.pathfinder.worldToGrid(targetPos.x, targetPos.z);
    const rangeCell = Math.ceil(this.stats.range / this.game.pathfinder.cell) + 1;
    let best = null, bestDist = Infinity;
    for (let dy = -rangeCell; dy <= rangeCell; dy++) {
      for (let dx = -rangeCell; dx <= rangeCell; dx++) {
        const gx = g.gx + dx, gy = g.gy + dy;
        if (!this.game.pathfinder.walkable(gx, gy, 'sea')) continue;
        const w = this.game.pathfinder.gridToWorld(gx, gy);
        const d = Math.hypot(w.x - targetPos.x, w.z - targetPos.z);
        if (d <= this.stats.range && d < bestDist) {
          const fromDist = Math.hypot(w.x - this.mesh.position.x, w.z - this.mesh.position.z);
          if (fromDist < bestDist) {
            bestDist = fromDist;
            best = new THREE.Vector3(w.x, 0, w.z);
          }
        }
      }
    }
    return best;
  }

  _snapToNearestSea(targetPos) {
    const g = this.game.pathfinder.worldToGrid(targetPos.x, targetPos.z);
    const nearest = this.game.pathfinder.findNearestWalkable(g.gx, g.gy, 'sea');
    if (!nearest) return null;
    const w = this.game.pathfinder.gridToWorld(nearest.gx, nearest.gy);
    return new THREE.Vector3(w.x, 0, w.z);
  }

  /** Attack logic for units that can fire while moving (ships, planes). */
  updateAttackWhileMoving(dt) {
    if (!this.target) { this.target = null; return; }
    // Check alive (works for both units and base synthetic targets)
    const alive = this.target.alive != null ? this.target.alive : true;
    if (!alive) { this.target = null; return; }
    // Base captured (faction changed) — release target
    if (this.target.faction && this.target.faction === this.faction) { this.target = null; return; }
    const targetPos = this.target.mesh ? this.target.mesh.position : this.target.position;
    const dist = this._dist2d(targetPos);
    if (dist > this.stats.range) {
      // Sea units attacking a land target: steer toward closest coast in range
      if (this.domain === 'sea' && this.target.domain === 'land') {
        const coastPos = this._findCoastInRange(targetPos);
        if (coastPos) this.moveTo(coastPos, this.attackMove);
      }
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

  /** Pursue: move toward a target detected at engage range. */
  updatePursue(dt) {
    if (!this._pursueTarget || !this._pursueTarget.alive) {
      this._pursueTarget = null;
      this.target = null;
      if (this.attackMove && this.attackMoveDest) {
        this.moveTo(this.attackMoveDest, true);
      } else {
        this.state = 'idle';
      }
      return;
    }
    // Base captured check
    if (this._pursueTarget.faction && this._pursueTarget.faction === this.faction) {
      this._pursueTarget = null;
      this.target = null;
      this.state = 'idle';
      return;
    }
    const targetPos = this._pursueTarget.mesh ? this._pursueTarget.mesh.position : this._pursueTarget.position;
    const dist = this._dist2d(targetPos);

    // One-way units (escort bomber): die when reaching the target
    if (this.stats.oneWay && this.stats.range === 0 && dist < 20) {
      this.hp = 0;
      this.die();
      return;
    }

    // If within attack range, switch to attacking
    if (dist <= this.stats.range) {
      this.target = this._pursueTarget;
      this.state = 'attacking';
      this._pursueTarget = null;
      return;
    }

    // Fire while moving during pursuit (ships, planes)
    if (this.canFireWhileMoving && dist <= this.stats.range * 1.2) {
      this.target = this._pursueTarget;
      const dx = targetPos.x - this.mesh.position.x;
      const dz = targetPos.z - this.mesh.position.z;
      const aimAngle = Math.atan2(dx, dz);
      if (this.mesh.userData.turret) {
        this.mesh.userData.turret.rotation.y = aimAngle - this.mesh.rotation.y;
      }
      if (this.cooldown <= 0) this.fire();
    }

    // Move toward target
    const dx = targetPos.x - this.mesh.position.x;
    const dz = targetPos.z - this.mesh.position.z;
    const step = this.stats.speed * dt;
    if (dist > step) {
      this.mesh.position.x += (dx / dist) * step;
      this.mesh.position.z += (dz / dist) * step;
    }
    const targetAngle = Math.atan2(dx, dz);
    this.smoothRotate(targetAngle, dt);

    // Air units: maintain altitude and bank on turns
    if (this.domain === 'air') {
      const delta = ((targetAngle - this.mesh.rotation.y + Math.PI*3) % (Math.PI*2)) - Math.PI;
      this.mesh.rotation.z = THREE.MathUtils.clamp(-delta, -0.5, 0.5);
      this.mesh.position.y = this.stats.altitude;
    }

    // Keep bobbing for ships
    if (this.domain === 'sea') {
      this.mesh.userData.bobPhase += dt * 2;
      this.mesh.position.y = Math.sin(this.mesh.userData.bobPhase) * 0.15 + 0.3;
    }
  }

  /** Waiting for transport: find a nearby friendly transport and board it. */
  updateWaitingForTransport(dt) {
    if (!this._transportData || !this._transportData.needsTransport) {
      this.state = 'idle';
      return;
    }

    // First priority: the transport that claimed us
    let targetTransport = this._claimedByShip;
    
    // Fallback: any nearby friendly transport with space
    if (!targetTransport || !targetTransport.alive || targetTransport.carriedUnits.length >= targetTransport.transportCapacity) {
      const allUnits = this.faction === 'player' ? this.game.playerUnits : this.game.enemyUnits;
      for (const t of allUnits) {
        if (!t.alive || !t.isTransport) continue;
        if (t.faction !== this.faction) continue;
        if (t.carriedUnits.length >= t.transportCapacity) continue;
        // Prefer the one assigned to our embark point
        if (t._assignedEmbarkPoint && this._transportData && 
            t._assignedEmbarkPoint.distanceTo(this._transportData.shipEmbarkPoint) < 5) {
          targetTransport = t;
          break;
        }
        if (!targetTransport) targetTransport = t;
      }
    }

    if (targetTransport) {
      const d = this.mesh.position.distanceTo(targetTransport.mesh.position);
      const loadRange = 14; // slightly more than canLoadUnit's 12 to account for positioning
      
      if (d <= loadRange) {
        // Close enough to board
        targetTransport.loadUnit(this);
        if (!targetTransport._transportData) {
          targetTransport._transportData = this._transportData;
        }
        this._claimedByShip = null;
        console.log(`[DEBUG TRANSPORT] ${this.type} boarded transport (${targetTransport.carriedUnits.length}/${targetTransport.transportCapacity})`);
        return;
      } else {
        // Move toward the transport's embark point
        if (targetTransport._assignedEmbarkPoint) {
          this.moveTo(targetTransport._assignedEmbarkPoint.clone());
        } else if (this._transportData && this._transportData.shipEmbarkPoint) {
          this.moveTo(this._transportData.shipEmbarkPoint.clone());
        }
        return;
      }
    }

    if (this.domain === 'sea') {
      this.mesh.userData.bobPhase = (this.mesh.userData.bobPhase || 0) + dt * 2;
      this.mesh.position.y = Math.sin(this.mesh.userData.bobPhase) * 0.15 + 0.3;
    }
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

    // SEA vs AIR: reduced damage AA fire (no missiles, just AA guns)
    if (this.domain === 'sea' && this.target.domain === 'air') {
      finalDmg *= 0.5; // 50% damage vs air
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
      if (this.stats.baseOnly) {
        console.log(`[DEBUG B2] Hitscan fired: ${finalDmg} dmg → ${this.target.name || 'base'} HP: ${this.target.hp?.toFixed(0)}`);
      }
      // One-way units (B2, escort bomber): die after dropping bomb / reaching target
      if (this.stats.oneWay) {
        this.hp = 0;
        this.die();
        return;
      }
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
    this._updateDeathLabel();
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
    this._removePathLine();
    if (this._deathLabel) {
      this._deathLabel.remove();
      this._deathLabel = null;
    }
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
    // Difficulty multiplier
    const diffCfg = DIFFICULTY[game.difficulty] || DIFFICULTY.easy;
    const diffHpMult = diffCfg.baseHpMultiplier || 1.0;
    this.hp = 500 * size * hpMult * diffHpMult;
    this.maxHp = this.hp;
    this.alive = true;
    this.domain = 'land';

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
    this.hp = this.maxHp;
    this._displayHp = this.hp;
    this._trailHp = this.hp;
    const flagColor = newOwner === 'player' ? 0x2266aa : 0xaa3333;
    // Update flag AND building HQ color
    this.mesh.children.forEach(c => {
      if (c.userData?.isFlag) {
        c.material.color.setHex(flagColor);
      }
      // Change HQ building color (the tall box)
      if (c.geometry?.type === 'BoxGeometry' && c.position.y > 4) {
        c.material.color.setHex(flagColor);
      }
    });
    // Update territory ring owner color
    if (this.territoryRing) {
      this.territoryRing.material.color.setHex(flagColor);
    }
    if (newOwner === 'player') {
      this.game.money += 400;
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

    // Auto-spawn transports for troops waiting on beach
    this._updateTransportLogistics(dt);

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
    // Enemy intel
    const enemyAlive = this.enemyUnits.filter(u => u.alive && u.state !== 'dead');
    document.getElementById('enemyCount').textContent = enemyAlive.length;
    // Live refresh of selection HP/status
    this.updateSelectionUI?.();
  }

  _updateTransportLogistics(dt) {
    for (const faction of ['player', 'enemy']) {
      const units = faction === 'player' ? this.playerUnits : this.enemyUnits;

      // 1. Count unclaimed waiting troops
      let waitingCount = 0;
      for (const u of units) {
        if (u.alive && u.state === 'waitingForTransport' && !u._claimedByShip) waitingCount++;
      }

      if (waitingCount > 0) {
        // 2. Count ships actively heading to pick up troops
        let activeShips = 0;
        for (const u of units) {
          if (u.alive && u.isTransport && u._assignedEmbarkPoint && u.carriedUnits.length < u.transportCapacity) {
            activeShips++;
          }
        }

        // 3. Spawn ships until we have enough (1 per 4 troops)
        const neededShips = Math.ceil(waitingCount / 4);
        if (activeShips < neededShips) {
          const cost = UNIT_TYPES.transport.cost;
          let money = faction === 'player' ? this.money : Infinity;

          if (money >= cost) {
            const bases = this.bases.filter(b => b.faction === faction && b.alive);
            let spawnPos = null;

            for (const base of bases) {
              const pos = this.findValidSpawn(base.mesh.position, 'sea');
              if (pos) { spawnPos = pos; break; }
            }

            if (!spawnPos && bases.length > 0) {
              const g = this.pathfinder.worldToGrid(bases[0].mesh.position.x, bases[0].mesh.position.z);
              const seaTile = this.pathfinder.findNearestWalkable(g.gx, g.gy, 'sea');
              if (seaTile) {
                const w = this.pathfinder.gridToWorld(seaTile.gx, seaTile.gy);
                spawnPos = new THREE.Vector3(w.x, 0.3, w.z);
              }
            }

            if (spawnPos) {
              if (faction === 'player') this.money -= cost;
              console.log(`[DEBUG LOGISTICS] Spawning Transport ship for ${faction} (${activeShips+1}/${neededShips})`);
              this.spawn('transport', faction, spawnPos);
            }
          }
        }
      }
    }
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
