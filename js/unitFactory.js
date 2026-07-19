import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// --- Shared caches ---
const MAT_CACHE = new Map();
const GEO_CACHE = new Map();

function cached(map, key, create) {
  if (!map.has(key)) map.set(key, create());
  return map.get(key);
}

// --- Geometry Helpers ---
function boxGeo(w, h, d, r = 0.06) {
  const radius = Math.min(r, w * 0.2, h * 0.2, d * 0.2);
  return cached(
    GEO_CACHE,
    `box:${w}:${h}:${d}:${radius}`,
    () => new RoundedBoxGeometry(w, h, d, 2, radius)
  );
}

function cylGeo(r1, r2, h, seg = 12) {
  return cached(
    GEO_CACHE,
    `cyl:${r1}:${r2}:${h}:${seg}`,
    () => new THREE.CylinderGeometry(r1, r2, h, seg)
  );
}

function sphereGeo(r, w = 12, h = 12) {
  return cached(
    GEO_CACHE,
    `sphere:${r}:${w}:${h}`,
    () => new THREE.SphereGeometry(r, w, h)
  );
}

// --- Material Helpers ---
function metalMat(color, roughness = 0.45, metalness = 0.75) {
  return cached(
    MAT_CACHE,
    `metal:${color}:${roughness}:${metalness}`,
    () => new THREE.MeshStandardMaterial({ color, roughness, metalness })
  );
}

function matteMat(color) {
  return cached(
    MAT_CACHE,
    `matte:${color}`,
    () => new THREE.MeshStandardMaterial({
      color,
      roughness: 0.88,
      metalness: 0.08
    })
  );
}

function glassMat(color = 0x112233) {
  return cached(
    MAT_CACHE,
    `glass:${color}`,
    () => new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.04,
      metalness: 0,
      transparent: true,
      opacity: 0.65,
      transmission: 0.15,
      emissive: color,
      emissiveIntensity: 0.25,
      depthWrite: false
    })
  );
}

function glowMat(color, intensity = 1.5) {
  return cached(
    MAT_CACHE,
    `glow:${color}:${intensity}`,
    () => new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: intensity,
      roughness: 0.45,
      metalness: 0.35
    })
  );
}

function trackMat() {
  return cached(
    MAT_CACHE,
    'track',
    () => new THREE.MeshStandardMaterial({
      color: 0x151515,
      roughness: 0.95,
      metalness: 0.25
    })
  );
}

function mixColor(a, b, t) {
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);
  return ca.lerp(cb, t).getHex();
}

function enableShadows(obj) {
  obj.castShadow = true;
  obj.receiveShadow = true;
  return obj;
}

function mesh(geometry, material, position, rotation) {
  const m = enableShadows(new THREE.Mesh(geometry, material));
  if (position) m.position.set(position[0], position[1], position[2]);
  if (rotation) m.rotation.set(rotation[0], rotation[1], rotation[2]);
  return m;
}

const EDGE_MAT = new THREE.LineBasicMaterial({
  color: 0x000000,
  transparent: true,
  opacity: 0.22,
  depthTest: true
});

// Edge outlines share the same cached base geometries, so the derived
// EdgesGeometry can be cached per source geometry too. Without this, every
// spawned unit allocated a brand-new EdgesGeometry per sub-mesh, which leaked
// GPU geometry (renderer.info.memory.geometries grew unbounded over a match).
const EDGE_GEO_CACHE = new Map(); // source BufferGeometry -> EdgesGeometry
const SOURCE_GEO_CACHE = new Map(); // geometry signature -> shared BufferGeometry

function sharedSourceGeometry(geometry) {
  if (!geometry?.parameters) return geometry;
  let signature;
  try {
    signature = `${geometry.type}:${JSON.stringify(geometry.parameters)}`;
  } catch {
    return geometry;
  }

  const cachedGeometry = SOURCE_GEO_CACHE.get(signature);
  if (cachedGeometry && cachedGeometry !== geometry) {
    geometry.dispose();
    return cachedGeometry;
  }
  SOURCE_GEO_CACHE.set(signature, geometry);
  return geometry;
}

function edgeGeoFor(geometry) {
  let eg = EDGE_GEO_CACHE.get(geometry);
  if (!eg) {
    eg = new THREE.EdgesGeometry(geometry, 35);
    EDGE_GEO_CACHE.set(geometry, eg);
  }
  return eg;
}

function finishModel(group, { outlines = true } = {}) {
  const meshes = [];

  group.traverse((obj) => {
    if (!obj.isMesh) return;

    enableShadows(obj);

    if (obj.geometry) {
      obj.geometry = sharedSourceGeometry(obj.geometry);
      obj.geometry.computeVertexNormals();
      obj.geometry.computeBoundingSphere();
    }

    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];

    for (const mat of mats) {
      if (!mat) continue;
      if ('envMapIntensity' in mat) mat.envMapIntensity = 0.7;
    }

    if (!obj.material?.transparent && outlines) {
      meshes.push(obj);
    }
  });

  for (const obj of meshes) {
    const edges = new THREE.LineSegments(
      edgeGeoFor(obj.geometry),
      EDGE_MAT
    );

    edges.userData.noShadow = true;
    edges.renderOrder = 2;
    obj.add(edges);
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
  const bodyMat = matteMat(color);
  const armorMat = metalMat(0x333333, 0.6, 0.4);

  const torso = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.5), bodyMat));
  torso.position.y = 1.4;

  const legGeom = new THREE.BoxGeometry(0.3, 1, 0.3);
  const legL = enableShadows(new THREE.Mesh(legGeom, bodyMat));
  legL.position.set(-0.2, 0.5, 0);
  const legR = enableShadows(new THREE.Mesh(legGeom, bodyMat));
  legR.position.set(0.2, 0.5, 0);

  const armGeom = new THREE.BoxGeometry(0.25, 1, 0.25);
  const armL = enableShadows(new THREE.Mesh(armGeom, bodyMat));
  armL.position.set(-0.55, 1.4, 0);
  const armR = enableShadows(new THREE.Mesh(armGeom, bodyMat));
  armR.position.set(0.55, 1.4, 0.2);
  armR.rotation.x = -0.5;

  const head = enableShadows(new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), matteMat(0xddbb99)));
  head.position.y = 2.2;
  const helmet = enableShadows(new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), armorMat));
  helmet.position.y = 2.25;

  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.1), glassMat(0x00ffff));
  visor.position.set(0, 2.2, 0.25);

  const rifle = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 1.2), armorMat));
  rifle.position.set(0.55, 1.2, 0.6);
  rifle.rotation.x = -0.2;

  g.add(torso, legL, legR, armL, armR, head, helmet, visor, rifle);
  return g;
}

