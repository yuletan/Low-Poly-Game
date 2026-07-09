import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('three');
vi.mock('three/examples/jsm/geometries/RoundedBoxGeometry.js');
vi.mock('../sound.js', () => ({ Sound: { init: vi.fn(), play: vi.fn() } }));
vi.mock('../terrain.js?v=3', () => ({ LAND_HEIGHT: 0.5 }));
vi.mock('../unitFactory.js?v=3', () => ({
  createUnitMesh: vi.fn(() => {
    const THREE = require('three');
    const g = new THREE.Group();
    g.userData = {};
    return g;
  }),
  createBaseMesh: vi.fn(() => { const THREE = require('three'); return new THREE.Group(); }),
  createShipyardMesh: vi.fn(() => { const THREE = require('three'); return new THREE.Group(); }),
}));
vi.mock('../combat.js?v=3', () => ({
  Projectile: class {}, updateExplosions: vi.fn(), applyTerrainBonus: vi.fn(() => ({ dmg: 10, hp: 100 })),
  updateAllTrails: vi.fn(), createProjectilePattern: vi.fn(() => []), applyHitscanDamage: vi.fn(),
}));
vi.mock('../fogOfWar.js?v=3', () => ({ FogOfWar: class { constructor() { this.update = vi.fn(); } } }));
vi.mock('../minimap.js', () => ({ Minimap: class { constructor() { this.draw = vi.fn(); this.pings = []; this.worldToMini = () => ({ x: 0, y: 0 }); } } }));
vi.mock('../upgrades.js', () => ({ UpgradeManager: class { constructor() { this.applyTo = vi.fn(s => ({ ...s })); this.upgrades = { hp: 0, damage: 0, speed: 0, tactics: 0 }; } } }));

