// pathfinder.js — A* on a coarse grid. Domain-aware: respects sea/land/air + amphibious.
import * as THREE from 'three';
import { TERRAIN, MAP_SIZE, GRID_CELL, GRID_SIZE } from './config.js';

export class Pathfinder {
  constructor(terrain) {
    this.terrain = terrain;
    this.size    = GRID_SIZE;
    this.cell    = GRID_CELL;
    this.terrainGrid = new Array(this.size * this.size);
    for (let gy = 0; gy < this.size; gy++) {
      for (let gx = 0; gx < this.size; gx++) {
        const { x, z } = this.gridToWorld(gx, gy);
        this.terrainGrid[gy * this.size + gx] = terrain.getTerrainAt(x, z);
      }
    }
  }

  worldToGrid(x, z) {
    const gx = Math.floor((x + MAP_SIZE/2) / this.cell);
    const gy = Math.floor((z + MAP_SIZE/2) / this.cell);
    return { gx, gy };
  }

  gridToWorld(gx, gy) {
    return {
      x: gx * this.cell - MAP_SIZE/2 + this.cell/2,
      z: gy * this.cell - MAP_SIZE/2 + this.cell/2
    };
  }

  inBounds(gx, gy) { return gx >= 0 && gy >= 0 && gx < this.size && gy < this.size; }

  walkable(gx, gy, domain) {
    if (!this.inBounds(gx, gy)) return false;
    const t = this.terrainGrid[gy * this.size + gx];
    if (domain === 'air') return t !== TERRAIN.MOUNTAIN;
    if (domain === 'sea') return t === TERRAIN.SEA || t === TERRAIN.COAST;
    if (domain === 'land') return t === TERRAIN.LAND || t === TERRAIN.COAST;
    return false;
  }

  // --- Amphibious Pathfinding for Troop Transports ---
  // Returns a segmented path so game logic knows when to board/disembark.
  findTransportPath(startWorld, endWorld) {
    // 1. Try standard land path first
    const landPath = this.findPath(startWorld, endWorld, 'land');
    if (landPath) {
      return { needsTransport: false, path: landPath };
    }

    // 2. Water is in the way! Find the nearest walkable coast for start and end.
    const s = this.worldToGrid(startWorld.x, startWorld.z);
    const g = this.worldToGrid(endWorld.x, endWorld.z);

    const embarkCell = this.findNearestCoast(s.gx, s.gy, 'land');
    const disembarkCell = this.findNearestCoast(g.gx, g.gy, 'land');

    if (!embarkCell || !disembarkCell) return null;

    const embarkWorld = this.gridToWorld(embarkCell.gx, embarkCell.gy);
    const disembarkWorld = this.gridToWorld(disembarkCell.gx, disembarkCell.gy);

    const vEmbark = new THREE.Vector3(embarkWorld.x, 0, embarkWorld.z);
    const vDisembark = new THREE.Vector3(disembarkWorld.x, 0, disembarkWorld.z);

    // 3. Calculate the 3 segmented paths
    const pathToShip = this.findPath(startWorld, vEmbark, 'land');
    const seaPath = this.findPath(vEmbark, vDisembark, 'sea');
    const pathToTarget = this.findPath(vDisembark, endWorld, 'land');

    if (!pathToShip || !seaPath || !pathToTarget) return null;

    // 4. Merge into a single visual path
    const fullPath = [...pathToShip];
    for (let i = 1; i < seaPath.length; i++) fullPath.push(seaPath[i]);
    for (let i = 1; i < pathToTarget.length; i++) fullPath.push(pathToTarget[i]);

    // Return structural data for game manager to handle boarding logic
    return {
      needsTransport: true,
      path: fullPath,
      embarkPoint: vEmbark,
      disembarkPoint: vDisembark,
      segments: {
        walkToShip: pathToShip,
        sail: seaPath,
        walkToTarget: pathToTarget
      }
    };
  }

  findPath(startWorld, endWorld, domain) {
    if (domain === 'air') return [endWorld.clone()];

    const s = this.worldToGrid(startWorld.x, startWorld.z);
    let g = this.worldToGrid(endWorld.x, endWorld.z);

    if (!this.walkable(g.gx, g.gy, domain)) {
      g = this.findNearestWalkable(g.gx, g.gy, domain);
      if (!g) return null;
    }

    if (s.gx === g.gx && s.gy === g.gy) return [endWorld.clone()];

    const open = new MinHeap();
    const closed = new Set();
    const cameFrom = new Map();
    const gScore = new Map();
    const key = (x,y) => y * this.size + x;
    const startKey = key(s.gx, s.gy);
    gScore.set(startKey, 0);
    open.push({ key: startKey, gx: s.gx, gy: s.gy, f: this.heuristic(s, g) });

    const NEIGHBORS = [
      [1,0,1],[-1,0,1],[0,1,1],[0,-1,1],
      [1,1,1.414],[-1,1,1.414],[1,-1,1.414],[-1,-1,1.414]
    ];

    let iterations = 0;
    const MAX_ITER = 4000;
    while (!open.isEmpty() && iterations++ < MAX_ITER) {
      const cur = open.pop();
      if (cur.gx === g.gx && cur.gy === g.gy) {
        return this.reconstruct(cameFrom, cur.key, endWorld, domain);
      }
      closed.add(cur.key);
      for (const [dx, dy, cost] of NEIGHBORS) {
        const nx = cur.gx + dx, ny = cur.gy + dy;
        if (!this.walkable(nx, ny, domain)) continue;
        if (dx !== 0 && dy !== 0) {
          if (!this.walkable(cur.gx + dx, cur.gy, domain) ||
              !this.walkable(cur.gx, cur.gy + dy, domain)) continue;
        }
        const nk = key(nx, ny);
        if (closed.has(nk)) continue;
        const tentativeG = (gScore.get(cur.key) ?? Infinity) + cost;
        if (tentativeG < (gScore.get(nk) ?? Infinity)) {
          cameFrom.set(nk, cur.key);
          gScore.set(nk, tentativeG);
          const f = tentativeG + this.heuristic({gx:nx,gy:ny}, g);
          open.push({ key:nk, gx:nx, gy:ny, f });
        }
      }
    }
    return null;
  }

