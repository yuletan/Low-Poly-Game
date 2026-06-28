// unitFactory.js — Builds simple but recognizable 3D meshes.
import * as THREE from 'three';

function mat(color) { return new THREE.MeshLambertMaterial({ color }); }

/** Returns a THREE.Group representing the unit. The group has a child `turret`
 *  reference for units that rotate to aim. */
export function createUnitMesh(type, color, faction) {
  const tint = faction === 'enemy' ? mixColor(color, 0xaa3333, 0.4) : color;
  const g = new THREE.Group();
  g.userData.turret = null;
  g.userData.muzzleOffset = null;

  switch (type) {
    case 'infantry': return buildInfantry(g, tint);
    case 'tank':     return buildTank(g, tint);
    case 'artillery':return buildArtillery(g, tint);
    case 'missileDefense':return buildMissileDefense(g, tint);
    case 'destroyer':return buildShip(g, tint, 1.0);
    case 'battleship':return buildShip(g, tint, 1.6);
    case 'carrier':  return buildCarrier(g, tint);
    case 'transport':return buildTransport(g, tint);
    case 'fighter':  return buildJet(g, tint, 1.0);
    case 'bomber':   return buildJet(g, tint, 1.4);
  }
  return g;
}

function mixColor(a,b,t){
  const ca=new THREE.Color(a), cb=new THREE.Color(b);
  return ca.lerp(cb,t).getHex();
}

// ---------- LAND ----------
function buildInfantry(g, color){
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.2,2,1.2), mat(color));
  body.position.y = 1; body.castShadow = true;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.5,6,6), mat(0xddbb99));
  head.position.y = 2.4;
  g.add(body, head);
  return g;
}

function buildTank(g, color){
  // Hull
  const hull = new THREE.Mesh(new THREE.BoxGeometry(5,1.3,7), mat(color));
  hull.position.y = 1; hull.castShadow = true;
  // Tracks
  const trackMat = mat(0x222222);
  const trackGeom = new THREE.BoxGeometry(1,0.8,7.5);
  const tL = new THREE.Mesh(trackGeom, trackMat); tL.position.set(-2.5,0.4,0);
  const tR = new THREE.Mesh(trackGeom, trackMat); tR.position.set( 2.5,0.4,0);
  // Turret (rotates)
  const turret = new THREE.Group();
  const turretBase = new THREE.Mesh(new THREE.CylinderGeometry(1.6,1.8,1,8), mat(color));
  turretBase.position.y = 2.2; turretBase.castShadow = true;
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.25,0.25,4,6), mat(0x333333));
  barrel.rotation.x = Math.PI/2;
  barrel.rotation.y = Math.PI/2;
  barrel.position.set(0, 2.2, 2.5);
  turret.add(turretBase, barrel);
  g.add(hull, tL, tR, turret);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 2.2, 2.5);
  return g;
}

function buildArtillery(g, color){
  const base = new THREE.Mesh(new THREE.BoxGeometry(4,1,5), mat(color));
  base.position.y = 0.8; base.castShadow = true;
  const turret = new THREE.Group();
  const cradle = new THREE.Mesh(new THREE.BoxGeometry(1.5,1,2), mat(color));
  cradle.position.y = 1.8;
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,6,6), mat(0x444444));
  barrel.rotation.x = Math.PI/2.3;
  barrel.rotation.y = Math.PI/2;
  barrel.position.set(0, 2.4, 2);
  turret.add(cradle, barrel);
  g.add(base, turret);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 2.4, 2);
  return g;
}

function buildMissileDefense(g, color){
  const base = new THREE.Mesh(new THREE.BoxGeometry(4, 0.8, 4), mat(color));
  base.position.y = 0.6; base.castShadow = true;
  const platform = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2, 0.5, 8), mat(0x444444));
  platform.position.y = 1.3;
  const turret = new THREE.Group();
  const launcher = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 2.5), mat(0x666666));
  launcher.position.y = 2.0;
  const missile1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.8, 6), mat(0xcc4444));
  missile1.position.set(-0.3, 2.5, 0);
  missile1.rotation.x = Math.PI / 2;
  const missile2 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.8, 6), mat(0xcc4444));
  missile2.position.set(0.3, 2.5, 0);
  missile2.rotation.x = Math.PI / 2;
  turret.add(launcher, missile1, missile2);
  g.add(base, platform, turret);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 2.5, 0);
  return g;
}