describe('Transport Logistics - _updateTransportLogistics', () => {
  let Game, game, THREE;

  beforeAll(async () => {
    THREE = await import('three');
    const gameMod = await import('../game.js?v=6');
    Game = gameMod.Game;

    vi.spyOn(Game.prototype, 'findValidSpawn').mockImplementation(() => new THREE.Vector3(50, 0.3, 50));
    vi.spyOn(Game.prototype, 'spawn').mockImplementation(() => ({}));
  });

  beforeEach(async () => {
    vi.clearAllMocks();

    if (!Game) {
      THREE = await import('three');
      const gameMod = await import('../game.js?v=6');
      Game = gameMod.Game;
    }

    game = new Game(new THREE.Scene(), new THREE.PerspectiveCamera(), 'easy', new THREE.Vector3());
    game.terrain = { getTerrainAt: vi.fn(() => 'land'), mountains: [] };
    game.pathfinder = {
      cell: 12,
      worldToGrid: (x, z) => ({ gx: Math.floor((x + 600) / 12), gy: Math.floor((z + 600) / 12) }),
      gridToWorld: (gx, gy) => ({ x: gx * 12 - 600 + 6, z: gy * 12 - 600 + 6 }),
      findNearestWalkable: vi.fn(() => ({ gx: 50, gy: 51 })),
    };
    game.bases = [{ faction: 'player', alive: true, mesh: { position: new THREE.Vector3(0, 0, 0) }, name: 'HQ' }];
    game._currentTime = 0;
    game.playerUnits = [];
    game.enemyUnits = [];
    game.money = 10000;
  });

  function makeWaitingTroop(overrides = {}) {
    return {
      alive: true, type: 'infantry', domain: 'land', isTransport: false,
      state: 'waitingForTransport',
      _claimedByShip: null,
      _transportData: { needsTransport: true },
      ...overrides,
    };
  }

  it('spawns no transport when no troops waiting', () => {
    game._updateTransportLogistics(0.1);
    expect(game.spawn).not.toHaveBeenCalled();
  });

  it('spawns 1 transport for 1-4 waiting troops (min 1)', () => {
    game.playerUnits = [makeWaitingTroop()];
    game._updateTransportLogistics(0.1);
    expect(game.spawn).toHaveBeenCalledTimes(1);
    expect(game.spawn).toHaveBeenCalledWith('transport', 'player', expect.anything());
    expect(game.money).toBe(9650); // 10000 - 350 (transport cost)
  });

  it('spawns 1 transport for 3 waiting troops (ceil(3/4)=1)', () => {
    for (let i = 0; i < 3; i++) game.playerUnits.push(makeWaitingTroop());
    game._updateTransportLogistics(0.1);
    expect(game.spawn).toHaveBeenCalledTimes(1);
  });

  it('spawns 2 transports for 5 waiting troops', () => {
    for (let i = 0; i < 5; i++) game.playerUnits.push(makeWaitingTroop());
    game._updateTransportLogistics(0.1);
    expect(game.spawn).toHaveBeenCalledTimes(2);
  });

  it('spawns 3 transports for 10 waiting troops', () => {
    for (let i = 0; i < 10; i++) game.playerUnits.push(makeWaitingTroop());
    game._updateTransportLogistics(0.1);
    // ceil(10/4) = 3
    expect(game.spawn).toHaveBeenCalledTimes(3);
  });

  it('spawns 7 transports for 25 waiting troops (large army scale)', () => {
    for (let i = 0; i < 25; i++) game.playerUnits.push(makeWaitingTroop());
    game._updateTransportLogistics(0.1);
    // ceil(25/4) = 7
    expect(game.spawn).toHaveBeenCalledTimes(7);
  });

  it('does not count troops already claimed by a ship', () => {
    game.playerUnits = [makeWaitingTroop({ _claimedByShip: { alive: true } })];
    game._updateTransportLogistics(0.1);
    expect(game.spawn).not.toHaveBeenCalled();
  });

  it('does not count idle troops (only waitingForTransport)', () => {
    game.playerUnits = [makeWaitingTroop({ state: 'idle' })];
    game._updateTransportLogistics(0.1);
    expect(game.spawn).not.toHaveBeenCalled();
  });

  it('does not spend money if insufficient funds', () => {
    game.money = 100; // transport costs 300
    for (let i = 0; i < 4; i++) game.playerUnits.push(makeWaitingTroop());
    game._updateTransportLogistics(0.1);
    expect(game.spawn).not.toHaveBeenCalled();
  });

  it('spawns at valid sea position near base', () => {
    for (let i = 0; i < 4; i++) game.playerUnits.push(makeWaitingTroop());
    game._updateTransportLogistics(0.1);
    expect(game.findValidSpawn).toHaveBeenCalledWith(
      expect.objectContaining({ x: 0, z: 0 }),
      'sea'
    );
  });

  it('skips spawning if active ship already heading to same embark', () => {
    game.playerUnits = [
      { alive: true, isTransport: true, _assignedEmbarkPoint: { x: 30, z: 30 }, carriedUnits: [], transportCapacity: 4 },
    ];
    for (let i = 0; i < 4; i++) game.playerUnits.push(makeWaitingTroop());
    // 4 troops → need 1, have 1 active → no spawn
    game._updateTransportLogistics(0.1);
    expect(game.spawn).not.toHaveBeenCalled();
  });

  it('spawns additional transport when active ships are insufficient', () => {
    game.playerUnits = [
      { alive: true, isTransport: true, _assignedEmbarkPoint: { x: 30, z: 30 }, carriedUnits: [], transportCapacity: 4 },
    ];
    for (let i = 0; i < 9; i++) game.playerUnits.push(makeWaitingTroop());
    // 9 troops → need ceil(9/4)=3, have 1 active → spawn 2 more
    game._updateTransportLogistics(0.1);
    expect(game.spawn).toHaveBeenCalledTimes(2);
  });
});

