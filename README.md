# Low-Poly Command

Low-Poly Command is a browser-based 3D real-time strategy game built with Three.js, vanilla ECMAScript modules, Vite, and Capacitor. It includes land, sea, and air combat, base capture, formations, fog of war, upgrades, carriers, transports, and three AI difficulty profiles.

## Project goals

- Keep the battlefield readable and responsive on desktop and mobile.
- Keep mobile play landscape-first with compact contextual controls.
- Avoid unrestricted whole-army work in per-frame or per-unit hot paths.
- Build generated output from source instead of tracking it in Git.
- Preserve visible gameplay behavior while systems are refactored behind stable interfaces.

## Requirements

- Node.js 18 or newer for the current toolchain.
- npm.
- A modern browser with WebGL support.
- Android Studio and JDK 17 for the current Capacitor 6 Android wrapper.
- Python 3 only when using the optional standard-library server.

## Install and run

```text
npm install
npm run dev
```

Production verification:

```text
npm run check
```

The production build is generated in `dist/`. The directory is ignored and must not be committed.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite development mode |
| `npm run build` | Generate the production web build |
| `npm run check` | Run tests and then build |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with V8 coverage |
| `npm run cap:sync` | Build and synchronize the Capacitor project |

## Controls

### Desktop

| Action | Control |
| --- | --- |
| Pan camera | W A S D or arrow keys |
| Zoom | Mouse wheel |
| Select | Left click |
| Box select | Left drag |
| Toggle selection | Shift click |
| Move | Right click terrain |
| Attack | Right click hostile target |
| Deselect / close | Escape |
| Focus headquarters | F |
| Select all | Ctrl+A or Cmd+A |
| Formation | F1 to F4 |

### Mobile landscape

The compact mobile shell uses contextual commands and exclusive drawers.

- Tap a friendly unit to select it.
- Use Move or Attack mode and then tap the destination or target.
- Open Build to access the armory drawer.
- Tap the selection summary to open grouped unit details.
- Use More for formation, carrier, fleet, headquarters, help, and settings actions.
- Load and Unload are shown only when a transport is selected.
- Portrait displays a rotate notice instead of compressing the full interface.

## Architecture

```text
js/
  main.js                  bootstrap renderer camera and main loop
  game.js                  match lifecycle and system orchestration
  unit.js                  stable unit object and delegated behavior
  ai.js                    enemy strategy staging wave roles and focus-fire
  input.js                 pointer touch and selection gestures
  ui.js                    desktop HUD dialogs and shared rendering
  mobileShell.js           compact mobile presentation
  uiStateStore.js          exclusive drawer and command state
  commandController.js     shared unit commands
  notificationQueue.js     deduplicated alerts
  runtimeScheduler.js      staggered periodic work
  transportCoordinator.js  manifests ship assignment and fleet release
  proximity.js             spatial-grid query helpers (aura healing targeting)
  unitIconRenderer.js      persistent shared icon cache
  pathfinder.js            grid routing
  spatialGrid.js           broad-phase neighbor queries
  minimap.js               tactical map
  fogOfWar.js              visibility state
  combat.js                projectiles damage and effects
  fpsDisplay.js            FPS overlay and profiling
  terrain.js               terrain height and surface queries
  unitFactory.js           unit and base mesh construction
  unitVisuals.js           hp bars selection rings and range rings
  upgrades.js              upgrade definitions and manager
  sound.js                 audio
  debug.js                 tlog/twarn helpers
  config.js                units quality presets and balance
  saveLoad.js              persistence
```

## Performance rules

