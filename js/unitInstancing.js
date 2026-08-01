// unitInstancing.js — Phase 3: instanced rendering layer for unit bodies.
//
// Each unit keeps its logical `THREE.Group` (position/rotation/visible, used
// by every gameplay call site), while the visible body is drawn from per-type
// THREE.InstancedMesh pools owned by this layer. Every frame the layer syncs
// each unit's matrixWorld into its type's instance matrices, so a 120-unit
// army costs ~4-6 draw calls per active type instead of 10-20 per unit.
//
// Material classes per type:
//   tint   — faction-tinted hull parts; shared neutral material, per-instance
//            color holds the unit's tint (mixColor(typeColor, teamColor, 0.5)).
//   fixed  — dark detail/track parts; their own shared material, white
//            instance color (multiplication by white is the identity).
//   trans  — transparent parts (glass, rotor blades, the crusher shield ring).
//   glow   — emissive parts (exhausts, radar screens, missile tips).
// Trans/glow keep their exact shared materials; when a type has several
// glass/glow colors the class uses the first part's material (micro-scale
// color normalization, see README "Phase 3").
//
// Edge outlines and per-unit chrome (selection rings, HP bar frame) are
// untouched. Units with unique per-unit opacity (submarine stealth) stay on
// the legacy per-unit mesh path.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { createUnitMesh, mixColor } from './unitFactory.js';

const TEAM_COLOR = { player: 0x3366cc, enemy: 0xcc3333 };
const LEGACY_TYPES = new Set(['submarine']);
const INITIAL_CAPACITY = 16;

// Test suites that `vi.mock('three')` end up with some three classes missing
// from the namespace (Matrix4/Quaternion/InstancedMesh come back undefined).
// The layer degrades to a no-op there — units fall back to the legacy mesh
// path — while real builds always run with the full three namespace.
const LAYER_ENABLED =
  typeof THREE.Matrix4 === 'function' &&
  typeof THREE.Quaternion === 'function' &&
  typeof THREE.InstancedMesh === 'function';

// Shared neutral material for the tinted class: the per-instance color holds
// the unit's actual tint, so one material serves every type.
const TINT_MAT = LAYER_ENABLED ? new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.88, metalness: 0.08 }) : null;
const HP_QUAD = LAYER_ENABLED ? new THREE.PlaneGeometry(1, 0.5) : null;
const HP_FG_MAT = LAYER_ENABLED ? new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false }) : null;
const HP_TRAIL_MAT = LAYER_ENABLED ? new THREE.MeshBasicMaterial({ color: 0xffaa88, transparent: true, opacity: 0.6, depthTest: false }) : null;
const HP_FG_COLOR = { player: 0x44ff88, enemy: 0xff4444 };
if (LAYER_ENABLED) {
  HP_FG_MAT.renderOrder = 901;
  HP_TRAIL_MAT.renderOrder = 900;
}

// Scratch objects — nothing allocates in the per-frame sync loop.
const _m = LAYER_ENABLED ? new THREE.Matrix4() : null;
const _m2 = LAYER_ENABLED ? new THREE.Matrix4() : null;
const _q = LAYER_ENABLED ? new THREE.Quaternion() : null;
const _v = LAYER_ENABLED ? new THREE.Vector3() : null;
const _s = LAYER_ENABLED ? new THREE.Vector3() : null;
const _zero = LAYER_ENABLED ? new THREE.Vector3(0, 0, 0) : null;
const _one = LAYER_ENABLED ? new THREE.Vector3(1, 1, 1) : null;
const _white = LAYER_ENABLED ? new THREE.Color(0xffffff) : null;
const _hidden = LAYER_ENABLED ? new THREE.Matrix4().makeScale(0.0001, 0.0001, 0.0001) : null;

function tintFor(unit) {
  return new THREE.Color(mixColor(unit.stats.color, TEAM_COLOR[unit.faction], 0.5));
}

function classifyMaterial(mat) {
  if (!mat) return null;
  if (mat.transparent || mat.opacity < 1) return 'trans';
  if (mat.emissive && mat.emissive.getHex() !== 0 && mat.emissiveIntensity > 0) return 'glow';
  return null; // opaque — tinted vs fixed is decided by the template comparison
}

