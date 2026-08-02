// unitFactory.js — realistic unit builds, quality-tier aware.
//
// Realism levers: painted-steel PBR (clearcoat on High+), rubber/gunmetal/
// canvas sub-materials, vertex-color grime that pools at hull bottoms,
// layered silhouettes (fenders, skirts, bustles, mantlets), and a gated
// detail kit — wheels/hatches/headlights at detail 1, rivets/antennas/nav
// lights at detail 2. Every knob reads getQuality() at build time, so the
// instancing layer's white/black template comparison still classifies tint
// vs fixed parts exactly as before.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { getQuality } from './quality.js';

// --- Shared caches (keyed by tier — never leak across quality changes) ---
const MAT_CACHE = new Map();
const GEO_CACHE = new Map();
function cached(map, key, create) {
  if (!map.has(key)) map.set(key, create());
  return map.get(key);
}
export function resetFactoryCaches() {
  for (const g of GEO_CACHE.values()) g.dispose?.();
  for (const m of MAT_CACHE.values()) m.dispose?.();
  GEO_CACHE.clear(); MAT_CACHE.clear();
  EDGE_GEO_CACHE.clear(); SOURCE_GEO_CACHE.clear();
}
const dl = () => getQuality().detailLevel;

// --- Geometry helpers (tier-scaled, weathering-seeded) ---
// seedWeather gives every cached geometry a neutral white attitude so
// vertexColors materials can be mixed freely; weather() then biases the
// gradient dark toward the bottom so dust/mud reads on hulls.
function seedWeather(g) {
  if (!getQuality().weathering) return g;
  const n = g.attributes.position.count;
  g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3).fill(1), 3));
  return g;
}
function weather(geometry, strength = 0.32) {
  if (!getQuality().weathering || !geometry?.attributes?.color) return geometry;
  geometry.computeBoundingBox();
  const { min, max } = geometry.boundingBox;
  const pos = geometry.attributes.position;
  const arr = geometry.attributes.color.array;
  const span = Math.max(0.001, max.y - min.y);
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getY(i) - min.y) / span;
    arr[i * 3] = arr[i * 3 + 1] = arr[i * 3 + 2] = 1 - strength * (1 - t) * (1 - t);
  }
  geometry.attributes.color.needsUpdate = true;
  return geometry;
}
function boxGeo(w, h, d, r = 0.06) {
  const q = getQuality();
  if (!q.rounded) return cached(GEO_CACHE, `bx:${q.id}:${w}:${h}:${d}`, () => seedWeather(new THREE.BoxGeometry(w, h, d)));
  const radius = Math.min(r, w * 0.2, h * 0.2, d * 0.2);
  return cached(GEO_CACHE, `rb:${q.id}:${w}:${h}:${d}:${radius}`, () => seedWeather(new RoundedBoxGeometry(w, h, d, 2, radius)));
}
function cylGeo(r1, r2, h, seg = 12) {
  const q = getQuality();
  const s = Math.max(5, Math.round(seg * q.segScale));
  return cached(GEO_CACHE, `cy:${q.id}:${r1}:${r2}:${h}:${s}`, () => seedWeather(new THREE.CylinderGeometry(r1, r2, h, s)));
}
function sphereGeo(r, w = 12, h = 12) {
  const q = getQuality();
  const sw = Math.max(4, Math.round(w * q.segScale));
  const sh = Math.max(3, Math.round(h * q.segScale));
  return cached(GEO_CACHE, `sp:${q.id}:${r}:${sw}:${sh}`, () => seedWeather(new THREE.SphereGeometry(r, sw, sh)));
}
function domeGeo(r, w = 12, h = 8) {
  const q = getQuality();
  const sw = Math.max(4, Math.round(w * q.segScale));
  const sh = Math.max(3, Math.round(h * q.segScale));
  return cached(GEO_CACHE, `dm:${q.id}:${r}:${sw}:${sh}`, () => seedWeather(new THREE.SphereGeometry(r, sw, sh, 0, Math.PI * 2, 0, Math.PI / 2)));
}
function capsuleGeo(r, l, rs = 10) {
  const q = getQuality();
  const s = Math.max(6, Math.round(rs * q.segScale));
  return cached(GEO_CACHE, `cp:${q.id}:${r}:${l}:${s}`, () => seedWeather(new THREE.CapsuleGeometry(r, l, 4, s)));
}
function coneGeo(r, h, seg = 8) {
  const q = getQuality();
  const s = Math.max(4, Math.round(seg * q.segScale));
  return cached(GEO_CACHE, `cn:${q.id}:${r}:${h}:${s}`, () => seedWeather(new THREE.ConeGeometry(r, h, s)));
}
function ringGeo(r1, r2, seg = 24) {
  const q = getQuality();
  const s = Math.max(8, Math.round(seg * q.segScale));
  return cached(GEO_CACHE, `rg:${q.id}:${r1}:${r2}:${s}`, () => seedWeather(new THREE.RingGeometry(r1, r2, s)));
}

// --- Materials (tier-aware) ---
function mkMat(prefix, args, create) {
  return cached(MAT_CACHE, `${getQuality().id}|${prefix}:${args.join(':')}`, create);
}
export function mixColor(a, b, t) {
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);
  return ca.lerp(cb, t).getHex();
}
// Hull paint — the per-type "tint" class. Painted armor is mostly dielectric:
// low metalness, mid roughness; clearcoat on High+ gives the waxed sheen.
function matteMat(color) {
  const q = getQuality();
  return mkMat('hull', [color], () => {
    if (q.materialTier === 'lambert') return new THREE.MeshLambertMaterial({ color });
    const base = { color, envMapIntensity: q.envIntensity };
    if (q.weathering) base.vertexColors = true;
    if (q.clearcoat) return new THREE.MeshPhysicalMaterial({ ...base, roughness: 0.58, metalness: 0.3, clearcoat: 0.4, clearcoatRoughness: 0.55 });
    return new THREE.MeshStandardMaterial({ ...base, roughness: 0.66, metalness: 0.22 });
  });
}
function metalMat(color, roughness = 0.45, metalness = 0.75) {
  const q = getQuality();
  return mkMat('metal', [color, roughness, metalness], () => {
    if (q.materialTier === 'lambert') return new THREE.MeshLambertMaterial({ color });
    return new THREE.MeshStandardMaterial({ color, roughness, metalness, envMapIntensity: q.envIntensity });
  });
}
function rubberMat() {
  return mkMat('rubber', [], () => getQuality().materialTier === 'lambert'
    ? new THREE.MeshLambertMaterial({ color: 0x141414 })
    : new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.96, metalness: 0.02 }));
}
function gunmetalMat() { return metalMat(0x2b3038, 0.34, 0.9); }
function canvasMat(color = 0x49513f) {
  return mkMat('canvas', [color], () => getQuality().materialTier === 'lambert'
    ? new THREE.MeshLambertMaterial({ color })
    : new THREE.MeshStandardMaterial({ color, roughness: 0.94, metalness: 0.02, envMapIntensity: getQuality().envIntensity * 0.4 }));
}
function trackMat() {
  return mkMat('track', [], () => getQuality().materialTier === 'lambert'
    ? new THREE.MeshLambertMaterial({ color: 0x1b1b19 })
    : new THREE.MeshStandardMaterial({ color: 0x1b1b19, roughness: 0.9, metalness: 0.28 }));
}
function glassMat(color = 0x112233) {
  const q = getQuality();
  return mkMat('glass', [color], () => {
    if (q.glassTier === 'physical') return new THREE.MeshPhysicalMaterial({
      color, roughness: 0.06, metalness: 0, transparent: true, opacity: 0.55,
      transmission: 0.35, thickness: 0.2, emissive: color,
      emissiveIntensity: q.emissives ? 0.2 : 0, depthWrite: false, envMapIntensity: q.envIntensity });
    if (q.glassTier === 'standard') return new THREE.MeshStandardMaterial({
      color, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.6,
      emissive: color, emissiveIntensity: q.emissives ? 0.25 : 0, depthWrite: false });
    return new THREE.MeshLambertMaterial({
      color, transparent: true, opacity: 0.55,
      emissive: color, emissiveIntensity: q.emissives ? 0.2 : 0, depthWrite: false });
  });
}
function glowMat(color, intensity = 1.5) {
  const q = getQuality();
  return mkMat('glow', [color, intensity], () => {
    if (!q.emissives) return new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.2 });
    if (q.materialTier === 'lambert') return new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: intensity * 0.7 });
    return new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.45, metalness: 0.35 });
  });
}
function lightMat(color) {
  const q = getQuality();
  return mkMat('light', [color], () => q.emissives
    ? new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.8, roughness: 0.3 })
    : new THREE.MeshStandardMaterial({ color: 0x8a8a8a, roughness: 0.4 }));
}

// --- Shadow + mesh plumbing ---
// `key` marks primary casters (hull, turret) — the only shadows on Low/Medium.
function enableShadows(obj, key = false) {
  const q = getQuality();
  if (key) obj.userData.keyCaster = true;
  obj.castShadow = q.shadowCasters === 'all' || (q.shadowCasters === 'key' && key);
  obj.receiveShadow = q.shadows !== 'off';
  return obj;
}
function mesh(geometry, material, position, rotation, key = false) {
  const m = enableShadows(new THREE.Mesh(geometry, material), key);
  if (position) m.position.set(position[0], position[1], position[2]);
  if (rotation) m.rotation.set(rotation[0], rotation[1], rotation[2]);
  return m;
}

