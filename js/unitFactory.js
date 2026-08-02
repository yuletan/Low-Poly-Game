// unitFactory.js — tier-aware unit builds and shared visual resources.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { getQuality } from './quality.js';

// Caches are scoped by quality tier so a rebuild never reuses geometry or
// materials with incompatible vertex attributes or shading features.
const MAT_CACHE = new Map();
const GEO_CACHE = new Map();

function cached(map, key, create) {
  if (!map.has(key)) map.set(key, create());
  return map.get(key);
}

export function resetFactoryCaches() {
  for (const geometry of GEO_CACHE.values()) geometry.dispose?.();
  for (const material of MAT_CACHE.values()) material.dispose?.();
  GEO_CACHE.clear();
  MAT_CACHE.clear();
  EDGE_GEO_CACHE.clear();
  SOURCE_GEO_CACHE.clear();
}

const dl = () => getQuality().detailLevel;

function seedWeather(geometry) {
  if (!getQuality().weathering || !geometry?.attributes?.position) return geometry;
  const count = geometry.attributes.position.count;
  geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(new Float32Array(count * 3).fill(1), 3)
  );
  return geometry;
}

function weather(geometry, strength = 0.32) {
  if (!getQuality().weathering || !geometry?.attributes?.color || !geometry.attributes.position) return geometry;
  geometry.computeBoundingBox();
  const { min, max } = geometry.boundingBox;
  const position = geometry.attributes.position;
  const colors = geometry.attributes.color.array;
  const span = Math.max(0.001, max.y - min.y);
  for (let i = 0; i < position.count; i++) {
    const t = (position.getY(i) - min.y) / span;
    const value = 1 - strength * (1 - t) * (1 - t);
    colors[i * 3] = value;
    colors[i * 3 + 1] = value;
    colors[i * 3 + 2] = value;
  }
  geometry.attributes.color.needsUpdate = true;
  return geometry;
}

function markFactoryGeometry(geometry, key) {
  geometry.userData ||= {};
  geometry.userData.factoryKey = key;
  return geometry;
}

function boxGeo(w, h, d, radius = 0.06) {
  const q = getQuality();
  if (!q.rounded) {
    const key = `bx:${q.id}:${w}:${h}:${d}`;
    return cached(GEO_CACHE, key, () => markFactoryGeometry(
      seedWeather(new THREE.BoxGeometry(w, h, d)), key
    ));
  }
  const r = Math.min(radius, w * 0.2, h * 0.2, d * 0.2);
  const key = `rb:${q.id}:${w}:${h}:${d}:${r}`;
  return cached(GEO_CACHE, key, () => markFactoryGeometry(
    seedWeather(new RoundedBoxGeometry(w, h, d, 2, r)), key
  ));
}

function cylGeo(r1, r2, h, segments = 12) {
  const q = getQuality();
  const s = Math.max(5, Math.round(segments * q.segScale));
  return cached(GEO_CACHE, `cy:${q.id}:${r1}:${r2}:${h}:${s}`, () =>
    seedWeather(new THREE.CylinderGeometry(r1, r2, h, s))
  );
}

function sphereGeo(radius, widthSegments = 12, heightSegments = 12) {
  const q = getQuality();
  const sw = Math.max(4, Math.round(widthSegments * q.segScale));
  const sh = Math.max(3, Math.round(heightSegments * q.segScale));
  return cached(GEO_CACHE, `sp:${q.id}:${radius}:${sw}:${sh}`, () =>
    seedWeather(new THREE.SphereGeometry(radius, sw, sh))
  );
}

function domeGeo(radius, widthSegments = 12, heightSegments = 8) {
  const q = getQuality();
  const sw = Math.max(4, Math.round(widthSegments * q.segScale));
  const sh = Math.max(3, Math.round(heightSegments * q.segScale));
  return cached(GEO_CACHE, `dm:${q.id}:${radius}:${sw}:${sh}`, () =>
    seedWeather(new THREE.SphereGeometry(radius, sw, sh, 0, Math.PI * 2, 0, Math.PI / 2))
  );
}

function capsuleGeo(radius, length, radialSegments = 10) {
  const q = getQuality();
  const s = Math.max(6, Math.round(radialSegments * q.segScale));
  return cached(GEO_CACHE, `cp:${q.id}:${radius}:${length}:${s}`, () =>
    seedWeather(new THREE.CapsuleGeometry(radius, length, 4, s))
  );
}

function coneGeo(radius, height, segments = 8) {
  const q = getQuality();
  const s = Math.max(4, Math.round(segments * q.segScale));
  return cached(GEO_CACHE, `cn:${q.id}:${radius}:${height}:${s}`, () =>
    seedWeather(new THREE.ConeGeometry(radius, height, s))
  );
}

function ringGeo(inner, outer, segments = 24) {
  const q = getQuality();
  const s = Math.max(8, Math.round(segments * q.segScale));
  return cached(GEO_CACHE, `rg:${q.id}:${inner}:${outer}:${s}`, () =>
    seedWeather(new THREE.RingGeometry(inner, outer, s))
  );
}

function makeLambert(args) {
  return typeof THREE.MeshLambertMaterial === 'function'
    ? new THREE.MeshLambertMaterial(args)
    : new THREE.MeshStandardMaterial(args);
}

function mkMat(prefix, args, create) {
  return cached(MAT_CACHE, `${getQuality().id}|${prefix}:${args.join(':')}`, create);
}

export function mixColor(a, b, t) {
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);
  return ca.lerp(cb, t).getHex();
}

function matteMat(color) {
  const q = getQuality();
  return mkMat('hull', [color], () => {
    if (q.materialTier === 'lambert') return makeLambert({ color });
    const base = {
      color,
      envMapIntensity: q.envIntensity,
      ...(q.weathering ? { vertexColors: true } : {}),
    };
    if (q.clearcoat) {
      return new THREE.MeshPhysicalMaterial({
        ...base,
        roughness: 0.58,
        metalness: 0.3,
        clearcoat: 0.4,
        clearcoatRoughness: 0.55,
      });
    }
    return new THREE.MeshStandardMaterial({ ...base, roughness: 0.66, metalness: 0.22 });
  });
}

function metalMat(color, roughness = 0.45, metalness = 0.75) {
  const q = getQuality();
  return mkMat('metal', [color, roughness, metalness], () => {
    if (q.materialTier === 'lambert') return makeLambert({ color });
    return new THREE.MeshStandardMaterial({ color, roughness, metalness, envMapIntensity: q.envIntensity });
  });
}

function rubberMat() {
  const q = getQuality();
  return mkMat('rubber', [], () => q.materialTier === 'lambert'
    ? makeLambert({ color: 0x141414 })
    : new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.96, metalness: 0.02 })
  );
}

function gunmetalMat() {
  return metalMat(0x2b3038, 0.34, 0.9);
}

function canvasMat(color = 0x49513f) {
  const q = getQuality();
  return mkMat('canvas', [color], () => q.materialTier === 'lambert'
    ? makeLambert({ color })
    : new THREE.MeshStandardMaterial({
      color,
      roughness: 0.94,
      metalness: 0.02,
      envMapIntensity: q.envIntensity * 0.4,
    })
  );
}

function trackMat() {
  const q = getQuality();
  return mkMat('track', [], () => q.materialTier === 'lambert'
    ? makeLambert({ color: 0x1b1b19 })
    : new THREE.MeshStandardMaterial({ color: 0x1b1b19, roughness: 0.9, metalness: 0.28 })
  );
}

function glassMat(color = 0x112233) {
  const q = getQuality();
  return mkMat('glass', [color], () => {
    if (q.glassTier === 'physical') {
      return new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.06,
        metalness: 0,
        transparent: true,
        opacity: 0.55,
        transmission: 0.35,
        thickness: 0.2,
        emissive: color,
        emissiveIntensity: q.emissives ? 0.2 : 0,
        depthWrite: false,
        envMapIntensity: q.envIntensity,
      });
    }
    if (q.glassTier === 'standard') {
      return new THREE.MeshStandardMaterial({
        color,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.6,
        emissive: color,
        emissiveIntensity: q.emissives ? 0.25 : 0,
        depthWrite: false,
      });
    }
    return makeLambert({
      color,
      transparent: true,
      opacity: 0.55,
      emissive: color,
      emissiveIntensity: q.emissives ? 0.2 : 0,
      depthWrite: false,
    });
  });
}

function glowMat(color, intensity = 1.5) {
  const q = getQuality();
  return mkMat('glow', [color, intensity], () => {
    if (!q.emissives) return new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.2 });
    if (q.materialTier === 'lambert') {
      return makeLambert({ color, emissive: color, emissiveIntensity: intensity * 0.7 });
    }
    return new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: intensity,
      roughness: 0.45,
      metalness: 0.35,
    });
  });
}

function lightMat(color) {
  const q = getQuality();
  return mkMat('light', [color], () => q.emissives
    ? new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.8, roughness: 0.3 })
    : new THREE.MeshStandardMaterial({ color: 0x8a8a8a, roughness: 0.4 })
  );
}

function enableShadows(object, key = false) {
  const q = getQuality();
  if (key) object.userData.keyCaster = true;
  object.castShadow = q.shadowCasters === 'all' || (q.shadowCasters === 'key' && key);
  object.receiveShadow = q.shadows && q.shadowType !== 'off';
  return object;
}

function mesh(geometry, material, position, rotation, key = false) {
  const result = enableShadows(new THREE.Mesh(geometry, material), key);
  if (position) result.position.set(position[0], position[1], position[2]);
  if (rotation) result.rotation.set(rotation[0], rotation[1], rotation[2]);
  return result;
}

// --- Detail kit ------------------------------------------------------------
function roadWheel(group, x, y, z, radius = 0.45, width = 0.9) {
  if (dl() === 0) {
    const simple = new THREE.Mesh(cylGeo(radius, radius, width, 10), trackMat());
    simple.rotation.z = Math.PI / 2;
    simple.position.set(x, y, z);
    group.add(simple);
    return;
  }
  const tire = new THREE.Mesh(cylGeo(radius, radius, width * 0.8, 12), rubberMat());
  const rim = new THREE.Mesh(cylGeo(radius * 0.62, radius * 0.62, width * 0.9, 10), metalMat(0x3a3f36, 0.55, 0.6));
  const hub = new THREE.Mesh(cylGeo(radius * 0.22, radius * 0.22, width * 0.98, 6), gunmetalMat());
  for (const wheel of [tire, rim, hub]) {
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, y, z);
    group.add(wheel);
  }
}

