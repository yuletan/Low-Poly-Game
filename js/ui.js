// ui.js — Binds HTML overlay controls to the game.
import { UNIT_TYPES, UPGRADES } from './config.js?v=4';
import { Sound } from './sound.js';
import { saveGame, loadSaveData, deleteSave, hasSave } from './saveLoad.js';

// Generate unit icon as data URL using canvas 2D
function generateUnitIcon(type, color, size = 48) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  
  // RoundRect polyfill
  function roundRect(ctx, x, y, w, h, r) {
    const rad = Math.min(r, w/2, h/2);
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
    case 'mlrs':
      roundRect(ctx, cx - s, cy - s * 0.7, s * 2, s * 1.4, 2);
      ctx.moveTo(cx - s * 0.6, cy - s * 0.4);
      ctx.lineTo(cx + s * 0.6, cy - s * 0.4);
      ctx.lineTo(cx + s * 0.4, cy - s * 1);
      ctx.lineTo(cx - s * 0.4, cy - s * 1);
      ctx.closePath();
      break;
  }
  ctx.fill();
  ctx.stroke();
  
  return canvas.toDataURL('image/png');
}

// Create tooltip element
function createTooltip(content) {
  const tip = document.createElement('div');
  tip.className = 'unit-tooltip';
  tip.innerHTML = content;
  document.body.appendChild(tip);
  return tip;
}

