// pathfinder.js â€” A* on a coarse grid. Domain-aware: respects sea/land/air + amphibious.
import * as THREE from 'three';
import { TERRAIN, MAP_SIZE, GRID_CELL, GRID_SIZE } from './config.js';

export class Pathfinder {
  constructor(terrain) {
    this.terrain = terrain;
    this.size    = GRID_SIZE;
    this.cell    = GRID_CELL;
    this.terrainGrid = new Array(this.size * this.size);

    // Task 12: keep paths away from obstacle edges.  The grid is still baked
    // once at startup, so normal path queries do not recompute obstacle data.
    this.obstacleClearance = Math.max(3, this.cell * 0.45);

    // Bake terrain and an inflated mountain footprint into the grid once for
    // fast lookup.  The slight inflation prevents units from being smoothed
    // directly along the visual mountain rim, which caused zigzag/stuck cases.
    for (let gy = 0; gy < this.size; gy++) {
      for (let gx = 0; gx < this.size; gx++) {
        const { x, z } = this.gridToWorld(gx, gy);
        let t = terrain.getTerrainAt(x, z);

        if (terrain.mountains) {
          for (const mt of terrain.mountains) {
            if (Math.hypot(x - mt.x, z - mt.z) < mt.r + this.obstacleClearance) {
              t = TERRAIN.MOUNTAIN;
              break;
            }
          }
        }
        this.terrainGrid[gy * this.size + gx] = t;
      }
    }
  }

  worldToGrid(x, z) {
    let gx = Math.floor((x + MAP_SIZE / 2) / this.cell);
    let gy = Math.floor((z + MAP_SIZE / 2) / this.cell);

    gx = THREE.MathUtils.clamp(gx, 0, this.size - 1);
    gy = THREE.MathUtils.clamp(gy, 0, this.size - 1);

    return { gx, gy };
  }

  gridToWorld(gx, gy) {
    return {
      x: gx * this.cell - MAP_SIZE/2 + this.cell/2,
      z: gy * this.cell - MAP_SIZE/2 + this.cell/2
    };
  }

  inBounds(gx, gy) { return gx >= 0 && gy >= 0 && gx < this.size && gy < this.size; }

  terrainAtGrid(gx, gy) {
    if (!this.inBounds(gx, gy)) return null;
    return this.terrainGrid[gy * this.size + gx];
  }

  terrainAllows(t, domain) {
    if (domain === 'air') return true;
    // Beaches are ground, not navigable water. Transports board from the adjacent sea tile.
    if (domain === 'sea') return t === TERRAIN.SEA;

    // Task 12: keep this in sync with Unit.canEnter().  Land units can fight
    // over mountain terrain for bonuses, but they should not path through the
    // baked mountain blockers themselves.
    if (domain === 'land') return t === TERRAIN.LAND || t === TERRAIN.COAST;
    return false;
  }

  walkable(gx, gy, domain) {
    if (!this.inBounds(gx, gy)) return false;
    return this.terrainAllows(this.terrainGrid[gy * this.size + gx], domain);
  }

  // Adds a tiny cost near blocked cells so A* prefers lanes with clearance.
  // This reduces edge-hugging and visible sawtooth paths around mountains
  // without changing the baked grid or doing expensive per-query geometry work.
  terrainPenalty(gx, gy, domain) {
    if (domain === 'air') return 0;

    let blockedNeighbors = 0;
    const dirs = [
      [1,0],[-1,0],[0,1],[0,-1],
      [1,1],[-1,1],[1,-1],[-1,-1]
    ];

    for (const [dx, dy] of dirs) {
      const nx = gx + dx, ny = gy + dy;
      if (!this.inBounds(nx, ny) || !this.terrainAllows(this.terrainAtGrid(nx, ny), domain)) {
        blockedNeighbors++;
      }
    }

    return Math.min(0.75, blockedNeighbors * 0.08);
  }

