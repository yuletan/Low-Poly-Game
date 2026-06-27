// minimap.js — 2D canvas in corner showing units, bases, and view bounds.
import { MAP_SIZE } from './config.js';

export class Minimap {
  constructor(game, camera) {
    this.game = game;
    this.camera = camera;
    this.size = 250;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.size;
    this.canvas.height = this.size;
    this.canvas.id = 'minimap';
    this.canvas.style.cssText = `
      position:fixed; top:50px; right:10px;
      border:2px solid #4af; border-radius:6px;
      background:#2a4a6c; cursor:crosshair; z-index:20;
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

    // Placement mode — confirm placement from minimap
    if (this.game.placementMode && this.game.placementMode.active) {
      const worldPos = { x: w.x, z: w.z };
      this.game.confirmPlacement(worldPos);
      return;
    }

    if (this.game.cameraTarget) {
      this.game.cameraTarget.x = w.x;
      this.game.cameraTarget.z = w.z;
      // Add click ping
      this.addPing(px, py);
    }
  }

  addPing(x, y) {
    this.pings = this.pings || [];
    this.pings.push({ x, y, life: 1.0, maxLife: 1.0, time: 0 });
  }

  draw() {
    const ctx = this.ctx;
    const s = this.size;
    ctx.clearRect(0, 0, s, s);

    ctx.fillStyle = '#2a4a6c';
    ctx.fillRect(0, 0, s, s);

    // Draw terrain outlines (always visible, even under fog)
    ctx.strokeStyle = '#4a7a5a';
    ctx.lineWidth = 2;
    for (const lm of this.game.terrain.landmasses) {
      const p = this.worldToMini(lm.x - lm.w/2, lm.z - lm.d/2);
      const w = lm.w * s / MAP_SIZE;
      const h = lm.d * s / MAP_SIZE;
      ctx.strokeRect(p.x, p.y, w, h);
    }

    // Mountain dots (always visible)
    ctx.fillStyle = '#5a4a3a';
    for (const mt of this.game.terrain.mountains) {
      const p = this.worldToMini(mt.x, mt.z);
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
    }

    // Filled terrain for explored areas
    if (this.game.fog) {
      const fog = this.game.fog;
      const cellSize = s / fog.size;
      for (let y = 0; y < fog.size; y++) {
        for (let x = 0; x < fog.size; x++) {
          const v = fog.grid[y * fog.size + x];
          if (v === 0) {
            // Unexplored: dark
            ctx.fillStyle = 'rgba(0,0,0,0.85)';
            ctx.fillRect(x * cellSize, y * cellSize, cellSize + 1, cellSize + 1);
          } else if (v === 1) {
            // Explored but not visible: show filled terrain with fog
            // Check what terrain is at this cell center
            const wx = x * cellSize + cellSize/2;
            const wy = y * cellSize + cellSize/2;
            const world = this.miniToWorld(wx, wy);
            const terrain = this.game.terrain.getTerrainAt(world.x, world.z);
            if (terrain === 'land' || terrain === 'coast') {
              ctx.fillStyle = 'rgba(58,90,42,0.5)';
              ctx.fillRect(x * cellSize, y * cellSize, cellSize + 1, cellSize + 1);
            } else if (terrain === 'sea') {
              ctx.fillStyle = 'rgba(26,58,92,0.5)';
              ctx.fillRect(x * cellSize, y * cellSize, cellSize + 1, cellSize + 1);
            }
          }
        }
      }
    }

    // Draw territory circles
    for (const b of this.game.bases) {
      if (!b.alive) continue;
      if (b.faction === 'enemy' && this.game.fog && !this.game.fog.isExplored(b.mesh.position.x, b.mesh.position.z)) continue;
      const p = this.worldToMini(b.mesh.position.x, b.mesh.position.z);
      const r = b.territory / MAP_SIZE * s;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = b.faction === 'player' ? 'rgba(68,170,255,0.12)' : 'rgba(255,68,68,0.12)';
      ctx.fill();
      ctx.strokeStyle = b.faction === 'player' ? 'rgba(68,170,255,0.4)' : 'rgba(255,68,68,0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
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

    // Draw and animate pings
    if (this.pings) {
      for (let i = this.pings.length - 1; i >= 0; i--) {
        const p = this.pings[i];
        p.life -= 0.03; // ~33 frames at 60fps
        p.time += 0.03;
        if (p.life <= 0) {
          this.pings.splice(i, 1);
          continue;
        }
        const alpha = p.life / p.maxLife;
        ctx.strokeStyle = `rgba(68, 255, 136, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const r = 8 * (1 - alpha) + 2;
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.stroke();
        // Inner ripple
        ctx.strokeStyle = `rgba(68, 255, 136, ${alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 0.6, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }
}
