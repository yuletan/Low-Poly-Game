// unitIconRenderer.js — Single persistent icon cache used by the selection
// panel and the armory. The drawing implementation previously duplicated in
// ui.js and input.js now lives here once.

const cache = new Map();

function cacheKey(type, size, faction) {
  return `${type}:${size}:${faction}`;
}

function roundRect(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
  ctx.lineTo(x + rad, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
  ctx.lineTo(x, y + rad);
  ctx.quadraticCurveTo(x, y, x + rad, y);
  ctx.closePath();
}

export function getUnitIconDataUrl(type, options = {}) {
  const size = options.size || 48;
  const faction = options.faction || 'player';
  const key = cacheKey(type, size, faction);
  if (cache.has(key)) return cache.get(key);

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const defaultColor = faction === 'enemy' ? 0xc84c4c : 0x4a9eff;
  const color = options.color ?? defaultColor;

  ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
  ctx.strokeStyle = '#4af';
  ctx.lineWidth = Math.max(0.75, size / 48);

  const cx = size / 2;
  const cy = size / 2;
  const s = size * 0.35;

  ctx.beginPath();
  switch (type) {
    case 'infantry':
      ctx.moveTo(cx, cy - s);
      ctx.lineTo(cx - s * 0.6, cy + s * 0.5);
      ctx.lineTo(cx + s * 0.6, cy + s * 0.5);
      ctx.closePath();
      break;
    case 'tank':
      roundRect(ctx, cx - s, cy - s * 0.7, s * 2, s * 1.4, 3);
      ctx.moveTo(cx - s * 0.3, cy - s * 0.7);
      ctx.lineTo(cx + s * 0.3, cy - s * 0.7);
      ctx.lineTo(cx + s * 0.3, cy - s * 1.2);
      ctx.lineTo(cx - s * 0.3, cy - s * 1.2);
      ctx.closePath();
      break;
    case 'heavyTank':
      roundRect(ctx, cx - s * 1.2, cy - s * 0.8, s * 2.4, s * 1.6, 3);
      ctx.moveTo(cx - s * 0.35, cy - s * 0.8);
      ctx.lineTo(cx + s * 0.35, cy - s * 0.8);
      ctx.lineTo(cx + s * 0.35, cy - s * 1.4);
      ctx.lineTo(cx - s * 0.35, cy - s * 1.4);
      ctx.closePath();
      break;
    case 'crusher':
      roundRect(ctx, cx - s * 1.3, cy - s * 0.9, s * 2.6, s * 1.8, 3);
      ctx.moveTo(cx - s * 0.4, cy - s * 0.9);
      ctx.lineTo(cx + s * 0.4, cy - s * 0.9);
      ctx.lineTo(cx + s * 0.4, cy - s * 1.5);
      ctx.lineTo(cx - s * 0.4, cy - s * 1.5);
      ctx.closePath();
      break;
    case 'artillery':
      roundRect(ctx, cx - s, cy - s * 0.6, s * 2, s * 1.2, 2);
      ctx.moveTo(cx + s * 0.1, cy);
      ctx.lineTo(cx + s * 1.5, cy - s * 0.3);
      ctx.lineTo(cx + s * 1.5, cy + s * 0.3);
      ctx.lineTo(cx + s * 0.1, cy);
      ctx.closePath();
      break;
    case 'missileDefense':
      roundRect(ctx, cx - s * 0.8, cy - s * 0.6, s * 1.6, s * 1.2, 2);
      ctx.moveTo(cx, cy - s * 0.6);
      ctx.lineTo(cx, cy - s * 1.3);
      ctx.lineTo(cx + s * 0.3, cy - s * 1.1);
      ctx.lineTo(cx, cy - s * 1.3);
      ctx.lineTo(cx - s * 0.3, cy - s * 1.1);
      ctx.closePath();
      break;
    case 'coastal':
      roundRect(ctx, cx - s * 1, cy - s * 0.3, s * 2, s * 0.6, 1);
      ctx.moveTo(cx - s * 0.3, cy - s * 0.3);
      ctx.lineTo(cx + s * 0.3, cy - s * 0.3);
      ctx.lineTo(cx + s * 0.3, cy - s * 0.8);
      ctx.lineTo(cx - s * 0.3, cy - s * 0.8);
      ctx.closePath();
      break;
    case 'destroyer':
    case 'battleship':
      ctx.moveTo(cx - s * 1.2, cy + s * 0.3);
      ctx.lineTo(cx + s * 1.2, cy + s * 0.3);
      ctx.lineTo(cx + s * 0.8, cy - s * 0.4);
      ctx.lineTo(cx - s * 0.8, cy - s * 0.4);
      ctx.closePath();
      break;
    case 'frigate':
      ctx.moveTo(cx - s * 0.9, cy + s * 0.3);
      ctx.lineTo(cx + s * 1.2, cy + s * 0.3);
      ctx.lineTo(cx + s * 0.9, cy - s * 0.3);
      ctx.lineTo(cx - s * 0.6, cy - s * 0.3);
      ctx.closePath();
      break;
    case 'cruiser':
      ctx.moveTo(cx - s * 1.3, cy + s * 0.3);
      ctx.lineTo(cx + s * 1.3, cy + s * 0.3);
      ctx.lineTo(cx + s * 1, cy - s * 0.4);
      ctx.lineTo(cx - s * 1, cy - s * 0.4);
      ctx.closePath();
      break;
    case 'submarine':
      ctx.ellipse(cx, cy, s * 1.3, s * 0.5, 0, 0, Math.PI * 2);
      ctx.closePath();
      break;
    case 'carrier':
      ctx.moveTo(cx - s * 1.3, cy + s * 0.2);
      ctx.lineTo(cx + s * 1.3, cy + s * 0.2);
      ctx.lineTo(cx + s * 1.3, cy - s * 0.3);
      ctx.lineTo(cx - s * 1.3, cy - s * 0.3);
      ctx.closePath();
      ctx.moveTo(cx + s * 0.4, cy - s * 0.3);
      ctx.lineTo(cx + s * 0.4, cy - s * 0.8);
      ctx.lineTo(cx + s * 0.9, cy - s * 0.5);
      ctx.lineTo(cx + s * 0.9, cy - s * 0.3);
      ctx.closePath();
      break;
    case 'fighter':
      ctx.moveTo(cx, cy - s * 1.1);
      ctx.lineTo(cx + s * 0.6, cy + s * 0.2);
      ctx.lineTo(cx + s * 0.3, cy + s * 0.2);
      ctx.lineTo(cx + s * 0.4, cy + s * 0.6);
      ctx.lineTo(cx, cy + s * 0.4);
      ctx.lineTo(cx - s * 0.4, cy + s * 0.6);
      ctx.lineTo(cx - s * 0.3, cy + s * 0.2);
      ctx.lineTo(cx - s * 0.6, cy + s * 0.2);
      ctx.closePath();
      break;
    case 'bomber':
      ctx.moveTo(cx, cy - s * 1.2);
      ctx.lineTo(cx + s * 0.8, cy + s * 0.3);
      ctx.lineTo(cx + s * 0.4, cy + s * 0.3);
      ctx.lineTo(cx + s * 0.5, cy + s * 0.7);
      ctx.lineTo(cx, cy + s * 0.5);
      ctx.lineTo(cx - s * 0.5, cy + s * 0.7);
      ctx.lineTo(cx - s * 0.4, cy + s * 0.3);
      ctx.lineTo(cx - s * 0.8, cy + s * 0.3);
      ctx.closePath();
      break;
    case 'heli':
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + s * 0.8, cy + s * 0.3);
      ctx.lineTo(cx + s * 0.8, cy - s * 0.3);
      ctx.lineTo(cx, cy - s * 0.2);
      ctx.lineTo(cx - s * 0.8, cy - s * 0.1);
      ctx.lineTo(cx - s * 0.8, cy + s * 0.1);
      ctx.closePath();
      break;
    case 'gunship':
      roundRect(ctx, cx - s, cy - s * 0.4, s * 2, s * 0.8, 2);
      ctx.moveTo(cx - s * 1.5, cy);
      ctx.lineTo(cx + s * 1.5, cy);
      ctx.lineTo(cx + s * 1.5, cy + s * 0.15);
      ctx.lineTo(cx - s * 1.5, cy + s * 0.15);
      ctx.closePath();
      break;
    case 'mlrs':
      roundRect(ctx, cx - s, cy - s * 0.7, s * 2, s * 1.4, 2);
      ctx.moveTo(cx - s * 0.6, cy - s * 0.4);
      ctx.lineTo(cx + s * 0.6, cy - s * 0.4);
      ctx.lineTo(cx + s * 0.4, cy - s * 1);
      ctx.lineTo(cx - s * 0.4, cy - s * 1);
      ctx.closePath();
      break;
    case 'healer':
      roundRect(ctx, cx - s, cy - s * 0.7, s * 2, s * 1.4, 2);
      ctx.moveTo(cx - s * 0.3, cy); ctx.lineTo(cx + s * 0.3, cy);
      ctx.moveTo(cx, cy - s * 0.3); ctx.lineTo(cx, cy + s * 0.3);
      ctx.closePath();
      break;
    case 'medHeli':
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + s * 0.8, cy + s * 0.3);
      ctx.lineTo(cx + s * 0.8, cy - s * 0.3);
      ctx.lineTo(cx, cy - s * 0.2);
      ctx.lineTo(cx - s * 0.8, cy - s * 0.1);
      ctx.lineTo(cx - s * 0.8, cy + s * 0.1);
      ctx.closePath();
      ctx.moveTo(cx - s * 0.2, cy - s * 0.3);
      ctx.lineTo(cx + s * 0.2, cy - s * 0.3);
      ctx.moveTo(cx, cy - s * 0.5);
      ctx.lineTo(cx, cy - s * 0.1);
      ctx.closePath();
      break;
    case 'escortJet':
      ctx.moveTo(cx, cy - s * 1.1); ctx.lineTo(cx + s * 0.7, cy + s * 0.2);
      ctx.lineTo(cx + s * 0.4, cy + s * 0.2); ctx.lineTo(cx + s * 0.5, cy + s * 0.6);
      ctx.lineTo(cx, cy + s * 0.4); ctx.lineTo(cx - s * 0.5, cy + s * 0.6);
      ctx.lineTo(cx - s * 0.4, cy + s * 0.2); ctx.lineTo(cx - s * 0.7, cy + s * 0.2);
      ctx.closePath();
      break;
    case 'b2':
      ctx.moveTo(cx, cy - s * 0.4); ctx.lineTo(cx - s * 1.3, cy + s * 0.5);
      ctx.lineTo(cx - s * 1.3, cy + s * 0.7); ctx.lineTo(cx + s * 1.3, cy + s * 0.7);
      ctx.lineTo(cx + s * 1.3, cy + s * 0.5);
      ctx.closePath();
      break;
    case 'escortBomber':
      ctx.moveTo(cx, cy - s * 1.3); ctx.lineTo(cx + s * 1, cy + s * 0.3);
      ctx.lineTo(cx + s * 0.6, cy + s * 0.3); ctx.lineTo(cx + s * 0.7, cy + s * 0.8);
      ctx.lineTo(cx, cy + s * 0.6); ctx.lineTo(cx - s * 0.7, cy + s * 0.8);
      ctx.lineTo(cx - s * 0.6, cy + s * 0.3); ctx.lineTo(cx - s * 1, cy + s * 0.3);
      ctx.closePath();
      break;
    case 'minigunnerVehicle':
      roundRect(ctx, cx - s * 1.1, cy - s * 0.7, s * 2.2, s * 1.4, 3);
      ctx.moveTo(cx + s * 0.8, cy - s * 0.3);
      ctx.lineTo(cx + s * 1.5, cy - s * 0.5);
      ctx.lineTo(cx + s * 1.5, cy + s * 0.1);
      ctx.lineTo(cx + s * 0.8, cy + s * 0.1);
      ctx.closePath();
      break;
    case 'megaMedic':
      roundRect(ctx, cx - s, cy - s * 0.7, s * 2, s * 1.4, 2);
      ctx.moveTo(cx - s * 0.4, cy); ctx.lineTo(cx + s * 0.4, cy);
      ctx.moveTo(cx, cy - s * 0.4); ctx.lineTo(cx, cy + s * 0.4);
      ctx.closePath();
      break;
    case 'minigunner':
      ctx.moveTo(cx, cy - s);
      ctx.lineTo(cx - s * 0.6, cy + s * 0.5);
      ctx.lineTo(cx + s * 0.6, cy + s * 0.5);
      ctx.closePath();
      ctx.moveTo(cx + s * 0.1, cy + s * 0.3);
      ctx.lineTo(cx + s * 0.8, cy);
      ctx.lineTo(cx + s * 0.8, cy + s * 0.5);
      ctx.lineTo(cx + s * 0.1, cy + s * 0.5);
      ctx.closePath();
      break;
    case 'transport':
      roundRect(ctx, cx - s, cy - s * 0.5, s * 2, s, 2);
      ctx.closePath();
      break;
    default:
      roundRect(ctx, cx - s, cy - s * 0.7, s * 2, s * 1.4, 2);
      ctx.closePath();
      break;
  }
  ctx.fill();
  ctx.stroke();

  const dataUrl = canvas.toDataURL('image/png');
  cache.set(key, dataUrl);
  return dataUrl;
}

export function clearUnitIconCache() {
  cache.clear();
}