function hatch(parent, x, y, z, radius = 0.35) {
  if (dl() < 1) return;
  const lid = new THREE.Mesh(cylGeo(radius, radius, 0.08, 10), metalMat(0x2f332c, 0.6, 0.4));
  lid.position.set(x, y, z);
  const handle = new THREE.Mesh(boxGeo(radius * 0.9, 0.05, 0.05, 0.02), gunmetalMat());
  handle.position.set(x, y + 0.07, z);
  parent.add(lid, handle);
}

function antenna(parent, x, y, z, height = 2) {
  if (dl() < 1) return;
  const stem = new THREE.Mesh(cylGeo(0.02, 0.035, height, 4), metalMat(0x30342e, 0.6, 0.5));
  stem.position.set(x, y + height / 2, z);
  parent.add(stem);
  if (dl() >= 2) {
    const tip = new THREE.Mesh(sphereGeo(0.05, 6, 5), metalMat(0x1c1f1a, 0.5, 0.5));
    tip.position.set(x, y + height, z);
    parent.add(tip);
  }
}

function headlights(group, y, z, xs = [-1.2, 1.2]) {
  if (dl() < 1) return;
  for (const x of xs) {
    const housing = new THREE.Mesh(cylGeo(0.13, 0.15, 0.1, 8), metalMat(0x26291f, 0.6, 0.5));
    housing.rotation.x = Math.PI / 2;
    housing.position.set(x, y, z);
    const lens = new THREE.Mesh(cylGeo(0.1, 0.1, 0.05, 8), lightMat(0xffeebb));
    lens.rotation.x = Math.PI / 2;
    lens.position.set(x, y, z + 0.06);
    group.add(housing, lens);
  }
}

function exhaustPipe(group, x, y, z, radius = 0.11, length = 0.5, vertical = true) {
  if (dl() < 1) return;
  const pipe = new THREE.Mesh(cylGeo(radius, radius * 1.15, length, 8), metalMat(0x3a3d40, 0.5, 0.8));
  pipe.position.set(x, y, z);
  if (!vertical) pipe.rotation.x = Math.PI / 2;
  const soot = new THREE.Mesh(cylGeo(radius * 0.8, radius * 0.8, 0.06, 8), metalMat(0x15161a, 0.9, 0.2));
  soot.position.copy(pipe.position);
  if (vertical) soot.position.y += length / 2;
  else soot.position.z -= length / 2;
  if (!vertical) soot.rotation.x = Math.PI / 2;
  group.add(pipe, soot);
}

function rivets(parent, points, radius = 0.05) {
  if (dl() < 2) return;
  const geometry = cylGeo(radius, radius, 0.05, 5);
  const material = metalMat(0x20241f, 0.5, 0.7);
  for (const point of points) {
    const rivet = new THREE.Mesh(geometry, material);
    rivet.position.set(point[0], point[1], point[2]);
    if (point[3]) rivet.rotation.x = point[3];
    if (point[4]) rivet.rotation.z = point[4];
    parent.add(rivet);
  }
}

function stowage(parent, x, y, z, w = 1.8, h = 0.6, d = 0.9) {
  if (dl() < 1) return;
  parent.add(mesh(boxGeo(w, h, d, 0.06), canvasMat(), [x, y, z]));
}

function fuelDrum(parent, x, y, z) {
  if (dl() < 2) return;
  const drum = new THREE.Mesh(cylGeo(0.35, 0.35, 0.9, 10), metalMat(0x3d4437, 0.7, 0.3));
  drum.rotation.x = Math.PI / 2;
  drum.position.set(x, y, z);
  parent.add(drum);
}

function navLights(group, port, starboard, stern) {
  if (dl() < 2 || !getQuality().emissives) return;
  const add = (position, color) => {
    const light = new THREE.Mesh(boxGeo(0.14, 0.14, 0.14, 0.02), lightMat(color));
    light.position.set(position[0], position[1], position[2]);
    light.userData.noShadow = true;
    group.add(light);
  };
  add(port, 0xff2222);
  add(starboard, 0x22ff44);
  if (stern) add(stern, 0xeeeeff);
}

// --- Outlines --------------------------------------------------------------
const EDGE_MAT = new THREE.LineBasicMaterial({
  color: 0x000000,
  transparent: true,
  opacity: 0.22,
  depthTest: true,
});
const EDGE_GEO_CACHE = new Map();
const SOURCE_GEO_CACHE = new Map();

function sharedSourceGeometry(geometry) {
  const factoryKey = geometry?.userData?.factoryKey;
  if (!factoryKey && !geometry?.parameters) return geometry;
  let signature;
  try {
    signature = factoryKey || `${getQuality().id}:${geometry.type}:${JSON.stringify(geometry.parameters)}`;
  } catch {
    return geometry;
  }
  const existing = SOURCE_GEO_CACHE.get(signature);
  if (existing && existing !== geometry) {
    geometry.dispose();
    return existing;
  }
  SOURCE_GEO_CACHE.set(signature, geometry);
  return geometry;
}

function edgeGeoFor(geometry) {
  let edges = EDGE_GEO_CACHE.get(geometry);
  if (!edges) {
    edges = new THREE.EdgesGeometry(geometry, 35);
    EDGE_GEO_CACHE.set(geometry, edges);
  }
  return edges;
}

function finishModel(group, { outlines = true } = {}) {
  const wantEdges = outlines && getQuality().outlines;
  const outlineMeshes = [];
  group.traverse(object => {
    if (!object.isMesh) return;
    enableShadows(object, object.userData.keyCaster === true);
    if (object.geometry) {
      object.geometry = sharedSourceGeometry(object.geometry);
      if (!object.geometry.attributes?.normal) object.geometry.computeVertexNormals?.();
      object.geometry.computeBoundingSphere?.();
    }
    if (!object.material?.transparent && wantEdges) outlineMeshes.push(object);
  });
  for (const object of outlineMeshes) {
    const edges = new THREE.LineSegments(edgeGeoFor(object.geometry), EDGE_MAT);
    edges.userData.noShadow = true;
    edges.userData.isEdgeOutline = true;
    edges.renderOrder = 2;
    object.add(edges);
  }
  return group;
}

const UNIT_BUILDERS = {
  infantry: buildInfantry,
  tank: buildTank,
  heavyTank: buildHeavyTank,
  crusher: buildCrusher,
  artillery: buildArtillery,
  missileDefense: buildMissileDefense,
  coastal: buildCoastal,
  mlrs: buildMLRS,
  healer: buildHealer,
  medHeli: buildMedHeli,
  frigate: buildFrigate,
  cruiser: buildCruiser,
  submarine: buildSubmarine,
  carrier: buildCarrier,
  transport: buildTransport,
  heli: buildHeli,
  gunship: buildGunship,
  escortJet: buildEscortJet,
  b2: buildB2,
  escortBomber: buildEscortBomber,
  minigunnerVehicle: buildMinigunnerVehicle,
  megaMedic: buildMegaMedic,
  minigunner: buildMinigunner,
  destroyer: (group, color) => buildShip(group, color, 1.0),
  battleship: (group, color) => buildShip(group, color, 1.6),
  fighter: (group, color) => buildJet(group, color, 1.0),
  bomber: (group, color) => buildJet(group, color, 1.4),
};

/** Returns a THREE.Group representing the unit. */
export function createUnitMesh(type, color, faction) {
  const teamColor = faction === 'player' ? 0x3366cc : 0xcc3333;
  const tint = mixColor(color, teamColor, 0.5);
  const group = new THREE.Group();
  group.userData.turret = null;
  group.userData.muzzleOffset = null;
  const builder = UNIT_BUILDERS[type];
  const unit = builder ? builder(group, tint) : group;
  return finishModel(unit);
}

// ---------- LAND -----------------------------------------------------------
function buildInfantry(group, color) {
  const uniform = matteMat(color);
  const vest = matteMat(mixColor(color, 0x1a1d16, 0.55));
  const kit = metalMat(0x2c2f26, 0.7, 0.3);
  const skin = matteMat(0xc9a184);
  const legGeometry = boxGeo(0.28, 0.9, 0.28, 0.05);
  for (const sx of [-0.2, 0.2]) {
    group.add(mesh(legGeometry, uniform, [sx, 0.55, 0]));
    group.add(mesh(boxGeo(0.3, 0.28, 0.42, 0.04), rubberMat(), [sx, 0.14, 0.05]));
    if (dl() >= 1) group.add(mesh(boxGeo(0.24, 0.22, 0.12, 0.04), kit, [sx, 0.62, 0.17]));
  }
  const torso = mesh(boxGeo(0.78, 1.05, 0.44, 0.06), uniform, [0, 1.52, 0], null, true);
  const vestMesh = mesh(boxGeo(0.84, 0.78, 0.5, 0.05), vest, [0, 1.62, 0]);
  const pack = mesh(boxGeo(0.6, 0.7, 0.28, 0.05), vest, [0, 1.6, -0.34]);
  group.add(torso, vestMesh, pack);
  if (dl() >= 1) {
    group.add(mesh(boxGeo(0.2, 0.24, 0.1, 0.03), kit, [0.22, 1.42, 0.26]));
    group.add(mesh(boxGeo(0.2, 0.24, 0.1, 0.03), kit, [-0.22, 1.42, 0.26]));
  }
  const armGeometry = boxGeo(0.22, 0.9, 0.22, 0.05);
  group.add(mesh(armGeometry, uniform, [-0.53, 1.45, 0.05], [0.15, 0, 0.08]));
  group.add(mesh(armGeometry, uniform, [0.53, 1.45, 0.18], [-0.55, 0, -0.08]));
  group.add(mesh(boxGeo(0.18, 0.2, 0.18, 0.04), kit, [-0.55, 0.98, 0.12]));
  group.add(mesh(boxGeo(0.18, 0.2, 0.18, 0.04), kit, [0.5, 1.02, 0.5]));
  group.add(mesh(sphereGeo(0.24, 10, 8), skin, [0, 2.24, 0]));
  group.add(mesh(domeGeo(0.3, 10, 6), vest, [0, 2.26, 0]));
  if (dl() >= 1) group.add(mesh(cylGeo(0.31, 0.33, 0.06, 10), vest, [0, 2.26, 0]));

  const rifle = new THREE.Group();
  rifle.add(mesh(boxGeo(0.09, 0.14, 0.7, 0.02), gunmetalMat(), [0, 0, 0]));
  rifle.add(mesh(cylGeo(0.025, 0.025, 0.5, 6), gunmetalMat(), [0, 0.02, 0.55], [Math.PI / 2, 0, 0]));
  rifle.add(mesh(boxGeo(0.07, 0.28, 0.12, 0.02), kit, [0, -0.18, 0.05], [0.35, 0, 0]));
  rifle.add(mesh(boxGeo(0.08, 0.16, 0.3, 0.02), kit, [0, -0.03, -0.45]));
  rifle.position.set(0.5, 1.28, 0.55);
  rifle.rotation.x = -0.25;
  group.add(rifle);
  if (dl() >= 2) group.add(mesh(boxGeo(0.36, 0.09, 0.08, 0.02), glassMat(0x223322), [0, 2.22, 0.24]));
  return group;
}

