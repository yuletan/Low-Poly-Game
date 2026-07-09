import { vi } from 'vitest';

// ============================================================
// Mock document.body and DOM elements needed by the game
// ============================================================
beforeAll(() => {
  // Ensure body exists (jsdom provides it)
  if (!document.body) {
    const body = document.createElement('body');
    document.documentElement.appendChild(body);
  }

  // HUD elements needed by Game.updateHUD()
  const hudIDs = ['money', 'income', 'unitCount', 'basesOwned', 'enemyCount'];
  for (const id of hudIDs) {
    if (!document.getElementById(id)) {
      const el = document.createElement('div');
      el.id = id;
      document.body.appendChild(el);
    }
  }
});

// ============================================================
// Mock window.matchMedia for responsive checks
// ============================================================
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ============================================================
// Mock HTMLCanvasElement.getContext for Three.js WebGL
// ============================================================
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  canvas: document.createElement('canvas'),
  clearColor: vi.fn(),
  clearDepth: vi.fn(),
  clearStencil: vi.fn(),
  enable: vi.fn(),
  disable: vi.fn(),
  viewport: vi.fn(),
  scissor: vi.fn(),
  getParameter: vi.fn(p => {
    if (p === 7936) return 128; // MAX_TEXTURE_SIZE
    if (p === 3379) return 16;   // MAX_TEXTURE_IMAGE_UNITS
    if (p === 35660) return 16;  // MAX_VERTEX_ATTRIBS
    if (p === 36347) return 8;   // MAX_DRAW_BUFFERS
    if (p === 34930) return 128; // MAX_COMBINED_TEXTURE_IMAGE_UNITS
    return 1;
  }),
  getShaderPrecisionFormat: vi.fn(() => ({ rangeMin: 127, rangeMax: 127, precision: 23 })),
  createShader: vi.fn(() => ({})),
  shaderSource: vi.fn(),
  compileShader: vi.fn(),
  getShaderParameter: vi.fn(() => true),
  createProgram: vi.fn(() => ({})),
  attachShader: vi.fn(),
  linkProgram: vi.fn(),
  getProgramParameter: vi.fn(() => true),
  getAttribLocation: vi.fn(() => 0),
  getUniformLocation: vi.fn(() => 0),
  uniform1i: vi.fn(),
  uniform1f: vi.fn(),
  uniform2fv: vi.fn(),
  uniform3fv: vi.fn(),
  uniform4fv: vi.fn(),
  uniformMatrix4fv: vi.fn(),
  bindBuffer: vi.fn(),
  bufferData: vi.fn(),
  bufferSubData: vi.fn(),
  vertexAttribPointer: vi.fn(),
  enableVertexAttribArray: vi.fn(),
  disableVertexAttribArray: vi.fn(),
  drawArrays: vi.fn(),
  drawElements: vi.fn(),
  useProgram: vi.fn(),
  activeTexture: vi.fn(),
  bindTexture: vi.fn(),
  texImage2D: vi.fn(),
  texParameteri: vi.fn(),
  pixelStorei: vi.fn(),
  blendFunc: vi.fn(),
  blendFuncSeparate: vi.fn(),
  depthFunc: vi.fn(),
  depthMask: vi.fn(),
  colorMask: vi.fn(),
  stencilFunc: vi.fn(),
  stencilOp: vi.fn(),
  stencilMask: vi.fn(),
  cullFace: vi.fn(),
  frontFace: vi.fn(),
  lineWidth: vi.fn(),
  isEnabled: vi.fn(() => true),
  bindFramebuffer: vi.fn(),
  framebufferTexture2D: vi.fn(),
  checkFramebufferStatus: vi.fn(() => 36053),
  createTexture: vi.fn(() => ({})),
  createBuffer: vi.fn(() => ({})),
  createFramebuffer: vi.fn(() => ({})),
  createRenderbuffer: vi.fn(() => ({})),
  bindRenderbuffer: vi.fn(),
  renderbufferStorage: vi.fn(),
  framebufferRenderbuffer: vi.fn(),
  deleteTexture: vi.fn(),
  deleteBuffer: vi.fn(),
  deleteFramebuffer: vi.fn(),
  deleteRenderbuffer: vi.fn(),
  deleteShader: vi.fn(),
  deleteProgram: vi.fn(),
  getExtension: vi.fn(() => null),
  getSupportedExtensions: vi.fn(() => []),
  getContextAttributes: vi.fn(() => ({ alpha: true, antialias: false })),
  isContextLost: vi.fn(() => false),
  makeXRCompatible: vi.fn(() => Promise.resolve()),
}));
