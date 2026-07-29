# Low-Poly Command

Low-Poly Command is a browser-based 3D real-time strategy game built with Three.js, vanilla JavaScript modules, Vite, and Capacitor. It supports land, sea, and air combat, base capture, formations, fog of war, upgrades, naval transport, and three AI difficulty levels.

## Project status

- Web application: Vite development and production builds
- Android wrapper: Capacitor 6
- Rendering: Three.js
- Tests: Vitest with jsdom
- Python helper: optional standard-library development server

## Gameplay

### Main systems

- Land, sea, and air units with domain-specific movement and targeting
- A* pathfinding and amphibious transport routes
- Base capture, passive income, build costs, and upgrades
- Line, wedge, square, and column formations
- Fog of war and a tactical minimap
- Carrier aircraft, submarine stealth, healing, artillery, and area damage
- Save and load through browser local storage
- Easy, Normal, and Hard AI profiles

### Desktop controls

| Action | Control |
| --- | --- |
| Pan camera | W A S D or arrow keys |
| Zoom | Mouse wheel |
| Select | Left-click |
| Box select | Left-click and drag |
| Move | Right-click terrain |
| Attack | Right-click an enemy |
| Focus headquarters | F |
| Select all | Ctrl+A / Cmd+A |
| Deselect or close | Escape |
| Help | H |
| Formation | F1-F4 or the selection panel |

### Mobile controls

The touch layer supports unit selection, box selection, camera pan, pinch zoom, movement, attack commands, formation controls, and transport actions. Keep command controls clear of device safe areas when changing the mobile layout.

## Requirements

- Node.js 18 or newer
- npm
- A modern browser with WebGL support
- Android Studio and JDK 17 for Android builds
- Python 3 only when using `start.py`

The Python helper uses only the standard library. No third-party Python package is required.

## Install and run

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

Alternative lightweight server:

```bash
python start.py
```

## Available scripts

```bash
npm run dev           # Start Vite development server
npm run build         # Create a production build in dist/
npm test              # Run the Vitest suite once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with V8 coverage
npm run check         # Run tests, then create a production build
npm run clean         # Remove generated build and coverage output
npm run cap:sync      # Build the web app and sync Capacitor
```

## Production build

```bash
npm run check
```

Generated output is written to `dist/`. The directory is intentionally ignored by Git and should be recreated from source rather than committed.

## Android build

The current project uses Capacitor 6.

```bash
npm install
npm run cap:sync
npx cap open android
```

When the native Android project has not been created yet:

```bash
npx cap add android
npm run cap:sync
```

Do not run `npx cap init` again when `capacitor.config.ts` already exists.

## Repository layout

```text
Low-Poly-Game/
├── index.html
├── styles.css
├── package.json
├── package-lock.json
├── capacitor.config.ts
├── vite.config.js
├── vitest.config.js
├── vercel.json
├── start.py
├── req.txt
├── scripts/
│   ├── clean.mjs
│   └── analyze-fps.mjs
├── __mocks__/
└── js/
    ├── main.js          Application bootstrap, renderer, camera, main loop
    ├── game.js          Match state and orchestration
    ├── unit.js          Unit state and behavior
    ├── base.js          Base state and capture behavior
    ├── ai.js            Enemy economy, defense, staging, and attacks
    ├── input.js         Desktop and touch input orchestration
    ├── mobileUI.js      Mobile command-bar presentation
    ├── ui.js            HUD, armory, dialogs, and selection display
    ├── config.js        Unit data, quality presets, and balance constants
    ├── pathfinder.js    Grid and route calculations
    ├── spatialGrid.js   Broad-phase proximity queries
    ├── terrain.js       Terrain generation and terrain queries
    ├── combat.js        Projectiles, damage, effects, and pools
    ├── unitFactory.js   Three.js unit meshes
    ├── unitVisuals.js   Shared unit visual helpers
    ├── minimap.js       Tactical map
    ├── fogOfWar.js      Visibility state
    ├── upgrades.js      Upgrade progression
    ├── sound.js         Runtime sound
    ├── saveLoad.js      Persistence
    ├── debug.js         Development logging switches
    ├── fpsDisplay.js    Runtime profiling overlay
    └── __tests__/       Automated tests
```

## Performance rules

Performance-sensitive code should follow these rules:

1. Never perform unrestricted whole-army scans from every unit on every frame.
2. Use the shared spatial grid for nearby-unit queries.
3. Stagger periodic work so all units do not target, repath, heal, or scan on the same frame.
4. Repath only when a destination cell changes, a route is exhausted, or a timeout is reached.
5. Reuse vectors, materials, geometries, projectiles, and effects where practical.
6. Keep DOM updates and minimap rendering on explicit intervals.
7. Keep debug logging disabled in production hot paths.
8. Build `dist/` from source; never use committed generated output as the source of truth.

## Testing

```bash
npm test
npm run build
```

Before merging gameplay or refactoring changes, verify at least:

- The game starts on each difficulty.
- Units can select, move, attack, pursue, and stop.
- Formations preserve unit assignment.
- Transport ships load, sail, unload, and release claims.
- AI staging eventually launches an attack.
- Save and load restore units, bases, upgrades, fog, and camera position.
- Low quality remains selected after resize and orientation changes.
- Touch input does not trigger duplicate mouse commands.

## Repository hygiene

Do not commit:

- `node_modules/`
- `dist/`
- coverage output
- local environment files
- IDE metadata
- Android build output
- temporary archives or duplicated source dumps
- FPS captures and ad-hoc debug output

Keep durable documentation in the README or a focused file under `docs/`. Delete temporary implementation plans once their work is represented by code, tests, or tracked issues.

## License

MIT. See `LICENSE`.
