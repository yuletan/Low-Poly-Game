# ⚔️ Low-Poly Command

A web-based, PvE **3D Real-Time Strategy** game built with **Three.js** and vanilla JavaScript modules. Command land, sea, and air forces across a vast low-poly battlefield, conquer enemy bases, and outmaneuver an adaptive AI on three difficulty levels.

![Status](https://img.shields.io/badge/status-playable-brightgreen)
![Engine](https://img.shields.io/badge/engine-Three.js-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)
![Mobile Ready](https://img.shields.io/badge/mobile-Android_ready-success)

---

## 🎮 Features

### Core Gameplay
- **3 Combat Domains** — Land, Sea, and Air units with distinct movement rules
- **25+ Unit Types** — Infantry, Tanks, Heavy Tanks, Artillery, MLRS, Missile Defense, Coastal Batteries, Destroyers, Frigates, Cruisers, Battleships, Carriers, Submarines, Transports, Fighters, Bombers, B2 Bombers, Helicopters, Gunships, Escort Jets, Escort Bombers, Healer Trucks
- **7 Strategic Bases** — Capture all enemy bases (including the heavily defended Main Base) to win
- **Terrain Bonuses** — Ships gain damage in open sea, tanks get defense in mountains
- **RNG Combat** — Hit chance, splash damage with falloff, and distance-based damage modifiers
- **Formations** — Line, Wedge, Square, and Column for coordinated movement

### Advanced Systems
- 🗺️ **Large Expandable Map** (1200×1200 world units) with 5 landmasses, mountains, and trees
- 🧭 **A\* Pathfinding** — Units intelligently route around obstacles with line-of-sight smoothing
- 🌫️ **Fog of War** — 3-state visibility (unexplored / explored / visible)
- 🗺️ **Minimap** — Real-time tactical overview with click-to-jump camera
- ⬆️ **Upgrade System** — 3 tiers each for Armor, Firepower, and Engines (×2.0 max)
- 🔊 **Synthesized Audio** — 8 procedural sound effects via Web Audio API (no asset files!)
- ✈️ **Carrier Special Ability** — Launch fighter squadrons every 20 seconds
- 🚢 **Naval Transport** — Transport ships carry land units across water with auto-embark/disembark
- 🩹 **Healer Truck** — Auto-heals nearby damaged allied units
- 🕵️ **Submarine Stealth** — Invisible until first attack, 5× first-strike damage
- 💾 **Save / Load** — Full game state persistence via localStorage
- 🤖 **3-Tier AI** — Easy (defensive), Normal (balanced), Hard (combined-arms aggression, builds defenses)

---

## 🚀 Quick Start

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

See the [Mobile Build](#-mobile-build-android) section below.

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
- Passive income: $12/sec per owned base
- Kill bounty: varies by unit (typically 30%–50% of build cost)
- Capture reward: $200 per base conquered

### Combat Tips
- Artillery and MLRS outrange most units — use them to soften defenses from a distance
- Battleships rule open sea — use them to bombard coastal bases
- Bombers deal massive damage but are vulnerable to fighters and missile defense
- Missile Defense shreds air units — protect your bases with them
- Submarines ambush unsuspecting ships with 5× first-strike damage
- Transport ships let you move land armies across water — escort them!
- Healer trucks keep your assault force alive — protect them behind your front line
- Upgrade Engines early to outmaneuver the enemy

---

## 🏗️ Project Architecture
```
rts-game/
├── index.html              # UI overlays & Three.js mount point
├── styles.css              # All styling (mobile touch-action, safe areas)
├── package.json            # npm project + Vite + Capacitor dependencies
├── vite.config.js          # Bundles Three.js locally for mobile
├── capacitor.config.ts     # Capacitor Android configuration
├── dist/                   # Built web assets (served to Capacitor)
│   ├── index.html
│   └── assets/
├── js/
│   ├── main.js             # Bootstrap, render loop, camera (mobile DPR handling)
│   ├── game.js             # Game class, Unit class, Base class
│   ├── config.js           # All balance numbers & constants
│   ├── terrain.js          # Map generation
│   ├── unitFactory.js      # Low-poly 3D mesh builders (cached geometries/materials)
│   ├── combat.js           # Projectiles, RNG, explosions
│   ├── input.js            # Mouse + Touch controls (tap/drag/pinch/long-press)
│   ├── ai.js               # Enemy AI controller
│   ├── ui.js               # HTML overlay binding
│   ├── minimap.js          # 2D tactical map
│   ├── upgrades.js         # Upgrade tier system
│   ├── fogOfWar.js         # Visibility grid
│   ├── sound.js            # Web Audio synthesis
│   ├── pathfinder.js       # A* pathfinding
│   └── saveLoad.js         # localStorage persistence
├── android/                # Capacitor Android project (auto-generated)
└── README.md
```

---

## 📱 Mobile Build (Android)

### Prerequisites
- Node.js 18+
- Android Studio with Android SDK
- Java JDK 17+

### Setup Commands
```bash
# Install dependencies
npm install

# Initialize Capacitor (if not already done)
npx cap init

# Add Android platform
npx cap add android

# Build and sync to Android
npm run cap:sync

# Open in Android Studio
npx cap open android
```

### Development Mode
```bash
# Run Vite dev server
npm run dev

# In another terminal, watch for changes and sync
npx cap sync android
```

### Building APK
1. Open `android/` in Android Studio
2. Build → Build Bundle(s) / APK(s) → Build APK(s)
3. APK located at `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🎨 Visual Design Philosophy
- Pure low-poly 3D — no 2D sprites anywhere
- Recognizable silhouettes — tanks have rotating turrets, jets have swept wings, ships have bridges
- Faction tinting — enemy units mix base color with red for instant identification
- Animated deaths — jets spiral and crash, ships tilt and sink, tanks burst into particles
- Procedural FX — all explosions, muzzle flashes, and projectiles are runtime-generated meshes

---

## ⚖️ Difficulty Levels
| Difficulty | AI Income | Spawn Rate | Max Attack Group | HP Multiplier | Composition |
|------------|-----------|------------|------------------|---------------|-------------|
| Easy | 0.6× | 1/sec | 10 | 1.0× | Infantry + tanks |
| Normal | 1.0× | 2/sec | 20 | 1.0× | Balanced + fighters + missile defense |
| Hard | 1.5× | 4/sec | 50 | 2.0× | Combined arms, builds defenses, targets weak bases |

---

## 🛠️ Technical Highlights

### Build System
- **Vite** — Fast ESBuild-based bundler for development and production
- **Capacitor** — Native Android wrapper with WebView
- **Three.js** — Loaded as npm dependency (no CDN imports)

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
| Unit | Domain | HP | DMG | Range | Speed | Cost | Special |
|------|--------|----|-----|-------|-------|------|---------|
| Infantry | Land | 50 | 8 | 18 | 14 | $50 | Captures bases |
| Tank | Land | 200 | 50 | 50 | 10 | $200 | |
| Heavy Tank | Land | 1000 | 1500 | 30 | 10 | $500 | Short-range devastation |
| Artillery | Land | 120 | 128 | 96 | 6 | $300 | Creeping barrage |
| MLRS | Land | 80 | 15×10 | 110 | 10 | $350 | Salvo rocket spread |
| Missile Defense | Land | 500 | 300 | 85 | – | $500 | Air-only homing missiles |
| Coastal Battery | Land | 400 | 100 | 120 | – | $400 | Sea-only defense |
| Healer Truck | Land | 150 | – | 30 | 10 | $500 | Heals nearby allies |
| Destroyer | Sea | 250 | 45 | 96 | 12 | $250 | Flak vs air every 3rd shot |
| Frigate | Sea | 150 | 20 | 60 | 18 | $150 | Fast escort |
| Cruiser | Sea | 200 | 40 | 100 | 16 | $300 | Air-only homing |
| Battleship | Sea | 600 | 130 | 160 | 12 | $600 | Broadside mechanic |
| Carrier ✈️ | Sea | 800 | 20 | 160 | 8 | $700 | Launches fighters |
| Submarine | Sea | 100 | 150 | 50 | 10 | $350 | Stealth + 5× first strike |
| Transport | Sea | 1000 | – | – | 15 | $400 | Carries 4 land units |
| Fighter | Air | 80 | 35 | 45 | 30 | $300 | Dogfight bonus vs air |
| Bomber | Air | 180 | 140 | 30 | 18 | $500 | Carpet bomb AOE |
| Helicopter | Air | 120 | 25 | 40 | 25 | $350 | Burst fire |
| Gunship | Air | 250 | 35 | 60 | 14 | $600 | Ground-only barrage |
| B2 Bomber | Air | 800 | 1000 | 25 | 20 | $800 | Massive AOE, one-way |
| Escort Jet | Air | 2000 | 10 | 10 | 25 | $800 | Intercepts air threats |
| Escort Bomber | Air | 5000 | – | – | 22 | $500 | Decoy, one-way |

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
- Vite — Build tool and dev server (vitejs.dev)
- Capacitor — Cross-platform native runtime (capacitorjs.com)
- Built with vanilla JavaScript ES Modules — no React, no Vue
