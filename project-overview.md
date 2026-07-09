# Project Overview: Low-Poly Command

A web-based, PvE **3D Real-Time Strategy** game built with **Three.js** and vanilla JavaScript. Command land, sea, and air forces across a low-poly battlefield, conquer enemy bases, and outmaneuver an adaptive AI on three difficulty levels.

---

## Directory Structure

```
War game/
├── .git/                          # Git repository
├── .gitignore                     # Git ignore rules
├── capacitor.config.ts            # Capacitor (Android) config
├── dist/                          # Built web assets (Vite output)
│   ├── index.html
│   └── assets/
├── js/                            # All game source code
│   ├── ai.js                      # Enemy AI controller
│   ├── combat.js                  # Projectiles, damage, explosions
│   ├── config.js                  # Game balance constants
│   ├── fogOfWar.js                # Visibility grid system
│   ├── game.js                    # Core Game, Unit, and Base classes
│   ├── input.js                   # Mouse + touch input handling
│   ├── main.js                    # Bootstrap, render loop, camera
│   ├── minimap.js                 # 2D tactical minimap
│   ├── pathfinder.js              # A* pathfinding engine
│   ├── saveLoad.js                # localStorage save/load
│   ├── sound.js                   # Web Audio synthesized SFX
│   ├── terrain.js                 # Map generation
│   ├── ui.js                      # HTML overlay UI binding
│   ├── unitFactory.js             # 3D mesh builders for all units
│   └── upgrades.js                # Upgrade tier system
├── node_modules/                  # npm dependencies
├── index.html                     # Main HTML (UI overlays + canvas mount)
├── styles.css                     # All styling (responsive, mobile)
├── package.json                   # Project config + dependencies
├── package-lock.json              # Locked dependency versions
├── vite.config.js                 # Vite bundler config
├── start.py                       # Python local server script
├── test.html                      # Test page
├── vercel.json                    # Vercel deployment config
├── opencode.json                  # opencode config
├── LICENSE                        # MIT License
├── README.md                      # Full project documentation
├── all-js-code.txt                # Consolidated copy of all JS files
└── project-overview.md            # This file
```

---

## What Each File Does

### Core Game Files (`js/`)

#### `js/config.js` (103 lines)
Single source of truth for all game balance numbers. Defines:
- **Terrain constants** — land, sea, coast, mountain, and their damage/HP bonuses per domain
- **Map settings** — 1200x1200 world, 12-unit grid cells
- **Unit stats** — 25+ unit types across land/sea/air domains with HP, damage, range, speed, cost, splash, bounty, projectile patterns, and special abilities
- **Economy** — starting money ($2500), passive income ($20/s)
- **Difficulty tiers** — Easy/Normal/Hard with AI income multipliers, HP scaling, attack group sizes
- **Upgrades** — Armor, Firepower, Engines with 4 tiers each (up to 2x multiplier)
- **Carrier settings** — fighter count, spawn interval, cooldown
- **Projectile patterns** — burst, dual, salvo, homing, carpet, barrage, AP

#### `js/main.js` (218 lines)
Application bootstrap and render loop. Sets up:
- Three.js scene with fog, sky-blue background
- PerspectiveCamera with WASD panning and mouse-wheel zoom
- WebGL renderer with mobile-specific DPR limiting and shadow toggling
- Start menu wiring — difficulty selection buttons, "Continue" save button
- `startGame()` — creates Game instance, initializes input/AI/UI subsystems
- `applySave()` — restores full game state from a save object
- `animate()` loop — calls `game.update(dt)` and renders each frame
- Resize handling for responsive canvas

#### `js/game.js` (3063 lines)
The largest file. Contains three major classes:

