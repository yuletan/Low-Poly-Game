// config.js — Single source of truth for balance numbers.

// ===== TERRAIN CONSTANTS =====
export const TERRAIN = {
  LAND: 'land',
  COAST: 'coast',
  SEA: 'sea',
  MOUNTAIN: 'mountain',
};
export const TERRAIN_BONUSES = {
  land: { land:{dmg:1.15,hp:1.15}, sea:{dmg:0.9, hp:0.9}, coast:{dmg:0.9, hp:0.9}, mountain:{dmg:0.9, hp:1.15} },
  sea:  { land:{dmg:0.9, hp:0.9},   sea:{dmg:1.2, hp:1.2},   coast:{dmg:1.0, hp:1.0},   mountain:{dmg:0.9, hp:0.9} },
  air:  { land:{dmg:1, hp:1},     sea:{dmg:1, hp:1},       coast:{dmg:1, hp:1},     mountain:{dmg:1, hp:1} },
};

export const CRIT_CHANCE = 0.10;
export const CRIT_MULT   = 1.5;

// ===== MAP SIZE =====
export const MAP_SIZE = 1200;     // World coords -600 to +600
export const GRID_CELL = 12;      // A* grid cell size in world units
export const GRID_SIZE = Math.ceil(MAP_SIZE / GRID_CELL); // cells per side

// ===== TERRITORY & BASES =====
export const BASE_HP_BASE = 500;
export const TERRITORY_RADIUS = 150;
export const TERRITORY_RADIUS_PER_SIZE = 150;

// ===== PROJECTILE TYPES =====
export const PROJECTILE_TYPES = {
  land: { speed: 80,  radius: 0.3, color: 0xffaa00 },   // orange shell
  sea:  { speed: 60,  radius: 0.5, color: 0x444466 },   // grey cannonball
  air:  { speed: 120, radius: 0.2, color: 0xff4400 },   // bright red missile
};

// Projectile pattern configs
export const PROJECTILE_PATTERNS = {
  default:   { burst: 1, burstDelay: 0, spread: 0 },
  burst:     { burst: 3, burstDelay: 0.08, spread: 5 },     // infantry: 3-round burst
  dual:      { burst: 2, burstDelay: 0.1, spread: 0 },       // destroyer: dual guns
  salvo:     { burst: 4, burstDelay: 0.15, spread: 15 },     // battleship: broadside
  homing:    { burst: 1, burstDelay: 0, spread: 0, homing: true }, // fighter: homing missile
  carpet:    { burst: 3, burstDelay: 0.2, spread: 0, carpet: true }, // bomber: carpet bomb line
  barrage:   { burst: 3, burstDelay: 0.4, spread: 0, barrage: true }, // artillery: creeping barrage
  ap:        { burst: 1, burstDelay: 0, spread: 0, ap: true }, // tank: armor piercing
};

