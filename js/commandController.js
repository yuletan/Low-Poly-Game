// commandController.js — Central unit command API shared by desktop input,
// mobile input, hotkeys, and UI buttons.

const FORMATIONS = ['line', 'wedge', 'square', 'column'];

export function createCommandController(game, inputCommands = {}) {
  function selectedAliveUnits() {
    return game.selectedUnits.filter(unit => unit?.alive && !unit.carried);
  }

  function selectedTransports() {
    return selectedAliveUnits().filter(unit => unit.isTransport);
  }

  function issueMove(point) {
    if (!point || selectedAliveUnits().length === 0) return false;
    return Boolean(inputCommands.issueMoveCommand?.(point));
  }

  function issueAttack(target) {
    if (!target || selectedAliveUnits().length === 0) return false;
    return Boolean(inputCommands.issueAttackCommand?.(target));
  }

  function stopSelected() {
    let stopped = 0;
    for (const unit of selectedAliveUnits()) {
      unit.path = [];
      unit.moveTarget = null;
      unit.attackMoveDest = null;
      unit.target = null;
      unit.state = 'idle';
      stopped += 1;
    }
    if (stopped) game.flashMessage?.(`Stopped ${stopped} unit${stopped === 1 ? '' : 's'}`);
    return stopped;
  }

  function setFormation(formation) {
    const normalized = FORMATIONS.includes(formation) ? formation : 'line';
    game.formation = normalized;
    game.updateSelectionUI?.();
    game.flashMessage?.(`Formation: ${normalized.toUpperCase()}`);
    return normalized;
  }

  function cycleFormation() {
    const current = FORMATIONS.indexOf(game.formation);
    return setFormation(FORMATIONS[(current + 1 + FORMATIONS.length) % FORMATIONS.length]);
  }

  function nearbyLoadCandidates(transport) {
    const candidates = [];
    const grid = game.spatialGrid;
    if (grid?.queryCircle) {
      grid.queryCircle(
        transport.mesh.position.x,
        transport.mesh.position.z,
        transport.loadRange || 12,
        unit => candidates.push(unit)
      );
    } else {
      candidates.push(...game.playerUnits);
    }
    return candidates;
  }

  function loadSelected() {
    let loaded = 0;
    for (const transport of selectedTransports()) {
      const candidates = nearbyLoadCandidates(transport);

      for (const unit of candidates) {
        if (!unit?.alive || unit.carried || unit.domain !== 'land') continue;
        if (!transport.canLoadUnit?.(unit)) continue;
        if (transport.loadUnit?.(unit)) loaded += 1;
        if (transport.carriedUnits.length >= transport.transportCapacity) break;
      }
    }
    game.updateSelectionUI?.();
    if (!loaded) game.flashMessage?.('No eligible units in loading range');
    return loaded;
  }

  function unloadSelected() {
    let unloaded = 0;
    for (const transport of selectedTransports()) {
      const before = transport.carriedUnits?.length || 0;
      if (before === 0) continue;
      transport.unloadAll?.();
      unloaded += before - (transport.carriedUnits?.length || 0);
    }
    game.updateSelectionUI?.();
    if (!unloaded) game.flashMessage?.('Selected transports are empty');
    return unloaded;
  }

  function focusHeadquarters() {
    const hq = game.bases.find(base => base.faction === 'player');
    if (!hq) return false;
    game.cameraTarget.x = hq.mesh.position.x;
    game.cameraTarget.z = hq.mesh.position.z;
    return true;
  }

  return {
    issueMove,
    issueAttack,
    stopSelected,
    setFormation,
    cycleFormation,
    loadSelected,
    unloadSelected,
    focusHeadquarters,
    enterFleetPlacement: () => game.enterFleetPlacementMode?.(),
    getSelectionContext() {
      const selected = selectedAliveUnits();
      const transports = selected.filter(unit => unit.isTransport);
      return {
        count: selected.length,
        hasSelection: selected.length > 0,
        hasMultiple: selected.length > 1,
        hasTransport: transports.length > 0,
        canLoad: transports.some(unit => (unit.carriedUnits?.length || 0) < unit.transportCapacity),
        canUnload: transports.some(unit => (unit.carriedUnits?.length || 0) > 0)
      };
    }
  };
}
