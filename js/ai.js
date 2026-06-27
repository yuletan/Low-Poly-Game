// ai.js — Enemy AI controller with Easy / Normal / Hard behavior.
import * as THREE from 'three';
import { UNIT_TYPES, DIFFICULTY } from './config.js';

export function initAI(game) {
  const cfg = DIFFICULTY[game.difficulty];

  let economyTimer = 0;
  let attackTimer  = cfg.aiInterval * 0.5; // first attack comes sooner
  let aiMoney      = 200;

  /** Pick the unit composition based on difficulty. */
  function chooseUnitToBuild() {
    // Hard AI uses combined arms; Easy spams cheap stuff
    if (game.difficulty === 'easy') {
      const pool = ['infantry', 'infantry', 'tank'];
      return pool[Math.floor(Math.random() * pool.length)];
    }
    if (game.difficulty === 'normal') {
      const pool = ['infantry', 'tank', 'tank', 'artillery', 'fighter'];
      return pool[Math.floor(Math.random() * pool.length)];
    }
    // Hard — balanced combined arms with naval threats
    const pool = ['tank', 'tank', 'artillery', 'fighter', 'bomber', 'destroyer'];
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

  /** Order a group of idle enemy units to attack. */
  function launchAttack() {
    const target = pickPlayerTarget();
    if (!target) return;

    // Group size scales with aggression
    const idle = game.enemyUnits.filter(u =>
      u.alive && (u.state === 'idle' || (u.state === 'attacking' && !u.target))
    );
    if (idle.length < 2) return;

    let groupSize;
    if (game.difficulty === 'easy')   groupSize = Math.min(2 + Math.floor(Math.random()*2), idle.length);
    else if (game.difficulty === 'normal') groupSize = Math.min(4 + Math.floor(Math.random()*3), idle.length);
    else                              groupSize = Math.min(6 + Math.floor(Math.random()*4), idle.length);

    // Pick the closest units to the target (more tactical than random)
    const sorted = idle.sort((a, b) =>
      a.mesh.position.distanceTo(target.mesh.position) -
      b.mesh.position.distanceTo(target.mesh.position)
    );
    const attackers = sorted.slice(0, groupSize);

    // Form up around the target with a wedge
    const formationFormation = game.difficulty === 'hard' ? 'wedge' : 'line';
    const positions = game.computeFormation(
      target.mesh.position, attackers.length, formationFormation
    );

    attackers.forEach((u, i) => {
      // Some units march to the position, then attack; air units attack directly
      if (u.domain === 'air') {
        u.moveTarget = target.mesh.position.clone();
        u.moveTarget.y = u.stats.altitude;
      } else {
        u.moveTo(positions[i] || target.mesh.position.clone());
      }
    });

    console.log(`[DEBUG AI] ATTACK WAVE: ${attackers.length} units → ${target.name} (target HP: ${target.hp.toFixed(0)})`);
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

    // --- Defense ticks every frame (cheap) ---
    defenseTick();

    // --- Attack waves on a timer ---
    attackTimer -= dt;
    if (attackTimer <= 0) {
      // Aggression chance gate
      if (Math.random() < cfg.aiAggression) {
        launchAttack();
      }
      attackTimer = cfg.aiInterval * (0.75 + Math.random() * 0.5);
    }
  };

  console.log(`✅ AI online — Difficulty: ${game.difficulty.toUpperCase()}`);
}
