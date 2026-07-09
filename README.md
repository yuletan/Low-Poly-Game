# Low-Poly Command

A web-based, PvE **3D Real-Time Strategy** game built with **Three.js** and vanilla JavaScript modules. Command land, sea, and air forces across a vast low-poly battlefield, conquer enemy bases, and outmaneuver an adaptive AI on three difficulty levels.

![Status](https://img.shields.io/badge/status-playable-brightgreen)
![Engine](https://img.shields.io/badge/engine-Three.js-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)
![Mobile Ready](https://img.shields.io/badge/mobile-Android_ready-success)

---

## Features

### Core Gameplay
- **3 Combat Domains** — Land, Sea, and Air units with distinct movement rules
- **25+ Unit Types** — Infantry, Tanks, Heavy Tanks, Artillery, MLRS, Missile Defense, Coastal Batteries, Destroyers, Frigates, Cruisers, Battleships, Carriers, Submarines, Transports, Fighters, Bombers, B2 Bombers, Helicopters, Gunships, Escort Jets, Escort Bombers, Healer Trucks
- **7 Strategic Bases** — Capture all enemy bases (including the heavily defended Main Base) to win
- **Terrain Bonuses** — Ships gain damage in open sea, tanks get defense in mountains
- **RNG Combat** — Hit chance, splash damage with falloff, and distance-based damage modifiers
- **Formations** — Line, Wedge, Square, and Column for coordinated movement

### Upgrade System (4 Stats, 3 Tiers Each)
| Upgrade | T1 | T2 | T3 |
|---------|----|----|-----|
| Armor | +20% HP | +50% HP | +100% HP |
| Firepower | +20% DMG | +50% DMG | +100% DMG |
| Engines | +10% SPD | +25% SPD | +50% SPD |
| Tactics | Formation bonus (+10% dmg) | Focus fire (target same enemy) | Combined arms (+25% dmg vs mixed domains) |

### Advanced Systems
- **Large Map** (1200x1200 world units) with 5 landmasses, mountains, and trees
- **A\* Pathfinding** — Units intelligently route around obstacles with line-of-sight smoothing
- **Fog of War** — 3-state visibility (unexplored / explored / visible)
- **Minimap** — Real-time tactical overview with click-to-jump camera
- **Carrier Ability** — Launch fighter squadrons (cooldown: 30s)
- **Naval Transport** — Transport ships carry 10 land units across water with auto-embark/disembark
- **Healer Truck** — Auto-heals nearby damaged allied units
- **Submarine Stealth** — Invisible until first attack, 3x first-strike damage
- **Save / Load** — Full game state persistence via localStorage
- **3-Tier AI** — Easy (defensive), Normal (balanced), Hard (combined-arms aggression)

---

## UI/UX Design

### Modern Interface
- **Glassmorphism panels** — Translucent dark panels with backdrop blur and glow effects
- **Bottom Armory Dock** — Horizontal card layout (StarCraft 2 style) with tab switching: Land / Sea / Air / Upgrades
- **Enhanced Tooltips** — Grid stat layout with domain badges, HP, DMG, RNG, SPD, Fire Rate, Hit %
- **Context-Sensitive** — Units grayed out if can't be built at selected base; green border when affordable
- **Selection Panel** (bottom-left) — Grouped unit portraits with combined stats, transport Load/Unload buttons
- **Formation Buttons** — Visual SVG icons (Line, Wedge, Square, Column) in selection panel
- **Top Bar** — Money, Bases, Units, Enemy count, plus HQ / Launch / Fleet / Help buttons
- **Dropdown Menu** — Save, Load, Sound toggle
- **Help Modal** — 4 tabbed sections: Controls, Gameplay, UI Guide, Quick Start
- **Tutorial Overlay** — 5-step first-launch walkthrough with highlight cutouts
- **Mobile Responsive** — Panels resize, horizontal scroll for armory, touch-friendly buttons

### Hotkeys
| Key | Action |
|-----|--------|
| W A S D | Move camera |
| F | Focus camera on HQ |
| Ctrl+A | Select all units |
| Escape | Deselect / Close menus |
| H | Toggle help menu |
| F1-F4 | Change formation (Line/Wedge/Square/Column) |
| 1-9 | Quick-build unit (Armory order) |

---

## Quick Start

### Web Browser (Development)

**Option 1 — Vite Dev Server (recommended)**
```bash
npm install
npm run dev
# Opens http://localhost:5173 automatically
```

**Option 2 — Python (manual)**
```bash
python -m http.server 8000
# Open http://localhost:8000
```

**Option 3 — Node.js**
```bash
npx serve
```

### Mobile (Android)

See the [Mobile Build](#mobile-build-android) section below.

---

## How to Play

### Objective
Conquer all 6 enemy bases before the AI captures your Player HQ.

### Controls
| Action | Input |
|--------|-------|
| Pan camera | W A S D or Arrow keys |
| Zoom | Mouse wheel |
| Select unit | Left-click |
| Box select | Left-click + drag |
| Deselect | Left-click empty ground |
| Move units | Right-click on ground |
| Attack target | Right-click on enemy |
| Jump camera | Click on minimap |
| Change formation | F1-F4 or selection panel buttons |
| Buy unit | Click in Armory (bottom dock) |
| Upgrade stat | Click in Armory > Upgrades tab |
| Launch fighters | Select carrier, click Launch button |
| Transport | Select transport, use Load/Unload buttons |
| Save game | Menu > Save |
| Load game | Menu > Load |
| Toggle sound | Menu > Sound |

### Economy
- Passive income: $12/sec per owned base
- Kill bounty: varies by unit (typically 30%-50% of build cost)
- Capture reward: $200 per base conquered

### Combat Tips
- Artillery and MLRS outrange most units — use them to soften defenses
- Battleships rule open sea — use them to bombard coastal bases
- Bombers deal massive damage but are vulnerable to fighters and missile defense
- Missile Defense shreds air units — protect your bases with them
- Submarines ambush unsuspecting ships with 3x first-strike damage
- Transport ships let you move land armies across water — escort them!
- Healer trucks keep your assault force alive
- Upgrade Engines early to outmaneuver the enemy
- Tactics upgrade gives formation bonus — keep units in groups for +10% damage

---

## Project Architecture
```
rts-game/
├── index.html              # Minimal shell, error handlers, JS module entry
├── styles.css              # Glassmorphism theme, mobile responsive, all UI styling
├── package.json            # npm project + Vite + Capacitor dependencies
├── vite.config.js          # Bundles Three.js locally for mobile
├── capacitor.config.ts     # Capacitor Android configuration
├── dist/                   # Built web assets (served to Capacitor)
│   ├── index.html
│   └── assets/
├── js/
│   ├── main.js             # Bootstrap, render loop, camera
│   ├── game.js             # Game, Unit, Base classes
│   ├── config.js           # All balance numbers, unit stats, upgrades, AI config
│   ├── terrain.js          # Map generation
│   ├── unitFactory.js      # Low-poly 3D mesh builders
│   ├── combat.js           # Projectiles, RNG, explosions
│   ├── input.js            # Mouse + Touch controls
│   ├── ai.js               # Enemy AI with staging system
│   ├── ui.js               # Dynamic UI creation (armory, selection, top bar, help, tutorial)
│   ├── minimap.js          # 2D tactical map
│   ├── upgrades.js         # Upgrade tier system with 4 stats
│   ├── fogOfWar.js         # Visibility grid
│   ├── sound.js            # Web Audio synthesis
│   ├── pathfinder.js       # A* pathfinding
│   └── saveLoad.js         # localStorage persistence
├── android/                # Capacitor Android project (auto-generated)
└── README.md
```

### UI Architecture
All UI elements are created dynamically by `js/ui.js` at game start. The HTML contains only the canvas container, start/end menus, and error handlers. This eliminates DOM timing issues and keeps the HTML minimal.

---

## Mobile Build (Android)

### Prerequisites
- Node.js 18+
- Android Studio with Android SDK
- Java JDK 17+

### Setup Commands
```bash
npm install
npx cap init
npx cap add android
npm run cap:sync
npx cap open android
```

### Development Mode
```bash
npm run dev
# In another terminal:
npx cap sync android
```

### Building APK
1. Open `android/` in Android Studio
2. Build > Build Bundle(s) / APK(s) > Build APK(s)
3. APK at `android/app/build/outputs/apk/debug/app-debug.apk`

---

## Visual Design
- Pure low-poly 3D — no 2D sprites
- Recognizable silhouettes — tanks have turrets, jets have swept wings, ships have bridges
- Faction tinting — enemy units mix base color with red
- Animated deaths — jets spiral, ships sink, tanks burst into particles
- Procedural FX — all explosions, muzzle flashes, and projectiles are runtime-generated meshes

---

## Difficulty Levels
| Difficulty | AI Income | Spawn Rate | Max Attack Group | HP Mult | Composition |
|------------|-----------|------------|------------------|---------|-------------|
| Easy | 0.6x | 1/sec | 10 | 1.0x | Infantry + tanks |
| Normal | 1.0x | 2/sec | 20 | 1.0x | Balanced + fighters + missile defense |
| Hard | 1.5x | 4/sec | 50 | 2.0x | Combined arms, builds defenses |

---

## Technical Highlights

### Build System
- **Vite** — Fast ESBuild-based bundler
- **Capacitor** — Native Android wrapper
- **Three.js** — npm dependency (no CDN)

### Performance
- Single A* grid (100x100 cells) precomputed at start
- Path smoothing drops unnecessary waypoints
- Fog of war updates 4x/sec
- Vertex-color fog rendering uses single transparent plane
- Pooled projectiles & explosions — no GC spikes
- Bounding-box collisions — no per-poly physics

### Audio
- Zero asset files — all SFX synthesized via Web Audio oscillators
- Triggers: fire, explosion, select, move, build, upgrade, capture, launch, error

### Save Format
- localStorage key `rts_save_v1`
- Includes: money, difficulty, formation, upgrade tiers, bases, units, fog grid, camera

### Testing
- 70 unit tests across 6 test files (vitest + jsdom)
- Covers: config, AI staging, game logic, unit factory, input, transport

---

## Unit Reference

### Land Units
| Unit | HP | DMG | Range | Speed | Cost | Special |
|------|----|-----|-------|-------|------|---------|
| Infantry | 50 | 8 | 18 | 14 | $50 | Captures bases |
| Tank | 200 | 50 | 50 | 10 | $200 | |
| Heavy Tank | 1000 | 1500 | 30 | 10 | $500 | Short-range devastation |
| Artillery | 120 | 128 | 96 | 6 | $300 | Creeping barrage |
| MLRS | 80 | 15x10 | 110 | 10 | $350 | Salvo rocket spread |
| Missile Defense | 500 | 300 | 85 | - | $500 | Air-only homing missiles |
| Coastal Battery | 400 | 100 | 120 | - | $400 | Sea-only defense |
| Minigunner | 75 | 12 | 16 | 12 | $75 | Rapid fire |
| Minigunner Vehicle | 300 | 40 | 22 | 14 | $300 | Mobile gun platform |
| Crusher | 2000 | 2000 | 15 | 6 | $1000 | Siege unit |
| Healer Truck | 150 | - | 30 | 10 | $500 | Heals allies |
| Mega Medic | 300 | - | 35 | 8 | $800 | Heals + buffs |

### Sea Units
| Unit | HP | DMG | Range | Speed | Cost | Special |
|------|----|-----|-------|-------|------|---------|
| Destroyer | 250 | 45 | 96 | 12 | $250 | Flak vs air |
| Frigate | 150 | 20 | 60 | 18 | $150 | Fast escort |
| Cruiser | 200 | 40 | 100 | 16 | $300 | Air-only homing |
| Battleship | 600 | 130 | 160 | 9 | $600 | Shore bombardment |
| Carrier | 800 | 15 | 60 | 10 | $1800 | Launches 12 fighters |
| Submarine | 100 | 90 | 50 | 11 | $400 | Stealth + 3x first strike |
| Transport | 400 | 0 | 0 | 42 | $350 | Carries 10 land units |

### Air Units
| Unit | HP | DMG | Range | Speed | Cost | Special |
|------|----|-----|-------|-------|------|---------|
| Fighter | 80 | 35 | 45 | 32 | $250 | Air superiority |
| Bomber | 180 | 140 | 30 | 18 | $500 | Carpet bomb AOE |
| Helicopter | 120 | 25 | 55 | 16 | $350 | Versatile attacker |
| Gunship | 250 | 40 | 65 | 14 | $500 | Heavy barrage |
| B2 Bomber | 800 | 1000 | 25 | 20 | $800 | Massive AOE |
| Escort Jet | 2000 | 10 | 10 | 25 | $800 | Intercepts air threats |
| Escort Bomber | 5000 | 0 | 0 | 22 | $500 | Decoy |
| Med Heli | 180 | 0 | 40 | 14 | $600 | Heals air units |

### Terrain Bonuses
| Domain | Terrain | Damage | HP |
|--------|---------|--------|----|
| Sea | Open Sea | +20% | +20% |
| Sea | Coast | -10% | - |
| Land | Mountain | - | +15% |
| Land | Coast | -10% | -10% |

---

## Roadmap
- [ ] A* visualization debug mode
- [ ] Research tree (unlock advanced units)
- [ ] Multiplayer via WebRTC
- [ ] Replay system
- [ ] Custom map editor
- [ ] Unit veterancy (XP for kills)

---

## License
MIT License — free to use, modify, and distribute.

---

## Credits
- Three.js — 3D rendering engine (threejs.org)
- Vite — Build tool and dev server (vitejs.dev)
- Capacitor — Cross-platform native runtime (capacitorjs.com)
- Built with vanilla JavaScript ES Modules — no React, no Vue
