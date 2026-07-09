// ui.js — Modern UI with bottom dock layout and glassmorphism
import * as THREE from 'three';
import { UNIT_TYPES, UPGRADES } from './config.js?v=4';
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

// Update selection panel UI
function updateSelectionUI(game, selectionInfo) {
  if (game.selectedUnits.length === 0) {
    selectionInfo.innerHTML = `
      <div style="color:var(--text-muted);text-align:center;padding:20px;">
        Click or drag to select units
      </div>
    `;
    return;
  }

  const counts = {};
  game.selectedUnits.forEach(u => {
    counts[u.type] = (counts[u.type] || 0) + 1;
  });

  let html = '';
  for (const [type, count] of Object.entries(counts)) {
    const stats = UNIT_TYPES[type];
    const iconDataUrl = generateUnitIcon(type, stats.color);

    let typeHp = 0, typeDmg = 0, typeRange = 0;
    game.selectedUnits.forEach(u => {
      if (u.type === type) {
        typeHp += u.hp;
        typeDmg += u.stats.damage;
        typeRange = Math.max(typeRange, u.stats.range);
      }
    });

    const avgHp = Math.round(typeHp / count);

    html += `
      <div class="selection-item">
        <img class="selection-icon" src="${iconDataUrl}" alt="${type}">
        <div style="flex:1;">
          <div class="selection-type">${type}</div>
          <div class="selection-stats">HP: ${avgHp} | DMG: ${Math.round(typeDmg / count)} | RNG: ${typeRange}</div>
        </div>
        <div class="selection-count">x${count}</div>
      </div>
    `;
  }

  const hasTransport = game.selectedUnits.some(u => u.isTransport && u.alive);
  if (hasTransport) {
    const transport = game.selectedUnits.find(u => u.isTransport);
    const nearbyLand = game.playerUnits.filter(u =>
      u.alive && u.domain === 'land' && !u.carried && transport.canLoadUnit(u)
    );
    const canLoad = nearbyLand.length > 0;
    const canUnload = transport.carriedUnits.length > 0;

    html += `
      <div class="transport-actions">
        <button class="action-btn" id="loadBtn" ${canLoad ? '' : 'disabled'}>
          Load${canLoad ? '' : ' (no units)'}
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
      updateSelectionUI(game, selectionInfo);
    });
  }

  const unloadBtn = document.getElementById('unloadBtn');
  if (unloadBtn) {
    unloadBtn.addEventListener('click', () => {
      const t = game.selectedUnits.find(u => u.isTransport);
      if (t) t.unloadAll();
      updateSelectionUI(game, selectionInfo);
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
        Click or drag to select units
      </div>
    </div>
    <div class="formation-options">
      <button class="formation-btn active" data-formation="line" title="Line (F1)">
        <svg viewBox="0 0 24 24"><rect x="2" y="10" width="20" height="4" rx="1"/></svg>
      </button>
      <button class="formation-btn" data-formation="wedge" title="Wedge (F2)">
        <svg viewBox="0 0 24 24"><path d="M12 2 L22 20 L2 20 Z"/></svg>
      </button>
      <button class="formation-btn" data-formation="square" title="Square (F3)">
        <svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
      </button>
      <button class="formation-btn" data-formation="column" title="Column (F4)">
        <svg viewBox="0 0 24 24"><rect x="10" y="2" width="4" height="20" rx="1"/></svg>
      </button>
    </div>
  `;
  document.body.appendChild(selectionPanel);

  const selectionInfo = document.getElementById('selectionInfo');
  game.updateSelectionUI = () => updateSelectionUI(game, selectionInfo);

  const formationBtns = selectionPanel.querySelectorAll('.formation-btn');
  function setFormation(formation) {
    game.formation = formation;
    formationBtns.forEach(b => b.classList.toggle('active', b.dataset.formation === formation));
  }
  formationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setFormation(btn.dataset.formation);
      game.flashMessage(`Formation: ${btn.dataset.formation}`);
    });
  });

  document.getElementById('selectAllBtn').addEventListener('click', () => {
    const aliveUnits = game.playerUnits.filter(u => u.alive);
    if (aliveUnits.length === 0) { game.flashMessage('No units to select'); return; }
    for (const u of game.selectedUnits) u.setSelected(false);
    game.selectedUnits = aliveUnits;
    for (const u of game.selectedUnits) u.setSelected(true);
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
              <div class="help-row"><span class="help-key">Formations</span><span>Select units, choose formation (F1-F4), right-click to move in formation.</span></div>
              <div class="help-row"><span class="help-key">Upgrades</span><span>Buy upgrades in Armory to permanently buff all player units.</span></div>
              <div class="help-row"><span class="help-key">Income</span><span>Earn passive income per owned base.</span></div>
            </div>
            <div class="help-panel-content" id="tab-ui" role="tabpanel" hidden>
              <h3>UI Elements</h3>
              <div class="help-row"><span class="help-key">Top Bar</span><span>Money, Bases, Units, Enemy count, and action buttons</span></div>
              <div class="help-row"><span class="help-key">Armory (bottom)</span><span>Build units and buy upgrades with hotkeys 1-9</span></div>
              <div class="help-row"><span class="help-key">Selection (left)</span><span>Shows selected unit portraits, types, combined stats</span></div>
              <div class="help-row"><span class="help-key">Formations</span><span>Visual buttons in Selection panel for Line/Wedge/Square/Column</span></div>
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
    if (e.key === 'F1') { setFormation('line'); game.flashMessage('Formation: Line'); return; }
    if (e.key === 'F2') { setFormation('wedge'); game.flashMessage('Formation: Wedge'); return; }
    if (e.key === 'F3') { setFormation('square'); game.flashMessage('Formation: Square'); return; }
    if (e.key === 'F4') { setFormation('column'); game.flashMessage('Formation: Column'); return; }
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
    { title: 'Step 3: Move & Attack', text: 'Right-click to move. Right-click enemy to attack. Use <span class="help-key">F1-F4</span> for formations.', highlight: '#selectionPanel .formation-options' },
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
  };

  // Load saved settings
  const savedSettings = loadSettings();
  if (savedSettings) {
    Object.assign(settingsState, savedSettings);
  }

  function applySettings() {
    if (game && game.scene && game.scene.userData && game.scene.userData.renderer) {
      game.scene.userData.renderer.shadowMap.enabled = settingsState.shadows;
    }
    if (game && game.fog && game.fog.mesh) {
      game.fog.mesh.visible = settingsState.fogOfWar;
    }
    const densityMult = settingsState.particleDensity === 'low' ? 0.25 : settingsState.particleDensity === 'medium' ? 0.5 : 1.0;
    if (window.__PARTICLE_DENSITY !== undefined) {
      window.__PARTICLE_DENSITY = densityMult;
    }
    if (Sound && Sound.master) {
      Sound.master.gain.value = settingsState.masterVolume / 100;
      Sound.masterVolume = settingsState.masterVolume / 100;
    }
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
        </div>
        <div class="settings-footer">
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

    document.getElementById('settingsDefaultsBtn').addEventListener('click', function() {
      settingsState.shadows = true;
      settingsState.fogOfWar = true;
      settingsState.particleDensity = 'medium';
      settingsState.masterVolume = 30;
      document.getElementById('settingsShadows').classList.toggle('on', true);
      document.getElementById('settingsFog').classList.toggle('on', true);
      document.getElementById('settingsParticles').value = 'medium';
      volumeSlider.value = '30';
      volumeValue.textContent = '30';
      applySettings();
      game.flashMessage('Settings reset to defaults');
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

  createSettingsModal();

  // Apply settings on first init
  applySettings();

  console.log('UI initialized');
}
