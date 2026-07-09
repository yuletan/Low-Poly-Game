import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('three');
vi.mock('../terrain.js?v=3', () => ({ LAND_HEIGHT: 0.5 }));

describe('ai.js - AI Staging System', () => {
  let initAI, AI_STAGING_TIME, AI_MIN_ATTACK_SIZE, AI_MAX_STAGING_UNITS;
  let game;
  let THREE;

  beforeEach(async () => {
    THREE = await import('three');

    const configMod = await import('../config.js?v=6');
    AI_STAGING_TIME = configMod.AI_STAGING_TIME;
    AI_MIN_ATTACK_SIZE = configMod.AI_MIN_ATTACK_SIZE;
    AI_MAX_STAGING_UNITS = configMod.AI_MAX_STAGING_UNITS;

    const aiMod = await import('../ai.js?v=5');
    initAI = aiMod.initAI;

    game = {
      difficulty: 'normal',
      ended: false,
      money: 10000,
      playerUnits: [],
      enemyUnits: [],
      bases: [
        { faction: 'enemy', alive: true, name: 'Main Base', hp: 1000, mesh: { position: new THREE.Vector3(100, 0, 100) } },
        { faction: 'player', alive: true, name: 'Player HQ', hp: 500, mesh: { position: new THREE.Vector3(-100, 0, -100) } },
      ],
      terrain: { getTerrainAt: vi.fn(() => 'land'), mountains: [] },
      pathfinder: {
        cell: 12,
        worldToGrid: (x, z) => ({ gx: Math.floor((x + 600) / 12), gy: Math.floor((z + 600) / 12) }),
        gridToWorld: (gx, gy) => ({ x: gx * 12 - 600 + 6, z: gy * 12 - 600 + 6 }),
      },
      flashMessage: vi.fn(),
      spawn: vi.fn(() => ({
        alive: true, type: 'infantry', domain: 'land', isTransport: false,
        stats: { damage: 10, speed: 10, cost: 50, hp: 50 },
        hp: 50, maxHp: 50,
        mesh: { position: new THREE.Vector3(0, 0, 0) },
        state: 'idle', carried: false, _claimedByShip: null,
        attackMoveDest: null, attackMove: null, _transportData: null,
        carriedUnits: [], selectable: true,
        setSelected: vi.fn(), moveTo: vi.fn(), attack: vi.fn(), target: null,
      })),
      findValidSpawn: vi.fn(() => ({ x: 0, z: 0 })),
      computeFormation: vi.fn((center, count) => {
        const positions = [];
        for (let i = 0; i < count; i++) positions.push({ x: center.x + i * 6, z: center.z, y: 0 });
        return positions;
      }),
      checkWinCondition: vi.fn(),
      onBaseUnderAttack: null,
      onAITick: null,
    };

    initAI(game);
  });

  it('should set onAITick and onBaseUnderAttack hooks', () => {
    expect(game.onAITick).toBeDefined();
    expect(typeof game.onAITick).toBe('function');
    expect(game.onBaseUnderAttack).toBeDefined();
    expect(typeof game.onBaseUnderAttack).toBe('function');
  });

  it('should import AI_STAGING constants from config', () => {
    expect(AI_STAGING_TIME).toBe(8);
    expect(AI_MIN_ATTACK_SIZE).toBe(6);
    expect(AI_MAX_STAGING_UNITS).toBe(30);
  });

  it('defenseTick runs without throwing', () => {
    game.onAITick(0.1);
    game.onAITick(0.1);
    game.onAITick(0.1);
    expect(true).toBe(true);
  });

  it('difficulty configs are correct', async () => {
    const configMod = await import('../config.js?v=6');
    const diff = configMod.DIFFICULTY;
    expect(diff.easy.aiIncome).toBe(1.0);
    expect(diff.normal.aiIncome).toBe(1.5);
    expect(diff.hard.aiIncome).toBe(2.0);
    expect(diff.easy.maxAttackGroup).toBe(10);
    expect(diff.normal.maxAttackGroup).toBe(20);
    expect(diff.hard.maxAttackGroup).toBe(50);
  });
});
