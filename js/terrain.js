// terrain.js — Larger map with multiple landmasses, islands, and mountains.
import * as THREE from 'three';
import { TERRAIN, MAP_SIZE } from './config.js';

export function buildTerrain(scene) {
  // === SEA ===
  const sea = new THREE.Mesh(
    new THREE.PlaneGeometry(MAP_SIZE, MAP_SIZE),
    new THREE.MeshLambertMaterial({ color: 0x2a5d8f })
  );
  sea.rotation.x = -Math.PI / 2;
  sea.position.y = -0.2;
  sea.receiveShadow = true;
  scene.add(sea);

  // Landmass definitions — each is a rectangle on the map.
  const landmasses = [
    { x:-400, z:0,   w:350, d:800, color:0x4a7c3a },
    { x: 350, z:-100,w:400, d:600, color:0x4a7c3a },
    { x: 0,   z:-450,w:200, d:180, color:0x4a7c3a },
    { x:-50,  z: 450,w:160, d:140, color:0x556b2f },
    { x: 200, z: 380,w:100, d:100, color:0x4a7c3a },
  ];

  for (const lm of landmasses) {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(lm.w, 1, lm.d),
      new THREE.MeshLambertMaterial({ color: lm.color })
    );
    m.position.set(lm.x, 0, lm.z);
    m.receiveShadow = true;
    scene.add(m);
  }

  // === MOUNTAINS ===
  const mountains = [];
  const MOUNTAIN_COUNT = 18;
  for (let i = 0; i < MOUNTAIN_COUNT; i++) {
    let attempts = 0, x, z;
    do {
      const lm = landmasses[Math.floor(Math.random() * landmasses.length)];
      x = lm.x + (Math.random() - 0.5) * lm.w * 0.8;
      z = lm.z + (Math.random() - 0.5) * lm.d * 0.8;
      attempts++;
    } while (attempts < 10);

    const h = 10 + Math.random() * 12;
    const r = 10 + Math.random() * 6;
    const m = new THREE.Mesh(
      new THREE.ConeGeometry(r, h, 5),
      new THREE.MeshLambertMaterial({ color: 0x6b5b3a })
    );
    m.position.set(x, h / 2, z);
    m.castShadow = true;
    scene.add(m);
    mountains.push({ x, z, r });
  }

  // === TREES ===
  for (let i = 0; i < 80; i++) {
    const lm = landmasses[Math.floor(Math.random() * landmasses.length)];
    const x = lm.x + (Math.random() - 0.5) * lm.w * 0.9;
    const z = lm.z + (Math.random() - 0.5) * lm.d * 0.9;
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 2, 5),
      new THREE.MeshLambertMaterial({ color: 0x5c3a1e })
    );
    trunk.position.set(x, 1, z);
    const leaves = new THREE.Mesh(
      new THREE.ConeGeometry(2, 4, 6),
      new THREE.MeshLambertMaterial({ color: 0x2d5a1f })
    );
    leaves.position.set(x, 4, z);
    scene.add(trunk, leaves);
  }

  return {
    landmasses,
    mountains,
    mapSize: MAP_SIZE,
    getTerrainAt(x, z) {
      for (const mt of mountains) {
        const dx = x - mt.x, dz = z - mt.z;
        if (dx*dx + dz*dz < mt.r*mt.r) return TERRAIN.MOUNTAIN;
      }
      for (const lm of landmasses) {
        const inX = x > lm.x - lm.w/2 && x < lm.x + lm.w/2;
        const inZ = z > lm.z - lm.d/2 && z < lm.z + lm.d/2;
        if (inX && inZ) {
          const edgeDist = Math.min(
            Math.abs(x - (lm.x - lm.w/2)),
            Math.abs(x - (lm.x + lm.w/2)),
            Math.abs(z - (lm.z - lm.d/2)),
            Math.abs(z - (lm.z + lm.d/2))
          );
          return edgeDist < 15 ? TERRAIN.COAST : TERRAIN.LAND;
        }
      }
      for (const lm of landmasses) {
        const inX = x > lm.x - lm.w/2 - 8 && x < lm.x + lm.w/2 + 8;
        const inZ = z > lm.z - lm.d/2 - 8 && z < lm.z + lm.d/2 + 8;
        if (inX && inZ) return TERRAIN.COAST;
      }
      return TERRAIN.SEA;
    }
  };
}