// ===== UNITS =====
export const UNIT_TYPES = {
  infantry: { domain:'land',  hp:50,  damage:8,  range:18, speed:14, fireRate:1.0, hitChance:0.85, cost:50,  color:0x556b2f, canFireWhileMoving:false, bounty:30, projectile:'burst', splashRadius:0, splashFalloff:1, targetDomains:['land','building'] },
  tank:     { domain:'land',  hp:200, damage:50, range:50, speed:10, fireRate:1.5, hitChance:0.9,  cost:200, color:0x4a5d23, canFireWhileMoving:false, bounty:100, projectile:'ap', splashRadius:2, splashFalloff:0.5, targetDomains:['land','building'] },
  heavyTank:{ domain:'land',  hp:800, damage:220, range:32, speed:7,  fireRate:2.5, hitChance:0.9,  cost:650, color:0x3a3a2a, canFireWhileMoving:false, bounty:400, projectile:'ap', splashRadius:5, splashFalloff:0.5, targetDomains:['land','building'], special:'Heavy armor, slow turret' },
  crusher:  { domain:'land',  hp:600, damage:180, range:30, speed:9,  fireRate:2.0, hitChance:0.85, cost:550, color:0x553355, canFireWhileMoving:true, bounty:300, projectile:'ap', splashRadius:8, splashFalloff:0.5, targetDomains:['land','building'] },
  artillery:{ domain:'land',  hp:120, damage:128, range:96, speed:6,  fireRate:3.0, hitChance:0.7,  cost:300, color:0x6b5b3a, canFireWhileMoving:false, bounty:120, projectile:'barrage', splashRadius:3, splashFalloff:0.5, targetDomains:['land','building','sea-coastal'], special:'Fragile, slow fire rate' },
  mlrs:     { domain:'land',  hp:80,  damage:15, range:110, speed:8,  fireRate:4.0, hitChance:0.6,  cost:350, color:0x5b5b3a, canFireWhileMoving:false, bounty:120, projectile:'salvo', splashRadius:2, splashFalloff:0.4, targetDomains:['land','building'], special:'Barrage of 10 rockets' },
  missileDefense:{ domain:'land', hp:180, damage:60, range:120, speed:0, fireRate:2.0, hitChance:0.9, cost:400, color:0x884488, canFireWhileMoving:false, bounty:150, projectile:'homing', splashRadius:0, splashFalloff:1, targetDomains:['air','missile'], special:'Static anti-air' },
  coastal:  { domain:'land',  hp:250, damage:140, range:110, speed:0, fireRate:2.5, hitChance:0.9, cost:450, color:0x554433, canFireWhileMoving:false, bounty:150, projectile:'ap', splashRadius:2, splashFalloff:0.5, targetDomains:['sea','submarine-detected'], special:'Static coastal defense' },
  destroyer:{ domain:'sea',   hp:250, damage:45, range:96, speed:16, fireRate:1.2, hitChance:0.85, cost:250, color:0x8899aa, canFireWhileMoving:true, bounty:150, projectile:'dual', splashRadius:8, splashFalloff:0.5, targetDomains:['sea','air','submarine'], special:'Multi-role escort' },
  frigate:  { domain:'sea',   hp:150, damage:20, range:60, speed:18, fireRate:1.0, hitChance:0.85, cost:150, color:0x5a6a7a, canFireWhileMoving:true, bounty:60, projectile:'default', splashRadius:0, splashFalloff:1, targetDomains:['sea','submarine'] },
  cruiser:  { domain:'sea',   hp:200, damage:35, range:100, speed:14, fireRate:1.0, hitChance:0.9, cost:350, color:0x667788, canFireWhileMoving:true, bounty:100, projectile:'homing', splashRadius:0, splashFalloff:1, targetDomains:['air','missile'], special:'Fleet anti-air' },
  submarine:{ domain:'sea',   hp:100, damage:90, range:50, speed:11, fireRate:3.5, hitChance:0.85, cost:400, color:0x223344, canFireWhileMoving:false, bounty:150, projectile:'ap', splashRadius:0, splashFalloff:1, targetDomains:['sea'], special:'Stealth + 3× first strike', stealth:true, firstStrikeMultiplier:3 },
  battleship:{domain:'sea',   hp:600, damage:130, range:160, speed:9,  fireRate:3.5, hitChance:0.8,  cost:600, color:0x334455, canFireWhileMoving:true, bounty:300, projectile:'salvo', splashRadius:10, splashFalloff:0.6, targetDomains:['sea','land','building'], special:'Shore bombardment' },
  carrier:  { domain:'sea',   hp:800, damage:15, range:40, speed:10, fireRate:2.0, hitChance:0.7, cost:900, color:0x556677, canLaunchFighters:true, altitude:0, canFireWhileMoving:true, bounty:400, projectile:'default', splashRadius:0, splashFalloff:1, targetDomains:['sea'], special:'Launches aircraft' },
  transport:{ domain:'sea',   hp:400, damage:0,  range:0,  speed:14, fireRate:99, hitChance:0,   cost:350, color:0x8b7355, canFireWhileMoving:false, bounty:200, projectile:'default', splashRadius:0, splashFalloff:1, transportCapacity:4, targetDomains:[], special:'Carries 4 land units' },
  fighter:  { domain:'air',   hp:80,  damage:35, range:45, speed:32, fireRate:0.6, hitChance:0.9,  cost:250, color:0x9999aa, altitude:25, canFireWhileMoving:true, bounty:80, projectile:'homing', splashRadius:2, splashFalloff:0.5, targetDomains:['air'], special:'Air superiority' },
  heli:     { domain:'air',   hp:120, damage:25, range:55, speed:16, fireRate:0.8, hitChance:0.8,  cost:350, color:0x4a4a4a, altitude:15, canFireWhileMoving:true, bounty:90, projectile:'burst', splashRadius:1, splashFalloff:0.5, targetDomains:['land','sea'], special:'Versatile attacker' },
  gunship:  { domain:'air',   hp:250, damage:40, range:65, speed:14, fireRate:0.4, hitChance:0.8, cost:500, color:0x8899aa, altitude:20, canFireWhileMoving:true, bounty:200, projectile:'barrage', splashRadius:2, splashFalloff:0.5, targetDomains:['land','sea','building'], special:'Heavy barrage vs ground/sea' },
  bomber:   { domain:'air',   hp:180, damage:140, range:50, speed:18, fireRate:3.5, hitChance:0.75, cost:500, color:0x778899, altitude:30, canFireWhileMoving:true, bounty:160, projectile:'carpet', splashRadius:12, splashFalloff:0.5, targetDomains:['land','sea','building'], special:'Heavy payload' },
  escortJet:{ domain:'air',   hp:280, damage:30, range:65, speed:35, fireRate:0.5, hitChance:0.9, cost:550, color:0x556677, altitude:25, canFireWhileMoving:true, bounty:200, projectile:'homing', splashRadius:0, splashFalloff:1, targetDomains:['air','missile'], special:'Interceptor' },
  b2:       { domain:'air',   hp:400, damage:700, range:25, speed:20, fireRate:3.0, hitChance:0.9, cost:1100, color:0x333344, altitude:35, canFireWhileMoving:true, bounty:400, projectile:'carpet', splashRadius:18, splashFalloff:0.3, targetDomains:['land','sea','building'], special:'Massive AOE, one-way strike', oneWay:true },
  escortBomber:{ domain:'air',hp:700, damage:0,  range:0,  speed:22, fireRate:99, hitChance:0,   cost:450, color:0x444455, altitude:30, canFireWhileMoving:true, bounty:0, projectile:'default', splashRadius:0, splashFalloff:1, targetDomains:[], special:'Decoy, attracts AA fire', escortBomber:true, oneWay:true },
  healer:      { domain:'land',  hp:150, damage:0,  range:40, speed:9,  fireRate:1.0, hitChance:0,   cost:250, color:0x44aa44, canFireWhileMoving:false, bounty:100, projectile:'default', splashRadius:0, splashFalloff:1, targetDomains:['ally'], special:'Heals nearby units', healer:true },
  medHeli:     { domain:'air',   hp:100, damage:0,  range:35, speed:17, fireRate:1.0, hitChance:0,   cost:280, color:0x44aa44, altitude:15, canFireWhileMoving:false, bounty:100, projectile:'default', splashRadius:0, splashFalloff:1, targetDomains:['ally'], special:'Aerial healing', healer:true },
  minigunnerVehicle:{ domain:'land', hp:180, damage:45, range:48, speed:11, fireRate:0.15, hitChance:0.85, cost:280, color:0x886644, canFireWhileMoving:false, bounty:150, projectile:'burst', splashRadius:0, splashFalloff:1, targetDomains:['land','air'] },
  megaMedic:        { domain:'land', hp:220, damage:0,  range:50, speed:8,  fireRate:99, hitChance:0,   cost:320, color:0x44aa88, canFireWhileMoving:false, bounty:150, projectile:'default', splashRadius:0, splashFalloff:1, targetDomains:['ally'], special:'Area heal', healer:true },
  minigunner:       { domain:'land', hp:70,  damage:18, range:42, speed:7,  fireRate:0.12, hitChance:0.85, cost:90,  color:0x887755, canFireWhileMoving:false, bounty:50, projectile:'burst', splashRadius:0, splashFalloff:1, targetDomains:['land','air'] },
};

