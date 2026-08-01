// spatialGrid.js — uniform-grid spatial index for fast neighbour/enemy lookups.
// Phase 2: persistent generation-counter index. Cells survive between frames;
// build() refreshes per-unit generation stamps instead of clearing the map and
// re-pushing every unit. A unit that did not change cells is O(1) to rebuild.
// Dead/stale entries are dropped lazily by queryCircle/forEach via in-place
// compaction, so the cell arrays never accumulate garbage across a match.
import { MAP_SIZE } from './config.js';

export class SpatialGrid {
  constructor(cellSize = 40) {
    this.cell = cellSize;
    this.half = MAP_SIZE / 2;
    this.cols = Math.max(1, Math.ceil(MAP_SIZE / cellSize));
    this.cells = new Map(); // key -> Unit[]
    this._gen = 0;          // build generation; units are stamped with it
  }

  clear() {
    this.cells.clear();
    this._gen++;
  }

  _col(x) { return Math.floor((x + this.half) / this.cell); }

  /** Drop a unit from whatever cell it currently lives in (if any). */
  _removeUnit(unit) {
    const prevKey = unit._gridKey;
    if (prevKey === undefined) return;
    const arr = this.cells.get(prevKey);
    if (arr) {
      const idx = arr.indexOf(unit);
      if (idx >= 0) arr.splice(idx, 1);
    }
    unit._gridKey = undefined;
  }

  insert(unit) {
    const p = unit.mesh.position;
    const cx = this._col(p.x);
    const cz = this._col(p.z);
    if (cx < 0 || cz < 0 || cx >= this.cols || cz >= this.cols) return;
    const key = cz * this.cols + cx;
    if (unit._gridKey === key) return; // already resident — keep it in place
    this._removeUnit(unit);
    let arr = this.cells.get(key);
    if (!arr) { arr = []; this.cells.set(key, arr); }
    arr.push(unit);
    unit._gridKey = key;
    unit._gridStamp = this._gen;
  }

  build(units, otherUnits = null) {
    const gen = ++this._gen;
    this._buildList(units, gen);
    if (otherUnits) this._buildList(otherUnits, gen);
  }

  _buildList(units, gen) {
    for (let i = 0; i < units.length; i++) {
      const u = units[i];
      if (!u.alive) {
        this._removeUnit(u);
        continue;
      }
      const p = u.mesh.position;
      const cx = this._col(p.x);
      const cz = this._col(p.z);
      if (cx < 0 || cz < 0 || cx >= this.cols || cz >= this.cols) {
        this._removeUnit(u);
        continue;
      }
      const key = cz * this.cols + cx;
      if (u._gridKey === key) {
        // Already resident in this cell — just refresh the generation stamp.
        u._gridStamp = gen;
        continue;
      }
      this._removeUnit(u);
      let arr = this.cells.get(key);
      if (!arr) { arr = []; this.cells.set(key, arr); }
      arr.push(u);
      u._gridKey = key;
      u._gridStamp = gen;
    }
  }

  // Iterate every indexed unit without allocating a flattened array. This is
  // useful for global searches (for example a carrier fighter's nearest
  // enemy), while local searches should prefer queryCircle().
  forEach(cb) {
    const gen = this._gen;
    for (const arr of this.cells.values()) {
      let w = 0;
      for (let i = 0; i < arr.length; i++) {
        const u = arr[i];
        if (u._gridStamp !== gen || !u.alive) continue; // stale — drop
        arr[w++] = u;
        cb(u);
      }
      if (w !== arr.length) arr.length = w;
    }
  }

  /**
   * Invoke cb(unit) for every unit in cells overlapping the circle (x, z, radius).
   * Candidates are NOT distance-filtered; callers do the precise distance check.
   * Stale (dead / out-of-build) entries are compacted out in place while scanning.
   */
  queryCircle(x, z, radius, cb) {
    const minX = this._col(x - radius);
    const maxX = this._col(x + radius);
    const minZ = this._col(z - radius);
    const maxZ = this._col(z + radius);
    const gen = this._gen;
    for (let cz = minZ; cz <= maxZ; cz++) {
      if (cz < 0 || cz >= this.cols) continue;
      for (let cx = minX; cx <= maxX; cx++) {
        if (cx < 0 || cx >= this.cols) continue;
        const arr = this.cells.get(cz * this.cols + cx);
        if (!arr) continue;
        let w = 0;
        for (let i = 0; i < arr.length; i++) {
          const u = arr[i];
          if (u._gridStamp !== gen || !u.alive) continue; // stale — drop
          arr[w++] = u;
          cb(u);
        }
        if (w !== arr.length) arr.length = w;
      }
    }
  }
}