// ---------- SEA ----------
function buildShip(g, color, scale){
  const w = 5 * scale;
  const l = 14 * scale;
  const hull = new THREE.Mesh(new THREE.BoxGeometry(w, 1.5, l), mat(color));
  hull.position.y = 0.5; hull.castShadow = true;
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(3*scale, 2.5, 3*scale), mat(0xaaaaaa));
  bridge.position.set(0, 2.5, -1*scale);
  const turret = new THREE.Group();
  const tBase = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.2, 0.8, 8), mat(color));
  tBase.position.y = 1.6;
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 3, 6), mat(0x333333));
  barrel.rotation.x = Math.PI/2;
  barrel.rotation.y = Math.PI/2;
  barrel.position.set(0, 1.6, 2);
  turret.add(tBase, barrel);
  turret.position.z = 4 * scale;
  g.add(hull, bridge, turret);
  g.userData.turret = turret;
  g.userData.muzzleOffset = new THREE.Vector3(0, 1.6, 2);
  g.userData.bobPhase = Math.random() * Math.PI * 2;
  return g;
}

function buildCarrier(g, color){
  const hull = new THREE.Mesh(new THREE.BoxGeometry(7, 1.5, 20), mat(color));
  hull.position.y = 0.5; hull.castShadow = true;
  const deck = new THREE.Mesh(new THREE.BoxGeometry(9, 0.5, 22), mat(0x222222));
  deck.position.y = 1.5;
  // Angled flight deck extension
  const angledDeck = new THREE.Mesh(
    new THREE.BoxGeometry(5, 0.3, 10), mat(0x333333)
  );
  angledDeck.position.set(3, 1.6, -3);
  angledDeck.rotation.y = 0.3;
  const tower = new THREE.Mesh(new THREE.BoxGeometry(1.5, 4, 4), mat(0xaaaaaa));
  tower.position.set(4, 3.5, -5);
  // Aircraft on deck (small blocks)
  for (let i = -1; i <= 1; i += 2) {
    const plane = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 2), mat(0x9999aa));
    plane.position.set(i * 1.5, 1.8, 4);
    g.add(plane);
  }
  g.add(hull, deck, angledDeck, tower);
  g.userData.bobPhase = Math.random() * Math.PI * 2;
  return g;
}

function buildTransport(g, color) {
  // Flat hull (landing craft style)
  const hull = new THREE.Mesh(new THREE.BoxGeometry(6, 1, 14), mat(color));
  hull.position.y = 0.5; hull.castShadow = true;
  // Deck
  const deck = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.3, 10), mat(0x5c4a3a));
  deck.position.y = 1.2;
  // Ramp front
  const ramp = new THREE.Mesh(new THREE.BoxGeometry(4, 0.5, 2), mat(0x5c4a3a));
  ramp.position.set(0, 0.8, 6.5);
  ramp.rotation.x = 0.3;
  // Cabin
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(3, 2, 3), mat(0x666666));
  cabin.position.set(0, 2.5, -4);
  // Deck railings
  const railMat = mat(0x333333);
  for (let side = -1; side <= 1; side += 2) {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 10), railMat);
    rail.position.set(side * 3, 1.5, 0);
    g.add(rail);
  }
  g.add(hull, deck, ramp, cabin);
  g.userData.bobPhase = Math.random() * Math.PI * 2;
  g.userData.muzzleOffset = null;
  return g;
}

