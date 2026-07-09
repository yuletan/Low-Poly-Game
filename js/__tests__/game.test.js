import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('three');
vi.mock('three/examples/jsm/geometries/RoundedBoxGeometry.js');
vi.mock('../terrain.js?v=3', () => ({
  LAND_HEIGHT: 0.5,
  buildTerrain: vi.fn(() => ({ getTerrainAt: vi.fn(() => 'land'), mountains: [] })),
}));
vi.mock('../unitFactory.js?v=3', () => ({
  createUnitMesh: vi.fn(() => {
    const THREE = require('three');
    const g = new THREE.Group();
    g.userData = {};
    return g;
  }),
  createBaseMesh: vi.fn(() => {
    const THREE = require('three'); const g = new THREE.Group(); return g;
  }),
  createShipyardMesh: vi.fn(() => {
    const THREE = require('three'); const g = new THREE.Group(); return g;
  }),
}));
vi.mock('../combat.js?v=3', () => ({
  Projectile: class {},
  updateExplosions: vi.fn(),
  applyTerrainBonus: vi.fn(() => ({ dmg: 10, hp: 100 })),
  updateAllTrails: vi.fn(),
  createProjectilePattern: vi.fn(() => []),
  applyHitscanDamage: vi.fn(),
}));
vi.mock('../pathfinder.js?v=4', () => ({
  Pathfinder: class {
    constructor() { this.cell = 12; }
    worldToGrid(x, z) { return { gx: Math.floor((x + 600) / 12), gy: Math.floor((z + 600) / 12) }; }
    gridToWorld(gx, gy) { return { x: gx * 12 - 600 + 6, z: gy * 12 - 600 + 6 }; }
    findNearestWalkable() { return { gx: 50, gy: 50 }; }
    findNearestCoast() { return { groundTile: { gx: 50, gy: 50 }, seaTile: { gx: 50, gy: 51 } }; }
    findPath() { return []; }
    findTransportPath() { return null; }
    walkable() { return true; }
  },
}));
vi.mock('../fogOfWar.js?v=3', () => ({
  FogOfWar: class { constructor() { this.update = vi.fn(); } },
}));
vi.mock('../minimap.js', () => ({
  Minimap: class {
    constructor() { this.draw = vi.fn(); this.pings = []; this.worldToMini = () => ({ x: 0, y: 0 }); }
  },
}));
vi.mock('../upgrades.js', () => ({
  UpgradeManager: class {
    constructor() { this.applyTo = vi.fn(s => ({ ...s })); this.upgrades = { hp: 0, damage: 0, speed: 0, tactics: 0 }; }
  },
}));
vi.mock('../sound.js', () => ({ Sound: { init: vi.fn(), play: vi.fn() } }));

