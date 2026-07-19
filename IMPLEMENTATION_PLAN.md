# Implementation Plan — Performance, Refactor & Transport/AI Overhaul

This document is the agreed plan of record for three workstreams. It was written
**before** any code changes. It records the root-cause analysis (with `file:line`
evidence) and the phased implementation.

- **Issue 1** — Inconsistent FPS even on Ultra Low (GPU < 30% utilised ⇒ CPU-bound).
- **Issue 2** — Refactor bloated / overlapping / repetitive code.
- **Issue 3** — Transport ships & amphibious AI behaviour.

Baseline before changes: **98/98 vitest tests passing.**
After changes: **100/100 vitest tests passing** (2 new transport tests added).

---

## Implementation Status

### ✅ Phase 1 — Refactor (split + de-duplicate)
- **game.js split**: `unit.js` (Unit class), `base.js` (Base class), `game.js` (Game orchestrator) — `game.js` re-exports `Unit`/`Base` for compatibility
- **Shared modules created**: `unitVisuals.js` (HP bar, selection ring, range ring, disposal), `spatialGrid.js` (uniform-grid neighbour lookup), `debug.js` (shared verbose logging)
- **Dead code removed**: Task 10 `_acquireOpportunisticTarget` (broken — used undefined `_distanceTo` and `u.owner`/`u.isDead`), Task 11 `_acquireBaseRangeTarget` (redundant with `findTarget`), `_enemiesInRange` (unused), `_debugMarkPoint` (unused), `_findNearestCoast` (unused)
- **Magic numbers → config**: `BOARDING_RANGE`, `TRANSPORT_STANDOFF`, `STRANDED_TIMEOUT`, `FLEET_SAIL_DELAY`, `PROVOKE_INTERVAL`, `FIGHTER_SCAN_INTERVAL`, `PATH_LINE_THROTTLE`

### ✅ Phase 2 — FPS root-cause fixes
- **Geometry leak fixed**: EdgesGeometry cached per source geometry in `unitFactory.js` (EDGE_GEO_CACHE), HP bar + selection ring geometry shared via `unitVisuals.js`, cloned hit-flash/stealth materials tracked in `_clonedMats` and disposed via `disposeUnitVisuals()`
- **CPU-bound update throttled**: `updateHUD` → `activePreset.uiCheckInterval`, `_provokeEnemies` → 0.5s, `_fighterAutoReturn` → 0.25s, `_updatePathLine` → 0.1s
- **Hot-path allocations killed**: carrier fleet formation uses inline arithmetic (no Vector3), removed Task 10/11 `.filter()` allocations, fixed 3D→2D distance in auto-board check

### ✅ Phase 3 — Transport / AI amphibious redesign
- **Pre-position fleet**: `_updateTransportLogistics` spawns transports at the sea tile nearest the embark coast (not at a far base)
- **Load-then-sail only**: ships sail when full or all claimed troops aboard — no more 15s partial-fill departure (safety timeout at 30s)
- **Standoff disembark**: `findTransportPath` accepts `standoffDistance` parameter; AI passes `TRANSPORT_STANDOFF` (180 easy/normal, 120 hard)
- **Stranded-troop fix**: troops revert to idle after `STRANDED_TIMEOUT` (30s) if no transport arrives
- **Closest-base routing**: `_retreatToFriendlyBase` already picks nearest friendly base
- **Pathfinder scoring**: coast pairs scored by route cost + standoff penalty (weight 2.0), candidate slice increased from 8 to 12

### ✅ Phase 4 — Verification
- **100/100 tests passing** (98 original + 2 new transport pre-positioning tests)
- All changes behavior-preserving for existing tests
- New tests cover: embark-coast spawn, fallback-to-base spawn

---

## 1. Root-Cause Analysis

### 1.1 Inconsistent FPS (Issue 1)

FPS log (`fps_log_2026-07-19-07-35-17.csv`) breakdown via `analyze-fps.mjs`:

| Metric | Low-FPS windows | Notes |
|---|---|---|
| Frame | 55.2ms avg / 565ms p95max | ~18 fps |
| **Update** | **46.0ms avg (83% of frame)** | game logic dominates |
| Render | 7.4ms avg (13% of frame) | GPU is NOT the bottleneck |
| Geometries | **213 → 5190 (24× climb)** | memory leak |

Three distinct causes:

