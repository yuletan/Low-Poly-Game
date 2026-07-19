// unit.js — Unit class: movement, combat, transport, and unique unit mechanics.
import * as THREE from 'three';
import { UNIT_TYPES, ENGAGE_RANGE_MULT, CARRIER_FIGHTER_COOLDOWN, CARRIER_FIGHTER_COUNT, CARRIER_FIGHTER_INTERVAL, PROJECTILE_PATTERNS, TERRAIN, MAP_SIZE, BOARDING_RANGE, TRANSPORT_STANDOFF, STRANDED_TIMEOUT, FLEET_SAIL_DELAY, PROVOKE_INTERVAL, FIGHTER_SCAN_INTERVAL, PATH_LINE_THROTTLE, activePreset } from './config.js?v=7';
import { LAND_HEIGHT } from './terrain.js?v=3';
import { createUnitMesh } from './unitFactory.js?v=3';
import { createProjectilePattern, applyHitscanDamage, applyTerrainBonus, acquireFromPool } from './combat.js?v=3';
import { Sound } from './sound.js';
import { tlog as _tlog, twarn as _twarn } from './debug.js';
import { createHpBar, updateHpBar, createSelectionRing, buildRangeRing, disposeUnitVisuals } from './unitVisuals.js';

let _nextUnitId = 1;

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
    this.selectable = true;
    this._manualTarget = false;

    // Engagement range: invisible awareness range beyond attack range
    this.engageRange = this.stats.range * ENGAGE_RANGE_MULT;
    this._pursueTarget = null;

    // Carrier ability
    this.canLaunch = !!baseStats.canLaunchFighters;
    this.launchCooldown = 0;
    this._fighterSpawnTimer = 0;
    this._deployedFighters = 0;
    this._allDeployed = false;
    this.canFireWhileMoving = !!this.stats.canFireWhileMoving;
    this._targetScanTimer = 0;

    // Debug identifier for tracing units in log output
    this._debugId = _nextUnitId++;
    this._debugTag = `${this.type}#${this._debugId}`;

    // Transport ship
    this.isTransport = this.type === 'transport';
    this.carriedUnits = [];
    this.transportCapacity = this.stats.transportCapacity || 0;
    this._boardingTimer = 0;
    this._assignedEmbarkPoint = null;
    this._claimedByShip = null;
    this._waitingTimer = 0; // how long this troop has been in waitingForTransport state

    // Amphibious mode: land unit auto-converts to boat in water
    this._amphibious = false;

    // Transport path data (from findTransportPath)
    this._transportData = null;
    // Task 7: prevents _updateTransport() from hijacking a manual order
    this._manualOrder = false;
    // Task 8: land unit tagged with the transport it should board
    this._boardingTarget = null;
    // Task 9: set by enemy AI (ai.js dispatchGroundWave()) for synchronized amphibious waves
    this._aiWaveId = null;

    // Path arrow line visualization
    this._pathLine = null;
    this._pathArrowHead = null;

    // Aura system
    this._dmgMult = 1;
    this._hpMult = 1;
    this._baseMaxHp = this.stats.hp;
    this._auraTimer = 0;

    // Unique mechanics state
    this._destroyerShotCount = 0;        // For flak every 3rd shot
    this._battleshipBroadside = false;    // Broadside requirement
    this._bomberCarpetDir = null;         // Carpet bomb perpendicular direction
    this._artilleryBarrageIndex = 0;      // Creeping barrage progress
    this._infantryCaptureTarget = null;   // Base being captured

    // Performance throttling
    this._findTargetTimer = 0;
    this._transportSearchTimer = 0;
    this._waitingTransport = null;
    this._attackMovePathTimer = 1;
    this._attackMovePathKey = null;

    this.mesh = createUnitMesh(type, baseStats.color, faction);

    // Per-instance materials cloned from the shared caches (stealth / hit-flash).
    // Tracked so cleanup() can dispose them (shared cache materials are left intact).
    this._clonedMats = [];

    // Stealth: invisible until first attack (must be after mesh creation)
    this._stealthed = !!this.stats.stealth;
    if (this._stealthed) {
      this.mesh.traverse(c => {
        if (c.material) {
          c.material = c.material.clone();
          this._clonedMats.push(c.material);
          c.userData.origOpacity = c.material.opacity;
          c.material.transparent = true;
          c.material.opacity = 0.15;
        }
      });
    }
    const y = this.domain === 'air' ? baseStats.altitude : (position.y ?? (this.domain === 'sea' ? 0.3 : LAND_HEIGHT + 0.5));
    this.mesh.position.set(position.x, y, position.z);
    this._labelHeight = this.domain === 'air' ? 4 : (this.domain === 'sea' ? 4 : 3.5);

    // Selection ring + fill (shared geometry, per-unit material)
    const { ring, fill } = createSelectionRing(faction);
    this.ring = ring;
    this._ringFill = fill;
    this.mesh.add(ring);
    this.mesh.add(fill);

    // HP bar (shared geometry/materials, per-unit mesh transforms)
    const barWidth = type === 'carrier' ? 7 : type === 'battleship' ? 6 : type === 'destroyer' ? 5
                   : (type === 'tank' || type === 'artillery') ? 4 : type === 'infantry' ? 3 : 2.5;
    const barHeight = 0.5; // taller bar for visibility
    const barY = this.domain === 'air' ? -3 : (this.domain === 'sea' ? 2.5 : 3.5);
    this._barWidth = barWidth;

    const hpBar = createHpBar(faction, barWidth, barHeight, barY);
    this.mesh.add(hpBar.group);

    this._hpBar = { fg: hpBar.fg, trail: hpBar.trail, barWidth };
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

    // Movement smoothing state
    this._lastPathTime = 0;
    this._pathValid = false;
    this._moveTargetCached = null;
    this._stuckTimer = 0;
    this._stuckPosition = null;
    this._lastDx = 0;
    this._lastDz = 0;

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
          // The pathfinder already calculated the correct disembark point
          // (nearest enemy coast to the target destination). Use it directly.
          // Store transport plan, walk to embark point first
          this._transportData = result;
          this.path = result.segments.walkToShip;
          if (this.path.length > 0) this.moveTarget = this.path.shift();
          else { this.state = 'idle'; return; }
        } else {
          this.path = result.path;
          if (this.path.length > 0) this.moveTarget = this.path.shift();
          else { this.state = 'idle'; return; }
        }
      } else {
        // No path Ã¢â‚¬â€ try to find nearest walkable point near target and path to that
        const g = this.game.pathfinder.worldToGrid(targetPos.x, targetPos.z);
        const near = this.game.pathfinder.findNearestWalkable(g.gx, g.gy, 'land');
        if (near) {
          const w = this.game.pathfinder.gridToWorld(near.gx, near.gy);
          const fallback = new THREE.Vector3(w.x, 0, w.z);
          const retry = this.game.pathfinder.findPath(this.mesh.position, fallback, 'land');
          if (retry && retry.length > 0) {
            this.path = retry;
            this.moveTarget = this.path.shift();
          } else {
            this.path = [];
            this.moveTarget = fallback;
          }
        } else {
          this.path = [];
          this.moveTarget = targetPos.clone();
        }
      }
    } else {
      // Sea units: standard pathfinding
      let path = this.game.pathfinder.findPath(this.mesh.position, targetPos, this.domain);
      if (path && path.length > 0) {
        this.path = path;
        this.moveTarget = this.path.shift();
      } else {
        // No path Ã¢â‚¬â€ try nearest walkable sea cell near target
        const g = this.game.pathfinder.worldToGrid(targetPos.x, targetPos.z);
        const near = this.game.pathfinder.findNearestWalkable(g.gx, g.gy, 'sea');
        if (near) {
          const w = this.game.pathfinder.gridToWorld(near.gx, near.gy);
          const fallback = new THREE.Vector3(w.x, 0, w.z);
          const retry = this.game.pathfinder.findPath(this.mesh.position, fallback, 'sea');
          if (retry && retry.length > 0) {
            this.path = retry;
            this.moveTarget = this.path.shift();
          } else {
            this.path = [];
            this.moveTarget = fallback;
          }
        } else {
          this.path = [];
          this.moveTarget = targetPos.clone();
        }
      }
    }
    this.state = 'moving';
  }

  /**
   * Task 9: sibling of moveTo()'s needsTransport branch, but takes a
   * transport plan that's already been computed ONCE for a whole AI attack
   * wave (see ai.js dispatchGroundWave()) instead of calling
   * findTransportPath() from this unit's own position.
   */
  assignSharedTransportPlan(plan, finalTargetPos, attackMove = true) {
    const walkToShip = this.game.pathfinder.findPath(this.mesh.position, plan.embarkPoint, 'land');
    if (!walkToShip || walkToShip.length === 0) return false;
    this.attackMove = attackMove;
    this.attackMoveDest = finalTargetPos.clone();
    this._transportData = plan;
    this.path = walkToShip;
    this.moveTarget = this.path.shift();
    this.state = 'moving';
    return true;
  }

  attack(enemy) {
    this.target = enemy;
    this._manualTarget = true;
    this.state  = 'attacking';
  }

  takeDamage(dmg) {
    // Crusher absorption: nearby friendly crushers absorb 60% of damage
    if (this.stats && !this.stats.crusher) {
      const allies = this.faction === 'player' ? this.game.playerUnits : this.game.enemyUnits;
      let absorber = null;
      const considerCrusher = u => {
        if (absorber || u.faction !== this.faction || !u.alive || !u.stats.crusher || u === this) return;
        const d = this._dist2d(u.mesh.position);
        if (d <= u.stats.range) absorber = u;
      };
      const grid = this.game.spatialGrid?.cells.size ? this.game.spatialGrid : null;
      if (grid) {
        grid.queryCircle(
          this.mesh.position.x, this.mesh.position.z, 64, considerCrusher
        );
      } else {
        for (const u of allies) considerCrusher(u);
      }
      if (absorber) {
        const absorbed = dmg * 0.6;
        dmg -= absorbed;
        absorber.hp -= absorbed * 0.3; // Crusher takes 30% of absorbed damage
        if (absorber.hp <= 0) absorber.hp = 0;
        absorber._displayHp = absorber.hp;
        if (absorber.hp <= 0) absorber.die();
      }
    }

    this.hp -= dmg;
    if (this.hp <= 0) this.hp = 0;
    this._displayHp = this.hp;

    // Hit flash Ã¢â‚¬â€ clone materials first to avoid corrupting shared MAT_CACHE
    if (!this._hitFlashOrig) {
      this.mesh.traverse(c => {
        if (c.material?.color && c.userData.origColor === undefined) {
          c.userData.origColor = c.material.color.getHex();
          c.material = c.material.clone();
          this._clonedMats.push(c.material);
        }
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
    Sound.play('explosion');
    // Award bounty if killed by player (2x cash)
    const bounty = (this.stats.bounty || 0) * 2;
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
    // Fleet: release escorts from formation
    if (this._fleetEscorts) {
      for (const esc of this._fleetEscorts) {
        if (esc.alive) {
          esc._fleetCarrier = null;
          esc._fleetOffset = null;
          esc.state = 'idle';
        }
      }
      this._fleetEscorts = null;
      this._fleetFormation = false;
    }
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
    // Auto-targeting (units and bases, in weapon range) is handled by the
    // throttled findTarget() scan below — no separate every-frame scans here.
    // Task 8: auto-board if close to boarding target
    if (this.domain === 'land' && !this.carried && this._boardingTarget && this._boardingTarget.alive) {
      const d = Math.hypot(
        this.mesh.position.x - this._boardingTarget.mesh.position.x,
        this.mesh.position.z - this._boardingTarget.mesh.position.z
      );
      if (d < BOARDING_RANGE) {
        if (this._boardingTarget.loadUnit(this)) {
          this._boardingTarget = null;
        }
      }
    }
    this.cooldown -= dt;
    if (this.canLaunch) this.launchCooldown -= dt;
    if (this._pushCooldown > 0) this._pushCooldown -= dt;

    if (this.domain === 'sea') {
      this.mesh.userData.bobPhase += dt * 2;
      this.mesh.position.y = Math.sin(this.mesh.userData.bobPhase) * 0.15 + 0.3;
    }

    // HP bar update
    this._updateHpBar(dt);

    // Hit flash — disabled on ultra low
    if (activePreset.hitFlashEnabled) this._updateHitFlash(dt);

    // ===== UNIQUE MECHANICS PER UNIT =====

    // HEALER: Heal nearby friendly air and land units — disabled on ultra low
    if (this.stats.healer && activePreset.healerEnabled) {
      this._healNearby(dt);
    }

    // AURA: Recalculate buffs — throttled by preset (0 = disabled)
    const auraInterval = activePreset.auraInterval;
    if (auraInterval > 0) {
      this._auraTimer += dt;
      if (this._auraTimer >= auraInterval) {
        this._auraTimer = 0;
        this._recalcAuras();
      }
    }

    // CARRIER: Spawn 1 fighter every 2s, max 12 deployed, then 30s cooldown
    if (this.type === 'carrier' && this.canLaunch) {
      this.launchCooldown -= dt; // already done above, but ensures tick-down
      // Count alive fighters belonging to this carrier
      const allUnits = this.faction === 'player' ? this.game.playerUnits : this.game.enemyUnits;
      let aliveFighters = 0;
      for (const u of allUnits) {
        if (u.alive && u.type === 'fighter' && u.mesh.userData.launchedFrom === this) aliveFighters++;
      }
      // If all deployed fighters have returned (or died), reset deployment cycle
      if (this._allDeployed && aliveFighters === 0) {
        this._allDeployed = false;
        this._deployedFighters = 0;
        this.launchCooldown = CARRIER_FIGHTER_COOLDOWN;
      }
      // Spawn fighters one at a time every 2s
      if (!this._allDeployed && this.launchCooldown <= 0 && this._deployedFighters < CARRIER_FIGHTER_COUNT) {
        this._fighterSpawnTimer += dt;
        if (this._fighterSpawnTimer >= CARRIER_FIGHTER_INTERVAL) {
          this._fighterSpawnTimer = 0;
          this._spawnSingleFighter();
          this._deployedFighters++;
          if (this._deployedFighters >= CARRIER_FIGHTER_COUNT) {
            this._allDeployed = true;
          }
        }
      }
    }

    // CARRIER FLEET: escorts follow carrier in formation
    if (this.type === 'carrier' && this._fleetFormation && this._fleetEscorts) {
      for (const esc of this._fleetEscorts) {
        if (!esc.alive || !esc._fleetOffset) continue;
        const targetX = this.mesh.position.x + esc._fleetOffset.x;
        const targetZ = this.mesh.position.z + esc._fleetOffset.z;
        const dx = targetX - esc.mesh.position.x;
        const dz = targetZ - esc.mesh.position.z;
        const dist = Math.hypot(dx, dz);
        if (dist > 3) {
          const step = esc.stats.speed * dt;
          esc.mesh.position.x += (dx / dist) * step;
          esc.mesh.position.z += (dz / dist) * step;
          esc.mesh.position.y = 0.3;
        }
      }
    }

    // FIGHTER: Auto-return to carrier and manage lifecycle
    if (this.type === 'fighter' && this.mesh.userData.launchedFrom) {
      this._fighterScanTimer += dt;
      if (this._fighterScanTimer >= FIGHTER_SCAN_INTERVAL) {
        this._fighterScanTimer = 0;
        this._fighterAutoReturn(dt);
      }
      // Transition deploying -> engaging when entering combat
      if (this.mesh.userData.fighterState === 'deploying' && (this.state === 'pursuing' || this.state === 'attacking')) {
        this.mesh.userData.fighterState = 'engaging';
      }
    }

    // INFANTRY: Capture adjacent enemy/neutral bases
    if (this.type === 'infantry') {
      this._tryCaptureBase(dt);
    }

    // Periodic auto-target scan — throttled by preset
    const isReturningCarrier = this.mesh.userData.launchedFrom && this.mesh.userData.returning;
    if (!isReturningCarrier) {
      const findTargetInterval = activePreset.findTargetInterval;
      this._findTargetTimer += dt;
      if (this._findTargetTimer >= findTargetInterval) {
    this._findTargetTimer = 0;
    this._provokeTimer = 0;
    this._fighterScanTimer = 0;
    this._pathLineTimer = 0;
        if (this.state !== 'dead') this.findTarget();
      }
      // Units that can fire while moving: run attack logic even in 'moving' or 'pursuing' state
      if ((this.state === 'moving' || this.state === 'pursuing') && this.canFireWhileMoving && this.target) {
        this.updateAttackWhileMoving(dt);
      }
    }

    // Amphibious auto-conversion: land unit in water Ã¢â€ â€™ boat, boat on land Ã¢â€ â€™ land
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

    // Fleet escorts: skip normal state machine, carrier controls movement
    if (this._fleetCarrier && this._fleetCarrier.alive) {
      // Fleet escorts auto-attack enemies in range but don't move independently
      if (!this.target || !this.target.alive) {
        this.findTarget();
      }
      if (this.target && this.target.alive) {
        const d = this._dist2d(this.target.mesh.position);
        if (d <= this.stats.range) {
          this.state = 'attacking';
        }
      }
      if (this.state === 'attacking' && this.target && this.target.alive) {
        this.updateAttack(dt);
      }
    } else {
    switch (this.state) {
      case 'moving':    this.updateMove(dt); break;
      case 'attacking': this.updateAttack(dt); break;
      case 'pursuing':  this.updatePursue(dt); break;
      case 'waitingForTransport': this.updateWaitingForTransport(dt); break;
    }
    }

    // Transport: sync carried units; skip combat
    if (this.isTransport) {
      this._updateTransport(dt);
      // Transport can't attack Ã¢â‚¬â€ clear any target
      this.target = null;
    }

    // Crusher & escort jet: provoke nearby enemies to attack when moving
    if ((this.type === 'crusher' || this.type === 'escortJet') && (this.state === 'moving' || this.state === 'pursuing')) {
      this._provokeTimer += dt;
      if (this._provokeTimer >= PROVOKE_INTERVAL) {
        this._provokeTimer = 0;
        this._provokeEnemies();
      }
    }

    // Update path arrow line for ships (and any moving unit)
    this._pathLineTimer += dt;
    if (this._pathLineTimer >= PATH_LINE_THROTTLE) {
      this._pathLineTimer = 0;
      this._updatePathLine();
    }

    // Terrain enforcement: push to valid terrain (skip amphibious boats)
    if (this.state !== 'dead' && !this._amphibious) {
      const pos = this.mesh.position;
      const terrain = this.game.terrain.getTerrainAt(pos.x, pos.z);
      if (this.domain === 'sea' && terrain !== TERRAIN.SEA) {
        this._pushToValidTerrain('sea');
      } else if (this.domain === 'land' && terrain !== TERRAIN.LAND && terrain !== TERRAIN.COAST) {
        this._pushToValidTerrain('land');
      }
    }

    // CARRIER FIGHTER: check return-after-move (must run AFTER state machine moves the fighter)
    if (this.type === 'fighter' && this.mesh.userData.returning && this.mesh.userData.launchedFrom) {
      const carrier = this.mesh.userData.launchedFrom;
      if (carrier && carrier.alive) {
        const dx = this.mesh.position.x - carrier.mesh.position.x;
        const dz = this.mesh.position.z - carrier.mesh.position.z;
        if (Math.hypot(dx, dz) < 15) {
          this.alive = false;
          this.state = 'dead';
          this.cleanup();
          this.game.selectedUnits = this.game.selectedUnits.filter(u => u.alive);
        }
      }
    }

    // Range ring follows unit
    if (this.selected && this._rangeRing) {
      this._rangeRing.position.set(this.mesh.position.x, 0.3, this.mesh.position.z);
    }
  }

  /** Provoke nearby enemies to attack this unit (crusher / escort jet). */
  _provokeEnemies() {
    const enemies = this.faction === 'player' ? this.game.enemyUnits : this.game.playerUnits;
    const provoke = e => {
      if (e.faction === this.faction || !e.alive || e.state === 'dead') return;
      if (e.target && e.target.alive && e.state === 'attacking') return;
      // Enemy must be able to target this unit's domain
      const isLand = e.domain === 'land';
      if (isLand && !e.stats.airOnly && this.domain === 'air') return;
      if (e.stats.airOnly && this.domain !== 'air') return;
      if (e.stats.seaOnly && this.domain !== 'sea') return;
      if (e.stats.groundOnly && this.domain === 'air') return;
      const d = this._dist2d(e.mesh.position);
      if (d <= e.engageRange) e.attack(this);
    };
    const grid = this.game.spatialGrid?.cells.size ? this.game.spatialGrid : null;
    if (grid) {
      grid.queryCircle(
        this.mesh.position.x, this.mesh.position.z,
        Math.max(250, this.engageRange), provoke
      );
    } else {
      for (const e of enemies) provoke(e);
    }
  }

  /** Recalculate auras from nearby friendly buffing units. */
  _recalcAuras() {
    this._dmgMult = 1;
    this._hpMult = 1;
    const allies = this.faction === 'player' ? this.game.playerUnits : this.game.enemyUnits;
    for (const u of allies) {
      if (!u.alive || u === this) continue;
      const d = this.mesh.position.distanceTo(u.mesh.position);
      const range = u.stats.buffRange || 30;
      if (d > range) continue;
      if (u.stats.buffDamage) this._dmgMult *= (1 + u.stats.buffDamage);
      if (u.stats.buffHp) this._hpMult *= (1 + u.stats.buffHp);
      if (u.stats.buffInfantryHp && this.type === 'infantry') this._hpMult *= (1 + u.stats.buffInfantryHp);
    }
    // Tactics Tier 1: Formation bonus Ã¢â‚¬â€ +10% dmg when 2+ allies within range 20
    const tacticsTier = this.game.upgrades?.tiers?.tactics ?? 0;
    if (tacticsTier >= 1) {
      let nearbyAllies = 0;
      for (const u of allies) {
        if (!u.alive || u === this) continue;
        const d = this.mesh.position.distanceTo(u.mesh.position);
        if (d <= 20) nearbyAllies++;
      }
      if (nearbyAllies >= 2) this._dmgMult *= 1.1;
    }

    const targetMax = this._baseMaxHp * this._hpMult;
    if (targetMax !== this.maxHp) {
      const ratio = this.hp / this.maxHp;
      this.maxHp = targetMax;
      this.hp = Math.min(this.maxHp, ratio * targetMax);
    }
  }

  /** Healer: heal nearby friendly air and land units 5% HP/sec, follow lowest HP */
  _healNearby(dt) {
    const allies = this.faction === 'player' ? this.game.playerUnits : this.game.enemyUnits;
    let lowestHp = null;
    let lowestRatio = 1;

    for (const u of allies) {
      if (!u.alive || u === this) continue;
      if (u.domain !== 'air' && u.domain !== 'land') continue;
      const ratio = u.hp / u.maxHp;

      // Heal if in range
      if (u.hp < u.maxHp) {
        const d = this.mesh.position.distanceTo(u.mesh.position);
        if (d <= this.stats.range) {
          const heal = u.maxHp * 0.05 * dt;
          u.hp = Math.min(u.maxHp, u.hp + heal);
          u._displayHp = u.hp;
        }
      }

      // Track lowest HP ally not at full health
      if (ratio < lowestRatio && u.hp < u.maxHp) {
        lowestRatio = ratio;
        lowestHp = u;
      }
    }

    // Follow behind tanks or between multiple tanks when idle
    if (this.state === 'idle') {
      const combat = allies.filter(u =>
        u.alive && u !== this && u.domain === 'land' && !u.isTransport && u.stats.speed > 0 &&
        u.state !== 'waitingForTransport' && !u.carried &&
        this.mesh.position.distanceTo(u.mesh.position) < 60
      );
      if (combat.length > 0) {
        // Follow the unit with least % HP remaining (12 units behind)
        const lowest = combat.reduce((a, b) => (a.hp / a.maxHp) < (b.hp / b.maxHp) ? a : b);
        const enemies = this.faction === 'player' ? this.game.enemyUnits : this.game.playerUnits;
        let closestEnemy = null, closestDist = Infinity;
        for (const e of enemies) {
          if (!e.alive) continue;
          const d = lowest.mesh.position.distanceTo(e.mesh.position);
          if (d < closestDist) { closestDist = d; closestEnemy = e; }
        }
        const followPos = lowest.mesh.position.clone();
        if (closestEnemy) {
          const behind = new THREE.Vector3().subVectors(followPos, closestEnemy.mesh.position).normalize();
          followPos.add(behind.multiplyScalar(12));
        }
        if (this.mesh.position.distanceTo(followPos) > 5) {
          this.moveTo(followPos);
        }
      } else if (lowestHp) {
        const d = this.mesh.position.distanceTo(lowestHp.mesh.position);
        if (d > this.stats.range * 0.7) {
          this.moveTo(lowestHp.mesh.position.clone());
        }
      }
    }
  }

  /** Hit confirm flash Ã¢â‚¬â€ red ring expanding on target */
  _spawnHitConfirm(pos) {
    const ring = acquireFromPool('hitConfirm', () => {
      const m = new THREE.Mesh(
        new THREE.RingGeometry(2, 4, 16),
        new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, transparent: true, opacity: 0.9, depthTest: false })
      );
      m.rotation.x = -Math.PI / 2;
      return m;
    }, 8);
    ring.position.set(pos.x, 1, pos.z);
    ring.scale.set(1, 1, 1);
    ring.material.opacity = 0.9;
    ring.userData = { life: 0.6, maxLife: 0.6 };
    this.game.scene.add(ring);
    this.game.scene.userData.hitConfirms = this.game.scene.userData.hitConfirms || [];
    this.game.scene.userData.hitConfirms.push(ring);
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

  /** Carrier: spawn a single fighter at a random position within carrier's range. */
  _spawnSingleFighter() {
    const angle = Math.random() * Math.PI * 2;
    const dist = 15 + Math.random() * (this.engageRange - 15);
    const pos = {
      x: this.mesh.position.x + Math.cos(angle) * dist,
      z: this.mesh.position.z + Math.sin(angle) * dist,
    };
    const f = this.game.spawn('fighter', this.faction, pos);
    f.mesh.position.y = UNIT_TYPES.fighter.altitude;
    f.mesh.userData.launchedFrom = this;
    f.mesh.userData.fighterState = 'deploying';
    f.selectable = false;
    Sound.play('launch');
  }

  _fighterAutoReturn(dt) {
    if (!this.mesh.userData.launchedFrom) return;
    const carrier = this.mesh.userData.launchedFrom;
    if (!carrier || !carrier.alive) return;

    const state = this.mesh.userData.fighterState;

    // Find nearest enemy of any type
    const enemies = this.faction === 'player' ? this.game.enemyUnits : this.game.playerUnits;
    let nearestEnemy = null;
    let nearestDist = Infinity;
    const considerEnemy = e => {
      if (e.faction === this.faction || !e.alive) return;
      const d = this.mesh.position.distanceTo(e.mesh.position);
      if (d < nearestDist) { nearestDist = d; nearestEnemy = e; }
    };
    const grid = this.game.spatialGrid?.cells.size ? this.game.spatialGrid : null;
    if (grid) {
      grid.forEach(considerEnemy);
    } else for (const e of enemies) {
      if (!e.alive) continue;
      const d = this.mesh.position.distanceTo(e.mesh.position);
      if (d < nearestDist) { nearestDist = d; nearestEnemy = e; }
    }

    // Deploying: fly toward nearest enemy on the map
    if (state === 'deploying') {
      if (nearestEnemy) {
        this.mesh.userData.returning = false;
        this.target = nearestEnemy;
        this._pursueTarget = nearestEnemy;
        this.state = 'pursuing';
      } else {
        this.state = 'idle';
      }
      return;
    }

    // Engaging: standard combat handles this via findTarget/pursue/attack
    // Just check if we should return (no more enemies)
    if (state === 'engaging') {
      if (!nearestEnemy) {
        this.mesh.userData.fighterState = 'returning';
        this.mesh.userData.returning = true;
        this.target = null;
        this._pursueTarget = null;
        this.moveTo(carrier.mesh.position.clone());
        return;
      }
      if (!this.target || !this.target.alive) {
        this.target = null;
        this._pursueTarget = null;
        this.mesh.userData.fighterState = 'returning';
        this.mesh.userData.returning = true;
        this.moveTo(carrier.mesh.position.clone());
      }
      return;
    }

    // Returning: fly back to carrier and disappear
    if (state === 'returning' || this.mesh.userData.returning) {
      this.mesh.userData.returning = true;
      this.state = 'moving';
      // Continuously track carrier's live position
      this.moveTarget = carrier.mesh.position.clone();
      this.path = [];
      return;
    }
  }

  // ----- Transport ship -----
  canLoadUnit(unit) {
    if (!this.isTransport || !this.alive) { _tlog(`[TRANS LOG] canLoadUnit false: ${!this.isTransport ? 'not a transport' : 'dead'}`); return false; }
    if (unit.faction !== this.faction) { _tlog(`[TRANS LOG] canLoadUnit false: ${unit._debugTag} faction mismatch`); return false; }
    if (!unit.alive) { _tlog(`[TRANS LOG] canLoadUnit false: ${unit._debugTag} dead`); return false; }
    if (unit.domain !== 'land') { _tlog(`[TRANS LOG] canLoadUnit false: ${unit._debugTag} domain ${unit.domain}`); return false; }
    if (this.carriedUnits.length >= this.transportCapacity) { _tlog(`[TRANS LOG] canLoadUnit false: ${unit._debugTag} capacity ${this.carriedUnits.length}/${this.transportCapacity}`); return false; }
    // Ships and troops have different Y levels; boarding is horizontal.
    const d = Math.hypot(
      this.mesh.position.x - unit.mesh.position.x,
      this.mesh.position.z - unit.mesh.position.z
    );
    if (d > BOARDING_RANGE) { _tlog(`[TRANS LOG] canLoadUnit false: ${unit._debugTag} distance ${d.toFixed(1)} > ${BOARDING_RANGE}`); return false; }
    return true;
  }

  loadUnit(unit) {
    if (!this.canLoadUnit(unit)) return false;
    this.carriedUnits.push(unit);
    unit.mesh.visible = false;
    unit.carried = true;
    unit.state = 'idle';
    return true;
  }

  canUnload() {
    if (!this.isTransport || !this.alive) return false;
    if (this.carriedUnits.length === 0) return false;
    // Ships remain in SEA and unload across an adjacent beach.
    const g = this.game.pathfinder.worldToGrid(this.mesh.position.x, this.mesh.position.z);
    const landing = this.game.pathfinder.findNearestWalkable(g.gx, g.gy, 'land');
    if (!landing) return false;
    const w = this.game.pathfinder.gridToWorld(landing.gx, landing.gy);
    return Math.hypot(w.x - this.mesh.position.x, w.z - this.mesh.position.z) <= 18;
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
  }

  _updateTransport(dt) {
    if (!this.alive) return;

    // Phase 1: Empty ship looking for unclaimed troops
    if (this.carriedUnits.length === 0 && !this._disembarkPoint && !this._assignedEmbarkPoint) {
      // Task 7: respect explicit player orders Ã¢â‚¬â€ don't hijack a ship mid-journey
      if (this._manualOrder && this.state === 'moving') { _tlog(`[TRANS LOG] Ship ${this._debugTag} skipping Ã¢â‚¬â€ manual order in progress`); return; }
      const allUnits = this.faction === 'player' ? this.game.playerUnits : this.game.enemyUnits;
      let bestDist = Infinity;
      let bestUnit = null;
      let foundCount = 0;
      for (const u of allUnits) {
        if (u.alive && u.state === 'waitingForTransport' && u._transportData && !u._claimedByShip) {
          foundCount++;
          const d = this.mesh.position.distanceTo(u.mesh.position);
          if (d < bestDist) {
            bestDist = d;
            bestUnit = u;
          }
        }
      }
      _tlog(`[TRANS LOG] Ship ${this._debugTag} phase1: found ${foundCount} unclaimed waiting troops pos=(${this.mesh.position.x.toFixed(0)},${this.mesh.position.z.toFixed(0)}) manualOrder=${this._manualOrder}`);
      if (bestUnit) {
        _tlog(`[TRANS LOG] Ship ${this._debugTag}: best troop=${bestUnit._debugTag} dist=${bestDist.toFixed(1)}`);
        const embarkTarget = bestUnit._transportData?.shipEmbarkPoint?.clone();
        if (!embarkTarget) {
          _twarn(`[TRANS LOG] Ship ${this._debugTag}: NO embark target on troop ${bestUnit._debugTag}`);
          return;
        }
        _tlog(`[TRANS LOG] Ship ${this._debugTag}: embarkTarget=(${embarkTarget.x.toFixed(0)},${embarkTarget.z.toFixed(0)})`);
        const rawSeaPath = this.game.pathfinder.findPath(this.mesh.position, embarkTarget, 'sea', false);
        if (rawSeaPath && rawSeaPath.length > 0) {
          this.path = rawSeaPath;
          this.moveTarget = this.path.shift();
          this.state = 'moving';
          _tlog(`[TRANS LOG] Ship ${this._debugTag}: pathing to embark (${rawSeaPath.length} waypoints)`);
        } else {
          _twarn(`[TRANS LOG] Ship ${this._debugTag}: FAILED path to embark Ã¢â‚¬â€ trying moveTo`);
          this.moveTo(embarkTarget);
        }
        this._assignedEmbarkPoint = embarkTarget;
        this._transportData = bestUnit._transportData;
        this._boardingTimer = 0;
        // Task 9: reset before re-claiming
        this._aiWaveId = null;
        // Claim units waiting at this embark point, up to this ship's capacity
        let claimed = 0;
        for (const u of allUnits) {
          if (claimed >= this.transportCapacity) break;
          if (u.alive && u.state === 'waitingForTransport' && u._transportData && !u._claimedByShip) {
            const embarkDist = u._transportData?.shipEmbarkPoint?.distanceTo(this._assignedEmbarkPoint) ?? Infinity;
            _tlog(`[TRANS LOG] Ship ${this._debugTag}: considering troop ${u._debugTag} embarkDist=${embarkDist.toFixed(1)} threshold=5`);
            if (embarkDist < 5) {
              u._claimedByShip = this;
              if (u._aiWaveId != null) this._aiWaveId = u._aiWaveId;
              claimed++;
              _tlog(`[TRANS LOG] Ship ${this._debugTag}: CLAIMED ${u._debugTag} (${claimed}/${this.transportCapacity})`);
            }
          }
        }
        _tlog(`[TRANS LOG] Ship ${this._debugTag}: total claimed=${claimed} heading to (${this._assignedEmbarkPoint.x.toFixed(0)},${this._assignedEmbarkPoint.z.toFixed(0)})`);
      } else {
        _tlog(`[TRANS LOG] Ship ${this._debugTag}: no waiting troops found Ã¢â‚¬â€ idle`);
        if (this.state === 'idle' && !this._manualOrder) this._retreatToFriendlyBase();
      }
      return;
    }

    // Phase 2: Arrived at embark point, waiting for troops to board
    if (this._assignedEmbarkPoint && this.path.length === 0) {
      this._boardingTimer += dt;

      const isFull = this.carriedUnits.length >= this.transportCapacity;

      const allUnits = this.faction === 'player' ? this.game.playerUnits : this.game.enemyUnits;

      // Re-scan: claim any unclaimed troops that arrived at the embark point
      // while we were waiting in Phase 2.
      if (!isFull) {
        for (const u of allUnits) {
          if (this.carriedUnits.length >= this.transportCapacity) break;
          if (u.alive && u.state === 'waitingForTransport' && u._transportData && !u._claimedByShip && !u.carried) {
            const embarkDist = u._transportData?.shipEmbarkPoint?.distanceTo(this._assignedEmbarkPoint) ?? Infinity;
            if (embarkDist < 5) {
              u._claimedByShip = this;
              _tlog(`[TRANS LOG] Ship ${this._debugTag}: late CLAIMED ${u._debugTag} in phase2 (${this.carriedUnits.length}/${this.transportCapacity})`);
            }
          }
        }
      }

      // Count claimed troops still waiting to board (not yet carried)
      let claimedWaiting = 0;
      let unclaimedNearby = 0;
      for (const u of allUnits) {
        if (u.alive && u._claimedByShip === this && !u.carried) claimedWaiting++;
        if (u.alive && u.state === 'waitingForTransport' && u._transportData && !u._claimedByShip && !u.carried) {
          const embarkDist = u._transportData?.shipEmbarkPoint?.distanceTo(this._assignedEmbarkPoint) ?? Infinity;
          if (embarkDist < 5) unclaimedNearby++;
        }
      }

      const noMoreWaiting = claimedWaiting === 0 && unclaimedNearby === 0;
      const allClaimedBoarded = noMoreWaiting && this.carriedUnits.length > 0;
      const safetyTimeout = this._boardingTimer > STRANDED_TIMEOUT;

      _tlog(`[TRANS LOG] Ship ${this._debugTag} phase2 WAITING: timer=${this._boardingTimer.toFixed(1)}s/${STRANDED_TIMEOUT}s carried=${this.carriedUnits.length}/${this.transportCapacity} claimedWaiting=${claimedWaiting} unclaimedNearby=${unclaimedNearby} isFull=${isFull}`);

      // Sail only when full or all claimed troops are aboard — no partial-fill departure.
      // A safety valve at STRANDED_TIMEOUT prevents infinite waiting if troops are stuck.
      if (isFull || allClaimedBoarded) {
        // Task 9: hold for sibling ships in the same AI wave
        if (this.game.shouldHoldForAIWave(this)) {
          _tlog(`[TRANS LOG] Ship ${this._debugTag}: AI WAVE HOLD — waiting for sibling ships`);
          return;
        }
        const reason = allClaimedBoarded ? 'ALL_BOARDED' : 'FULL';
        _tlog(`[TRANS LOG] Ship ${this._debugTag} SAILING: reason=${reason} carried=${this.carriedUnits.length}`);
        this._sailToDisembark(allUnits);
      } else if (safetyTimeout && this.carriedUnits.length > 0) {
        // Safety valve: stuck with partial load after STRANDED_TIMEOUT — sail anyway
        _tlog(`[TRANS LOG] Ship ${this._debugTag} SAFETY SAIL: stuck for ${STRANDED_TIMEOUT}s with ${this.carriedUnits.length} troops`);
        this._sailToDisembark(allUnits);
      } else if (safetyTimeout && this.carriedUnits.length === 0) {
        // Abandon: no troops boarded after timeout
        _tlog(`[TRANS LOG] Ship ${this._debugTag} ABANDON: no troops boarded in ${STRANDED_TIMEOUT}s — retreating`);
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
      _tlog(`[TRANS LOG] Ship ${this._debugTag} phase3: unload ${this.carriedUnits.length} troops at (${this._disembarkPoint.x.toFixed(0)},${this._disembarkPoint.z.toFixed(0)})`);
      // Find nearest land tile for landing zone
      const g = this.game.pathfinder.worldToGrid(this._disembarkPoint.x, this._disembarkPoint.z);
      const landing = this.game.pathfinder.findNearestWalkable(g.gx, g.gy, 'land');
      let landingPos;
      if (landing) {
        const w = this.game.pathfinder.gridToWorld(landing.gx, landing.gy);
        landingPos = new THREE.Vector3(w.x, 0, w.z);
      } else {
        landingPos = this._disembarkPoint.clone();
      }
      _tlog(`[TRANS LOG] Ship ${this._debugTag}: landingPos=(${landingPos.x.toFixed(0)},${landingPos.z.toFixed(0)})`);

      // Manually unload each unit
      const units = [...this.carriedUnits];
      this.carriedUnits = [];
      for (let i = 0; i < units.length; i++) {
        const u = units[i];
        if (!u.alive) continue;
        u.carried = false;
        u.mesh.visible = true;
        // Fan units around landing zone
        const angle = (i / units.length) * Math.PI * 2;
        const dist = 4 + Math.floor(i / 4) * 4;
        u.mesh.position.set(
          landingPos.x + Math.cos(angle) * dist,
          LAND_HEIGHT + 0.5,
          landingPos.z + Math.sin(angle) * dist
        );
        _tlog(`[TRANS LOG] Ship ${this._debugTag}: unloaded ${u._debugTag} at (${u.mesh.position.x.toFixed(0)},${u.mesh.position.z.toFixed(0)})`);
        // Give units their walk-to-target path
        if (u._transportData && u._transportData.segments && u._transportData.segments.walkToTarget) {
          u.path = u._transportData.segments.walkToTarget;
          if (u.path.length > 0) {
            u.moveTarget = u.path.shift();
            u.state = 'moving';
          } else {
            u.state = 'idle';
          }
        } else {
          u.state = 'idle';
        }
        u._transportData = null;
      }
      this._disembarkPoint = null;
      this._transportData = null;
      this._assignedEmbarkPoint = null;
      this._retreatToFriendlyBase();
      return;
    }

    // Sync carried unit meshes
    for (const u of this.carriedUnits) {
      u.mesh.position.copy(this.mesh.position);
      u.mesh.position.y += 0.5;
    }
  }

  /** Shared sailing logic for Phase 2 departure. */
  _sailToDisembark(allUnits) {
    // Save disembark data before any moveTo() might clear _transportData
    const disembarkPt = this._transportData?.disembarkPoint?.clone();
    // Use the pre-calculated sea path directly (no recalc, no smoothing)
    const sailPath = this._transportData?.segments?.sail;
    if (sailPath && sailPath.length > 0) {
      this.path = sailPath.map(p => p.clone());
      this.moveTarget = this.path.shift();
      this.state = 'moving';
    } else if (this._transportData?.shipDisembarkPoint) {
      _tlog(`[TRANS LOG] Ship ${this._debugTag}: no sail path — using moveTo to shipDisembarkPoint`);
      this.moveTo(this._transportData.shipDisembarkPoint.clone());
    } else {
      _tlog(`[TRANS LOG] Ship ${this._debugTag}: no sail path and no shipDisembarkPoint — stuck`);
    }
    this._disembarkPoint = disembarkPt;
    this._assignedEmbarkPoint = null;

    // Unclaim any troops that didn't make it
    for (const u of allUnits) {
      if (u._claimedByShip === this) u._claimedByShip = null;
    }
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
    this._pushCooldown = 0.5;
    // Teleport directly to nearest walkable cell
    const gx = Math.floor((this.mesh.position.x + MAP_SIZE/2) / 12);
    const gy = Math.floor((this.mesh.position.z + MAP_SIZE/2) / 12);
    const nearest = this.game.pathfinder.findNearestWalkable(gx, gy, domain);
    if (nearest) {
      const world = this.game.pathfinder.gridToWorld(nearest.gx, nearest.gy);
      // Set correct Y position for domain
      const y = domain === 'sea' ? 0.3 : (LAND_HEIGHT + 0.5);
      this.mesh.position.set(world.x, y, world.z);
      // Don't change rotation Ã¢â‚¬â€ keep current facing direction
      // Re-path after push with delay to avoid spam
      if (this.attackMoveDest && this.state !== 'idle') {
        setTimeout(() => {
          if (this.alive) this.moveTo(this.attackMoveDest, this.attackMove);
        }, 100);
      }
    }
  }

  _buildRangeRing() {
    if (this._rangeRing) return;
    this._rangeRing = buildRangeRing(this.stats.range, this.faction);
  }

  _updateHpBar(dt) {
    if (!this._hpBar) return;
    // Trail slowly catches up to current HP — skipped on low presets
    if (activePreset.hpBarTrail) {
      this._trailHp += (this._displayHp - this._trailHp) * Math.min(1, dt * 2);
    } else {
      this._trailHp = this._displayHp;
    }
    // Hide if full HP and not selected
    const visible = this._displayHp < this.maxHp || this.selected;
    updateHpBar(this._hpBar, this._displayHp, this._trailHp, this.maxHp, visible);
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

    // Stuck detection: if barely moved in 2 seconds, re-path
    if (this._stuckPosition) {
      const distFromStuck = pos.distanceTo(this._stuckPosition);
      if (distFromStuck < 1) {
        this._stuckTimer += dt;
        if (this._stuckTimer > 2 && this.attackMoveDest) {
          this.moveTo(this.attackMoveDest, this.attackMove);
          this._stuckTimer = 0;
          this._stuckPosition = null;
          return;
        }
      } else {
        this._stuckTimer = 0;
        this._stuckPosition = pos.clone();
      }
    } else {
      this._stuckPosition = pos.clone();
      this._stuckTimer = 0;
    }

    // Hard clamp: if on invalid terrain, snap to nearest walkable and stop
    if (this.domain !== 'air') {
      const curTerrain = this.game.terrain.getTerrainAt(pos.x, pos.z);
      if (!this.canEnter(curTerrain)) {
        this._pushToValidTerrain(this.domain);
        return;
      }
    }

    const dx = this.moveTarget.x - pos.x;
    const dz = this.moveTarget.z - pos.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 2) {
      this.moveTarget = this.path.length > 0 ? this.path.shift() : null;
      if (!this.moveTarget) {
        // Check if we finished walking to embark point Ã¢â‚¬â€ need transport (land units only, not ships)
        if (!this.isTransport && this._transportData && this._transportData.needsTransport && this._transportData.segments) {
          this.state = 'waitingForTransport';
          this._waitingTimer = 0;
          this._transportData._phase = 'waiting';
          return;
        }
        this.state = 'idle';
      }
      return;
    }
    const step = this.stats.speed * dt;
    const moveRatio = Math.min(1, step / dist);

    // Smooth movement blending to prevent zigzag
    const smoothFactor = 0.85;
    const nextX = pos.x + (dx / dist) * step * smoothFactor + (this._lastDx || 0) * (1 - smoothFactor) * 0.3;
    const nextZ = pos.z + (dz / dist) * step * smoothFactor + (this._lastDz || 0) * 0.3;
    // Do not cross a shore for even one frame before the terrain safeguard
    // corrects it; that was the visible water/beach clipping regression.
    if (this.domain !== 'air' && !this.canEnter(this.game.terrain.getTerrainAt(nextX, nextZ))) {
      this._pushToValidTerrain(this.domain);
      return;
    }
    pos.x = nextX;
    pos.z = nextZ;
    this._lastDx = dx / dist;
    this._lastDz = dz / dist;

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
    if (this.domain === 'sea')  return terrain === TERRAIN.SEA;
    if (this.domain === 'land') return terrain === TERRAIN.LAND || terrain === TERRAIN.COAST;
    return true;
  }

  findTarget() {
    // Escort bomber: never auto-targets
    if (this.stats.escortBomber) return;

    // Don't override a valid active attack
    if (this.target && this.target.alive && this.state === 'attacking') return;

    // Don't override a manually-issued attack command
    if (this._manualTarget && this.target && this.target.alive) return;

    const airOnly = !!this.stats.airOnly;
    const baseOnly = !!this.stats.baseOnly;
    const baseTarget = !!this.stats.baseTarget;
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

    // Base-target units (crusher): only target bases, keeps pushing
    if (baseTarget) {
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
        } else {
          this._pursueTarget = bestBase;
          this.state = 'pursuing';
        }
      }
      return;
    }

    const isCarrierFighter = !!this.mesh.userData.launchedFrom;
    let best = null, bestD = isCarrierFighter ? Infinity : this.engageRange;
    let bestPriority = 99;

    const considerEnemy = e => {
      if (e.faction === this.faction || !e.alive) return;

      // Specialized targeting rules
      if (airOnly && e.domain !== 'air') return;
      if (this.stats.seaOnly && e.domain !== 'sea') return;
      if (this.stats.groundOnly && e.domain === 'air') return;

      // Land units cannot target air (except missile defense handled above)
      if (isLand && !airOnly && e.domain === 'air') return;

      const d = this._dist2d(e.mesh.position);

      // Targeting priority for land units: ground(1) > base(2) > ship(3)
      let priority = 1;
      if (isLand && !airOnly) {
        if (e.domain === 'sea') {
          // Ships only targetable if very close (30% of attack range)
          if (d > this.stats.range * 0.3) return;
          priority = 3;
        } else {
          priority = 1; // ground enemy
        }
      }

      if (d <= this.engageRange && (priority < bestPriority || (priority === bestPriority && d < bestD))) {
        best = e; bestD = d; bestPriority = priority;
      }
    };

    const grid = this.game.spatialGrid?.cells.size ? this.game.spatialGrid : null;
    if (grid) {
      const p = this.mesh.position;
      if (isCarrierFighter) grid.forEach(considerEnemy);
      else grid.queryCircle(p.x, p.z, this.engageRange, considerEnemy);
    } else {
      const enemies = this.faction === 'player' ? this.game.enemyUnits : this.game.playerUnits;
      for (const e of enemies) considerEnemy(e);
    }

    // Tactics Tier 2: Focus fire Ã¢â‚¬â€ prefer enemies that allies are already attacking
    const tacticsTier = this.game.upgrades?.tiers?.tactics ?? 0;
    if (tacticsTier >= 2 && !airOnly && !baseOnly && !baseTarget) {
      const allies = this.faction === 'player' ? this.game.playerUnits : this.game.enemyUnits;
      const focusCounts = new Map();
      for (const u of allies) {
        if (!u.alive || u === this) continue;
        if (u.target && u.target.alive && u.target.faction !== this.faction) {
          focusCounts.set(u.target, (focusCounts.get(u.target) || 0) + 1);
        }
      }
      let focusBest = null, focusCount = 0;
      for (const [enemy, count] of focusCounts) {
        if (count < focusCount) continue;
        if (airOnly && enemy.domain !== 'air') continue;
        const d = this._dist2d(enemy.mesh.position);
        if (d <= this.engageRange && count >= 2) {
          focusBest = enemy;
          focusCount = count;
        }
      }
      if (focusBest && focusCount >= 2) {
        best = focusBest;
        bestD = this._dist2d(focusBest.mesh.position);
      }
    }

    // Target enemy bases (priority 2)
    // Strict priority: units (1) always beat bases (2). A base only wins over
    // another base if it is closer. A base only wins over a sea target (3)
    // because 2 < 3.
    if (this.stats.range > 0) {
      const bases = this.game.bases.filter(b => b.alive && b.faction !== this.faction);
      const basePriority = 2;
      for (const b of bases) {
        const d = this._dist2d(b.mesh.position);
        if (!best || basePriority < bestPriority || (basePriority === bestPriority && d < bestD)) {
          best = b; bestD = d; bestPriority = basePriority;
        }
      }
    }

    if (best) {
      const dist = bestD;
      if (dist <= this.stats.range) {
        // Save movement state so we can resume after attacking
        if (this.state === 'moving' && this.moveTarget) {
          this._resumePath = this.path.slice();
          this._resumeTarget = this.moveTarget.clone();
          this._resumeAttackMove = this.attackMove;
          this._resumeAttackMoveDest = this.attackMoveDest ? this.attackMoveDest.clone() : null;
        }
        // Within attack range Ã¢â‚¬â€ attack directly
        this.target = best;
        this.state = 'attacking';
      } else if (isCarrierFighter || (dist <= this.engageRange && this.stats.speed > 0)) {
        // Within engage range (or carrier fighter: unlimited range) Ã¢â‚¬â€ pursue
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
      this._manualTarget = false;
      // Carrier fighter: return to carrier when target dies
      if (this.mesh.userData.launchedFrom) {
        this.mesh.userData.fighterState = 'returning';
        this.mesh.userData.returning = true;
        this._pursueTarget = null;
        this.moveTo(this.mesh.userData.launchedFrom.mesh.position.clone());
        return;
      }
      // Resume original movement if we had one
      if (this._resumePath || this._resumeTarget) {
        this.path = this._resumePath || [];
        this.moveTarget = this._resumeTarget || null;
        this.attackMove = this._resumeAttackMove || false;
        this.attackMoveDest = this._resumeAttackMoveDest || null;
        this._resumePath = null;
        this._resumeTarget = null;
        this._resumeAttackMove = null;
        this._resumeAttackMoveDest = null;
        if (this.moveTarget) {
          this.state = 'moving';
        } else if (this.attackMove && this.attackMoveDest) {
          this.moveTo(this.attackMoveDest, true);
        } else {
          this.state = 'idle';
        }
      } else if (this.attackMove && this.attackMoveDest) {
        this.moveTo(this.attackMoveDest, true);
      } else {
        this.state = 'idle';
      }
      return;
    }
    // Base captured (faction changed) Ã¢â‚¬â€ release target
    if (this.target.faction && this.target.faction === this.faction) {
      this.target = null;
      this._manualTarget = false;
      // Resume original movement
      if (this._resumePath || this._resumeTarget) {
        this.path = this._resumePath || [];
        this.moveTarget = this._resumeTarget || null;
        this.attackMove = this._resumeAttackMove || false;
        this.attackMoveDest = this._resumeAttackMoveDest || null;
        this._resumePath = null;
        this._resumeTarget = null;
        this._resumeAttackMove = null;
        this._resumeAttackMoveDest = null;
        if (this.moveTarget) {
          this.state = 'moving';
        } else if (this.attackMove && this.attackMoveDest) {
          this.moveTo(this.attackMoveDest, true);
        } else {
          this.state = 'idle';
        }
      } else if (this.attackMove && this.attackMoveDest) {
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
          // No reachable coast Ã¢â‚¬â€ just try to approach
          const snap = this._snapToNearestSea(targetPos);
          if (snap) this.moveTo(snap, this.attackMove);
        }
      } else {
        this.moveTo(targetPos, this.attackMove);
      }
      return;
    }
    // In range Ã¢â‚¬â€ stop moving and attack
    this.path = [];
    this.moveTarget = null;
    this.state = 'attacking';
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
    // Base captured (faction changed) Ã¢â‚¬â€ release target
    if (this.target.faction && this.target.faction === this.faction) { this.target = null; return; }
    const targetPos = this.target.mesh ? this.target.mesh.position : this.target.position;
    const dist = this._dist2d(targetPos);
    if (dist > this.stats.range) {
      // Ships firing while moving used to recompute a coast target and run A*
      // every frame. Keep the existing route for a short interval and only
      // refresh it when the target has moved to another grid cell.
      this._attackMovePathTimer += dt;
      if (this._attackMovePathTimer < 0.5 && this._attackMovePathKey) return;
      if (this.domain === 'sea' && this.target.domain === 'land') {
        const coastPos = this._findCoastInRange(targetPos);
        if (coastPos) this.moveTo(coastPos, this.attackMove);
        const coastGrid = this.game.pathfinder.worldToGrid(coastPos?.x ?? targetPos.x, coastPos?.z ?? targetPos.z);
        this._attackMovePathKey = `${coastGrid.gx}:${coastGrid.gy}`;
      }
      this._attackMovePathTimer = 0;
      return;
    }
    this._attackMovePathKey = null;
    this._attackMovePathTimer = 1;
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
      // Carrier fighter: return to carrier when target dies
      if (this.mesh.userData.launchedFrom) {
        this.mesh.userData.fighterState = 'returning';
        this.mesh.userData.returning = true;
        this.moveTo(this.mesh.userData.launchedFrom.mesh.position.clone());
        return;
      }
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

    // Disengage if target moved beyond engage range (carrier fighters never disengage)
    if (!this.mesh.userData.launchedFrom && dist > this.engageRange * 1.5) {
      this._pursueTarget = null;
      this.target = null;
      if (this.mesh.userData.launchedFrom) {
        // Carrier fighter: return to carrier
        this.mesh.userData.returning = true;
        this.mesh.userData.fighterState = 'returning';
        this.moveTo(this.mesh.userData.launchedFrom.mesh.position.clone());
      } else {
        this.state = 'idle';
      }
      return;
    }

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

    // Move toward target Ã¢â‚¬â€ use pathfinding for ground units, straight line for air
    const dx = targetPos.x - this.mesh.position.x;
    const dz = targetPos.z - this.mesh.position.z;
    const targetAngle = Math.atan2(dx, dz);

    if (this.domain === 'air') {
      const step = this.stats.speed * dt;
      if (dist > step) {
        this.mesh.position.x += (dx / dist) * step;
        this.mesh.position.z += (dz / dist) * step;
      }
    } else {
      // Ground/sea: use pathfinding to avoid obstacles, but only re-path periodically
      this._pursuePathTimer = (this._pursuePathTimer || 0) + dt;
      if (!this._pursuePath || this._pursuePath.length === 0 || this._pursuePathTimer > 1.0) {
        this._pursuePathTimer = 0;
        this._pursuePath = this.game.pathfinder.findPath(this.mesh.position, targetPos, this.domain) || [];
      }
      if (this._pursuePath && this._pursuePath.length > 0) {
        const wp = this._pursuePath[0];
        const wpDist = Math.hypot(wp.x - this.mesh.position.x, wp.z - this.mesh.position.z);
        if (wpDist < 2) {
          this._pursuePath.shift();
        } else {
          const step = this.stats.speed * dt;
          this.mesh.position.x += ((wp.x - this.mesh.position.x) / wpDist) * step;
          this.mesh.position.z += ((wp.z - this.mesh.position.z) / wpDist) * step;
        }
      } else {
        // Fallback: direct movement
        const step = this.stats.speed * dt;
        if (dist > step) {
          this.mesh.position.x += (dx / dist) * step;
          this.mesh.position.z += (dz / dist) * step;
        }
      }
    }
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
      this._waitingTransport = null;
      this.state = 'idle';
      return;
    }

    // Stranded-troop safety: if waiting too long with no transport, give up.
    this._waitingTimer += dt;
    if (this._waitingTimer > STRANDED_TIMEOUT) {
      _tlog(`[TRANS LOG] Troop ${this._debugTag}: stranded for ${STRANDED_TIMEOUT}s — reverting to idle`);
      this._transportData = null;
      this._claimedByShip = null;
      this._waitingTransport = null;
      this._waitingTimer = 0;
      this.state = 'idle';
      return;
    }

    // First priority: the transport that claimed us
    let targetTransport = this._claimedByShip;

    // Fallback: any nearby friendly transport with space
    if (!targetTransport || !targetTransport.alive || targetTransport.carriedUnits.length >= targetTransport.transportCapacity) {
      targetTransport = this._waitingTransport;
    }
    if (!targetTransport || !targetTransport.alive || targetTransport.carriedUnits.length >= targetTransport.transportCapacity) {
      this._transportSearchTimer += dt;
    }
    if (!targetTransport || !targetTransport.alive || targetTransport.carriedUnits.length >= targetTransport.transportCapacity) {
      if (this._transportSearchTimer < 0.25 && this._waitingTransport) return;
      this._transportSearchTimer = 0;
      // The cached transport is known to be invalid here; restart the search
      // with no candidate so the first eligible transport can be selected.
      targetTransport = null;
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
      this._waitingTransport = targetTransport;
    }

    if (targetTransport) {
      const dx = this.mesh.position.x - targetTransport.mesh.position.x;
      const dz = this.mesh.position.z - targetTransport.mesh.position.z;
      const d2d = Math.hypot(dx, dz);
      
      _tlog(`[TRANS LOG] Troop ${this._debugTag} waiting: claimedBy=${this._claimedByShip?._debugTag || 'null'} target=${targetTransport._debugTag} d2d=${d2d.toFixed(1)}/${BOARDING_RANGE} pos=(${this.mesh.position.x.toFixed(0)},${this.mesh.position.z.toFixed(0)}) shipPos=(${targetTransport.mesh.position.x.toFixed(0)},${targetTransport.mesh.position.z.toFixed(0)})`);

      if (d2d <= BOARDING_RANGE) {
        _tlog(`[TRANS LOG] Troop ${this._debugTag}: IN RANGE Ã¢â‚¬â€ attempting loadUnit`);
        targetTransport.loadUnit(this);
        if (!targetTransport._transportData) {
          targetTransport._transportData = this._transportData;
        }
        this._claimedByShip = null;
        this._waitingTransport = null;
        _tlog(`[TRANS LOG] Troop ${this._debugTag}: boarded transport ${targetTransport._debugTag} (${targetTransport.carriedUnits.length}/${targetTransport.transportCapacity})`);
        return;
      } else {
        // Only move if not already near the embark point
        const embarkPos = this._transportData?.embarkPoint || this._transportData?.shipEmbarkPoint;
        if (embarkPos) {
          const distToEmbark = this._dist2d(embarkPos);
          if (distToEmbark > 2 && this.state !== 'moving' && !this.moveTarget && this.path.length === 0) {
            _tlog(`[TRANS LOG] Troop ${this._debugTag}: too far from ship, moving toward embark (distToEmbark=${distToEmbark.toFixed(1)})`);
            const saved = this._transportData;
            this.moveTo(embarkPos.clone());
            this._transportData = saved;
          } else {
            _tlog(`[TRANS LOG] Troop ${this._debugTag}: near embark point but far from ship (d2d=${d2d.toFixed(1)}) Ã¢â‚¬â€ waiting for ship to arrive`);
          }
        } else {
          _tlog(`[TRANS LOG] Troop ${this._debugTag}: no embarkPos Ã¢â‚¬â€ stuck waiting`);
        }
        return;
      }
    }

    _tlog(`[TRANS LOG] Troop ${this._debugTag}: NO TRANSPORT FOUND Ã¢â‚¬â€ stuck waiting`);

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
    let finalDmg = dmg;

    // Apply damage aura multiplier
    finalDmg *= this._dmgMult;

    // Tactics Tier 3: Combined arms Ã¢â‚¬â€ +25% damage vs different-domain targets
    if ((this.game.upgrades?.tiers?.tactics ?? 0) >= 3) {
      const targetDomain = this.target.domain || UNIT_TYPES[this.target.type]?.domain;
      if (targetDomain && this.domain !== targetDomain) finalDmg *= 1.25;
    }

    // Stealth break on first attack + 5x first strike damage
    if (this._stealthed) {
      this._stealthed = false;
      finalDmg *= 5;
      // Restore full visibility
      this.mesh.traverse(c => {
        if (c.material && c.material.opacity < 1) {
          c.material.opacity = c.userData.origOpacity || 1;
        }
      });
      // Hit confirm flash on target
      if (this.target.mesh) {
        this._spawnHitConfirm(this.target.mesh.position);
      }
    }

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

      // Crusher: knockback enemies near the impact point
      if (this.type === 'crusher') {
        const impact = targetPos;
        const enemies = this.faction === 'player' ? this.game.enemyUnits : this.game.playerUnits;
        for (const e of enemies) {
          if (!e.alive || e === this) continue;
          const d = e.mesh.position.distanceTo(impact);
          if (d > 100) continue;
          const dir = new THREE.Vector3().subVectors(e.mesh.position, impact).normalize();
          const force = (1 - d / 100) * 20;
          e.mesh.position.x += dir.x * force;
          e.mesh.position.z += dir.z * force;
        }
      }
    }
  }

  /** Destroyer unique: Flak cloud vs enemy air units in radius */
  _fireFlak(muzzlePos) {
    const flakRadius = 25;
    const enemies = this.faction === 'player' ? this.game.enemyUnits : this.game.playerUnits;
    for (const unit of enemies) {
      if (!unit.alive || unit.domain !== 'air') continue;
      const d = unit.mesh.position.distanceTo(this.mesh.position);
      if (d <= flakRadius) {
        const flakDmg = this.stats.damage * 0.6; // 60% damage
        unit.takeDamage(flakDmg);
        // Visual flak puff
        this._spawnFlakPuff(unit.mesh.position);
      }
    }
  }

  _spawnFlakPuff(pos) {
    const puff = acquireFromPool('flakPuff', () => new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.6 })
    ), 16);
    puff.position.copy(pos);
    puff.scale.set(1, 1, 1);
    puff.material.opacity = 0.6;
    puff.userData.life = 0.5;
    this.game.scene.add(puff);
    this.game.scene.userData.flakPuffs = this.game.scene.userData.flakPuffs || [];
    this.game.scene.userData.flakPuffs.push(puff);
  }

  /** Carrier special ability Ã¢â‚¬â€ start deploying fighters gradually. */
  launchFighters() {
    if (!this.canLaunch) return false;
    // If already fully deployed and all fighters returned, reset for new cycle
    if (this._allDeployed) {
      const allUnits = this.faction === 'player' ? this.game.playerUnits : this.game.enemyUnits;
      let aliveFighters = 0;
      for (const u of allUnits) {
        if (u.alive && u.type === 'fighter' && u.mesh.userData.launchedFrom === this) aliveFighters++;
      }
      if (aliveFighters > 0) {
        return false;
      }
      this._allDeployed = false;
      this._deployedFighters = 0;
    }
    // Start the gradual spawn cycle
    this.launchCooldown = 0;
    this._fighterSpawnTimer = CARRIER_FIGHTER_INTERVAL; // spawn first one immediately
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
    if (this._rangeRing) this.game.scene.remove(this._rangeRing);
    // Dispose per-instance visuals (ring/fill materials, cloned mats, range ring).
    // Shared geometries/materials and the cached unitFactory mesh are left intact.
    disposeUnitVisuals(this);
    if (this._deathLabel) {
      this._deathLabel.remove();
      this._deathLabel = null;
    }
  }
}
