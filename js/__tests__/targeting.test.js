import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('three');
vi.mock('../terrain.js?v=3', () => ({ LAND_HEIGHT: 0.5 }));
vi.mock('../unitFactory.js?v=3', () => ({
  createUnitMesh: vi.fn(() => {
    const THREE = require('three');
    const g = new THREE.Group();
    g.userData = {};
    return g;
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

describe('findTarget() priority logic', () => {
  let THREE, Unit, Game;

  beforeEach(async () => {
    THREE = await import('three');
    const gameMod = await import('../game.js?v=6');
    Unit = gameMod.Unit;
    Game = gameMod.Game;
  });

  function makeGame() {
    vi.spyOn(Game.prototype, 'updateHUD').mockImplementation(() => {});
    const game = new Game(new THREE.Scene(), new THREE.PerspectiveCamera(), 'easy', new THREE.Vector3());
    game.terrain = { getTerrainAt: vi.fn(() => 'land'), mountains: [] };
    game.pathfinder = {
      cell: 12,
      worldToGrid: (x, z) => ({ gx: Math.floor((x + 600) / 12), gy: Math.floor((z + 600) / 12) }),
      gridToWorld: (gx, gy) => ({ x: gx * 12 - 600 + 6, z: gy * 12 - 600 + 6 }),
      findNearestWalkable: () => ({ gx: 50, gy: 50 }),
      findNearestCoast: () => ({ groundTile: { gx: 50, gy: 50 }, seaTile: { gx: 50, gy: 51 } }),
      findPath: () => [],
      findTransportPath: () => null,
      walkable: () => true,
    };
    game.upgrades = { applyTo: s => ({ ...s }) };
    game.playerUnits = [];
    game.enemyUnits = [];
    game.bases = [];
    game.projectiles = [];
    return game;
  }

  it('enemy unit targets player unit (priority 1) over player base (priority 2) even when base is closer', () => {
    const game = makeGame();

    // Enemy tank at origin — engageRange = 50 * 1.56 = 78
    const attacker = new Unit(game, 'tank', 'enemy', new THREE.Vector3(0, 0, 0));
    game.enemyUnits.push(attacker);

    // Player base at 5m — very close but priority 2
    const playerBase = {
      alive: true, faction: 'player', name: 'Player HQ', hp: 500,
      mesh: { position: new THREE.Vector3(0, 0, 5) },
    };
    game.bases.push(playerBase);

    // Player unit at 30m — farther away but priority 1
    const playerUnit = new Unit(game, 'infantry', 'player', new THREE.Vector3(0, 0, 30));
    game.playerUnits.push(playerUnit);

    attacker.findTarget();

    // Attacker should target the player unit, NOT the base
    expect(attacker.target).toBe(playerUnit);
    expect(attacker.target).not.toBe(playerBase);
  });

  it('enemy unit targets player unit over base even when base is in attack range', () => {
    const game = makeGame();

    const attacker = new Unit(game, 'tank', 'enemy', new THREE.Vector3(0, 0, 0));
    game.enemyUnits.push(attacker);

    // Player base at 10m — within attack range (range=50) but priority 2
    const playerBase = {
      alive: true, faction: 'player', name: 'Player HQ', hp: 500,
      mesh: { position: new THREE.Vector3(0, 0, 10) },
    };
    game.bases.push(playerBase);

    // Player unit at 40m — within engage range but priority 1
    const playerUnit = new Unit(game, 'infantry', 'player', new THREE.Vector3(0, 0, 40));
    game.playerUnits.push(playerUnit);

    attacker.findTarget();

    expect(attacker.target).toBe(playerUnit);
    expect(attacker.target).not.toBe(playerBase);
  });

  it('enemy unit targets base when no player units are in engage range', () => {
    const game = makeGame();

    const attacker = new Unit(game, 'tank', 'enemy', new THREE.Vector3(0, 0, 0));
    game.enemyUnits.push(attacker);

    // Player base at 60m — within engage range (78m) but beyond attack range (50m)
    const playerBase = {
      alive: true, faction: 'player', name: 'Player HQ', hp: 500,
      mesh: { position: new THREE.Vector3(0, 0, 60) },
    };
    game.bases.push(playerBase);

    // Player unit at 200m — outside engage range
    const playerUnit = new Unit(game, 'infantry', 'player', new THREE.Vector3(0, 0, 200));
    game.playerUnits.push(playerUnit);

    attacker.findTarget();

    // Base is beyond attack range but within engage range — should be pursueTarget
    expect(attacker._pursueTarget).toBe(playerBase);
  });

  it('closer base wins over farther base (same priority tiebreak)', () => {
    const game = makeGame();

    const attacker = new Unit(game, 'tank', 'enemy', new THREE.Vector3(0, 0, 0));
    game.enemyUnits.push(attacker);

    const farBase = {
      alive: true, faction: 'player', name: 'Far Base', hp: 500,
      mesh: { position: new THREE.Vector3(0, 0, 60) },
    };
    const nearBase = {
      alive: true, faction: 'player', name: 'Near Base', hp: 500,
      mesh: { position: new THREE.Vector3(0, 0, 30) },
    };
    game.bases.push(farBase, nearBase);

    attacker.findTarget();

    expect(attacker.target).toBe(nearBase);
  });
});
