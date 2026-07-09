// ai.js — Enemy AI controller with Easy / Normal / Hard behavior.
import * as THREE from 'three';
import { UNIT_TYPES, DIFFICULTY, TERRAIN, AI_STAGING_TIME, AI_MIN_ATTACK_SIZE, AI_MAX_STAGING_UNITS } from './config.js?v=5';
import { LAND_HEIGHT } from './terrain.js?v=3';

export function initAI(game) {
  const cfg = DIFFICULTY[game.difficulty];

  let economyTimer = 0;
  let aiMoney      = 200;

  const SPAWN_RATES = { easy: 2, normal: 3, hard: 6 };
  const maxSpawnsPerSecond = SPAWN_RATES[game.difficulty] || 1;

  const recentSpawns = [];
  const SPAWN_HISTORY_SECONDS = 2;

  function recordSpawn(pos) {
    recentSpawns.push({ pos, time: economyTimer });
    const cutoff = economyTimer - SPAWN_HISTORY_SECONDS;
    for (let i = recentSpawns.length - 1; i >= 0; i--) {
      if (recentSpawns[i].time < cutoff) recentSpawns.splice(i, 1);
    }
  }

  function isSpawnOverlapping(pos, minDist = 15) {
    for (const s of recentSpawns) {
      if (pos.distanceTo(s.pos) < minDist) return true;
    }
    return false;
  }

  function findNonOverlappingSpawn(base, domain) {
    const validTerrains = domain === 'sea' ? [TERRAIN.SEA] : [TERRAIN.LAND, TERRAIN.COAST];
    for (let radius = 15; radius <= 400; radius += 8) {
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2 + Math.random() * 0.2;
        const x = base.mesh.position.x + Math.cos(angle) * radius;
        const z = base.mesh.position.z + Math.sin(angle) * radius;
        const t = game.terrain.getTerrainAt(x, z);
        if (!validTerrains.includes(t)) continue;
        let blocked = false;
        for (const mt of game.terrain.mountains) {
          if (Math.hypot(x - mt.x, z - mt.z) < mt.r + 3) { blocked = true; break; }
        }
        if (blocked) continue;
        const pos = new THREE.Vector3(x, domain === 'sea' ? 0.3 : LAND_HEIGHT + 0.5, z);
        if (!isSpawnOverlapping(pos)) return pos;
      }
    }
    // Last resort: accept any valid terrain, ignore overlap
    for (let radius = 15; radius <= 400; radius += 8) {
      for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2 + Math.random() * 0.2;
        const x = base.mesh.position.x + Math.cos(angle) * radius;
        const z = base.mesh.position.z + Math.sin(angle) * radius;
        const t = game.terrain.getTerrainAt(x, z);
        if (!validTerrains.includes(t)) continue;
        let blocked = false;
        for (const mt of game.terrain.mountains) {
          if (Math.hypot(x - mt.x, z - mt.z) < mt.r + 3) { blocked = true; break; }
        }
        if (blocked) continue;
        return new THREE.Vector3(x, domain === 'sea' ? 0.3 : LAND_HEIGHT + 0.5, z);
      }
    }
    return null;
  }

  /** Pick the unit composition based on difficulty. */
  function chooseUnitToBuild() {
    if (game.difficulty === 'easy') {
      return ['infantry', 'infantry', 'tank'][Math.floor(Math.random() * 3)];
    }
    if (game.difficulty === 'normal') {
      return ['infantry', 'tank', 'tank', 'artillery', 'fighter', 'fighter', 'minigunner', 'missileDefense', 'missileDefense', 'destroyer', 'frigate', 'battleship'][Math.floor(Math.random() * 12)];
    }
    return ['tank', 'tank', 'heavyTank', 'artillery', 'mlrs', 'minigunnerVehicle', 'megaMedic', 'fighter', 'fighter', 'bomber', 'heli', 'gunship', 'destroyer', 'frigate', 'cruiser', 'submarine', 'battleship', 'carrier', 'missileDefense', 'missileDefense', 'missileDefense', 'missileDefense', 'coastal'][Math.floor(Math.random() * 23)];
  }

  /** Pick a random enemy-owned base to spawn from, weighted by proximity to player bases (front line). */
  function pickSpawnBase(targetBase = null) {
    const owned = game.bases.filter(b => b.faction === 'enemy');
    if (owned.length === 0) return null;

    // If we have a specific target, prefer bases closest to it
    if (targetBase) {
      return owned.reduce((closest, b) =>
        b.mesh.position.distanceTo(targetBase.mesh.position) <
        closest.mesh.position.distanceTo(targetBase.mesh.position) ? b : closest
      );
    }

    // Otherwise weight by proximity to any player base
    const playerBases = game.bases.filter(b => b.faction === 'player');
    if (playerBases.length === 0) return owned[Math.floor(Math.random() * owned.length)];

    let bestBase = owned[0];
    let bestScore = -1;

    for (const b of owned) {
      // Score = inverse of average distance to player bases (closer = higher score)
      let totalDist = 0;
      for (const pb of playerBases) {
        totalDist += b.mesh.position.distanceTo(pb.mesh.position);
      }
      const avgDist = totalDist / playerBases.length;
      const score = 1 / (avgDist + 1); // +1 to avoid division by zero

      if (score > bestScore) {
        bestScore = score;
        bestBase = b;
      }
    }

    // Add some randomness: 70% chance to pick best, 30% random
    if (Math.random() < 0.7) return bestBase;
    return owned[Math.floor(Math.random() * owned.length)];
  }

  /** Spawn near an enemy base, with terrain-aware placement and non-overlapping spawn points. */
  function spawnEnemyUnit(type, targetBase = null) {
    const base = pickSpawnBase(targetBase);
    if (!base) return false;
    const stats = UNIT_TYPES[type];
    const pos = findNonOverlappingSpawn(base, stats.domain);
    if (!pos) {
      console.warn(`[DEBUG AI] Failed to find non-overlapping spawn for ${type} near ${base.name}`);
      return false;
    }
    recordSpawn(pos);
    const u = game.spawn(type, 'enemy', pos);
    if (cfg.hpMultiplier > 1) {
      u.maxHp = Math.round(u.maxHp * cfg.hpMultiplier);
      u.hp = u.maxHp;
      u._displayHp = u.hp;
    }
    console.log(`[DEBUG AI] Spawned ${type} near ${base.name} at (${pos.x.toFixed(0)}, ${pos.z.toFixed(0)})`);

    // Carrier escort: spawn 2 destroyers alongside if affordable
    if (type === 'carrier') {
      for (let i = 0; i < 2; i++) {
        if (aiMoney >= UNIT_TYPES.destroyer.cost) {
          const escPos = findNonOverlappingSpawn(base, 'sea');
          if (escPos) {
            recordSpawn(escPos);
            const esc = game.spawn('destroyer', 'enemy', escPos);
            if (cfg.hpMultiplier > 1) {
              esc.maxHp = Math.round(esc.maxHp * cfg.hpMultiplier);
              esc.hp = esc.maxHp;
              esc._displayHp = esc.hp;
            }
            aiMoney -= UNIT_TYPES.destroyer.cost;
            console.log(`[DEBUG AI] Spawned destroyer escort near ${base.name}`);
          }
        }
      }
    }

    return true;
  }

  /** Find the best attack target on the player side. */
  function pickPlayerTarget() {
    const playerBases = game.bases.filter(b => b.faction === 'player');
    if (playerBases.length === 0) return null;

    if (game.difficulty === 'hard') {
      // Target the WEAKEST player base (lowest HP)
      return playerBases.reduce((a, b) => (a.hp < b.hp ? a : b));
    }
    // Easy/Normal — weighted random: lower HP = higher chance
    // This ensures wounded bases get finished off
    const totalHp = playerBases.reduce((s, b) => s + b.hp, 0);
    const weights = playerBases.map(b => Math.max(1, totalHp - b.hp + 1));
    const totalWeight = weights.reduce((s, w) => s + w, 0);
    let r = Math.random() * totalWeight;
    for (let i = 0; i < playerBases.length; i++) {
      r -= weights[i];
      if (r <= 0) return playerBases[i];
    }
    return playerBases[0];
  }

  let lastKnownEnemyCount = 0;
  let buildUpWarningShown = false;

  /** Gather available attacking units (exclude ships, transports, and units waiting for/riding transports). */
  function gatherAttackers() {
    return game.enemyUnits.filter(u =>
      u.alive &&
      u.domain !== 'sea' &&
      !u.isTransport &&
      u.state !== 'waitingForTransport' &&
      !u.carried &&
      u.stats.damage > 0
    );
  }

  /** Show a warning when the AI is massing a large force. */
  function checkBuildUp() {
    const total = game.enemyUnits.filter(u => u.alive).length;
    // Flash warning when we gain 5+ units in one tick (rapid build-up)
    if (total >= 12 && total - lastKnownEnemyCount >= 3 && !buildUpWarningShown) {
      game.flashMessage(`⚠️ Enemy battalion detected! (~${total} units massing)`);
      buildUpWarningShown = true;
    }
    if (total < 8) buildUpWarningShown = false;
    lastKnownEnemyCount = total;
  }

  /** Order a group of enemy units to attack. Pathfinder + game.js handle transports automatically. */
  function launchAttack() {
    const playerBases = game.bases.filter(b => b.faction === 'player');
    if (playerBases.length === 0) return;

    const available = gatherAttackers();
    const totalEnemy = game.enemyUnits.filter(u => u.alive && u.domain !== 'sea' && !u.isTransport && u.stats.damage > 0).length;

    let attackSize;
    if (totalEnemy < 4) attackSize = totalEnemy;
    else if (totalEnemy < 8) attackSize = Math.ceil(totalEnemy * 0.7);
    else if (totalEnemy < 15) attackSize = Math.ceil(totalEnemy * 0.6);
    else attackSize = Math.ceil(totalEnemy * (0.4 + Math.random() * 0.2));

    attackSize = Math.min(attackSize, cfg.maxAttackGroup);
    if (attackSize < 1) return;

    const multiTarget = Math.random() < 0.3;
    const targets = multiTarget ? playerBases : [pickPlayerTarget()];
    if (!targets.length) return;

    // Spawn additional mobile units near the attack target(s) — skip stationary defenses
    const spawnCount = Math.min(3, maxSpawnsPerSecond);
    for (let i = 0; i < spawnCount; i++) {
      const desiredType = chooseUnitToBuild();
      const stats = UNIT_TYPES[desiredType];
      if (stats.speed === 0) continue; // defenses stay at base
      if (aiMoney >= stats.cost) {
        if (spawnEnemyUnit(desiredType, targets[0])) {
          aiMoney -= stats.cost;
        }
      }
    }

    const sorted = [...available].sort((a, b) => {
      const aD = targets.reduce((m, t) => Math.min(m, a.mesh.position.distanceTo(t.mesh.position)), Infinity);
      const bD = targets.reduce((m, t) => Math.min(m, b.mesh.position.distanceTo(t.mesh.position)), Infinity);
      return aD - bD;
    });
    const attackers = sorted.slice(0, Math.min(attackSize, sorted.length));
    if (attackers.length < 1) return;

    if (attackers.length >= 8) {
      game.flashMessage(`⚠️ Enemy attack inbound! ${attackers.length} units detected`);
    }

    const isHuge = attackers.length >= 10;
    const primary = targets[0];

    // Air units attack targets directly
    const airAttackers = attackers.filter(u => u.domain === 'air');
    for (const target of targets) {
      for (const u of airAttackers) u.attack(target);
    }

    // Ground units: attack the target directly (not moveTo formation offsets)
    const groundAttackers = attackers.filter(u => u.domain !== 'air');
    if (!groundAttackers.length) return;

    if (multiTarget) {
      const perGroup = Math.max(1, Math.floor(groundAttackers.length / targets.length));
      let idx = 0;
      for (const t of targets) {
        const slice = groundAttackers.slice(idx, idx + perGroup);
        idx += perGroup;
        for (const u of slice) u.attack(t);
      }
      const leftover = groundAttackers.slice(idx);
      for (const u of leftover) u.attack(primary);
    } else {
      for (const u of groundAttackers) u.attack(primary);
    }

    console.log(`[DEBUG AI] ATTACK WAVE: ${attackers.length} units (air:${airAttackers.length}, ground:${groundAttackers.length}) → ${multiTarget ? targets.length + ' targets' : targets[0].name}${isHuge ? ' (HUGE BATTALION!)' : ''}`);
  }

  /** Defensive: any idle defender near a base that has hostile units near it should engage. */
  function defenseTick() {
    for (const base of game.bases) {
      if (base.faction !== 'enemy') continue;
      // Are any player units near this base?
      const threats = game.playerUnits.filter(u =>
        u.alive && u.mesh.position.distanceTo(base.mesh.position) < 80
      );
      if (threats.length === 0) continue;

      // Order nearby idle defenders to engage (skip units already targeting something)
      const defenders = game.enemyUnits.filter(u =>
        u.alive && u.state === 'idle' && !u.target &&
        u.mesh.position.distanceTo(base.mesh.position) < 100
      );
      for (const d of defenders) {
        // Filter threats based on unit capabilities
        const validThreats = d.stats.airOnly
          ? threats.filter(t => t.domain === 'air')
          : threats.filter(t => {
              if (d.domain === 'land' && t.domain === 'sea') {
                return d.mesh.position.distanceTo(t.mesh.position) < d.stats.range * 0.3;
              }
              return true;
            });
        if (validThreats.length === 0) continue;
        // Pick nearest valid threat
        const nearest = validThreats.reduce((a, b) =>
          d.mesh.position.distanceTo(a.mesh.position) <
          d.mesh.position.distanceTo(b.mesh.position) ? a : b
        );
        d.attack(nearest);
      }
    }
  }

  /** Reinforce a base under attack: send idle troops from other bases via transport. */
  function reinforceBase(attackedBase) {
    const otherBases = game.bases.filter(b => b.faction === 'enemy' && b.alive && b !== attackedBase);
    if (otherBases.length === 0) return;
    // Gather idle land troops near other bases
    const troops = game.enemyUnits.filter(u =>
      u.alive && u.domain === 'land' && !u.isTransport && u.state === 'idle' && !u.carried && u.stats.speed > 0
    );
    let sent = 0;
    for (const u of troops) {
      if (sent >= 4) break;
      for (const base of otherBases) {
        if (u.mesh.position.distanceTo(base.mesh.position) < 100) {
          u.moveTo(attackedBase.mesh.position.clone());
          sent++;
          break;
        }
      }
    }
    if (sent > 0) console.log(`[DEBUG AI] Reinforcing ${attackedBase.name} with ${sent} troops via transport`);
  }

  /** Hook: react to base taking damage by sending reinforcements. */
  let _lastReinforceTime = 0;
  game.onBaseUnderAttack = function (base) {
    // Throttle: max one reinforcement wave per 6 seconds
    const now = Date.now();
    if (now - _lastReinforceTime < 6000) return;
    _lastReinforceTime = now;
    reinforceBase(base);
  };

  // NEW: Launch staged attack
  function launchStagedAttack() {
    const playerBases = game.bases.filter(b => b.faction === 'player');
    if (playerBases.length === 0) return;

    // Get all staging units + any idle attackers
    const available = [...stagingUnits.filter(u => u.alive), ...gatherAttackers()];
    if (available.length < AI_MIN_ATTACK_SIZE) return;

    const target = pickPlayerTarget();
    if (!target) return;

    // Air units attack directly
    const airAttackers = available.filter(u => u.domain === 'air');
    for (const u of airAttackers) u.attack(target);

    // Ground units attack the target directly (not moveTo an offset formation)
    const groundAttackers = available.filter(u => u.domain !== 'air');
    for (const u of groundAttackers) u.attack(target);

    game.flashMessage(`Enemy attack inbound! ${available.length} units detected`);

    // Clear staging
    stagingUnits = [];
    attackPhase = 'attacking';
    stagingTimer = 0;
  }

  // ===== Hook the AI into the game's update loop =====
  const ATTACK_GROUP_TARGET = { easy: 8, normal: 15, hard: 30 };
  const groupTarget = ATTACK_GROUP_TARGET[game.difficulty] || 10;
  let attackCooldown = 0;

  // NEW: Staging system
  let stagingUnits = [];
  let stagingTimer = 0;
  let attackPhase = 'building'; // 'building', 'staging', 'attacking'

  game.onAITick = function (dt) {
    if (game.ended) return;

    // --- Defense ticks every frame (cheap) ---
    defenseTick();

    // --- Unified 1-second tick: income + spawn + attack ---
    economyTimer += dt;
    if (economyTimer >= 1) {
      economyTimer = 0;

      // Economy: passive income from bases
      const ownedBases = game.bases.filter(b => b.faction === 'enemy').length;
      const income = 12 * ownedBases * cfg.aiIncome;
      aiMoney += income;

      // Always spawn units every tick so the army keeps growing
      for (let i = 0; i < maxSpawnsPerSecond; i++) {
        const desiredType = chooseUnitToBuild();
        const stats = UNIT_TYPES[desiredType];
        // Stationary defenses (speed===0) are free for AI
        const cost = stats.speed === 0 ? 0 : stats.cost;
        if (aiMoney < cost) continue;
        if (spawnEnemyUnit(desiredType)) {
          aiMoney -= cost;
        }
      }

      // Place stationary defenses near each base (free, capped per base)
      if (Math.random() < 0.2) {
        const owned = game.bases.filter(b => b.faction === 'enemy');
        for (const base of owned) {
          const existing = game.enemyUnits.filter(u =>
            u.alive && u.stats.speed === 0 &&
            u.mesh.position.distanceTo(base.mesh.position) < 80
          ).length;
          const maxDef = game.difficulty === 'hard' ? 10 : 5;
          if (existing >= maxDef) continue;
          const defType = Math.random() < 0.5 ? 'missileDefense' : 'coastal';
          spawnEnemyUnit(defType, base);
        }
      }

      // NEW: Staging phase logic
      const totalCombat = game.enemyUnits.filter(u =>
        u.alive && u.domain !== 'sea' && !u.isTransport && u.stats.damage > 0
      ).length;

      if (attackPhase === 'building') {
        if (totalCombat >= groupTarget || (totalCombat >= AI_MIN_ATTACK_SIZE && attackCooldown >= 10)) {
          attackPhase = 'staging';
          stagingTimer = 0;
          // Gather idle units to staging area (near strongest base)
          const stagingBase = game.bases.filter(b => b.faction === 'enemy')
            .sort((a, b) => b.hp - a.hp)[0];
          if (stagingBase) {
            const idleUnits = game.enemyUnits.filter(u =>
              u.alive && u.domain !== 'sea' && !u.isTransport &&
              u.stats.damage > 0 && u.state === 'idle'
            );
            const rallyPos = stagingBase.mesh.position.clone().add(new THREE.Vector3(30, 0, 30));
            idleUnits.slice(0, AI_MAX_STAGING_UNITS).forEach(u => {
              u.moveTo(rallyPos);
              stagingUnits.push(u);
            });
          }
          game.flashMessage(`Enemy forces gathering...`);
        }
      } else if (attackPhase === 'staging') {
        stagingTimer += 1;
        // Keep spawning during staging
        if (stagingTimer >= AI_STAGING_TIME || stagingUnits.length >= AI_MAX_STAGING_UNITS) {
          launchStagedAttack();
        }
      } else if (attackPhase === 'attacking') {
        attackCooldown += 1;
        if (attackCooldown >= 15) {
          attackPhase = 'building';
          attackCooldown = 0;
          stagingUnits = [];
        }
      }

      // Proactive transport: ensure at least 1 transport exists when AI has 2+ bases
      const aiTransports = game.enemyUnits.filter(u => u.alive && u.isTransport);
      if (aiTransports.length === 0 && ownedBases > 1) {
        const bases = game.bases.filter(b => b.faction === 'enemy' && b.alive);
        const base = bases[Math.floor(Math.random() * bases.length)];
        const pos = game.findValidSpawn(base.mesh.position, 'sea');
        if (pos) {
          game.spawn('transport', 'enemy', pos);
          console.log(`[DEBUG AI] Proactive transport spawn at ${base.name}`);
        }
      }

      // Build-up warning check
      checkBuildUp();
    }
  };

  console.log(`✅ AI online — Difficulty: ${game.difficulty.toUpperCase()}`);
}