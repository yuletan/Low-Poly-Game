// ui.js — Modern UI with bottom dock layout and glassmorphism
import * as THREE from 'three';
import { UNIT_TYPES, UPGRADES, QUALITY_PRESETS, setActivePreset } from './config.js?v=4';
import { Sound } from './sound.js';
import { saveGame, loadSaveData, deleteSave, hasSave } from './saveLoad.js';

// Generate unit icon as data URL using canvas 2D
function generateUnitIcon(type, color, size = 48) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

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

  ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
  ctx.strokeStyle = '#4af';
  ctx.lineWidth = 1;

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
  }
  ctx.fill();
  ctx.stroke();

  return canvas.toDataURL('image/png');
}

// Create enhanced tooltip with grid layout
function createEnhancedTooltip(type, stats) {
  const tooltip = document.createElement('div');
  tooltip.className = 'unit-tooltip';
  tooltip.innerHTML = `
    <strong>${type.toUpperCase()} <span class="domain-badge ${stats.domain}">${stats.domain}</span></strong>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:8px 0;">
      <div><span class="stat">HP:</span> <strong>${stats.hp}</strong></div>
      <div><span class="stat">DMG:</span> <strong>${stats.damage}</strong></div>
      <div><span class="stat">RNG:</span> <strong>${stats.range}</strong></div>
      <div><span class="stat">SPD:</span> <strong>${stats.speed}</strong></div>
      <div><span class="stat">FR:</span> <strong>${stats.fireRate}s</strong></div>
      <div><span class="stat">HIT:</span> <strong>${Math.round(stats.hitChance * 100)}%</strong></div>
    </div>
    <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);">
      <span class="stat">Cost:</span> <strong style="color:var(--success)">$${stats.cost}</strong>
    </div>
    ${stats.special ? `<div class="stat-special">${stats.special}</div>` : ''}
  `;
  document.body.appendChild(tooltip);
  return tooltip;
}

// Create a unit button with icon, name, cost, hotkey, tooltip
function createUnitButton(key, hotkey, game) {
  const stats = UNIT_TYPES[key];
  const iconDataUrl = generateUnitIcon(key, stats.color);

  const b = document.createElement('button');
  b.className = 'unitBtn';
  b.dataset.unitType = key;

  b.innerHTML = `
    <span class="unit-hotkey">${hotkey}</span>
    <img class="unit-icon" src="${iconDataUrl}" alt="${key}" loading="lazy">
    <div class="unit-info">
      <span class="unit-name">${key}</span>
      <span class="unit-domain ${stats.domain}">${stats.domain}</span>
    </div>
    <div class="unit-cost">$${stats.cost}</div>
  `;

  b.addEventListener('click', (e) => game.enterPlacementMode(key, e.ctrlKey));

  let tooltip = null;
  b.addEventListener('mouseenter', () => {
    tooltip = createEnhancedTooltip(key, stats);
    const rect = b.getBoundingClientRect();
    tooltip.style.left = (rect.left) + 'px';
    tooltip.style.top = (rect.top - 10) + 'px';
    tooltip.classList.add('visible');
  });
  b.addEventListener('mouseleave', () => {
    if (tooltip) {
      tooltip.classList.remove('visible');
      setTimeout(() => tooltip.remove(), 150);
    }
  });
  b.addEventListener('mousemove', (e) => {
    if (tooltip) {
      tooltip.style.left = (e.clientX + 16) + 'px';
      tooltip.style.top = (e.clientY + 16) + 'px';
    }
  });

  return b;
}

// Create an upgrade button
function createUpgradeButton(stat, game) {
  const def = UPGRADES[stat];
  const btn = document.createElement('button');
  btn.className = 'unitBtn upgradeBtn';
  btn.dataset.stat = stat;

  const tier = game.upgrades.tiers[stat];
  const cost = game.upgrades.nextCost(stat);
  const mult = def.tiers[tier];

  btn.innerHTML = `
    <span class="unit-icon" style="font-size:28px;display:flex;align-items:center;justify-content:center;">${def.icon}</span>
    <div class="unit-info">
      <span class="unit-name">${def.name}</span>
      <span class="unit-domain">T${tier} x${mult.toFixed(2)}</span>
    </div>
    <div class="unit-cost" style="${cost === null ? 'color:var(--text-muted)' : ''}">${cost === null ? 'MAX' : '$' + cost}</div>
  `;

  btn.addEventListener('click', () => {
    if (game.upgrades.upgrade(stat)) {
      const newBtn = createUpgradeButton(stat, game);
      btn.parentNode.replaceChild(newBtn, btn);
    } else {
      Sound.play('error');
      btn.classList.add('shake-animation');
      setTimeout(() => btn.classList.remove('shake-animation'), 500);
      game.flashMessage('Insufficient funds or max tier reached!');
    }
  });

  return btn;
}


const FORMATION_DETAILS = {
  line: {
    name: 'Line',
    hotkey: 'F1',
    summary: 'Wide front for maximum firing coverage.',
    detail: 'Best when you want many units shooting at once across open ground.'
  },
  wedge: {
    name: 'Wedge',
    hotkey: 'F2',
    summary: 'Point-first advance that keeps damage dealers grouped.',
    detail: 'Useful for pushing into contact while keeping the group compact.'
  },
  square: {
    name: 'Square',
    hotkey: 'F3',
    summary: 'Compact grid for holding space and reducing stragglers.',
    detail: 'Good for mixed groups that need to arrive together or defend a spot.'
  },
  column: {
    name: 'Column',
    hotkey: 'F4',
    summary: 'Narrow travel shape for bridges, beaches, and tight gaps.',
    detail: 'Use this when pathing through chokepoints or around mountains.'
  }
};

const FORMATION_HINT_SESSION_KEY = 'lowPolyCommand.formationHint.seenThisSession';

function formationHintSeenThisSession() {
  try { return sessionStorage.getItem(FORMATION_HINT_SESSION_KEY) === '1'; }
  catch (_) { return false; }
}

function markFormationHintSeen() {
  try { sessionStorage.setItem(FORMATION_HINT_SESSION_KEY, '1'); }
  catch (_) { /* sessionStorage can be unavailable in private/file contexts */ }
}

function selectedMovableUnitCount(game) {
  return game.selectedUnits.filter(u => u && u.alive && !u.carried).length;
}

function dismissFormationHint(selectionPanel) {
  const hint = selectionPanel?.querySelector('#formationHint');
  if (hint) hint.remove();
  markFormationHintSeen();
}