function buildTank(g, color) {
  const hullMat = matteMat(color);
  const detailMat = metalMat(0x333333, 0.7, 0.5);

  const lowerHull = mesh(boxGeo(4.5, 1, 7, 0.12), hullMat, [0, 0.8, 0]);

  const upperHull = mesh(boxGeo(4, 0.8, 5, 0.1), hullMat, [0, 1.7, -0.5]);

  const frontArmor = mesh(boxGeo(4, 1, 2, 0.1), hullMat, [0, 1.5, 3], [-0.4, 0, 0]);

  const trackGeom = boxGeo(0.8, 1.2, 7.5, 0.08);
  const tL = mesh(trackGeom, trackMat(), [-2.4, 0.6, 0]);
  const tR = mesh(trackGeom, trackMat(), [2.4, 0.6, 0]);

  const wheelGeom = cylGeo(0.4, 0.4, 0.9, 12);
  for (let i = -3; i <= 3; i++) {
    const wL = new THREE.Mesh(wheelGeom, detailMat);
    wL.rotation.z = Math.PI / 2;
    wL.position.set(-2.4, 0.6, i * 1.1);
    g.add(wL);
    const wR = wL.clone();
    wR.position.x = 2.4;
    g.add(wR);
  }

  const turret = new THREE.Group();
  const turretBase = mesh(boxGeo(3, 1, 3.5, 0.1), hullMat, [0, 2.4, 0]);

  const turretFront = mesh(boxGeo(3, 1, 1.5, 0.1), hullMat, [0, 2.4, 2], [-0.3, 0, 0]);

  const cupola = mesh(cylGeo(0.4, 0.4, 0.3, 12), detailMat, [-0.8, 3.0, -0.5]);

  const barrel = mesh(cylGeo(0.2, 0.2, 5, 16), detailMat, [0, 2.5, 3.5], [Math.PI / 2, 0, 0]);

  const fume = mesh(cylGeo(0.3, 0.3, 0.6, 12), detailMat, [0, 2.5, 4.5], [Math.PI / 2, 0, 0]);

  const raGeom = boxGeo(0.4, 0.4, 0.1, 0.02);
  for (let i = 0; i < 3; i++) {
    const ra = new THREE.Mesh(raGeom, detailMat);
    ra.position.set(-1 + i * 1, 2.4, 2.8);
    ra.rotation.x = -0.3;
    turret.add(ra);
  }

  turret.add(turretBase, turretFront, cupola, barrel, fume);

  const antenna = new THREE.Mesh(cylGeo(0.02, 0.02, 2, 4), detailMat);
  antenna.position.set(1, 3.5, -1);
  turret.add(antenna);

  g.add(lowerHull, upperHull, frontArmor, tL, tR, turret);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 2.5, 6);
  return g;
}

function buildHeavyTank(g, color) {
  const hullMat = matteMat(color);
  const detailMat = metalMat(0x333333, 0.7, 0.5);

  // Lower hull — wider and taller
  const lowerHull = mesh(boxGeo(6, 1.4, 9, 0.15), hullMat, [0, 1, 0]);

  // Upper hull
  const upperHull = mesh(boxGeo(5.5, 1, 7, 0.12), hullMat, [0, 2.2, -0.5]);

  // Sloped front armor — extra thick
  const frontArmor = mesh(boxGeo(5.5, 1.4, 2.5, 0.12), hullMat, [0, 2, 4], [-0.35, 0, 0]);

  // Side skirts
  const skirtMat = metalMat(0x444444, 0.6, 0.3);
  const skirtL = mesh(boxGeo(0.3, 1.5, 8, 0.05), skirtMat, [-3.2, 1, 0]);
  const skirtR = mesh(boxGeo(0.3, 1.5, 8, 0.05), skirtMat, [3.2, 1, 0]);

  // Tracks — thicker
  const trackGeom = boxGeo(1, 1.5, 9.5, 0.1);
  const tL = mesh(trackGeom, trackMat(), [-2.8, 0.7, 0]);
  const tR = mesh(trackGeom, trackMat(), [2.8, 0.7, 0]);

  // Road wheels
  const wheelGeom = cylGeo(0.5, 0.5, 1.1, 12);
  for (let i = -4; i <= 4; i++) {
    const wL = new THREE.Mesh(wheelGeom, detailMat);
    wL.rotation.z = Math.PI / 2;
    wL.position.set(-2.8, 0.7, i * 1.1);
    g.add(wL);
    const wR = wL.clone();
    wR.position.x = 2.8;
    g.add(wR);
  }

  // Turret — larger, boxy with sloped sides
  const turret = new THREE.Group();
  const turretBase = mesh(boxGeo(4, 1.2, 4.5, 0.12), hullMat, [0, 3.1, 0]);

  const turretFront = mesh(boxGeo(4, 1.2, 2, 0.1), hullMat, [0, 3.1, 2.5], [-0.25, 0, 0]);

  // Commander cupola
  const cupola = mesh(cylGeo(0.5, 0.5, 0.4, 12), detailMat, [-1, 3.9, -1]);

  // Loader hatch
  const hatch = mesh(cylGeo(0.4, 0.4, 0.2, 12), detailMat, [1, 3.8, -0.5]);

  // Main gun — massive barrel
  const barrel = mesh(cylGeo(0.35, 0.35, 6, 16), detailMat, [0, 3.2, 5.5], [Math.PI / 2, 0, 0]);

  // Muzzle brake
  const muzzle = mesh(cylGeo(0.5, 0.5, 0.8, 12), detailMat, [0, 3.2, 8.5], [Math.PI / 2, 0, 0]);

  // Reactive armor blocks on turret
  const raGeom = boxGeo(0.5, 0.5, 0.15, 0.03);
  for (let i = 0; i < 4; i++) {
    const ra = new THREE.Mesh(raGeom, detailMat);
    ra.position.set(-1.5 + i * 1, 3.1, 2.2);
    ra.rotation.x = -0.25;
    turret.add(ra);
  }

  turret.add(turretBase, turretFront, cupola, hatch, barrel, muzzle);

  // Antenna
  const antenna = new THREE.Mesh(cylGeo(0.03, 0.03, 2.5, 4), detailMat);
  antenna.position.set(1.5, 4.5, -1.5);
  turret.add(antenna);

  // IR searchlight
  const light = new THREE.Mesh(cylGeo(0.25, 0.25, 0.3, 12), glassMat(0xff4400));
  light.rotation.x = Math.PI / 2;
  light.position.set(-1.8, 3.5, 2.5);
  turret.add(light);

  g.add(lowerHull, upperHull, frontArmor, skirtL, skirtR, tL, tR, turret);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 3.2, 9);
  return g;
}

function buildCrusher(g, color) {
  const hullMat = matteMat(color);
  const detailMat = metalMat(0x444444, 0.6, 0.5);

  const hull = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(7, 1.8, 10), hullMat));
  hull.position.y = 1.2;

  const frontPlate = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(7, 2, 3), hullMat));
  frontPlate.position.set(0, 2, 4.5);
  frontPlate.rotation.x = -0.3;

  const slabMat = metalMat(0x444444, 0.7, 0.6);
  const slabL = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 9), slabMat));
  slabL.position.set(-3.7, 1.5, 0);
  const slabR = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 9), slabMat));
  slabR.position.set(3.7, 1.5, 0);

  const trackGeom = new THREE.BoxGeometry(1.2, 1.8, 10.5);
  const tL = enableShadows(new THREE.Mesh(trackGeom, trackMat()));
  tL.position.set(-3.2, 0.9, 0);
  const tR = enableShadows(new THREE.Mesh(trackGeom, trackMat()));
  tR.position.set(3.2, 0.9, 0);

  const wheelGeom = new THREE.CylinderGeometry(0.6, 0.6, 1.3, 8);
  for (let i = -4; i <= 4; i++) {
    const wL = new THREE.Mesh(wheelGeom, detailMat);
    wL.rotation.z = Math.PI / 2;
    wL.position.set(-3.2, 0.9, i * 1.2);
    g.add(wL);
    const wR = wL.clone();
    wR.position.x = 3.2;
    g.add(wR);
  }

  const turret = new THREE.Group();
  const turretBase = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.5, 5), hullMat));
  turretBase.position.y = 3;
  const cupola = enableShadows(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 8), detailMat));
  cupola.position.set(-1, 3.9, -1);
  const barrelGeom = new THREE.CylinderGeometry(0.25, 0.25, 5, 8);
  const barrel1 = enableShadows(new THREE.Mesh(barrelGeom, detailMat));
  barrel1.rotation.x = Math.PI / 2;
  barrel1.position.set(-0.6, 3.2, 4);
  const barrel2 = enableShadows(new THREE.Mesh(barrelGeom, detailMat));
  barrel2.rotation.x = Math.PI / 2;
  barrel2.position.set(0.6, 3.2, 4);
  turret.add(turretBase, cupola, barrel1, barrel2);

  const shieldRing = new THREE.Mesh(
    new THREE.RingGeometry(38, 42, 48),
    new THREE.MeshBasicMaterial({ color: 0x4466ff, transparent: true, opacity: 0.15, side: THREE.DoubleSide, depthTest: false })
  );
  shieldRing.rotation.x = -Math.PI / 2;
  shieldRing.position.y = 0.3;
  shieldRing.renderOrder = 894;
  g.add(shieldRing);
  g.userData.shieldRing = shieldRing;

  g.add(hull, frontPlate, slabL, slabR, tL, tR, turret);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 3.2, 6.5);
  return g;
}

