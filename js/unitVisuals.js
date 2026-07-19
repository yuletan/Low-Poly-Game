// unitVisuals.js — shared per-unit visual chrome: HP bars, selection rings,
// range rings, and disposal helpers.
//
// Geometry and the static materials are SHARED across every unit (cached below)
// so spawning a unit does not allocate fresh GPU geometry. Previously each unit
// created its own RingGeometry/CircleGeometry/PlaneGeometry in the constructor,
// which — never being disposed — was a major source of the unbounded
// renderer.info.memory.geometries growth seen in the FPS logs.
//
// Only genuinely per-instance resources are disposed on cleanup:
//   - selection ring/fill MATERIALS (opacity is toggled per-unit)
//   - cloned hit-flash / stealth materials
//   - range ring (radius varies per unit) + path line
import * as THREE from 'three';

const GEO = new Map(); // shared geometries, never disposed
const MAT = new Map(); // shared static materials, never disposed

function geo(key, create) {
  if (!GEO.has(key)) GEO.set(key, create());
  return GEO.get(key);
}
function mat(key, create) {
  if (!MAT.has(key)) MAT.set(key, create());
  return MAT.get(key);
}

const COLOR_PLAYER_HP = 0x44ff88;
const COLOR_ENEMY_HP  = 0xff4444;
const COLOR_PLAYER_RING = 0x00ffff;

// ---------------------------------------------------------------------------
// HP bar
// ---------------------------------------------------------------------------
// Returns { group, fg, trail, barWidth }. Geometry + materials are shared; the
// per-unit state (scale/position/visible) lives on the returned meshes.
export function createHpBar(faction, barWidth, barHeight, barY) {
  const fgColor = faction === 'player' ? COLOR_PLAYER_HP : COLOR_ENEMY_HP;
  const outlineGeo = geo(`hbo:${barWidth}:${barHeight}`, () => new THREE.PlaneGeometry(barWidth + 0.15, barHeight + 0.15));
  const barGeo     = geo(`hpb:${barWidth}:${barHeight}`, () => new THREE.PlaneGeometry(barWidth, barHeight));
  const outlineMat = mat('hbo',   () => new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.9, depthTest: false }));
  const bgMat      = mat('hpbg',  () => new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.9, depthTest: false }));
  const fgMat      = mat(`hpfg:${fgColor}`, () => new THREE.MeshBasicMaterial({ color: fgColor, depthTest: false }));
  const trailMat   = mat('hptrail', () => new THREE.MeshBasicMaterial({ color: 0xffaa88, transparent: true, opacity: 0.6, depthTest: false }));

  const outlineBar = new THREE.Mesh(outlineGeo, outlineMat);
  outlineBar.rotation.x = -Math.PI / 2;
  outlineBar.position.y = -0.01;
  outlineBar.renderOrder = 899;

  const bgBar = new THREE.Mesh(barGeo, bgMat);
  bgBar.rotation.x = -Math.PI / 2;
  bgBar.position.y = 0;
  bgBar.renderOrder = 900;

  const fgBar = new THREE.Mesh(barGeo, fgMat);
  fgBar.renderOrder = 901;

  const trailBar = new THREE.Mesh(barGeo, trailMat);
  trailBar.renderOrder = 900;

  const group = new THREE.Group();
  group.add(outlineBar, bgBar, fgBar, trailBar);
  group.position.set(0, barY, 0);
  return { group, fg: fgBar, trail: trailBar, barWidth };
}

// Update an HP bar's scales/positions and visibility.
export function updateHpBar(bar, displayHp, trailHp, maxHp, visible) {
  const hpRatio = Math.max(0, displayHp / maxHp);
  const trailRatio = Math.max(0, trailHp / maxHp);
  bar.fg.scale.x = hpRatio;
  bar.fg.position.x = -(bar.barWidth / 2) * (1 - hpRatio);
  bar.trail.scale.x = trailRatio;
  bar.trail.position.x = -(bar.barWidth / 2) * (1 - trailRatio);
  bar.fg.parent.visible = visible;
}

// ---------------------------------------------------------------------------
// Selection ring + fill
// ---------------------------------------------------------------------------
// Geometry is shared; materials are per-unit because opacity is toggled on
// select/deselect. Caller adds the returned meshes to the unit mesh.
export function createSelectionRing(faction) {
  const color = faction === 'player' ? COLOR_PLAYER_RING : COLOR_ENEMY_HP;
  const ringGeo = geo('selring', () => new THREE.RingGeometry(3, 4, 16));
  const fillGeo = geo('selfill', () => new THREE.CircleGeometry(3, 16));

  const ringMat = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: 0 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.1;

  const fillMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
  const fill = new THREE.Mesh(fillGeo, fillMat);
  fill.rotation.x = -Math.PI / 2;
  fill.position.y = 0.05;

  return { ring, fill };
}

// ---------------------------------------------------------------------------
// Range ring (per-unit radius — geometry is NOT shared)
// ---------------------------------------------------------------------------
export function buildRangeRing(range, faction) {
  const points = [];
  const segs = 48;
  for (let i = 0; i <= segs; i++) {
    const a = (i / segs) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * range, 0, Math.sin(a) * range));
  }
  const geom = new THREE.BufferGeometry().setFromPoints(points);
  const matl = new THREE.LineBasicMaterial({
    color: faction === 'player' ? 0x4488ff : 0xff4444,
    transparent: true, opacity: 0.4, depthTest: false
  });
  const ring = new THREE.LineLoop(geom, matl);
  ring.position.y = 0.3;
  ring.renderOrder = 895;
  ring.visible = false;
  return ring;
}

// ---------------------------------------------------------------------------
// Disposal of per-instance visual resources.
// Shared geometries/materials are intentionally left intact. The unit mesh's
// base geometry/edge outlines/materials come from unitFactory caches and are
// likewise shared — they are NOT disposed here.
// ---------------------------------------------------------------------------
export function disposeUnitVisuals(unit) {
  // Selection ring/fill materials (per-unit); their geometry is shared.
  if (unit.ring) unit.ring.material.dispose();
  if (unit._ringFill) unit._ringFill.material.dispose();

  // Cloned hit-flash / stealth materials tracked by the unit.
  if (unit._clonedMats) {
    for (let i = 0; i < unit._clonedMats.length; i++) unit._clonedMats[i].dispose();
    unit._clonedMats = null;
  }

  // Range ring (per-unit radius).
  if (unit._rangeRing) {
    unit._rangeRing.geometry.dispose();
    unit._rangeRing.material.dispose();
    unit._rangeRing = null;
  }
}