function maybeShowFormationHint(game, selectionPanel) {
  if (!selectionPanel) return;
  const existing = selectionPanel.querySelector('#formationHint');
  if (selectedMovableUnitCount(game) < 2) {
    if (existing) existing.remove();
    return;
  }
  if (existing) return;
  if (formationHintSeenThisSession()) return;

  const hint = document.createElement('div');
  hint.id = 'formationHint';
  hint.className = 'formation-onboarding-hint';
  hint.innerHTML = `
    <div>
      <strong>Formations unlocked</strong>
      <span>Pick Line, Wedge, Square, or Column before ordering a group move.</span>
    </div>
    <button type="button" class="formation-hint-dismiss" aria-label="Dismiss formation hint">×</button>
  `;

  const buttons = selectionPanel.querySelector('.formation-options');
  selectionPanel.insertBefore(hint, buttons || null);
  hint.querySelector('.formation-hint-dismiss')?.addEventListener('click', () => dismissFormationHint(selectionPanel));
  markFormationHintSeen();
}

function updateFormationHelpText(formation, helpEl) {
  if (!helpEl) return;
  const info = FORMATION_DETAILS[formation] || FORMATION_DETAILS.line;
  helpEl.innerHTML = `
    <strong>${info.name} <span>${info.hotkey}</span></strong>
    <span>${info.summary}</span>
    <small>${info.detail}</small>
  `;
}

function flashMessage(msg) {
  let el = document.getElementById('flashMsg');
  if (!el) {
    el = document.createElement('div');
    el.id = 'flashMsg';
    el.className = 'flash-msg';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('visible');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('visible'), 3000);
}

// Update selection panel UI
function updateSelectionUI(game, selectionInfo, selectionPanel) {
  if (!selectionInfo) return;

  const selected = game.selectedUnits.filter(u => u && u.alive && !u.carried);
  if (selected.length !== game.selectedUnits.length) {
    game.selectedUnits = selected;
  }

  if (selected.length === 0) {
    if (game.selectedBuilding) {
      const sb = game.selectedBuilding;
      selectionInfo.innerHTML = `
        <div class="selection-building">
          <strong>${sb.base.name}</strong>
          <span>${sb.isShipyard ? 'Shipyard' : 'Barracks'}</span>
        </div>
      `;
    } else {
      selectionInfo.innerHTML = `
        <div class="selection-empty">
          <strong>No units selected</strong>
          <span>Click, Shift-click, drag-box, or double-click a unit type.</span>
        </div>
      `;
    }
    maybeShowFormationHint(game, selectionPanel);
    return;
  }

  maybeShowFormationHint(game, selectionPanel);

  const counts = {};
  const domainCounts = {};
  selected.forEach(u => {
    counts[u.type] = (counts[u.type] || 0) + 1;
    const domain = u.domain || UNIT_TYPES[u.type]?.domain || 'mixed';
    domainCounts[domain] = (domainCounts[domain] || 0) + 1;
  });

  const typeSummary = Object.entries(counts).map(([type, count]) => `${count} ${type}`).join(' • ');
  const domainSummary = Object.entries(domainCounts).map(([domain, count]) => `${count} ${domain}`).join(' • ');

  let html = `
    <div class="selection-summary">
      <strong>${selected.length}</strong> selected
      <span>${typeSummary}</span>
      <small>${domainSummary}</small>
    </div>
  `;

  for (const [type, count] of Object.entries(counts)) {
    const stats = UNIT_TYPES[type];
    const iconDataUrl = generateUnitIcon(type, stats?.color || 0x4a9eff);

    let typeHp = 0, typeDmg = 0, typeRange = 0;
    selected.forEach(u => {
      if (u.type === type) {
        typeHp += u.hp;
        typeDmg += u.stats.damage;
        typeRange = Math.max(typeRange, u.stats.range);
      }
    });

    const avgHp = Math.round(typeHp / count);
    const avgDmg = Math.round(typeDmg / count);

    html += `
      <div class="selection-item">
        <img class="selection-icon" src="${iconDataUrl}" alt="${type}">
        <div style="flex:1;">
          <div class="selection-type">${type.toUpperCase()}</div>
          <div class="selection-stats">HP: ${avgHp} | DMG: ${avgDmg} | RNG: ${typeRange}</div>
        </div>
        <div class="selection-count">×${count}</div>
      </div>
    `;
  }

  html += `<div class="selection-tip">Shift-click toggles units • Drag/touch-drag box-selects friendly units only • Touch: long-press destination to move/attack</div>`;

  const transport = selected.find(u => u.isTransport && u.alive);
  if (transport) {
    const nearbyLand = game.playerUnits.filter(u =>
      u.alive && u.domain === 'land' && !u.carried && transport.canLoadUnit(u)
    );
    const canLoad = nearbyLand.length > 0;
    const canUnload = transport.carriedUnits.length > 0;

    html += `
      <div class="transport-actions">
        <button class="action-btn" id="loadBtn" ${canLoad ? '' : 'disabled'}>
          Load${canLoad ? ` (${nearbyLand.length})` : ' (no units)'}
        </button>
        <button class="action-btn" id="unloadBtn" ${canUnload ? '' : 'disabled'}>
          Unload${canUnload ? ` (${transport.carriedUnits.length})` : ' (empty)'}
        </button>
      </div>
    `;
  }

  selectionInfo.innerHTML = html;

  const loadBtn = document.getElementById('loadBtn');
  if (loadBtn) {
    loadBtn.addEventListener('click', () => {
      const t = game.selectedUnits.find(u => u.isTransport);
      if (!t) return;
      const toLoad = game.playerUnits.filter(u =>
        u.alive && u.domain === 'land' && !u.carried && t.canLoadUnit(u)
      );
      for (const u of toLoad) t.loadUnit(u);
      game.updateSelectionUI?.();
    });
  }

  const unloadBtn = document.getElementById('unloadBtn');
  if (unloadBtn) {
    unloadBtn.addEventListener('click', () => {
      const t = game.selectedUnits.find(u => u.isTransport);
      if (t) t.unloadAll();
      game.updateSelectionUI?.();
    });
  }
}