function buildArtillery(g, color) {
  const hullMat = matteMat(color);
  const detailMat = metalMat(0x333333);

  const chassis = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(3.5, 1, 5), hullMat));
  chassis.position.y = 0.8;

  const outGeom = new THREE.BoxGeometry(0.3, 0.5, 2);
  const outL = enableShadows(new THREE.Mesh(outGeom, detailMat));
  outL.position.set(-2.2, 0.4, 0);
  const outR = enableShadows(new THREE.Mesh(outGeom, detailMat));
  outR.position.set(2.2, 0.4, 0);

  const turret = new THREE.Group();
  const base = enableShadows(new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.8, 0.8, 8), hullMat));
  base.position.y = 1.6;

  const cradle = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 2), hullMat));
  cradle.position.set(0, 2.2, 0);

  const barrel = enableShadows(new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 7, 8), detailMat));
  barrel.rotation.x = Math.PI / 2.2;
  barrel.position.set(0, 3.2, 3);

  const muzzle = enableShadows(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.5, 8), detailMat));
  muzzle.rotation.x = Math.PI / 2.2;
  muzzle.position.set(0, 4.3, 5.8);

  const pistonGeom = new THREE.CylinderGeometry(0.1, 0.1, 2, 6);
  const pL = new THREE.Mesh(pistonGeom, metalMat(0x888888, 0.3, 0.9));
  pL.rotation.x = Math.PI / 3;
  pL.position.set(-0.8, 2.5, 1.5);
  const pR = pL.clone();
  pR.position.x = 0.8;

  turret.add(base, cradle, barrel, muzzle, pL, pR);
  g.add(chassis, outL, outR, turret);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 4.5, 6);
  return g;
}

function buildMissileDefense(g, color) {
  const hullMat = matteMat(color);
  const detailMat = metalMat(0x222222);

  const base = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(4, 0.8, 4), hullMat));
  base.position.y = 0.6;

  const tower = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(1, 3, 1), detailMat));
  tower.position.set(-1.2, 2.5, -1.2);
  const radar = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(2, 2, 0.2), glassMat(0x44aaff)));
  radar.position.set(-1.2, 4, -1.2);
  radar.rotation.y = Math.PI / 4;

  const turret = new THREE.Group();
  const platform = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(3, 0.5, 3), hullMat));
  platform.position.y = 1.3;

  const cellGeom = new THREE.BoxGeometry(0.6, 1.5, 0.6);
  const cellMat = metalMat(0x444444);
  const missileTipMat = glowMat(0xff3300, 1);

  for (let x = -1; x <= 1; x++) {
    for (let z = -1; z <= 1; z++) {
      const cell = enableShadows(new THREE.Mesh(cellGeom, cellMat));
      cell.position.set(x * 0.8, 2.1, z * 0.8);
      turret.add(cell);
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.4, 6), missileTipMat);
      tip.position.set(x * 0.8, 2.9, z * 0.8);
      turret.add(tip);
    }
  }

  g.add(base, tower, radar, turret);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 3, 0);
  return g;
}

function buildMLRS(g, color) {
  const cabMat = matteMat(color);
  const detailMat = metalMat(0x222222);

  const cab = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.5, 2), cabMat));
  cab.position.set(0, 1.5, 2.5);
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.8, 0.1), glassMat(0x223344));
  windshield.position.set(0, 2, 3.5);
  g.add(windshield);

  const chassis = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(2.8, 1, 5), detailMat));
  chassis.position.y = 0.8;

  const wheelGeom = new THREE.CylinderGeometry(0.6, 0.6, 0.4, 8);
  const wheelPos = [[-1.4, 0.6, 2.5], [1.4, 0.6, 2.5], [-1.4, 0.6, -1.5], [1.4, 0.6, -1.5]];
  for (const p of wheelPos) {
    const w = enableShadows(new THREE.Mesh(wheelGeom, trackMat()));
    w.position.set(p[0], p[1], p[2]);
    w.rotation.z = Math.PI / 2;
    g.add(w);
  }

  const turret = new THREE.Group();
  const mount = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 2), cabMat));
  mount.position.y = 1.8;

  const pod = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.5, 3.5), metalMat(0x445544)));
  pod.position.set(0, 3, -0.5);
  pod.rotation.x = -0.4;

  const tubeGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 6);
  const tubeMat = metalMat(0x111111);
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      const tube = new THREE.Mesh(tubeGeom, tubeMat);
      tube.rotation.x = Math.PI / 2;
      tube.position.set(-0.75 + c * 0.5, 2.5 + r * 0.5, 1.2);
      pod.add(tube);
    }
  }

  turret.add(mount, pod);
  g.add(cab, chassis, turret);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 4, 2);
  return g;
}

function buildCoastal(g, color) {
  const concreteMat = matteMat(0x666666);
  const hullMat = matteMat(color);
  const detailMat = metalMat(0x333333);

  const base = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(6, 1.5, 6), concreteMat));
  base.position.y = 0.75;
  const wall = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(6, 2, 1), concreteMat));
  wall.position.set(0, 1.5, 2.5);

  const turret = new THREE.Group();
  const tBase = enableShadows(new THREE.Mesh(new THREE.CylinderGeometry(2, 2.2, 1.2, 8), hullMat));
  tBase.position.y = 2.1;

  const barrelGeom = new THREE.CylinderGeometry(0.3, 0.3, 5, 8);
  const barrel1 = enableShadows(new THREE.Mesh(barrelGeom, detailMat));
  barrel1.rotation.x = Math.PI / 2;
  barrel1.position.set(-0.6, 2.4, 3);
  const barrel2 = barrel1.clone();
  barrel2.position.x = 0.6;

  const muzzleGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.6, 8);
  const m1 = new THREE.Mesh(muzzleGeom, detailMat);
  m1.rotation.x = Math.PI / 2;
  m1.position.set(-0.6, 2.4, 5.5);
  const m2 = m1.clone();
  m2.position.x = 0.6;

  turret.add(tBase, barrel1, barrel2, m1, m2);
  g.add(base, wall, turret);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 2.4, 6);
  return g;
}