// Build the per-type template geometry/material partition. Two templates are
// built (one with a white type color, one with black) so tinted parts can be
// recognized exactly: their material is built per color, while fixed parts
// come from the shared material caches and are the same instance in both
// templates. Turret-subtree parts are tagged and their baked matrix is made
// relative to the turret root so the per-frame turret rotation can be applied
// by the instanced turret pool independently of the body.
function buildTemplate(type) {
  const a = createUnitMesh(type, 0xffffff, 'player');
  const b = createUnitMesh(type, 0x000000, 'player');
  a.updateMatrixWorld(true);
  b.updateMatrixWorld(true);

  const turretA = a.userData.turret;
  const turretLocal = turretA ? turretA.matrixWorld.clone() : null;
  const turretInv = new THREE.Matrix4();
  if (turretA) turretInv.copy(turretLocal).invert();

  const parts = [];
  const stackA = [{ node: a, inTurret: false }];
  const stackB = [{ node: b, inTurret: false }];
  while (stackA.length > 0) {
    const { node: na, inTurret } = stackA.pop();
    const nb = stackB.pop().node;
    if (na.isMesh) {
      let cls = classifyMaterial(na.material);
      if (!cls) cls = na.material === nb.material ? 'fixed' : 'tint';
      const matrix = inTurret
        ? turretInv.clone().multiply(na.matrixWorld)
        : na.matrixWorld.clone();
      parts.push({ cls, isTurret: inTurret, matrix, material: na.material, geometry: na.geometry });
    }
    const inT = inTurret || (na === turretA);
    for (let i = na.children.length - 1; i >= 0; i--) {
      stackA.push({ node: na.children[i], inTurret: inT });
      stackB.push({ node: nb.children[i], inTurret: inT });
    }
  }
  return { parts, turretLocal, muzzleOffset: a.userData.muzzleOffset, bobPhase: a.userData.bobPhase };
}

function mergedGeometry(parts) {
  const geos = [];
  for (const p of parts) {
    let g = p.geometry.clone();
    g.applyMatrix4(p.matrix);
    // RoundedBoxGeometry (unit bodies) is built non-indexed while most other
    // primitives are indexed; mergeGeometries requires a uniform layout, so
    // normalize every part to the non-indexed form before merging.
    if (g.index) g = g.toNonIndexed();
    geos.push(g);
  }
  const merged = mergeGeometries(geos, false);
  for (const g of geos) g.dispose();
  if (merged) {
    merged.computeVertexNormals();
    merged.computeBoundingSphere();
  }
  return merged;
}

function makeInstanced(geometry, material, renderOrder, capacity) {
  const im = new THREE.InstancedMesh(geometry, material, capacity);
  im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  im.count = 0;
  im.frustumCulled = false; // instances roam far from the geometry bounds
  im.renderOrder = renderOrder || 0;
  return im;
}

function classMaterial(cls, parts) {
  if (cls === 'tint') return TINT_MAT;
  const p = parts.find(part => part.cls === cls);
  return p ? p.material : null;
}

export class UnitInstanceLayer {
  constructor(scene) {
    this.enabled = LAYER_ENABLED;
    this.scene = scene;
    this.types = new Map(); // type -> state
    this.raycastTargets = [];
    if (!this.enabled) return;

    // Shared instanced HP bars: one InstancedMesh for the fill and one for
    // the damage trail across every unit of every type (2 draw calls total).
    // Slots here are GLOBAL (per unit), unlike the per-type body pools.
    this.hpFg = makeInstanced(HP_QUAD, HP_FG_MAT, 901, INITIAL_CAPACITY);
    this.hpTl = makeInstanced(HP_QUAD, HP_TRAIL_MAT, 900, INITIAL_CAPACITY);
    this._hpCapacity = INITIAL_CAPACITY;
    this._all = []; // unit per global hp slot
    scene.add(this.hpFg);
    scene.add(this.hpTl);
  }

  supports(type) { return this.enabled && !LEGACY_TYPES.has(type); }

  getTemplate(type) {
    if (!this.enabled) return null;
    if (!this._templates) this._templates = new Map();
    if (!this._templates.has(type)) this._templates.set(type, buildTemplate(type));
    return this._templates.get(type);
  }

  _state(type) {
    let st = this.types.get(type);
    if (st) return st;
    const tpl = this.getTemplate(type);
    if (!tpl) return null;
    const byClass = new Map(); // cls -> parts[]
    const turretByClass = new Map();
    for (const p of tpl.parts) {
      const map = p.isTurret ? turretByClass : byClass;
      if (!map.has(p.cls)) map.set(p.cls, []);
      map.get(p.cls).push(p);
    }
    const meshes = [];
    st = { type, meshes, units: [], count: 0, capacity: INITIAL_CAPACITY, turretLocal: tpl.turretLocal };
    const addClass = (cls, parts, isTurret) => {
      if (!parts || parts.length === 0) return;
      const mat = classMaterial(cls, parts);
      if (!mat) return;
      const geo = mergedGeometry(parts);
      const renderOrder = parts.reduce((m, p) => Math.max(m, p.material.renderOrder || 0), 0);
      const im = makeInstanced(geo, mat, renderOrder, INITIAL_CAPACITY);
      im.userData.isUnitLayer = true;
      im.userData.unitLayerState = st;
      im.userData.cls = cls;
      im.userData.isTurret = isTurret;
      this.scene.add(im);
      this.raycastTargets.push(im);
      meshes.push({ mesh: im, cls, isTurret });
    };
    for (const cls of ['tint', 'fixed', 'trans', 'glow']) addClass(cls, byClass.get(cls), false);
    for (const cls of ['tint', 'fixed', 'trans', 'glow']) addClass(cls, turretByClass.get(cls), true);
    this.types.set(type, st);
    return st;
  }