export function initUI(game) {
  // === Create Armory Panel (Bottom Dock) ===
  const armoryPanel = document.createElement('div');
  armoryPanel.id = 'armoryPanel';
  armoryPanel.className = 'panel';
  document.body.appendChild(armoryPanel);

  const armoryTabs = document.createElement('div');
  armoryTabs.className = 'armory-tabs';

  const tabs = [
    { id: 'land', label: 'LAND' },
    { id: 'sea', label: 'SEA' },
    { id: 'air', label: 'AIR' },
    { id: 'upgrades', label: 'UPGRADES' }
  ];

  const tabPanels = {};

  tabs.forEach((tab, i) => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (i === 0 ? ' active' : '');
    btn.dataset.tab = tab.id;
    btn.textContent = tab.label;
    armoryTabs.appendChild(btn);
  });

  const armoryContent = document.createElement('div');
  armoryContent.id = 'armoryContent';

  const unitsByDomain = { land: [], sea: [], air: [] };
  Object.keys(UNIT_TYPES).forEach((key, index) => {
    const stats = UNIT_TYPES[key];
    if (stats.domain && unitsByDomain[stats.domain]) {
      unitsByDomain[stats.domain].push({ key, index: index + 1 });
    }
  });

  tabs.forEach((tab, i) => {
    const panel = document.createElement('div');
    panel.className = 'armory-tab-panel' + (i === 0 ? ' active' : '');
    panel.dataset.tab = tab.id;

    if (tab.id === 'upgrades') {
      panel.className = 'armory-tab-panel upgrades-grid' + (i === 0 ? ' active' : '');
      for (const [stat] of Object.entries(UPGRADES)) {
        panel.appendChild(createUpgradeButton(stat, game));
      }
    } else {
      unitsByDomain[tab.id].forEach(({ key, index }) => {
        panel.appendChild(createUnitButton(key, index, game));
      });
    }

    tabPanels[tab.id] = panel;
  });

  Object.values(tabPanels).forEach(panel => armoryContent.appendChild(panel));

  armoryPanel.appendChild(armoryTabs);
  armoryPanel.appendChild(armoryContent);

  function switchTab(tabId) {
    armoryTabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    armoryContent.querySelectorAll('.armory-tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.dataset.tab === tabId);
    });
  }

  armoryTabs.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // === Create Selection Panel (Bottom Left) ===
  const selectionPanel = document.createElement('div');
  selectionPanel.id = 'selectionPanel';
  selectionPanel.className = 'panel';
  selectionPanel.innerHTML = `
    <div style="padding:8px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
      <div style="font-size:11px;font-weight:bold;color:var(--primary);text-transform:uppercase;letter-spacing:1px;">Selection</div>
      <button id="selectAllBtn" class="topBtn" style="font-size:10px;padding:3px 8px;">All</button>
    </div>
    <div id="selectionInfo">
      <div style="color:var(--text-muted);text-align:center;padding:20px;">
        Click/tap or drag to select units
      </div>
    </div>
    <div class="formation-options" aria-label="Formation controls">
      <button type="button" class="formation-btn active" data-formation="line" title="Line (F1) - Wide firing front" aria-label="Line formation: wide firing front">
        <svg viewBox="0 0 24 24"><rect x="2" y="10" width="20" height="4" rx="1"/></svg>
        <span class="formation-label">Line</span>
      </button>
      <button type="button" class="formation-btn" data-formation="wedge" title="Wedge (F2) - Compact spearhead" aria-label="Wedge formation: compact spearhead">
        <svg viewBox="0 0 24 24"><path d="M12 2 L22 20 L2 20 Z"/></svg>
        <span class="formation-label">Wedge</span>
      </button>
      <button type="button" class="formation-btn" data-formation="square" title="Square (F3) - Defensive grid" aria-label="Square formation: defensive grid">
        <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
        <span class="formation-label">Square</span>
      </button>
      <button type="button" class="formation-btn" data-formation="column" title="Column (F4) - Narrow travel line" aria-label="Column formation: narrow travel line">
        <svg viewBox="0 0 24 24"><rect x="10" y="2" width="4" height="20" rx="1"/></svg>
        <span class="formation-label">Column</span>
      </button>
    </div>
    <div id="formationHelpText" class="formation-help-text" role="status" aria-live="polite"></div>
  `;
  document.body.appendChild(selectionPanel);

  const selectionInfo = document.getElementById('selectionInfo');
  const formationHelpText = selectionPanel.querySelector('#formationHelpText');
  game.updateSelectionUI = () => updateSelectionUI(game, selectionInfo, selectionPanel);

  const formationBtns = selectionPanel.querySelectorAll('.formation-btn');
  function setFormation(formation, announce = true) {
    const normalized = FORMATION_DETAILS[formation] ? formation : 'line';
    game.formation = normalized;
    formationBtns.forEach(b => b.classList.toggle('active', b.dataset.formation === normalized));
    updateFormationHelpText(normalized, formationHelpText);
    dismissFormationHint(selectionPanel);
    if (announce) game.flashMessage(`Formation: ${FORMATION_DETAILS[normalized].name} — ${FORMATION_DETAILS[normalized].summary}`);
  }
  formationBtns.forEach(btn => {
    btn.addEventListener('click', () => setFormation(btn.dataset.formation));
  });
  updateFormationHelpText(game.formation || 'line', formationHelpText);

  document.getElementById('selectAllBtn').addEventListener('click', () => {
    const aliveUnits = game.playerUnits.filter(u => u.alive && u.selectable !== false && !u.carried);
    if (aliveUnits.length === 0) { game.flashMessage('No units to select'); return; }
    for (const u of game.selectedUnits) u.setSelected(false);
    game.selectedBuilding = null;
    game.selectedUnits = aliveUnits;
    for (const u of game.selectedUnits) u.setSelected(true);
    game.updateSelectionUI?.();
    game.flashMessage(`Selected ${aliveUnits.length} units`);
  });

  // === Create Top Bar ===
  const topBar = document.createElement('div');
  topBar.id = 'topBar';
  topBar.innerHTML = `
    <div class="top-stat">Money: <span id="money">0</span></div>
    <div class="top-stat">Bases: <span id="basesOwned">0</span>/<span id="basesTotal">0</span></div>
    <div class="top-stat">Units: <span id="unitCount">0</span></div>
    <div class="top-stat" style="color:var(--text-muted);">Enemy: <span id="enemyCount">0</span></div>
    <div style="flex:1;"></div>
    <button id="launchBtn" class="topBtn">Launch</button>
    <button id="fleetBtn" class="topBtn">Fleet</button>
    <button id="focusHqBtn" class="topBtn">HQ</button>
    <button id="settingsBtn" class="topBtn">⚙</button>
    <button id="helpBtn" class="topBtn">Help</button>
    <div class="top-dropdown">
      <button id="menuToggleBtn" class="topBtn">Menu</button>
      <div class="dropdown-menu hidden" id="dropdownMenu">
        <button id="saveBtn" class="dropdown-item">Save</button>
        <button id="loadBtn" class="dropdown-item">Load</button>
        <button id="soundBtn" class="dropdown-item">Sound: ON</button>
      </div>
    </div>
  `;
  document.body.appendChild(topBar);

  // Top bar button handlers
  document.getElementById('launchBtn').addEventListener('click', () => {
    const carriers = game.selectedUnits.filter(u => u.canLaunch && u.alive);
    if (carriers.length === 0) { game.flashMessage('Select a carrier first'); return; }
    let launched = 0;
    for (const c of carriers) { if (c.launchFighters()) launched++; }
    if (launched === 0) game.flashMessage('Carriers on cooldown');
  });

  document.getElementById('fleetBtn').addEventListener('click', () => {
    game.enterFleetPlacementMode();
  });

  document.getElementById('focusHqBtn').addEventListener('click', () => {
    const hq = game.bases.find(b => b.faction === 'player');
    if (hq) {
      game.cameraTarget.x = hq.mesh.position.x;
      game.cameraTarget.z = hq.mesh.position.z;
      game.flashMessage('Camera centered on HQ');
    }
  });

  // Dropdown
  const menuToggle = document.getElementById('menuToggleBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('hidden');
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.top-dropdown')) dropdownMenu.classList.add('hidden');
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
    if (saveGame(game)) game.flashMessage('Game saved!');
    else game.flashMessage('Save failed');
    dropdownMenu.classList.add('hidden');
  });
  document.getElementById('loadBtn').addEventListener('click', () => {
    if (hasSave()) location.reload();
    else game.flashMessage('No save found');
    dropdownMenu.classList.add('hidden');
  });
  document.getElementById('soundBtn').addEventListener('click', () => {
    Sound.enabled = !Sound.enabled;
    document.getElementById('soundBtn').textContent = Sound.enabled ? 'Sound: ON' : 'Sound: OFF';
    dropdownMenu.classList.add('hidden');
  });

  // === Help Modal ===
  let helpModalOpen = false;

  function createHelpModal() {
    const modal = document.createElement('div');
    modal.id = 'helpModal';
    modal.className = 'hidden';
    modal.innerHTML = `
      <div class="help-panel">
        <div class="help-header">
          <h1>CONTROLS & HOW TO PLAY</h1>
          <span class="help-hint">Press <span class="help-key">H</span> or <span class="help-key">Esc</span> to close</span>
          <button id="helpCloseBtn" class="help-close" title="Close">×</button>
        </div>
        <div class="help-body">
          <nav class="help-nav" role="tablist">
            <button class="help-nav-btn active" data-tab="controls" role="tab">Controls</button>
            <button class="help-nav-btn" data-tab="gameplay" role="tab">Gameplay</button>
            <button class="help-nav-btn" data-tab="ui" role="tab">UI Guide</button>
            <button class="help-nav-btn" data-tab="quickstart" role="tab">Quick Start</button>
          </nav>
          <div class="help-content">
            <div class="help-panel-content active" id="tab-controls" role="tabpanel">
              <h3>Mouse Controls</h3>
              <div class="help-row"><span class="help-key">LMB Click</span><span>Select unit / Click button</span></div>
              <div class="help-row"><span class="help-key">LMB Drag</span><span>Box select multiple units</span></div>
              <div class="help-row"><span class="help-key">RMB Click</span><span>Move selected units / Attack enemy</span></div>
              <div class="help-row"><span class="help-key">Mouse Wheel</span><span>Zoom camera in/out</span></div>
              <h3>Keyboard Shortcuts</h3>
              <div class="help-row"><span class="help-key">W / S / A / D</span><span>Move camera</span></div>
              <div class="help-row"><span class="help-key">F</span><span>Focus camera on HQ</span></div>
              <div class="help-row"><span class="help-key">Ctrl+A</span><span>Select all player units</span></div>
              <div class="help-row"><span class="help-key">Escape</span><span>Deselect / Close menus</span></div>
              <div class="help-row"><span class="help-key">H</span><span>Toggle this help menu</span></div>
              <div class="help-row"><span class="help-key">1-9</span><span>Quick-build unit</span></div>
              <div class="help-row"><span class="help-key">F1-F4</span><span>Set formation</span></div>
            </div>
            <div class="help-panel-content" id="tab-gameplay" role="tabpanel" hidden>
              <h3>Core Mechanics</h3>
              <div class="help-row"><span class="help-key">Build Units</span><span>Click unit buttons in Armory (bottom). Units spawn near your HQ.</span></div>
              <div class="help-row"><span class="help-key">Capture Bases</span><span>Move units to enemy bases. When HP reaches 0, base switches to your faction.</span></div>
              <div class="help-row"><span class="help-key">Formations</span><span>Select 2+ units, tap a formation button for an explanation, then move to send each unit to its own slot.</span></div>
              <div class="help-row"><span class="help-key">Upgrades</span><span>Buy upgrades in Armory to permanently buff all player units.</span></div>
              <div class="help-row"><span class="help-key">Income</span><span>Earn passive income per owned base.</span></div>
            </div>
            <div class="help-panel-content" id="tab-ui" role="tabpanel" hidden>
              <h3>UI Elements</h3>
              <div class="help-row"><span class="help-key">Top Bar</span><span>Money, Bases, Units, Enemy count, and action buttons</span></div>
              <div class="help-row"><span class="help-key">Armory (bottom)</span><span>Build units and buy upgrades with hotkeys 1-9</span></div>
              <div class="help-row"><span class="help-key">Selection (left)</span><span>Shows selected unit portraits, types, combined stats</span></div>
              <div class="help-row"><span class="help-key">Formations</span><span>Line = wide fire, Wedge = push, Square = compact hold, Column = chokepoints.</span></div>
            </div>
            <div class="help-panel-content" id="tab-quickstart" role="tabpanel" hidden>
              <h3>Quick Start</h3>
              <ol class="quickstart-steps">
                <li><span class="step-num">1</span><div><strong>Build an army</strong> — Click <span class="help-key">TANK</span> / <span class="help-key">INFANTRY</span> in Armory (or press <span class="help-key">1</span> / <span class="help-key">2</span>).</div></li>
                <li><span class="step-num">2</span><div><strong>Select units</strong> — Click a unit, or drag a box. Press <span class="help-key">Ctrl+A</span> for all.</div></li>
                <li><span class="step-num">3</span><div><strong>Move & Attack</strong> — Right-click to move, right-click enemy to attack.</div></li>
                <li><span class="step-num">4</span><div><strong>Capture bases</strong> — Move units onto enemy bases to capture them.</div></li>
                <li><span class="step-num">5</span><div><strong>Win</strong> — Capture all enemy bases.</div></li>
              </ol>
            </div>
          </div>
        </div>
        <div class="help-footer">Press <span class="help-key">H</span> or <span class="help-key">Esc</span> or click outside to close</div>
      </div>
    `;
    document.body.appendChild(modal);

    const navBtns = modal.querySelectorAll('.help-nav-btn');
    const panels = modal.querySelectorAll('.help-panel-content');
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        navBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        panels.forEach(p => { p.classList.remove('active'); p.hidden = true; });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const panel = modal.querySelector('#tab-' + btn.dataset.tab);
        panel.classList.add('active');
        panel.hidden = false;
      });
    });

    modal.addEventListener('click', e => {
      if (e.target === modal) toggleHelpModal(false);
    });
    document.getElementById('helpCloseBtn').addEventListener('click', () => toggleHelpModal(false));
  }

  function toggleHelpModal(open) {
    const modal = document.getElementById('helpModal');
    if (open) {
      modal.classList.remove('hidden');
      helpModalOpen = true;
      game.paused = true;
    } else {
      modal.classList.add('hidden');
      helpModalOpen = false;
      game.paused = false;
    }
  }

  createHelpModal();
  document.getElementById('helpBtn').addEventListener('click', () => toggleHelpModal(true));
  document.getElementById('settingsBtn').addEventListener('click', () => toggleSettings(true));

  // === Hotkeys (single listener, no duplicates) ===
  window.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

    if (e.key === 'h' || e.key === 'H') {
      toggleHelpModal(!helpModalOpen);
      return;
    }
    if (e.key === 'Escape') {
      if (helpModalOpen) { toggleHelpModal(false); return; }
      for (const u of game.selectedUnits) u.setSelected(false);
      game.selectedUnits = [];
      game.selectedBuilding = null;
      return;
    }
    if (e.key === 'f' || e.key === 'F') {
      if (e.ctrlKey || e.metaKey) return;
      const hq = game.bases.find(b => b.faction === 'player');
      if (hq) {
        game.cameraTarget.x = hq.mesh.position.x;
        game.cameraTarget.z = hq.mesh.position.z;
      }
      return;
    }
    if ((e.key === 'a' || e.key === 'A') && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      const aliveUnits = game.playerUnits.filter(u => u.alive);
      if (aliveUnits.length > 0) {
        for (const u of game.selectedUnits) u.setSelected(false);
        game.selectedUnits = aliveUnits;
        for (const u of game.selectedUnits) u.setSelected(true);
        game.flashMessage(`Selected ${aliveUnits.length} units`);
      }
      return;
    }
    if (e.key === 'F1') { e.preventDefault(); setFormation('line'); return; }
    if (e.key === 'F2') { e.preventDefault(); setFormation('wedge'); return; }
    if (e.key === 'F3') { e.preventDefault(); setFormation('square'); return; }
    if (e.key === 'F4') { e.preventDefault(); setFormation('column'); return; }
  });

  // === Affordability Check (200ms) ===
  setInterval(() => {
    const selectedBuilding = game.selectedBuilding;

    document.querySelectorAll('.unitBtn[data-unit-type]').forEach(b => {
      const key = b.dataset.unitType;
      const cost = UNIT_TYPES[key].cost;
      const canAfford = game.money >= cost;

      let isContextDisabled = false;
      if (selectedBuilding) {
        const domain = UNIT_TYPES[key].domain;
        if (selectedBuilding.faction !== 'player') {
          isContextDisabled = true;
        } else if (selectedBuilding.isShipyard) {
          isContextDisabled = (domain !== 'sea' && domain !== 'air');
        } else {
          isContextDisabled = (domain !== 'land' && domain !== 'air');
        }
      }

      b.classList.toggle('affordable', canAfford && !isContextDisabled);
      b.classList.toggle('unaffordable', !canAfford && !isContextDisabled);
      b.classList.toggle('context-disabled', isContextDisabled);
      b.disabled = !canAfford || isContextDisabled;
    });

    // Update HUD stats
    const moneyEl = document.getElementById('money');
    const basesOwnedEl = document.getElementById('basesOwned');
    const basesTotalEl = document.getElementById('basesTotal');
    const unitCountEl = document.getElementById('unitCount');
    const enemyCountEl = document.getElementById('enemyCount');
    if (moneyEl) moneyEl.textContent = Math.floor(game.money);
    if (basesOwnedEl) basesOwnedEl.textContent = game.bases.filter(b => b.faction === 'player').length;
    if (basesTotalEl) basesTotalEl.textContent = game.bases.length;
    if (unitCountEl) unitCountEl.textContent = game.playerUnits.filter(u => u.alive).length;
    if (enemyCountEl) enemyCountEl.textContent = game.enemyUnits.filter(u => u.alive).length;

    // Upgrade buttons affordability
    document.querySelectorAll('.upgradeBtn').forEach(btn => {
      const stat = btn.dataset.stat;
      if (stat) {
        const cost = game.upgrades.nextCost(stat);
        btn.disabled = cost === null || game.money < cost;
      }
    });
  }, 200);

  // === First-Launch Tutorial ===
  initTutorial();

  function initTutorial() {
    const completed = localStorage.getItem('tutorialCompleted');
    if (completed === 'true') return;
    setTimeout(() => showTutorialStep(1), 500);
  }

  const tutorialSteps = [
    { title: 'Welcome to Low-Poly Command!', text: 'This tutorial will walk you through the basics. Click "Next" or "Skip" to begin.', highlight: null },
    { title: 'Step 1: Build Your Army', text: 'Click <strong>TANK</strong> or <strong>INFANTRY</strong> in the Armory (bottom) to build units. Press <span class="help-key">1</span> or <span class="help-key">2</span> as hotkeys.', highlight: '#armoryPanel' },
    { title: 'Step 2: Select Units', text: 'Click a unit or drag a box to select. Press <span class="help-key">Ctrl+A</span> for all. Selected units appear in the Selection panel.', highlight: '#selectionPanel' },
    { title: 'Step 3: Move & Attack', text: 'Right-click or long-press to move/attack. Select 2+ units and tap a formation button to see what Line, Wedge, Square, or Column does.', highlight: '#selectionPanel .formation-options' },
    { title: 'Step 4: Capture Bases', text: 'Move units onto enemy bases to capture them. Earn income per base. Capture all to win!', highlight: null },
    { title: 'Step 5: Win the Game!', text: 'Destroy all enemy bases. Press <span class="help-key">H</span> for help anytime. Good luck, Commander!', highlight: null },
  ];

  let tutorialOverlay = null;
  let tutorialHighlight = null;

  function showTutorialStep(stepIndex) {
    const step = tutorialSteps[stepIndex - 1];
    if (tutorialOverlay) tutorialOverlay.remove();
    if (tutorialHighlight) tutorialHighlight.remove();

    if (step.highlight) {
      const target = document.querySelector(step.highlight);
      if (target) {
        tutorialHighlight = document.createElement('div');
        tutorialHighlight.className = 'tutorial-highlight';
        const rect = target.getBoundingClientRect();
        tutorialHighlight.style.cssText = `position:fixed;left:${rect.left - 4}px;top:${rect.top - 4}px;width:${rect.width + 8}px;height:${rect.height + 8}px;border:3px solid var(--primary);border-radius:8px;pointer-events:none;z-index:1000;`;
        document.body.appendChild(tutorialHighlight);
      }
    }

    tutorialOverlay = document.createElement('div');
    tutorialOverlay.className = 'tutorial-overlay';
    tutorialOverlay.innerHTML = `
      <div class="tutorial-card">
        <div class="tutorial-header">
          <span class="tutorial-step">${stepIndex} / ${tutorialSteps.length}</span>
          <button class="tutorial-skip">Skip</button>
        </div>
        <h2>${step.title}</h2>
        <p>${step.text}</p>
        <div class="tutorial-footer">
          ${stepIndex > 1 ? '<button class="tutorial-btn tutorial-prev">Back</button>' : '<div></div>'}
          <div style="flex:1;"></div>
          ${stepIndex < tutorialSteps.length ? '<button class="tutorial-btn tutorial-next">Next</button>' : '<button class="tutorial-btn tutorial-finish">Start Playing!</button>'}
        </div>
      </div>
    `;
    document.body.appendChild(tutorialOverlay);

    tutorialOverlay.querySelector('.tutorial-next')?.addEventListener('click', () => showTutorialStep(stepIndex + 1));
    tutorialOverlay.querySelector('.tutorial-prev')?.addEventListener('click', () => showTutorialStep(stepIndex - 1));
    tutorialOverlay.querySelector('.tutorial-finish')?.addEventListener('click', completeTutorial);
    tutorialOverlay.querySelector('.tutorial-skip')?.addEventListener('click', completeTutorial);
  }

  function completeTutorial() {
    localStorage.setItem('tutorialCompleted', 'true');
    if (tutorialOverlay) tutorialOverlay.remove();
    if (tutorialHighlight) tutorialHighlight.remove();
    game.flashMessage('Tutorial complete! Press H for help anytime.');
  }

  // === Restart ===
  document.getElementById('restartBtn').addEventListener('click', () => {
    deleteSave();
    location.reload();
  });

  // === SETTINGS MODAL ===
  function saveSettings() {
    const s = {
      shadows: settingsState.shadows,
      fogOfWar: settingsState.fogOfWar,
      particleDensity: settingsState.particleDensity,
      masterVolume: settingsState.masterVolume,
      qualityPreset: settingsState.qualityPreset,
    };
    try { localStorage.setItem('perftab_settings', JSON.stringify(s)); } catch(e) {}
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem('perftab_settings');
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return null;
  }

  const settingsState = {
    shadows: true,
    fogOfWar: true,
    particleDensity: 'medium',
    masterVolume: 30,
    qualityPreset: 'medium',
  };

  // Load saved settings
  const savedSettings = loadSettings();
  if (savedSettings) {
    Object.assign(settingsState, savedSettings);
  }

  function applySettings() {
    const preset = QUALITY_PRESETS[settingsState.qualityPreset] || QUALITY_PRESETS.medium;

    // Apply quality preset to renderer
    if (game && game.scene && game.scene.userData && game.scene.userData.renderer) {
      const r = game.scene.userData.renderer;
      r.shadowMap.enabled = preset.shadows && settingsState.shadows;
      r.setPixelRatio(Math.min(window.devicePixelRatio, preset.pixelRatio));

      // Shadow map size
      const mapSize = preset.shadowSize;
      const sunLight = game.scene.userData.sun;
      if (sunLight && sunLight.shadow && sunLight.shadow.mapSize) {
        sunLight.shadow.mapSize.set(mapSize, mapSize);
      }
    }

    if (game && game.fog && game.fog.mesh) {
      game.fog.mesh.visible = preset.fogOfWar && settingsState.fogOfWar;
    }

    const densityMult = preset.particleDensity === 'low' ? 0.25 : preset.particleDensity === 'medium' ? 0.5 : 1.0;
    if (window.__PARTICLE_DENSITY !== undefined) {
      window.__PARTICLE_DENSITY = densityMult;
    }

    if (Sound && Sound.master) {
      Sound.master.gain.value = settingsState.masterVolume / 100;
      Sound.masterVolume = settingsState.masterVolume / 100;
    }

    // Update the active preset globally so all systems can read it
    setActivePreset(settingsState.qualityPreset);

    saveSettings();
  }

  window.__applySettings = applySettings;

  function createSettingsModal() {
    const modal = document.createElement('div');
    modal.id = 'settingsModal';
    modal.className = 'hidden';

    const densityLabel = { low: 'Low', medium: 'Medium', high: 'High' };

    modal.innerHTML = `
      <div class="settings-panel">
        <div class="settings-header">
          <h1>⚙ SETTINGS</h1>
          <button id="settingsCloseBtn" class="settings-close" title="Close">×</button>
        </div>
        <div class="settings-body">
          <div class="settings-row">
            <div>
              <div class="settings-label">Shadows</div>
              <div class="settings-desc">Requires restart to take full effect</div>
            </div>
            <div class="settings-control">
              <button id="settingsShadows" class="toggle-switch ${settingsState.shadows ? 'on' : ''}"></button>
            </div>
          </div>
          <div class="settings-row">
            <div>
              <div class="settings-label">Fog of War</div>
              <div class="settings-desc">Hide unexplored areas</div>
            </div>
            <div class="settings-control">
              <button id="settingsFog" class="toggle-switch ${settingsState.fogOfWar ? 'on' : ''}"></button>
            </div>
          </div>
          <div class="settings-row">
            <div>
              <div class="settings-label">Particle Density</div>
              <div class="settings-desc">Explosion &amp; trail detail</div>
            </div>
            <div class="settings-control">
              <select id="settingsParticles" class="settings-select">
                <option value="low" ${settingsState.particleDensity === 'low' ? 'selected' : ''}>Low</option>
                <option value="medium" ${settingsState.particleDensity === 'medium' ? 'selected' : ''}>Medium</option>
                <option value="high" ${settingsState.particleDensity === 'high' ? 'selected' : ''}>High</option>
              </select>
            </div>
          </div>
          <div class="settings-row">
            <div>
              <div class="settings-label">Master Volume</div>
              <div class="settings-desc">0% — 100%</div>
            </div>
            <div class="settings-control">
              <input type="range" id="settingsVolume" class="settings-slider" min="0" max="100" value="${settingsState.masterVolume}">
              <span id="settingsVolumeValue" class="settings-value">${settingsState.masterVolume}</span>
            </div>
          </div>
          <div class="settings-row">
            <div>
              <div class="settings-label">Quality Preset</div>
              <div class="settings-desc">Adjusts rendering for performance or visual quality</div>
            </div>
            <div class="settings-control">
              <div class="preset-chips" id="qualityPresetChips">
                <button class="preset-chip ${settingsState.qualityPreset === 'ultraLow' ? 'active' : ''}" data-preset="ultraLow">ULTRA LOW</button>
                <button class="preset-chip ${settingsState.qualityPreset === 'low' ? 'active' : ''}" data-preset="low">LOW</button>
                <button class="preset-chip ${settingsState.qualityPreset === 'medium' ? 'active' : ''}" data-preset="medium">MEDIUM</button>
                <button class="preset-chip ${settingsState.qualityPreset === 'high' ? 'active' : ''}" data-preset="high">HIGH</button>
                <button class="preset-chip ${settingsState.qualityPreset === 'ultra' ? 'active' : ''}" data-preset="ultra">ULTRA</button>
              </div>
            </div>
          </div>
        </div>
        <div class="settings-footer">
          <button id="settingsRunTestsBtn" class="btn btn-green">Run Tests</button>
          <button id="settingsDefaultsBtn" class="btn btn-amber">Reset to Defaults</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event handlers
    document.getElementById('settingsCloseBtn').addEventListener('click', () => toggleSettings(false));
    modal.addEventListener('click', e => { if (e.target === modal) toggleSettings(false); });

    document.getElementById('settingsShadows').addEventListener('click', function() {
      settingsState.shadows = !settingsState.shadows;
      this.classList.toggle('on', settingsState.shadows);
      applySettings();
      game.flashMessage(`Shadows: ${settingsState.shadows ? 'ON' : 'OFF'}`);
    });

    document.getElementById('settingsFog').addEventListener('click', function() {
      settingsState.fogOfWar = !settingsState.fogOfWar;
      this.classList.toggle('on', settingsState.fogOfWar);
      applySettings();
      game.flashMessage(`Fog of War: ${settingsState.fogOfWar ? 'ON' : 'OFF'}`);
    });

    document.getElementById('settingsParticles').addEventListener('change', function() {
      settingsState.particleDensity = this.value;
      applySettings();
      game.flashMessage(`Particle Density: ${densityLabel[this.value]}`);
    });

    const volumeSlider = document.getElementById('settingsVolume');
    const volumeValue = document.getElementById('settingsVolumeValue');
    volumeSlider.addEventListener('input', function() {
      settingsState.masterVolume = parseInt(this.value);
      volumeValue.textContent = this.value;
      applySettings();
    });

    // Quality preset chips
    document.getElementById('qualityPresetChips').addEventListener('click', (e) => {
      const chip = e.target.closest('.preset-chip');
      if (!chip) return;
      const preset = chip.dataset.preset;
      settingsState.qualityPreset = preset;
      // Sync shadows/fog/particles from preset for consistency
      const p = QUALITY_PRESETS[preset];
      settingsState.shadows = p.shadows;
      settingsState.fogOfWar = p.fogOfWar;
      settingsState.particleDensity = p.particleDensity;
      // Update individual toggle UIs
      document.getElementById('settingsShadows').classList.toggle('on', settingsState.shadows);
      document.getElementById('settingsFog').classList.toggle('on', settingsState.fogOfWar);
      document.getElementById('settingsParticles').value = settingsState.particleDensity;
      // Update active chip
      document.querySelectorAll('#qualityPresetChips .preset-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      applySettings();
      game.flashMessage(`Quality: ${QUALITY_PRESETS[preset].label}`);
    });

    document.getElementById('settingsDefaultsBtn').addEventListener('click', function() {
      settingsState.shadows = true;
      settingsState.fogOfWar = true;
      settingsState.particleDensity = 'medium';
      settingsState.masterVolume = 30;
      settingsState.qualityPreset = 'medium';
      document.getElementById('settingsShadows').classList.toggle('on', true);
      document.getElementById('settingsFog').classList.toggle('on', true);
      document.getElementById('settingsParticles').value = 'medium';
      volumeSlider.value = '30';
      volumeValue.textContent = '30';
      document.querySelectorAll('#qualityPresetChips .preset-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.preset === 'medium');
      });
      applySettings();
      game.flashMessage('Settings reset to defaults');
    });

    // === Run Tests button ===
    document.getElementById('settingsRunTestsBtn').addEventListener('click', function() {
      runGameTests();
    });
  }

  function toggleSettings(open) {
    const modal = document.getElementById('settingsModal');
    if (open) {
      modal.classList.remove('hidden');
      game.paused = true;
    } else {
      modal.classList.add('hidden');
      game.paused = false;
    }
  }

  // === In-Browser Test Runner ===
  function runGameTests() {
    const results = [];
    let passed = 0, failed = 0;

    function test(name, fn) {
      try {
        const result = fn();
        if (result === false) {
          results.push({ name, ok: false, err: 'returned false' });
          failed++;
        } else {
          results.push({ name, ok: true });
          passed++;
        }
      } catch (e) {
        results.push({ name, ok: false, err: e.message || String(e) });
        failed++;
      }
    }

    // ── DOM Elements ──
    test('DOM: #armoryPanel exists', () => !!document.getElementById('armoryPanel'));
    test('DOM: #selectionPanel exists', () => !!document.getElementById('selectionPanel'));
    test('DOM: #topBar exists', () => !!document.getElementById('topBar'));
    test('DOM: #settingsModal exists', () => !!document.getElementById('settingsModal'));
    test('DOM: #helpModal exists', () => !!document.getElementById('helpModal'));
    test('DOM: #selectionBox exists', () => !!document.getElementById('selectionBox'));
    test('DOM: #money display exists', () => !!document.getElementById('money'));
    test('DOM: #basesOwned display exists', () => !!document.getElementById('basesOwned'));
    test('DOM: #unitCount display exists', () => !!document.getElementById('unitCount'));
    test('DOM: Formation buttons exist', () => document.querySelectorAll('.formation-btn').length >= 4);
    test('DOM: Unit buttons exist', () => document.querySelectorAll('.unitBtn').length > 0);
    test('DOM: Tab buttons exist', () => document.querySelectorAll('.tab-btn').length >= 3);

    // ── Game Systems ──
    test('Game: pathfinder initialized', () => !!game.pathfinder);
    test('Game: pathfinder has grid', () => !!game.pathfinder.grid || !!game.pathfinder.terrainGrid);
    test('Game: terrain system exists', () => !!game.terrain);
    test('Game: scene exists', () => !!game.scene);
    test('Game: camera exists', () => !!game.camera);
    test('Game: playerUnits is array', () => Array.isArray(game.playerUnits));
    test('Game: enemyUnits is array', () => Array.isArray(game.enemyUnits));
    test('Game: bases is array', () => Array.isArray(game.bases));
    test('Game: selectedUnits is array', () => Array.isArray(game.selectedUnits));
    test('Game: projectiles is array', () => Array.isArray(game.projectiles));

    // ── Config / Unit Types ──
    test('Config: UNIT_TYPES infantry exists', () => !!UNIT_TYPES.infantry);
    test('Config: UNIT_TYPES tank exists', () => !!UNIT_TYPES.tank);
    test('Config: UNIT_TYPES transport exists', () => !!UNIT_TYPES.transport);
    test('Config: UNIT_TYPES destroyer exists', () => !!UNIT_TYPES.destroyer);
    test('Config: UNIT_TYPES fighter exists', () => !!UNIT_TYPES.fighter);
    test('Config: Transport capacity is 10', () => (UNIT_TYPES.transport && UNIT_TYPES.transport.transportCapacity) === 10);
    test('Config: All land units have range', () => ['infantry','tank','artillery'].every(t => UNIT_TYPES[t] && UNIT_TYPES[t].range > 0));
    test('Config: All units have hp > 0', () => Object.values(UNIT_TYPES).every(u => u.hp > 0));
    test('Config: All units have speed >= 0', () => Object.values(UNIT_TYPES).every(u => u.speed >= 0));
    test('Config: Combat units have damage', () => Object.values(UNIT_TYPES).filter(u => !u.nonCombatant && !u.healer && !u.escortBomber && u.damage !== undefined).every(u => u.damage > 0));

    // ── Pathfinder ──
    test('Pathfinder: findPath is function', () => typeof game.pathfinder.findPath === 'function');
    test('Pathfinder: worldToGrid is function', () => typeof game.pathfinder.worldToGrid === 'function');
    test('Pathfinder: gridToWorld is function', () => typeof game.pathfinder.gridToWorld === 'function');
    test('Pathfinder: findNearestWalkable is function', () => typeof game.pathfinder.findNearestWalkable === 'function');

    // ── Unit Methods ──
    test('Unit: moveTo is function', () => {
      const u = game.playerUnits[0] || game.enemyUnits[0];
      return u ? typeof u.moveTo === 'function' : true; // skip if no units
    });
    test('Unit: update is function', () => {
      const u = game.playerUnits[0] || game.enemyUnits[0];
      return u ? typeof u.update === 'function' : true;
    });
    test('Unit: attack is function', () => {
      const u = game.playerUnits[0] || game.enemyUnits[0];
      return u ? typeof u.attack === 'function' : true;
    });

    // ── Game Methods ──
    test('Game: computeFormation is function', () => typeof game.computeFormation === 'function');
    test('Game: assignFormationMoveTargets is function', () => typeof game.assignFormationMoveTargets === 'function');
    test('Game: flashMessage is function', () => typeof game.flashMessage === 'function');
    test('Game: createBases is function', () => typeof game.createBases === 'function');
    test('Game: update is function', () => typeof game.update === 'function');

    // ── Pathfinder Integration ──
    test('Pathfinder: land path findable', () => {
      if (!game.pathfinder || !game.bases || game.bases.length < 2) return true;
      const b1 = game.bases[0];
      const b2 = game.bases.find(b => b !== b1 && b.alive);
      if (!b2) return true;
      const p = game.pathfinder.findPath(b1.mesh.position, b2.mesh.position, 'land');
      return Array.isArray(p);
    });

    // ── Formation Computation ──
    test('Formation: computeFormation returns array', () => {
      if (!game.computeFormation) return true;
      const pos = new THREE.Vector3(0, 0, 0);
      const result = game.computeFormation(pos, 4, 'line');
      return Array.isArray(result);
    });
    test('Formation: computeFormation correct count', () => {
      if (!game.computeFormation) return true;
      const pos = new THREE.Vector3(0, 0, 0);
      const result = game.computeFormation(pos, 6, 'square');
      return result.length === 6;
    });

    // ── UI Functions ──
    test('UI: flashMessage callable', () => typeof flashMessage === 'function');
    test('UI: toggleSettings callable', () => typeof toggleSettings === 'function');

    // ── Button Event Handlers ──
    test('Buttons: settings button clickable', () => {
      const btn = document.querySelector('[id*="settings"]') || document.querySelector('.topBtn');
      return !!btn;
    });

    // ── Build results panel ──
    let existing = document.getElementById('testResultsPanel');
    if (existing) existing.remove();

    const panel = document.createElement('div');
    panel.id = 'testResultsPanel';
    panel.className = 'test-results-panel';

    const total = passed + failed;
    const summaryClass = failed === 0 ? 'test-summary pass' : 'test-summary fail';

    let html = `
      <div class="test-results-header">
        <h2>Test Results</h2>
        <button id="testResultsClose" class="settings-close" title="Close">×</button>
      </div>
      <div class="${summaryClass}">
        <span class="test-count">${passed}/${total} passed</span>
        ${failed > 0 ? `<span class="test-failed-count">${failed} failed</span>` : '<span class="test-all-pass">ALL PASS</span>'}
      </div>
      <div class="test-results-list">
    `;

    for (const r of results) {
      const icon = r.ok ? '✓' : '✗';
      const cls = r.ok ? 'test-pass' : 'test-fail';
      html += `<div class="test-row ${cls}"><span class="test-icon">${icon}</span><span class="test-name">${r.name}</span>`;
      if (r.err) html += `<span class="test-err">${r.err}</span>`;
      html += `</div>`;
    }

    html += `</div>`;
    panel.innerHTML = html;

    const settingsModal = document.getElementById('settingsModal');
    settingsModal.appendChild(panel);

    document.getElementById('testResultsClose').addEventListener('click', () => panel.remove());

    game.flashMessage(`Tests: ${passed}/${total} passed${failed > 0 ? `, ${failed} FAILED` : ''}`);
  }

  createSettingsModal();

  // Apply settings on first init
  applySettings();

  console.log('UI initialized');
}