function buildHealer(g, color) {
  const bodyMat = matteMat(color);
  const detailMat = metalMat(0x333333);
  const glowGreen = glowMat(0x44ff44, 1.5);

  // Truck cab
  const cab = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(3, 2, 2.5), bodyMat));
  cab.position.set(0, 2, 2.5);
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1, 0.1), glassMat(0x224422));
  windshield.position.set(0, 2.8, 3.8);
  g.add(windshield);

  // Truck chassis
  const chassis = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(3, 1, 6), detailMat));
  chassis.position.y = 0.8;

  // Wheels
  const wheelGeom = new THREE.CylinderGeometry(0.7, 0.7, 0.4, 8);
  const wheelPos = [[-1.5, 0.6, 2], [1.5, 0.6, 2], [-1.5, 0.6, -2], [1.5, 0.6, -2]];
  for (const p of wheelPos) {
    const w = enableShadows(new THREE.Mesh(wheelGeom, trackMat()));
    w.position.set(p[0], p[1], p[2]);
    w.rotation.z = Math.PI / 2;
    g.add(w);
  }

  // Medical module on back
  const medBox = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(2.8, 2, 3.5), bodyMat));
  medBox.position.set(0, 2.3, -1);

  // Red cross / healing symbol (glowing)
  const cross1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 0.1), glowGreen);
  cross1.position.set(0, 2.8, 0.76);
  const cross2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.1), glowGreen);
  cross2.position.set(0, 2.8, 0.76);

  // Healing antenna
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2, 4), detailMat);
  antenna.position.set(1, 4, -2);

  // Emit dish
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.15, 8), glowGreen);
  dish.position.set(0, 5, -2);

  g.add(cab, chassis, medBox, cross1, cross2, antenna, dish);
  g.userData.muzzleOffset = null;
  return g;
}

// ---------- SEA ----------
function buildFrigate(g, color) {
  const hullMat = matteMat(color);
  const superMat = metalMat(0x888899, 0.6, 0.4);
  const deckMat = matteMat(0x333333);

  const hull = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.5, 10), hullMat));
  hull.position.y = 0.75;

  const bow = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.5, 2), hullMat));
  bow.position.set(0, 1, 5.5);
  bow.rotation.x = 0.3;

  const stern = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.2, 3), deckMat));
  stern.position.set(0, 1.5, -4);

  const bridge1 = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(2.5, 2, 3), superMat));
  bridge1.position.set(0, 2.5, -1);
  const bridge2 = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(2, 1.5, 2), superMat));
  bridge2.position.set(0, 4.2, -1);

  const win = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.5, 0.1), glassMat(0x113355));
  win.position.set(0, 3, 0.5);
  g.add(win);

  const turret = new THREE.Group();
  const tBase = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.8, 1.5), hullMat));
  tBase.position.y = 1.9;
  const barrel = enableShadows(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 2.5, 6), metalMat(0x222222)));
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 2.1, 1.5);
  turret.add(tBase, barrel);
  turret.position.set(0, 0, 3);

  const vls = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.3, 1.5), metalMat(0x555555)));
  vls.position.set(0, 1.6, -2.5);

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 3, 4), metalMat(0x444444));
  mast.position.set(0, 6.5, -1);
  const radar = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 0.2), glassMat(0x88ccff)));
  radar.position.set(0, 7, -1);

  g.add(hull, bow, stern, bridge1, bridge2, turret, vls, mast, radar);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 2.1, 4.5);
  g.userData.bobPhase = Math.random() * Math.PI * 2;
  return g;
}

function buildCruiser(g, color) {
  const hullMat = matteMat(color);
  const superMat = metalMat(0x888899, 0.6, 0.4);

  const hull = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.8, 16), hullMat));
  hull.position.y = 0.9;

  const bow = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.8, 3), hullMat));
  bow.position.set(0, 1.2, 7.5);
  bow.rotation.x = 0.2;

  const bridge1 = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(3.5, 3, 5), superMat));
  bridge1.position.set(0, 3.3, -3);
  const bridge2 = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(2.5, 2, 3), superMat));
  bridge2.position.set(0, 5.8, -3);

  const radarMat = glassMat(0x44aaff);
  const radar1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.5, 1.5), radarMat);
  radar1.position.set(1.8, 4, -1.5);
  const radar2 = radar1.clone();
  radar2.position.x = -1.8;
  g.add(radar1, radar2);

  const turret = new THREE.Group();
  const tBase = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), hullMat));
  tBase.position.y = 2.3;
  const barrel1 = enableShadows(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4, 6), metalMat(0x222222)));
  barrel1.rotation.x = Math.PI / 2;
  barrel1.position.set(-0.5, 2.5, 2);
  const barrel2 = barrel1.clone();
  barrel2.position.x = 0.5;
  turret.add(tBase, barrel1, barrel2);
  turret.position.set(0, 0, 5);

  const vls = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 3), metalMat(0x555555)));
  vls.position.set(0, 1.9, -6);
  const deck = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 4), matteMat(0x333333)));
  deck.position.set(0, 1.9, -8);

  g.add(hull, bow, bridge1, bridge2, turret, vls, deck);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 2.5, 7);
  g.userData.bobPhase = Math.random() * Math.PI * 2;
  return g;
}

function buildSubmarine(g, color) {
  const hullMat = matteMat(color);
  const detailMat = metalMat(0x222222);

  const hull = enableShadows(new THREE.Mesh(new THREE.CapsuleGeometry(1.2, 8, 8, 16), hullMat));
  hull.rotation.z = Math.PI / 2;
  hull.position.y = 0;

  const sail = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 2.5), hullMat));
  sail.position.set(0, 1.5, -1);

  const planeGeom = new THREE.BoxGeometry(2, 0.1, 0.8);
  const planeL = new THREE.Mesh(planeGeom, detailMat);
  planeL.position.set(0, 1.5, -1);
  g.add(planeL);

  const mast1 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.5, 4), detailMat);
  mast1.position.set(-0.3, 2.8, -1);
  const mast2 = mast1.clone();
  mast2.position.x = 0.3;
  g.add(mast1, mast2);

  const sensor = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 1), glowMat(0x00ffaa, 1));
  sensor.position.set(0, 2.3, -1);
  g.add(sensor);

  const prop = enableShadows(new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1, 8), detailMat));
  prop.rotation.z = Math.PI / 2;
  prop.position.set(-5, 0, 0);

  g.add(hull, sail, prop);
  g.userData.bobPhase = Math.random() * Math.PI * 2;
  return g;
}

function buildShip(g, color, scale) {
  const w = 5 * scale;
  const l = 14 * scale;
  const hullMat = matteMat(color);
  const superMat = metalMat(0x888899, 0.6, 0.4);

  const hull = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(w, 1.5, l), hullMat));
  hull.position.y = 0.75;

  const bow = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(w, 1.5, 3 * scale), hullMat));
  bow.position.set(0, 1, (l / 2) + 1);
  bow.rotation.x = 0.2;

  const bridge = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(3 * scale, 3 * scale, 4 * scale), superMat));
  bridge.position.set(0, 3 * scale, -1 * scale);

  const turret = new THREE.Group();
  const tBase = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(2 * scale, 1.2, 2 * scale), hullMat));
  tBase.position.y = 2.1 * scale;

  const barrelCount = scale > 1.2 ? 3 : 2;
  const barrelSpacing = 0.6 * scale;
  for (let i = 0; i < barrelCount; i++) {
    const barrel = enableShadows(new THREE.Mesh(new THREE.CylinderGeometry(0.25 * scale, 0.25 * scale, 4 * scale, 8), metalMat(0x222222)));
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set((i - (barrelCount - 1) / 2) * barrelSpacing, 2.3 * scale, 2.5 * scale);
    turret.add(barrel);
  }

  turret.add(tBase);
  turret.position.z = 4 * scale;

  g.add(hull, bow, bridge, turret);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 2.3 * scale, 6 * scale);
  g.userData.bobPhase = Math.random() * Math.PI * 2;
  return g;
}

