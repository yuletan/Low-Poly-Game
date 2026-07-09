// terrain.js — Larger map with multiple landmasses, islands, and mountains.
import * as THREE from 'three';
import { TERRAIN, MAP_SIZE } from './config.js';

export const LAND_HEIGHT = 8; // Exported so game.js knows where the ground is!

export function buildTerrain(scene) {
  // === SEA ===
  const sea = new THREE.Mesh(
    new THREE.PlaneGeometry(MAP_SIZE, MAP_SIZE),
    new THREE.MeshLambertMaterial({ color: 0x2a5d8f, transparent: true, opacity: 0.85 })
  );
  sea.rotation.x = -Math.PI / 2;
  sea.position.y = 0; // Water level
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
    const depth = 20; // Thick land so it doesn't look like a floating sheet
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(lm.w, depth, lm.d),
      new THREE.MeshLambertMaterial({ color: lm.color })
    );
    // Position land so its TOP surface is exactly at LAND_HEIGHT
    m.position.set(lm.x, LAND_HEIGHT - depth / 2, lm.z);
    m.receiveShadow = true;
    scene.add(m);
  }

  // === MOUNTAINS (InstancedMesh) ===
  const mountains = [];
  const MOUNTAIN_COUNT = 18;
  const mtData = [];
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
    mtData.push({ x, z, r, h });
  }

  const mtGeom = new THREE.ConeGeometry(1, 1, 5);
  mtGeom.computeVertexNormals();
  const mtMat = new THREE.MeshLambertMaterial({ color: 0x6b5b3a, flatShading: true });
  const mtInstanced = new THREE.InstancedMesh(mtGeom, mtMat, MOUNTAIN_COUNT);
  mtInstanced.castShadow = true;
  mtInstanced.receiveShadow = true;

  const dummy = new THREE.Object3D();
  const mtColor = new THREE.Color();
  for (let i = 0; i < MOUNTAIN_COUNT; i++) {
    const { x, z, r, h } = mtData[i];
    dummy.position.set(x, LAND_HEIGHT + h / 2, z);
    dummy.scale.set(r / 10, h / 16, r / 10);
    dummy.updateMatrix();
    mtInstanced.setMatrixAt(i, dummy.matrix);
    mtColor.setHSL(0.08, 0.25 + Math.random() * 0.1, 0.35 + Math.random() * 0.08);
    mtInstanced.setColorAt(i, mtColor);
    mountains.push({ x, z, r });
  }
  mtInstanced.instanceMatrix.needsUpdate = true;
  mtInstanced.instanceColor.needsUpdate = true;
  scene.add(mtInstanced);

  // === BEACHES on large landmasses (area > 100k sq units) ===
  for (const lm of landmasses) {
    const area = lm.w * lm.d;
    if (area <= 100000) continue;
    const beachWidth = 15;
    const beachHeight = 20;
    const beachColor = 0xd4c4a8;
    // Top edge
    const beachTop = new THREE.Mesh(
      new THREE.BoxGeometry(lm.w, beachHeight, beachWidth),
      new THREE.MeshLambertMaterial({ color: beachColor })
    );
    beachTop.position.set(lm.x, LAND_HEIGHT - beachHeight / 2, lm.z + lm.d / 2 - beachWidth / 2);
    // Bottom edge
    const beachBottom = new THREE.Mesh(
      new THREE.BoxGeometry(lm.w, beachHeight, beachWidth),
      new THREE.MeshLambertMaterial({ color: beachColor })
    );
    beachBottom.position.set(lm.x, LAND_HEIGHT - beachHeight / 2, lm.z - lm.d / 2 + beachWidth / 2);
    // Left edge
    const beachLeft = new THREE.Mesh(
      new THREE.BoxGeometry(beachWidth, beachHeight, lm.d),
      new THREE.MeshLambertMaterial({ color: beachColor })
    );
    beachLeft.position.set(lm.x + lm.w / 2 - beachWidth / 2, LAND_HEIGHT - beachHeight / 2, lm.z);
    // Right edge
    const beachRight = new THREE.Mesh(
      new THREE.BoxGeometry(beachWidth, beachHeight, lm.d),
      new THREE.MeshLambertMaterial({ color: beachColor })
    );
    beachRight.position.set(lm.x - lm.w / 2 + beachWidth / 2, LAND_HEIGHT - beachHeight / 2, lm.z);
    scene.add(beachTop, beachBottom, beachLeft, beachRight);
  }

  // === TREES (InstancedMesh) ===
  const trunkGeom = new THREE.CylinderGeometry(0.4, 0.4, 2, 5);
  trunkGeom.computeVertexNormals();
  const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5c3a1e, flatShading: true });
  const leafGeom = new THREE.ConeGeometry(1, 1, 6);
  leafGeom.computeVertexNormals();
  const leafMat = new THREE.MeshLambertMaterial({ color: 0x2d5a1f, flatShading: true });

  const TREE_COUNT = 80;
  const trunkInstanced = new THREE.InstancedMesh(trunkGeom, trunkMat, TREE_COUNT);
  trunkInstanced.castShadow = true;
  trunkInstanced.receiveShadow = true;
  const leafInstanced = new THREE.InstancedMesh(leafGeom, leafMat, TREE_COUNT);
  leafInstanced.castShadow = true;
  leafInstanced.receiveShadow = true;

  const treeDummy = new THREE.Object3D();
  for (let i = 0; i < TREE_COUNT; i++) {
    const lm = landmasses[Math.floor(Math.random() * landmasses.length)];
    const x = lm.x + (Math.random() - 0.5) * lm.w * 0.9;
    const z = lm.z + (Math.random() - 0.5) * lm.d * 0.9;
    
    // Trunk instance
    treeDummy.position.set(x, LAND_HEIGHT + 1, z);
    treeDummy.scale.set(1, 1, 1);
    treeDummy.updateMatrix();
    trunkInstanced.setMatrixAt(i, treeDummy.matrix);

    // Leaves instance
    treeDummy.position.set(x, LAND_HEIGHT + 2 + 2, z);
    treeDummy.scale.set(2, 4, 2);
    treeDummy.updateMatrix();
    leafInstanced.setMatrixAt(i, treeDummy.matrix);
  }
  trunkInstanced.instanceMatrix.needsUpdate = true;
  leafInstanced.instanceMatrix.needsUpdate = true;
  scene.add(trunkInstanced);
  scene.add(leafInstanced);

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