describe('Transport Ship - Real Unit behavior', () => {
  let Unit, Game, game, THREE;

  beforeEach(async () => {
    THREE = await import('three');
    const gameMod = await import('../game.js?v=6');
    Unit = gameMod.Unit;
    Game = gameMod.Game;

    vi.spyOn(Game.prototype, 'findValidSpawn').mockImplementation(() => new THREE.Vector3(50, 0.3, 50));
    vi.spyOn(Game.prototype, 'spawn').mockImplementation(() => ({}));

    game = new Game(new THREE.Scene(), new THREE.PerspectiveCamera(), 'easy', new THREE.Vector3());
    game.terrain = { getTerrainAt: vi.fn(() => 'land'), mountains: [] };
    game.pathfinder = {
      cell: 12,
      worldToGrid: (x, z) => ({ gx: Math.floor((x + 600) / 12), gy: Math.floor((z + 600) / 12) }),
      gridToWorld: (gx, gy) => ({ x: gx * 12 - 600 + 6, z: gy * 12 - 600 + 6 }),
      findNearestWalkable: vi.fn(() => ({ gx: 50, gy: 50 })),
      findPath: vi.fn(() => [new THREE.Vector3(10, 0, 10)]),
    };
    game.bases = [{ faction: 'player', alive: true, mesh: { position: new THREE.Vector3(0, 0, 0) }, name: 'HQ' }];
    game.playerUnits = [];
    game.enemyUnits = [];
    game.money = 10000;
    game._currentTime = 0;
    game.upgrades = { applyTo: vi.fn(s => ({ ...s })), upgrades: { hp: 0, damage: 0, speed: 0, tactics: 0 } };
    game.scene = new THREE.Scene();
  });

  it('ship pathfinds to shipEmbarkPoint (sea), not troop position', () => {
    const ship = new Unit(game, 'transport', 'player', new THREE.Vector3(0, 0.3, 0));
    const troop = new Unit(game, 'infantry', 'player', new THREE.Vector3(30, 0, 30));

    // Set up troop as if it needs transport
    troop._transportData = {
      needsTransport: true,
      shipEmbarkPoint: new THREE.Vector3(20, 0, 20),
    };
    troop.state = 'waitingForTransport';
    troop._claimedByShip = null;

    game.playerUnits = [ship, troop];
    ship.game = game;

    ship._updateTransport(0.1);

    // Ship should have embarked heading to shipEmbarkPoint (sea)
    expect(ship._assignedEmbarkPoint).toBeDefined();
    expect(ship._assignedEmbarkPoint.x).toBe(20);
    expect(ship._assignedEmbarkPoint.z).toBe(20);
    // Should have set a move target (path was shifted into moveTarget)
    expect(ship.moveTarget).toBeDefined();
    expect(ship.state).toBe('moving');
    // Troop should be claimed by the ship
    expect(troop._claimedByShip).toBe(ship);
  });

  it('ship pathfinds with sea domain constraint', () => {
    const ship = new Unit(game, 'transport', 'player', new THREE.Vector3(0, 0.3, 0));
    const troop = new Unit(game, 'infantry', 'player', new THREE.Vector3(30, 0, 30));

    troop._transportData = { needsTransport: true, shipEmbarkPoint: new THREE.Vector3(20, 0, 20) };
    troop.state = 'waitingForTransport';
    troop._claimedByShip = null;

    game.playerUnits = [ship, troop];
    ship.game = game;

    ship._updateTransport(0.1);
    expect(game.pathfinder.findPath).toHaveBeenCalled();
    expect(game.pathfinder.findPath.mock.calls[0][2]).toBe('sea');
  });

  it('ship unloads troops to land via findNearestWalkable with land domain', () => {
    const ship = new Unit(game, 'transport', 'player', new THREE.Vector3(50, 0.3, 50));
    const troop = new Unit(game, 'infantry', 'player', new THREE.Vector3(50, 0, 49)); // within 3 for loadUnit

    // Board the troop
    ship.loadUnit(troop);
    expect(ship.carriedUnits.length).toBe(1);
    troop._transportData = {
      needsTransport: true,
      segments: { walkToTarget: [new THREE.Vector3(100, 0, 100)] },
    };

    // Set ship to disembark phase
    ship._disembarkPoint = new THREE.Vector3(80, 0, 80);
    ship.path = [];

    ship._updateTransport(0.1);

    // Troop should be unloaded
    expect(troop.carried).toBe(false);
    expect(troop.mesh.visible).toBe(true);
    // findNearestWalkable should have been called with 'land'
    expect(game.pathfinder.findNearestWalkable).toHaveBeenCalled();
    const callArgs = game.pathfinder.findNearestWalkable.mock.calls[0];
    expect(callArgs[2]).toBe('land');
  });
});

