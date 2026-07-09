// upgrades.js — Persistent player upgrades that apply to all newly spawned units.
import { UPGRADES } from './config.js';
import { Sound } from './sound.js';

export class UpgradeManager {
  constructor(game) {
    this.game = game;
    this.tiers = { hp: 0, damage: 0, speed: 0, tactics: 0 };
  }

  multiplier(stat) {
    return UPGRADES[stat].tiers[this.tiers[stat]];
  }

  applyTo(stats) {
    return {
      ...stats,
      hp: stats.hp * this.multiplier('hp'),
      damage: stats.damage * this.multiplier('damage'),
      speed: stats.speed * this.multiplier('speed'),
    };
  }

  canUpgrade(stat) {
    const t = this.tiers[stat];
    if (t >= UPGRADES[stat].tiers.length - 1) return false;
    return this.game.money >= UPGRADES[stat].costs[t + 1];
  }

  nextCost(stat) {
    const t = this.tiers[stat];
    if (t >= UPGRADES[stat].tiers.length - 1) return null;
    return UPGRADES[stat].costs[t + 1];
  }

  upgrade(stat) {
    if (!this.canUpgrade(stat)) return false;
    const cost = this.nextCost(stat);
    this.game.money -= cost;
    this.tiers[stat]++;
    Sound.play('upgrade');
    for (const u of this.game.playerUnits) {
      if (stat === 'hp') {
        const ratio = u.hp / u.maxHp;
        const newMax = u.stats.hp * this.multiplier('hp');
        u.maxHp = newMax;
        u.hp = newMax * ratio;
      } else if (stat === 'damage') {
        const oldMult = UPGRADES[stat].tiers[this.tiers[stat] - 1];
        u.stats.damage = u.stats.damage / oldMult * this.multiplier(stat);
      } else if (stat === 'speed') {
        const oldMult = UPGRADES[stat].tiers[this.tiers[stat] - 1];
        u.stats.speed = u.stats.speed / oldMult * this.multiplier(stat);
      }
    }
    return true;
  }

  serialize() { return { ...this.tiers }; }
  deserialize(data) { this.tiers = { ...this.tiers, ...data }; }
}