  heuristic(a, b) {
    const dx = Math.abs(a.gx - b.gx), dy = Math.abs(a.gy - b.gy);
    return (dx + dy) + (1.414 - 2) * Math.min(dx, dy);
  }

  reconstruct(cameFrom, endKey, endWorld, domain) {
    const path = [];
    let k = endKey;
    while (k !== undefined) {
      const gy = Math.floor(k / this.size);
      const gx = k % this.size;
      const w  = this.gridToWorld(gx, gy);
      path.push(new THREE.Vector3(w.x, 0, w.z));
      k = cameFrom.get(k);
    }
    path.reverse();
    if (path.length > 0) path[path.length - 1] = endWorld.clone();
    return this.smoothPath(path, domain);
  }

  smoothPath(path, domain) {
    if (path.length < 3) return path;
    const out = [path[0]];
    let i = 0;
    while (i < path.length - 1) {
      let j = path.length - 1;
      while (j > i + 1) {
        if (this.hasLineOfSight(path[i], path[j], domain)) break;
        j--;
      }
      out.push(path[j]);
      i = j;
    }
    return out;
  }

  hasLineOfSight(a, b, domain) {
    if (domain === 'air') return true;
    const steps = Math.ceil(a.distanceTo(b) / (this.cell / 2));
    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      const x = a.x + (b.x - a.x) * t;
      const z = a.z + (b.z - a.z) * t;
      const terrain = this.terrain.getTerrainAt(x, z);

      if (domain === 'sea' && terrain !== TERRAIN.SEA && terrain !== TERRAIN.COAST) return false;
      if (domain === 'land' && terrain !== TERRAIN.LAND && terrain !== TERRAIN.COAST) return false;

      // Check mountains for all ground domains
      for (const mt of this.terrain.mountains) {
        if (Math.hypot(x - mt.x, z - mt.z) < mt.r + 2) return false;
      }
    }
    return true;
  }

  // BFS for finding nearest walkable tile — navigates around obstacles
  findNearestWalkable(gx, gy, domain) {
    const queue = [{ gx, gy }];
    const visited = new Set([gy * this.size + gx]);

    while (queue.length > 0) {
      const cur = queue.shift();
      if (this.walkable(cur.gx, cur.gy, domain)) return cur;

      const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
      for (const [dx, dy] of dirs) {
        const nx = cur.gx + dx, ny = cur.gy + dy;
        const nKey = ny * this.size + nx;
        if (this.inBounds(nx, ny) && !visited.has(nKey)) {
          visited.add(nKey);
          queue.push({ gx: nx, gy: ny });
        }
      }
    }
    return null;
  }

  // BFS specifically for finding the coastline
  // Only traverses land, guarantees we find a beach connected by ground.
  findNearestCoast(gx, gy, domain) {
    if (!this.walkable(gx, gy, domain)) {
      const nearest = this.findNearestWalkable(gx, gy, domain);
      if (!nearest) return null;
      gx = nearest.gx;
      gy = nearest.gy;
    }

    const queue = [{ gx, gy }];
    const visited = new Set([gy * this.size + gx]);

    while (queue.length > 0) {
      const cur = queue.shift();
      const t = this.terrainGrid[cur.gy * this.size + cur.gx];

      if (t === TERRAIN.COAST) return cur;

      const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
      for (const [dx, dy] of dirs) {
        const nx = cur.gx + dx, ny = cur.gy + dy;
        const nKey = ny * this.size + nx;
        if (this.inBounds(nx, ny) && !visited.has(nKey) && this.walkable(nx, ny, domain)) {
          visited.add(nKey);
          queue.push({ gx: nx, gy: ny });
        }
      }
    }
    return null;
  }
}

class MinHeap {
  constructor() { this.data = []; }
  isEmpty() { return this.data.length === 0; }
  push(node) {
    this.data.push(node);
    let i = this.data.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.data[p].f <= this.data[i].f) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }
  pop() {
    const top = this.data[0];
    const end = this.data.pop();
    if (this.data.length > 0) {
      this.data[0] = end;
      let i = 0;
      const n = this.data.length;
      while (true) {
        let l = 2*i + 1, r = 2*i + 2, s = i;
        if (l < n && this.data[l].f < this.data[s].f) s = l;
        if (r < n && this.data[r].f < this.data[s].f) s = r;
        if (s === i) break;
        [this.data[s], this.data[i]] = [this.data[i], this.data[s]];
        i = s;
      }
    }
    return top;
  }
}