  // Amphibious Pathfinding for Troop Transports
  // standoffDistance: preferred distance from disembark coast to target.
  //   When > 0, coasts closer or farther than standoff are penalised in the
  //   scoring so the fleet lands at a respectful distance from the target.
  //   Defaults to 0 (no preference — pure shortest-route).
  findTransportPath(startWorld, endWorld, standoffDistance = 0) {
    const landPath = this.findPath(startWorld, endWorld, 'land');
    if (landPath) {
      return { needsTransport: false, path: landPath };
    }

    const s = this.worldToGrid(startWorld.x, startWorld.z);
    const g = this.worldToGrid(endWorld.x, endWorld.z);

    // Find ALL reachable coasts, then pick the pair with best score
    const embarkCandidates = this._findAllCoasts(s.gx, s.gy, 'land');
    const disembarkCandidates = this._findAllCoasts(g.gx, g.gy, 'land');

    if (embarkCandidates.length === 0 || disembarkCandidates.length === 0) return null;

    let bestResult = null;
    let bestScore = Infinity;

    // Compare actual route length, not a straight line through islands.
    const eSlice = embarkCandidates.slice(0, 12);
    const dSlice = disembarkCandidates.slice(0, 12);

    for (const embarkCoast of eSlice) {
      for (const disembarkCoast of dSlice) {
        const embarkWorld = this.gridToWorld(embarkCoast.groundTile.gx, embarkCoast.groundTile.gy);
        const disembarkWorld = this.gridToWorld(disembarkCoast.groundTile.gx, disembarkCoast.groundTile.gy);
        const shipEmbarkWorld = this.gridToWorld(embarkCoast.seaTile.gx, embarkCoast.seaTile.gy);
        const shipDisembarkWorld = this.gridToWorld(disembarkCoast.seaTile.gx, disembarkCoast.seaTile.gy);

        const vEmbark = new THREE.Vector3(embarkWorld.x, 0, embarkWorld.z);
        const vDisembark = new THREE.Vector3(disembarkWorld.x, 0, disembarkWorld.z);
        const vShipEmbark = new THREE.Vector3(shipEmbarkWorld.x, 0, shipEmbarkWorld.z);
        const vShipDisembark = new THREE.Vector3(shipDisembarkWorld.x, 0, shipDisembarkWorld.z);


        const pathToShip = this.findPath(startWorld, vEmbark, 'land');
        if (!pathToShip) continue;

        const seaPath = this.findPath(vShipEmbark, vShipDisembark, 'sea', false);
        if (!seaPath) continue;

        const pathToTarget = this.findPath(vDisembark, endWorld, 'land');
        if (!pathToTarget) continue;

        const pathLength = path => path.reduce((total, point, index) =>
          index === 0 ? total : total + point.distanceTo(path[index - 1]), 0);
        const routeCost = pathLength(pathToShip) + pathLength(seaPath) + pathLength(pathToTarget);

        // Standoff penalty: prefer disembark coasts at the desired standoff
        // distance from the target.  The penalty scales the angular deviation
        // so routes that naturally land near the standoff point are preferred
        // without completely ignoring route efficiency.
        let standoffPenalty = 0;
        if (standoffDistance > 0) {
          const distToTarget = vDisembark.distanceTo(endWorld);
          standoffPenalty = Math.abs(distToTarget - standoffDistance) * 2.0;
        }

        const score = routeCost + standoffPenalty;
        if (score >= bestScore) continue;
        bestScore = score;
        bestResult = {
          needsTransport: true,
          path: null, // computed below
          embarkPoint: vEmbark,
          disembarkPoint: vDisembark,
          shipEmbarkPoint: vShipEmbark,
          shipDisembarkPoint: vShipDisembark,
          segments: {
            walkToShip: pathToShip,
            sail: seaPath,
            walkToTarget: pathToTarget
          }
        };
      }
    }

    if (!bestResult) return null;

    // Build full path
    const fullPath = [...bestResult.segments.walkToShip];
    for (let i = 1; i < bestResult.segments.sail.length; i++) fullPath.push(bestResult.segments.sail[i]);
    for (let i = 1; i < bestResult.segments.walkToTarget.length; i++) fullPath.push(bestResult.segments.walkToTarget[i]);
    bestResult.path = fullPath;
    return bestResult;
  }

