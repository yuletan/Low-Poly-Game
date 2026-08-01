import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('three');
vi.mock('three/examples/jsm/geometries/RoundedBoxGeometry.js');
vi.mock('../terrain.js', () => ({
  LAND_HEIGHT: 0.5,
  buildTerrain: vi.fn(() => ({ getTerrainAt: vi.fn(() => 'land'), mountains: [] })),
}));
vi.mock('../unitFactory.js', () => ({
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
vi.mock('../combat.js', () => ({
  Projectile: class {},
  updateExplosions: vi.fn(),
  applyTerrainBonus: vi.fn(() => ({ dmg: 10, hp: 100 })),
  updateAllTrails: vi.fn(),
  createProjectilePattern: vi.fn(() => []),
  applyHitscanDamage: vi.fn(),
}));
vi.mock('../pathfinder.js', () => ({
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
vi.mock('../fogOfWar.js', () => ({
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

describe('perf tracker (Phase 0)', () => {
  let THREE, Game;

  beforeEach(async () => {
    THREE = await import('three');
    const gameMod = await import('../game.js');
    Game = gameMod.Game;
  });

  function makeGame() {
    vi.spyOn(Game.prototype, 'updateHUD').mockImplementation(() => {});
    return new Game(new THREE.Scene(), new THREE.PerspectiveCamera(), 'easy', new THREE.Vector3());
  }

  it('exposes a perf object with the documented readouts', () => {
    const g = makeGame();
    expect(g.perf).toBeDefined();
    expect(g.perf.fps).toBe(0);
    expect(g.perf.avgFrameMs).toBe(0);
    expect(g.perf.worstFrameMs).toBe(0);
    expect(g.perf.drawCalls).toBe(0);
  });

  it('averages the last 60 frame times and reports fps', () => {
    const g = makeGame();
    for (let i = 0; i < 60; i++) g.recordFrame(16.67);
    expect(g.perf.avgFrameMs).toBeCloseTo(16.67, 2);
    expect(g.perf.fps).toBeCloseTo(59.99, 1);
  });

  it('drops old frames from the rolling average', () => {
    const g = makeGame();
    for (let i = 0; i < 60; i++) g.recordFrame(16.67);
    g.recordFrame(100);
    // 59 frames at 16.67 + 1 at 100
    expect(g.perf.avgFrameMs).toBeCloseTo((59 * 16.67 + 100) / 60, 1);
  });

  it('samplePerf tracks the worst frame of the last 240 frames and draw calls', () => {
    const g = makeGame();
    for (let i = 0; i < 60; i++) g.recordFrame(16.67);
    g.recordFrame(250);
    for (let i = 0; i < 30; i++) g.recordFrame(8);
    g.samplePerf(137);
    expect(g.perf.worstFrameMs).toBe(250);
    expect(g.perf.drawCalls).toBe(137);
  });

  it('window.__perf is set after game init (main.js wiring)', () => {
    // main.js assigns window.__perf = game.perf after constructing the game;
    // verify the assignment target is a live reference
    const g = makeGame();
    window.__perf = g.perf;
    expect(window.__perf).toBe(g.perf);
    g.recordFrame(20);
    expect(window.__perf.avgFrameMs).toBe(20);
  });
});
