// Phase 3: instanced rendering layer tests — slot accounting, matrix sync,
// instanceId picking, hit flash, and HP-bar instances.
import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { Game } from '../game.js';

function makeGame() {
  const g = new Game(new THREE.Scene(), new THREE.PerspectiveCamera(), 'easy', new THREE.Vector3());
  g.terrain = { getTerrainAt: () => 'land', mountains: [] };
  g.pathfinder = { cell: 12, worldToGrid: () => ({ gx: 50, gy: 50 }), gridToWorld: () => ({ x: 0, z: 0 }), findNearestWalkable: () => ({ gx: 50, gy: 50 }), findNearestCoast: () => ({ groundTile: { gx: 50, gy: 50 }, seaTile: { gx: 50, gy: 51 } }), findPath: () => [], findTransportPath: () => null, walkable: () => true };
  g.upgrades = { applyTo: s => ({ ...s }) };
  return g;
}

describe('unit instancing layer (Phase 3)', () => {
  it('instances supported types and keeps legacy types on the mesh path', () => {
    const g = makeGame();
    const tank = g.spawn('tank', 'player', { x: 10, z: 10 });
    expect(tank._instanced).toBe(true);
    expect(tank._instSlot).toBe(0);

    const sub = g.spawn('submarine', 'enemy', { x: -10, z: -10 });
    expect(sub._instanced).toBeFalsy();
    expect(sub.mesh.isGroup).toBe(true);
    expect(sub.mesh.children.some(c => c.isMesh && c.geometry)).toBe(true); // legacy body
  });

  it('syncs instance matrices from the logical unit mesh', () => {
    const g = makeGame();
    const tank = g.spawn('tank', 'player', { x: 10, z: 10 });
    tank.mesh.rotation.y = Math.PI / 2;
    g.update(1 / 60);

    const st = g.unitLayer.types.get('tank');
    expect(st.count).toBe(1);
    const body = st.meshes.find(e => e.cls === 'tint' && !e.isTurret);
    expect(body).toBeTruthy();
    const m = new THREE.Matrix4().fromArray(body.mesh.instanceMatrix.array, 0);
    expect(m.elements[12]).toBeCloseTo(10, 4);
    expect(m.elements[14]).toBeCloseTo(10, 4);
    // Yaw of PI/2 faces +X: the local +Z axis (barrel forward) maps to +X.
    expect(m.elements[8]).toBeCloseTo(1, 4); // m31 — x of the Z basis vector
    expect(m.elements[10]).toBeCloseTo(0, 4);
  });

  it('swap-pop removal keeps the remaining unit mapped', () => {
    const g = makeGame();
    const a = g.spawn('tank', 'player', { x: 0, z: 0 });
    const b = g.spawn('tank', 'player', { x: 5, z: 5 });
    const c = g.spawn('tank', 'player', { x: 9, z: 9 });
    expect(a._instSlot).toBe(0);
    expect(b._instSlot).toBe(1);
    expect(c._instSlot).toBe(2);

    g.unitLayer.removeUnit(b);
    const st = g.unitLayer.types.get('tank');
    expect(st.count).toBe(2);
    expect(c._instSlot).toBe(1); // moved into the freed slot
    expect(st.units[0]).toBe(a);
    expect(st.units[1]).toBe(c);
    expect(g.unitLayer._all.length).toBe(2);
  });

  it('hides instances while the logical mesh is invisible', () => {
    const g = makeGame();
    const t = g.spawn('tank', 'player', { x: 1, z: 1 });
    t.mesh.visible = false;
    g.update(1 / 60);
    const st = g.unitLayer.types.get('tank');
    const m = new THREE.Matrix4().fromArray(st.meshes[0].mesh.instanceMatrix.array, 0);
    const s = new THREE.Vector3().setFromMatrixScale(m);
    expect(s.length()).toBeLessThan(0.01);
  });

  it('places the logical turret at the template turret transform', () => {
    const g = makeGame();
    const t = g.spawn('tank', 'player', { x: 0, z: 0 });
    const tpl = g.unitLayer.getTemplate('tank');
    const log = t.mesh.userData.turret;
    expect(log).toBeTruthy();
    t.mesh.updateMatrixWorld(true);
    // unit sits at (0, LAND_HEIGHT + 0.5, 0) with identity rotation, so the
    // turret's world matrix must be T(0, 8.5, 0) × template-local turret — a
    // double offset (template world used as a local transform) would break y.
    const expected = new THREE.Matrix4().makeTranslation(0, 8.5, 0).multiply(tpl.turretLocal);
    for (let i = 0; i < 16; i++) {
      expect(log.matrixWorld.elements[i]).toBeCloseTo(expected.elements[i], 4);
    }
  });

  it('raycasts instanced bodies and maps instanceId back to the unit', () => {
    const g = makeGame();
    const camera = new THREE.PerspectiveCamera();
    camera.position.set(0, 60, 0.001);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld(); // setFromCamera reads camera.matrixWorld
    const tank = g.spawn('tank', 'player', { x: 0, z: 0 });
    tank.mesh.position.set(0, 8.5, 0); // template y (LAND_HEIGHT + 0.5)
    g.update(1 / 60);

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const hits = raycaster.intersectObjects(g.unitLayer.raycastTargets, false);
    expect(hits.length).toBeGreaterThan(0);
    const hit = hits[0];
    expect(hit.instanceId).toBe(tank._instSlot);
    expect(hit.object.userData.unitLayerState.units[hit.instanceId]).toBe(tank);
  });

  it('hit flash flips the tinted instance color and restores it', () => {
    const g = makeGame();
    const t = g.spawn('tank', 'player', { x: 0, z: 0 });
    const st = g.unitLayer.types.get('tank');
    const body = st.meshes.find(e => e.cls === 'tint' && !e.isTurret);
    const before = new THREE.Color().fromArray(body.mesh.instanceColor.array, 0);
    expect(before.getHex()).not.toBe(0xffffff);

    g.unitLayer.setHitFlash(t, true);
    const flashed = new THREE.Color().fromArray(body.mesh.instanceColor.array, 0);
    expect(flashed.getHex()).toBe(0xffffff);

    g.unitLayer.setHitFlash(t, false);
    const after = new THREE.Color().fromArray(body.mesh.instanceColor.array, 0);
    expect(after.getHex()).toBe(before.getHex());
  });

  it('hp bar instances reflect the hp ratio', () => {
    const g = makeGame();
    const t = g.spawn('tank', 'player', { x: 0, z: 0 });
    g.unitLayer.updateHpBar(t, 50, 50, 100, true);
    g.unitLayer.update();

    const slot = t._hpSlot;
    const m = new THREE.Matrix4().fromArray(g.unitLayer.hpFg.instanceMatrix.array, slot * 16);
    // x-scale = barWidth (4) * hpRatio (0.5) = 2.
    expect(m.elements[0]).toBeCloseTo(2, 4);
  });

  it('grows pools past the initial capacity', () => {
    const g = makeGame();
    const tanks = [];
    for (let i = 0; i < 20; i++) tanks.push(g.spawn('tank', 'player', { x: i, z: 0 }));
    const st = g.unitLayer.types.get('tank');
    expect(st.capacity).toBeGreaterThanOrEqual(20);
    expect(st.meshes[0].mesh.count).toBe(20);
    tanks.forEach((t, i) => expect(t._instSlot).toBe(i));
  });
});