**`Unit` class (~2045 lines):**
- Full unit lifecycle: spawn, movement, attack, death, cleanup
- A*-based pathfinding with domain validation (land/sea/air)
- Transport ship system: load/unload units, amphibious pathfinding, embark/disembark phases
- Carrier ability: gradual fighter deployment with cooldown and auto-return
- Stealth mechanic (submarine): invisible until first attack, 5x first-strike damage
- Healer logic: auto-heals nearby friendly units, follows lowest-HP ally
- Crusher mechanic: absorbs friendly damage, pushes toward bases, provokes enemies
- Destroyer flak: every 3rd shot hits air units in radius
- Battleship broadside: bonus damage when broadside to target
- Air unit banking, sea unit bobbing animation
- HP bar with trail, hit flash, selection ring, range ring, death label
- Path arrow visualization for transport ships

**`Base` class (~165 lines):**
- Capturable buildings with HP, territory radius, defensive turret
- HP scales with distance from opposite HQ and difficulty
- Auto-defends: shoots nearest enemy in turret range
- Capture mechanic: switches faction, updates flag/HQ color, awards money
- Shipyard vs barracks mesh based on terrain

**`Game` class (~853 lines):**
- Orchestrates all systems: terrain, pathfinder, upgrades, fog, minimap
- Creates 7 bases (1 player HQ + 6 enemy)
- Unit purchase system with placement mode (click-to-place, Ctrl+click for groups)
- Fleet placement mode (carrier + escorts in formation)
- Soft collision between units
- Auto-spawns transport ships when troops are waiting
- HUD updates: money, bases owned, unit counts
- Win/lose condition checks
- Formation computation (line, wedge, square, column)

#### `js/ai.js` (438 lines)
Enemy AI controller with difficulty-scaled behavior:
- **Economy** — passive income from owned bases, scaled by difficulty
- **Unit composition** — Easy: infantry+tanks only; Normal: balanced + air/sea; Hard: full combined arms
- **Spawn system** — non-overlapping spawn points near bases, terrain-aware placement
- **Attack waves** — rally-then-attack pattern, builds up to group size before launching
- **Multi-target attacks** — 30% chance to split forces against multiple bases
- **Defense** — idle defenders near bases automatically engage threats
- **Reinforcement** — sends idle troops from other bases when one is under attack
- **Build-up warning** — flashes alert when enemy mass reaches 12+ units
- **Stationary defenses** — places missile defense and coastal batteries near bases
- **Proactive transport** — spawns transport ships when AI has multiple bases

#### `js/combat.js` (318 lines)
Projectile and damage system:
- **`Projectile` class** — parabolic arc for land, straight line for sea/air, trail effects
- **Impact logic** — RNG hit chance, critical hits (10% chance, 1.5x damage), splash damage with falloff
- **`createProjectilePattern()`** — multi-projectile patterns: burst, dual, salvo, homing, carpet, barrage, AP
- **Explosions** — particle burst + expanding splash ring visual
- **Hitscan system** — instant damage for sea/air units (no projectile travel)
- **Terrain bonus application** — modifies damage/HP based on domain and terrain type
- **Air trail cleanup** — fades missile trails over time

#### `js/fogOfWar.js` (86 lines)
Visibility grid system:
- 60x60 grid covering the 1200x1200 map
- Three states: unexplored (opaque black), explored (semi-transparent), visible (clear)
- Revealed by units (100-unit radius) and bases (200-unit radius)
- GPU-friendly DataTexture with per-pixel alpha
- Updated 4 times per second (not every frame)
- Serializable for save/load

#### `js/input.js` (686 lines)
Complete input system:
- **Mouse** — click to select, drag to box-select, right-click to move/attack
- **Touch** — tap to select, drag to pan, pinch to zoom, long-press for right-click command
- **Ground cursor** — animated ring + crosshair follows mouse when units selected
- **Hover tooltip** — shows HP/stats of units under cursor
- **Formation preview** — drag visualization for movement targets
- **Placement mode** — left-click confirms, right-click/Escape cancels
- **Minimap integration** — click to jump camera, placement mode support

