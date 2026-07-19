// spatialGrid.js — uniform-grid spatial index for fast neighbour/enemy lookups.
// Rebuilt each tick from the live unit lists; turns O(n²) scans into ~O(n).
import { MAP_SIZE } from './config.js';

export class SpatialGrid {
  constructor(cellSize = 40) {
    this.cell = cellSize;
    this.half = MAP_SIZE / 2;
    this.cols = Math.max(1, Math.ceil(MAP_SIZE / cellSize));
    this.cells = new Map(); // key -> Unit[]
  }

  clear() { this.cells.clear(); }

  _col(x) { return Math.floor((x + this.half) / this.cell); }

  insert(unit) {
    const p = unit.mesh.position;
    const cx = this._col(p.x);
    const cz = this._col(p.z);
    if (cx < 0 || cz < 0 || cx >= this.cols || cz >= this.cols) return;
    const key = cz * this.cols + cx;
    let arr = this.cells.get(key);
    if (!arr) { arr = []; this.cells.set(key, arr); }
    arr.push(unit);
  }

  build(units, otherUnits = null) {
    this.clear();
    for (let i = 0; i < units.length; i++) {
      const u = units[i];
      if (u.alive) this.insert(u);
    }
    if (otherUnits) {
      for (let i = 0; i < otherUnits.length; i++) {
        const u = otherUnits[i];
        if (u.alive) this.insert(u);
      }
    }
  }

  // Iterate every indexed unit without allocating a flattened array. This is
  // useful for global searches (for example a carrier fighter's nearest
  // enemy), while local searches should prefer queryCircle().
  forEach(cb) {
    for (const arr of this.cells.values()) {
      for (let i = 0; i < arr.length; i++) cb(arr[i]);
    }
  }

  /**
   * Invoke cb(unit) for every unit in cells overlapping the circle (x, z, radius).
   * Candidates are NOT distance-filtered; callers do the precise distance check.
   */
  queryCircle(x, z, radius, cb) {
    const minX = this._col(x - radius);
    const maxX = this._col(x + radius);
    const minZ = this._col(z - radius);
    const maxZ = this._col(z + radius);
    for (let cz = minZ; cz <= maxZ; cz++) {
      if (cz < 0 || cz >= this.cols) continue;
      for (let cx = minX; cx <= maxX; cx++) {
        if (cx < 0 || cx >= this.cols) continue;
        const arr = this.cells.get(cz * this.cols + cx);
        if (!arr) continue;
        for (let i = 0; i < arr.length; i++) cb(arr[i]);
      }
    }
  }
}