function buildTank(group, color) {
  const hull = matteMat(color);
  const steel = metalMat(0x33383b, 0.55, 0.65);
  const lower = mesh(boxGeo(4.5, 1, 7, 0.12), hull, [0, 0.8, 0], null, true);
  const upper = mesh(boxGeo(4, 0.8, 5, 0.1), hull, [0, 1.7, -0.5], null, true);
  const glacis = mesh(boxGeo(4, 1, 2, 0.1), hull, [0, 1.5, 3], [-0.4, 0, 0], true);
  weather(lower.geometry);
  weather(upper.geometry);
  weather(glacis.geometry);
  group.add(lower, upper, glacis);
  headlights(group, 1.55, 3.55, [-1.3, 1.3]);
  stowage(group, 0, 1.95, -3.1);
  if (dl() >= 2) {
    fuelDrum(group, -1.2, 1.85, -3.2);
    fuelDrum(group, 1.2, 1.85, -3.2);
  }

  const trackGeometry = boxGeo(0.8, 1.2, 7.5, 0.08);
  const leftTrack = mesh(trackGeometry, trackMat(), [-2.4, 0.6, 0]);
  const rightTrack = mesh(trackGeometry, trackMat(), [2.4, 0.6, 0]);
  weather(leftTrack.geometry, 0.45);
  group.add(leftTrack, rightTrack);
  const fenderGeometry = boxGeo(1, 0.08, 7.6, 0.03);
  group.add(mesh(fenderGeometry, hull, [-2.4, 1.28, 0]), mesh(fenderGeometry, hull, [2.4, 1.28, 0]));
  for (let i = -3; i <= 3; i++) {
    roadWheel(group, -2.8, 0.45, i * 1.1);
    roadWheel(group, 2.8, 0.45, i * 1.1);
  }
  for (const z of [-3.7, 3.7]) {
    roadWheel(group, -2.8, 0.5, z, 0.5, 0.9);
    roadWheel(group, 2.8, 0.5, z, 0.5, 0.9);
  }
  if (dl() >= 1) {
    for (const z of [-2.2, 0, 2.2]) {
      roadWheel(group, -2.7, 1.15, z, 0.18, 0.7);
      roadWheel(group, 2.7, 1.15, z, 0.18, 0.7);
    }
  }

  const turret = new THREE.Group();
  const turretBase = mesh(boxGeo(3, 1, 3.5, 0.1), hull, [0, 2.4, 0], null, true);
  const turretFront = mesh(boxGeo(3, 1, 1.5, 0.1), hull, [0, 2.4, 2], [-0.3, 0, 0], true);
  const bustle = mesh(boxGeo(2.4, 0.7, 1.1, 0.08), hull, [0, 2.4, -2.3]);
  turret.add(turretBase, turretFront, bustle);
  hatch(turret, -0.8, 2.95, -0.5, 0.4);
  if (dl() >= 1) {
    turret.add(mesh(cylGeo(0.04, 0.04, 1.2, 6), gunmetalMat(), [-0.8, 3.3, 0.1], [Math.PI / 2, 0, 0]));
    turret.add(mesh(boxGeo(0.16, 0.14, 0.3, 0.02), steel, [-0.8, 3.22, -0.35]));
  }
  turret.add(mesh(cylGeo(0.2, 0.2, 5, 20), gunmetalMat(), [0, 2.5, 3.5], [Math.PI / 2, 0, 0]));
  turret.add(mesh(boxGeo(1.3, 1.3, 0.5, 0.06), canvasMat(mixColor(color, 0x2c2f28, 0.5)), [0, 2.5, 3.0]));
  turret.add(mesh(cylGeo(0.3, 0.3, 0.6, 12), steel, [0, 2.5, 4.5], [Math.PI / 2, 0, 0]));
  turret.add(mesh(cylGeo(0.28, 0.28, 0.35, 12), gunmetalMat(), [0, 2.5, 5.9], [Math.PI / 2, 0, 0]));
  if (dl() >= 1) {
    for (let i = 0; i < 3; i++) {
      turret.add(mesh(boxGeo(0.4, 0.4, 0.1, 0.02), steel, [-1 + i, 2.4, 2.8], [-0.3, 0, 0]));
    }
  }
  antenna(turret, 1, 2.9, -1.4, 2);
  rivets(turret, [[-1.4, 2.5, 2.1], [1.4, 2.5, 2.1], [-1.4, 2.5, -2.2], [1.4, 2.5, -2.2]]);
  group.add(turret);
  group.userData.turret = turret;
  group.userData.muzzleOffset = new THREE.Vector3(0, 2.5, 6);
  return group;
}

function buildHeavyTank(group, color) {
  const hull = matteMat(color);
  const steel = metalMat(0x33383b, 0.55, 0.65);
  const lower = mesh(boxGeo(6, 1.4, 9, 0.15), hull, [0, 1, 0], null, true);
  const upper = mesh(boxGeo(5.5, 1, 7, 0.12), hull, [0, 2.2, -0.5], null, true);
  const glacis = mesh(boxGeo(5.5, 1.4, 2.5, 0.12), hull, [0, 2, 4], [-0.35, 0, 0], true);
  weather(lower.geometry);
  weather(upper.geometry);
  weather(glacis.geometry);
  group.add(lower, upper, glacis);
  headlights(group, 2.1, 4.6, [-1.8, 1.8]);
  const skirtMaterial = metalMat(0x444444, 0.6, 0.3);
  group.add(mesh(boxGeo(0.3, 1.5, 8, 0.05), skirtMaterial, [-3.2, 1, 0]));
  group.add(mesh(boxGeo(0.3, 1.5, 8, 0.05), skirtMaterial, [3.2, 1, 0]));
  if (dl() >= 2) {
    for (const sx of [-3.2, 3.2]) {
      for (const z of [-2.6, 0, 2.6]) group.add(mesh(boxGeo(0.32, 0.5, 1.4, 0.03), rubberMat(), [sx, 0.15, z]));
    }
  }
  stowage(group, 0, 2.7, -3.8, 2.4, 0.7, 1.1);
  const trackGeometry = boxGeo(1, 1.5, 9.5, 0.1);
  const leftTrack = mesh(trackGeometry, trackMat(), [-2.8, 0.7, 0]);
  weather(leftTrack.geometry, 0.45);
  group.add(leftTrack, mesh(trackGeometry, trackMat(), [2.8, 0.7, 0]));
  for (let i = -4; i <= 4; i++) {
    roadWheel(group, -3.15, 0.55, i * 1.1, 0.55, 1.1);
    roadWheel(group, 3.15, 0.55, i * 1.1, 0.55, 1.1);
  }
  for (const z of [-4.4, 4.4]) {
    roadWheel(group, -3.15, 0.6, z, 0.6, 1.1);
    roadWheel(group, 3.15, 0.6, z, 0.6, 1.1);
  }
  if (dl() >= 1) {
    for (const z of [-3, 0, 3]) {
      roadWheel(group, -3.05, 1.45, z, 0.2, 0.9);
      roadWheel(group, 3.05, 1.45, z, 0.2, 0.9);
    }
  }

  const turret = new THREE.Group();
  turret.add(mesh(boxGeo(4, 1.2, 4.5, 0.12), hull, [0, 3.1, 0], null, true));
  turret.add(mesh(boxGeo(4, 1.2, 2, 0.1), hull, [0, 3.1, 2.5], [-0.25, 0, 0], true));
  turret.add(mesh(boxGeo(3.4, 1, 1.4, 0.1), hull, [0, 3.1, -2.9]));
  hatch(turret, -1, 3.75, -1, 0.5);
  hatch(turret, 1, 3.72, -0.5, 0.4);
  if (dl() >= 1) turret.add(mesh(cylGeo(0.05, 0.05, 1.4, 6), gunmetalMat(), [-1, 4.1, 0], [Math.PI / 2, 0, 0]));
  turret.add(mesh(cylGeo(0.35, 0.35, 6, 20), gunmetalMat(), [0, 3.2, 5.5], [Math.PI / 2, 0, 0]));
  turret.add(mesh(boxGeo(1.9, 1.7, 0.6, 0.08), steel, [0, 3.2, 4.3]));
  turret.add(mesh(cylGeo(0.5, 0.5, 0.8, 14), gunmetalMat(), [0, 3.2, 8.5], [Math.PI / 2, 0, 0]));
  if (dl() >= 1) {
    for (let i = 0; i < 4; i++) turret.add(mesh(boxGeo(0.5, 0.5, 0.15, 0.03), steel, [-1.5 + i, 3.1, 2.2], [-0.25, 0, 0]));
    turret.add(mesh(cylGeo(0.25, 0.25, 0.3, 10), glassMat(0xff4400), [-1.8, 3.5, 2.5], [Math.PI / 2, 0, 0]));
  }
  antenna(turret, 1.5, 3.7, -1.5, 2.5);
  rivets(turret, [[-1.9, 3.3, 2.6], [1.9, 3.3, 2.6], [-1.9, 3.3, -2.8], [1.9, 3.3, -2.8], [0, 3.8, -2.9]]);
  group.add(turret);
  group.userData.turret = turret;
  group.userData.muzzleOffset = new THREE.Vector3(0, 3.2, 9);
  return group;
}