// --- Tune kit (unlocked by detailLevel) ---
function roadWheel(g, x, y, z, r = 0.45, w = 0.9) {
  if (dl() === 0) {
    const s = new THREE.Mesh(cylGeo(r, r, w, 10), trackMat());
    s.rotation.z = Math.PI / 2; s.position.set(x, y, z); g.add(s); return;
  }
  const tire = new THREE.Mesh(cylGeo(r, r, w * 0.8, 12), rubberMat());
  const rim = new THREE.Mesh(cylGeo(r * 0.62, r * 0.62, w * 0.9, 10), metalMat(0x3a3f36, 0.55, 0.6));
  const hub = new THREE.Mesh(cylGeo(r * 0.22, r * 0.22, w * 0.98, 6), gunmetalMat());
  for (const m of [tire, rim, hub]) { m.rotation.z = Math.PI / 2; m.position.set(x, y, z); g.add(m); }
}
function hatch(parent, x, y, z, r = 0.35) {
  if (dl() < 1) return;
  const lid = new THREE.Mesh(cylGeo(r, r, 0.08, 10), metalMat(0x2f332c, 0.6, 0.4));
  lid.position.set(x, y, z);
  const handle = new THREE.Mesh(boxGeo(r * 0.9, 0.05, 0.05, 0.02), gunmetalMat());
  handle.position.set(x, y + 0.07, z);
  parent.add(lid, handle);
}
function antenna(parent, x, y, z, h = 2) {
  if (dl() < 1) return;
  const a = new THREE.Mesh(cylGeo(0.02, 0.035, h, 3), metalMat(0x30342e, 0.6, 0.5));
  a.position.set(x, y + h / 2, z);
  parent.add(a);
  if (dl() >= 2) {
    const tip = new THREE.Mesh(sphereGeo(0.05, 6, 5), metalMat(0x1c1f1a, 0.5, 0.5));
    tip.position.set(x, y + h, z); parent.add(tip);
  }
}
function headlights(g, y, z, xs = [-1.2, 1.2]) {
  if (dl() < 1) return;
  for (const x of xs) {
    const housing = new THREE.Mesh(cylGeo(0.13, 0.15, 0.1, 8), metalMat(0x26291f, 0.6, 0.5));
    housing.rotation.x = Math.PI / 2; housing.position.set(x, y, z);
    const lens = new THREE.Mesh(cylGeo(0.1, 0.1, 0.05, 8), lightMat(0xffeebb));
    lens.rotation.x = Math.PI / 2; lens.position.set(x, y, z + 0.06);
    g.add(housing, lens);
  }
}
function exhaustPipe(parent, x, y, z, r = 0.11, len = 0.5, vertical = true) {
  if (dl() < 1) return;
  const pipe = new THREE.Mesh(cylGeo(r, r * 1.15, len, 8), metalMat(0x3a3d40, 0.5, 0.8));
  pipe.position.set(x, y, z); if (!vertical) pipe.rotation.x = Math.PI / 2;
  const soot = new THREE.Mesh(cylGeo(r * 0.8, r * 0.8, 0.06, 8), metalMat(0x15161a, 0.9, 0.2));
  soot.position.copy(pipe.position);
  if (vertical) soot.position.y += len / 2; else soot.position.z -= len / 2;
  if (!vertical) soot.rotation.x = Math.PI / 2;
  parent.add(pipe, soot);
}
function rivets(parent, pts, r = 0.05) {
  if (dl() < 2) return;
  const geo = cylGeo(r, r, 0.05, 5);
  const mat = metalMat(0x20241f, 0.5, 0.7);
  for (const p of pts) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(p[0], p[1], p[2]);
    if (p[3]) m.rotation.x = p[3];
    if (p[4]) m.rotation.z = p[4];
    parent.add(m);
  }
}
function stowage(parent, x, y, z, w = 1.8, h = 0.6, d = 0.9) {
  if (dl() < 1) return;
  parent.add(mesh(boxGeo(w, h, d, 0.06), canvasMat(), [x, y, z]));
}
function fuelDrum(parent, x, y, z) {
  if (dl() < 2) return;
  const drum = new THREE.Mesh(cylGeo(0.35, 0.35, 0.9, 10), metalMat(0x3d4437, 0.7, 0.3));
  drum.rotation.x = Math.PI / 2; drum.position.set(x, y, z);
  parent.add(drum);
}
function navLights(g, port, starboard, stern) {
  if (dl() < 2 || !getQuality().emissives) return;
  const mk = (p, c) => {
    const m = new THREE.Mesh(boxGeo(0.14, 0.14, 0.14, 0.02), lightMat(c));
    m.position.set(p[0], p[1], p[2]); m.userData.noShadow = true; g.add(m);
  };
  mk(port, 0xff2222); mk(starboard, 0x22ff44);
  if (stern) mk(stern, 0xeeeeff);
}

// --- Edge outlines ---
const EDGE_MAT = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22, depthTest: true });
const EDGE_GEO_CACHE = new Map();
const SOURCE_GEO_CACHE = new Map();
function sharedSourceGeometry(geometry) {
  if (!geometry?.parameters) return geometry;
  let signature;
  try { signature = `${getQuality().id}:${geometry.type}:${JSON.stringify(geometry.parameters)}`; }
  catch { return geometry; }
  const cachedGeometry = SOURCE_GEO_CACHE.get(signature);
  if (cachedGeometry && cachedGeometry !== geometry) { geometry.dispose(); return cachedGeometry; }
  SOURCE_GEO_CACHE.set(signature, geometry);
  return geometry;
}
function edgeGeoFor(geometry) {
  let eg = EDGE_GEO_CACHE.get(geometry);
  if (!eg) { eg = new THREE.EdgesGeometry(geometry, 35); EDGE_GEO_CACHE.set(geometry, eg); }
  return eg;
}
function finishModel(group, { outlines = true } = {}) {
  const q = getQuality();
  const wantEdges = outlines && q.outlines;
  const meshes = [];
  group.traverse((obj) => {
    if (!obj.isMesh) return;
    enableShadows(obj, obj.userData.keyCaster === true);
    if (obj.geometry) {
      obj.geometry = sharedSourceGeometry(obj.geometry);
      if (!obj.geometry.attributes?.normal) obj.geometry.computeVertexNormals?.();
      obj.geometry.computeBoundingSphere?.();
    }
    if (!obj.material?.transparent && wantEdges) meshes.push(obj);
  });
  for (const obj of meshes) {
    const edges = new THREE.LineSegments(edgeGeoFor(obj.geometry), EDGE_MAT);
    edges.userData.noShadow = true;
    edges.userData.isEdgeOutline = true;
    edges.renderOrder = 2;
    obj.add(edges);
  }
  return group;
}

const UNIT_BUILDERS = {
  infantry: buildInfantry, tank: buildTank, heavyTank: buildHeavyTank,
  crusher: buildCrusher, artillery: buildArtillery, missileDefense: buildMissileDefense,
  coastal: buildCoastal, mlrs: buildMLRS, healer: buildHealer, medHeli: buildMedHeli,
  frigate: buildFrigate, cruiser: buildCruiser, submarine: buildSubmarine,
  carrier: buildCarrier, transport: buildTransport, heli: buildHeli, gunship: buildGunship,
  escortJet: buildEscortJet, b2: buildB2, escortBomber: buildEscortBomber,
  minigunnerVehicle: buildMinigunnerVehicle, megaMedic: buildMegaMedic, minigunner: buildMinigunner,
  destroyer: (g, c) => buildShip(g, c, 1.0),
  battleship: (g, c) => buildShip(g, c, 1.6),
  fighter: (g, c) => buildJet(g, c, 1.0),
  bomber: (g, c) => buildJet(g, c, 1.4)
};

/** Returns a THREE.Group representing the unit. */
export function createUnitMesh(type, color, faction) {
  const teamColor = faction === 'player' ? 0x3366cc : 0xcc3333;
  const tint = mixColor(color, teamColor, 0.5);
  const g = new THREE.Group();
  g.userData.turret = null;
  g.userData.muzzleOffset = null;
  const builder = UNIT_BUILDERS[type];
  const unit = builder ? builder(g, tint) : g;
  return finishModel(unit);
}

// ---------- LAND ----------
function buildInfantry(g, color) {
  const uniform = matteMat(color);
  const vest = matteMat(mixColor(color, 0x1a1d16, 0.55));
  const kit = metalMat(0x2c2f26, 0.7, 0.3);
  const skin = matteMat(0xc9a184);
  const legG = boxGeo(0.28, 0.9, 0.28, 0.05);
  for (const sx of [-0.2, 0.2]) {
    g.add(mesh(legG, uniform, [sx, 0.55, 0]));
    g.add(mesh(boxGeo(0.3, 0.28, 0.42, 0.04), rubberMat(), [sx, 0.14, 0.05]));
    if (dl() >= 1) g.add(mesh(boxGeo(0.24, 0.22, 0.12, 0.04), kit, [sx, 0.62, 0.17]));
  }
  const torso = mesh(boxGeo(0.78, 1.05, 0.44, 0.06), uniform, [0, 1.52, 0], null, true);
  const vestM = mesh(boxGeo(0.84, 0.78, 0.5, 0.05), vest, [0, 1.62, 0]);
  const pack = mesh(boxGeo(0.6, 0.7, 0.28, 0.05), vest, [0, 1.6, -0.34]);
  g.add(torso, vestM, pack);
  if (dl() >= 1) {
    g.add(mesh(boxGeo(0.2, 0.24, 0.1, 0.03), kit, [0.22, 1.42, 0.26]));
    g.add(mesh(boxGeo(0.2, 0.24, 0.1, 0.03), kit, [-0.22, 1.42, 0.26]));
  }
  const armG = boxGeo(0.22, 0.9, 0.22, 0.05);
  g.add(mesh(armG, uniform, [-0.53, 1.45, 0.05], [0.15, 0, 0.08]));
  g.add(mesh(armG, uniform, [0.53, 1.45, 0.18], [-0.55, 0, -0.08]));
  g.add(mesh(boxGeo(0.18, 0.2, 0.18, 0.04), kit, [-0.55, 0.98, 0.12]));
  g.add(mesh(boxGeo(0.18, 0.2, 0.18, 0.04), kit, [0.5, 1.02, 0.5]));
  g.add(mesh(sphereGeo(0.24, 10, 8), skin, [0, 2.24, 0]));
  g.add(mesh(domeGeo(0.3, 10, 6), vest, [0, 2.26, 0]));
  if (dl() >= 1) g.add(mesh(cylGeo(0.31, 0.33, 0.06, 10), vest, [0, 2.26, 0]));
  const rifle = new THREE.Group();
  rifle.add(mesh(boxGeo(0.09, 0.14, 0.7, 0.02), gunmetalMat(), [0, 0, 0]));
  rifle.add(mesh(cylGeo(0.025, 0.025, 0.5, 6), gunmetalMat(), [0, 0.02, 0.55], [Math.PI / 2, 0, 0]));
  rifle.add(mesh(boxGeo(0.07, 0.28, 0.12, 0.02), kit, [0, -0.18, 0.05], [0.35, 0, 0]));
  rifle.add(mesh(boxGeo(0.08, 0.16, 0.3, 0.02), kit, [0, -0.03, -0.45]));
  rifle.position.set(0.5, 1.28, 0.55);
  rifle.rotation.x = -0.25;
  g.add(rifle);
  if (dl() >= 2) g.add(mesh(boxGeo(0.36, 0.09, 0.08, 0.02), glassMat(0x223322), [0, 2.22, 0.24]));
  return g;
}

