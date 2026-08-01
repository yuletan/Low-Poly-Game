// uiStateStore.js — Single source of truth for the open drawer, command mode,
// minimap state, and debug visibility used by the mobile shell and desktop UI.

const VALID_DRAWERS = new Set([null, 'armory', 'selection', 'menu', 'map']);
const VALID_MODES = new Set(['move', 'attack']);
const VALID_MAP_STATES = new Set(['collapsed', 'compact', 'expanded']);

export function createUIStateStore(initial = {}) {
  let state = Object.freeze({
    drawer: VALID_DRAWERS.has(initial.drawer) ? initial.drawer : null,
    commandMode: VALID_MODES.has(initial.commandMode) ? initial.commandMode : 'move',
    minimap: VALID_MAP_STATES.has(initial.minimap) ? initial.minimap : 'compact',
    debugVisible: Boolean(initial.debugVisible)
  });

  const listeners = new Set();

  function emit() {
    for (const listener of listeners) listener(state);
  }

  function update(patch) {
    const next = { ...state, ...patch };
    if (!VALID_DRAWERS.has(next.drawer)) next.drawer = null;
    if (!VALID_MODES.has(next.commandMode)) next.commandMode = 'move';
    if (!VALID_MAP_STATES.has(next.minimap)) next.minimap = 'compact';

    const changed = Object.keys(next).some(key => next[key] !== state[key]);
    if (!changed) return state;

    state = Object.freeze(next);
    emit();
    return state;
  }

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      listener(state);
      return () => listeners.delete(listener);
    },
    openDrawer(drawer) {
      return update({ drawer: VALID_DRAWERS.has(drawer) ? drawer : null });
    },
    closeDrawer() {
      return update({ drawer: null });
    },
    toggleDrawer(drawer) {
      return update({ drawer: state.drawer === drawer ? null : drawer });
    },
    setCommandMode(commandMode) {
      return update({ commandMode });
    },
    setMinimap(minimap) {
      return update({ minimap });
    },
    setDebugVisible(debugVisible) {
      return update({ debugVisible: Boolean(debugVisible) });
    },
    reset() {
      return update({ drawer: null, commandMode: 'move', minimap: 'compact' });
    }
  };
}
