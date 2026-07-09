import { describe, it, expect } from 'vitest';

describe('config.js - Balance & Behavior Constants', () => {

  it('exports TERRAIN constants', async () => {
    const mod = await import('../config.js?v=6');
    expect(mod.TERRAIN.LAND).toBe('land');
    expect(mod.TERRAIN.SEA).toBe('sea');
    expect(mod.TERRAIN.COAST).toBe('coast');
    expect(mod.TERRAIN.MOUNTAIN).toBe('mountain');
  });

  it('exports TERRAIN_BONUSES with correct structure', async () => {
    const mod = await import('../config.js?v=6');
    expect(mod.TERRAIN_BONUSES.land.land.dmg).toBe(1.15);
    expect(mod.TERRAIN_BONUSES.sea.sea.dmg).toBe(1.2);
    expect(mod.TERRAIN_BONUSES.air.land.dmg).toBe(1);
  });

  it('exports CRIT_CHANCE and CRIT_MULT', async () => {
    const mod = await import('../config.js?v=6');
    expect(mod.CRIT_CHANCE).toBe(0.10);
    expect(mod.CRIT_MULT).toBe(1.5);
  });

  it('exports MAP_SIZE, GRID_CELL, GRID_SIZE', async () => {
    const mod = await import('../config.js?v=6');
    expect(mod.MAP_SIZE).toBe(1200);
    expect(mod.GRID_CELL).toBe(12);
    expect(mod.GRID_SIZE).toBe(Math.ceil(1200 / 12));
  });

  it('exports BASE_HP_BASE, TERRITORY_RADIUS, TERRITORY_RADIUS_PER_SIZE', async () => {
    const mod = await import('../config.js?v=6');
    expect(mod.BASE_HP_BASE).toBe(500);
    expect(mod.TERRITORY_RADIUS).toBe(150);
    expect(mod.TERRITORY_RADIUS_PER_SIZE).toBe(150);
  });

  it('exports PROJECTILE_TYPES', async () => {
    const mod = await import('../config.js?v=6');
    expect(mod.PROJECTILE_TYPES.land.speed).toBe(80);
    expect(mod.PROJECTILE_TYPES.sea.speed).toBe(60);
    expect(mod.PROJECTILE_TYPES.air.speed).toBe(120);
  });

  it('exports PROJECTILE_PATTERNS', async () => {
    const mod = await import('../config.js?v=6');
    expect(mod.PROJECTILE_PATTERNS.default.burst).toBe(1);
    expect(mod.PROJECTILE_PATTERNS.burst.burst).toBe(3);
    expect(mod.PROJECTILE_PATTERNS.homing.homing).toBe(true);
    expect(mod.PROJECTILE_PATTERNS.ap.ap).toBe(true);
  });

  it('exports UNIT_TYPES with all units', async () => {
    const mod = await import('../config.js?v=6');
    const units = mod.UNIT_TYPES;
    expect(units.infantry).toBeDefined();
    expect(units.tank).toBeDefined();
    expect(units.heavyTank).toBeDefined();
    expect(units.crusher).toBeDefined();
    expect(units.artillery).toBeDefined();
    expect(units.transport).toBeDefined();
    expect(units.fighter).toBeDefined();
    expect(units.bomber).toBeDefined();
    expect(units.b2).toBeDefined();
    expect(units.destroyer).toBeDefined();
    expect(units.battleship).toBeDefined();
    expect(units.carrier).toBeDefined();
    expect(units.healer).toBeDefined();
  });

  it('transport unit has nonCombatant: true (Issue 6)', async () => {
    const mod = await import('../config.js?v=6');
    expect(mod.UNIT_TYPES.transport.nonCombatant).toBe(true);
  });

  it('transport unit has damage: 0 and empty targetDomains (Issue 6)', async () => {
    const mod = await import('../config.js?v=6');
    expect(mod.UNIT_TYPES.transport.damage).toBe(0);
    expect(mod.UNIT_TYPES.transport.targetDomains).toEqual([]);
  });

  it('all unit types have required fields', async () => {
    const mod = await import('../config.js?v=6');
    for (const [key, u] of Object.entries(mod.UNIT_TYPES)) {
      expect(u.domain).toBeDefined();
      expect(u.hp).toBeGreaterThan(0);
      expect(u.cost).toBeGreaterThanOrEqual(0);
      expect(u.color).toBeDefined();
    }
  });

  it('exports STARTING_MONEY and PASSIVE_INCOME', async () => {
    const mod = await import('../config.js?v=6');
    expect(mod.STARTING_MONEY).toBe(2500);
    expect(mod.PASSIVE_INCOME).toBe(20);
  });

  it('exports DIFFICULTY levels', async () => {
    const mod = await import('../config.js?v=6');
    expect(mod.DIFFICULTY.easy.aiIncome).toBe(1.0);
    expect(mod.DIFFICULTY.normal.aiIncome).toBe(1.5);
    expect(mod.DIFFICULTY.hard.aiIncome).toBe(2.0);
    expect(mod.DIFFICULTY.hard.maxAttackGroup).toBe(50);
  });

  it('exports ENGAGE_RANGE_MULT', async () => {
    const mod = await import('../config.js?v=6');
    expect(mod.ENGAGE_RANGE_MULT).toBe(1.56);
  });

  it('UPGRADES has hp, damage, speed AND tactics (Issue 11)', async () => {
    const mod = await import('../config.js?v=6');
    expect(mod.UPGRADES.hp).toBeDefined();
    expect(mod.UPGRADES.damage).toBeDefined();
    expect(mod.UPGRADES.speed).toBeDefined();
    expect(mod.UPGRADES.tactics).toBeDefined(); // NEW: Issue 11
  });

  it('UPGRADES.tactics has correct structure (Issue 11)', async () => {
    const mod = await import('../config.js?v=6');
    const t = mod.UPGRADES.tactics;
    expect(t.name).toBe('Tactics');
    expect(t.tiers).toEqual([0, 1, 2, 3]);
    expect(t.costs).toEqual([0, 3000, 12000, 40000]);
    expect(t.ability.tier1).toContain('Formation bonus');
    expect(t.ability.tier2).toContain('Focus fire');
    expect(t.ability.tier3).toContain('Combined arms');
  });

  it('UPGRADES have ability descriptions (Issue 11)', async () => {
    const mod = await import('../config.js?v=6');
    expect(mod.UPGRADES.hp.ability.tier2).toContain('Damage reduction');
    expect(mod.UPGRADES.damage.ability.tier2).toContain('Crit chance');
    expect(mod.UPGRADES.speed.ability.tier2).toContain('Path smoothing');
  });

  it('exports CARRIER constants', async () => {
    const mod = await import('../config.js?v=6');
    expect(mod.CARRIER_FIGHTER_COOLDOWN).toBe(30);
    expect(mod.CARRIER_FIGHTER_COUNT).toBe(12);
    expect(mod.CARRIER_FIGHTER_INTERVAL).toBe(2);
  });

  it('exports AI_STAGING constants (Issue 4)', async () => {
    const mod = await import('../config.js?v=6');
    expect(mod.AI_STAGING_TIME).toBe(8);
    expect(mod.AI_MIN_ATTACK_SIZE).toBe(6);
    expect(mod.AI_MAX_STAGING_UNITS).toBe(30);
  });

});