export function initUI(game) {
  // === Build menu (Armory) ===
  const buildDiv = document.getElementById('buildButtons');
  buildDiv.innerHTML = '';
  
  const unitKeys = Object.keys(UNIT_TYPES);
  unitKeys.forEach((key, index) => {
    const stats = UNIT_TYPES[key];
    const hotkey = index + 1; // 1-9
    const iconDataUrl = generateUnitIcon(key, stats.color);
    
    const b = document.createElement('button');
    b.className = 'unitBtn';
    b.dataset.unitType = key;
    b.dataset.hotkey = hotkey;
    b.innerHTML = `
      <img class="unit-icon" src="${iconDataUrl}" alt="${key}" loading="lazy">
      <div class="unit-info">
        <span class="unit-name">${key.toUpperCase()}</span>
        <span class="unit-domain">${stats.domain.toUpperCase()}</span>
      </div>
      <div class="unit-cost">$${stats.cost}</div>
      <span class="unit-hotkey">${hotkey}</span>
    `;
    b.title = ''; // Disable native tooltip
    b.addEventListener('click', () => game.enterPlacementMode(key));
    buildDiv.appendChild(b);
    
    // Tooltip with stats
    let tooltip = null;
    b.addEventListener('mouseenter', (e) => {
      tooltip = createTooltip(`
        <strong>${key.toUpperCase()}</strong> <span class="domain-badge ${stats.domain}">${stats.domain}</span><br>
        <span class="stat">❤ HP:</span> ${stats.hp} | 
        <span class="stat">⚔ DMG:</span> ${stats.damage} | 
        <span class="stat">🎯 RNG:</span> ${stats.range}<br>
        <span class="stat">⚡ SPD:</span> ${stats.speed} | 
        <span class="stat">🔥 FR:</span> ${stats.fireRate}s | 
        <span class="stat">% HIT:</span> ${Math.round(stats.hitChance * 100)}%
      `);
      const rect = b.getBoundingClientRect();
      tooltip.style.left = (rect.right + 8) + 'px';
      tooltip.style.top = (rect.top + window.scrollY) + 'px';
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
  });

  // Periodic affordability & context check for armory buttons
  setInterval(() => {
    const selectedBuilding = game.selectedBuilding;
    buildDiv.querySelectorAll('.unitBtn').forEach(b => {
      const key = b.dataset.unitType;
      const cost = UNIT_TYPES[key].cost;
      const canAfford = game.money >= cost;

      // Context-sensitive: gray out units not buildable by selected building
      let isContextDisabled = false;
      if (selectedBuilding) {
        const domain = UNIT_TYPES[key].domain;
        if (selectedBuilding.faction !== 'player') {
          isContextDisabled = true;
        } else if (selectedBuilding.isShipyard) {
          // Shipyard can only build sea & air units
          isContextDisabled = (domain !== 'sea' && domain !== 'air');
        } else {
          // Land base: land & air only
          isContextDisabled = (domain !== 'land' && domain !== 'air');
        }
      }

      b.classList.toggle('unaffordable', !canAfford && !isContextDisabled);
      b.classList.toggle('context-disabled', isContextDisabled);
      b.disabled = !canAfford || isContextDisabled;
    });
  }, 200);

  // === Upgrades section ===
  const upgradeDiv = document.createElement('div');
  upgradeDiv.id = 'upgradePanel';
  upgradeDiv.innerHTML = '<h3 style="margin-top:10px;border-top:1px solid #4af;padding-top:8px;">Upgrades</h3>';
  buildDiv.parentElement.appendChild(upgradeDiv);
  for (const [stat, def] of Object.entries(UPGRADES)) {
    const row = document.createElement('button');
    row.className = 'unitBtn upgradeBtn';
    row.dataset.stat = stat;
    upgradeDiv.appendChild(row);
    row.addEventListener('click', () => {
      if (game.upgrades.upgrade(stat)) refreshUpgradeButtons();
    });
  }

  function refreshUpgradeButtons() {
    for (const stat of Object.keys(UPGRADES)) {
      const btn = upgradeDiv.querySelector(`[data-stat="${stat}"]`);
      const tier = game.upgrades.tiers[stat];
      const maxTier = UPGRADES[stat].tiers.length - 1;
      const cost = game.upgrades.nextCost(stat);
      const mult = UPGRADES[stat].tiers[tier];
      btn.innerHTML = `<span>${UPGRADES[stat].icon} ${UPGRADES[stat].name} T${tier} (×${mult.toFixed(2)})</span>` +
                      `<span>${cost === null ? 'MAX' : '$' + cost}</span>`;
      btn.disabled = cost === null || game.money < cost;
    }
  }
  refreshUpgradeButtons();
  setInterval(refreshUpgradeButtons, 500);  // periodic affordability check

  // === Formation (visual buttons in merged Selection Panel) ===
  const formationSelect = document.getElementById('formationSelect');
  const formationBtns = document.querySelectorAll('.formation-btn');
  
  function setFormation(formation) {
    game.formation = formation;
    formationSelect.value = formation;
    formationBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.formation === formation);
    });
  }
  
  // Custom tooltips for formation buttons
  const formationTooltips = {
    line: 'Line Formation <span style="color:#888;font-size:10px;">(F1)</span><br><span style="color:#aaa;font-size:10px;">Units spread horizontally</span>',
    wedge: 'Wedge Formation <span style="color:#888;font-size:10px;">(F2)</span><br><span style="color:#aaa;font-size:10px;">V-shaped assault formation</span>',
    square: 'Square Formation <span style="color:#888;font-size:10px;">(F3)</span><br><span style="color:#aaa;font-size:10px;">All-around defense</span>',
    column: 'Column Formation <span style="color:#888;font-size:10px;">(F4)</span><br><span style="color:#aaa;font-size:10px;">Single-file movement</span>',
  };

  formationBtns.forEach(btn => {
    btn.addEventListener('click', () => setFormation(btn.dataset.formation));

    let tooltip = null;
    btn.addEventListener('mouseenter', (e) => {
      if (tooltip) tooltip.remove();
      tooltip = document.createElement('div');
      tooltip.className = 'unit-tooltip';
      tooltip.innerHTML = formationTooltips[btn.dataset.formation] || btn.title;
      document.body.appendChild(tooltip);
      const rect = btn.getBoundingClientRect();
      tooltip.style.left = (rect.right + 8) + 'px';
      tooltip.style.top = (rect.top + window.scrollY) + 'px';
      tooltip.classList.add('visible');
    });
    btn.addEventListener('mouseleave', () => {
      if (tooltip) {
        tooltip.classList.remove('visible');
        setTimeout(() => { tooltip.remove(); tooltip = null; }, 150);
      }
    });
    btn.addEventListener('mousemove', (e) => {
      if (tooltip) {
        tooltip.style.left = (e.clientX + 16) + 'px';
        tooltip.style.top = (e.clientY + 16) + 'px';
      }
    });
  });
  
  // Keep dropdown in sync (for any legacy code)
  formationSelect.addEventListener('change', e => {
    setFormation(e.target.value);
  });

  // === Top-bar action buttons (dropdown menu for secondary actions) ===
  const topBar = document.getElementById('topBar');
  const actions = document.createElement('span');
  actions.style.marginLeft = 'auto';
  actions.innerHTML = `
    <button id="launchBtn" class="topBtn" title="Launch fighters from selected carrier">✈️ Launch</button>
    <button id="focusHqBtn" class="topBtn" title="Center camera on HQ (F)">🏠 HQ</button>
    <button id="helpBtn" class="topBtn" title="Help & Controls (H)">❓</button>
    <div class="top-dropdown" id="menuDropdown">
      <button class="topBtn dropdown-toggle" id="menuToggleBtn" title="More options">☰</button>
      <div class="dropdown-menu hidden" id="dropdownMenu">
        <button id="saveBtn" class="dropdown-item" title="Save game">💾 Save</button>
        <button id="loadBtn" class="dropdown-item" title="Load game">📂 Load</button>
        <button id="soundBtn" class="dropdown-item" title="Toggle sound">🔊 Sound</button>
      </div>
    </div>
  `;
  topBar.appendChild(actions);

  // Dropdown toggle
  const menuToggle = document.getElementById('menuToggleBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('hidden');
    menuToggle.classList.toggle('active');
  });
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.top-dropdown')) {
      dropdownMenu.classList.add('hidden');
      menuToggle.classList.remove('active');
    }
  });

  document.getElementById('launchBtn').addEventListener('click', () => {
    const carriers = game.selectedUnits.filter(u => u.canLaunch && u.alive);
    if (carriers.length === 0) { game.flashMessage('Select a carrier first'); return; }
    let launched = 0;
    for (const c of carriers) {
      if (c.launchFighters()) launched++;
    }
    if (launched === 0) game.flashMessage('Carriers on cooldown');
  });

  document.getElementById('focusHqBtn').addEventListener('click', () => {
    const hq = game.bases.find(b => b.faction === 'player');
    if (hq) {
      game.cameraTarget.x = hq.mesh.position.x;
      game.cameraTarget.z = hq.mesh.position.z;
      game.flashMessage('Camera centered on HQ');
    }
  });

  document.getElementById('selectAllBtn').addEventListener('click', () => {
    const aliveUnits = game.playerUnits.filter(u => u.alive);
    if (aliveUnits.length === 0) { game.flashMessage('No units to select'); return; }
    for (const u of game.selectedUnits) u.setSelected(false);
    game.selectedUnits = aliveUnits;
    for (const u of game.selectedUnits) u.setSelected(true);
    game.flashMessage(`Selected ${aliveUnits.length} units`);
  });

  // Dropdown menu actions
  document.getElementById('saveBtn').addEventListener('click', () => {
    if (saveGame(game)) game.flashMessage('💾 Game saved!');
    else game.flashMessage('Save failed');
    dropdownMenu.classList.add('hidden');
    menuToggle.classList.remove('active');
  });
  document.getElementById('loadBtn').addEventListener('click', () => {
    if (hasSave()) location.reload();
    else game.flashMessage('No save found');
    dropdownMenu.classList.add('hidden');
    menuToggle.classList.remove('active');
  });
  document.getElementById('soundBtn').addEventListener('click', e => {
    Sound.enabled = !Sound.enabled;
    e.currentTarget.textContent = Sound.enabled ? '🔊 Sound' : '🔇 Sound';
    dropdownMenu.classList.add('hidden');
    menuToggle.classList.remove('active');
  });

  // Hotkeys: F = Focus HQ, Ctrl+A = Select All, F1-F4 = Formations, Escape = Deselect, H = Toggle Help
  window.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    
    // Toggle help with H key
    if (e.key === 'h' || e.key === 'H') {
      toggleHelpModal(!helpModalOpen);
      return;
    }

    // Escape closes help modal first, then deselects
    if (e.key === 'Escape') {
      if (helpModalOpen) {
        toggleHelpModal(false);
        return;
      }
      for (const u of game.selectedUnits) u.setSelected(false);
      game.selectedUnits = [];
      game.selectedBuilding = null;
      return;
    }

    // Ctrl+A = Select all (prevents conflict with camera left)
    if (e.key === 'a' || e.key === 'A') {
      if (e.ctrlKey || e.metaKey) {
        const aliveUnits = game.playerUnits.filter(u => u.alive);
        if (aliveUnits.length > 0) {
          for (const u of game.selectedUnits) u.setSelected(false);
          game.selectedUnits = aliveUnits;
          for (const u of game.selectedUnits) u.setSelected(true);
          game.flashMessage(`Selected ${aliveUnits.length} units`);
        }
        return;
      }
      // Without Ctrl: camera left (handled by game camera)
      return;
    }

    // F1-F4 = Formations
    if (e.key === 'F1') { setFormation('line'); game.flashMessage('Formation: Line'); return; }
    if (e.key === 'F2') { setFormation('wedge'); game.flashMessage('Formation: Wedge'); return; }
    if (e.key === 'F3') { setFormation('square'); game.flashMessage('Formation: Square'); return; }
    if (e.key === 'F4') { setFormation('column'); game.flashMessage('Formation: Column'); return; }

    if (e.key === 'f' || e.key === 'F') {
      const hq = game.bases.find(b => b.faction === 'player');
      if (hq) {
        game.cameraTarget.x = hq.mesh.position.x;
        game.cameraTarget.z = hq.mesh.position.z;
      }
    }
  });

  // === Help Modal (Side Navigation + Content Panels) ===
  createHelpModal();

  document.getElementById('helpBtn').addEventListener('click', () => {
    toggleHelpModal(true);
  });

  function createHelpModal() {
    const modal = document.createElement('div');
    modal.id = 'helpModal';
    modal.className = 'overlay center hidden';
    modal.innerHTML = `
      <div class="panel help-panel">
        <div class="help-header">
          <h1>CONTROLS & HOW TO PLAY</h1>
          <span class="help-hint">Press <span class="help-key">H</span> or <span class="help-key">Escape</span> to close</span>
          <button id="helpCloseBtn" class="help-close" title="Close (H/Escape)">×</button>
        </div>
        <div class="help-body">
          <nav class="help-nav" role="tablist" aria-label="Help categories">
            <button class="help-nav-btn active" data-tab="controls" role="tab" aria-selected="true">🖱️ Controls</button>
            <button class="help-nav-btn" data-tab="gameplay" role="tab" aria-selected="false">🎮 Gameplay</button>
            <button class="help-nav-btn" data-tab="ui" role="tab" aria-selected="false">📊 UI Guide</button>
            <button class="help-nav-btn" data-tab="quickstart" role="tab" aria-selected="false">🚀 Quick Start</button>
          </nav>
          <div class="help-content">
            <div class="help-panel-content active" id="tab-controls" role="tabpanel">
              <h3>Mouse Controls</h3>
              <div class="help-row"><span class="help-key">LMB Click</span><span>Select unit / Click button</span></div>
              <div class="help-row"><span class="help-key">LMB Drag</span><span>Box select multiple units</span></div>
              <div class="help-row"><span class="help-key">RMB Click</span><span>Move selected units / Attack enemy</span></div>
              <div class="help-row"><span class="help-key">Mouse Wheel</span><span>Zoom camera in/out</span></div>
              <div class="help-row"><span class="help-key">Minimap Click</span><span>Jump camera to location</span></div>
              
              <h3>Keyboard Shortcuts</h3>
              <div class="help-row"><span class="help-key">W / ↑</span><span>Move camera up</span></div>
              <div class="help-row"><span class="help-key">S / ↓</span><span>Move camera down</span></div>
              <div class="help-row"><span class="help-key">A / ←</span><span>Move camera left</span></div>
              <div class="help-row"><span class="help-key">D / →</span><span>Move camera right</span></div>
              <div class="help-row"><span class="help-key">F</span><span>Focus camera on HQ</span></div>
              <div class="help-row"><span class="help-key">Ctrl+A</span><span>Select all player units</span></div>
              <div class="help-row"><span class="help-key">Escape</span><span>Deselect units / Close menus</span></div>
              <div class="help-row"><span class="help-key">H</span><span>Toggle this help menu</span></div>
              <div class="help-row"><span class="help-key">1–9</span><span>Quick-build unit (Armory order)</span></div>
              <div class="help-row"><span class="help-key">F1–F4</span><span>Set formation (Line/Wedge/Square/Column)</span></div>
            </div>
            
            <div class="help-panel-content" id="tab-gameplay" role="tabpanel" hidden>
              <h3>Core Mechanics</h3>
              <div class="help-row"><span class="help-key">Build Units</span><span>Click unit buttons in Armory (bottom-right). Units spawn near your HQ.</span></div>
              <div class="help-row"><span class="help-key">Capture Bases</span><span>Move units to enemy bases (red flags). When HP reaches 0, base switches to your faction.</span></div>
              <div class="help-row"><span class="help-key">Fog of War</span><span>Map is dark until explored. Units and bases reveal area around them.</span></div>
              <div class="help-row"><span class="help-key">Formations</span><span>Select units → choose formation (Line, Wedge, Square, Column) → right-click to move in formation.</span></div>
              <div class="help-row"><span class="help-key">Carrier Launch</span><span>Select carrier → click ✈️ Launch button to deploy fighters (cooldown: 20s).</span></div>
              <div class="help-row"><span class="help-key">Upgrades</span><span>Buy Armor, Firepower, Engines in Armory (gold buttons) to permanently buff all player units.</span></div>
              <div class="help-row"><span class="help-key">Income</span><span>Earn passive income per owned base. Destroy enemy units for bonus cash.</span></div>
            </div>
            
            <div class="help-panel-content" id="tab-ui" role="tabpanel" hidden>
              <h3>UI Elements</h3>
              <div class="help-row"><span class="help-key">Top Bar</span><span>Money ($) • Bases Owned/Total • Unit Count • Difficulty</span></div>
              <div class="help-row"><span class="help-key">Minimap (top-right)</span><span>Blue = your units/bases • Red = known enemies • Gray outline = terrain • White box = camera view</span></div>
              <div class="help-row"><span class="help-key">Selection Panel (bottom-left)</span><span>Shows selected unit portraits, types, count, and combined stats</span></div>
              <div class="help-row"><span class="help-key">Formation Selector</span><span>Integrated in Selection Panel — visual preview of Line/Wedge/Square/Column</span></div>
              <div class="help-row"><span class="help-key">Armory (bottom-right)</span><span>Build units (with hotkeys 1–9) & buy upgrades</span></div>
            </div>
            
            <div class="help-panel-content" id="tab-quickstart" role="tabpanel" hidden>
              <h3>Quick Start</h3>
              <ol class="quickstart-steps">
                <li><span class="step-num">1</span><div><strong>Build an army</strong> — Click <span class="help-key">TANK</span> / <span class="help-key">INFANTRY</span> in Armory (or press <span class="help-key">1</span> / <span class="help-key">2</span>). Costs $.</div></li>
                <li><span class="step-num">2</span><div><strong>Select units</strong> — Click a unit, or drag a box to select multiple. Press <span class="help-key">Ctrl+A</span> for all.</div></li>
                <li><span class="step-num">3</span><div><strong>Move & Attack</strong> — Right-click ground to move, right-click enemy to attack. Use <span class="help-key">F1–F4</span> for formations.</div></li>
                <li><span class="step-num">4</span><div><strong>Capture bases</strong> — Move units onto enemy bases (red flags) to capture them. Earn income per base.</div></li>
                <li><span class="step-num">5</span><div><strong>Win</strong> — Capture all enemy bases. Lose if you lose your HQ.</div></li>
              </ol>
            </div>
          </div>
        </div>
        <div class="help-footer">Press <span class="help-key">H</span> or <span class="help-key">Escape</span> or click outside to close</div>
      </div>
    `;
    document.body.appendChild(modal);

    // Tab switching
    const navBtns = modal.querySelectorAll('.help-nav-btn');
    const panels = modal.querySelectorAll('.help-panel-content');
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        navBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        panels.forEach(p => { p.classList.remove('active'); p.hidden = true; });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const panel = modal.querySelector(`#tab-${tab}`);
        panel.classList.add('active');
        panel.hidden = false;
      });
    });

    // Close on backdrop click
    modal.addEventListener('click', e => {
      if (e.target === modal) toggleHelpModal(false);
    });

    // Close button
    document.getElementById('helpCloseBtn').addEventListener('click', () => {
      toggleHelpModal(false);
    });
  }

  let helpModalOpen = false;
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

  // Hotkeys: F = Focus HQ, A = Select All, Escape = Deselect, H = Toggle Help
  window.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    
    // Toggle help with H key
    if (e.key === 'h' || e.key === 'H') {
      toggleHelpModal(!helpModalOpen);
      return;
    }

    // Escape closes help modal first, then deselects
    if (e.key === 'Escape') {
      if (helpModalOpen) {
        toggleHelpModal(false);
        return;
      }
      for (const u of game.selectedUnits) u.setSelected(false);
      game.selectedUnits = [];
      game.selectedBuilding = null;
      return;
    }

    if (e.key === 'f' || e.key === 'F') {
      const hq = game.bases.find(b => b.faction === 'player');
      if (hq) {
        game.cameraTarget.x = hq.mesh.position.x;
        game.cameraTarget.z = hq.mesh.position.z;
      }
    } else if (e.key === 'a' || e.key === 'A') {
      const aliveUnits = game.playerUnits.filter(u => u.alive);
      if (aliveUnits.length > 0) {
        for (const u of game.selectedUnits) u.setSelected(false);
        game.selectedUnits = aliveUnits;
        for (const u of game.selectedUnits) u.setSelected(true);
      }
    }
  });

  // Restart
  document.getElementById('restartBtn').addEventListener('click', () => {
    deleteSave();
    location.reload();
  });

  // === First-Launch Tutorial ===
  initTutorial();

  function initTutorial() {
    const completed = localStorage.getItem('tutorialCompleted');
    if (completed === 'true') return; // Skip if already completed
    
    // Small delay to let UI settle
    setTimeout(() => showTutorialStep(1), 500);
  }

  const tutorialSteps = [
    {
      title: 'Welcome to Low-Poly Command!',
      text: 'This tutorial will walk you through the basics. Click "Next" to continue or "Skip" to jump straight into the game.',
      highlight: null,
      action: null,
    },
    {
      title: 'Step 1: Build Your Army',
      text: 'Click the <strong>TANK</strong> or <strong>INFANTRY</strong> button in the Armory (bottom-right) to build units. They\'ll spawn near your HQ. You can also press <span class="help-key">1</span> or <span class="help-key">2</span> as hotkeys.',
      highlight: '#buildPanel',
      action: null,
    },
    {
      title: 'Step 2: Select Units',
      text: 'Click a unit to select it, or drag a box to select multiple. Press <span class="help-key">Ctrl+A</span> to select all your units. Selected units show a green ring and appear in the Selection panel (bottom-left).',
      highlight: '#selectionPanel',
      action: null,
    },
    {
      title: 'Step 3: Move & Attack',
      text: 'Right-click on the ground to move selected units. Right-click on an enemy to attack. Choose a formation (Line/Wedge/Square/Column) in the Selection panel or press <span class="help-key">F1–F4</span>.',
      highlight: '#selectionPanel .formation-options',
      action: null,
    },
    {
      title: 'Step 4: Capture Bases',
      text: 'Move your units onto enemy bases (red flags). When a base\'s HP reaches 0, it switches to your faction (blue flag). You earn passive income per owned base. Capture all enemy bases to win!',
      highlight: null,
      action: null,
    },
    {
      title: 'Step 5: Win the Game!',
      text: 'Destroy all enemy bases to achieve victory. If you lose your HQ, it\'s defeat. Use the Minimap (top-right) to navigate, and press <span class="help-key">H</span> anytime to reopen the Help menu. Good luck, Commander!',
      highlight: null,
      action: 'complete',
    },
  ];

  let tutorialOverlay = null;
  let tutorialHighlight = null;
  let currentStep = 0;

  function showTutorialStep(stepIndex) {
    currentStep = stepIndex;
    const step = tutorialSteps[stepIndex - 1];
    
    // Remove existing overlay
    if (tutorialOverlay) tutorialOverlay.remove();
    if (tutorialHighlight) tutorialHighlight.remove();
    
    // Create highlight for target element
    if (step.highlight) {
      const target = document.querySelector(step.highlight);
      if (target) {
        tutorialHighlight = document.createElement('div');
        tutorialHighlight.className = 'tutorial-highlight';
        const rect = target.getBoundingClientRect();
        tutorialHighlight.style.cssText = `
          position: fixed;
          left: ${rect.left - 4}px;
          top: ${rect.top - 4}px;
          width: ${rect.width + 8}px;
          height: ${rect.height + 8}px;
          border: 3px solid #4af;
          border-radius: 8px;
          box-shadow: 0 0 0 9999px rgba(0,0,0,0.7), 0 0 20px rgba(70,170,255,0.5);
          pointer-events: none;
          z-index: 1000;
          animation: tutorialPulse 1.5s ease-in-out infinite;
        `;
        document.body.appendChild(tutorialHighlight);
      }
    }
    
    // Create tutorial overlay
    tutorialOverlay = document.createElement('div');
    tutorialOverlay.className = 'tutorial-overlay';
    tutorialOverlay.innerHTML = `
      <div class="tutorial-card">
        <div class="tutorial-header">
          <span class="tutorial-step">${stepIndex} / ${tutorialSteps.length}</span>
          <button class="tutorial-skip" title="Skip tutorial">Skip</button>
        </div>
        <h2>${step.title}</h2>
        <p>${step.text}</p>
        <div class="tutorial-footer">
          ${stepIndex > 1 ? '<button class="tutorial-btn tutorial-prev">← Back</button>' : '<div style="width:80px;"></div>'}
          <div style="flex:1;"></div>
          ${stepIndex < tutorialSteps.length ? '<button class="tutorial-btn tutorial-next">Next →</button>' : '<button class="tutorial-btn tutorial-finish">Start Playing!</button>'}
        </div>
      </div>
    `;
    document.body.appendChild(tutorialOverlay);
    
    // Add pulse animation if not exists
    if (!document.getElementById('tutorial-style')) {
      const style = document.createElement('style');
      style.id = 'tutorial-style';
      style.textContent = `
        @keyframes tutorialPulse {
          0%, 100% { box-shadow: 0 0 0 9999px rgba(0,0,0,0.7), 0 0 20px rgba(70,170,255,0.5); }
          50% { box-shadow: 0 0 0 9999px rgba(0,0,0,0.7), 0 0 30px rgba(70,170,255,0.9); }
        }
        .tutorial-overlay {
          position: fixed; inset: 0; z-index: 1001;
          display: flex; align-items: center; justify-content: center;
          background: transparent; pointer-events: none;
        }
        .tutorial-card {
          pointer-events: auto;
          background: rgba(20,25,35,0.98);
          border: 2px solid #4af;
          border-radius: 12px;
          padding: 24px;
          max-width: 420px;
          width: 90%;
          box-shadow: 0 0 40px rgba(70,170,255,0.3);
          animation: slideUp 0.3s ease;
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .tutorial-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .tutorial-step { font-size: 12px; color: #888; font-family: monospace; }
        .tutorial-skip {
          background: none; border: 1px solid #444; color: #888;
          padding: 4px 10px; border-radius: 4px; cursor: pointer;
          font-family: inherit; font-size: 11px; transition: all 0.15s;
        }
        .tutorial-skip:hover { border-color: #f66; color: #f66; }
        .tutorial-card h2 { color: #4af; margin-bottom: 12px; font-size: 18px; }
        .tutorial-card p { color: #ddd; line-height: 1.6; font-size: 13px; }
        .tutorial-card p strong { color: #4af; }
        .tutorial-footer { display: flex; align-items: center; gap: 12px; margin-top: 20px; }
        .tutorial-btn {
          background: #1a3a5a; border: 1px solid #4af; color: #4af;
          padding: 8px 20px; border-radius: 6px; cursor: pointer;
          font-family: inherit; font-size: 12px; font-weight: bold;
          transition: all 0.15s;
        }
        .tutorial-btn:hover { background: #235a8a; }
        .tutorial-btn.tutorial-prev { background: #2a2; border-color: #4f4; color: #4f4; }
        .tutorial-btn.tutorial-prev:hover { background: #3b3; }
        .tutorial-btn.tutorial-finish { background: #2a8; border-color: #4c4; color: #fff; }
        .tutorial-btn.tutorial-finish:hover { background: #3b9; }
      `;
      document.head.appendChild(style);
    }
    
    // Event listeners
    tutorialOverlay.querySelector('.tutorial-next')?.addEventListener('click', () => {
      showTutorialStep(stepIndex + 1);
    });
    tutorialOverlay.querySelector('.tutorial-prev')?.addEventListener('click', () => {
      showTutorialStep(stepIndex - 1);
    });
    tutorialOverlay.querySelector('.tutorial-finish')?.addEventListener('click', () => {
      completeTutorial();
    });
    tutorialOverlay.querySelector('.tutorial-skip')?.addEventListener('click', () => {
      completeTutorial();
    });
  }

  function completeTutorial() {
    localStorage.setItem('tutorialCompleted', 'true');
    if (tutorialOverlay) tutorialOverlay.remove();
    if (tutorialHighlight) tutorialHighlight.remove();
    game.flashMessage('Tutorial complete! Press H for help anytime.');
  }

  console.log('✅ UI initialized');
}