function buildCrusher(group, color) {
  const hull = matteMat(color);
  const plate = metalMat(0x444444, 0.6, 0.5);
  const body = mesh(boxGeo(7, 1.8, 10, 0.1), hull, [0, 1.2, 0], null, true);
  const frontPlate = mesh(boxGeo(7, 2, 3, 0.1), hull, [0, 2, 4.5], [-0.3, 0, 0], true);
  weather(body.geometry);
  weather(frontPlate.geometry);
  group.add(body, frontPlate);
  if (dl() >= 1) {
    for (let i = -2; i <= 2; i++) {
      group.add(mesh(boxGeo(0.5, 1.6, 0.06, 0.01), i % 2 ? matteMat(0xd8b430) : matteMat(0x1c1c1c), [i * 1.2, 1.9, 5.95], [-0.3, 0, 0]));
    }
  }
  group.add(mesh(boxGeo(0.5, 2, 9, 0.05), plate, [-3.7, 1.5, 0]));
  group.add(mesh(boxGeo(0.5, 2, 9, 0.05), plate, [3.7, 1.5, 0]));
  headlights(group, 2.6, 5.2, [-2.6, 2.6]);
  const trackGeometry = boxGeo(1.2, 1.8, 10.5, 0.08);
  const leftTrack = mesh(trackGeometry, trackMat(), [-3.2, 0.9, 0]);
  weather(leftTrack.geometry, 0.5);
  group.add(leftTrack, mesh(trackGeometry, trackMat(), [3.2, 0.9, 0]));
  for (let i = -4; i <= 4; i++) {
    roadWheel(group, -3.55, 0.6, i * 1.2, 0.6, 1.3);
    roadWheel(group, 3.55, 0.6, i * 1.2, 0.6, 1.3);
  }
  for (const z of [-5.2, 5.2]) {
    roadWheel(group, -3.55, 0.65, z, 0.7, 1.3);
    roadWheel(group, 3.55, 0.65, z, 0.7, 1.3);
  }
  if (dl() >= 1) {
    for (const z of [-3.3, 0, 3.3]) {
      roadWheel(group, -3.45, 1.8, z, 0.25, 1.1);
      roadWheel(group, 3.45, 1.8, z, 0.25, 1.1);
    }
  }
  stowage(group, -1.5, 2.2, -4.4, 2, 0.7, 1.2);
  stowage(group, 1.5, 2.2, -4.4, 2, 0.7, 1.2);

  const turret = new THREE.Group();
  turret.add(mesh(boxGeo(4.5, 1.5, 5, 0.1), hull, [0, 3, 0], null, true));
  hatch(turret, -1, 3.8, -1, 0.5);
  const barrelGeometry = cylGeo(0.25, 0.25, 5, 14);
  turret.add(mesh(barrelGeometry, gunmetalMat(), [-0.6, 3.2, 4], [Math.PI / 2, 0, 0]));
  turret.add(mesh(barrelGeometry, gunmetalMat(), [0.6, 3.2, 4], [Math.PI / 2, 0, 0]));
  if (dl() >= 1) {
    for (const sx of [-1.6, 1.6]) {
      turret.add(mesh(cylGeo(0.12, 0.12, 1.4, 8), metalMat(0x888c90, 0.25, 0.95), [sx, 2.9, 1.8], [0.9, 0, 0]));
    }
  }
  rivets(turret, [[-2.1, 3.2, 2.4], [2.1, 3.2, 2.4], [-2.1, 3.2, -2.4], [2.1, 3.2, -2.4]]);
  group.add(turret);
  const shieldRing = new THREE.Mesh(
    ringGeo(38, 42, 48),
    new THREE.MeshBasicMaterial({ color: 0x4466ff, transparent: true, opacity: 0.15, side: THREE.DoubleSide, depthTest: false })
  );
  shieldRing.rotation.x = -Math.PI / 2;
  shieldRing.position.y = 0.3;
  shieldRing.renderOrder = 894;
  group.add(shieldRing);
  group.userData.shieldRing = shieldRing;
  group.userData.turret = turret;
  group.userData.muzzleOffset = new THREE.Vector3(0, 3.2, 6.5);
  return group;
}

function buildArtillery(group, color) {
  const hull = matteMat(color);
  const steel = metalMat(0x333333, 0.5, 0.7);
  const chassis = mesh(boxGeo(3.5, 1, 5, 0.08), hull, [0, 0.8, 0], null, true);
  weather(chassis.geometry);
  group.add(chassis);
  headlights(group, 1.1, 2.55, [-1.1, 1.1]);
  const outriggerGeometry = boxGeo(0.3, 0.5, 2, 0.04);
  for (const sx of [-2.2, 2.2]) {
    group.add(mesh(outriggerGeometry, steel, [sx, 0.4, 0]));
    if (dl() >= 1) group.add(mesh(boxGeo(0.5, 0.12, 0.5, 0.02), steel, [sx, 0.12, 0]));
  }
  const turret = new THREE.Group();
  turret.add(mesh(cylGeo(1.5, 1.8, 0.8, 8), hull, [0, 1.6, 0], null, true));
  turret.add(mesh(boxGeo(1.2, 1.5, 2, 0.06), hull, [0, 2.2, 0]));
  hatch(turret, 0, 2.9, -0.6, 0.35);
  turret.add(mesh(cylGeo(0.25, 0.25, 7, 12), gunmetalMat(), [0, 3.2, 3], [Math.PI / 2.2, 0, 0]));
  turret.add(mesh(cylGeo(0.4, 0.4, 0.5, 10), gunmetalMat(), [0, 4.3, 5.8], [Math.PI / 2.2, 0, 0]));
  const pistonGeometry = cylGeo(0.1, 0.1, 2, 6);
  const pistonMaterial = metalMat(0x888888, 0.3, 0.9);
  turret.add(mesh(pistonGeometry, pistonMaterial, [-0.8, 2.5, 1.5], [Math.PI / 3, 0, 0]));
  turret.add(mesh(pistonGeometry, pistonMaterial, [0.8, 2.5, 1.5], [Math.PI / 3, 0, 0]));
  if (dl() >= 2) {
    for (let i = 0; i < 3; i++) turret.add(mesh(boxGeo(0.5, 0.35, 0.7, 0.03), canvasMat(), [-0.9 + i * 0.9, 1.9, -1.5]));
  }
  antenna(turret, 1.2, 2.2, -1.2, 1.8);
  group.add(turret);
  group.userData.turret = turret;
  group.userData.muzzleOffset = new THREE.Vector3(0, 4.5, 6);
  return group;
}

function buildMissileDefense(group, color) {
  const hull = matteMat(color);
  const dark = metalMat(0x222222, 0.6, 0.5);
  const base = mesh(boxGeo(4, 0.8, 4, 0.06), hull, [0, 0.6, 0], null, true);
  weather(base.geometry);
  group.add(base);
  headlights(group, 0.85, 2.05, [-1.3, 1.3]);
  group.add(mesh(boxGeo(1, 3, 1, 0.05), dark, [-1.2, 2.5, -1.2]));
  group.add(mesh(boxGeo(2, 2, 0.2, 0.02), glassMat(0x44aaff), [-1.2, 4, -1.2], [0, Math.PI / 4, 0]));
  if (dl() >= 1) group.add(mesh(boxGeo(2.2, 0.12, 0.3, 0.02), dark, [-1.2, 3.05, -1.2], [0, Math.PI / 4, 0]));

  const turret = new THREE.Group();
  turret.add(mesh(boxGeo(3, 0.5, 3, 0.05), hull, [0, 1.3, 0], null, true));
  const cellGeometry = boxGeo(0.6, 1.5, 0.6, 0.03);
  const cellMaterial = metalMat(0x444444, 0.55, 0.5);
  const tipMaterial = glowMat(0xff3300, 1);
  for (let x = -1; x <= 1; x++) {
    for (let z = -1; z <= 1; z++) {
      turret.add(mesh(cellGeometry, cellMaterial, [x * 0.8, 2.1, z * 0.8]));
      const tip = new THREE.Mesh(coneGeo(0.2, 0.4, 6), tipMaterial);
      tip.position.set(x * 0.8, 2.9, z * 0.8);
      turret.add(tip);
    }
  }
  if (dl() >= 2) turret.add(mesh(boxGeo(0.3, 0.3, 0.3, 0.02), lightMat(0xffaa00), [1.3, 1.7, 1.3]));
  group.add(turret);
  group.userData.turret = turret;
  group.userData.muzzleOffset = new THREE.Vector3(0, 3, 0);
  return group;
}

function buildMLRS(group, color) {
  const cab = matteMat(color);
  const dark = metalMat(0x222222, 0.6, 0.5);
  const cabMesh = mesh(boxGeo(2.8, 1.5, 2, 0.08), cab, [0, 1.5, 2.5], null, true);
  weather(cabMesh.geometry);
  group.add(cabMesh);
  group.add(mesh(boxGeo(2.6, 0.8, 0.1, 0.02), glassMat(0x223344), [0, 2, 3.5]));
  const chassis = mesh(boxGeo(2.8, 1, 5, 0.06), dark, [0, 0.8, 0], null, true);
  weather(chassis.geometry);
  group.add(chassis);
  headlights(group, 1.4, 3.55, [-0.9, 0.9]);
  for (const p of [[-1.4, 0.6, 2.5], [1.4, 0.6, 2.5], [-1.4, 0.6, -1.5], [1.4, 0.6, -1.5]]) {
    roadWheel(group, p[0], p[1], p[2], 0.6, 0.4);
  }
  if (dl() >= 2) group.add(mesh(cylGeo(0.5, 0.5, 0.35, 10), rubberMat(), [0, 0.7, -2.6], [Math.PI / 2, 0, 0]));

  const turret = new THREE.Group();
  const mount = mesh(boxGeo(2.4, 0.8, 2, 0.05), cab, [0, 1.8, 0]);
  const pod = mesh(boxGeo(2.2, 1.5, 3.5, 0.06), metalMat(0x445544, 0.6, 0.4), [0, 3, -0.5], [-0.4, 0, 0], true);
  turret.add(mount, pod);
  const tubeGeometry = cylGeo(0.2, 0.2, 0.2, 6);
  const tubeMaterial = metalMat(0x111111, 0.7, 0.4);
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 4; column++) {
      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
      tube.rotation.x = Math.PI / 2;
      tube.position.set(-0.75 + column * 0.5, 2.5 + row * 0.5, 1.2);
      pod.add(tube);
    }
  }
  if (dl() >= 1) turret.add(mesh(boxGeo(2.24, 0.08, 3.54, 0.02), dark, [0, 3.78, -0.5], [-0.4, 0, 0]));
  group.add(turret);
  group.userData.turret = turret;
  group.userData.muzzleOffset = new THREE.Vector3(0, 4, 2);
  return group;
}