function buildCarrier(g, color) {
  const hullMat = matteMat(color);
  const deckMat = matteMat(0x222222);
  const superMat = metalMat(0x888899, 0.6, 0.4);

  const hull = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(7, 1.5, 20), hullMat));
  hull.position.y = 0.75;

  const deck = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(9, 0.3, 22), deckMat));
  deck.position.y = 1.6;

  const lineMat = glowMat(0xffffff, 0.5);
  const line1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 20), lineMat);
  line1.position.set(0, 1.8, 0);
  const line2 = new THREE.Mesh(new THREE.BoxGeometry(8, 0.05, 0.1), lineMat);
  line2.position.set(0, 1.8, -5);
  g.add(line1, line2);

  const angledDeck = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(5, 0.3, 10), deckMat));
  angledDeck.position.set(3, 1.65, -3);
  angledDeck.rotation.y = 0.2;

  const island = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(1.5, 4, 5), superMat));
  island.position.set(4, 3.8, -5);

  const radar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.5, 1.5), glassMat(0x44aaff));
  radar.position.set(4.8, 4.5, -4);
  g.add(radar);

  const jetMat = matteMat(0x556677);
  for (let i = -1; i <= 1; i += 2) {
    const jet = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 3), jetMat));
    jet.position.set(i * 1.5, 1.9, 5);
    g.add(jet);
  }

  g.add(hull, deck, angledDeck, island);
  g.userData.bobPhase = Math.random() * Math.PI * 2;
  return g;
}

function buildTransport(g, color) {
  const hullMat = matteMat(color);
  const deckMat = matteMat(0x443322);
  const detailMat = metalMat(0x333333);

  const hull = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(6, 1.5, 14), hullMat));
  hull.position.y = 0.75;

  const deck = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(5, 0.3, 8), deckMat));
  deck.position.set(0, 1.5, 1);

  const ramp = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(5, 0.3, 4), detailMat));
  ramp.position.set(0, 0.8, 6.5);
  ramp.rotation.x = 0.4;

  const cabin = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(5.5, 3, 4), hullMat));
  cabin.position.set(0, 3, -4.5);

  const win = new THREE.Mesh(new THREE.BoxGeometry(5, 1, 0.1), glassMat(0x223344));
  win.position.set(0, 3.5, -2.5);
  g.add(win);

  const containerMat = matteMat(0xaa4422);
  const container = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(2, 2, 4), containerMat));
  container.position.set(-1, 2.6, 1);
  g.add(container);

  g.add(hull, deck, ramp, cabin);
  g.userData.bobPhase = Math.random() * Math.PI * 2;
  g.userData.muzzleOffset = null;
  return g;
}

function buildEscortJet(g, color) {
  const bodyMat = matteMat(color);
  const detailMat = metalMat(0x333333);

  // Fuselage along Z axis (forward = +Z)
  const fuselage = enableShadows(new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 5, 4, 8), bodyMat));
  fuselage.rotation.x = Math.PI / 2;

  const cockpit = enableShadows(new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), glassMat(0x113344)));
  cockpit.position.set(0, 0.3, 2.5);
  cockpit.rotation.x = -Math.PI / 3;

  // Thick swept wings
  const wingGeom = new THREE.BoxGeometry(2.5, 0.15, 5);
  const wingL = enableShadows(new THREE.Mesh(wingGeom, bodyMat));
  wingL.position.set(-0.5, -0.1, 0);
  wingL.rotation.y = -0.3;
  const wingR = enableShadows(new THREE.Mesh(wingGeom, bodyMat));
  wingR.position.set(0.5, -0.1, 0);
  wingR.rotation.y = 0.3;

  // Dual exhausts
  const exhaustGeom = new THREE.CylinderGeometry(0.3, 0.35, 0.6, 8);
  const exhaustL = new THREE.Mesh(exhaustGeom, glowMat(0x44aaff, 2));
  exhaustL.rotation.x = Math.PI / 2;
  exhaustL.position.set(-0.5, 0, -2.5);
  const exhaustR = exhaustL.clone();
  exhaustR.position.x = 0.5;

  // Tail fins (vertical stabilizers)
  const tailGeom = new THREE.BoxGeometry(0.15, 1.5, 1.2);
  const tailL = enableShadows(new THREE.Mesh(tailGeom, bodyMat));
  tailL.position.set(-1, 0.8, -2);
  tailL.rotation.z = -0.15;
  const tailR = enableShadows(new THREE.Mesh(tailGeom, bodyMat));
  tailR.position.set(1, 0.8, -2);
  tailR.rotation.z = 0.15;

  // Missile pylons
  const pylonGeom = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 6);
  const missileMat = metalMat(0x666666);
  for (let i = 0; i < 2; i++) {
    const m1 = new THREE.Mesh(pylonGeom, missileMat);
    m1.rotation.x = Math.PI / 2;
    m1.position.set(-0.3, -0.3, 1 + i * 0.8);
    g.add(m1);
    const m2 = m1.clone();
    m2.position.x = 0.3;
    g.add(m2);
  }

  g.add(fuselage, cockpit, wingL, wingR, exhaustL, exhaustR, tailL, tailR);
  g.userData.muzzleOffset = new THREE.Vector3(0, 0, 3);
  return g;
}

function buildB2(g, color) {
  const bodyMat = matteMat(color);
  const detailMat = metalMat(0x222222);

  // Flying wing body along Z axis (forward = +Z)
  const body = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(2, 0.6, 4), bodyMat));
  body.position.y = 0;

  // Wings — massive swept delta along X axis
  const wingL = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(5, 0.3, 3), bodyMat));
  wingL.position.set(-3.5, 0, 0);
  wingL.rotation.y = 0.4;
  const wingR = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(5, 0.3, 3), bodyMat));
  wingR.position.set(3.5, 0, 0);
  wingR.rotation.y = -0.4;

  // Cockpit (flush, stealthy)
  const cockpit = enableShadows(new THREE.Mesh(new THREE.SphereGeometry(0.4, 6, 6, 0, Math.PI * 2, 0, Math.PI / 2), glassMat(0x112222)));
  cockpit.position.set(0, 0.4, 1.5);

  // Engine intakes (buried in wing)
  const intakeL = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.3, 0.8), detailMat);
  intakeL.position.set(-1, 0.2, -0.5);
  const intakeR = intakeL.clone();
  intakeR.position.x = 1;

  // Exhausts (flat, stealthy) at rear (-Z)
  const exhaustGeom = new THREE.BoxGeometry(0.8, 0.15, 1);
  const exhaustL = new THREE.Mesh(exhaustGeom, glowMat(0xff5500, 1.5));
  exhaustL.position.set(-1, 0, -2);
  const exhaustR = exhaustL.clone();
  exhaustR.position.x = 1;

  // Weapons bay lines
  const bay = new THREE.Mesh(new THREE.BoxGeometry(2, 0.05, 1.5), detailMat);
  bay.position.set(0, -0.3, 0);

  g.add(body, wingL, wingR, cockpit, intakeL, intakeR, exhaustL, exhaustR, bay);
  g.userData.muzzleOffset = new THREE.Vector3(0, 0, 2);
  return g;
}