function buildTank(g, color) {
  const hull = matteMat(color);
  const steel = metalMat(0x33383b, 0.55, 0.65);
  const lower = mesh(boxGeo(4.5, 1, 7, 0.12), hull, [0, 0.8, 0], null, true);
  const upper = mesh(boxGeo(4, 0.8, 5, 0.1), hull, [0, 1.7, -0.5], null, true);
  const glacis = mesh(boxGeo(4, 1, 2, 0.1), hull, [0, 1.5, 3], [-0.4, 0, 0], true);
  weather(lower.geometry); weather(upper.geometry); weather(glacis.geometry);
  g.add(lower, upper, glacis);
  headlights(g, 1.55, 3.55, [-1.3, 1.3]);
  stowage(g, 0, 1.95, -3.1);
  if (dl() >= 2) { g.add(fuelDrum(g, -1.2, 1.85, -3.2)); g.add(fuelDrum(g, 1.2, 1.85, -3.2)); }
  const trackG = boxGeo(0.8, 1.2, 7.5, 0.08);
  const tL = mesh(trackG, trackMat(), [-2.4, 0.6, 0]); weather(tL.geometry, 0.45);
  g.add(tL, mesh(trackG, trackMat(), [2.4, 0.6, 0]));
  const fenderG = boxGeo(1, 0.08, 7.6, 0.03);
  g.add(mesh(fenderG, hull, [-2.4, 1.28, 0]), mesh(fenderG, hull, [2.4, 1.28, 0]));
  for (let i = -3; i <= 3; i++) { roadWheel(g, -2.8, 0.45, i * 1.1); roadWheel(g, 2.8, 0.45, i * 1.1); }
  for (const z of [-3.7, 3.7]) { roadWheel(g, -2.8, 0.5, z, 0.5, 0.9); roadWheel(g, 2.8, 0.5, z, 0.5, 0.9); }
  if (dl() >= 1) for (const z of [-2.2, 0, 2.2]) { roadWheel(g, -2.7, 1.15, z, 0.18, 0.7); roadWheel(g, 2.7, 1.15, z, 0.18, 0.7); }
  const turret = new THREE.Group();
  const tBase = mesh(boxGeo(3, 1, 3.5, 0.1), hull, [0, 2.4, 0], null, true); weather(tBase.geometry);
  const tFront = mesh(boxGeo(3, 1, 1.5, 0.1), hull, [0, 2.4, 2], [-0.3, 0, 0], true);
  const bustle = mesh(boxGeo(2.4, 0.7, 1.1, 0.08), hull, [0, 2.4, -2.3]);
  turret.add(tBase, tFront, bustle);
  hatch(turret, -0.8, 2.95, -0.5, 0.4);
  if (dl() >= 1) {
    const mg = mesh(cylGeo(0.04, 0.04, 1.2, 6), gunmetalMat(), [-0.8, 3.3, 0.1], [Math.PI / 2, 0, 0]);
    turret.add(mg);
    turret.add(mesh(boxGeo(0.16, 0.14, 0.3, 0.02), steel, [-0.8, 3.22, -0.35]));
  }
  const barrel = mesh(cylGeo(0.2, 0.2, 5, 20), gunmetalMat(), [0, 2.5, 3.5], [Math.PI / 2, 0, 0]);
  const mantlet = mesh(boxGeo(1.3, 1.3, 0.5, 0.06), canvasMat(mixColor(color, 0x2c2f28, 0.5)), [0, 2.5, 3.0]);
  const fume = mesh(cylGeo(0.3, 0.3, 0.6, 12), steel, [0, 2.5, 4.5], [Math.PI / 2, 0, 0]);
  const muzzle = mesh(cylGeo(0.28, 0.28, 0.35, 12), gunmetalMat(), [0, 2.5, 5.9], [Math.PI / 2, 0, 0]);
  turret.add(barrel, mantlet, fume, muzzle);
  if (dl() >= 1) for (let i = 0; i < 3; i++) turret.add(mesh(boxGeo(0.4, 0.4, 0.1, 0.02), steel, [-1 + i, 2.4, 2.8], [-0.3, 0, 0]));
  antenna(turret, 1, 2.9, -1.4, 2);
  rivets(turret, [[-1.4, 2.5, 2.1], [1.4, 2.5, 2.1], [-1.4, 2.5, -2.2], [1.4, 2.5, -2.2]]);
  g.add(turret);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 2.5, 6);
  return g;
}

function buildHeavyTank(g, color) {
  const hull = matteMat(color);
  const steel = metalMat(0x33383b, 0.55, 0.65);
  const lower = mesh(boxGeo(6, 1.4, 9, 0.15), hull, [0, 1, 0], null, true);
  const upper = mesh(boxGeo(5.5, 1, 7, 0.12), hull, [0, 2.2, -0.5], null, true);
  const glacis = mesh(boxGeo(5.5, 1.4, 2.5, 0.12), hull, [0, 2, 4], [-0.35, 0, 0], true);
  weather(lower.geometry); weather(upper.geometry); weather(glacis.geometry);
  g.add(lower, upper, glacis);
  headlights(g, 2.1, 4.6, [-1.8, 1.8]);
  const skirt = mesh(boxGeo(0.3, 1.5, 8, 0.05), metalMat(0x444444, 0.6, 0.3), [-3.2, 1, 0]);
  g.add(skirt, mesh(boxGeo(0.3, 1.5, 8, 0.05), metalMat(0x444444, 0.6, 0.3), [3.2, 1, 0]));
  if (dl() >= 2) for (const sx of [-3.2, 3.2]) for (const z of [-2.6, 0, 2.6])
    g.add(mesh(boxGeo(0.32, 0.5, 1.4, 0.03), rubberMat(), [sx, 0.15, z]));
  stowage(g, 0, 2.7, -3.8, 2.4, 0.7, 1.1);
  const trackG = boxGeo(1, 1.5, 9.5, 0.1);
  const tL = mesh(trackG, trackMat(), [-2.8, 0.7, 0]); weather(tL.geometry, 0.45);
  g.add(tL, mesh(trackG, trackMat(), [2.8, 0.7, 0]));
  for (let i = -4; i <= 4; i++) { roadWheel(g, -3.15, 0.55, i * 1.1, 0.55, 1.1); roadWheel(g, 3.15, 0.55, i * 1.1, 0.55, 1.1); }
  for (const z of [-4.4, 4.4]) { roadWheel(g, -3.15, 0.6, z, 0.6, 1.1); roadWheel(g, 3.15, 0.6, z, 0.6, 1.1); }
  if (dl() >= 1) for (const z of [-3, 0, 3]) { roadWheel(g, -3.05, 1.45, z, 0.2, 0.9); roadWheel(g, 3.05, 1.45, z, 0.2, 0.9); }
  const turret = new THREE.Group();
  const tBase = mesh(boxGeo(4, 1.2, 4.5, 0.12), hull, [0, 3.1, 0], null, true); weather(tBase.geometry);
  const tFront = mesh(boxGeo(4, 1.2, 2, 0.1), hull, [0, 3.1, 2.5], [-0.25, 0, 0], true);
  const bustle = mesh(boxGeo(3.4, 1, 1.4, 0.1), hull, [0, 3.1, -2.9]);
  turret.add(tBase, tFront, bustle);
  hatch(turret, -1, 3.75, -1, 0.5);
  hatch(turret, 1, 3.72, -0.5, 0.4);
  if (dl() >= 1) turret.add(mesh(cylGeo(0.05, 0.05, 1.4, 6), gunmetalMat(), [-1, 4.1, 0], [Math.PI / 2, 0, 0]));
  const barrel = mesh(cylGeo(0.35, 0.35, 6, 20), gunmetalMat(), [0, 3.2, 5.5], [Math.PI / 2, 0, 0]);
  const mantlet = mesh(boxGeo(1.9, 1.7, 0.6, 0.08), steel, [0, 3.2, 4.3]);
  const muzzle = mesh(cylGeo(0.5, 0.5, 0.8, 14), gunmetalMat(), [0, 3.2, 8.5], [Math.PI / 2, 0, 0]);
  turret.add(barrel, mantlet, muzzle);
  if (dl() >= 1) {
    for (let i = 0; i < 4; i++) turret.add(mesh(boxGeo(0.5, 0.5, 0.15, 0.03), steel, [-1.5 + i, 3.1, 2.2], [-0.25, 0, 0]));
    turret.add(mesh(cylGeo(0.25, 0.25, 0.3, 10), glassMat(0xff4400), [-1.8, 3.5, 2.5], [Math.PI / 2, 0, 0]));
  }
  antenna(turret, 1.5, 3.7, -1.5, 2.5);
  rivets(turret, [[-1.9, 3.3, 2.6], [1.9, 3.3, 2.6], [-1.9, 3.3, -2.8], [1.9, 3.3, -2.8], [0, 3.8, -2.9]]);
  g.add(turret);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 3.2, 9);
  return g;
}

function buildCrusher(g, color) {
  const hull = matteMat(color);
  const body = mesh(boxGeo(7, 1.8, 10, 0.1), hull, [0, 1.2, 0], null, true);
  const frontPlate = mesh(boxGeo(7, 2, 3, 0.1), hull, [0, 2, 4.5], [-0.3, 0, 0], true);
  weather(body.geometry); weather(frontPlate.geometry);
  g.add(body, frontPlate);
  if (dl() >= 1) for (let i = -2; i <= 2; i++)
    g.add(mesh(boxGeo(0.5, 1.6, 0.06, 0.01), i % 2 ? matteMat(0xd8b430) : matteMat(0x1c1c1c), [i * 1.2, 1.9, 5.95], [-0.3, 0, 0]));
  const plate = metalMat(0x444444, 0.6, 0.5);
  g.add(mesh(boxGeo(0.5, 2, 9, 0.05), plate, [-3.7, 1.5, 0]), mesh(boxGeo(0.5, 2, 9, 0.05), plate, [3.7, 1.5, 0]));
  headlights(g, 2.6, 5.2, [-2.6, 2.6]);
  const trackG = boxGeo(1.2, 1.8, 10.5, 0.08);
  const tL = mesh(trackG, trackMat(), [-3.2, 0.9, 0]); weather(tL.geometry, 0.5);
  g.add(tL, mesh(trackG, trackMat(), [3.2, 0.9, 0]));
  for (let i = -4; i <= 4; i++) { roadWheel(g, -3.55, 0.6, i * 1.2, 0.6, 1.3); roadWheel(g, 3.55, 0.6, i * 1.2, 0.6, 1.3); }
  for (const z of [-5.2, 5.2]) { roadWheel(g, -3.55, 0.65, z, 0.7, 1.3); roadWheel(g, 3.55, 0.65, z, 0.7, 1.3); }
  if (dl() >= 1) for (const z of [-3.3, 0, 3.3]) { roadWheel(g, -3.45, 1.8, z, 0.25, 1.1); roadWheel(g, 3.45, 1.8, z, 0.25, 1.1); }
  stowage(g, -1.5, 2.2, -4.4, 2, 0.7, 1.2);
  stowage(g, 1.5, 2.2, -4.4, 2, 0.7, 1.2);
  const turret = new THREE.Group();
  const tBase = mesh(boxGeo(4.5, 1.5, 5, 0.1), hull, [0, 3, 0], null, true); weather(tBase.geometry);
  turret.add(tBase);
  hatch(turret, -1, 3.8, -1, 0.5);
  const barrelG = cylGeo(0.25, 0.25, 5, 14);
  turret.add(mesh(barrelG, gunmetalMat(), [-0.6, 3.2, 4], [Math.PI / 2, 0, 0]));
  turret.add(mesh(barrelG, gunmetalMat(), [0.6, 3.2, 4], [Math.PI / 2, 0, 0]));
  if (dl() >= 1) for (const sx of [-1.6, 1.6]) {
    const ram = mesh(cylGeo(0.12, 0.12, 1.4, 8), metalMat(0x888c90, 0.25, 0.95), [sx, 2.9, 1.8], [0.9, 0, 0]);
    turret.add(ram);
  }
  rivets(turret, [[-2.1, 3.2, 2.4], [2.1, 3.2, 2.4], [-2.1, 3.2, -2.4], [2.1, 3.2, -2.4]]);
  g.add(turret);
  // Shield ring (gameplay visual — untouched)
  const shieldRing = new THREE.Mesh(
    ringGeo(38, 42, 48),
    new THREE.MeshBasicMaterial({ color: 0x4466ff, transparent: true, opacity: 0.15, side: THREE.DoubleSide, depthTest: false })
  );
  shieldRing.rotation.x = -Math.PI / 2;
  shieldRing.position.y = 0.3;
  shieldRing.renderOrder = 894;
  g.add(shieldRing);
  g.userData.shieldRing = shieldRing;
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 3.2, 6.5);
  return g;
}

