// ui.js — Binds HTML overlay controls to the game.
import { UNIT_TYPES } from './config.js';

export function initUI(game) {
  // Build menu
  const buildDiv = document.getElementById('buildButtons');
  for (const [key, stats] of Object.entries(UNIT_TYPES)) {
    const b = document.createElement('button');
    b.className = 'unitBtn';
    b.innerHTML = `<span>${key.toUpperCase()} (${stats.domain})</span><span>$${stats.cost}</span>`;
    b.addEventListener('click', () => game.purchaseUnit(key));
    buildDiv.appendChild(b);
  }
  // Formation selector
  document.getElementById('formationSelect').addEventListener('change', e => {
    game.formation = e.target.value;
  });
  // Restart
  document.getElementById('restartBtn').addEventListener('click', () => location.reload());
}
