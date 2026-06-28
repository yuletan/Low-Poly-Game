// ai.js — Enemy AI controller with Easy / Normal / Hard behavior.
import * as THREE from 'three';
import { UNIT_TYPES, DIFFICULTY, TERRAIN } from './config.js?v=5';

export function initAI(game) {
  const cfg = DIFFICULTY[game.difficulty];

  let economyTimer = 0;
  let aiMoney      = 200;

  /** Pick the unit composition based on difficulty. */
  function chooseUnitToBuild() {
    if (game.difficulty === 'easy') {
      return ['infantry', 'infantry', 'tank'][Math.floor(Math.random() * 3)];
    }
    if (game.difficulty === 'normal') {
      return ['infantry', 'tank', 'tank', 'artillery', 'fighter'][Math.floor(Math.random() * 5)];
    }
    return ['tank', 'tank', 'artillery', 'fighter', 'bomber', 'destroyer', 'battleship', 'carrier', 'missileDefense'][Math.floor(Math.random() * 9)];
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

  /** Gather available attacking units (exclude ships and transports). */
  function gatherAttackers() {
    return game.enemyUnits.filter(u =>
      u.alive && u.domain !== 'sea' && !u.isTransport
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
        // Spawn one unit
        const desiredType = chooseUnitToBuild();
        const cost = UNIT_TYPES[desiredType].cost;
        if (aiMoney >= cost) {
          if (spawnEnemyUnit(desiredType)) {
            aiMoney -= cost;
          }
        }
      }

      // Build-up warning check
      checkBuildUp();
    }
  };

  console.log(`✅ AI online — Difficulty: ${game.difficulty.toUpperCase()}`);
}