function buildCoastal(group, color) {
  const concrete = matteMat(0x666666);
  const hull = matteMat(color);
  const steel = metalMat(0x333333, 0.55, 0.6);
  const base = mesh(boxGeo(6, 1.5, 6, 0.05), concrete, [0, 0.75, 0], null, true);
  const wall = mesh(boxGeo(6, 2, 1, 0.05), concrete, [0, 1.5, 2.5], null, true);
  weather(base.geometry, 0.5);
  weather(wall.geometry, 0.4);
  group.add(base, wall);
  if (dl() >= 1) {
    const bagGeometry = boxGeo(0.7, 0.35, 0.45, 0.1);
    const bagMaterial = canvasMat(0x8a7a58);
    for (let i = 0; i < 6; i++) group.add(mesh(bagGeometry, bagMaterial, [-2.5 + i, 0.2, 3.3]));
    for (let i = 0; i < 5; i++) group.add(mesh(bagGeometry, bagMaterial, [-2 + i, 0.55, 3.3]));
  }
  const turret = new THREE.Group();
  turret.add(mesh(cylGeo(2, 2.2, 1.2, 8), hull, [0, 2.1, 0], null, true));
  hatch(turret, 0.8, 2.75, -0.8, 0.4);
  const barrelGeometry = cylGeo(0.3, 0.3, 5, 10);
  turret.add(mesh(barrelGeometry, gunmetalMat(), [-0.6, 2.4, 3], [Math.PI / 2, 0, 0]));
  turret.add(mesh(barrelGeometry, gunmetalMat(), [0.6, 2.4, 3], [Math.PI / 2, 0, 0]));
  const muzzleGeometry = cylGeo(0.5, 0.5, 0.6, 10);
  turret.add(mesh(muzzleGeometry, steel, [-0.6, 2.4, 5.5], [Math.PI / 2, 0, 0]));
  turret.add(mesh(muzzleGeometry, steel, [0.6, 2.4, 5.5], [Math.PI / 2, 0, 0]));
  antenna(turret, -1.4, 2.6, -1, 2);
  group.add(turret);
  group.userData.turret = turret;
  group.userData.muzzleOffset = new THREE.Vector3(0, 2.4, 6);
  return group;
}

function buildHealer(group, color) {
  const body = matteMat(color);
  const steel = metalMat(0x333333, 0.55, 0.6);
  const cross = glowMat(0x44ff44, 1.5);
  const cab = mesh(boxGeo(3, 2, 2.5, 0.08), body, [0, 2, 2.5], null, true);
  weather(cab.geometry);
  group.add(cab);
  group.add(mesh(boxGeo(2.8, 1, 0.1, 0.02), glassMat(0x224422), [0, 2.8, 3.8]));
  const chassis = mesh(boxGeo(3, 1, 6, 0.06), steel, [0, 0.8, 0], null, true);
  weather(chassis.geometry);
  group.add(chassis);
  headlights(group, 1.9, 3.8, [-1, 1]);
  for (const p of [[-1.5, 0.6, 2], [1.5, 0.6, 2], [-1.5, 0.6, -2], [1.5, 0.6, -2]]) roadWheel(group, p[0], p[1], p[2], 0.7, 0.4);
  const medicalBox = mesh(boxGeo(2.8, 2, 3.5, 0.08), body, [0, 2.3, -1], null, true);
  weather(medicalBox.geometry);
  group.add(medicalBox);
  group.add(mesh(boxGeo(1.2, 0.3, 0.1, 0.02), cross, [0, 2.8, 0.76]));
  group.add(mesh(boxGeo(0.3, 1.2, 0.1, 0.02), cross, [0, 2.8, 0.76]));
  group.add(mesh(boxGeo(0.3, 1.2, 0.1, 0.02), cross, [1.41, 2.8, -1], [0, Math.PI / 2, 0]));
  antenna(group, 1, 3.3, -2, 2);
  const dish = new THREE.Mesh(cylGeo(0.6, 0.6, 0.15, 8), cross);
  dish.position.set(0, 5, -2);
  group.add(dish);
  if (dl() >= 2) {
    group.add(mesh(boxGeo(0.08, 0.08, 2.2, 0.02), steel, [-1.2, 3.5, -1]));
    group.add(mesh(boxGeo(0.08, 0.08, 2.2, 0.02), steel, [1.2, 3.5, -1]));
  }
  group.userData.muzzleOffset = null;
  return group;
}

// ---------- SEA ------------------------------------------------------------
function buildFrigate(group, color) {
  const hull = matteMat(color);
  const superstructure = metalMat(0x888899, 0.6, 0.4);
  const deck = matteMat(0x2e3133);
  const hullMesh = mesh(boxGeo(3.5, 1.5, 10, 0.08), hull, [0, 0.75, 0], null, true);
  weather(hullMesh.geometry, 0.42);
  const bow = mesh(boxGeo(3.5, 1.5, 2, 0.08), hull, [0, 1, 5.5], [0.3, 0, 0], true);
  const stern = mesh(boxGeo(3.5, 0.2, 3, 0.02), deck, [0, 1.5, -4]);
  group.add(hullMesh, bow, stern);
  group.add(mesh(boxGeo(2.5, 2, 3, 0.06), superstructure, [0, 2.5, -1], null, true));
  group.add(mesh(boxGeo(2, 1.5, 2, 0.06), superstructure, [0, 4.2, -1]));
  group.add(mesh(boxGeo(2.6, 0.5, 0.1, 0.02), glassMat(0x113355), [0, 3, 0.5]));
  if (dl() >= 1) group.add(mesh(boxGeo(2.1, 0.4, 0.1, 0.02), glassMat(0x113355), [0, 4.6, 0]));
  if (dl() >= 1) {
    group.add(mesh(boxGeo(0.12, 0.04, 2.4, 0.01), glowMat(0xffffff, 0.5), [-0.9, 1.62, -4]));
    group.add(mesh(boxGeo(0.12, 0.04, 2.4, 0.01), glowMat(0xffffff, 0.5), [0.9, 1.62, -4]));
  }
  const turret = new THREE.Group();
  turret.add(mesh(boxGeo(1.5, 0.8, 1.5, 0.06), hull, [0, 1.9, 0], null, true));
  turret.add(mesh(cylGeo(0.15, 0.15, 2.5, 8), gunmetalMat(), [0, 2.1, 1.5], [Math.PI / 2, 0, 0]));
  turret.position.set(0, 0, 3);
  group.add(turret);
  group.add(mesh(boxGeo(1.5, 0.3, 1.5, 0.03), metalMat(0x555555, 0.6, 0.5), [0, 1.6, -2.5]));
  group.add(mesh(cylGeo(0.1, 0.14, 3, 4), superstructure, [0, 6.5, -1]));
  if (dl() >= 1) group.add(mesh(boxGeo(1.2, 0.08, 0.08, 0.02), superstructure, [0, 7.3, -1]));
  group.add(mesh(boxGeo(1.5, 1, 0.2, 0.02), glassMat(0x88ccff), [0, 7, -1]));
  if (dl() >= 1) {
    for (const z of [0.5, -0.5]) group.add(mesh(cylGeo(0.35, 0.35, 0.5, 8), matteMat(0xcccccc), [1.8, 1.8, z], [0, 0, Math.PI / 2]));
    group.add(mesh(cylGeo(0.25, 0.25, 0.8, 8), metalMat(0x444444, 0.6, 0.6), [0, 1.7, 4.6], [0, 0, Math.PI / 2]));
  }
  navLights(group, [-1.8, 1.7, 1], [1.8, 1.7, 1], [0, 1.7, -5.4]);
  group.userData.turret = turret;
  group.userData.muzzleOffset = new THREE.Vector3(0, 2.1, 4.5);
  group.userData.bobPhase = Math.random() * Math.PI * 2;
  return group;
}

function buildCruiser(group, color) {
  const hull = matteMat(color);
  const superstructure = metalMat(0x888899, 0.6, 0.4);
  const hullMesh = mesh(boxGeo(4.5, 1.8, 16, 0.08), hull, [0, 0.9, 0], null, true);
  weather(hullMesh.geometry, 0.42);
  group.add(hullMesh, mesh(boxGeo(4.5, 1.8, 3, 0.08), hull, [0, 1.2, 7.5], [0.2, 0, 0], true));
  group.add(mesh(boxGeo(3.5, 3, 5, 0.06), superstructure, [0, 3.3, -3], null, true));
  group.add(mesh(boxGeo(2.5, 2, 3, 0.06), superstructure, [0, 5.8, -3]));
  group.add(mesh(boxGeo(3.6, 0.5, 0.1, 0.02), glassMat(0x113355), [0, 4.2, -0.5]));
  const radarMaterial = glassMat(0x44aaff);
  for (const sx of [-1.8, 1.8]) group.add(mesh(boxGeo(0.2, 1.5, 1.5, 0.02), radarMaterial, [sx, 4, -1.5]));
  const turret = new THREE.Group();
  turret.add(mesh(boxGeo(2, 1, 2, 0.06), hull, [0, 2.3, 0], null, true));
  const barrelGeometry = cylGeo(0.2, 0.2, 4, 8);
  turret.add(mesh(barrelGeometry, gunmetalMat(), [-0.5, 2.5, 2], [Math.PI / 2, 0, 0]));
  turret.add(mesh(barrelGeometry, gunmetalMat(), [0.5, 2.5, 2], [Math.PI / 2, 0, 0]));
  turret.position.set(0, 0, 5);
  group.add(turret);
  group.add(mesh(boxGeo(2, 0.3, 3, 0.03), metalMat(0x555555, 0.6, 0.5), [0, 1.9, -6]));
  group.add(mesh(boxGeo(4, 0.2, 4, 0.02), matteMat(0x333333), [0, 1.9, -8]));
  if (dl() >= 1) {
    group.add(mesh(cylGeo(0.08, 0.12, 2.5, 4), superstructure, [0, 7.8, -3]));
    for (const sx of [-2.1, 2.1]) for (const z of [2, -2]) group.add(mesh(cylGeo(0.3, 0.3, 0.5, 8), matteMat(0xcccccc), [sx, 2, z], [0, 0, Math.PI / 2]));
  }
  antenna(group, 0, 6.8, -4.2, 2);
  navLights(group, [-2.3, 2, 3], [2.3, 2, 3], [0, 2.1, -7.8]);
  group.userData.turret = turret;
  group.userData.muzzleOffset = new THREE.Vector3(0, 2.5, 7);
  group.userData.bobPhase = Math.random() * Math.PI * 2;
  return group;
}

