// terrain.js — Builds the playfield: land, sea, coastline, mountains.
import * as THREE from 'three';
import { TERRAIN } from './config.js';

export function buildTerrain(scene) {
  const tiles = [];

  // Sea (big plane)
  const sea = new THREE.Mesh(
    new THREE.PlaneGeometry(1000,1000),
    new THREE.MeshLambertMaterial({ color:0x2a5d8f })
  );
  sea.rotation.x = -Math.PI/2;
  sea.position.y = -0.2;
  sea.receiveShadow = true;
  scene.add(sea);

  // Main landmass (left half)
  const land = new THREE.Mesh(
    new THREE.BoxGeometry(280, 1, 500),
    new THREE.MeshLambertMaterial({ color:0x4a7c3a })
  );
  land.position.set(-140, 0, 0);
  land.receiveShadow = true;
  scene.add(land);

  // Island (right side)
  const island = new THREE.Mesh(
    new THREE.BoxGeometry(120, 1, 180),
    new THREE.MeshLambertMaterial({ color:0x4a7c3a })
  );
  island.position.set(180, 0, 50);
  island.receiveShadow = true;
  scene.add(island);

  // Mountains (obstacles on land)
  const mountains = [];
  for (let i = 0; i < 6; i++) {
    const h = 8 + Math.random()*8;
    const m = new THREE.Mesh(
      new THREE.ConeGeometry(8 + Math.random()*4, h, 5),
      new THREE.MeshLambertMaterial({ color:0x6b5b3a })
    );
    m.position.set(-200 + Math.random()*150, h/2, -200 + Math.random()*400);
    m.castShadow = true;
    scene.add(m);
    mountains.push({ x:m.position.x, z:m.position.z, r:10 });
  }

  return {
    mountains,
    getTerrainAt(x, z) {
      for (const mt of mountains) {
        const dx=x-mt.x, dz=z-mt.z;
        if (dx*dx+dz*dz < mt.r*mt.r) return TERRAIN.MOUNTAIN;
      }
      if (x > 120 && x < 240 && z > -40 && z < 140) return TERRAIN.LAND;
      if (x < 0) {
        if (x > -10) return TERRAIN.COAST;
        return TERRAIN.LAND;
      }
      if (x > 110 && x < 130) return TERRAIN.COAST;
      return TERRAIN.SEA;
    }
  };
}