**(a) CPU-bound update loop.** On Ultra Low most throttles are disabled, but these
run **every frame for every unit** regardless of preset:
- `Unit._acquireOpportunisticTarget()` (`js/game.js:458`) — scans all enemies each frame.
- `Unit._acquireBaseRangeTarget()` (`js/game.js:461`) — scans all enemy bases each frame.
- `Unit._provokeEnemies()` (`js/game.js:632`) — O(n) scan for crushers/escort jets.
- `Unit._fighterAutoReturn()` (`js/game.js:554`) — scans all enemies per fighter.
- `Unit.takeDamage()` crusher absorption (`js/game.js:361`) — O(n) scan per hit.
- `Game.updateHUD()` → `updateSelectionUI()` (`js/game.js:3231`) — DOM work every frame.

Each of these also allocates (`new THREE.Vector3`, `.clone()`, `.filter()`, spreads),
producing GC churn. With ~100 units × ~107 targets this is 10k+ distance checks and
thousands of allocations per frame.

**(b) Geometry / material memory leak.** `renderer.info.memory.geometries` climbs
monotonically. Sources:
- `finishModel()` (`js/unitFactory.js:156`) creates a **new `THREE.EdgesGeometry` for
  every sub-mesh of every unit** — never cached, never disposed.
- Per-unit constructor geometry — selection ring (`game.js:123`), ring fill
  (`game.js:134`), and 4 HP-bar planes (`game.js:152-178`) — never disposed.
- Hit-flash material clones (`game.js:387`) and stealth material clones (`game.js:111`)
  — never disposed.
- `Unit.cleanup()` (`game.js:2240`) only disposes the range ring and path line; the unit
  mesh itself (and everything above) is merely `scene.remove()`d, which does **not**
  free GPU geometry. The leak drives the 500–600ms GC/frame spikes.

**(c) 200 fps / `update=0` windows.** These are caused by opening the **Help** or
**Settings** modal, which sets `game.paused = true` (`js/ui.js:889`, `js/ui.js:1301`).
Update stops but rendering continues at full speed. Expected behaviour, but it makes the
FPS graph look wildly inconsistent. Out of scope for "root causes only" — noted here so
the log is interpreted correctly.

**Decision (user):** fix root causes only (a + b). No frame cap, no auto-quality.

### 1.2 Code bloat / overlap (Issue 2)

- `js/game.js` is **3258 lines** holding `Unit` + `Base` + `Game` — the core readability
  problem.
- **Duplicated HP-bar logic**: `Unit._updateHpBar` (`game.js:1374`) + constructor block
  vs `Base._createHpBar`/`update` (`game.js:2399`, `2426`).
- **Duplicated path line/arrow**: `Unit._updatePathLine/_removePathLine` (`game.js:1233-1300`).
- **Duplicated "resume movement after attack"** blocks at `game.js:1675`, `1703`, `1832`.
- **Repeated faction→enemy-list pattern** (`faction === 'player' ? enemyUnits : playerUnits`)
  in 20+ places.
- **Dead code**: `Unit._enemiesInRange` (unused), never-set `attackOrder`, the redundant
  Task-11 `_savedMoveTargetBase` system competing with `_resumePath`.
- **Magic numbers** scattered (boarding range `14`, load range, standoff, fleet constants).
- **Inconsistent `?v=` import query strings** across modules.

### 1.3 Transport / amphibious AI (Issue 3)

All reported symptoms traced:

- **Half-filled / "1/10" boats** — ships sail on a 15 s boarding timeout
  (`game.js:1109`) or when "no more waiting", frequently with 1–2 of 10 troops aboard.
- **Troops stranded on shore** — island-based AI keeps spawning land units with no land
  route; ships abandon them after the timeout (`game.js:1151-1158`); boarding requires a
  troop within 14 units of a congested coast tile (`game.js:925`).
- **Ships sail far & empty to "prepare"** — `_updateTransportLogistics` (`game.js:3251`)
  spawns transports at a *base*, which then sail empty to the embark point.
- **No closest-base routing / no re-target on capture** — embark uses one shared plan;
  `_retreatToFriendlyBase` (`game.js:1319`) picks nearest friendly base but there is no
  closest-coast-to-target routing and no re-target when a base is captured.
- **Huge ship detours** — `findTransportPath` (`js/pathfinder.js:120-121`) slices coast
  candidates to 8 and pairs them blindly; sea A* + smoothing yields big round routes.