function buildSubmarine(group, color) {
  const hull = matteMat(mixColor(color, 0x11151c, 0.35));
  const dark = metalMat(0x222222, 0.6, 0.4);
  const pressure = mesh(capsuleGeo(1.2, 8, 14), hull, [0, 0, 0], null, true);
  pressure.rotation.z = Math.PI / 2;
  weather(pressure.geometry, 0.35);
  group.add(pressure);
  group.add(mesh(boxGeo(1.2, 1.5, 2.5, 0.1), hull, [0, 1.5, -1], null, true));
  if (dl() >= 1) group.add(mesh(boxGeo(1, 0.25, 0.08, 0.02), glassMat(0x0a1a22), [0, 1.9, 0.26]));
  group.add(mesh(boxGeo(2, 0.1, 0.8, 0.03), dark, [0, 1.5, -1]));
  if (dl() >= 1) {
    group.add(mesh(cylGeo(0.05, 0.05, 1.5, 4), dark, [-0.3, 2.8, -1]));
    group.add(mesh(cylGeo(0.05, 0.05, 1.5, 4), dark, [0.3, 2.8, -1]));
  }
  group.add(mesh(boxGeo(0.2, 0.2, 1, 0.02), glowMat(0x00ffaa, 1), [0, 2.3, -1]));
  group.add(mesh(cylGeo(0.15, 0.15, 1.2, 8), dark, [-5, 0, 0], [0, 0, Math.PI / 2]));
  if (dl() >= 2) {
    const bladeGeometry = boxGeo(0.08, 0.9, 0.35, 0.03);
    for (let i = 0; i < 5; i++) {
      const blade = new THREE.Mesh(bladeGeometry, metalMat(0x8a6f3d, 0.35, 0.85));
      blade.position.set(0, 0.55, 0);
      const pivot = new THREE.Group();
      pivot.position.set(-5.4, 0, 0);
      pivot.rotation.x = (i / 5) * Math.PI * 2;
      pivot.add(blade);
      group.add(pivot);
    }
  } else {
    group.add(mesh(cylGeo(0.8, 0.8, 1, 8), dark, [-5, 0, 0], [0, 0, Math.PI / 2]));
  }
  group.userData.bobPhase = Math.random() * Math.PI * 2;
  return group;
}

function buildShip(group, color, scale) {
  const width = 5 * scale;
  const length = 14 * scale;
  const hull = matteMat(color);
  const superstructure = metalMat(0x888899, 0.6, 0.4);
  const hullMesh = mesh(boxGeo(width, 1.5, length, 0.08), hull, [0, 0.75, 0], null, true);
  weather(hullMesh.geometry, 0.42);
  group.add(hullMesh, mesh(boxGeo(width, 1.5, 3 * scale, 0.08), hull, [0, 1, length / 2 + 1], [0.2, 0, 0], true));
  group.add(mesh(boxGeo(3 * scale, 3 * scale, 4 * scale, 0.06), superstructure, [0, 3 * scale, -scale], null, true));
  group.add(mesh(boxGeo(3.1 * scale, 0.5 * scale, 0.1, 0.02), glassMat(0x113355), [0, 3.8 * scale, scale]));
  const turret = new THREE.Group();
  turret.add(mesh(boxGeo(2 * scale, 1.2, 2 * scale, 0.06), hull, [0, 2.1 * scale, 0], null, true));
  const barrelCount = scale > 1.2 ? 3 : 2;
  const spacing = 0.6 * scale;
  for (let i = 0; i < barrelCount; i++) {
    turret.add(mesh(cylGeo(0.25 * scale, 0.25 * scale, 4 * scale, 10), gunmetalMat(), [(i - (barrelCount - 1) / 2) * spacing, 2.3 * scale, 2.5 * scale], [Math.PI / 2, 0, 0]));
  }
  if (dl() >= 1) turret.add(mesh(boxGeo(0.5 * scale, 0.3 * scale, 0.3 * scale, 0.03), superstructure, [0, 2.9 * scale, -0.5 * scale]));
  turret.position.z = 4 * scale;
  group.add(turret);
  if (dl() >= 1) {
    group.add(mesh(cylGeo(0.08 * scale, 0.12 * scale, 3 * scale, 4), superstructure, [0, 5.5 * scale, -scale]));
    for (const sx of [-width / 2 - 0.1, width / 2 + 0.1]) group.add(mesh(cylGeo(0.3 * scale, 0.3 * scale, 0.5 * scale, 8), matteMat(0xcccccc), [sx, 1.6, 0], [0, 0, Math.PI / 2]));
  }
  navLights(group, [-width / 2, 1.8, 2], [width / 2, 1.8, 2], [0, 1.8, -length / 2]);
  group.userData.turret = turret;
  group.userData.muzzleOffset = new THREE.Vector3(0, 2.3 * scale, 6 * scale);
  group.userData.bobPhase = Math.random() * Math.PI * 2;
  return group;
}

function buildCarrier(group, color) {
  const hull = matteMat(color);
  const deck = matteMat(0x222222);
  const superstructure = metalMat(0x888899, 0.6, 0.4);
  const hullMesh = mesh(boxGeo(7, 1.5, 20, 0.08), hull, [0, 0.75, 0], null, true);
  weather(hullMesh.geometry, 0.45);
  group.add(hullMesh, mesh(boxGeo(9, 0.3, 22, 0.04), deck, [0, 1.6, 0], null, true));
  const lineMaterial = glowMat(0xffffff, 0.5);
  group.add(mesh(boxGeo(0.1, 0.05, 20, 0.01), lineMaterial, [0, 1.8, 0]));
  group.add(mesh(boxGeo(8, 0.05, 0.1, 0.01), lineMaterial, [0, 1.8, -5]));
  if (dl() >= 1) {
    const edgeMaterial = glowMat(0xffcc44, 0.8);
    for (let z = -9; z <= 9; z += 3) {
      group.add(mesh(boxGeo(0.12, 0.06, 0.12, 0.01), edgeMaterial, [-4.4, 1.78, z]));
      group.add(mesh(boxGeo(0.12, 0.06, 0.12, 0.01), edgeMaterial, [4.4, 1.78, z]));
    }
  }
  group.add(mesh(boxGeo(5, 0.3, 10, 0.04), deck, [3, 1.65, -3], [0, 0.2, 0]));
  group.add(mesh(boxGeo(1.5, 4, 5, 0.05), superstructure, [4, 3.8, -5], null, true));
  group.add(mesh(boxGeo(0.2, 1.5, 1.5, 0.02), glassMat(0x44aaff), [4.8, 4.5, -4]));
  if (dl() >= 1) {
    group.add(mesh(cylGeo(0.06, 0.1, 2, 4), superstructure, [4, 6.8, -5]));
    group.add(mesh(boxGeo(1.6, 0.4, 0.15, 0.02), glassMat(0x44aaff), [4, 5.4, -2.6]));
  }
  const aircraftMaterial = matteMat(0x556677);
  for (const sx of [-1.5, 1.5]) group.add(mesh(boxGeo(2, 0.3, 3, 0.05), aircraftMaterial, [sx, 1.9, 5]));
  navLights(group, [-4.5, 1.9, 8], [4.5, 1.9, 8], [0, 1.9, -10.8]);
  group.userData.bobPhase = Math.random() * Math.PI * 2;
  return group;
}

function buildTransport(group, color) {
  const hull = matteMat(color);
  const deck = matteMat(0x443322);
  const steel = metalMat(0x333333, 0.55, 0.6);
  const hullMesh = mesh(boxGeo(6, 1.5, 14, 0.08), hull, [0, 0.75, 0], null, true);
  weather(hullMesh.geometry, 0.45);
  const deckMesh = mesh(boxGeo(5, 0.3, 8, 0.03), deck, [0, 1.5, 1]);
  const ramp = mesh(boxGeo(5, 0.3, 4, 0.03), steel, [0, 0.8, 6.5], [0.4, 0, 0]);
  const cabin = mesh(boxGeo(5.5, 3, 4, 0.06), hull, [0, 3, -4.5], null, true);
  weather(cabin.geometry);
  group.add(hullMesh, deckMesh, ramp, cabin);
  group.add(mesh(boxGeo(5, 1, 0.1, 0.02), glassMat(0x223344), [0, 3.5, -2.5]));
  if (dl() >= 1) {
    for (let i = 0; i < 4; i++) group.add(mesh(boxGeo(4.8, 0.06, 0.2, 0.01), steel, [0, 0.98 + i * 0.13, 5.2 + i * 0.85], [0.4, 0, 0]));
    group.add(mesh(cylGeo(0.06, 0.1, 2.4, 4), steel, [0, 5.4, -4.5]));
  }
  group.add(mesh(boxGeo(2, 2, 4, 0.04), matteMat(0xaa4422), [-1, 2.6, 1]));
  if (dl() >= 2) group.add(mesh(boxGeo(1.6, 1.6, 1.6, 0.04), canvasMat(0x5a6350), [1.4, 2.4, 2]));
  navLights(group, [-3, 1.8, 3], [3, 1.8, 3], [0, 1.8, -6.8]);
  group.userData.bobPhase = Math.random() * Math.PI * 2;
  group.userData.muzzleOffset = null;
  return group;
}

// ---------- AIR ------------------------------------------------------------
function rotorAssembly(group, hubY = 1.1) {
  const detail = metalMat(0x222222, 0.5, 0.6);
  const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5, metalness: 0.5, transparent: true, opacity: 0.6 });
  group.add(mesh(cylGeo(0.2, 0.2, 0.4, 6), detail, [0, hubY, 0]));
  group.add(mesh(boxGeo(7, 0.05, 0.3, 0.02), bladeMaterial, [0, hubY + 0.2, 0]));
  group.add(mesh(boxGeo(0.3, 0.05, 7, 0.02), bladeMaterial, [0, hubY + 0.2, 0]));
  if (dl() >= 2) {
    for (const sx of [-3.45, 3.45]) group.add(mesh(boxGeo(0.12, 0.06, 0.32, 0.02), matteMat(0xdddddd), [sx, hubY + 0.2, 0]));
  }
}