function buildArtillery(g, color) {
  const hull = matteMat(color);
  const steel = metalMat(0x333333, 0.5, 0.7);
  const chassis = mesh(boxGeo(3.5, 1, 5, 0.08), hull, [0, 0.8, 0], null, true);
  weather(chassis.geometry);
  g.add(chassis);
  headlights(g, 1.1, 2.55, [-1.1, 1.1]);
  const outG = boxGeo(0.3, 0.5, 2, 0.04);
  for (const sx of [-2.2, 2.2]) {
    g.add(mesh(outG, steel, [sx, 0.4, 0]));
    if (dl() >= 1) g.add(mesh(boxGeo(0.5, 0.12, 0.5, 0.02), steel, [sx, 0.12, 0]));
  }
  const turret = new THREE.Group();
  const base = mesh(cylGeo(1.5, 1.8, 0.8, 8), hull, [0, 1.6, 0], null, true); weather(base.geometry);
  const cradle = mesh(boxGeo(1.2, 1.5, 2, 0.06), hull, [0, 2.2, 0]);
  turret.add(base, cradle);
  hatch(turret, 0, 2.9, -0.6, 0.3);
  const barrel = mesh(cylGeo(0.25, 0.25, 7, 12), gunmetalMat(), [0, 3.2, 3], [Math.PI / 2.2, 0, 0]);
  const muzzle = mesh(cylGeo(0.4, 0.4, 0.5, 10), gunmetalMat(), [0, 4.3, 5.8], [Math.PI / 2.2, 0, 0]);
  turret.add(barrel, muzzle);
  const pistonG = cylGeo(0.1, 0.1, 2, 6);
  const pistonMat = metalMat(0x888888, 0.3, 0.9);
  turret.add(mesh(pistonG, pistonMat, [-0.8, 2.5, 1.5], [Math.PI / 3, 0, 0]));
  turret.add(mesh(pistonG, pistonMat, [0.8, 2.5, 1.5], [Math.PI / 3, 0, 0]));
  if (dl() >= 2) for (let i = 0; i < 3; i++)
    turret.add(mesh(boxGeo(0.5, 0.35, 0.7, 0.03), canvasMat(), [-0.9 + i * 0.9, 1.9, -1.5]));
  antenna(turret, 1.2, 2.2, -1.2, 1.8);
  g.add(turret);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 4.5, 6);
  return g;
}

function buildMissileDefense(g, color) {
  const hull = matteMat(color);
  const dark = metalMat(0x222222, 0.6, 0.5);
  const base = mesh(boxGeo(4, 0.8, 4, 0.06), hull, [0, 0.6, 0], null, true);
  weather(base.geometry);
  g.add(base);
  headlights(g, 0.85, 2.05, [-1.3, 1.3]);
  const tower = mesh(boxGeo(1, 3, 1, 0.05), dark, [-1.2, 2.5, -1.2]);
  const radar = mesh(boxGeo(2, 2, 0.2, 0.02), glassMat(0x44aaff), [-1.2, 4, -1.2], [0, Math.PI / 4, 0]);
  g.add(tower, radar);
  if (dl() >= 1) g.add(mesh(boxGeo(2.2, 0.12, 0.3, 0.02), dark, [-1.2, 3.05, -1.2], [0, Math.PI / 4, 0]));
  const turret = new THREE.Group();
  const platform = mesh(boxGeo(3, 0.5, 3, 0.05), hull, [0, 1.3, 0], null, true);
  turret.add(platform);
  const cellG = boxGeo(0.6, 1.5, 0.6, 0.03);
  const cellMat = metalMat(0x444444, 0.55, 0.5);
  const tipMat = glowMat(0xff3300, 1);
  for (let x = -1; x <= 1; x++) for (let z = -1; z <= 1; z++) {
    turret.add(mesh(cellG, cellMat, [x * 0.8, 2.1, z * 0.8]));
    const tip = new THREE.Mesh(coneGeo(0.2, 0.4, 6), tipMat);
    tip.position.set(x * 0.8, 2.9, z * 0.8);
    turret.add(tip);
  }
  if (dl() >= 2) turret.add(mesh(boxGeo(0.3, 0.3, 0.3, 0.02), lightMat(0xffaa00), [1.3, 1.7, 1.3]));
  g.add(turret);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 3, 0);
  return g;
}

function buildMLRS(g, color) {
  const cab = matteMat(color);
  const dark = metalMat(0x222222, 0.6, 0.5);
  const cabM = mesh(boxGeo(2.8, 1.5, 2, 0.08), cab, [0, 1.5, 2.5], null, true);
  weather(cabM.geometry);
  g.add(cabM);
  g.add(mesh(boxGeo(2.6, 0.8, 0.1, 0.02), glassMat(0x223344), [0, 2, 3.5]));
  const chassis = mesh(boxGeo(2.8, 1, 5, 0.06), dark, [0, 0.8, 0], null, true);
  weather(chassis.geometry);
  g.add(chassis);
  headlights(g, 1.4, 3.55, [-0.9, 0.9]);
  for (const p of [[-1.4, 0.6, 2.5], [1.4, 0.6, 2.5], [-1.4, 0.6, -1.5], [1.4, 0.6, -1.5]])
    roadWheel(g, p[0], p[1], p[2], 0.6, 0.4);
  if (dl() >= 2) g.add(mesh(cylGeo(0.5, 0.5, 0.35, 10), rubberMat(), [0, 0.7, -2.6], [Math.PI / 2, 0, 0]));
  const turret = new THREE.Group();
  const mount = mesh(boxGeo(2.4, 0.8, 2, 0.05), cab, [0, 1.8, 0]);
  const pod = mesh(boxGeo(2.2, 1.5, 3.5, 0.06), metalMat(0x445544, 0.6, 0.4), [0, 3, -0.5], [-0.4, 0, 0], true);
  turret.add(mount, pod);
  const tubeG = cylGeo(0.2, 0.2, 0.2, 6);
  const tubeMat = metalMat(0x111111, 0.7, 0.4);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    const tube = new THREE.Mesh(tubeG, tubeMat);
    tube.rotation.x = Math.PI / 2;
    tube.position.set(-0.75 + c * 0.5, 2.5 + r * 0.5, 1.2);
    pod.add(tube);
  }
  if (dl() >= 1) turret.add(mesh(boxGeo(2.24, 0.08, 3.54, 0.02), dark, [0, 3.78, -0.5], [-0.4, 0, 0]));
  g.add(turret);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 4, 2);
  return g;
}

function buildCoastal(g, color) {
  const concrete = matteMat(0x666666);
  const hull = matteMat(color);
  const steel = metalMat(0x333333, 0.55, 0.6);
  const base = mesh(boxGeo(6, 1.5, 6, 0.05), concrete, [0, 0.75, 0], null, true);
  const wall = mesh(boxGeo(6, 2, 1, 0.05), concrete, [0, 1.5, 2.5], null, true);
  weather(base.geometry, 0.5); weather(wall.geometry, 0.4);
  g.add(base, wall);
  if (dl() >= 1) {
    const bagG = boxGeo(0.7, 0.35, 0.45, 0.1);
    const bagMat = canvasMat(0x8a7a58);
    for (let i = 0; i < 6; i++) g.add(mesh(bagG, bagMat, [-2.5 + i, 0.2, 3.3]));
    for (let i = 0; i < 5; i++) g.add(mesh(bagG, bagMat, [-2 + i, 0.55, 3.3]));
  }
  const turret = new THREE.Group();
  const tBase = mesh(cylGeo(2, 2.2, 1.2, 8), hull, [0, 2.1, 0], null, true); weather(tBase.geometry);
  turret.add(tBase);
  hatch(turret, 0.8, 2.75, -0.8, 0.4);
  const barrelG = cylGeo(0.3, 0.3, 5, 10);
  turret.add(mesh(barrelG, gunmetalMat(), [-0.6, 2.4, 3], [Math.PI / 2, 0, 0]));
  turret.add(mesh(barrelG, gunmetalMat(), [0.6, 2.4, 3], [Math.PI / 2, 0, 0]));
  const muzzleG = cylGeo(0.5, 0.5, 0.6, 10);
  turret.add(mesh(muzzleG, steel, [-0.6, 2.4, 5.5], [Math.PI / 2, 0, 0]));
  turret.add(mesh(muzzleG, steel, [0.6, 2.4, 5.5], [Math.PI / 2, 0, 0]));
  antenna(turret, -1.4, 2.6, -1, 2);
  g.add(turret);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 2.4, 6);
  return g;
}

function buildHealer(g, color) {
  const body = matteMat(color);
  const steel = metalMat(0x333333, 0.55, 0.6);
  const cross = glowMat(0x44ff44, 1.5);
  const cabM = mesh(boxGeo(3, 2, 2.5, 0.08), body, [0, 2, 2.5], null, true);
  weather(cabM.geometry);
  g.add(cabM);
  g.add(mesh(boxGeo(2.8, 1, 0.1, 0.02), glassMat(0x224422), [0, 2.8, 3.8]));
  const chassis = mesh(boxGeo(3, 1, 6, 0.06), steel, [0, 0.8, 0], null, true);
  weather(chassis.geometry);
  g.add(chassis);
  headlights(g, 1.9, 3.8, [-1, 1]);
  for (const p of [[-1.5, 0.6, 2], [1.5, 0.6, 2], [-1.5, 0.6, -2], [1.5, 0.6, -2]])
    roadWheel(g, p[0], p[1], p[2], 0.7, 0.4);
  const medBox = mesh(boxGeo(2.8, 2, 3.5, 0.08), body, [0, 2.3, -1], null, true);
  weather(medBox.geometry);
  g.add(medBox);
  g.add(mesh(boxGeo(1.2, 0.3, 0.1, 0.02), cross, [0, 2.8, 0.76]));
  g.add(mesh(boxGeo(0.3, 1.2, 0.1, 0.02), cross, [0, 2.8, 0.76]));
  g.add(mesh(boxGeo(0.3, 1.2, 0.1, 0.02), cross, [1.41, 2.8, -1], [0, Math.PI / 2, 0]));
  antenna(g, 1, 3.3, -2, 2);
  const dish = new THREE.Mesh(cylGeo(0.6, 0.6, 0.15, 8), cross);
  dish.position.set(0, 5, -2);
  g.add(dish);
  if (dl() >= 2) {
    g.add(mesh(boxGeo(0.08, 0.08, 2.2, 0.02), steel, [-1.2, 3.5, -1]));
    g.add(mesh(boxGeo(0.08, 0.08, 2.2, 0.02), steel, [1.2, 3.5, -1]));
  }
  g.userData.muzzleOffset = null;
  return g;
}