describe('game.js - Game Logic Fixes', () => {
  let THREE, Unit, Base, Game, UNIT_TYPES;

  beforeEach(async () => {
    THREE = await import('three');
    const configMod = await import('../config.js?v=6');
    UNIT_TYPES = configMod.UNIT_TYPES;
    const gameMod = await import('../game.js?v=6');
    Unit = gameMod.Unit;
    Base = gameMod.Base;
    Game = gameMod.Game;
  });

  describe('Unit class', () => {
    let game;

    beforeEach(() => {
      game = new Game(new THREE.Scene(), new THREE.PerspectiveCamera(), 'easy', new THREE.Vector3());
      game.terrain = { getTerrainAt: vi.fn(() => 'land'), mountains: [] };
      game.pathfinder = { cell: 12, worldToGrid: () => ({ gx: 50, gy: 50 }), gridToWorld: () => ({ x: 0, z: 0 }), findNearestWalkable: () => ({ gx: 50, gy: 50 }), findNearestCoast: () => ({ groundTile: { gx: 50, gy: 50 }, seaTile: { gx: 50, gy: 51 } }), findPath: () => [], findTransportPath: () => null, walkable: () => true };
      game.upgrades = { applyTo: s => ({ ...s }) };
      game.playerUnits = [];
      game.enemyUnits = [];
      game.bases = [];
      game.projectiles = [];
      game.selectedUnits = [];
      game.scene = new THREE.Scene();
      game._currentTime = 0;
    });

    it('should have _stuckTimer, _stuckPosition, _lastDx, _lastDz fields (Issue 1)', () => {
      const u = new Unit(game, 'infantry', 'player', new THREE.Vector3(0, 0, 0));
      expect(u._stuckTimer).toBe(0);
      expect(u._stuckPosition).toBeNull();
      expect(u._lastDx).toBe(0);
      expect(u._lastDz).toBe(0);
    });

    it('should have _pushCooldown starting at 0', () => {
      const u = new Unit(game, 'tank', 'player', new THREE.Vector3(0, 0, 0));
      expect(u._pushCooldown).toBe(0);
    });

    it('transport has nonCombatant field in config', () => {
      expect(UNIT_TYPES.transport.nonCombatant).toBe(true);
    });

    it('updateMove sets _lastDx and _lastDz for smoothing (Issue 1)', () => {
      const u = new Unit(game, 'infantry', 'player', new THREE.Vector3(0, 0, 0));
      u.moveTarget = new THREE.Vector3(100, 0, 100);
      u.path = [];
      u.state = 'moving';
      u.stats.speed = 10;
      u.updateMove(0.1);
      expect(u._lastDx).not.toBe(0);
      expect(u._lastDz).not.toBe(0);
    });

    it('updateMove tracks stuckTimer on each call (Issue 1)', () => {
      const u = new Unit(game, 'infantry', 'player', new THREE.Vector3(0, 0, 0));
      u.moveTarget = new THREE.Vector3(100, 0, 100);
      u.path = [];
      u.state = 'moving';
      u.stats.speed = 10;
      // First call: _stuckPosition is null → initializes it, _stuckTimer = 0
      u.updateMove(0.1);
      expect(u._stuckTimer).toBe(0);
      expect(u._stuckPosition).not.toBeNull();
      // Second call: unit hasn't moved → increments stuckTimer
      u.updateMove(0.1);
      expect(u._stuckTimer).toBe(0.1);
    });

    it('updateAttack stops movement when target in range (Issue 10)', () => {
      const u = new Unit(game, 'tank', 'player', new THREE.Vector3(0, 0, 0));
      u.stats.range = 50;
      const target = {
        alive: true, faction: 'enemy',
        mesh: { position: new THREE.Vector3(20, 0, 0) },
        position: new THREE.Vector3(20, 0, 0),
      };
      u.target = target;
      u.state = 'moving';
      u.path = [new THREE.Vector3(25, 0, 0)];
      u.moveTarget = new THREE.Vector3(25, 0, 0);
      u.cooldown = 1;
      u.updateAttack(0.1);
      expect(u.path).toEqual([]);
      expect(u.moveTarget).toBeNull();
      expect(u.state).toBe('attacking');
    });

    it('infantry has correct base stats', () => {
      expect(UNIT_TYPES.infantry.hp).toBe(50);
      expect(UNIT_TYPES.infantry.damage).toBe(8);
      expect(UNIT_TYPES.infantry.range).toBe(18);
      expect(UNIT_TYPES.infantry.speed).toBe(14);
      expect(UNIT_TYPES.infantry.cost).toBe(50);
    });
  });

  describe('Base class', () => {
    let game;

    beforeEach(() => {
      game = new Game(new THREE.Scene(), new THREE.PerspectiveCamera(), 'easy', new THREE.Vector3());
      game.terrain = { getTerrainAt: vi.fn(() => 'land'), mountains: [] };
      game.pathfinder = {};
      game.upgrades = { applyTo: s => ({ ...s }) };
      game.scene = new THREE.Scene();
    });

    it('turretRange should be 80 * size (Issue 5)', () => {
      const b = new Base(game, 'player', new THREE.Vector3(0, 0, 0), 1, 'Test Base');
      expect(b.turretRange).toBe(80);
    });

    it('turretRange scales with size (Issue 5)', () => {
      const b = new Base(game, 'player', new THREE.Vector3(0, 0, 0), 2, 'Big Base');
      expect(b.turretRange).toBe(160);
    });

    it('turretFireRate should be 1.0 (Issue 5)', () => {
      const b = new Base(game, 'player', new THREE.Vector3(0, 0, 0), 1, 'Test Base');
      expect(b.turretFireRate).toBe(1.0);
    });
  });

  describe('Game class', () => {
    let game;

    beforeEach(() => {
      // Prevent updateHUD from throwing by spying
      vi.spyOn(Game.prototype, 'updateHUD').mockImplementation(() => {});
      game = new Game(new THREE.Scene(), new THREE.PerspectiveCamera(), 'easy', new THREE.Vector3());
    });

    it('should track _currentTime (Issue 1)', () => {
      expect(game._currentTime).toBe(0);
      game.update(0.1);
      expect(game._currentTime).toBe(0.1);
      game.update(0.5);
      expect(game._currentTime).toBe(0.6);
    });

    it('starts with STARTING_MONEY', () => {
      // Game constructor sets money from STARTING_MONEY (2500)
      expect(game.money).toBe(2500);
    });

    it('has empty unit arrays on creation', () => {
      expect(game.playerUnits).toEqual([]);
      expect(game.enemyUnits).toEqual([]);
    });
  });
});