function buildEscortBomber(g, color) {
  const bodyMat = matteMat(color);
  const detailMat = metalMat(0x333333);

  // Very large fuselage along Z axis (forward = +Z)
  const body = enableShadows(new THREE.Mesh(new THREE.CapsuleGeometry(1.8, 8, 4, 8), bodyMat));
  body.rotation.x = Math.PI / 2;

  // Cockpit at front (+Z)
  const cockpit = enableShadows(new THREE.Mesh(new THREE.SphereGeometry(0.8, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), glassMat(0x113344)));
  cockpit.position.set(0, 0.5, 4.5);
  cockpit.rotation.x = -Math.PI / 3;

  // Massive wings along X axis
  const wingGeom = new THREE.BoxGeometry(2.5, 0.25, 10);
  const wingL = enableShadows(new THREE.Mesh(wingGeom, bodyMat));
  wingL.position.set(-1, 0.3, 0);
  const wingR = enableShadows(new THREE.Mesh(wingGeom, bodyMat));
  wingR.position.set(1, 0.3, 0);

  // 4 engines
  const engGeom = new THREE.CylinderGeometry(0.5, 0.5, 2.5, 8);
  const engPositions = [[-1, 0.3, 3], [-1, 0.3, -3], [1, 0.3, 3], [1, 0.3, -3]];
  for (const p of engPositions) {
    const eng = enableShadows(new THREE.Mesh(engGeom, detailMat));
    eng.rotation.x = Math.PI / 2;
    eng.position.set(p[0], p[1], p[2]);
    g.add(eng);
    const exhaust = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.3, 8), glowMat(0xff4400, 1.5));
    exhaust.rotation.x = Math.PI / 2;
    exhaust.position.set(p[0], p[1], p[2] - 1.5);
    g.add(exhaust);
  }

  // Tail at rear (-Z)
  const tailH = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.2, 3), bodyMat));
  tailH.position.set(0, 0.5, -5);
  const tailV = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(0.2, 3, 2.5), bodyMat));
  tailV.position.set(0, 2, -5);

  // Defensive gun turrets (visual only, no damage)
  const turretMat = metalMat(0x444444);
  const turret1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.8, 6), turretMat);
  turret1.rotation.x = Math.PI / 2;
  turret1.position.set(1, -1, -2);
  g.add(turret1);

  g.add(body, cockpit, wingL, wingR, tailH, tailV);
  g.userData.muzzleOffset = new THREE.Vector3(0, 0, 5);
  return g;
}

// ---------- AIR ----------
function buildHeli(g, color) {
  const bodyMat = matteMat(color);
  const glassMatInst = glassMat(0x113322);
  const detailMat = metalMat(0x222222);

  const body = enableShadows(new THREE.Mesh(new THREE.CapsuleGeometry(0.7, 2.5, 4, 8), bodyMat));
  body.rotation.z = Math.PI / 2;

  const cockpitFront = enableShadows(new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), glassMatInst));
  cockpitFront.position.set(1.2, 0.2, 0);
  cockpitFront.rotation.z = -Math.PI / 2;

  const cockpitBack = enableShadows(new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), glassMatInst));
  cockpitBack.position.set(-0.2, 0.6, 0);
  cockpitBack.rotation.z = -Math.PI / 2;

  const tail = enableShadows(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.3, 3.5, 6), bodyMat));
  tail.rotation.z = Math.PI / 2;
  tail.position.set(-2.8, 0.2, 0);

  const fin = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.1), bodyMat));
  fin.position.set(-4.2, 0.8, 0);

  const wingGeom = new THREE.BoxGeometry(0.5, 0.2, 2);
  const wingL = enableShadows(new THREE.Mesh(wingGeom, detailMat));
  wingL.position.set(-0.5, -0.2, 1.2);
  const wingR = enableShadows(new THREE.Mesh(wingGeom, detailMat));
  wingR.position.set(-0.5, -0.2, -1.2);

  const missileGeom = new THREE.CylinderGeometry(0.1, 0.1, 1, 6);
  for (let i = 0; i < 2; i++) {
    const mL = new THREE.Mesh(missileGeom, metalMat(0x555555));
    mL.rotation.x = Math.PI / 2;
    mL.position.set(-0.5, -0.4, 0.8 + i * 0.8);
    g.add(mL);
    const mR = mL.clone();
    mR.position.z = -(0.8 + i * 0.8);
    g.add(mR);
  }

  const sensor = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), glowMat(0xff0000, 1));
  sensor.position.set(1.6, -0.4, 0);
  g.add(sensor);

  const rotorHub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.4, 6), detailMat);
  rotorHub.position.set(0, 1.1, 0);
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5, metalness: 0.5, transparent: true, opacity: 0.6 });
  const blade1 = new THREE.Mesh(new THREE.BoxGeometry(7, 0.05, 0.3), bladeMat);
  blade1.position.set(0, 1.3, 0);
  const blade2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 7), bladeMat);
  blade2.position.set(0, 1.3, 0);

  const tailRotor = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.5, 0.2), bladeMat);
  tailRotor.position.set(-4.2, 0.8, 0.2);

  g.add(body, cockpitFront, cockpitBack, tail, fin, wingL, wingR, sensor, rotorHub, blade1, blade2, tailRotor);
  g.userData.muzzleOffset = new THREE.Vector3(1.6, -0.4, 0);
  return g;
}

function buildMedHeli(g, color) {
  const bodyMat = matteMat(color);
  const detailMat = metalMat(0x222222);
  const glowGreen = glowMat(0x44ff44, 1.5);

  const body = enableShadows(new THREE.Mesh(new THREE.CapsuleGeometry(0.7, 2.5, 4, 8), bodyMat));
  body.rotation.z = Math.PI / 2;

  const cockpitFront = enableShadows(new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), glassMat(0x113322)));
  cockpitFront.position.set(1.2, 0.2, 0);
  cockpitFront.rotation.z = -Math.PI / 2;

  const tail = enableShadows(new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.3, 3.5, 6), bodyMat));
  tail.rotation.z = Math.PI / 2;
  tail.position.set(-2.8, 0.2, 0);

  const fin = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.1), bodyMat));
  fin.position.set(-4.2, 0.8, 0);

  // Medical cross on side
  const cross1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 0.1), glowGreen);
  cross1.position.set(0, 0.5, 0.75);
  const cross2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.1), glowGreen);
  cross2.position.set(0, 0.5, 0.75);

  // Stub wings
  const wingL = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 1.5), detailMat));
  wingL.position.set(-0.5, -0.2, 1);
  const wingR = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 1.5), detailMat));
  wingR.position.set(-0.5, -0.2, -1);

  // Sensor dish on bottom
  const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 8), glowGreen);
  dish.position.set(0, -0.5, 0);

  // Main rotor
  const rotorHub = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.4, 6), detailMat);
  rotorHub.position.set(0, 1.1, 0);
  const bladeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5, metalness: 0.5, transparent: true, opacity: 0.6 });
  const blade1 = new THREE.Mesh(new THREE.BoxGeometry(7, 0.05, 0.3), bladeMat);
  blade1.position.set(0, 1.3, 0);
  const blade2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 7), bladeMat);
  blade2.position.set(0, 1.3, 0);

  const tailRotor = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.5, 0.2), bladeMat);
  tailRotor.position.set(-4.2, 0.8, 0.2);

  g.add(body, cockpitFront, tail, fin, cross1, cross2, wingL, wingR, dish, rotorHub, blade1, blade2, tailRotor);
  g.userData.muzzleOffset = null;
  return g;
}