// ---------- SEA ----------
function buildFrigate(g, color) {
  const hull = matteMat(color);
  const superM = metalMat(0x888899, 0.6, 0.4);
  const deckM = matteMat(0x2e3133);
  const hullM = mesh(boxGeo(3.5, 1.5, 10, 0.08), hull, [0, 0.75, 0], null, true);
  weather(hullM.geometry, 0.42);
  const bow = mesh(boxGeo(3.5, 1.5, 2, 0.08), hull, [0, 1, 5.5], [0.3, 0, 0], true);
  const stern = mesh(boxGeo(3.5, 0.2, 3, 0.02), deckM, [0, 1.5, -4]);
  g.add(hullM, bow, stern);
  const bridge1 = mesh(boxGeo(2.5, 2, 3, 0.06), superM, [0, 2.5, -1], null, true);
  const bridge2 = mesh(boxGeo(2, 1.5, 2, 0.06), superM, [0, 4.2, -1]);
  g.add(bridge1, bridge2);
  g.add(mesh(boxGeo(2.6, 0.5, 0.1, 0.02), glassMat(0x113355), [0, 3, 0.5]));
  if (dl() >= 1) g.add(mesh(boxGeo(2.1, 0.4, 0.1, 0.02), glassMat(0x113355), [0, 4.6, 0]));
  if (dl() >= 1) {
    g.add(mesh(boxGeo(0.12, 0.04, 2.4, 0.01), glowMat(0xffffff, 0.5), [-0.9, 1.62, -4]));
    g.add(mesh(boxGeo(0.12, 0.04, 2.4, 0.01), glowMat(0xffffff, 0.5), [0.9, 1.62, -4]));
  }
  const turret = new THREE.Group();
  const tBase = mesh(boxGeo(1.5, 0.8, 1.5, 0.06), hull, [0, 1.9, 0], null, true);
  const barrel = mesh(cylGeo(0.15, 0.15, 2.5, 8), gunmetalMat(), [0, 2.1, 1.5], [Math.PI / 2, 0, 0]);
  turret.add(tBase, barrel);
  turret.position.set(0, 0, 3);
  g.add(turret);
  g.add(mesh(boxGeo(1.5, 0.3, 1.5, 0.03), metalMat(0x555555, 0.6, 0.5), [0, 1.6, -2.5]));
  const mast = mesh(new THREE.CylinderGeometry(0.1, 0.14, 3, 4), superM, [0, 6.5, -1]);
  g.add(mast);
  if (dl() >= 1) g.add(mesh(boxGeo(1.2, 0.08, 0.08, 0.02), superM, [0, 7.3, -1]));
  g.add(mesh(boxGeo(1.5, 1, 0.2, 0.02), glassMat(0x88ccff), [0, 7, -1]));
  if (dl() >= 1) {
    for (const z of [0.5, -0.5]) g.add(mesh(cylGeo(0.35, 0.35, 0.5, 8), matteMat(0xcccccc), [1.8, 1.8, z], [0, 0, Math.PI / 2]));
    g.add(mesh(cylGeo(0.25, 0.25, 0.8, 8), metalMat(0x444444, 0.6, 0.6), [0, 1.7, 4.6], [0, 0, Math.PI / 2]));
  }
  navLights(g, [-1.8, 1.7, 1], [1.8, 1.7, 1], [0, 1.7, -5.4]);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 2.1, 4.5);
  g.userData.bobPhase = Math.random() * Math.PI * 2;
  return g;
}

function buildCruiser(g, color) {
  const hull = matteMat(color);
  const superM = metalMat(0x888899, 0.6, 0.4);
  const hullM = mesh(boxGeo(4.5, 1.8, 16, 0.08), hull, [0, 0.9, 0], null, true);
  weather(hullM.geometry, 0.42);
  const bow = mesh(boxGeo(4.5, 1.8, 3, 0.08), hull, [0, 1.2, 7.5], [0.2, 0, 0], true);
  g.add(hullM, bow);
  const bridge1 = mesh(boxGeo(3.5, 3, 5, 0.06), superM, [0, 3.3, -3], null, true);
  const bridge2 = mesh(boxGeo(2.5, 2, 3, 0.06), superM, [0, 5.8, -3]);
  g.add(bridge1, bridge2);
  g.add(mesh(boxGeo(3.6, 0.5, 0.1, 0.02), glassMat(0x113355), [0, 4.2, -0.5]));
  const radarMat = glassMat(0x44aaff);
  for (const sx of [-1.8, 1.8]) g.add(mesh(boxGeo(0.2, 1.5, 1.5, 0.02), radarMat, [sx, 4, -1.5]));
  const turret = new THREE.Group();
  const tBase = mesh(boxGeo(2, 1, 2, 0.06), hull, [0, 2.3, 0], null, true);
  const barrelG = cylGeo(0.2, 0.2, 4, 8);
  turret.add(tBase);
  turret.add(mesh(barrelG, gunmetalMat(), [-0.5, 2.5, 2], [Math.PI / 2, 0, 0]));
  turret.add(mesh(barrelG, gunmetalMat(), [0.5, 2.5, 2], [Math.PI / 2, 0, 0]));
  turret.position.set(0, 0, 5);
  g.add(turret);
  g.add(mesh(boxGeo(2, 0.3, 3, 0.03), metalMat(0x555555, 0.6, 0.5), [0, 1.9, -6]));
  g.add(mesh(boxGeo(4, 0.2, 4, 0.02), matteMat(0x333333), [0, 1.9, -8]));
  if (dl() >= 1) {
    g.add(mesh(cylGeo(0.08, 0.12, 2.5, 4), superM, [0, 7.8, -3]));
    for (const sx of [-2.1, 2.1]) for (const z of [2, -2])
      g.add(mesh(cylGeo(0.3, 0.3, 0.5, 8), matteMat(0xdddddd), [sx, 2.2, z], [0, 0, Math.PI / 2]));
  }
  antenna(g, 0, 6.8, -4.2, 2);
  navLights(g, [-2.3, 2, 3], [2.3, 2, 3], [0, 2.1, -7.8]);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 2.5, 7);
  g.userData.bobPhase = Math.random() * Math.PI * 2;
  return g;
}

function buildSubmarine(g, color) {
  const hull = matteMat(mixColor(color, 0x11151c, 0.35));
  const dark = metalMat(0x222222, 0.6, 0.4);
  const pressure = mesh(capsuleGeo(1.2, 8, 14), hull, [0, 0, 0], null, true);
  pressure.rotation.z = Math.PI / 2;
  weather(pressure.geometry, 0.35);
  g.add(pressure);
  const sail = mesh(boxGeo(1.2, 1.5, 2.5, 0.1), hull, [0, 1.5, -1], null, true);
  g.add(sail);
  if (dl() >= 1) g.add(mesh(boxGeo(1, 0.25, 0.08, 0.02), glassMat(0x0a1a22), [0, 1.9, 0.26]));
  g.add(mesh(boxGeo(2, 0.1, 0.8, 0.03), dark, [0, 1.5, -1]));
  if (dl() >= 1) {
    g.add(mesh(cylGeo(0.05, 0.05, 1.5, 4), dark, [-0.3, 2.8, -1]));
    g.add(mesh(cylGeo(0.05, 0.05, 1.5, 4), dark, [0.3, 2.8, -1]));
  }
  g.add(mesh(boxGeo(0.2, 0.2, 1, 0.02), glowMat(0x00ffaa, 1), [0, 2.3, -1]));
  const plate = mesh(cylGeo(0.15, 0.15, 1.2, 8), dark, [-5, 0, 0], [0, 0, Math.PI / 2]);
  g.add(plate);
  if (dl() >= 2) {
    const bladeG = boxGeo(0.08, 0.9, 0.35, 0.03);
    for (let i = 0; i < 5; i++) {
      const blade = new THREE.Mesh(bladeG, metalMat(0x8a6f3d, 0.35, 0.85));
      blade.position.set(0, 0.55, 0);
      const pivot = new THREE.Group();
      pivot.position.set(-5.4, 0, 0);
      pivot.rotation.x = (i / 5) * Math.PI * 2;
      pivot.add(blade);
      g.add(pivot);
    }
  } else {
    g.add(mesh(cylGeo(0.8, 0.8, 1, 8), dark, [-5, 0, 0], [0, 0, Math.PI / 2]));
  }
  g.userData.bobPhase = Math.random() * Math.PI * 2;
  return g;
}

function buildShip(g, color, scale) {
  const hull = matteMat(color);
  const superM = metalMat(0x888899, 0.6, 0.4);
  const w = 5 * scale;
  const l = 14 * scale;
  const hullM = mesh(boxGeo(w, 1.5, l, 0.08), hull, [0, 0.75, 0], null, true);
  weather(hullM.geometry, 0.42);
  const bow = mesh(boxGeo(w, 1.5, 3 * scale, 0.08), hull, [0, 1, l / 2 + 1], [0.2, 0, 0], true);
  const bridge = mesh(boxGeo(3 * scale, 3 * scale, 4 * scale, 0.05), superM, [0, 3 * scale, -scale], null, true);
  g.add(hullM, bow, bridge);
  g.add(mesh(boxGeo(3.1 * scale, 0.5 * scale, 0.1, 0.02), glassMat(0x113355), [0, 3.8 * scale, scale]));
  const turret = new THREE.Group();
  const tBase = mesh(boxGeo(2 * scale, 1.2, 2 * scale, 0.06), hull, [0, 2.1 * scale, 0], null, true);
  turret.add(tBase);
  const barrelCount = scale > 1.2 ? 3 : 2;
  const spacing = 0.6 * scale;
  for (let i = 0; i < barrelCount; i++)
    turret.add(mesh(cylGeo(0.25 * scale, 0.25 * scale, 4 * scale, 10), gunmetalMat(), [(i - (barrelCount - 1) / 2) * spacing, 2.3 * scale, 2.5 * scale], [Math.PI / 2, 0, 0]));
  if (dl() >= 1) turret.add(mesh(boxGeo(0.5 * scale, 0.3 * scale, 0.3 * scale, 0.03), superM, [0, 2.9 * scale, -0.5 * scale]));
  turret.position.z = 4 * scale;
  g.add(turret);
  if (dl() >= 1) {
    g.add(mesh(cylGeo(0.08 * scale, 0.12 * scale, 3 * scale, 4), superM, [0, 5.5 * scale, -scale]));
    for (const sx of [-w / 2 - 0.1, w / 2 + 0.1])
      g.add(mesh(cylGeo(0.3 * scale, 0.3 * scale, 0.5 * scale, 8), matteMat(0xcccc), [sx, 1.6, 0], [0, 0, Math.PI / 2]));
  }
  navLights(g, [-w / 2, 1.8, 2], [w / 2, 1.8, 2], [0, 1.8, -l / 2]);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 2.3 * scale, 6 * scale);
  g.userData.bobPhase = Math.random() * Math.PI * 2;
  return g;
}

function buildCarrier(g, color) {
  const hull = matteMat(color);
  const deckM = matteMat(0x222222);
  const superM = metalMat(0x888899, 0.6, 0.4);
  const hullM = mesh(boxGeo(7, 1.5, 20, 0.08), hull, [0, 0.75, 0], null, true);
  weather(hullM.geometry, 0.45);
  const deck = mesh(boxGeo(9, 0.3, 22, 0.04), deckM, [0, 1.6, 0], null, true);
  g.add(hullM, deck);
  const lineMat = glowMat(0xffffff, 0.5);
  g.add(mesh(boxGeo(0.1, 0.05, 20, 0.01), lineMat, [0, 1.8, 0]));
  g.add(mesh(boxGeo(8, 0.05, 0.1, 0.01), lineMat, [0, 1.8, -5]));
  if (dl() >= 1) {
    const edgeMat = glowMat(0xffcc44, 0.8);
    for (let z = -9; z <= 9; z += 3) {
      g.add(mesh(boxGeo(0.12, 0.06, 0.12, 0.01), edgeMat, [-4.4, 1.78, z]));
      g.add(mesh(boxGeo(0.12, 0.06, 0.12, 0.01), edgeMat, [4.4, 1.78, z]));
    }
  }
  const angled = mesh(boxGeo(5, 0.3, 10, 0.04), deckM, [3, 1.65, -3], [0, 0.2, 0]);
  const island = mesh(boxGeo(1.5, 4, 5, 0.05), superM, [4, 3.8, -5], null, true);
  g.add(angled, island);
  g.add(mesh(boxGeo(0.2, 1.5, 1.5, 0.02), glassMat(0x44aaff), [4.8, 4.5, -4]));
  if (dl() >= 1) {
    g.add(mesh(cylGeo(0.06, 0.1, 2, 4), superM, [4, 6.8, -5]));
    g.add(mesh(boxGeo(1.6, 0.4, 0.15, 0.02), glassMat(0x44aaff), [4, 5.4, -2.6]));
  }
  const jetMat = matteMat(0x556677);
  for (const sx of [-1.5, 1.5]) g.add(mesh(boxGeo(2, 0.3, 3, 0.05), jetMat, [sx, 1.9, 5]));
  navLights(g, [-4.5, 1.9, 8], [4.5, 1.9, 8], [0, 1.9, -10.8]);
  g.userData.bobPhase = Math.random() * Math.PI * 2;
  return g;
}

