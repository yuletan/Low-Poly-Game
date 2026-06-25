// config.js — Single source of truth for balance numbers.
export const TERRAIN = { LAND:'land', COAST:'coast', SEA:'sea', MOUNTAIN:'mountain' };

// ===== MAP SIZE =====
// World coords go from -MAP_SIZE/2 to +MAP_SIZE/2 on both x and z.
export const MAP_SIZE = 1200;  // was effectively ~500. Now 2.4× larger.
export const GRID_CELL = 12;   // A* grid cell size in world units
export const GRID_SIZE = Math.ceil(MAP_SIZE / GRID_CELL); // cells per side

export const UNIT_TYPES = {
  infantry: { domain:'land',  hp:50,  damage:8,  range:18, speed:14, fireRate:1.0, hitChance:0.85, cost:50,  color:0x556b2f },
  tank:     { domain:'land',  hp:200, damage:35, range:35, speed:10, fireRate:1.5, hitChance:0.9,  cost:200, color:0x4a5d23 },
  artillery:{ domain:'land',  hp:120, damage:60, range:70, speed:6,  fireRate:3.0, hitChance:0.7,  cost:300, color:0x6b5b3a },
  destroyer:{ domain:'sea',   hp:250, damage:30, range:50, speed:12, fireRate:1.2, hitChance:0.85, cost:250, color:0x445566 },
  battleship:{domain:'sea',   hp:600, damage:80, range:80, speed:7,  fireRate:2.5, hitChance:0.8,  cost:600, color:0x334455 },
  carrier:  { domain:'sea',   hp:500, damage:20, range:30, speed:6,  fireRate:2.0, hitChance:0.7,  cost:700, color:0x556677, canLaunchFighters:true },
  fighter:  { domain:'air',   hp:80,  damage:25, range:40, speed:30, fireRate:0.6, hitChance:0.9,  cost:300, color:0x9999aa, altitude:25 },
  bomber:   { domain:'air',   hp:180, damage:90, range:25, speed:18, fireRate:3.5, hitChance:0.75, cost:500, color:0x778899, altitude:30 },
};

export const TERRAIN_BONUSES = {
  sea:  { sea:{dmg:1.2,hp:1.2}, coast:{dmg:0.9,hp:1.0} },
  land: { land:{dmg:1.0,hp:1.0}, mountain:{dmg:1.0,hp:1.15}, coast:{dmg:0.9,hp:0.9} },
  air:  { land:{dmg:1,hp:1}, sea:{dmg:1,hp:1}, coast:{dmg:1,hp:1}, mountain:{dmg:1,hp:1} },
};

export const CRIT_CHANCE = 0.10;
export const CRIT_MULT   = 1.5;

export const DIFFICULTY = {
  easy:   { aiIncome:0.6, aiAggression:0.3, aiInterval:25 },
  normal: { aiIncome:1.0, aiAggression:0.6, aiInterval:18 },
  hard:   { aiIncome:1.5, aiAggression:1.0, aiInterval:12 },
};

export const STARTING_MONEY = 500;
export const PASSIVE_INCOME = 10;

// ===== UPGRADES =====
// Three tiers per stat. Each tier multiplies the base stat.
export const UPGRADES = {
  hp:      { name:'Armor',    icon:'🛡️', tiers:[1.0, 1.25, 1.5, 2.0], costs:[0, 300, 800, 2000] },
  damage:  { name:'Firepower',icon:'💥', tiers:[1.0, 1.25, 1.5, 2.0], costs:[0, 300, 800, 2000] },
  speed:   { name:'Engines',  icon:'⚡', tiers:[1.0, 1.20, 1.4, 1.7], costs:[0, 250, 700, 1800] },
};

// Carrier ability
export const CARRIER_FIGHTER_COOLDOWN = 20;   // seconds between launches
export const CARRIER_FIGHTER_COUNT    = 2;