function buildHeli(group, color) {
  const body = matteMat(color);
  const glass = glassMat(0x113322);
  const dark = metalMat(0x222222, 0.55, 0.5);
  const fuselage = mesh(capsuleGeo(0.7, 2.5, 10), body, [0, 0, 0], null, true);
  fuselage.rotation.z = Math.PI / 2;
  group.add(fuselage);
  group.add(mesh(domeGeo(0.5, 8, 6), glass, [1.2, 0.2, 0], [0, 0, -Math.PI / 2]));
  group.add(mesh(domeGeo(0.5, 8, 6), glass, [-0.2, 0.6, 0], [0, 0, -Math.PI / 2]));
  group.add(mesh(cylGeo(0.15, 0.3, 3.5, 6), body, [-2.8, 0.2, 0], [0, 0, Math.PI / 2]));
  group.add(mesh(boxGeo(0.8, 1.2, 0.1, 0.03), body, [-4.2, 0.8, 0]));
  if (dl() >= 1) {
    for (const sz of [-0.7, 0.7]) {
      group.add(mesh(cylGeo(0.05, 0.05, 2.6, 6), dark, [0.2, -0.75, sz], [0, 0, Math.PI / 2]));
      group.add(mesh(cylGeo(0.05, 0.05, 0.6, 6), dark, [0.8, -0.45, sz], [0, 0, 0.5]));
      group.add(mesh(cylGeo(0.05, 0.05, 0.6, 6), dark, [-0.8, -0.45, sz], [0, 0, -0.5]));
    }
  }
  const wingGeometry = boxGeo(0.5, 0.2, 2, 0.03);
  group.add(mesh(wingGeometry, dark, [-0.5, -0.2, 1.2]));
  group.add(mesh(wingGeometry, dark, [-0.5, -0.2, -1.2]));
  const missileGeometry = cylGeo(0.1, 0.1, 1, 6);
  for (let i = 0; i < 2; i++) {
    group.add(mesh(missileGeometry, metalMat(0x555555, 0.5, 0.6), [-0.5, -0.4, 0.8 + i * 0.8], [Math.PI / 2, 0, 0]));
    group.add(mesh(missileGeometry, metalMat(0x555555, 0.5, 0.6), [-0.5, -0.4, -(0.8 + i * 0.8)], [Math.PI / 2, 0, 0]));
  }
  group.add(mesh(sphereGeo(0.25, 8, 6), glowMat(0xff0000, 1), [1.6, -0.4, 0]));
  rotorAssembly(group);
  group.add(mesh(boxGeo(0.05, 1.5, 0.2, 0.02), bladeMaterialForRotor(), [-4.2, 0.8, 0.2]));
  exhaustPipe(group, -1.2, 0.75, 0.4, 0.09, 0.4);
  navLights(group, [-0.6, 0, 1.3], [-0.6, 0, -1.3], null);
  group.userData.muzzleOffset = new THREE.Vector3(1.6, -0.4, 0);
  return group;
}

function bladeMaterialForRotor() {
  return new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5, metalness: 0.5, transparent: true, opacity: 0.6 });
}

function buildMedHeli(group, color) {
  const body = matteMat(color);
  const dark = metalMat(0x222222, 0.55, 0.5);
  const cross = glowMat(0x44ff44, 1.5);
  const fuselage = mesh(capsuleGeo(0.7, 2.5, 10), body, [0, 0, 0], null, true);
  fuselage.rotation.z = Math.PI / 2;
  group.add(fuselage);
  group.add(mesh(domeGeo(0.5, 8, 6), glassMat(0x113322), [1.2, 0.2, 0], [0, 0, -Math.PI / 2]));
  group.add(mesh(cylGeo(0.15, 0.3, 3.5, 6), body, [-2.8, 0.2, 0], [0, 0, Math.PI / 2]));
  group.add(mesh(boxGeo(0.8, 1.2, 0.1, 0.03), body, [-4.2, 0.8, 0]));
  group.add(mesh(boxGeo(1.2, 0.3, 0.1, 0.02), cross, [0, 0.5, 0.75]));
  group.add(mesh(boxGeo(0.3, 1.2, 0.1, 0.02), cross, [0, 0.5, 0.75]));
  if (dl() >= 1) {
    for (const sz of [-0.7, 0.7]) {
      group.add(mesh(cylGeo(0.05, 0.05, 2.6, 6), dark, [0.2, -0.75, sz], [0, 0, Math.PI / 2]));
      group.add(mesh(cylGeo(0.05, 0.05, 0.6, 6), dark, [0.8, -0.45, sz], [0, 0, 0.5]));
      group.add(mesh(cylGeo(0.05, 0.05, 0.6, 6), dark, [-0.8, -0.45, sz], [0, 0, -0.5]));
    }
  }
  group.add(mesh(boxGeo(0.5, 0.2, 1.5, 0.03), dark, [-0.5, -0.2, 1]));
  group.add(mesh(boxGeo(0.5, 0.2, 1.5, 0.03), dark, [-0.5, -0.2, -1]));
  group.add(mesh(cylGeo(0.4, 0.4, 0.1, 8), cross, [0, -0.5, 0]));
  rotorAssembly(group);
  group.add(mesh(boxGeo(0.05, 1.5, 0.2, 0.02), bladeMaterialForRotor(), [-4.2, 0.8, 0.2]));
  group.userData.muzzleOffset = null;
  return group;
}

function buildGunship(group, color) {
  const body = matteMat(color);
  const dark = metalMat(0x222222, 0.55, 0.5);
  const fuselage = mesh(capsuleGeo(1.5, 6, 10), body, [0, 0, 0], null, true);
  fuselage.rotation.z = Math.PI / 2;
  weather(fuselage.geometry, 0.25);
  group.add(fuselage);
  group.add(mesh(domeGeo(1.2, 8, 6), glassMat(0x113322), [3.5, 0.5, 0], [0, 0, -Math.PI / 2]));
  group.add(mesh(boxGeo(2, 0.3, 12, 0.06), body, [-0.5, 0.5, 0], null, true));
  for (let i = 0; i < 4; i++) {
    group.add(mesh(cylGeo(0.4, 0.4, 2, 10), dark, [-0.5, 0, -4.5 + i * 3], [Math.PI / 2, 0, 0]));
    group.add(mesh(cylGeo(0.3, 0.3, 0.2, 10), glowMat(0xff5500, 2), [-0.5, 0, -5.5 + i * 3], [Math.PI / 2, 0, 0]));
  }
  group.add(mesh(boxGeo(1, 0.2, 4, 0.04), body, [-4, 0.5, 0]));
  group.add(mesh(boxGeo(0.2, 2.5, 2, 0.04), body, [-4, 1.5, 0]));
  const gunGeometry = cylGeo(0.15, 0.15, 2.5, 6);
  group.add(mesh(gunGeometry, gunmetalMat(), [0, -1, 1.5], [Math.PI / 2, 0, 0]));
  group.add(mesh(gunGeometry, gunmetalMat(), [0, -1, -0.5], [Math.PI / 2, 0, 0]));
  group.add(mesh(cylGeo(0.3, 0.3, 3, 8), gunmetalMat(), [0, -1, -2.5], [Math.PI / 2, 0, 0]));
  if (dl() >= 1) group.add(mesh(cylGeo(0.45, 0.45, 0.4, 10), dark, [0, -1, 0.4], [Math.PI / 2, 0, 0]));
  group.add(mesh(sphereGeo(0.5, 8, 6), glassMat(0x2244aa), [1, -1, 0]));
  navLights(group, [-0.5, 0.6, 6], [-0.5, 0.6, -6], [-4.8, 0.6, 0]);
  group.userData.muzzleOffset = new THREE.Vector3(0, -1, 2.5);
  return group;
}

function buildEscortJet(group, color) {
  const body = matteMat(color);
  const dark = metalMat(0x333333, 0.55, 0.6);
  const fuselage = mesh(capsuleGeo(0.5, 5, 8), body, [0, 0, 0], null, true);
  fuselage.rotation.x = Math.PI / 2;
  group.add(fuselage);
  group.add(mesh(domeGeo(0.45, 8, 6), glassMat(0x113344), [0, 0.3, 2.5], [-Math.PI / 3, 0, 0]));
  const wingGeometry = boxGeo(2.5, 0.15, 5, 0.04);
  group.add(mesh(wingGeometry, body, [-0.5, -0.1, 0], [0, -0.3, 0], true));
  group.add(mesh(wingGeometry, body, [0.5, -0.1, 0], [0, 0.3, 0], true));
  const exhaustGeometry = cylGeo(0.3, 0.35, 0.6, 8);
  for (const sx of [-0.5, 0.5]) group.add(mesh(exhaustGeometry, glowMat(0x44aaff, 2), [sx, 0, -2.5], [Math.PI / 2, 0, 0]));
  const tailGeometry = boxGeo(0.15, 1.5, 1.2, 0.03);
  group.add(mesh(tailGeometry, body, [-1, 0.8, -2], [0, 0, -0.15]));
  group.add(mesh(tailGeometry, body, [1, 0.8, -2], [0, 0, 0.15]));
  const pylonGeometry = cylGeo(0.08, 0.08, 1.5, 6);
  for (let i = 0; i < 2; i++) for (const sx of [-0.3, 0.3]) group.add(mesh(pylonGeometry, metalMat(0x666666, 0.5, 0.6), [sx, -0.3, 1 + i * 0.8], [Math.PI / 2, 0, 0]));
  if (dl() >= 2) {
    for (const sx of [-0.45, 0.45]) group.add(mesh(coneGeo(0.18, 0.5, 8), dark, [sx, 0, 1.8], [Math.PI / 2, 0, 0]));
    for (const sx of [-1.7, 1.7]) group.add(mesh(cylGeo(0.09, 0.09, 1.6, 6), metalMat(0x777777, 0.4, 0.7), [sx, -0.05, 0.4], [Math.PI / 2, 0, 0]));
  }
  navLights(group, [-1.7, 0, 1], [1.7, 0, 1], [0, 0.4, -2.6]);
  group.userData.muzzleOffset = new THREE.Vector3(0, 0, 3);
  return group;
}