function buildTransport(g, color) {
  const hull = matteMat(color);
  const deckM = matteMat(0x443322);
  const steel = metalMat(0x333333, 0.55, 0.6);
  const hullM = mesh(boxGeo(6, 1.5, 14, 0.08), hull, [0, 0.75, 0], null, true);
  weather(hullM.geometry, 0.45);
  const deck = mesh(boxGeo(5, 0.3, 8, 0.03), deckM, [0, 1.5, 1]);
  const ramp = mesh(boxGeo(5, 0.3, 4, 0.03), steel, [0, 0.8, 6.5], [0.4, 0, 0]);
  const cabin = mesh(boxGeo(5.5, 3, 4, 0.06), hull, [0, 3, -4.5], null, true);
  weather(cabin.geometry);
  g.add(hullM, deck, ramp, cabin);
  g.add(mesh(boxGeo(5, 1, 0.1, 0.02), glassMat(0x223344), [0, 3.5, -2.5]));
  if (dl() >= 1) {
    for (let i = 0; i < 4; i++) g.add(mesh(boxGeo(4.8, 0.06, 0.2, 0.01), steel, [0, 0.98 + i * 0.13, 5.2 + i * 0.85], [0.4, 0, 0]));
    g.add(mesh(cylGeo(0.06, 0.1, 2.4, 4), steel, [0, 5.4, -4.5]));
  }
  const container = mesh(boxGeo(2, 2, 4, 0.04), matteMat(0xaa4422), [-1, 2.6, 1]);
  g.add(container);
  if (dl() >= 2) g.add(mesh(boxGeo(1.6, 1.6, 1.6, 0.04), canvasMat(0x5a6350), [1.4, 2.4, 2]));
  navLights(g, [-3, 1.8, 3], [3, 1.8, 3], [0, 1.8, -6.8]);
  g.userData.bobPhase = Math.random() * Math.PI * 2;
  g.userData.muzzleOffset = null;
  return g;
}

// ---------- AIR ----------
function rotorAssembly(g, hubY = 1.1) {
  const detail = metalMat(0x222222, 0.5, 0.6);
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5, metalness: 0.5, transparent: true, opacity: 0.6 });
  const hub = new THREE.Mesh(cylGeo(0.2, 0.2, 0.4, 6), detail);
  hub.position.set(0, hubY, 0);
  const b1 = new THREE.Mesh(boxGeo(7, 0.05, 0.3, 0.02), bladeMat);
  b1.position.set(0, hubY + 0.2, 0);
  const b2 = new THREE.Mesh(boxGeo(0.3, 0.05, 7, 0.02), bladeMat);
  b2.position.set(0, hubY + 0.2, 0);
  g.add(hub, b1, b2);
  if (dl() >= 2) {
    for (const sx of [-3.45, 3.45]) g.add(mesh(boxGeo(0.12, 0.06, 0.32, 0.02), matteMat(0xdddddd), [sx, hubY + 0.2, 0]));
  }
}
function buildHeli(g, color) {
  const body = matteMat(color);
  const glass = glassMat(0x113322);
  const dark = metalMat(0x222222, 0.55, 0.5);
  const fuse = mesh(capsuleGeo(0.7, 2.5, 10), body, [0, 0, 0], null, true);
  fuse.rotation.z = Math.PI / 2;
  g.add(fuse);
  const cf = mesh(domeGeo(0.5, 8, 6), glass, [1.2, 0.2, 0], [0, 0, -Math.PI / 2]);
  const cb = mesh(domeGeo(0.5, 8, 6), glass, [-0.2, 0.6, 0], [0, 0, -Math.PI / 2]);
  g.add(cf, cb);
  const tail = mesh(cylGeo(0.15, 0.3, 3.5, 6), body, [-2.8, 0.2, 0], [0, 0, Math.PI / 2]);
  const fin = mesh(boxGeo(0.8, 1.2, 0.1, 0.03), body, [-4.2, 0.8, 0]);
  g.add(tail, fin);
  if (dl() >= 1) {
    for (const sz of [-0.7, 0.7]) {
      g.add(mesh(cylGeo(0.05, 0.05, 2.6, 6), dark, [0.2, -0.75, sz], [0, 0, Math.PI / 2]));
      g.add(mesh(cylGeo(0.05, 0.05, 0.6, 6), dark, [0.8, -0.45, sz], [0, 0, 0.5]));
      g.add(mesh(cylGeo(0.05, 0.05, 0.6, 6), dark, [-0.8, -0.45, sz], [0, 0, -0.5]));
    }
  }
  const wingG = boxGeo(0.5, 0.2, 2, 0.03);
  g.add(mesh(wingG, dark, [-0.5, -0.2, 1.2]), mesh(wingG, dark, [-0.5, -0.2, -1.2]));
  const missileG = cylGeo(0.1, 0.1, 1, 6);
  for (let i = 0; i < 2; i++) {
    g.add(mesh(missileG, metalMat(0x555555, 0.5, 0.6), [-0.5, -0.4, 0.8 + i * 0.8], [Math.PI / 2, 0, 0]));
    g.add(mesh(missileG, metalMat(0x555555, 0.5, 0.6), [-0.5, -0.4, -(0.8 + i * 0.8)], [Math.PI / 2, 0, 0]));
  }
  g.add(mesh(sphereGeo(0.25, 8, 6), glowMat(0xff0000, 1), [1.6, -0.4, 0]));
  rotorAssembly(g);
  const tailRotor = new THREE.Mesh(boxGeo(0.05, 1.5, 0.2, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5, metalness: 0.5, transparent: true, opacity: 0.6 }));
  tailRotor.position.set(-4.2, 0.8, 0.2);
  g.add(tailRotor);
  exhaustPipe(g, -1.2, 0.75, 0.4, 0.09, 0.4);
  navLights(g, [-0.6, 0, 1.3], [-0.6, 0, -1.3], null);
  g.userData.muzzleOffset = new THREE.Vector3(1.6, -0.4, 0);
  return g;
}

function buildMedHeli(g, color) {
  const body = matteMat(color);
  const dark = metalMat(0x222222, 0.55, 0.5);
  const cross = glowMat(0x44ff44, 1.5);
  const fuse = mesh(capsuleGeo(0.7, 2.5, 10), body, [0, 0, 0], null, true);
  fuse.rotation.z = Math.PI / 2;
  g.add(fuse);
  g.add(mesh(domeGeo(0.5, 8, 6), glassMat(0x113322), [1.2, 0.2, 0], [0, 0, -Math.PI / 2]));
  g.add(mesh(cylGeo(0.15, 0.3, 3.5, 6), body, [-2.8, 0.2, 0], [0, 0, Math.PI / 2]));
  g.add(mesh(boxGeo(0.8, 1.2, 0.1, 0.03), body, [-4.2, 0.8, 0]));
  g.add(mesh(boxGeo(1.2, 0.3, 0.1, 0.02), cross, [0, 0.5, 0.75]));
  g.add(mesh(boxGeo(0.3, 1.2, 0.1, 0.02), cross, [0, 0.5, 0.75]));
  if (dl() >= 1) {
    for (const sz of [-0.7, 0.7]) {
      g.add(mesh(cylGeo(0.05, 0.05, 2.6, 2), dark, [0.2, -0.75, sz], [0, 0, Math.PI / 2]));
      g.add(mesh(cylGeo(0.05, 0.05, 0.6, 2), dark, [0.8, -0.45, sz], [0, 0, 0.5]));
      g.add(mesh(cylGeo(0.05, 0.05, 0.6, 2), dark, [-0.8, -0.45, sz], [0, 0, -0.5]));
    }
  }
  g.add(mesh(boxGeo(0.5, 0.2, 1.5, 0.03), dark, [-0.5, -0.2, 1]));
  g.add(mesh(boxGeo(0.5, 0.2, 1.5, 0.03), dark, [-0.5, -0.2, -1]));
  const dish = new THREE.Mesh(cylGeo(0.4, 0.4, 0.1, 8), cross);
  dish.position.set(0, -0.5, 0);
  g.add(dish);
  rotorAssembly(g);
  const tailRotor = new THREE.Mesh(boxGeo(0.05, 1.5, 0.2, 0.02),
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5, metalness: 0.5, transparent: true, opacity: 0.6 }));
  tailRotor.position.set(-4.2, 0.8, 0.2);
  g.add(tailRotor);
  g.userData.muzzleOffset = null;
  return g;
}

function buildGunship(g, color) {
  const body = matteMat(color);
  const dark = metalMat(0x222222, 0.55, 0.5);
  const fuse = mesh(capsuleGeo(1.5, 6, 10), body, [0, 0, 0], null, true);
  fuse.rotation.z = Math.PI / 2;
  weather(fuse.geometry, 0.25);
  g.add(fuse);
  g.add(mesh(domeGeo(1.2, 8, 6), glassMat(0x113322), [3.5, 0.5, 0], [0, 0, -Math.PI / 2]));
  const wings = mesh(boxGeo(2, 0.3, 12, 0.06), body, [-0.5, 0.5, 0], null, true);
  g.add(wings);
  for (let i = 0; i < 4; i++) {
    const eng = mesh(cylGeo(0.4, 0.4, 2, 10), dark, [-0.5, 0, -4.5 + i * 3], [Math.PI / 2, 0, 0]);
    g.add(eng);
    const exhaust = new THREE.Mesh(cylGeo(0.3, 0.3, 0.2, 10), glowMat(0xff5500, 2));
    exhaust.rotation.x = Math.PI / 2;
    exhaust.position.set(-0.5, 0, -5.5 + i * 3);
    g.add(exhaust);
  }
  g.add(mesh(boxGeo(1, 0.2, 4, 0.04), body, [-4, 0.5, 0]));
  g.add(mesh(boxGeo(0.2, 2.5, 2, 0.04), body, [-4, 1.5, 0]));
  const gunG = cylGeo(0.15, 0.15, 2.5, 6);
  g.add(mesh(gunG, gunmetalMat(), [0, -1, 1.5], [Math.PI / 2, 0, 0]));
  g.add(mesh(gunG, gunmetalMat(), [0, -1, -0.5], [Math.PI / 2, 0, 0]));
  g.add(mesh(cylGeo(0.3, 0.3, 3, 8), gunmetalMat(), [0, -1, -2.5], [Math.PI / 2, 0, 0]));
  if (dl() >= 1) g.add(mesh(cylGeo(0.45, 0.45, 0.4, 10), dark, [0, -1, 0.4], [Math.PI / 2, 0, 0]));
  g.add(mesh(sphereGeo(0.5, 8, 6), glassMat(0x2244aa), [1, -1, 0]));
  navLights(g, [-0.5, 0.6, 6], [-0.5, 0.6, -6], [-4.8, 0.6, 0]);
  g.userData.muzzleOffset = new THREE.Vector3(0, -1, 2.5);
  return g;
}