  addUnit(unit) {
    if (!this.enabled || !this.supports(unit.type)) return false;
    const st = this._state(unit.type);
    if (!st) return false;
    const slot = st.count;
    st.units[slot] = unit;
    st.count++;
    for (const entry of st.meshes) entry.mesh.count = st.count;
    if (st.count > st.capacity) this._grow(st);
    unit._instanced = true;
    unit._instSlot = slot;
    this._setColors(st, slot, unit);

    // Global HP slot.
    const hpSlot = this._all.length;
    this._all.push(unit);
    unit._hpSlot = hpSlot;
    this.hpFg.count = this._all.length;
    this.hpTl.count = this._all.length;
    if (this._all.length > this._hpCapacity) this._hpGrow();
    this.hpFg.setColorAt(hpSlot, new THREE.Color(HP_FG_COLOR[unit.faction]));
    this.hpFg.instanceColor.needsUpdate = true;
    return true;
  }

  removeUnit(unit) {
    if (!this.enabled || !unit._instanced) return;
    const st = this.types.get(unit.type);
    const slot = unit._instSlot;
    if (st && slot !== undefined) {
      const last = st.count - 1;
      if (slot !== last) {
        const moved = st.units[last];
        st.units[slot] = moved;
        moved._instSlot = slot;
        this._setColors(st, slot, moved); // keep colors aligned after the swap
        // The moved unit's instance matrix is re-synced on the next update();
        // the freed slot is beyond st.count and no longer rendered.
      }
      st.units[last] = undefined;
      st.count--;
      for (const entry of st.meshes) entry.mesh.count = st.count;
    }
    unit._instSlot = undefined;

    // Global HP slot (swap-pop with the last unit).
    const hpSlot = unit._hpSlot;
    const hpLast = this._all.length - 1;
    if (hpSlot !== hpLast) {
      const moved = this._all[hpLast];
      this._all[hpSlot] = moved;
      moved._hpSlot = hpSlot;
      const src = hpLast * 16;
      const dst = hpSlot * 16;
      this.hpFg.instanceMatrix.array.copyWithin(dst, src, src + 16);
      this.hpTl.instanceMatrix.array.copyWithin(dst, src, src + 16);
      if (this.hpFg.instanceColor) this.hpFg.instanceColor.array.copyWithin(dst, src, src + 3);
      this.hpFg.instanceMatrix.needsUpdate = true;
      this.hpTl.instanceMatrix.needsUpdate = true;
      if (this.hpFg.instanceColor) this.hpFg.instanceColor.needsUpdate = true;
    }
    this._all.pop();
    unit._hpSlot = undefined;
    this.hpFg.count = this._all.length;
    this.hpTl.count = this._all.length;
  }

  _grow(st) {
    const cap = st.capacity * 2;
    for (const entry of st.meshes) {
      const old = entry.mesh;
      const fresh = makeInstanced(old.geometry, old.material, old.renderOrder, cap);
      fresh.userData.isUnitLayer = true;
      fresh.userData.unitLayerState = st;
      fresh.userData.cls = old.userData.cls;
      fresh.userData.isTurret = old.userData.isTurret;
      fresh.count = old.count;
      fresh.instanceMatrix.array.set(old.instanceMatrix.array);
      // instanceColor is lazily created by the first setColorAt call; clone it
      // over when it exists so the grown pool keeps per-instance colors.
      if (old.instanceColor) fresh.instanceColor = old.instanceColor.clone();
      fresh.instanceMatrix.needsUpdate = true;
      if (fresh.instanceColor) fresh.instanceColor.needsUpdate = true;
      this.scene.remove(old); // shared geometry/material are intentionally kept
      this.scene.add(fresh);
      const idx = this.raycastTargets.indexOf(old);
      if (idx >= 0) this.raycastTargets[idx] = fresh;
      entry.mesh = fresh;
    }
    st.capacity = cap;
  }