function buildB2(group, color) {
  const body = matteMat(mixColor(color, 0x14161c, 0.3));
  const dark = metalMat(0x222222, 0.6, 0.4);
  const center = mesh(seedWeather(new THREE.BoxGeometry(2, 0.6, 4)), body, [0, 0, 0], null, true);
  weather(center.geometry, 0.2);
  group.add(center);
  const wingGeometry = boxGeo(5, 0.3, 3, 0.06);
  group.add(mesh(wingGeometry, body, [-3.5, 0, 0], [0, 0.4, 0], true));
  group.add(mesh(wingGeometry, body, [3.5, 0, 0], [0, -0.4, 0], true));
  group.add(mesh(domeGeo(0.4, 6, 5), glassMat(0x112222), [0, 0.4, 1.5]));
  for (const sx of [-1, 1]) group.add(mesh(boxGeo(1.5, 0.3, 0.8, 0.04), dark, [sx, 0.2, -0.5]));
  for (const sx of [-1, 1]) group.add(mesh(boxGeo(0.8, 0.15, 1, 0.03), glowMat(0xff5500, 1.5), [sx, 0, -2]));
  group.add(mesh(boxGeo(2, 0.05, 1.5, 0.01), dark, [0, -0.3, 0]));
  if (dl() >= 2) for (const sx of [-2, 2]) group.add(mesh(boxGeo(0.06, 0.32, 2.8, 0.01), dark, [sx, 0, 0], [0, sx < 0 ? 0.4 : -0.4, 0]));
  group.userData.muzzleOffset = new THREE.Vector3(0, 0, 2);
  return group;
}

function buildEscortBomber(group, color) {
  const body = matteMat(color);
  const dark = metalMat(0x333333, 0.55, 0.6);
  const fuselage = mesh(capsuleGeo(1.8, 8, 10), body, [0, 0, 0], null, true);
  fuselage.rotation.x = Math.PI / 2;
  weather(fuselage.geometry, 0.22);
  group.add(fuselage);
  group.add(mesh(domeGeo(0.8, 8, 6), glassMat(0x113344), [0, 0.5, 4.5], [-Math.PI / 3, 0, 0]));
  const wingGeometry = boxGeo(2.5, 0.25, 10, 0.05);
  group.add(mesh(wingGeometry, body, [-1, 0.3, 0], null, true));
  group.add(mesh(wingGeometry, body, [1, 0.3, 0], null, true));
  const engineGeometry = cylGeo(0.5, 0.5, 2.5, 10);
  for (const p of [[-1, 0.3, 3], [-1, 0.3, -3], [1, 0.3, 3], [1, 0.3, -3]]) {
    group.add(mesh(engineGeometry, dark, p, [Math.PI / 2, 0, 0]));
    group.add(mesh(cylGeo(0.4, 0.4, 0.3, 8), glowMat(0xff4400, 1.5), [p[0], p[1], p[2] - 1.5], [Math.PI / 2, 0, 0]));
    if (dl() >= 1) group.add(mesh(cylGeo(0.12, 0.12, 0.4, 6), dark, [p[0], p[1] + 0.5, p[2]], [Math.PI / 2, 0, 0]));
  }
  group.add(mesh(boxGeo(1.5, 0.2, 3, 0.04), body, [0, 0.5, -5]));
  group.add(mesh(boxGeo(0.2, 3, 2.5, 0.04), body, [0, 2, -5]));
  group.add(mesh(cylGeo(0.3, 0.3, 0.8, 6), metalMat(0x444444, 0.5, 0.6), [1, -1, -2], [Math.PI / 2, 0, 0]));
  if (dl() >= 2) group.add(mesh(cylGeo(0.3, 0.3, 0.8, 6), metalMat(0x444444, 0.5, 0.6), [-1, -1, -2], [Math.PI / 2, 0, 0]));
  navLights(group, [-2.2, 0.4, 0], [2.2, 0.4, 0], [0, 0.6, -6]);
  group.userData.muzzleOffset = new THREE.Vector3(0, 0, 5);
  return group;
}

function buildJet(group, color, scale) {
  const body = matteMat(color);
  const fuselage = mesh(capsuleGeo(0.4 * scale, 5 * scale, 8), body, [0, 0, 0], null, true);
  fuselage.rotation.x = Math.PI / 2;
  weather(fuselage.geometry, 0.2);
  group.add(fuselage);
  group.add(mesh(domeGeo(0.4 * scale, 8, 6), glassMat(0x113344), [0, 0.3 * scale, 2 * scale], [-Math.PI / 3, 0, 0]));
  const wingGeometry = boxGeo(2 * scale, 0.1 * scale, 4 * scale, 0.03);
  group.add(mesh(wingGeometry, body, [-0.5 * scale, -0.1 * scale, 0], [0, -0.4, 0], true));
  group.add(mesh(wingGeometry, body, [0.5 * scale, -0.1 * scale, 0], [0, 0.4, 0], true));
  const tailGeometry = boxGeo(1 * scale, 0.1 * scale, 1.5 * scale, 0.02);
  group.add(mesh(tailGeometry, body, [-1 * scale, 0.5 * scale, -2 * scale], [0, 0, -0.5]));
  group.add(mesh(tailGeometry, body, [1 * scale, 0.5 * scale, -2 * scale], [0, 0, 0.5]));
  const exhaustGeometry = cylGeo(0.25 * scale, 0.3 * scale, 0.5 * scale, 8);
  for (const sx of [-0.4, 0.4]) group.add(mesh(exhaustGeometry, glowMat(0x44aaff, 2), [sx * scale, 0, -2.5 * scale], [Math.PI / 2, 0, 0]));
  const canardGeometry = boxGeo(0.8 * scale, 0.05 * scale, 1 * scale, 0.02);
  group.add(mesh(canardGeometry, body, [-1 * scale, 0, 1.5 * scale]));
  group.add(mesh(canardGeometry, body, [1 * scale, 0, 1.5 * scale]));
  if (dl() >= 1) for (const sx of [-1.1, 1.1]) group.add(mesh(cylGeo(0.12 * scale, 0.12 * scale, 1.6 * scale, 6), metalMat(0x666666, 0.45, 0.65), [sx * scale, -0.2 * scale, 0.3 * scale], [Math.PI / 2, 0, 0]));
  if (dl() >= 2) group.add(mesh(coneGeo(0.14 * scale, 0.5 * scale, 8), metalMat(0x333333, 0.5, 0.7), [0, 0.05 * scale, 2.9 * scale], [Math.PI / 2, 0, 0]));
  navLights(group, [-1.4 * scale, 0, 0.5], [1.4 * scale, 0, 0.5], null);
  group.userData.muzzleOffset = new THREE.Vector3(0, 0, 3 * scale);
  return group;
}

// ---------- SMALL / SPECIAL -----------------------------------------------
function buildMinigunnerVehicle(group, color) {
  const body = matteMat(color);
  const chassis = mesh(boxGeo(3.5, 1, 5, 0.06), metalMat(0x444444, 0.6, 0.5), [0, 0.8, 0], null, true);
  const cab = mesh(boxGeo(3, 2, 3, 0.08), body, [0, 2, 0.5], null, true);
  weather(chassis.geometry);
  weather(cab.geometry);
  group.add(chassis, cab);
  headlights(group, 2.2, 2.05, [-1, 1]);
  group.add(mesh(cylGeo(1.2, 1.5, 1, 8), metalMat(0x444444, 0.55, 0.55), [0, 2.8, 1.5], null, true));
  const barrelGeometry = cylGeo(0.3, 0.3, 2.5, 6);
  for (const x of [0, 0.6, -0.6]) group.add(mesh(barrelGeometry, gunmetalMat(), [x, 2.8, 3.5], [Math.PI / 2, 0, 0]));
  if (dl() >= 1) group.add(mesh(cylGeo(0.75, 0.75, 0.5, 10), metalMat(0x333333, 0.5, 0.6), [0, 2.8, 2.6], [Math.PI / 2, 0, 0]));
  if (dl() >= 2) group.add(mesh(boxGeo(0.7, 0.5, 0.9, 0.03), canvasMat(), [1.3, 2.6, 0]));
  for (const p of [[-1.7, 0.6, 2], [1.7, 0.6, 2], [-1.7, 0.6, -2], [1.7, 0.6, -2]]) roadWheel(group, p[0], p[1], p[2], 0.7, 0.4);
  group.userData.muzzleOffset = new THREE.Vector3(0, 2.8, 4.8);
  return group;
}

function buildMegaMedic(group, color) {
  const body = matteMat(color);
  const steel = metalMat(0x333333, 0.55, 0.6);
  const cross = glowMat(0x44ff44, 1.5);
  const chassis = mesh(boxGeo(3.5, 1, 6, 0.06), steel, [0, 0.8, 0], null, true);
  const cab = mesh(boxGeo(3, 2, 2.5, 0.08), body, [0, 2, 2.5], null, true);
  const medicalModule = mesh(boxGeo(3.2, 2.5, 4, 0.08), body, [0, 2.5, -1], null, true);
  weather(chassis.geometry);
  weather(cab.geometry);
  weather(medicalModule.geometry);
  group.add(chassis, cab, medicalModule);
  group.add(mesh(boxGeo(2.5, 0.4, 0.1, 0.02), cross, [0, 2.8, 1.01]));
  group.add(mesh(boxGeo(0.4, 2.5, 0.1, 0.02), cross, [0, 2.8, 1.01]));
  group.add(mesh(boxGeo(2.8, 1, 0.1, 0.02), glassMat(0x224422), [0, 2.8, 3.8]));
  headlights(group, 1.9, 3.8, [-1, 1]);
  if (dl() >= 1) group.add(mesh(cylGeo(0.5, 0.5, 0.12, 8), cross, [0, 4, -1.5]));
  for (const p of [[-1.7, 0.6, 2], [1.7, 0.6, 2], [-1.7, 0.6, -2], [1.7, 0.6, -2]]) roadWheel(group, p[0], p[1], p[2], 0.7, 0.4);
  return group;
}

function buildMinigunner(group, color) {
  const body = matteMat(color);
  const gunMaterial = gunmetalMat();
  group.add(mesh(cylGeo(0.5, 0.6, 1.5, 6), body, [0, 1, 0], null, true));
  group.add(mesh(sphereGeo(0.35, 8, 6), body, [0, 1.9, 0]));
  group.add(mesh(cylGeo(0.08, 0.08, 1.5, 4), gunMaterial, [0.4, 1.3, 0.8], [Math.PI / 2, 0, 0]));
  group.add(mesh(cylGeo(0.08, 0.08, 1.5, 4), gunMaterial, [0.6, 1.3, 0.8], [Math.PI / 2, 0, 0]));
  if (dl() >= 1) {
    group.add(mesh(cylGeo(0.16, 0.16, 0.35, 8), metalMat(0x333333, 0.5, 0.6), [0.5, 1.3, 0.2], [Math.PI / 2, 0, 0]));
    group.add(mesh(boxGeo(0.5, 0.6, 0.25, 0.04), canvasMat(), [0, 1.1, -0.45]));
  }
  return group;
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