// ===== ECONOMY =====
export const STARTING_MONEY = 100000;
export const PASSIVE_INCOME = 20;

// ===== DIFFICULTY =====
export const DIFFICULTY = {
  easy:   { aiIncome:0.6, maxAttackGroup:10, hpMultiplier:1.0, baseHpMultiplier:1.0 },
  normal: { aiIncome:1.0, maxAttackGroup:20, hpMultiplier:1.0, baseHpMultiplier:2.0 },
  hard:   { aiIncome:1.5, maxAttackGroup:50, hpMultiplier:2.0, baseHpMultiplier:4.0 },
};

// ===== ENGAGEMENT RANGE =====
export const ENGAGE_RANGE_MULT = 1.56; // engage range = attack range * 1.3 * 1.2

// ===== UPGRADES =====
export const UPGRADES = {
  hp:      { name:'Armor',    icon:'🛡️', tiers:[1.0, 1.25, 1.5, 2.0], costs:[0, 300, 800, 2000] },
  damage:  { name:'Firepower',icon:'💥', tiers:[1.0, 1.25, 1.5, 2.0], costs:[0, 300, 800, 2000] },
  speed:   { name:'Engines',  icon:'⚡', tiers:[1.0, 1.20, 1.4, 1.7], costs:[0, 250, 700, 1800] },
};

// ===== CARRIER ABILITY =====
export const CARRIER_FIGHTER_COOLDOWN = 20;   // seconds between launches
export const CARRIER_FIGHTER_COUNT    = 2;
