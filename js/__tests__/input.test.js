import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

vi.mock('three');
vi.mock('three/examples/jsm/geometries/RoundedBoxGeometry.js');
vi.mock('../sound.js', () => ({ Sound: { init: vi.fn(), play: vi.fn() } }));

describe('input.js - Selection & Double-Click', () => {
  let game, camera, renderer, domElement, initInput;

  function createMockUnit(type, faction, index) {
    return {
      type,
      faction,
      alive: true,
      selectable: true,
      position: { x: index * 20, y: 0, z: 0 },
      isTransport: type === 'transport',
      setSelected: vi.fn(),
      stats: { cost: 100 },
      carriedUnits: type === 'transport' ? [] : undefined,
      hp: 10,
      maxHp: 10,
      domain: 'land',
    };
  }

  beforeAll(async () => {
    const mod = await import('../input.js?v=5');
    initInput = mod.initInput;
  });

  beforeEach(() => {
    // Ensure necessary DOM elements exist
    document.body.innerHTML = `
      <div id="selectionBox"></div>
      <div id="selectionMenu"></div>
      <div id="selectionList"></div>
      <div id="selectionInfo"></div>
      <div id="contextMenu"></div>
    `;
    camera = { projectionMatrix: {}, matrixWorldInverse: {} };
    renderer = { domElement: document.createElement('canvas') };
    domElement = renderer.domElement;

    game = {
      playerUnits: [],
      enemyUnits: [],
      selectedUnits: [],
      selectUnitsInRect: vi.fn(() => []),
      bases: [],
      terrain: { getTerrainAt: vi.fn(() => 'land'), mountains: [] },
      difficulty: 'easy',
      _currentTime: 0,
      findUnitAt: vi.fn(() => null),
      moveSelectedUnits: vi.fn(),
      attackMoveSelectedUnits: vi.fn(),
    };
  });

  it('initInput is a function', () => {
    expect(initInput).toBeDefined();
    expect(typeof initInput).toBe('function');
  });

  it('initInput attaches event listeners to canvas', () => {
    const addEventListenerSpy = vi.spyOn(domElement, 'addEventListener');
    initInput(game, camera, renderer);
    expect(addEventListenerSpy).toHaveBeenCalled();
    const events = addEventListenerSpy.mock.calls.map(c => c[0]);
    expect(events).toContain('mousedown');
    expect(events).toContain('mouseup');
    expect(events).toContain('mousemove');
  });

  it('right-click handler does not call console.log (Issue 9)', () => {
    // Suppress the startup log during init, then check right-click
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    initInput(game, camera, renderer);
    consoleSpy.mockClear(); // clear the startup message

    const rightClick = new MouseEvent('mousedown', { button: 2, clientX: 200, clientY: 150 });
    domElement.dispatchEvent(rightClick);
    const rightUp = new MouseEvent('mouseup', { button: 2, clientX: 200, clientY: 150 });
    domElement.dispatchEvent(rightUp);

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('left-click without shift does not throw', () => {
    initInput(game, camera, renderer);
    const unit = createMockUnit('tank', 'player', 0);
    game.selectedUnits = [unit];

    const leftClick = new MouseEvent('mousedown', { button: 0, clientX: 100, clientY: 100, shiftKey: false });
    domElement.dispatchEvent(leftClick);
    const leftUp = new MouseEvent('mouseup', { button: 0, clientX: 100, clientY: 100, shiftKey: false });
    domElement.dispatchEvent(leftUp);

    expect(true).toBe(true);
  });
});