#### `js/minimap.js` (190 lines)
2D tactical overview:
- Fixed 250x250 canvas in top-right corner
- Shows terrain outlines, mountain dots, territory circles
- Color-coded units: blue (player), red (known enemy), green (selected)
- White rectangle shows current camera view
- Click or drag to jump camera to any location
- Animated click pings
- Fog-aware: hides unexplored enemy units, dims explored-but-not-visible terrain

#### `js/pathfinder.js` (407 lines)
A* pathfinding engine:
- Pre-baked terrain grid (100x100 cells) for fast walkability lookups
- Domain-aware: land walks on land+coast+mountain, sea walks on sea+coast, air flies over everything
- **Transport pathfinding** — finds optimal embark/disembark coast pairs, computes walk+sea+walk multi-modal path
- **Path smoothing** — removes unnecessary waypoints using line-of-sight checks
- **BFS helpers** — nearest walkable cell, nearest coastline, all reachable coasts
- **MinHeap** — custom binary heap for efficient A* open set
- Anti-corner-cutting in path smoother

#### `js/saveLoad.js` (45 lines)
Game state persistence via localStorage:
- **`saveGame()`** — serializes money, difficulty, formation, upgrades, bases, all units (position, HP, rotation), fog grid, camera position
- **`loadSaveData()`** — reads and parses saved JSON
- **`hasSave()`** — checks if a save exists
- **`deleteSave()`** — removes save (used on restart)
- Save key: `rts_save_v1`

#### `js/sound.js` (162 lines)
Procedural audio synthesis (zero asset files):
- All 8 sound effects generated via Web Audio API oscillators and noise buffers
- **Fire** — square wave pitch drop
- **Explosion** — lowpass-filtered noise burst
- **Select** — quick sine chirp
- **Move** — triangle wave blip
- **Build** — ascending triad (C-E-G)
- **Upgrade** — sawtooth sweep up
- **Capture** — ascending quad notes (C-E-G-C)
- **Launch** — sawtooth engine-like sweep
- **Error** — descending square wave buzz
- Master volume at 30%, resume on first interaction

#### `js/terrain.js` (153 lines)
Map generation:
- 5 landmasses (rectangular islands of varying size)
- 18 mountains placed randomly on land (cone geometry, flat-shading)
- Beaches on large landmasses (sandy border strips)
- 80 trees (cylinder trunk + cone leaves)
- **`getTerrainAt(x,z)`** — returns terrain type at any world coordinate (checks mountains, landmasses, coastal edges)
- Sea is a flat plane at y=0, land blocks are at y=8 (LAND_HEIGHT)

#### `js/ui.js` (1029 lines)
HTML overlay controller:
- **Armory tabs** — Land/Sea/Air/Upgrades with unit buttons, cost display, hotkeys
- **Unit icons** — procedurally generated on canvas 2D (unique shape per unit type)
- **Tooltips** — hover shows full stats (HP, DMG, RNG, SPD, FR, HIT%)
- **Upgrade buttons** — gold-themed, shows current tier and next cost
- **Formation buttons** — Line/Wedge/Square/Column with visual icons
- **Top bar** — Launch fighters, Fleet placement, Focus HQ, Help, Save/Load/Sound dropdown
- **Selection panel** — grouped unit portraits with type stats, Load/Unload for transports
- **Help modal** — tabbed (Controls, Gameplay, UI Guide, Quick Start)
- **First-launch tutorial** — 5-step walkthrough with highlight overlays
- **Hotkeys** — F (HQ), Ctrl+A (select all), F1-F4 (formations), Escape, H (help)

#### `js/unitFactory.js` (1513 lines)
Low-poly 3D model builders:
- **Shared caches** — `MAT_CACHE` and `GEO_CACHE` for reuse across identical units
- **Material helpers** — metalMat, matteMat, glassMat, glowMat, trackMat
- **Geometry helpers** — boxGeo (RoundedBoxGeometry), cylGeo, sphereGeo
- **25+ unit builders** — each returns a THREE.Group with turrets, weapons, details
  - Land: infantry, tank, heavyTank, crusher, artillery, MLRS, missile defense, coastal, healer, minigunner vehicle, mega medic, minigunner
  - Sea: frigate, cruiser, submarine, destroyer/battleship (shared), carrier, transport
  - Air: helicopter, med heli, gunship, fighter/bomber (shared), escort jet, B2, escort bomber
