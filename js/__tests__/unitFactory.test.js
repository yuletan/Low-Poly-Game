import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('three');
vi.mock('three/examples/jsm/geometries/RoundedBoxGeometry.js');

describe('unitFactory.js - Unit Mesh Creation', () => {
  let createUnitMesh;
  let THREE;

  beforeEach(async () => {
    THREE = await import('three');
    const mod = await import('../unitFactory.js?v=3');
    createUnitMesh = mod.createUnitMesh;
  });

  function findMeshWithRotation(group, axis) {
    let result = null;
    group.traverse(child => {
      if (child.isMesh && child.geometry?.type === 'CapsuleGeometry') {
        result = child;
      }
    });
    return result;
  }

  it('buildJet fuselage rotation.x should be PI/2 (Issue 2)', () => {
    const group = createUnitMesh('fighter', 0x9999aa, 'player');
    // The group should contain a capsule mesh with rotation.x = PI/2
    let fuselage = null;
    group.traverse(child => {
      if (child.isMesh && child.geometry?.type === 'CapsuleGeometry') {
        fuselage = child;
      }
    });
    expect(fuselage).not.toBeNull();
    expect(fuselage.rotation.x).toBeCloseTo(Math.PI / 2);
    // Verify it does NOT have rotation.z = PI/2 (old bug)
    expect(fuselage.rotation.z).not.toBeCloseTo(Math.PI / 2);
  });

  it('buildJet should have muzzleOffset with +Z forward (Issue 2)', () => {
    const group = createUnitMesh('fighter', 0x9999aa, 'player');
    expect(group.userData.muzzleOffset).toBeDefined();
    // Muzzle should be in +Z direction (forward)
    expect(group.userData.muzzleOffset.z).toBeGreaterThan(0);
  });

  it('buildEscortJet fuselage rotation.x should be PI/2 (Issue 2)', () => {
    const group = createUnitMesh('escortJet', 0x556677, 'player');
    let fuselage = null;
    group.traverse(child => {
      if (child.isMesh && child.geometry?.type === 'CapsuleGeometry') {
        fuselage = child;
      }
    });
    expect(fuselage).not.toBeNull();
    expect(fuselage.rotation.x).toBeCloseTo(Math.PI / 2);
    expect(fuselage.rotation.z).not.toBeCloseTo(Math.PI / 2);
  });

  it('buildEscortJet should have muzzleOffset (Issue 2)', () => {
    const group = createUnitMesh('escortJet', 0x556677, 'player');
    expect(group.userData.muzzleOffset).toBeDefined();
  });

  it('buildB2 body should be oriented correctly along Z (Issue 2)', () => {
    const group = createUnitMesh('b2', 0x333344, 'player');
    // B2 uses BoxGeometry for body, should be oriented with Z dimension > X dimension
    let bodyBox = null;
    group.traverse(child => {
      if (child.isMesh && child.geometry?.type === 'BoxGeometry' && child.position.y === 0) {
        bodyBox = child;
      }
    });
    // The body should have its largest dimension along Z
    expect(bodyBox).not.toBeNull();
    // Body dimensions should be (2, 0.6, 4) — Z=4 is the longest axis
    expect(bodyBox.geometry.parameters.d).toBeGreaterThan(bodyBox.geometry.parameters.w);
  });

  it('buildB2 should have muzzleOffset forward (Issue 2)', () => {
    const group = createUnitMesh('b2', 0x333344, 'player');
    expect(group.userData.muzzleOffset).toBeDefined();
    expect(group.userData.muzzleOffset.z).toBeGreaterThan(0);
  });

  it('buildEscortBomber fuselage should use rotation.x (Issue 2)', () => {
    const group = createUnitMesh('escortBomber', 0x444455, 'player');
    let fuselage = null;
    group.traverse(child => {
      if (child.isMesh && child.geometry?.type === 'CapsuleGeometry') {
        fuselage = child;
      }
    });
    expect(fuselage).not.toBeNull();
    expect(fuselage.rotation.x).toBeCloseTo(Math.PI / 2);
    expect(fuselage.rotation.z).not.toBeCloseTo(Math.PI / 2);
  });

  it('tank has turret and muzzleOffset', () => {
    const group = createUnitMesh('tank', 0x4a5d23, 'player');
    expect(group.userData.turret).toBeDefined();
    expect(group.userData.muzzleOffset).toBeDefined();
  });

  it('infantry is built without errors', () => {
    const group = createUnitMesh('infantry', 0x556b2f, 'player');
    expect(group.children.length).toBeGreaterThan(0);
  });

  it('transport is built without errors', () => {
    const group = createUnitMesh('transport', 0x8b7355, 'player');
    expect(group.children.length).toBeGreaterThan(0);
    expect(group.userData.bobPhase).toBeDefined();
  });

  it('carrier is built without errors', () => {
    const group = createUnitMesh('carrier', 0x556677, 'player');
    expect(group.children.length).toBeGreaterThan(0);
  });
});
