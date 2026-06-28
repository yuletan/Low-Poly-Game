// ai.js — Enemy AI controller with Easy / Normal / Hard behavior.
import * as THREE from 'three';
import { UNIT_TYPES, DIFFICULTY, TERRAIN } from './config.js?v=5';
import { LAND_HEIGHT } from './terrain.js?v=3';

export function initAI(game) {
  const cfg = DIFFICULTY[game.difficulty];

  let economyTimer = 0;
  let aiMoney      = 200;

  const SPAWN_RATES = { easy: 1, normal: 2, hard: 4 };
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
    const validTerrains = domain === 'sea' ? [TERRAIN.SEA, TERRAIN.COAST] : [TERRAIN.LAND, TERRAIN.COAST];
    for (let radius = 15; radius <= 200; radius += 8) {
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2 + Math.random() * 0.2;
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
    return null;
  }

  /** Pick the unit composition based on difficulty. */
  function chooseUnitToBuild() {
    if (game.difficulty === 'easy') {
      return ['infantry', 'infantry', 'tank'][Math.floor(Math.random() * 3)];
    }
    if (game.difficulty === 'normal') {
      return ['infantry', 'tank', 'tank', 'artillery', 'fighter'][Math.floor(Math.random() * 5)];
    }
    return ['tank', 'tank', 'artillery', 'mlrs', 'fighter', 'bomber', 'heli', 'gunship', 'destroyer', 'frigate', 'cruiser', 'submarine', 'battleship', 'carrier', 'missileDefense', 'coastal'][Math.floor(Math.random() * 16)];
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
      !u.carried
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
    const totalEnemy = game.enemyUnits.filter(u => u.alive && u.domain !== 'sea' && !u.isTransport).length;

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

    // Spawn additional units near the attack target(s) so they're visible massing
    const spawnCount = Math.min(3, maxSpawnsPerSecond); // spawn up to 3 units per attack
    for (let i = 0; i < spawnCount; i++) {
      const desiredType = chooseUnitToBuild();
      const cost = UNIT_TYPES[desiredType].cost;
      if (aiMoney >= cost) {
        // Pick the first target for spawning
        if (spawnEnemyUnit(desiredType, targets[0])) {
          aiMoney -= cost;
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

    // Attack air units directly
    const airAttackers = attackers.filter(u => u.domain === 'air');
    for (const target of targets) {
      for (const u of airAttackers) u.attack(target);
    }

    // Ground units: just tell them to move to the target.
    // Pathfinder + game.js logistics will handle transport ships automatically!
    const groundAttackers = attackers.filter(u => u.domain !== 'air');
    if (!groundAttackers.length) return;

    if (multiTarget) {
      const perGroup = Math.max(1, Math.floor(groundAttackers.length / targets.length));
      let idx = 0;
      for (const t of targets) {
        const slice = groundAttackers.slice(idx, idx + perGroup);
        idx += perGroup;
        const positions = game.computeFormation(t.mesh.position, slice.length, isHuge ? 'wedge' : 'line');
        slice.forEach((u, i) => u.moveTo(positions[i] || t.mesh.position.clone()));
      }
      const leftover = groundAttackers.slice(idx);
      if (leftover.length > 0) {
        const lPos = game.computeFormation(primary.mesh.position, leftover.length, 'line');
        leftover.forEach((u, i) => u.moveTo(lPos[i] || primary.mesh.position.clone()));
      }
    } else {
      const positions = game.computeFormation(primary.mesh.position, groundAttackers.length, isHuge ? 'wedge' : 'line');
      groundAttackers.forEach((u, i) => u.moveTo(positions[i] || primary.mesh.position.clone()));
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

  // ===== Hook the AI into the game's update loop =====
  game.onAITick = function (dt) {
    if (game.ended) return;

    // --- Defense ticks every frame (cheap) ---
    defenseTick();

    // --- Unified 1-second tick: income + spawn-vs-attack ---
    economyTimer += dt;
    if (economyTimer >= 1) {
      economyTimer = 0;

      // Economy: passive income from bases
      const ownedBases = game.bases.filter(b => b.faction === 'enemy').length;
      const income = 12 * ownedBases * cfg.aiIncome;
      aiMoney += income;

      // Decision: attack probability = alive combat units / maxAttackGroup
      const totalCombat = game.enemyUnits.filter(u => u.alive && u.domain !== 'sea' && !u.isTransport).length;
      const attackChance = Math.min(1, totalCombat / cfg.maxAttackGroup);

      if (Math.random() < attackChance) {
        launchAttack();
      } else {
        // Spawn up to maxSpawnsPerSecond units this tick
        for (let i = 0; i < maxSpawnsPerSecond; i++) {
          const desiredType = chooseUnitToBuild();
          const cost = UNIT_TYPES[desiredType].cost;
          if (aiMoney >= cost) {
            if (spawnEnemyUnit(desiredType)) {
              aiMoney -= cost;
            } else {
              break;
            }
          } else {
            break;
          }
        }
      }

      // Build-up warning check
      checkBuildUp();
    }
  };

  console.log(`✅ AI online — Difficulty: ${game.difficulty.toUpperCase()}`);
}