function buildEscortJet(g, color) {
  const body = matteMat(color);
  const dark = metalMat(0x333333, 0.55, 0.6);
  const fuse = mesh(capsuleGeo(0.5, 5, 8), body, [0, 0, 0], null, true);
  fuse.rotation.x = Math.PI / 2;
  g.add(fuse);
  g.add(mesh(domeGeo(0.45, 8, 6), glassMat(0x113344), [0, 0.3, 2.5], [-Math.PI / 3, 0, 0]));
  const wingG = boxGeo(2.5, 0.15, 5, 0.04);
  g.add(mesh(wingG, body, [-0.5, -0.1, 0], [0, -0.3, 0], true));
  g.add(mesh(wingG, body, [0.5, -0.1, 0], [0, 0.3, 0], true));
  const exhaustG = cylGeo(0.3, 0.35, 0.6, 8);
  g.add(mesh(exhaustG, glowMat(0x44aaff, 2), [-0.5, 0, -2.5], [Math.PI / 2, 0, 0]));
  g.add(mesh(exhaustG, glowMat(0x44aaff, 2), [0.5, 0, -2.5], [Math.PI / 2, 0, 0]));
  const tailG = boxGeo(0.15, 1.5, 1.2, 0.03);
  g.add(mesh(tailG, body, [-1, 0.8, -2], [0, 0, -0.15]));
  g.add(mesh(tailG, body, [1, 0.8, -2], [0, 0, 0.15]));
  const pylonG = cylGeo(0.08, 0.08, 1.5, 6);
  for (let i = 0; i < 2; i++) for (const sx of [-0.3, 0.3])
    g.add(mesh(pylonG, metalMat(0x666666, 0.5, 0.6), [sx, -0.3, 1 + i * 0.8], [Math.PI / 2, 0, 0]));
  if (dl() >= 2) {
    for (const sx of [-0.45, 0.45]) g.add(mesh(coneGeo(0.18, 0.5, 8), dark, [sx, 0, 1.8], [Math.PI / 2, 0, 0]));
    for (const sx of [-1.7, 1.7]) g.add(mesh(cylGeo(0.09, 0.09, 1.6, 6), metalMat(0x777777, 0.4, 0.7), [sx, -0.05, 0.4], [Math.PI / 2, 0, 0]));
  }
  navLights(g, [-1.7, 0, 1], [1.7, 0, 1], [0, 0.4, -2.6]);
  g.userData.muzzleOffset = new THREE.Vector3(0, 0, 3);
  return g;
}

function buildB2(g, color) {
  const body = matteMat(mixColor(color, 0x14161c, 0.3));
  const dark = metalMat(0x222222, 0.6, 0.4);
  const center = mesh(new THREE.BoxGeometry(2, 0.6, 4), body, [0, 0, 0], null, true);
  weather(center.geometry, 0.2);
  g.add(center);
  const wingG = boxGeo(5, 0.3, 3, 0.06);
  g.add(mesh(wingG, body, [-3.5, 0, 0], [0, 0.4, 0], true));
  g.add(mesh(wingG, body, [3.5, 0, 0], [0, -0.4, 0], true));
  g.add(mesh(domeGeo(0.4, 6, 5), glassMat(0x112222), [0, 0.4, 1.5]));
  for (const sx of [-1, 1]) g.add(mesh(boxGeo(1.5, 0.3, 0.8, 0.04), dark, [sx, 0.2, -0.5]));
  for (const sx of [-1, 1]) g.add(mesh(boxGeo(0.8, 0.15, 1, 0.03), glowMat(0xff5500, 1.5), [sx, 0, -2]));
  g.add(mesh(boxGeo(2, 0.05, 1.5, 0.01), dark, [0, -0.3, 0]));
  if (dl() >= 2) for (const sx of [-2, 2]) g.add(mesh(boxGeo(0.06, 0.32, 2.8, 0.01), dark, [sx, 0, 0], [0, sx < 0 ? 0.4 : -0.4, 0]));
  g.userData.muzzleOffset = new THREE.Vector3(0, 0, 2);
  return g;
}

function buildEscortBomber(g, color) {
  const body = matteMat(color);
  const dark = metalMat(0x333333, 0.55, 0.6);
  const fuse = mesh(capsuleGeo(1.8, 8, 10), body, [0, 0, 0], null, true);
  fuse.rotation.x = Math.PI / 2;
  weather(fuse.geometry, 0.22);
  g.add(fuse);
  g.add(mesh(domeGeo(0.8, 8, 6), glassMat(0x113344), [0, 0.5, 4.5], [-Math.PI / 3, 0, 0]));
  const wingG = boxGeo(2.5, 0.25, 10, 0.05);
  g.add(mesh(wingG, body, [-1, 0.3, 0], null, true));
  g.add(mesh(wingG, body, [1, 0.3, 0], null, true));
  const engG = cylGeo(0.5, 0.5, 2.5, 10);
  for (const p of [[-1, 0.3, 3], [-1, 0.3, -3], [1, 0.3, 3], [1, 0.3, -3]]) {
    g.add(mesh(engG, dark, p, [Math.PI / 2, 0, 0]));
    const exhaust = new THREE.Mesh(cylGeo(0.4, 0.4, 0.3, 8), glowMat(0xff4400, 1.5));
    exhaust.rotation.x = Math.PI / 2;
    exhaust.position.set(p[0], p[1], p[2] - 1.5);
    g.add(exhaust);
    if (dl() >= 1) g.add(mesh(cylGeo(0.12, 0.12, 0.4, 6), dark, [p[0], p[1] + 0.5, p[2]], [Math.PI / 2, 0, 0]));
  }
  g.add(mesh(boxGeo(1.5, 0.2, 3, 0.04), body, [0, 0.5, -5]));
  g.add(mesh(boxGeo(0.2, 3, 2.5, 0.04), body, [0, 2, -5]));
  const turret1 = mesh(cylGeo(0.3, 0.3, 0.8, 6), metalMat(0x444444, 0.5, 0.6), [1, -1, -2], [Math.PI / 2, 0, 0]);
  g.add(turret1);
  if (dl() >= 2) g.add(mesh(cylGeo(0.3, 0.3, 0.8, 6), metalMat(0x444444, 0.5, 0.6), [-1, -1, -2], [Math.PI / 2, 0, 0]));
  navLights(g, [-2.2, 0.4, 0], [2.2, 0.4, 0], [0, 0.6, -6]);
  g.userData.muzzleOffset = new THREE.Vector3(0, 0, 5);
  return g;
}

function buildJet(g, color, scale) {
  const body = matteMat(color);
  const fuse = mesh(capsuleGeo(0.4 * scale, 5 * scale, 8), body, [0, 0, 0], null, true);
  fuse.rotation.x = Math.PI / 2;
  weather(fuse.geometry, 0.2);
  g.add(fuse);
  g.add(mesh(domeGeo(0.4 * scale, 8, 6), glassMat(0x113344), [0, 0.3 * scale, 2 * scale], [-Math.PI / 3, 0, 0]));
  const wingG = boxGeo(2 * scale, 0.1 * scale, 4 * scale, 0.03);
  g.add(mesh(wingG, body, [-0.5 * scale, -0.1 * scale, 0], [0, -0.4, 0], true));
  g.add(mesh(wingG, body, [0.5 * scale, -0.1 * scale, 0], [0, 0.4, 0], true));
  const tailG = boxGeo(1 * scale, 0.1 * scale, 1.5 * scale, 0.02);
  g.add(mesh(tailG, body, [-1 * scale, 0.5 * scale, -2 * scale], [0, 0, -0.5]));
  g.add(mesh(tailG, body, [1 * scale, 0.5 * scale, -2 * scale], [0, 0, 0.5]));
  const exhaustG = cylGeo(0.25 * scale, 0.3 * scale, 0.5 * scale, 8);
  g.add(mesh(exhaustG, glowMat(0x44aaff, 2), [-0.4 * scale, 0, -2.5 * scale], [Math.PI / 2, 0, 0]));
  g.add(mesh(exhaustG, glowMat(0x44aaff, 2), [0.4 * scale, 0, -2.5 * scale], [Math.PI / 2, 0, 0]));
  const canardG = boxGeo(0.8 * scale, 0.05 * scale, 1 * scale, 0.02);
  g.add(mesh(canardG, body, [-1 * scale, 0, 1.5 * scale]));
  g.add(mesh(canardG, body, [1 * scale, 0, 1.5 * scale]));
  if (dl() >= 1) for (const sx of [-1.1, 1.1])
    g.add(mesh(cylGeo(0.12 * scale, 0.12 * scale, 1.6 * scale, 6), metalMat(0x666666, 0.45, 0.65), [sx * scale, -0.2 * scale, 0.3 * scale], [Math.PI / 2, 0, 0]));
  if (dl() >= 2) g.add(mesh(coneGeo(0.14 * scale, 0.5 * scale, 8), metalMat(0x333333, 0.5, 0.7), [0, 0.05 * scale, 2.9 * scale], [Math.PI / 2, 0, 0]));
  navLights(g, [-1.4 * scale, 0, 0.5], [1.4 * scale, 0, 0.5], null);
  g.userData.muzzleOffset = new THREE.Vector3(0, 0, 3 * scale);
  return g;
}

// ---------- SMALL / SPECIAL ----------
function buildMinigunnerVehicle(g, color) {
  const body = matteMat(color);
  const chassis = mesh(boxGeo(3.5, 1, 5, 0.06), metalMat(0x444444, 0.6, 0.5), [0, 0.8, 0], null, true);
  const cab = mesh(boxGeo(3, 2, 3, 0.08), body, [0, 2, 0.5], null, true);
  weather(chassis.geometry);
  weather(cab.geometry);
  g.add(chassis, cab);
  headlights(g, 2.2, 2.05, [-1, 1]);
  const turretM = mesh(cylGeo(1.2, 1.5, 1, 8), metalMat(0x444444, 0.55, 0.55), [0, 2.8, 1.5], null, true);
  g.add(turretM);
  const gunMat = gunmetalMat();
  const barrelG = cylGeo(0.3, 0.3, 2.5, 6);
  g.add(mesh(barrelG, gunMat, [0, 2.8, 3.5], [Math.PI / 2, 0, 0]));
  g.add(mesh(barrelG, gunMat, [0.6, 2.8, 3.5], [Math.PI / 2, 0, 0]));
  g.add(mesh(barrelG, gunMat, [-0.6, 2.8, 3.5], [Math.PI / 2, 0, 0]));
  if (dl() >= 1) g.add(mesh(cylGeo(0.75, 0.75, 0.5, 10), metalMat(0x333333, 0.5, 0.6), [0, 2.8, 2.6], [Math.PI / 2, 0, 0]));
  if (dl() >= 2) g.add(mesh(boxGeo(0.7, 0.5, 0.9, 0.03), canvasMat(), [1.3, 2.6, 0]));
  for (const p of [[-1.7, 0.6, 2], [1.7, 0.6, 2], [-1.7, 0.6, -2], [1.7, 0.6, -2]])
    roadWheel(g, p[0], p[1], p[2], 0.7, 0.4);
  g.userData.muzzleOffset = new THREE.Vector3(0, 2.8, 4.8);
  return g;
}

