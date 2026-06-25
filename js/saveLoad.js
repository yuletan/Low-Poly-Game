// saveLoad.js — Persists game state to localStorage.
const SAVE_KEY = 'rts_save_v1';

export function saveGame(game) {
  const state = {
    timestamp: Date.now(),
    difficulty: game.difficulty,
    money: game.money,
    formation: game.formation,
    upgrades: game.upgrades.serialize(),
    bases: game.bases.map(b => ({
      faction: b.faction, hp: b.hp, name: b.name, size: b.size,
      pos: { x: b.mesh.position.x, z: b.mesh.position.z }
    })),
    playerUnits: game.playerUnits.filter(u => u.alive).map(serializeUnit),
    enemyUnits:  game.enemyUnits.filter(u => u.alive).map(serializeUnit),
    fog: game.fog ? game.fog.serialize() : null,
    cameraTarget: game.cameraTarget ? { x: game.cameraTarget.x, z: game.cameraTarget.z } : null,
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.error('Save failed', e);
    return false;
  }
}

function serializeUnit(u) {
  return {
    type: u.type, faction: u.faction,
    hp: u.hp, maxHp: u.maxHp,
    pos: { x: u.mesh.position.x, y: u.mesh.position.y, z: u.mesh.position.z },
    rotY: u.mesh.rotation.y,
  };
}

export function loadSaveData() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function hasSave() { return !!localStorage.getItem(SAVE_KEY); }
export function deleteSave() { localStorage.removeItem(SAVE_KEY); }
