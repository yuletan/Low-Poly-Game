// quality.js — visual quality helpers backed by config.js's active preset.
//
// The simulation already reads activePreset directly, so this module deliberately
// does not maintain a second preset object. Visual rebuilds and renderer settings
// use the same live object as the existing performance systems.
import * as THREE from 'three';
import { QUALITY_PRESETS, activePreset, setActivePreset } from './config.js';
import { resetFactoryCaches } from './unitFactory.js';

export const QUALITY_TIERS = Object.keys(QUALITY_PRESETS);

export function getQuality() {
  return activePreset;
}

export function setQuality(tierId) {
  setActivePreset(tierId);
  return activePreset;
}

/** Apply the selected tier to a renderer created by main.js. */
export function configureRenderer(renderer, tier = activePreset) {
  if (!renderer) return;
  const dpr = window.devicePixelRatio || 1;
  renderer.setPixelRatio(tier.pixelRatio < 1 ? tier.pixelRatio : Math.min(dpr, tier.pixelRatio));
  renderer.shadowMap.enabled = tier.shadows && tier.shadowType !== 'off';
  renderer.shadowMap.type =
    tier.shadowType === 'soft' ? THREE.PCFSoftShadowMap :
    tier.shadowType === 'pcf' ? THREE.PCFShadowMap :
    tier.shadowType === 'basic' ? THREE.BasicShadowMap :
    THREE.PCFShadowMap;
  renderer.toneMapping = tier.toneMapping === 'aces'
    ? THREE.ACESFilmicToneMapping
    : THREE.NoToneMapping;
  renderer.toneMappingExposure = tier.toneMapping === 'aces' ? 1.05 : 1;
  if ('outputColorSpace' in renderer && THREE.SRGBColorSpace) {
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }
}

/** Apply the selected tier to the game's directional key light. */
export function configureKeyLight(light, tier = activePreset) {
  if (!light) return;
  const enabled = tier.shadows && tier.shadowType !== 'off';
  light.castShadow = enabled;
  if (!enabled) return;

  const size = tier.shadowSize || 0;
  if (size > 0) light.shadow.mapSize.set(size, size);
  light.shadow.camera.near = 50;
  light.shadow.camera.far = 1600;
  const extent = 700;
  light.shadow.camera.left = -extent;
  light.shadow.camera.right = extent;
  light.shadow.camera.top = extent;
  light.shadow.camera.bottom = -extent;
  light.shadow.bias = -0.0006;
  light.shadow.normalBias = tier.shadowType === 'soft' ? 1.2 : 0.6;
  light.shadow.camera.updateProjectionMatrix();
}

/** Toggle cheap per-object quality switches without rebuilding scene objects. */
export function applyQualityLive(game, tier = activePreset) {
  game?.scene?.traverse?.(object => {
    if (object.userData?.isEdgeOutline) {
      object.visible = tier.outlines;
      return;
    }
    if (!object.isMesh || object.userData?.noShadow) return;
    if (object.material?.depthTest === false || object.renderOrder >= 890) return;

    const keyCaster = object.userData?.keyCaster === true;
    object.castShadow = tier.shadowCasters === 'all' ||
      (tier.shadowCasters === 'key' && keyCaster);
    object.receiveShadow = tier.shadows && tier.shadowType !== 'off';
  });
}

/** Rebuild instanced unit bodies and retune renderer/light settings in place. */
export function rebuildForQuality(game, tierId) {
  const tier = setQuality(tierId);
  resetFactoryCaches();
  game?.unitLayer?.invalidate?.();

  const renderer = game?.scene?.userData?.renderer;
  const sun = game?.scene?.userData?.sun;
  configureRenderer(renderer, tier);
  configureKeyLight(sun, tier);
  applyQualityLive(game, tier);
  return tier;
}