  _hpGrow() {
    const cap = this._hpCapacity * 2;
    const mk = (old, mat, ro) => {
      const fresh = makeInstanced(HP_QUAD, mat, ro, cap);
      fresh.count = old.count;
      fresh.instanceMatrix.array.set(old.instanceMatrix.array);
      if (old.instanceColor) fresh.instanceColor = old.instanceColor.clone();
      fresh.instanceMatrix.needsUpdate = true;
      if (fresh.instanceColor) fresh.instanceColor.needsUpdate = true;
      this.scene.remove(old);
      this.scene.add(fresh);
      return fresh;
    };
    this.hpFg = mk(this.hpFg, HP_FG_MAT, 901);
    this.hpTl = mk(this.hpTl, HP_TRAIL_MAT, 900);
    this._hpCapacity = cap;
  }

  _setColors(st, slot, unit) {
    const tint = tintFor(unit);
    for (const entry of st.meshes) {
      if (entry.cls === 'tint') entry.mesh.setColorAt(slot, tint);
      else entry.mesh.setColorAt(slot, _white);
      entry.mesh.instanceColor.needsUpdate = true;
    }
  }

  setHitFlash(unit, white) {
    if (!this.enabled || !unit._instanced) return;
    const st = this.types.get(unit.type);
    if (!st) return;
    const slot = unit._instSlot;
    const tint = tintFor(unit);
    for (const entry of st.meshes) {
      entry.mesh.setColorAt(slot, white ? _white : (entry.cls === 'tint' ? tint : _white));
      entry.mesh.instanceColor.needsUpdate = true;
    }
  }

  _syncUnitMatrices(st, unit, i) {
    unit.mesh.updateMatrixWorld(true);
    if (unit.mesh.visible) {
      for (const entry of st.meshes) {
        // Turret parts: the logical turret Object3D is a child of unit.mesh,
        // so its matrixWorld already includes the per-frame aim rotation.
        const m = entry.isTurret ? unit.mesh.userData.turret.matrixWorld : unit.mesh.matrixWorld;
        entry.mesh.setMatrixAt(i, m);
        entry.mesh.instanceMatrix.needsUpdate = true;
      }
    } else {
      for (const entry of st.meshes) {
        entry.mesh.setMatrixAt(i, _hidden);
        entry.mesh.instanceMatrix.needsUpdate = true;
      }
    }
  }

  update() {
    if (!this.enabled) return;
    for (const st of this.types.values()) {
      for (let i = 0; i < st.count; i++) {
        const unit = st.units[i];
        if (!unit) continue;
        this._syncUnitMatrices(st, unit, i);
      }
    }
    for (let i = 0; i < this._all.length; i++) {
      const unit = this._all[i];
      if (unit._hpDirty) {
        unit._hpDirty = false;
        this._writeHpBar(unit, i);
      }
    }
  }

  updateHpBar(unit, displayHp, trailHp, maxHp, visible) {
    if (!this.enabled || !unit._instanced) return;
    unit._hpDisplay = displayHp;
    unit._hpTrail = trailHp;
    unit._hpMax = maxHp;
    unit._hpVisible = visible;
    unit._hpDirty = true;
  }

  _writeHpBar(unit, i) {
    const eff = unit._hpVisible ? 1 : 0.0001;
    const ratio = Math.max(0, unit._hpDisplay / unit._hpMax) * eff;
    const trailRatio = Math.max(0, unit._hpTrail / unit._hpMax) * eff;
    const bw = unit._barWidth;
    const barY = unit._barY;
    // M = unitWorld × T(0, barY, 0) × S(bw,1,1) × T(xOff,0,0) × S(ratio,1,1)
    // where xOff = -(1-ratio)/2 keeps the bar's left edge anchored as it shrinks.
    _q.identity();
    _m.identity();
    _m.multiply(unit.mesh.matrixWorld);
    _v.set(0, barY, 0);
    _m.multiply(_m2.compose(_v, _q, _one));
    _s.set(bw, 1, 1);
    _m.multiply(_m2.compose(_zero, _q, _s));
    _v.set(-(1 - ratio) / 2, 0, 0);
    _s.set(ratio, 1, 1);
    _m.multiply(_m2.compose(_v, _q, _s));
    this.hpFg.setMatrixAt(i, _m);
    this.hpFg.instanceMatrix.needsUpdate = true;
    // Trail: same shape with its own ratio (and its own left anchor).
    _m.identity();
    _m.multiply(unit.mesh.matrixWorld);
    _v.set(0, barY, 0);
    _m.multiply(_m2.compose(_v, _q, _one));
    _s.set(bw, 1, 1);
    _m.multiply(_m2.compose(_zero, _q, _s));
    _v.set(-(1 - trailRatio) / 2, 0, 0);
    _s.set(trailRatio, 1, 1);
    _m.multiply(_m2.compose(_v, _q, _s));
    this.hpTl.setMatrixAt(i, _m);
    this.hpTl.instanceMatrix.needsUpdate = true;
  }
}
