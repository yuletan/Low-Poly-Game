// package.test.js — Tests for the shared modules introduced by the
// safe-change package: quality presets, runtime scheduler, transport
// coordinator ownership, and the mobile drawer state store.

import { describe, it, expect, vi } from 'vitest';

describe('Quality presets', () => {
  it('keeps the active preset pixel ratio after resize', async () => {
    const mod = await import('../config.js?v=8');
    mod.setActivePreset('low');

    // resizeRenderer() in main.js clamps to the active preset:
    //   renderer.setPixelRatio(Math.min(deviceRatio, activePreset.pixelRatio))
    const deviceRatio = window.devicePixelRatio || 1;
    const presetRatio = mod.activePreset.pixelRatio ?? 1;
    expect(Math.min(deviceRatio, presetRatio)).toBe(Math.min(deviceRatio, 1.0));
    expect(mod.activePreset.pixelRatio).toBe(1.0);
  });

  it('setActivePreset falls back to medium for unknown keys', async () => {
    const mod = await import('../config.js?v=8');
    mod.setActivePreset('not-a-preset');
    expect(mod.activePreset).toBe(mod.QUALITY_PRESETS.medium);
  });

  it('ultraLow preset keeps soft collision throttled', async () => {
    const mod = await import('../config.js?v=8');
    expect(mod.QUALITY_PRESETS.ultraLow.softCollisionInterval).toBe(0.20);
    expect(mod.QUALITY_PRESETS.ultraLow.pixelRatio).toBe(0.75);
  });
});

describe('RuntimeScheduler', () => {
  it('does not synchronize all entities', async () => {
    const { RuntimeScheduler } = await import('../runtimeScheduler.js');
    const scheduler = new RuntimeScheduler({ slotCount: 8 });
    const units = Array.from({ length: 16 }, (_, index) => ({ _debugId: index + 1 }));
    const phases = new Set(units.map(unit => scheduler.phaseFor(unit, 1)));
    expect(phases.size).toBeGreaterThan(1);
  });

  it('spreads first run of a task across time', async () => {
    const { RuntimeScheduler } = await import('../runtimeScheduler.js');
    const scheduler = new RuntimeScheduler({ slotCount: 8 });
    let firedAtStart = 0;
    for (let i = 0; i < 8; i++) {
      const unit = { _debugId: i };
      if (scheduler.shouldRun(unit, 'scan', 1.0)) firedAtStart += 1;
    }
    // Only the phase-0 unit may fire on the very first frame.
    expect(firedAtStart).toBeLessThanOrEqual(1);
    scheduler.update(0.9);
    let firedEarly = 0;
    for (let i = 0; i < 8; i++) {
      if (scheduler.shouldRun({ _debugId: i }, 'scan', 1.0)) firedEarly += 1;
    }
    // After 0.9s the phases still spread the same task across slots.
    expect(firedEarly).toBeLessThan(8);
  });
});

describe('Transport coordinator ownership', () => {
  async function makeWorld(troopCount, shipCount) {
    const THREE = await import('three');
    const { TransportCoordinator } = await import('../transportCoordinator.js');

    const pathfinder = {
      worldToGrid: (x, z) => ({ gx: Math.floor(x / 12), gy: Math.floor(z / 12) }),
      gridToWorld: (gx, gy) => ({ x: gx * 12 + 6, z: gy * 12 + 6 }),
      findNearestWalkable: vi.fn(() => ({ gx: 1, gy: 1 })),
      findPath: vi.fn(() => []),
    };

    const game = {
      pathfinder,
      playerUnits: [],
      enemyUnits: [],
      _currentTime: 10,
      money: 10000,
      spawn: vi.fn(() => ({
        _debugId: 999,
        alive: true,
        faction: 'player',
        isTransport: true,
        transportCapacity: 10,
        carriedUnits: [],
        _manualOrder: false,
        _manifestId: null,
        mesh: { position: new THREE.Vector3(50, 0.3, 50) }
      })),
      getUnitCost: () => 350,
    };

    for (let i = 0; i < troopCount; i++) {
      game.playerUnits.push({
        _debugId: i + 1,
        alive: true,
        faction: 'player',
        isTransport: false,
        domain: 'land',
        carried: false,
        state: 'waitingForTransport',
        _claimedByShip: null,
        _aiWaveId: 1,
        _transportData: {
          shipEmbarkPoint: new THREE.Vector3(20, 0, 20),
          shipDisembarkPoint: new THREE.Vector3(100, 0, 100)
        }
      });
    }

    for (let i = 0; i < shipCount; i++) {
      game.playerUnits.push({
        _debugId: 100 + i,
        alive: true,
        faction: 'player',
        isTransport: true,
        transportCapacity: 10,
        carriedUnits: [],
        _manualOrder: false,
        _manifestId: null,
        mesh: { position: new THREE.Vector3(0, 0.3, 0) }
      });
    }

    return { coordinator: new TransportCoordinator(game), game };
  }

  it('assigns a troop to at most one ship', async () => {
    const { coordinator, game } = await makeWorld(6, 1);
    coordinator.reconcile();

    const troops = game.playerUnits.filter(unit => !unit.isTransport);
    const claims = troops.map(unit => unit._claimedByShip).filter(Boolean);
    const keys = claims.map((ship, index) => `${troops[index]._debugId}:${ship._debugId}`);
    expect(new Set(keys).size).toBe(keys.length);
    expect(claims.length).toBe(6);
  });

  it('groups same-wave troops into one manifest', async () => {
    const { coordinator, game } = await makeWorld(6, 1);
    coordinator.reconcile();

    const manifest = [...coordinator.manifests.values()][0];
    expect(manifest).toBeDefined();
    expect(manifest.waveId).toBe(1);
    expect(manifest.troops.length).toBe(6);
    expect(manifest.ship._manifestId).toBe(manifest.id);
  });

  it('spawns additional ships across throttled reconcile cycles', async () => {
    const { coordinator, game } = await makeWorld(25, 1);
    coordinator.reconcile();

    // First cycle: idle ship + one throttled spawn cover 20 of 25 troops.
    expect(game.spawn).toHaveBeenCalledTimes(1);
    expect(coordinator.manifests.size).toBe(2);

    // After the spawn cooldown the remaining troops get a second ship.
    coordinator.spawnCooldown.player = 0;
    coordinator.reconcile();
    expect(game.spawn).toHaveBeenCalledTimes(2);
    expect(coordinator.manifests.size).toBe(3);
  });
});

describe('Mobile drawer state store', () => {
  it('keeps one mobile drawer open', async () => {
    const { createUIStateStore } = await import('../uiStateStore.js');
    const state = createUIStateStore();
    state.openDrawer('armory');
    state.openDrawer('selection');
    expect(state.getState().drawer).toBe('selection');
  });

  it('toggleDrawer closes the open drawer', async () => {
    const { createUIStateStore } = await import('../uiStateStore.js');
    const state = createUIStateStore();
    state.openDrawer('armory');
    state.toggleDrawer('armory');
    expect(state.getState().drawer).toBe(null);
  });

  it('rejects invalid drawer names', async () => {
    const { createUIStateStore } = await import('../uiStateStore.js');
    const state = createUIStateStore();
    state.openDrawer('bogus');
    expect(state.getState().drawer).toBe(null);
  });
});