function buildGunship(g, color) {
  const bodyMat = matteMat(color);
  const detailMat = metalMat(0x222222);

  const body = enableShadows(new THREE.Mesh(new THREE.CapsuleGeometry(1.5, 6, 4, 8), bodyMat));
  body.rotation.z = Math.PI / 2;

  const cockpit = enableShadows(new THREE.Mesh(new THREE.SphereGeometry(1.2, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), glassMat(0x113322)));
  cockpit.position.set(3.5, 0.5, 0);
  cockpit.rotation.z = -Math.PI / 2;

  const wings = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 12), bodyMat));
  wings.position.set(-0.5, 0.5, 0);

  const engGeom = cylGeo(0.4, 0.4, 2, 12);
  for (let i = 0; i < 4; i++) {
    const eng = enableShadows(new THREE.Mesh(engGeom, detailMat));
    eng.rotation.x = Math.PI / 2;
    eng.position.set(-0.5, 0, -4.5 + i * 3);

    const exhaust = new THREE.Mesh(
      cylGeo(0.3, 0.3, 0.2, 12),
      glowMat(0xff5500, 2)
    );
    exhaust.rotation.x = Math.PI / 2;
    exhaust.position.set(-0.5, 0, -5.5 + i * 3);

    g.add(eng, exhaust);
  }

  const tailH = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(1, 0.2, 4), bodyMat));
  tailH.position.set(-4, 0.5, 0);
  const tailV = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.5, 2), bodyMat));
  tailV.position.set(-4, 1.5, 0);

  const gunGeom = new THREE.CylinderGeometry(0.15, 0.15, 2.5, 6);
  const gun1 = enableShadows(new THREE.Mesh(gunGeom, detailMat));
  gun1.rotation.x = Math.PI / 2;
  gun1.position.set(0, -1, 1.5);
  const gun2 = gun1.clone();
  gun2.position.z = -0.5;

  const howitzer = enableShadows(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3, 8), detailMat));
  howitzer.rotation.x = Math.PI / 2;
  howitzer.position.set(0, -1, -2.5);

  const blister = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), glassMat(0x2244aa));
  blister.position.set(1, -1, 0);
  g.add(blister);

  g.add(body, cockpit, wings, tailH, tailV, gun1, gun2, howitzer);
  g.userData.muzzleOffset = new THREE.Vector3(0, -1, 2.5);
  return g;
}

function buildJet(g, color, scale) {
  const bodyMat = matteMat(color);
  const detailMat = metalMat(0x333333);

  // Fuselage along Z axis (forward = +Z) — use rotation.x instead of rotation.z
  const fuselage = enableShadows(new THREE.Mesh(
    new THREE.CapsuleGeometry(0.4 * scale, 5 * scale, 4, 8), bodyMat
  ));
  fuselage.rotation.x = Math.PI / 2;

  const cockpit = enableShadows(new THREE.Mesh(
    new THREE.SphereGeometry(0.4 * scale, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), glassMat(0x113344)
  ));
  cockpit.position.set(0, 0.3 * scale, 2 * scale);
  cockpit.rotation.x = -Math.PI / 3;

  const wingGeom = new THREE.BoxGeometry(2 * scale, 0.1 * scale, 4 * scale);
  const wingL = enableShadows(new THREE.Mesh(wingGeom, bodyMat));
  wingL.position.set(-0.5 * scale, -0.1 * scale, 0);
  wingL.rotation.y = -0.4;

  const wingR = enableShadows(new THREE.Mesh(wingGeom, bodyMat));
  wingR.position.set(0.5 * scale, -0.1 * scale, 0);
  wingR.rotation.y = 0.4;

  const tailGeom = new THREE.BoxGeometry(1 * scale, 0.1 * scale, 1.5 * scale);
  const tailL = enableShadows(new THREE.Mesh(tailGeom, bodyMat));
  tailL.position.set(-1 * scale, 0.5 * scale, -2 * scale);
  tailL.rotation.z = -0.5;
  const tailR = enableShadows(new THREE.Mesh(tailGeom, bodyMat));
  tailR.position.set(1 * scale, 0.5 * scale, -2 * scale);
  tailR.rotation.z = 0.5;

  const exhaustGeom = new THREE.CylinderGeometry(0.25 * scale, 0.3 * scale, 0.5 * scale, 8);
  const exhaustL = new THREE.Mesh(exhaustGeom, glowMat(0x44aaff, 2));
  exhaustL.rotation.x = Math.PI / 2;
  exhaustL.position.set(-0.4 * scale, 0, -2.5 * scale);
  const exhaustR = exhaustL.clone();
  exhaustR.position.x = 0.4 * scale;

  const canardGeom = new THREE.BoxGeometry(0.8 * scale, 0.05 * scale, 1 * scale);
  const canardL = enableShadows(new THREE.Mesh(canardGeom, bodyMat));
  canardL.position.set(-1 * scale, 0, 1.5 * scale);
  const canardR = enableShadows(new THREE.Mesh(canardGeom, bodyMat));
  canardR.position.set(1 * scale, 0, 1.5 * scale);

  g.add(fuselage, cockpit, wingL, wingR, tailL, tailR, exhaustL, exhaustR, canardL, canardR);
  g.userData.muzzleOffset = new THREE.Vector3(0, 0, 3 * scale);
  return g;
}

// ---------- BUILDINGS / BASES ----------
export function createBaseMesh(size = 1, isPlayer = false) {
  const g = new THREE.Group();
  const baseColor = isPlayer ? 0x2266aa : 0xaa3333;
  const wallMat = matteMat(0x555555);
  const hqMat = matteMat(baseColor);
  const glowColor = isPlayer ? 0x44aaff : 0xff4444;

  const wall = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(20 * size, 4, 20 * size), wallMat));
  wall.position.y = 2;

  const trim = new THREE.Mesh(new THREE.BoxGeometry(20.2 * size, 0.2, 20.2 * size), glowMat(glowColor, 1));
  trim.position.y = 4.1;
  g.add(trim);

  const hq = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(8 * size, 8, 8 * size), hqMat));
  hq.position.y = 8;

  const winMat = glowMat(glowColor, 0.8);
  for (let i = 0; i < 3; i++) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(8.1 * size, 0.5, 0.5), winMat);
    win.position.set(0, 5 + i * 2.5, 4 * size);
    g.add(win);
    const winBack = win.clone();
    winBack.position.z = -4 * size;
    g.add(winBack);
  }

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(3 * size, 3 * size, 0.1, 16), matteMat(0x333333));
  pad.position.y = 12.1;
  const padLine = new THREE.Mesh(new THREE.RingGeometry(2 * size, 2.2 * size, 16), glowMat(glowColor, 1));
  padLine.rotation.x = -Math.PI / 2;
  padLine.position.y = 12.2;
  g.add(pad, padLine);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 6), metalMat(0x888888));
  pole.position.set(0, 15, 0);
  const flag = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 0.1), matteMat(baseColor));
  flag.position.set(1.5, 16, 0);
  flag.userData.isFlag = true;

  g.add(wall, hq, pole, flag);
  return g;
}