  _findAllCoasts(gx, gy, domain) {
    if (!this.walkable(gx, gy, domain)) {
      const nearest = this.findNearestWalkable(gx, gy, domain);
      if (!nearest) return [];
      gx = nearest.gx;
      gy = nearest.gy;
    }

    const queue = [{ gx, gy, dist: 0 }];
    const visited = new Set([gy * this.size + gx]);
    const results = [];

    let qi = 0;
    while (qi < queue.length && results.length < 16) {
      const cur = queue[qi++];
      const t = this.terrainGrid[cur.gy * this.size + cur.gx];

      if (t === TERRAIN.COAST) {
        const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
        for (const [dx, dy] of dirs) {
          const nx = cur.gx + dx, ny = cur.gy + dy;
          if (!this.inBounds(nx, ny)) continue;
          const nt = this.terrainGrid[ny * this.size + nx];
          if (nt === TERRAIN.SEA) {
            results.push({ groundTile: cur, seaTile: { gx: nx, gy: ny }, dist: cur.dist });
            break;
          }
        }
        // Don't stop â€” find more coast candidates
      }

      const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
      for (const [dx, dy] of dirs) {
        const nx = cur.gx + dx, ny = cur.gy + dy;
        const nKey = ny * this.size + nx;
        if (this.inBounds(nx, ny) && !visited.has(nKey) && this.walkable(nx, ny, domain)) {
          visited.add(nKey);
          queue.push({ gx: nx, gy: ny, dist: cur.dist + 1 });
        }
      }
    }

    // Sort by distance from start
    results.sort((a, b) => a.dist - b.dist);
    return results;
  }

