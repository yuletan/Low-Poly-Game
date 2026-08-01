// mobileShell.js — Compact landscape-first mobile shell. Reuses the existing
// armory and selection panels as drawers and exposes contextual commands.

import { Capacitor } from '@capacitor/core';
import { createUIStateStore } from './uiStateStore.js';

function mobileEnvironment() {
  return Capacitor.isNativePlatform() || window.matchMedia('(pointer: coarse)').matches;
}

function button(label, attrs = '') {
  return `<button type="button" ${attrs}>${label}</button>`;
}

export function initMobileShell(game, commands, options = {}) {
  if (!mobileEnvironment()) return null;

  const root = document.documentElement;
  const state = options.state || createUIStateStore();
  game.uiStore = state;
  root.classList.add('mobile-ui');

  const commandBar = document.createElement('nav');
  commandBar.id = 'mobileCommandBar';
  commandBar.setAttribute('aria-label', 'Unit commands');

  const selectionChip = document.createElement('button');
  selectionChip.id = 'mobileSelectionChip';
  selectionChip.type = 'button';
  selectionChip.textContent = 'No selection';

  const buildButton = document.createElement('button');
  buildButton.id = 'mobileBuildButton';
  buildButton.type = 'button';
  buildButton.textContent = 'Build';

  const mapButton = document.createElement('button');
  mapButton.id = 'mobileMapButton';
  mapButton.type = 'button';
  mapButton.textContent = 'Map';

  const backdrop = document.createElement('button');
  backdrop.id = 'mobileDrawerBackdrop';
  backdrop.type = 'button';
  backdrop.setAttribute('aria-label', 'Close open panel');

  const moreMenu = document.createElement('div');
  moreMenu.id = 'mobileMoreMenu';
  moreMenu.setAttribute('role', 'menu');

  const rotateNotice = document.createElement('div');
  rotateNotice.id = 'mobileRotateNotice';
  rotateNotice.innerHTML = '<strong>Rotate to landscape</strong><span>Low-Poly Command uses a landscape battlefield and compact side drawers.</span>';

  document.body.append(commandBar, selectionChip, buildButton, mapButton, backdrop, moreMenu, rotateNotice);

  function closeMore() {
    root.classList.remove('mobile-more-open');
  }

  function setDrawerClass(drawer) {
    root.classList.toggle('mobile-drawer-open', Boolean(drawer));
    root.classList.toggle('mobile-armory-open', drawer === 'armory');
    root.classList.toggle('mobile-selection-open', drawer === 'selection');
    root.classList.toggle('mobile-menu-open', drawer === 'menu');
  }

  state.subscribe(next => {
    setDrawerClass(next.drawer);
    root.classList.toggle('mobile-map-collapsed', next.minimap === 'collapsed');
    root.classList.toggle('debug-ui', next.debugVisible);
  });

  function renderSelectionChip(context) {
    if (!context.hasSelection) {
      selectionChip.textContent = 'No selection';
      return;
    }
    const transports = game.selectedUnits.filter(unit => unit?.alive && unit.isTransport);
    if (transports.length) {
      const carried = transports.reduce((sum, unit) => sum + (unit.carriedUnits?.length || 0), 0);
      const capacity = transports.reduce((sum, unit) => sum + (unit.transportCapacity || 0), 0);
      selectionChip.textContent = `${context.count} selected - cargo ${carried}/${capacity}`;
      return;
    }
    selectionChip.textContent = `${context.count} unit${context.count === 1 ? '' : 's'} selected`;
  }

  function modeButton(label, mode, active) {
    return button(label, `data-mode="${mode}"${active ? ' class="active"' : ''}`);
  }

  function renderMore(context) {
    moreMenu.innerHTML = [
      context.hasMultiple ? button('Formation', 'data-action="formation"') : '',
      context.hasTransport ? button('Load', `data-action="load"${context.canLoad ? '' : ' disabled'}`) : '',
      context.hasTransport ? button('Unload', `data-action="unload"${context.canUnload ? '' : ' disabled'}`) : '',
      button('HQ', 'data-action="hq"'),
      button('Fleet', 'data-action="fleet"'),
      button('Help', 'data-action="help"'),
      button('Settings', 'data-action="settings"'),
      button('Menu', 'data-action="menu"')
    ].join('');
  }

  function renderCommands() {
    const context = commands.getSelectionContext();
    const current = state.getState();
    renderSelectionChip(context);
    renderMore(context);

    if (!context.hasSelection) {
      commandBar.innerHTML = [
        button('Build', 'data-action="build"'),
        button('Select all', 'data-action="select-all"'),
        button('Map', 'data-action="map"'),
        button('Menu', 'data-action="menu"')
      ].join('');
      return;
    }

    if (context.hasTransport) {
      commandBar.innerHTML = [
        modeButton('Move', 'move', current.commandMode === 'move'),
        button('Load', `data-action="load"${context.canLoad ? '' : ' disabled'}`),
        button('Unload', `data-action="unload"${context.canUnload ? '' : ' disabled'}`),
        button('More', 'data-action="more"')
      ].join('');
      return;
    }

    commandBar.innerHTML = [
      modeButton('Move', 'move', current.commandMode === 'move'),
      modeButton('Attack', 'attack', current.commandMode === 'attack'),
      button('Stop', 'data-action="stop"'),
      button(context.hasMultiple ? 'Form' : 'More', `data-action="${context.hasMultiple ? 'formation' : 'more'}"`)
    ].join('');
  }

  function clickExisting(id) {
    document.getElementById(id)?.click();
  }

  function handleAction(action) {
    switch (action) {
      case 'build': state.toggleDrawer('armory'); break;
      case 'selection': state.toggleDrawer('selection'); break;
      case 'map': state.setMinimap(state.getState().minimap === 'collapsed' ? 'compact' : 'collapsed'); break;
      case 'menu': state.toggleDrawer('menu'); clickExisting('menuToggleBtn'); break;
      case 'more': root.classList.toggle('mobile-more-open'); break;
      case 'stop': commands.stopSelected(); break;
      case 'formation': commands.cycleFormation(); break;
      case 'load': commands.loadSelected(); break;
      case 'unload': commands.unloadSelected(); break;
      case 'hq': commands.focusHeadquarters(); break;
      case 'fleet': commands.enterFleetPlacement(); break;
      case 'help': clickExisting('helpBtn'); break;
      case 'settings': clickExisting('settingsBtn'); break;
      case 'select-all': clickExisting('selectAllBtn'); break;
      default: return;
    }
    if (!['build', 'selection', 'menu', 'more', 'map'].includes(action)) closeMore();
    renderCommands();
  }

  function delegatedClick(event) {
    const target = event.target.closest('button');
    if (!target) return;
    if (target.dataset.mode) {
      state.setCommandMode(target.dataset.mode);
      game.mobileCommandMode = target.dataset.mode;
      closeMore();
      renderCommands();
      return;
    }
    if (target.dataset.action) handleAction(target.dataset.action);
  }

  commandBar.addEventListener('click', delegatedClick);
  moreMenu.addEventListener('click', delegatedClick);
  selectionChip.addEventListener('click', () => handleAction('selection'));
  buildButton.addEventListener('click', () => handleAction('build'));
  mapButton.addEventListener('click', () => handleAction('map'));
  backdrop.addEventListener('click', () => { state.closeDrawer(); closeMore(); });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    state.closeDrawer();
    closeMore();
  });

  // Re-render after the canonical selection renderer runs. No polling loop.
  const existingUpdateSelection = game.updateSelectionUI?.bind(game);
  if (existingUpdateSelection) {
    game.updateSelectionUI = (...args) => {
      const result = existingUpdateSelection(...args);
      renderCommands();
      return result;
    };
  }

  game.mobileCommandMode = state.getState().commandMode;
  renderCommands();

  return {
    state,
    refresh: renderCommands,
    destroy() {
      commandBar.remove();
      selectionChip.remove();
      buildButton.remove();
      mapButton.remove();
      backdrop.remove();
      moreMenu.remove();
      rotateNotice.remove();
      root.classList.remove(
        'mobile-ui',
        'mobile-drawer-open',
        'mobile-armory-open',
        'mobile-selection-open',
        'mobile-menu-open',
        'mobile-more-open',
        'mobile-map-collapsed'
      );
    }
  };
}