export function createShipyardMesh(size = 1, isPlayer = false) {
  const g = new THREE.Group();
  const baseColor = isPlayer ? 0x2266aa : 0xaa3333;
  const concreteMat = matteMat(0x555555);
  const metalMatInst = metalMat(0x777777, 0.6, 0.8);
  const glowColor = isPlayer ? 0x44aaff : 0xff4444;

  const dock = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(24 * size, 1.5, 20 * size), concreteMat));
  dock.position.y = 0.75;

  const building = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(10 * size, 6, 8 * size), matteMat(baseColor)));
  building.position.set(-4 * size, 4.5, 0);

  const door = new THREE.Mesh(new THREE.BoxGeometry(4 * size, 4, 0.1), glowMat(glowColor, 0.5));
  door.position.set(-4 * size, 3.5, 4.1 * size);
  g.add(door);

  const craneLeg1 = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(0.5 * size, 12, 0.5 * size), metalMatInst));
  craneLeg1.position.set(6 * size, 6, 4 * size);
  const craneLeg2 = craneLeg1.clone();
  craneLeg2.position.z = -4 * size;

  const craneArm = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(12 * size, 1, 1 * size), metalMatInst));
  craneArm.position.set(8 * size, 12, 0);

  const light1 = new THREE.Mesh(new THREE.SphereGeometry(0.3 * size, 8, 8), glowMat(0xffffaa, 2));
  light1.position.set(12 * size, 11.5, 0);
  g.add(light1);

  const waterMat = new THREE.MeshStandardMaterial({ color: 0x113355, roughness: 0.1, metalness: 0.8, transparent: true, opacity: 0.8 });
  for (let i = -1; i <= 1; i += 2) {
    const slip = new THREE.Mesh(new THREE.BoxGeometry(4 * size, 0.5, 10 * size), waterMat);
    slip.position.set(i * 4 * size, 0.1, 0);
    g.add(slip);
  }

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 6), metalMat(0x888888));
  pole.position.set(0, 15, 0);
  const flag = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 0.1), matteMat(baseColor));
  flag.position.set(1.5, 16, 0);
  flag.userData.isFlag = true;

  g.add(dock, building, craneLeg1, craneLeg2, craneArm, pole, flag);
  return g;
}

// ---------- PROJECTILE ----------
export function createProjectileMesh(domain) {
  if (domain === 'land') {
    const g = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.8, 6),
      glowMat(0xffaa00, 2)
    );
    body.rotation.x = Math.PI / 2;
    g.add(body);
    const trail = new THREE.Mesh(
      new THREE.ConeGeometry(0.15, 1.5, 6),
      new THREE.MeshBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.6 })
    );
    trail.rotation.x = -Math.PI / 2;
    trail.position.z = -1;
    g.add(trail);
    return g;
  }
  if (domain === 'sea') {
    const g = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 1.5, 8),
      metalMat(0x555566, 0.4, 0.8)
    );
    body.rotation.x = Math.PI / 2;
    g.add(body);
    const tip = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 0.5, 8),
      metalMat(0x888899, 0.3, 0.9)
    );
    tip.rotation.x = Math.PI / 2;
    tip.position.z = 1;
    g.add(tip);
    return g;
  }
  if (domain === 'air') {
    const g = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 1.2, 8),
      metalMat(0xcccccc, 0.5, 0.5)
    );
    body.rotation.x = Math.PI / 2;
    g.add(body);

    const finGeom = new THREE.BoxGeometry(0.4, 0.05, 0.2);
    for (let i = 0; i < 4; i++) {
      const fin = new THREE.Mesh(finGeom, metalMat(0x555555));
      fin.position.z = -0.5;
      fin.rotation.z = (Math.PI / 2) * i;
      g.add(fin);
    }

    const exhaust = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.15, 0.3, 6),
      glowMat(0xff4400, 3)
    );
    exhaust.rotation.x = Math.PI / 2;
    exhaust.position.z = -0.7;
    g.add(exhaust);

    return g;
  }
  return new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), glowMat(0xffaa00, 2));
}

function buildMinigunnerVehicle(g, color) {
  const bodyMat = matteMat(color);
  const detailMat = metalMat(0x444444);
  const gunMat = metalMat(0x666666);
  const chassis = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(3.5, 1, 5), detailMat));
  chassis.position.y = 0.8;
  const body = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(3, 2, 3), bodyMat));
  body.position.set(0, 2, 0.5);
  const turret = enableShadows(new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 1, 8), detailMat));
  turret.position.set(0, 2.8, 1.5);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.5, 6), gunMat);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 2.8, 3.5);
  const barrel2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.5, 6), gunMat);
  barrel2.rotation.x = Math.PI / 2;
  barrel2.position.set(0.6, 2.8, 3.5);
  const barrel3 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.5, 6), gunMat);
  barrel3.rotation.x = Math.PI / 2;
  barrel3.position.set(-0.6, 2.8, 3.5);
  const wheelGeom = new THREE.CylinderGeometry(0.7, 0.7, 0.4, 8);
  for (const p of [[-1.7, 0.6, 2], [1.7, 0.6, 2], [-1.7, 0.6, -2], [1.7, 0.6, -2]]) {
    const w = enableShadows(new THREE.Mesh(wheelGeom, trackMat()));
    w.position.set(p[0], p[1], p[2]);
    w.rotation.z = Math.PI / 2;
    g.add(w);
  }
  g.userData.muzzleOffset = new THREE.Vector3(0, 2.8, 4.8);
  g.add(chassis, body, turret, barrel, barrel2, barrel3);
  return g;
}

function buildMegaMedic(g, color) {
  const bodyMat = matteMat(color);
  const detailMat = metalMat(0x333333);
  const crossMat = glowMat(0x44ff44, 1.5);
  const chassis = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(3.5, 1, 6), detailMat));
  chassis.position.y = 0.8;
  const cab = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(3, 2, 2.5), bodyMat));
  cab.position.set(0, 2, 2.5);
  const medModule = enableShadows(new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.5, 4), bodyMat));
  medModule.position.set(0, 2.5, -1);
  const crossH = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 0.1), crossMat);
  crossH.position.set(0, 2.8, -1);
  const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.5, 0.1), crossMat);
  crossV.position.set(0, 2.8, -1);
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1, 0.1), glassMat(0x224422));
  windshield.position.set(0, 2.8, 3.8);
  const wheelGeom = new THREE.CylinderGeometry(0.7, 0.7, 0.4, 8);
  for (const p of [[-1.7, 0.6, 2], [1.7, 0.6, 2], [-1.7, 0.6, -2], [1.7, 0.6, -2]]) {
    const w = enableShadows(new THREE.Mesh(wheelGeom, trackMat()));
    w.position.set(p[0], p[1], p[2]);
    w.rotation.z = Math.PI / 2;
    g.add(w);
  }
  g.add(chassis, cab, medModule, crossH, crossV, windshield);
  return g;
}

function buildMinigunner(g, color) {
  const bodyMat = matteMat(color);
  const gunMat = metalMat(0x666666);
  const body = enableShadows(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 1.5, 6), bodyMat));
  body.position.y = 1;
  const head = enableShadows(new THREE.Mesh(new THREE.SphereGeometry(0.35, 6, 6), bodyMat));
  head.position.y = 1.9;
  const gun = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 4), gunMat);
  gun.rotation.x = Math.PI / 2;
  gun.position.set(0.4, 1.3, 0.8);
  const gun2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 4), gunMat);
  gun2.rotation.x = Math.PI / 2;
  gun2.position.set(0.6, 1.3, 0.8);
  g.add(body, head, gun, gun2);
  return g;
}

/** Marks newly-launched carrier fighters visually with a small green ring. */
export function tagAsLaunchedFighter(group) {
  const marker = new THREE.Mesh(
    new THREE.RingGeometry(0.5, 0.7, 16),
    new THREE.MeshBasicMaterial({ color: 0x44ff44, side: THREE.DoubleSide })
  );
  marker.rotation.x = -Math.PI / 2;
  marker.position.y = 3;
  group.add(marker);
}