- **Disembark at the closest point** — troops unload right at the nearest coast, giving
  the player no reaction time.

**Decision (user):** standoff distance **180 units for Easy & Normal, 120 for Hard.**

---

## 2. Target Module Architecture

```
js/
├── config.js         # balance + new transport/fleet/perf constants (unchanged API)
├── unitVisuals.js    # NEW: shared HP bar, selection ring/fill, range ring,
│                     #      path line/arrow, disposeUnitMesh(), scratch vectors
├── spatialGrid.js    # NEW: uniform-grid neighbour/enemy lookup (kills O(n²))
├── unit.js           # NEW: Unit class (from game.js)
├── base.js           # NEW: Base class (from game.js)
├── transport.js      # NEW: amphibious logistics + fleet coordinator
├── game.js           # Game orchestrator only; re-exports Unit/Base for compatibility
├── pathfinder.js     # + coast-pair scoring by route cost + standoff
├── unitFactory.js    # + cached EdgesGeometry outlines
├── combat.js         # (unchanged API; pooled FX already present)
├── ai.js             # amphibious wave dispatch via transport.js
└── … (terrain, minimap, fogOfWar, sound, upgrades, saveLoad, ui, input, fpsDisplay)
```

Public API (`Game`, `Unit`, `Base`, method names, config exports) is preserved so
`main.js`, `input.js`, `ai.js`, `ui.js` and the test suite keep working.

---

## 3. Phases

### Phase 1 — Refactor (split + de-duplicate)
1. Add `js/unitVisuals.js` (HP bar, rings, path line, `disposeUnitMesh`, scratch vecs).
2. Add `js/spatialGrid.js` (rebuilt per tick; `queryCircle`).
3. Split `Unit` → `js/unit.js`, `Base` → `js/base.js`; `game.js` keeps `Game` and
   re-exports `Unit`/`Base`. Move amphibious logistics into `js/transport.js`.
4. Extract duplicated HP-bar / path-line / resume-movement / faction-list code.
5. Remove dead code (`_enemiesInRange`, `attackOrder`, Task-11 `_savedMoveTargetBase`).
6. Move magic numbers into `config.js`; standardise `?v=` queries.

### Phase 2 — FPS root-cause fixes
1. **Leak:** cache `EdgesGeometry` keyed by source geometry; share ring/HP-bar geometry;
   `disposeUnitMesh()` frees only per-instance resources on `cleanup()`. Add a
   geometry-count guard to the FPS logger/tests.
2. **Update loop:** throttle `_acquireOpportunisticTarget` / `_acquireBaseRangeTarget`
   behind staggered per-unit timers; route `findTarget`, `_provokeEnemies`, crusher
   absorption, healer, auras, `_fighterAutoReturn`, soft-collision through the spatial
   grid; replace hot-path `new Vector3`/`.clone()` with scratch vectors; throttle
   `updateHUD` to `activePreset.uiCheckInterval`.

### Phase 3 — Transport / amphibious redesign
1. `config.js`: `TRANSPORT_STANDOFF = { easy:180, normal:180, hard:120 }`, fleet/boarding
   constants.
2. **Pre-position fleet:** spawn wave transports at the sea tile nearest the embark
   coast, not at a far base.
3. **Load-then-sail only:** depart when full or all assigned troops aboard — remove the
   15 s partial-fill departure.
4. **Fleet cohesion:** wave ships hold until all ready, then sail together with spacing.
5. **Closest-base routing + re-target on capture.**
6. **Standoff disembark** (180/120 by difficulty) instead of the closest point.
7. **Cut detours:** score coast pairs by true route cost + standoff; one shared wave plan.
8. **Fix stranded shore troops** (recover/re-plan instead of waiting forever).
9. Update `js/__tests__/transport.test.js` to the new behaviour.

### Phase 4 — Verify & docs
- `npm test` green; re-capture FPS log (geometries flat, update-ms low/consistent, no
  500 ms spikes); update `IMPLEMENTATION_PLAN.md` + `project-overview.md`.

---

## 4. Verification Acceptance Criteria

- **FPS:** `Geometries` stable across a 2-minute log (no monotonic climb); `UpdateMs_avg`
  consistently low during active play; no 500 ms frame spikes.
- **Tests:** 98+ tests passing (updated where behaviour intentionally changed).
- **Transport:** waves board fully, sail together, land at standoff distance, re-target
  on base capture, and no troops are left stranded on the shore.