describe('Troop Waiting on Land', () => {
  let Unit, Game, game, THREE;

  beforeEach(async () => {
    THREE = await import('three');
    const gameMod = await import('../game.js?v=6');
    Unit = gameMod.Unit;
    Game = gameMod.Game;

    game = new Game(new THREE.Scene(), new THREE.PerspectiveCamera(), 'easy', new THREE.Vector3());
    game.terrain = { getTerrainAt: vi.fn(() => 'land'), mountains: [] };
    game.pathfinder = {
      cell: 12, worldToGrid: () => ({}), gridToWorld: () => ({ x: 0, z: 0 }),
      findNearestWalkable: vi.fn(() => null), findPath: vi.fn(() => []),
    };
    game.playerUnits = [];
    game.enemyUnits = [];
    game.money = 10000;
    game._currentTime = 0;
    game.upgrades = { applyTo: vi.fn(s => ({ ...s })), upgrades: { hp: 0, damage: 0, speed: 0, tactics: 0 } };
    game.scene = new THREE.Scene();
    game.bases = [{ faction: 'player', alive: true, mesh: { position: new THREE.Vector3(0, 0, 0) } }];
  });

  it('troop waiting for transport has state waitingForTransport', () => {
    const troop = new Unit(game, 'infantry', 'player', new THREE.Vector3(30, 0, 30));
    troop._transportData = { needsTransport: true, shipEmbarkPoint: new THREE.Vector3(25, 0, 28) };
    troop.state = 'waitingForTransport';

    // Simulate no ship nearby
    troop.updateWaitingForTransport(0.1);
    expect(troop.state).toBe('waitingForTransport');
  });

  it('troop reverts to idle if _transportData is missing', () => {
    const troop = new Unit(game, 'infantry', 'player', new THREE.Vector3(30, 0, 30));
    troop._transportData = null;
    troop.state = 'waitingForTransport';

    troop.updateWaitingForTransport(0.1);
    expect(troop.state).toBe('idle');
  });

  it('troop moves to shipEmbarkPoint coast tile (land->coast, not into water)', () => {
    const troop = new Unit(game, 'infantry', 'player', new THREE.Vector3(30, 0, 30));
    troop._transportData = { needsTransport: true, shipEmbarkPoint: new THREE.Vector3(25, 0, 28) };
    troop._claimedByShip = { alive: true, carriedUnits: [], transportCapacity: 4, mesh: { position: new THREE.Vector3(200, 0, 200) } };
    troop.state = 'waitingForTransport';

    const moveToSpy = vi.spyOn(troop, 'moveTo').mockImplementation(() => {});
    troop.updateWaitingForTransport(0.1);

    // Should try to move toward the coast embark point (not swim)
    expect(moveToSpy).toHaveBeenCalled();
    // Target should be the embark point
    const target = moveToSpy.mock.calls[0][0];
    expect(target).toBeDefined();
  });

  it('troop boards transport when in 2D range <= 14 (coast tile to adjacent sea tile)', () => {
    // Coast tile center at (12, 0, 12), adjacent sea tile center at (12, 0.3, 0) or (0, 0.3, 12)
    // Distance between centers = 12 (GRID_CELL). 2D distance = 12, which is <= 14
    const ship = new Unit(game, 'transport', 'player', new THREE.Vector3(12, 0.3, 0));
    const troop = new Unit(game, 'infantry', 'player', new THREE.Vector3(12, 1.0, 12)); // land unit on coast tile

    troop._transportData = { needsTransport: true, shipEmbarkPoint: new THREE.Vector3(12, 0, 12) };
    troop.state = 'waitingForTransport';
    troop._claimedByShip = ship;
    game.playerUnits = [ship, troop];

    const dist2d = Math.hypot(troop.mesh.position.x - ship.mesh.position.x, troop.mesh.position.z - ship.mesh.position.z);
    expect(dist2d).toBe(12); // GRID_CELL distance
    expect(dist2d).toBeLessThanOrEqual(14); // within loadRange of 14

    troop.updateWaitingForTransport(0.1);
    expect(troop.carried).toBe(true);
    expect(ship.carriedUnits).toContain(troop);
  });

  it('troop does NOT board when 2D distance > 14', () => {
    const ship = new Unit(game, 'transport', 'player', new THREE.Vector3(0, 0.3, 0));
    const troop = new Unit(game, 'infantry', 'player', new THREE.Vector3(30, 1.0, 30)); // far away

    troop._transportData = { needsTransport: true, shipEmbarkPoint: new THREE.Vector3(30, 0, 30) };
    troop.state = 'waitingForTransport';
    troop._claimedByShip = ship;
    game.playerUnits = [ship, troop];

    const dist2d = Math.hypot(troop.mesh.position.x - ship.mesh.position.x, troop.mesh.position.z - ship.mesh.position.z);
    expect(dist2d).toBeGreaterThan(14);

    troop.updateWaitingForTransport(0.1);
    expect(troop.carried).toBeFalsy();
    expect(ship.carriedUnits.length).toBe(0);
  });
});