// ---------- AIR ----------
function buildJet(g, color, scale){
  const fuselage = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5*scale,0.3*scale,6*scale,6),
    mat(color)
  );
  fuselage.rotation.x = Math.PI/2; fuselage.castShadow = true;
  const wingGeom = new THREE.BoxGeometry(8*scale, 0.2, 2*scale);
  const wings = new THREE.Mesh(wingGeom, mat(color));
  wings.position.y = -0.1;
  const tail = new THREE.Mesh(new THREE.BoxGeometry(2*scale,0.2,1*scale), mat(color));
  tail.position.z = -2.5*scale;
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.2,1*scale,1*scale), mat(color));
  fin.position.set(0,0.5*scale,-2.5*scale);
  g.add(fuselage, wings, tail, fin);
  return g;
}

// ---------- BUILDINGS / BASES ----------
export function createBaseMesh(size = 1, isPlayer = false) {
  const g = new THREE.Group();
  const baseColor = isPlayer ? 0x2266aa : 0xaa3333;
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(20*size, 4, 20*size), mat(0x776655)
  );
  wall.position.y = 2; wall.castShadow = true; wall.receiveShadow = true;
  const hq = new THREE.Mesh(
    new THREE.BoxGeometry(8*size, 8, 8*size), mat(baseColor)
  );
  hq.position.y = 8; hq.castShadow = true;
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,6), mat(0x222));
  pole.position.set(0,15,0);
  const flag = new THREE.Mesh(new THREE.BoxGeometry(3,2,0.1), mat(baseColor));
  flag.position.set(1.5,16,0);
  flag.userData.isFlag = true;
  g.add(wall, hq, pole, flag);
  return g;
}

export function createShipyardMesh(size = 1, isPlayer = false) {
  const g = new THREE.Group();
  const baseColor = isPlayer ? 0x2266aa : 0xaa3333;

  // Dock platform
  const dock = new THREE.Mesh(
    new THREE.BoxGeometry(24*size, 1.5, 20*size), mat(0x665544)
  );
  dock.position.y = 0.75; dock.castShadow = true; dock.receiveShadow = true;

  // Warehouse / building
  const building = new THREE.Mesh(
    new THREE.BoxGeometry(10*size, 6, 8*size), mat(baseColor)
  );
  building.position.set(-4*size, 4.5, 0); building.castShadow = true;

  // Crane tower
  const craneBase = new THREE.Mesh(
    new THREE.BoxGeometry(1*size, 10, 1*size), mat(0x444444)
  );
  craneBase.position.set(6*size, 6, 0);
  const craneArm = new THREE.Mesh(
    new THREE.BoxGeometry(6*size, 0.3, 0.5), mat(0x444444)
  );
  craneArm.position.set(8*size, 10, 0);

  // Dry dock slips
  for (let i = -1; i <= 1; i+=2) {
    const slip = new THREE.Mesh(
      new THREE.BoxGeometry(4*size, 0.5, 6*size), mat(0x555555)
    );
    slip.position.set(i*3*size, 0.25, 0);
    g.add(slip);
  }

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,6), mat(0x222));
  pole.position.set(0, 15, 0);
  const flag = new THREE.Mesh(new THREE.BoxGeometry(3,2,0.1), mat(baseColor));
  flag.position.set(1.5, 16, 0);
  flag.userData.isFlag = true;

  g.add(dock, building, craneBase, craneArm, pole, flag);
  return g;
}

// ---------- PROJECTILE ----------
export function createProjectileMesh(domain) {
  if (domain === 'land') {
    return new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
  }
  if (domain === 'sea') {
    return new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), new THREE.MeshStandardMaterial({ color: 0x444466, metalness: 0.5 }));
  }
  if (domain === 'air') {
    const geom = new THREE.CylinderGeometry(0.15, 0.3, 1, 8);
    geom.rotateX(Math.PI/2);
    return new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ color: 0xff4400 }));
  }
  return new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
}

/** Marks newly-launched carrier fighters visually with a small green dot. */
export function tagAsLaunchedFighter(group) {
  const marker = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 6, 6),
    new THREE.MeshBasicMaterial({ color: 0x44ff44 })
  );
  marker.position.y = 3;
  group.add(marker);
}
