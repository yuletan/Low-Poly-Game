import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('three', () => ({
  Vector3: class {
    constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
    clone() { return new this.constructor(this.x, this.y, this.z); }
    add(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }
    distanceTo(v) { return Math.hypot(this.x - v.x, this.y - v.y, this.z - v.z); }
    set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }
  }
}));

vi.mock('../terrain.js?v=3', () => ({ LAND_HEIGHT: 0.5 }));

describe('ai.js - AI Staging Attack System', () => {
  let initAI, AI_STAGING_TIME, AI_MIN_ATTACK_SIZE, AI_MAX_STAGING_UNITS;
  let game;
  let THREE;
  let originalRandom;

  beforeEach(async () => {
    let callCount = 0;
    originalRandom = Math.random;
    Math.random = () => { callCount++; return 0.1; };

    THREE = await import('three');

    const configMod = await import('../config.js?v=6');
    AI_STAGING_TIME = configMod.AI_STAGING_TIME;
    AI_MIN_ATTACK_SIZE = configMod.AI_MIN_ATTACK_SIZE;
    AI_MAX_STAGING_UNITS = configMod.AI_MAX_STAGING_UNITS;

    const aiMod = await import('../ai.js?v=5');
    initAI = aiMod.initAI;

    const playerBase = {
      faction: 'player', alive: true, name: 'Player HQ', hp: 500,
      mesh: { position: new THREE.Vector3(-100, 0, -100) }
    };
    const enemyBase = {
      faction: 'enemy', alive: true, name: 'Main Base', hp: 1000,
      mesh: { position: new THREE.Vector3(100, 0, 100) }
    };

    game = {
      difficulty: 'normal',
      ended: false,
      money: 10000,
      playerUnits: [],
      enemyUnits: [],
      bases: [enemyBase, playerBase],
      terrain: { getTerrainAt: vi.fn(() => 'land'), mountains: [] },
      pathfinder: {
        cell: 12,
        worldToGrid: (x, z) => ({ gx: Math.floor((x + 600) / 12), gy: Math.floor((z + 600) / 12) }),
        findPath: vi.fn(() => [{}]),
        findTransportPath: vi.fn(() => ({ needsTransport: false, path: [{}] })),
        gridToWorld: (gx, gy) => ({ x: gx * 12 - 600 + 6, z: gy * 12 - 600 + 6 }),
      },
      flashMessage: vi.fn(),
      findValidSpawn: vi.fn(() => ({ x: 0, z: 0 })),
      computeFormation: vi.fn((center, count) => {
        const positions = [];
        for (let i = 0; i < count; i++) positions.push({ x: center.x + i * 6, z: center.z, y: 0 });
        return positions;
      }),
      checkWinCondition: vi.fn(),
      onBaseUnderAttack: null,
      onAITick: null,
      spawn: vi.fn((type, faction, pos) => {
        const unit = {
          alive: true, type, faction, domain: 'land', isTransport: false,
          stats: { damage: 10, speed: 10, cost: 50, hp: 50, range: 100 },
          hp: 50, maxHp: 50,
          mesh: { position: new THREE.Vector3(pos?.x ?? 0, 0, pos?.z ?? 0) },
          state: 'idle', carried: false, _claimedByShip: null,
          carriedUnits: [], selectable: true,
          setSelected: vi.fn(),
          moveTo: vi.fn(function(dest, attackMove) { this.state = 'moving'; this._moveTarget = dest; this._attackMove = attackMove; }),
          attack: vi.fn(function(target) { this.state = 'attacking'; this.target = target; this._pursueTarget = target; }),
          target: null, _pursueTarget: null,
        };
        if (faction === 'enemy') game.enemyUnits.push(unit);
        else game.playerUnits.push(unit);
        return unit;
      }),
    };

    initAI(game);
  });

  afterEach(() => {
    Math.random = originalRandom;
    vi.clearAllMocks();
  });

  it('should set onAITick and onBaseUnderAttack hooks', () => {
    expect(game.onAITick).toBeDefined();
    expect(typeof game.onAITick).toBe('function');
    expect(game.onBaseUnderAttack).toBeDefined();
    expect(typeof game.onBaseUnderAttack).toBe('function');
  });

  it('should transition from building to staging to attacking and command ground units to attack-move toward player base', () => {
    for (let i = 0; i < 25; i++) {
      game.onAITick(1);
    }

    const groundUnits = game.enemyUnits.filter(u => u.domain === 'land' && !u.isTransport && u.stats.damage > 0);
    expect(groundUnits.length).toBeGreaterThan(0);

    const playerBase = game.bases.find(b => b.faction === 'player');
    const attackMovedGroundUnits = groundUnits.filter(u =>
      u.moveTo.mock.calls.some(call => call[1] === true)
    );

    expect(attackMovedGroundUnits.length).toBeGreaterThan(0);

    const airUnits = game.enemyUnits.filter(u => u.domain === 'air');
    for (const u of airUnits) {
      if (u.attack.mock.calls.length > 0) {
        expect(u.attack.mock.calls.some(call => call[0] === playerBase)).toBe(true);
      }
    }
  });

  it('should command ground units via attack-move (moveTo with true) during staged attack', () => {
    for (let i = 0; i < 25; i++) {
      game.onAITick(1);
    }

    const groundUnits = game.enemyUnits.filter(u =>
      u.domain === 'land' && !u.isTransport && u.stats.damage > 0
    );
    expect(groundUnits.length).toBeGreaterThan(0);

    const attackMovedGroundUnits = groundUnits.filter(u =>
      u.moveTo.mock.calls.some(call => call[1] === true)
    );
    expect(attackMovedGroundUnits.length).toBeGreaterThan(0);
  });

  it('launchAttack should command ground units to attack-move toward target', () => {
    const playerBase = game.bases.find(b => b.faction === 'player');

    for (let i = 0; i < 5; i++) {
      game.spawn('tank', 'enemy', { x: 110, z: 110 });
    }

    game.onAITick(0);

    for (let i = 0; i < 30; i++) {
      game.onAITick(1);
    }

    const groundUnits = game.enemyUnits.filter(u => u.domain === 'land' && !u.isTransport && u.stats.damage > 0);
    const attackMovedGroundUnits = groundUnits.filter(u =>
      u.moveTo.mock.calls.some(call => call[1] === true)
    );

    expect(attackMovedGroundUnits.length).toBeGreaterThan(0);
  });

  // Regression test for the Ultra Low throttling bug:
  // economyTimer must accumulate even when the AI tick is throttled.
  // Previously, economyTimer += dt was inside the throttled block, so with
  // dt=0.05 and aiInterval=2.0 it would take 40 real seconds to spawn one unit.
  it('AI economy should still progress when called with small dt (simulated throttled frames)', () => {
    const initialCount = game.enemyUnits.length;

    // Simulate 4 seconds of game time at typical clamped frame delta dt=0.05
    for (let i = 0; i < 80; i++) {
      game.onAITick(0.05);
    }

    // With 4 seconds of game time, the AI should have spawned several units
    // (income accumulates every 1s, spawns up to 3 per economy tick on normal).
    expect(game.enemyUnits.length).toBeGreaterThan(initialCount);
  });
});