describe('Troop Disembark - Fans Out on Land', () => {
  let Unit, Game, game, THREE;

  beforeEach(async () => {
    THREE = await import('three');
    const gameMod = await import('../game.js?v=6');
    Unit = gameMod.Unit;
    Game = gameMod.Game;

    game = new Game(new THREE.Scene(), new THREE.PerspectiveCamera(), 'easy', new THREE.Vector3());
    game.terrain = { getTerrainAt: vi.fn(() => 'land'), mountains: [] };
    game.pathfinder = {
      cell: 12,
      worldToGrid: (x, z) => ({ gx: Math.floor((x + 600) / 12), gy: Math.floor((z + 600) / 12) }),
      gridToWorld: (gx, gy) => ({ x: gx * 12 - 600 + 6, z: gy * 12 - 600 + 6 }),
      findNearestWalkable: vi.fn((gx, gy, domain) => ({ gx, gy })),
      findPath: vi.fn(() => []),
    };
    game.bases = [{ faction: 'player', alive: true, mesh: { position: new THREE.Vector3(0, 0, 0) }, name: 'HQ' }];
    game.playerUnits = [];
    game.enemyUnits = [];
    game.money = 10000;
    game._currentTime = 0;
    game.upgrades = { applyTo: vi.fn(s => ({ ...s })), upgrades: { hp: 0, damage: 0, speed: 0, tactics: 0 } };
    game.scene = new THREE.Scene();
  });

  it('unloads troops to nearest walkable land tile via findNearestWalkable', () => {
    const ship = new Unit(game, 'transport', 'player', new THREE.Vector3(60, 0.3, 60));
    const troops = [
      new Unit(game, 'infantry', 'player', new THREE.Vector3(60, 1.0, 60)),
      new Unit(game, 'tank', 'player', new THREE.Vector3(60, 1.0, 60)),
      new Unit(game, 'artillery', 'player', new THREE.Vector3(60, 1.0, 60)),
    ];

    // Load troops
    for (const t of troops) ship.loadUnit(t);
    expect(ship.carriedUnits.length).toBe(3);

    // Give them transport data with walk-to-target paths
    for (const t of troops) {
      t._transportData = {
        needsTransport: true,
        segments: { walkToTarget: [new THREE.Vector3(100, 0, 100)] },
      };
    }

    // Ship at disembark point, no path
    ship._disembarkPoint = new THREE.Vector3(60, 0, 60);
    ship.path = [];

    ship._updateTransport(0.1);

    // All troops should be unloaded
    expect(ship.carriedUnits.length).toBe(0);
    for (const t of troops) {
      expect(t.carried).toBe(false);
      expect(t.mesh.visible).toBe(true);
    }
    // findNearestWalkable called with 'land' domain
    expect(game.pathfinder.findNearestWalkable).toHaveBeenCalledWith(
      expect.any(Number), expect.any(Number), 'land'
    );
  });

  it('unloaded troops fan out around landing zone', () => {
    const ship = new Unit(game, 'transport', 'player', new THREE.Vector3(50, 0.3, 50));
    const troops = [
      new Unit(game, 'infantry', 'player', new THREE.Vector3(50, 1.0, 50)),
      new Unit(game, 'tank', 'player', new THREE.Vector3(50, 1.0, 50)),
      new Unit(game, 'artillery', 'player', new THREE.Vector3(50, 1.0, 50)),
      new Unit(game, 'infantry', 'player', new THREE.Vector3(50, 1.0, 50)),
    ];

    for (const t of troops) ship.loadUnit(t);

    for (const t of troops) {
      t._transportData = { needsTransport: true, segments: { walkToTarget: [] } };
    }

    ship._disembarkPoint = new THREE.Vector3(50, 0, 50);
    ship.path = [];

    ship._updateTransport(0.1);

    // Troops should be fanned out (different positions)
    const positions = troops.map(t => ({ x: t.mesh.position.x, z: t.mesh.position.z }));
    const uniquePositions = new Set(positions.map(p => `${p.x.toFixed(1)},${p.z.toFixed(1)}`));
    expect(uniquePositions.size).toBe(troops.length); // all at different positions
  });

  it('unloaded troops receive their walk-to-target path and start moving', () => {
    const ship = new Unit(game, 'transport', 'player', new THREE.Vector3(60, 0.3, 60));
    const troop = new Unit(game, 'infantry', 'player', new THREE.Vector3(60, 1.0, 60));
    ship.loadUnit(troop);

    const targetPath = [
      new THREE.Vector3(70, 0, 70),
      new THREE.Vector3(80, 0, 80),
      new THREE.Vector3(90, 0, 90),
    ];
    // Clone path to avoid mutation by shift()
    troop._transportData = {
      needsTransport: true,
      segments: { walkToTarget: targetPath.map(p => p.clone()) },
    };

    ship._disembarkPoint = new THREE.Vector3(60, 0, 60);
    ship.path = [];

    ship._updateTransport(0.1);

    // Troop should have the path and be moving
    // path.shift() is called in unload logic, so path.length = original - 1
    expect(troop.path.length).toBe(targetPath.length - 1);
    // moveTarget is the first element that was shifted
    expect(troop.moveTarget).toEqual(targetPath[0]);
    expect(troop.state).toBe('moving');
  });
});
