// mobileUI.js — Mobile touch UI with command bar instead of long-press
import { Capacitor } from '@capacitor/core';

export function initMobileUI(game, commands) {
  const isMobile =
    Capacitor.isNativePlatform() ||
    window.matchMedia('(pointer: coarse)').matches;

  if (!isMobile) return null;

  document.documentElement.classList.add('mobile-ui');

  game.mobileCommandMode = 'move';

  const commandBar = document.createElement('nav');
  commandBar.id = 'mobileCommandBar';
  commandBar.setAttribute('aria-label', 'Unit commands');

  commandBar.innerHTML = `
    <button type="button" data-mode="move" class="active">
      Move
    </button>
    <button type="button" data-mode="attack">
      Attack
    </button>
    <button type="button" data-action="stop">
      Stop
    </button>
    <button type="button" data-action="formation">
      Form
    </button>
    <button type="button" data-action="load">
      Load
    </button>
    <button type="button" data-action="unload">
      Unload
    </button>
  `;

  document.body.appendChild(commandBar);

  commandBar.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;

    const mode = button.dataset.mode;
    const action = button.dataset.action;

    if (mode) {
      game.mobileCommandMode = mode;

      commandBar
        .querySelectorAll('[data-mode]')
        .forEach(element => {
          element.classList.toggle(
            'active',
            element.dataset.mode === mode
          );
        });

      return;
    }

    switch (action) {
      case 'stop':
        commands.stopSelected();
        break;

      case 'formation':
        commands.cycleFormation();
        break;

      case 'load':
        commands.loadSelected();
        break;

      case 'unload':
        commands.unloadSelected();
        break;
    }
  });

  return {
    getMode() {
      return game.mobileCommandMode;
    }
  };
}