function buildMegaMedic(g, color) {
  const body = matteMat(color);
  const steel = metalMat(0x333333, 0.55, 0.6);
  const cross = glowMat(0x44ff44, 1.5);
  const chassis = mesh(boxGeo(3.5, 1, 6, 0.06), steel, [0, 0.8, 0], null, true);
  const cab = mesh(boxGeo(3, 2, 2.5, 0.08), body, [0, 2, 2.5], null, true);
  const medModule = mesh(boxGeo(3.2, 2.5, 4, 0.08), body, [0, 2.5, -1], null, true);
  weather(chassis.geometry);
  weather(cab.geometry);
  weather(medModule.geometry);
  g.add(chassis, cab, medModule);
  g.add(mesh(boxGeo(2.5, 0.4, 0.1, 0.02), cross, [0, 2.8, 1.01]));
  g.add(mesh(boxGeo(0.4, 2.5, 0.1, 0.02), cross, [0, 2.8, 1.01]));
  g.add(mesh(boxGeo(2.8, 1, 0.1, 0.02), glassMat(0x224422), [0, 2.8, 3.8]));
  headlights(g, 1.9, 3.8, [-1, 1]);
  if (dl() >= 1) g.add(mesh(cylGeo(0.5, 0.5, 0.12, 8), cross, [0, 4, -1.5]));
  for (const p of [[-1.7, 0.6, 2], [1.7, 0.6, 2], [-1.7, 0.6, -2], [1.7, 0.6, -2]])
    roadWheel(g, p[0], p[1], p[2], 0.7, 0.4);
  return g;
}

function buildMinigunner(g, color) {
  const body = matteMat(color);
  const gunMat = gunmetalMat();
  const torso = mesh(cylGeo(0.5, 0.6, 1.5, 6), body, [0, 1, 0], null, true);
  const head = mesh(sphereGeo(0.35, 8, 6), body, [0, 1.9, 0]);
  g.add(torso, head);
  g.add(mesh(cylGeo(0.08, 0.08, 1.5, 4), gunMat, [0.4, 1.3, 0.8], [Math.PI / 2, 0, 0]));
  g.add(mesh(cylGeo(0.08, 0.08, 1.5, 4), gunMat, [0.6, 1.3, 0.8], [Math.PI / 2, 0, 0]));
  if (dl() >= 1) {
    g.add(mesh(cylGeo(0.16, 0.16, 0.35, 8), metalMat(0x333333, 0.5, 0.6), [0.5, 1.3, 0.2], [Math.PI / 2, 0, 0]));
    g.add(mesh(boxGeo(0.5, 0.6, 0.25, 0.04), canvasMat(), [0, 1.1, -0.45]));
  }
  return g;
}
// ---------- BUILDINGS / BASES ---------------------------------------------
function baseGeometry(geometry, strength) {
  return weather(seedWeather(geometry), strength);
}

export function createBaseMesh(size = 1, isPlayer = false) {
  const group = new THREE.Group();
  const baseColor = isPlayer ? 0x2266aa : 0xaa3333;
  const wallMaterial = matteMat(0x555555);
  const hqMaterial = matteMat(baseColor);
  const glowColor = isPlayer ? 0x44aaff : 0xff4444;
  const wall = enableShadows(new THREE.Mesh(baseGeometry(new THREE.BoxGeometry(20 * size, 4, 20 * size), 0.4), wallMaterial), true);
  wall.position.y = 2;
  const trim = new THREE.Mesh(new THREE.BoxGeometry(20.2 * size, 0.2, 20.2 * size), glowMat(glowColor, 1));
  trim.position.y = 4.1;
  group.add(trim);
  const hq = enableShadows(new THREE.Mesh(baseGeometry(new THREE.BoxGeometry(8 * size, 8, 8 * size), 0.25), hqMaterial), true);
  hq.position.y = 8;
  const windowMaterial = glowMat(glowColor, 0.8);
  for (let i = 0; i < 3; i++) {
    const window = new THREE.Mesh(new THREE.BoxGeometry(8.1 * size, 0.5, 0.5), windowMaterial);
    window.position.set(0, 5 + i * 2.5, 4 * size);
    const backWindow = window.clone();
    backWindow.position.z = -4 * size;
    group.add(window, backWindow);
  }
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(3 * size, 3 * size, 0.1, 16), matteMat(0x333333));
  pad.position.y = 12.1;
  const padLine = new THREE.Mesh(new THREE.RingGeometry(2 * size, 2.2 * size, 16), glowMat(glowColor, 1));
  padLine.rotation.x = -Math.PI / 2;
  padLine.position.y = 12.2;
  group.add(pad, padLine);
  if (dl() >= 1) {
    for (const [px, pz] of [[-2.6, -2.6], [2.6, -2.6], [-2.6, 2.6], [2.6, 2.6]]) {
      const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * size, 0.12 * size, 0.5, 6), lightMat(0xffcc44));
      beacon.position.set(px * size, 12.3, pz * size);
      group.add(beacon);
    }
  }
  if (dl() >= 2) {
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.1 * size, 0.14 * size, 3 * size, 4), metalMat(0x777777, 0.5, 0.6));
    mast.position.set(-3 * size, 13.5, -3 * size);
    const dish = new THREE.Mesh(new THREE.BoxGeometry(1.6 * size, 1 * size, 0.15), glassMat(0x88ccff));
    dish.position.set(-3 * size, 15 * size, -3 * size);
    group.add(mast, dish);
  }
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 6), metalMat(0x888888, 0.5, 0.6));
  pole.position.set(0, 15, 0);
  const flag = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 0.1), matteMat(baseColor));
  flag.position.set(1.5, 16, 0);
  flag.userData.isFlag = true;
  group.add(wall, hq, pole, flag);
  return group;
}

export function createShipyardMesh(size = 1, isPlayer = false) {
  const group = new THREE.Group();
  const baseColor = isPlayer ? 0x2266aa : 0xaa3333;
  const concreteMaterial = matteMat(0x555555);
  const metal = metalMat(0x777777, 0.6, 0.8);
  const glowColor = isPlayer ? 0x44aaff : 0xff4444;
  const dock = enableShadows(new THREE.Mesh(baseGeometry(new THREE.BoxGeometry(24 * size, 1.5, 20 * size), 0.45), concreteMaterial), true);
  dock.position.y = 0.75;
  const building = enableShadows(new THREE.Mesh(baseGeometry(new THREE.BoxGeometry(10 * size, 6, 8 * size), 0.3), matteMat(baseColor)), true);
  building.position.set(-4 * size, 4.5, 0);
  const door = new THREE.Mesh(new THREE.BoxGeometry(4 * size, 4, 0.1), glowMat(glowColor, 0.5));
  door.position.set(-4 * size, 3.5, 4.1 * size);
  group.add(door);
  const craneLeg1 = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(0.5 * size, 12, 0.5 * size), metal), true);
  craneLeg1.position.set(6 * size, 6, 4 * size);
  const craneLeg2 = craneLeg1.clone();
  craneLeg2.position.z = -4 * size;
  const craneArm = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(12 * size, 1, 1 * size), metal));
  craneArm.position.set(8 * size, 12, 0);
  const light = new THREE.Mesh(new THREE.SphereGeometry(0.3 * size, 8, 8), glowMat(0xffffaa, 2));
  light.position.set(12 * size, 11.5, 0);
  group.add(light);
  const waterMaterial = new THREE.MeshStandardMaterial({ color: 0x113355, roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.8 });
  for (const sx of [-1, 1]) {
    const slip = new THREE.Mesh(new THREE.BoxGeometry(4 * size, 0.5, 10 * size), waterMaterial);
    slip.position.set(sx * 4 * size, 0.1, 0);
    group.add(slip);
  }
  if (dl() >= 1) {
    for (let i = 0; i < 3; i++) {
      const crate = new THREE.Mesh(new THREE.BoxGeometry(1.4 * size, 1.4 * size, 1.4 * size), canvasMat(0x6a5a44));
      crate.position.set((2 + i * 2) * size, 2.2, 6 * size);
      group.add(crate);
    }
  }
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 6), metalMat(0x888888, 0.5, 0.6));
  pole.position.set(0, 15, 0);
  const flag = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 0.1), matteMat(baseColor));
  flag.position.set(1.5, 16, 0);
  flag.userData.isFlag = true;
  group.add(dock, building, craneLeg1, craneLeg2, craneArm, pole, flag);
  return group;
}

// ---------- PROJECTILES ----------------------------------------------------
export function createProjectileMesh(domain) {
  if (domain === 'land') {
    const group = new THREE.Group();
    group.add(mesh(cylGeo(0.1, 0.1, 0.8, 6), glowMat(0xffaa00, 2), [0, 0, 0], [Math.PI / 2, 0, 0]));
    const trail = new THREE.Mesh(coneGeo(0.15, 1.5, 6), new THREE.MeshBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.6 }));
    trail.rotation.x = -Math.PI / 2;
    trail.position.z = -1;
    group.add(trail);
    return group;
  }
  if (domain === 'sea') {
    const group = new THREE.Group();
    group.add(mesh(cylGeo(0.3, 0.3, 1.5, 8), metalMat(0x555566, 0.4, 0.8), [0, 0, 0], [Math.PI / 2, 0, 0]));
    const tip = new THREE.Mesh(coneGeo(0.3, 0.5, 8), metalMat(0x888899, 0.3, 0.9));
    tip.rotation.x = Math.PI / 2;
    tip.position.z = 1;
    group.add(tip);
    return group;
  }
  if (domain === 'air') {
    const group = new THREE.Group();
    group.add(mesh(cylGeo(0.15, 0.15, 1.2, 8), metalMat(0xcccccc, 0.5, 0.5), [0, 0, 0], [Math.PI / 2, 0, 0]));
    const finGeometry = boxGeo(0.4, 0.05, 0.2, 0.02);
    for (let i = 0; i < 4; i++) group.add(mesh(finGeometry, metalMat(0x555555, 0.5, 0.6), [0, 0, -0.5], [0, 0, (Math.PI / 2) * i]));
    group.add(mesh(cylGeo(0.1, 0.15, 0.3, 6), glowMat(0xff4400, 3), [0, 0, -0.7], [Math.PI / 2, 0, 0]));
    return group;
  }
  return new THREE.Mesh(sphereGeo(0.3, 8, 8), glowMat(0xffaa00, 2));
}

/** Marks newly-launched carrier fighters visually with a small green ring. */
export function tagAsLaunchedFighter(group) {
  const marker = new THREE.Mesh(
    ringGeo(0.5, 0.7, 16),
    new THREE.MeshBasicMaterial({ color: 0x44ff44, side: THREE.DoubleSide })
  );
  marker.rotation.x = -Math.PI / 2;
  marker.position.y = 3;
  group.add(marker);
}
