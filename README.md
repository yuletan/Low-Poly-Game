# ⚔️ Low-Poly Command

A web-based, PvE **3D Real-Time Strategy** game built with **Three.js** and vanilla JavaScript modules. Command land, sea, and air forces across a vast low-poly battlefield, conquer enemy bases, and outmaneuver an adaptive AI on three difficulty levels.

![Status](https://img.shields.io/badge/status-playable-brightgreen)
![Engine](https://img.shields.io/badge/engine-Three.js-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)
![No Build Tools](https://img.shields.io/badge/build-none_required-success)

---

## 🎮 Features

### Core Gameplay
- **3 Combat Domains** — Land, Sea, and Air units with distinct movement rules
- **8 Unit Types** — Infantry, Tanks, Artillery, Destroyers, Battleships, Carriers, Fighters, Bombers
- **7 Strategic Bases** — Capture all enemy bases (including the heavily defended Main Base) to win
- **Terrain Bonuses** — Ships gain damage in open sea, tanks get defense in mountains
- **RNG Combat** — Hit chance, critical hits (10% for 1.5×), and distance-based damage falloff
- **Formations** — Line, Wedge, Square, and Column for coordinated movement

### Advanced Systems
- 🗺️ **Large Expandable Map** (1200×1200 world units) with 5 landmasses, mountains, and trees
- 🧭 **A\* Pathfinding** — Units intelligently route around obstacles with line-of-sight smoothing
- 🌫️ **Fog of War** — 3-state visibility (unexplored / explored / visible)
- 🗺️ **Minimap** — Real-time tactical overview with click-to-jump camera
- ⬆️ **Upgrade System** — 3 tiers each for Armor, Firepower, and Engines (×2.0 max)
- 🔊 **Synthesized Audio** — 8 procedural sound effects via Web Audio API (no asset files!)
- ✈️ **Carrier Special Ability** — Launch fighter squadrons every 20 seconds
- 💾 **Save / Load** — Full game state persistence via localStorage
- 🤖 **3-Tier AI** — Easy (defensive), Normal (balanced), Hard (combined-arms aggression)

---

## 🚀 Quick Start

### Prerequisites
- A modern browser (Chrome, Firefox, Edge, Safari)
- A local web server (because ES modules require HTTP)

### Run the Game

**Option 1 — VS Code Live Server (recommended)**
1. Install the **Live Server** extension
2. Open the project folder
3. Right-click `index.html` → **Open with Live Server**

**Option 2 — Python (start script)**
```bash
python start
```
Opens `http://localhost:8000` automatically in your browser.

**Option 2b — Python (manual)**
```bash
python -m http.server 8000
# Open http://localhost:8000
```

**Option 3 — Node.js**
```bash
npx serve
```
That's it — no build step, no npm install, no bundler. Three.js loads via an import map from a CDN.

---

## 🎯 How to Play

### Objective
Conquer all 6 enemy bases before the AI captures your Player HQ.

### Controls
| Action | Input |
|--------|-------|
| Pan camera | W A S D or Arrow keys |
| Zoom | Mouse wheel |
| Select unit | Left-click |
| Add to selection | Shift + Left-click |
| Box select | Left-click + drag |
| Deselect | Left-click empty ground |
| Move units | Right-click on ground |
| Attack target | Right-click on enemy |
| Jump camera | Click on minimap |
| Change formation | Dropdown (bottom-center) |
| Buy unit | Click in Armory (bottom-right) |
| Upgrade stat | Click gold buttons in Armory |
| Launch fighters | ✈️ Launch button (carriers only) |
| Save game | 💾 Save button |
| Load game | 📂 Load button |
| Toggle sound | 🔊 button |

### Economy
- Passive income: $10/sec per owned base
- Kill bounty: $25 per enemy unit destroyed
- Capture reward: $200 per base conquered

### Combat Tips
- Artillery outranges everything (range 70) but has slow fire rate
- Battleships rule open sea — use them to bombard coastal bases
- Bombers deal massive damage but are vulnerable to fighters
- Carriers can launch fighter squadrons mid-battle for surprise air support
- Upgrade Engines early to outmaneuver the enemy

---

## 🏗️ Project Architecture
```
rts-game/
├── index.html              # UI overlays & Three.js mount point
├── styles.css              # All styling
├── js/
│   ├── main.js             # Bootstrap, render loop, camera
│   ├── game.js             # Game class, Unit class, Base class
│   ├── config.js           # All balance numbers & constants
│   ├── terrain.js          # Map generation
│   ├── unitFactory.js      # Low-poly 3D mesh builders
│   ├── combat.js           # Projectiles, RNG, explosions
│   ├── input.js            # Mouse selection & commands
│   ├── ai.js               # Enemy AI controller
│   ├── ui.js               # HTML overlay binding
│   ├── minimap.js          # 2D tactical map
│   ├── upgrades.js         # Upgrade tier system
│   ├── fogOfWar.js         # Visibility grid
│   ├── sound.js            # Web Audio synthesis
│   ├── pathfinder.js       # A* pathfinding
│   └── saveLoad.js         # localStorage persistence
└── README.md
```

---

## 🎨 Visual Design Philosophy
- Pure low-poly 3D — no 2D sprites anywhere
- Recognizable silhouettes — tanks have rotating turrets, jets have swept wings, ships have bridges
- Faction tinting — enemy units mix base color with red for instant identification
- Animated deaths — jets spiral and crash, ships tilt and sink, tanks burst into particles
- Procedural FX — all explosions, muzzle flashes, and projectiles are runtime-generated meshes

---

## ⚖️ Difficulty Levels
| Difficulty | AI Income | Aggression | Attack Interval | Composition |
|------------|-----------|------------|-----------------|-------------|
| Easy | 0.6× | 30% | 25s | Infantry spam, small groups |
| Normal | 1.0× | 60% | 18s | Balanced with some fighters |
| Hard | 1.5× | 100% | 12s | Combined arms, targets weak bases |

---

## 🛠️ Technical Highlights

### Performance
- Single A* grid (100×100 cells) precomputed at game start
- Path smoothing drops unnecessary waypoints via line-of-sight checks
- Fog of war updates 4× per second (not every frame)
- Vertex-color fog rendering uses a single transparent plane, GPU-friendly
- Pooled projectiles & explosions — no garbage collection spikes
- Bounding-box collisions — no per-poly physics

### Audio
- Zero asset files — all 8 SFX synthesized via Web Audio oscillators & noise buffers
- Triggers: fire, explosion, select, move, build, upgrade, capture, launch

### Save Format
- Stored under localStorage key `rts_save_v1`
- Includes: money, difficulty, formation, upgrade tiers, all bases (HP + ownership), all units (HP + position + rotation), fog grid, camera position
- "Continue" button auto-appears on start menu when a save exists

---

## 📊 Unit Reference

### Unit Stats
| Unit | Domain | HP | DMG | Range | Speed | Cost |
|------|--------|----|-----|-------|-------|------|
| Infantry | Land | 50 | 8 | 18 | 14 | $50 |
| Tank | Land | 200 | 35 | 35 | 10 | $200 |
| Artillery | Land | 120 | 60 | 70 | 6 | $300 |
| Destroyer | Sea | 250 | 30 | 50 | 12 | $250 |
| Battleship | Sea | 600 | 80 | 80 | 7 | $600 |
| Carrier ✈️ | Sea | 500 | 20 | 30 | 6 | $700 |
| Fighter | Air | 80 | 25 | 40 | 30 | $300 |
| Bomber | Air | 180 | 90 | 25 | 18 | $500 |

### Terrain Bonuses
| Domain | Terrain | Damage | HP |
|--------|---------|--------|----|
| Sea | Open Sea | +20% | +20% |
| Sea | Coast | -10% | – |
| Land | Mountain | – | +15% |
| Land | Coast | -10% | -10% |
| Air | Any | – | – |

---

## 🐛 Known Issues / Roadmap

### Planned Features
- [ ] A* visualization debug mode (toggle key)
- [ ] Research tree (unlock advanced units)
- [ ] Multiplayer via WebRTC
- [ ] Replay system
- [ ] Custom map editor
- [ ] Unit veterancy (XP for kills)
- [ ] Naval transport for land units

### Known Limitations
- AI does not currently use carrier fighter-launch ability
- No diplomacy / multiple factions (only player vs. one AI)
- Mountain pathfinding uses circle approximation (occasional zigzag)

---

## 🤝 Contributing
This is a personal learning project, but contributions are welcome! Areas where help is appreciated:
- Balance tuning — playtest and suggest stat adjustments in `config.js`
- New unit types — add meshes in `unitFactory.js` and stats in `config.js`
- Visual polish — better death animations, particle effects
- AI improvements — smarter target selection, retreat behavior

---

## 📜 License
MIT License — free to use, modify, and distribute.

---

## 🙏 Credits
- Three.js — 3D rendering engine (threejs.org)
- Built entirely with vanilla JavaScript ES Modules — no React, no Vue, no bundler
