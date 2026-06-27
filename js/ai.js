// ai.js — Enemy AI controller with Easy / Normal / Hard behavior.
import * as THREE from 'three';
import { UNIT_TYPES, DIFFICULTY, TERRAIN } from './config.js';

export function initAI(game) {
  const cfg = DIFFICULTY[game.difficulty];

  let economyTimer = 0;
  let attackTimer  = cfg.aiInterval * 0.5; // first attack comes sooner
  let aiMoney      = 200;
  let buildUpTimer = 0;

  /** Check if water exists between two positions */
  function isWaterBetween(pos1, pos2) {
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = pos1.x + (pos2.x - pos1.x) * t;
      const z = pos1.z + (pos2.z - pos1.z) * t;
      const terrain = game.terrain.getTerrainAt(x, z);
      if (terrain === TERRAIN.SEA) return true;
    }
    return false;
  }

  /** Check if transport ships are needed for any player base */
  function needsTransport() {
    const enemyBases = game.bases.filter(b => b.faction === 'enemy');
    const playerBases = game.bases.filter(b => b.faction === 'player');
    if (!enemyBases.length || !playerBases.length) return false;
    for (const eb of enemyBases) {
      for (const pb of playerBases) {
        if (isWaterBetween(eb.mesh.position, pb.mesh.position)) return true;
      }
    }
    return false;
  }

  /** Pick the unit composition based on difficulty and need for transport. */
  function chooseUnitToBuild() {
    const needTrans = needsTransport();
    // Hard AI uses combined arms; Easy spams cheap stuff
    if (game.difficulty === 'easy') {
      const pool = needTrans ? ['infantry', 'infantry', 'tank', 'transport'] : ['infantry', 'infantry', 'tank'];
      return pool[Math.floor(Math.random() * pool.length)];
    }
    if (game.difficulty === 'normal') {
      const pool = needTrans ? ['infantry', 'tank', 'tank', 'artillery', 'fighter', 'transport'] : ['infantry', 'tank', 'tank', 'artillery', 'fighter'];
      return pool[Math.floor(Math.random() * pool.length)];
    }
    // Hard — balanced combined arms with naval threats
    const pool = needTrans ? ['tank', 'tank', 'artillery', 'fighter', 'bomber', 'destroyer', 'transport', 'battleship', 'carrier'] : ['tank', 'tank', 'artillery', 'fighter', 'bomber', 'destroyer'];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /** Pick a random enemy-owned base to spawn from. */
  function pickSpawnBase() {
    const owned = game.bases.filter(b => b.faction === 'enemy');
    if (owned.length === 0) return null;
    return owned[Math.floor(Math.random() * owned.length)];
  }

  /** Spawn near an enemy base, with terrain-aware placement. */
  function spawnEnemyUnit(type) {
    const base = pickSpawnBase();
    if (!base) return false;
    const stats = UNIT_TYPES[type];
    const pos = game.findValidSpawn(base.mesh.position, stats.domain);
    if (!pos) {
      console.warn(`[DEBUG AI] Failed to find spawn for ${type} near ${base.name}`);
      return false;
    }
    game.spawn(type, 'enemy', pos);
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
    // Easy/Normal — random player base
    return playerBases[Math.floor(Math.random() * playerBases.length)];
  }

  let lastKnownEnemyCount = 0;
  let buildUpWarningShown = false;

  /** Gather available attacking units (exclude air, transports, and defenders near bases). */
  function gatherAttackers() {
    // Count ALL alive enemy units (not just idle)
    return game.enemyUnits.filter(u =>
      u.alive && u.domain !== 'air' && !u.isTransport
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

  /** Order a group of enemy units to attack. Uses ALL available forces proportionally. */
  function launchAttack() {
    const playerBases = game.bases.filter(b => b.faction === 'player');
    if (playerBases.length === 0) return;

    const available = gatherAttackers();
    const totalEnemy = game.enemyUnits.filter(u => u.alive && !u.isTransport).length;

    // Scale attack group based on total available forces
    let attackSize;
    if (totalEnemy < 4) {
      attackSize = totalEnemy; // Send everything
    } else if (totalEnemy < 8) {
      attackSize = Math.ceil(totalEnemy * 0.7); // Send 70%
    } else if (totalEnemy < 15) {
      attackSize = Math.ceil(totalEnemy * 0.6); // Send 60%
    } else {
      attackSize = Math.ceil(totalEnemy * (0.4 + Math.random() * 0.2)); // Send 40-60% (keep reserves)
    }

    if (attackSize < 1) return;

    // 70% single target, 30% multi-target
    const multiTarget = Math.random() < 0.3;
    const targets = multiTarget ? playerBases : [pickPlayerTarget()];
    if (!targets.length) return;

    // Sort available by distance to nearest target
    const sorted = [...available].sort((a, b) => {
      const aD = targets.reduce((m, t) => Math.min(m, a.mesh.position.distanceTo(t.mesh.position)), Infinity);
      const bD = targets.reduce((m, t) => Math.min(m, b.mesh.position.distanceTo(t.mesh.position)), Infinity);
      return aD - bD;
    });
    const attackers = sorted.slice(0, Math.min(attackSize, sorted.length));
    if (attackers.length < 1) return;

    // Flash warning for large attacks
    if (attackers.length >= 8) {
      game.flashMessage(`⚠️ Enemy attack inbound! ${attackers.length} units detected`);
    }

    const isHuge = attackers.length >= 10;

    // Attack air units directly (they fly over everything)
    const airAttackers = attackers.filter(u => u.domain === 'air');
    for (const target of targets) {
      for (const u of airAttackers) {
        u.attack({ mesh: target.mesh, faction: target.faction, get alive() { return true; }, get hp() { return target.hp; }, takeDamage: d => target.takeDamage(d), type: target.name, domain: 'land' });
      }
    }

    // Ground units move in formation
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
      // Leftover units attack the primary target
      const leftover = groundAttackers.slice(idx);
      if (leftover.length > 0) {
        const primary = targets[0];
        const lPos = game.computeFormation(primary.mesh.position, leftover.length, 'line');
        leftover.forEach((u, i) => u.moveTo(lPos[i] || primary.mesh.position.clone()));
      }
    } else {
      const primary = targets[0];
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

      // Order nearby idle defenders to engage
      const defenders = game.enemyUnits.filter(u =>
        u.alive && u.state === 'idle' &&
        u.mesh.position.distanceTo(base.mesh.position) < 100
      );
      for (const d of defenders) {
        // Pick nearest threat
        const nearest = threats.reduce((a, b) =>
          d.mesh.position.distanceTo(a.mesh.position) <
          d.mesh.position.distanceTo(b.mesh.position) ? a : b
        );
        d.attack(nearest);
      }
    }
  }

  /** Find idle land units near a transport and load them */
  function loadTransport(tp) {
    const idle = game.enemyUnits.filter(u =>
      u.alive && u.domain === 'land' && !u.carried && u.state === 'idle'
    );
    for (const u of idle) {
      if (tp.carriedUnits.length >= tp.transportCapacity) break;
      if (tp.canLoadUnit(u)) tp.loadUnit(u);
    }
  }

  /** Order a transport to carry land troops across water */
  function launchAmphibiousAttack() {
    const playerBases = game.bases.filter(b => b.faction === 'player');
    if (!playerBases.length) return;
    const target = playerBases[Math.floor(Math.random() * playerBases.length)];

    // Find idle transports with cargo or ready to load
    const transports = game.enemyUnits.filter(u =>
      u.isTransport && u.alive && u.state === 'idle'
    );
    if (!transports.length) return;

    for (const tp of transports) {
      // Load nearby land units
      if (tp.carriedUnits.length < tp.transportCapacity) {
        loadTransport(tp);
      }
      // If we have some cargo, head toward target via coast
      if (tp.carriedUnits.length > 0) {
        // Find a coast position near the target
        const g = game.pathfinder.worldToGrid(target.mesh.position.x, target.mesh.position.z);
        const nearest = game.pathfinder.findNearestWalkable(g.gx, g.gy, 'sea');
        if (nearest) {
          const w = game.pathfinder.gridToWorld(nearest.gx, nearest.gy);
          tp.moveTo(new THREE.Vector3(w.x, 0, w.z));
          console.log(`[DEBUG AI] Transport moving ${tp.carriedUnits.length} units toward ${target.name}`);
        }
      }
    }
  }

  // ===== Hook the AI into the game's update loop =====
  game.onAITick = function (dt) {
    if (game.ended) return;

    // --- AI economy: passive income based on bases & difficulty multiplier ---
    economyTimer += dt;
    if (economyTimer >= 1) {
      const ownedBases = game.bases.filter(b => b.faction === 'enemy').length;
      const income = 12 * ownedBases * cfg.aiIncome;
      aiMoney += income;
      console.log(`[DEBUG AI] Economy tick: +$${income.toFixed(0)} (bases: ${ownedBases}, money: $${aiMoney.toFixed(0)})`);
      economyTimer = 0;
    }

    // --- AI builds units when it can afford them ---
    const desiredType = chooseUnitToBuild();
    const cost = UNIT_TYPES[desiredType].cost;
    if (aiMoney >= cost) {
      if (spawnEnemyUnit(desiredType)) {
        aiMoney -= cost;
      }
    }

    // --- Check for enemy build-up (every 2s) ---
    buildUpTimer += dt;
    if (buildUpTimer >= 2) {
      buildUpTimer = 0;
      checkBuildUp();
    }

    // --- Defense ticks every frame (cheap) ---
    defenseTick();

    // --- Amphibious transport logic ---
    if (needsTransport() && Math.random() < 0.02) {
      launchAmphibiousAttack();
    }

    // --- Attack waves on a timer ---
    attackTimer -= dt;
    if (attackTimer <= 0) {
      // Always attack if we have enough units, otherwise use aggression gate
      const totalUnits = game.enemyUnits.filter(u => u.alive && !u.isTransport).length;
      const shouldAttack = totalUnits >= 6 || Math.random() < cfg.aiAggression;
      if (shouldAttack) {
        launchAttack();
      }
      attackTimer = cfg.aiInterval * (0.75 + Math.random() * 0.5);
    }
  };

  console.log(`✅ AI online — Difficulty: ${game.difficulty.toUpperCase()}`);
}
