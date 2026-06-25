// minimap.js — 2D canvas in corner showing units, bases, and view bounds.
import { MAP_SIZE } from './config.js';

export class Minimap {
  constructor(game, camera) {
    this.game = game;
    this.camera = camera;
    this.size = 200;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.canvas.id = 'minimap';
    this.canvas.style.cssText = `
      position:fixed; top:50px; right:10px;
      border:2px solid #4af; border-radius:6px;
      background:#1a3a5c; cursor:crosshair; z-index:20;
      box-shadow:0 0 15px rgba(70,170,255,0.4);
    `;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.canvas.addEventListener('mousedown', e => this.onClick(e));
    this.canvas.addEventListener('mousemove', e => { if (e.buttons & 1) this.onClick(e); });
  }

  worldToMini(x, z) {
    const t = this.size / MAP_SIZE;
    return { x: (x + MAP_SIZE/2) * t, y: (z + MAP_SIZE/2) * t };
  }
  miniToWorld(px, py) {
    const t = MAP_SIZE / this.size;
    return { x: px * t - MAP_SIZE/2, z: py * t - MAP_SIZE/2 };
  }

  onClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const w  = this.miniToWorld(px, py);
    if (this.game.cameraTarget) {
      this.game.cameraTarget.x = w.x;
      this.game.cameraTarget.z = w.z;
    }
  }

  draw() {
    const ctx = this.ctx;
    const s = this.size;
    ctx.clearRect(0, 0, s, s);

    ctx.fillStyle = '#1a3a5c';
    ctx.fillRect(0, 0, s, s);

    ctx.fillStyle = '#3a5a2a';
    for (const lm of this.game.terrain.landmasses) {
      const p = this.worldToMini(lm.x - lm.w/2, lm.z - lm.d/2);
      const w = lm.w * s / MAP_SIZE;
      const h = lm.d * s / MAP_SIZE;
      ctx.fillRect(p.x, p.y, w, h);
    }

    ctx.fillStyle = '#6b5b3a';
    for (const mt of this.game.terrain.mountains) {
      const p = this.worldToMini(mt.x, mt.z);
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
    }

    if (this.game.fog) {
      const fog = this.game.fog;
      const cellSize = s / fog.size;
      for (let y = 0; y < fog.size; y++) {
        for (let x = 0; x < fog.size; x++) {
          const v = fog.grid[y * fog.size + x];
          if (v === 0)      ctx.fillStyle = 'rgba(0,0,0,0.85)';
          else if (v === 1) ctx.fillStyle = 'rgba(0,0,0,0.45)';
          else continue;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize + 1, cellSize + 1);
        }
      }
    }

    for (const b of this.game.bases) {
      const p = this.worldToMini(b.mesh.position.x, b.mesh.position.z);
      if (b.faction === 'enemy' && this.game.fog && !this.game.fog.isExplored(b.mesh.position.x, b.mesh.position.z)) continue;
      ctx.fillStyle = b.faction === 'player' ? '#44aaff' : '#ff4444';
      ctx.fillRect(p.x - 3, p.y - 3, 6, 6);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.strokeRect(p.x - 3, p.y - 3, 6, 6);
    }

    for (const u of this.game.playerUnits) {
      if (!u.alive) continue;
      const p = this.worldToMini(u.mesh.position.x, u.mesh.position.z);
      ctx.fillStyle = u.selected ? '#44ff88' : '#44aaff';
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
    }
    for (const u of this.game.enemyUnits) {
      if (!u.alive) continue;
      if (this.game.fog && !this.game.fog.isVisible(u.mesh.position.x, u.mesh.position.z)) continue;
      const p = this.worldToMini(u.mesh.position.x, u.mesh.position.z);
      ctx.fillStyle = '#ff5555';
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
    }

    if (this.game.cameraTarget) {
      const c = this.worldToMini(this.game.cameraTarget.x, this.game.cameraTarget.z);
      const viewW = 150 * s / MAP_SIZE;
      const viewH = 100 * s / MAP_SIZE;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(c.x - viewW/2, c.y - viewH/2, viewW, viewH);
    }
  }
}