- **Base builders** — `createBaseMesh()` (HQ with walls, flag, helipad), `createShipyardMesh()` (dock, crane, slips)
- **Projectile meshes** — land shell, sea cannonball, air missile (each with trail/exhaust)
- **Outlines** — edge lines on all non-transparent meshes for low-poly aesthetic

#### `js/upgrades.js` (61 lines)
Persistent upgrade system:
- **Three stats** — HP (Armor), Damage (Firepower), Speed (Engines)
- **Four tiers** each: 1.0x, 1.2x, 1.5x, 2.0x
- **Costs** scale exponentially: $0, $1000/$1500/$2000, $5000/$7500/$10000, $25000/$35000/$50000
- `applyTo()` — applies multipliers to a unit's base stats at spawn time
- `upgrade()` — deducts money, increments tier, retroactively updates all living player units
- Serializable for save/load

---

### Configuration & Build Files

#### `index.html` (123 lines)
Main HTML page:
- Start menu overlay with difficulty buttons (Easy/Normal/Hard)
- HUD: top bar (money, bases, unit count, difficulty), selection panel, armory panel
- Selection box for drag-select, placement mode indicator
- End screen (victory/defeat)
- Error handler script (shows JS errors on screen)
- Module script entry point: `js/main.js`

#### `styles.css` (609 lines)
Complete styling:
- Fullscreen canvas with no scroll
- Overlay/panel system with blue accent (#4af)
- Unit buttons: grid layout, icon + name + cost, hotkey badge, hover/affordable/disabled states
- Tooltip system with domain color badges (green=land, blue=sea, gold=air)
- Armory tabs (Land/Sea/Air/Upgrades)
- Formation visual buttons
- Selection panel with unit portraits
- Help modal with side navigation
- Top bar dropdown menu
- Death label (fixed position, red glow)
- Mobile responsive (max-width: 900px, safe area insets, touch-action: none)

#### `package.json`
- Name: `low-poly-command`, version 1.0.0
- Scripts: `dev` (vite), `build` (vite build), `cap:sync` (build + cap sync)
- Dependencies: Three.js 0.160+, Capacitor 6.0+
- DevDeps: Vite 5.0+, TypeScript 6.0+

#### `vite.config.js` (9 lines)
Minimal Vite config: root at `.`, output to `dist/`, target ES2020.

#### `capacitor.config.ts`
Capacitor Android configuration for native mobile deployment.

#### `vercel.json`
Deployment config for Vercel hosting.

#### `start.py`
Python local development server script.

---

## Architecture Summary

The game uses a **modular ES module architecture** bundled by Vite:

```
main.js (bootstrap)
  └── Game (game.js)
        ├── Terrain (terrain.js)
        ├── Pathfinder (pathfinder.js)
        ├── FogOfWar (fogOfWar.js)
        ├── Minimap (minimap.js)
        ├── UpgradeManager (upgrades.js)
        ├── Unit (game.js) — one per spawned unit
        ├── Base (game.js) — one per base on map
        ├── Projectile (combat.js) — one per active shot
        ├── AI (ai.js) — hooks into game.onAITick
        ├── Input (input.js) — mouse/touch event handlers
        ├── UI (ui.js) — HTML overlay controller
        └── Sound (sound.js) — global singleton
```

All balance data flows from `config.js`. Units are rendered via `unitFactory.js` (cached meshes). Combat uses `combat.js` for projectiles and `applyHitscanDamage()`. Save/load is handled by `saveLoad.js` with `localStorage`. Audio is fully procedural via `sound.js` (Web Audio API).
