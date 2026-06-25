// fogOfWar.js — Visibility grid. 0=unexplored, 1=explored/dim, 2=currently visible.
import * as THREE from 'three';
import { MAP_SIZE } from './config.js';

export class FogOfWar {
  constructor(scene) {
    this.scene = scene;
    this.size = 60;
    this.cell = MAP_SIZE / this.size;
    this.grid = new Uint8Array(this.size * this.size);

    this.geometry = new THREE.PlaneGeometry(MAP_SIZE, MAP_SIZE, this.size - 1, this.size - 1);
    this.geometry.rotateX(-Math.PI / 2);
    const colors = new Float32Array(this.geometry.attributes.position.count * 3);
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.material = new THREE.MeshBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.7, depthWrite: false,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.y = 30;
    this.mesh.renderOrder = 999;
    scene.add(this.mesh);

    this.updateMesh();
  }

  worldToGrid(x, z) {
    const gx = Math.floor((x + MAP_SIZE/2) / this.cell);
    const gy = Math.floor((z + MAP_SIZE/2) / this.cell);
    return { gx: Math.max(0, Math.min(this.size - 1, gx)),
             gy: Math.max(0, Math.min(this.size - 1, gy)) };
  }

  isExplored(x, z) { const {gx,gy} = this.worldToGrid(x,z); return this.grid[gy*this.size+gx] >= 1; }
  isVisible(x, z)  { const {gx,gy} = this.worldToGrid(x,z); return this.grid[gy*this.size+gx] === 2; }

  update(playerUnits, playerBases) {
    for (let i = 0; i < this.grid.length; i++) {
      if (this.grid[i] === 2) this.grid[i] = 1;
    }
    const VISION_UNIT = 50;
    const VISION_BASE = 80;
    for (const u of playerUnits) if (u.alive) this.reveal(u.mesh.position.x, u.mesh.position.z, VISION_UNIT);
    for (const b of playerBases) this.reveal(b.mesh.position.x, b.mesh.position.z, VISION_BASE);

    this.updateMesh();
  }

  reveal(x, z, radius) {
    const cellRadius = Math.ceil(radius / this.cell);
    const { gx, gy } = this.worldToGrid(x, z);
    for (let dy = -cellRadius; dy <= cellRadius; dy++) {
      for (let dx = -cellRadius; dx <= cellRadius; dx++) {
        if (dx*dx + dy*dy > cellRadius*cellRadius) continue;
        const nx = gx + dx, ny = gy + dy;
        if (nx < 0 || ny < 0 || nx >= this.size || ny >= this.size) continue;
        this.grid[ny * this.size + nx] = 2;
      }
    }
  }

  updateMesh() {
    const colors = this.geometry.attributes.color.array;
    const verts = this.geometry.attributes.position.count;
    for (let i = 0; i < verts; i++) {
      const gx = i % this.size;
      const gy = Math.floor(i / this.size);
      const v = this.grid[gy * this.size + gx];
      let shade;
      if (v === 0) shade = 0.0;
      else if (v === 1) shade = 0.4;
      else shade = 1.0;
      colors[i*3]   = shade;
      colors[i*3+1] = shade;
      colors[i*3+2] = shade;
    }
    this.geometry.attributes.color.needsUpdate = true;
  }

  serialize() { return Array.from(this.grid); }
  deserialize(arr) { this.grid = new Uint8Array(arr); this.updateMesh(); }
}
