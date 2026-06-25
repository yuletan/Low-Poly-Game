// unitFactory.js — Builds simple but recognizable 3D meshes.
import * as THREE from 'three';

function mat(color) { return new THREE.MeshLambertMaterial({ color }); }

/** Returns a THREE.Group representing the unit. The group has a child `turret`
 *  reference for units that rotate to aim. */
export function createUnitMesh(type, color, faction) {
  const tint = faction === 'enemy' ? mixColor(color, 0xaa3333, 0.4) : color;
  const g = new THREE.Group();
  g.userData.turret = null;

  switch (type) {
    case 'infantry': return buildInfantry(g, tint);
    case 'tank':     return buildTank(g, tint);
    case 'artillery':return buildArtillery(g, tint);
    case 'destroyer':return buildShip(g, tint, 1.0);
    case 'battleship':return buildShip(g, tint, 1.6);
    case 'carrier':  return buildCarrier(g, tint);
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
  barrel.position.set(0, 2.2, 2.5);
  turret.add(turretBase, barrel);
  g.add(hull, tL, tR, turret);
  g.userData.turret = turret;
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
  barrel.position.set(0, 2.4, 2);
  turret.add(cradle, barrel);
  g.add(base, turret);
  g.userData.turret = turret;
  return g;
}

// ---------- SEA ----------
function buildShip(g, color, scale){
  const hull = new THREE.Mesh(new THREE.BoxGeometry(5*scale,1.5,14*scale), mat(color));
  hull.position.y = 0.5; hull.castShadow = true;
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(3*scale,2.5,3*scale), mat(0xaaaaaa));
  bridge.position.set(0, 2.5, -1*scale);
  const turret = new THREE.Group();
  const tBase = new THREE.Mesh(new THREE.CylinderGeometry(1,1.2,0.8,8), mat(color));
  tBase.position.y = 1.6;
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.3,0.3,3,6), mat(0x333333));
  barrel.rotation.x = Math.PI/2;
  barrel.position.set(0,1.6,2);
  turret.add(tBase, barrel);
  turret.position.z = 4*scale;
  g.add(hull, bridge, turret);
  g.userData.turret = turret;
  g.userData.bobPhase = Math.random()*Math.PI*2;
  return g;
}

function buildCarrier(g, color){
  const hull = new THREE.Mesh(new THREE.BoxGeometry(7,1.5,20), mat(color));
  hull.position.y = 0.5; hull.castShadow = true;
  const deck = new THREE.Mesh(new THREE.BoxGeometry(8,0.3,20), mat(0x222222));
  deck.position.y = 1.5;
  const tower = new THREE.Mesh(new THREE.BoxGeometry(1.5,3,3), mat(0xaaaaaa));
  tower.position.set(3, 3, -4);
  g.add(hull, deck, tower);
  g.userData.bobPhase = Math.random()*Math.PI*2;
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
  g.add(wall, hq, pole, flag);
  return g;
}

// ---------- PROJECTILE ----------
export function createProjectileMesh() {
  const geom = new THREE.SphereGeometry(0.3, 6, 6);
  const m    = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
  return new THREE.Mesh(geom, m);
}
