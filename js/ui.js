// ui.js — Binds HTML overlay controls to the game.
import { UNIT_TYPES, UPGRADES } from './config.js';
import { Sound } from './sound.js';
import { saveGame, loadSaveData, deleteSave, hasSave } from './saveLoad.js';

export function initUI(game) {
  // === Build menu ===
  const buildDiv = document.getElementById('buildButtons');
  buildDiv.innerHTML = '';
  for (const [key, stats] of Object.entries(UNIT_TYPES)) {
    const b = document.createElement('button');
    b.className = 'unitBtn';
    b.innerHTML = `<span>${key.toUpperCase()} (${stats.domain})</span><span>$${stats.cost}</span>`;
    b.addEventListener('click', () => game.purchaseUnit(key));
    buildDiv.appendChild(b);
  }

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

  // === Formation ===
  document.getElementById('formationSelect').addEventListener('change', e => {
    game.formation = e.target.value;
  });

  // === Top-bar action buttons (save/load/sound/carrier-launch) ===
  const topBar = document.getElementById('topBar');
  const actions = document.createElement('span');
  actions.style.marginLeft = 'auto';
  actions.innerHTML = `
    <button id="launchBtn" class="topBtn" title="Launch fighters from selected carrier">✈️ Launch</button>
    <button id="saveBtn" class="topBtn" title="Save game">💾 Save</button>
    <button id="loadBtn" class="topBtn" title="Load game">📂 Load</button>
    <button id="soundBtn" class="topBtn" title="Toggle sound">🔊</button>
  `;
  topBar.appendChild(actions);

  document.getElementById('launchBtn').addEventListener('click', () => {
    const carriers = game.selectedUnits.filter(u => u.canLaunch && u.alive);
    if (carriers.length === 0) { game.flashMessage('Select a carrier first'); return; }
    let launched = 0;
    for (const c of carriers) {
      if (c.launchFighters()) launched++;
    }
    if (launched === 0) game.flashMessage('Carriers on cooldown');
  });

  document.getElementById('saveBtn').addEventListener('click', () => {
    if (saveGame(game)) game.flashMessage('💾 Game saved!');
    else game.flashMessage('Save failed');
  });
  document.getElementById('loadBtn').addEventListener('click', () => {
    if (hasSave()) location.reload();
    else game.flashMessage('No save found');
  });
  document.getElementById('soundBtn').addEventListener('click', e => {
    Sound.enabled = !Sound.enabled;
    e.currentTarget.textContent = Sound.enabled ? '🔊' : '🔇';
  });

  // Restart
  document.getElementById('restartBtn').addEventListener('click', () => {
    deleteSave();
    location.reload();
  });

  console.log('✅ UI initialized');
}