  findPath(startWorld, endWorld, domain, smooth = true) {
    if (domain === 'air') return [endWorld.clone()];

    let s = this.worldToGrid(startWorld.x, startWorld.z);
    let g = this.worldToGrid(endWorld.x, endWorld.z);
    let startAnchor = startWorld.clone();
    let finalTarget = endWorld.clone();

    if (!this.walkable(s.gx, s.gy, domain)) {
      s = this.findNearestWalkable(s.gx, s.gy, domain);
      if (!s) return null;
      const w = this.gridToWorld(s.gx, s.gy);
      startAnchor = new THREE.Vector3(w.x, startWorld.y ?? 0, w.z);
    }

    if (!this.walkable(g.gx, g.gy, domain)) {
      g = this.findNearestWalkable(g.gx, g.gy, domain);
      if (!g) return null;
      const w = this.gridToWorld(g.gx, g.gy);
      finalTarget = new THREE.Vector3(w.x, endWorld.y ?? 0, w.z);
    }

    if (s.gx === g.gx && s.gy === g.gy) return [finalTarget.clone()];

    if (smooth && this.hasLineOfSight(startAnchor, finalTarget, domain)) {
      return [finalTarget.clone()];
    }

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
    const MAX_ITER = this.size * this.size;
    while (!open.isEmpty() && iterations++ < MAX_ITER) {
      const cur = open.pop();
      if (closed.has(cur.key)) continue;
      if (cur.gx === g.gx && cur.gy === g.gy) {
        return this.reconstruct(cameFrom, cur.key, startAnchor, finalTarget, domain, smooth);
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

        const clearancePenalty = this.terrainPenalty(nx, ny, domain);
        const tentativeG = (gScore.get(cur.key) ?? Infinity) + cost + clearancePenalty;
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

  reconstruct(cameFrom, endKey, startWorld, endWorld, domain, smooth) {
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
    if (path.length > 0) path[0] = startWorld.clone();
    if (path.length > 0) path[path.length - 1] = endWorld.clone();

    const simplified = this.removeRedundantWaypoints(path);
    if (smooth) return this.smoothPath(simplified, domain);
    return simplified;
  }

  removeRedundantWaypoints(path) {
    if (path.length < 3) return path;

    const out = [path[0]];
    for (let i = 1; i < path.length - 1; i++) {
      const a = out[out.length - 1];
      const b = path[i];
      const c = path[i + 1];
      const abx = b.x - a.x, abz = b.z - a.z;
      const bcx = c.x - b.x, bcz = c.z - b.z;
      const abLen = Math.hypot(abx, abz) || 1;
      const bcLen = Math.hypot(bcx, bcz) || 1;
      const cross = Math.abs((abx / abLen) * (bcz / bcLen) - (abz / abLen) * (bcx / bcLen));

      // Drop nearly collinear grid jitter before the LOS smoother runs.
      if (cross > 0.08) out.push(b);
    }
    out.push(path[path.length - 1]);
    return out;
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
    return this.removeRedundantWaypoints(out);
  }

  // Clearance-aware line-of-sight.  Samples the centerline and two narrow side
  // rails so the smoother cannot cut corners through mountains or coastlines.
  hasLineOfSight(a, b, domain) {
    if (domain === 'air') return true;

    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 0.001) {
      const { gx, gy } = this.worldToGrid(a.x, a.z);
      return this.walkable(gx, gy, domain);
    }

    const steps = Math.max(1, Math.ceil(dist / (this.cell * 0.4)));
    const nx = -dz / dist;
    const nz = dx / dist;
    const sideOffset = this.cell * 0.35;
    const offsets = [0, sideOffset, -sideOffset];

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const baseX = a.x + dx * t;
      const baseZ = a.z + dz * t;

      for (const offset of offsets) {
        const x = baseX + nx * offset;
        const z = baseZ + nz * offset;
        const { gx, gy } = this.worldToGrid(x, z);
        if (!this.walkable(gx, gy, domain)) return false;
      }
    }

    return true;
  }

  // BFS for finding nearest walkable tile â€” navigates around obstacles
  findNearestWalkable(gx, gy, domain) {
    gx = THREE.MathUtils.clamp(gx, 0, this.size - 1);
    gy = THREE.MathUtils.clamp(gy, 0, this.size - 1);

    const queue = [{ gx, gy }];
    const visited = new Set([gy * this.size + gx]);

    let qi = 0;
    while (qi < queue.length) {
      const cur = queue[qi++];
      if (this.walkable(cur.gx, cur.gy, domain)) return cur;

      const dirs = [
        [1,0],[-1,0],[0,1],[0,-1],
        [1,1],[-1,1],[1,-1],[-1,-1]
      ];
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
  // Returns { groundTile, seaTile } â€” coast tile + adjacent water tile
  findNearestCoast(gx, gy, domain) {
    if (!this.walkable(gx, gy, domain)) {
      const nearest = this.findNearestWalkable(gx, gy, domain);
      if (!nearest) return null;
      gx = nearest.gx;
      gy = nearest.gy;
    }

    const queue = [{ gx, gy }];
    const visited = new Set([gy * this.size + gx]);

    let qi = 0;
    while (qi < queue.length) {
      const cur = queue[qi++];
      const t = this.terrainGrid[cur.gy * this.size + cur.gx];

      if (t === TERRAIN.COAST) {
        // Found a coast tile â€” now find an adjacent sea tile for ships
        const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
        for (const [dx, dy] of dirs) {
          const nx = cur.gx + dx, ny = cur.gy + dy;
          if (!this.inBounds(nx, ny)) continue;
          const nt = this.terrainGrid[ny * this.size + nx];
          if (nt === TERRAIN.SEA) {
            return { groundTile: cur, seaTile: { gx: nx, gy: ny } };
          }
        }
        // Coast found but no adjacent sea (interior coast) â€” cannot use this point
        return null;
      }

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