1. Do not run unrestricted target, aura, healer, collision, transport, or path scans from every unit every frame.
2. Spread periodic work across phases.
3. Repath when a destination cell changes or a route expires, not on a synchronized global second.
4. Use the spatial grid for nearby entities: targeting, provoke, aura, and healing scans all query `game.spatialGrid` with the same per-candidate distance checks as the old full scans.
5. Keep transport ownership in explicit manifests.
6. Render UI only when its source state is dirty.
7. Reuse icon, geometry, material, vector, projectile, and effect objects where practical.
8. Disable production debug logging and profiler controls by default.
9. Import `config.js` exactly once, always as `./config.js` with no query string. Quality presets are mutable module state (`setActivePreset`), so a second versioned import silently freezes gameplay systems at the default preset. A test scans `js/` for `?v=` imports to prevent this from coming back.
10. Measure every performance change with `window.__perf` (see below) before and after; a phase is not done until its target is measurable on the machine that matters (mid-range Android for the mobile contract).

## Performance instrumentation

`game.perf` is an always-on frame-time tracker, independent of the debug FPS overlay:

- `fps` / `avgFrameMs` — rolling 60-frame average of wall-clock frame time.
- `worstFrameMs` — worst single frame within the trailing 2-second window.
- `drawCalls` — once-per-second sample of `renderer.info.render.calls`.

`window.__perf` exposes the live object once a game has started, so a match can be measured from the console. The overlay itself stays gated behind `?debug=1` (or dev mode).

## Performance phases

Performance work lands as one revertable commit per phase, with its README notes included in the same commit.

### Phase 1 — free wins

Rendering, timing, and allocation fixes with no gameplay change:

- Renderer created with `antialias:false`, `alpha:false`, `stencil:false`, `powerPreference:'high-performance'`, `desynchronized:true`. AA is off unconditionally (the low-poly style tolerates it; it was the most expensive pixel-fill cost on mobile).
- Simulation dt is capped at one 60 Hz step (`SIM_DT_CAP` in `main.js`): a stalled frame no longer produces a 50 ms physics jump, while the camera still runs at display rate.
- Scratch vectors in hot loops (`_deathLabelScratch`) and a per-unit terrain cache (`Unit._terrainAt`) collapse up to 4 `getTerrainAt` lookups per unit per frame into one real call.
- Per-unit work gates:
  - HP bars are only rewritten when the rendered state actually changes (trail converged, same HP, same visibility).
  - Path arrows rebuild only when the route changes; the start vertex is updated in place while a ship sails an unchanged route.
  - Infantry base-capture scans run at `CAPTURE_SCAN_INTERVAL` (0.25 s) with the 1 HP/s drain rate preserved, and no per-scan `filter()` allocation.
  - Carrier fighter-count scans run at `FIGHTER_COUNT_INTERVAL` (1 s) instead of every frame.
- Dead-unit cleanup compacts the army arrays in place instead of `.filter()` reallocating them each frame.
- Projectile/FX lists update backwards with swap-and-pop instead of O(n) `splice` per removal.
- `applyHitscanDamage` splash damage iterates the two army arrays directly instead of building a temporary combined array per hit.

## AI waves

Amphibious attack waves carry one shared wave id and objective. The objective keeps a small focus shortlist: wave members prefer shortlisted targets within engage range instead of each unit picking an unrelated target, and `_aiRole` (vanguard, ranged, anti-air, healer, reserve) shapes the landing formation — lead roles take the inner ring, reserve trails on the outer ring.

## Testing before merge

- Run `npm test`.
- Run `npm run build`.
- Verify every difficulty starts.
- Verify desktop selection, movement, attack, stop, formations, building, transport, save, and load.
- Verify mobile landscape drawers never overlap.
- Verify Low quality remains active after resize and rotation.
- Verify a large AI attack assembles before launch, then lands in role order and converges on its focus target.
- Verify each transport owns a unique manifest and fleet siblings release together.
- Run a 10-minute low-quality match with at least 150 units and inspect frame-time spikes.

## Repository hygiene

Do not commit dependencies, generated builds, coverage, local environment files, mobile build output, temporary archives, duplicated source dumps, profiling captures, or local agent/editor configuration.

## Native runtime

The repository currently uses Capacitor 6. Upgrade Capacitor in a separate branch only after the web UI and gameplay refactor are stable and tested.

## License

MIT. See `LICENSE`.
