// input.js — Mouse selection (click + box drag) and command issuing.
import * as THREE from 'three';
import { LAND_HEIGHT } from './terrain.js?v=3';
import { Sound } from './sound.js';
import { UNIT_TYPES, TERRAIN, MAP_SIZE } from './config.js?v=4';

// Canvas roundRect helper for icon generation
function roundRect(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
  ctx.lineTo(x + rad, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
  ctx.lineTo(x, y + rad);
  ctx.quadraticCurveTo(x, y, x + rad, y);
  ctx.closePath();
}

export function initInput(game, camera, renderer) {
  const raycaster = new THREE.Raycaster();
  const mouse     = new THREE.Vector2();
  const canvas    = renderer.domElement;

  // Invisible ground plane for raycasting world clicks at land height
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -LAND_HEIGHT);

  // Drag state
  let isDragging = false;
  let dragStart  = { x: 0, y: 0 };
  let mouseDownPos = { x: 0, y: 0 };
  const DRAG_THRESHOLD = 5;  // pixels before we consider it a drag
  const DOUBLE_CLICK_MS = 300;
  const DOUBLE_CLICK_DIST = 10;
  let lastClickTime = 0;
  let lastClickPos = { x: 0, y: 0 };
  let lastClickedUnit = null;
  const selectionBox = document.getElementById('selectionBox');

  // ----- Helpers -----
  function setMouseNDC(e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
  }

  /** Returns the world point the mouse is hovering (on ground plane y=0). */
  function getGroundPoint(e) {
    setMouseNDC(e);
    raycaster.setFromCamera(mouse, camera);
    const hit = new THREE.Vector3();
    raycaster.ray.intersectPlane(groundPlane, hit);
    return hit;
  }

  /** Returns first unit under the cursor, or null. */
  function getUnitUnderMouse(e) {
    setMouseNDC(e);
    raycaster.setFromCamera(mouse, camera);
    const all = [...game.playerUnits, ...game.enemyUnits].filter(u => u.alive && u.selectable !== false);
    const meshes = all.map(u => u.mesh);
    const hits = raycaster.intersectObjects(meshes, true);
    if (hits.length === 0) return null;
    // Walk up to find the unit's root group
    let obj = hits[0].object;
    while (obj && !all.find(u => u.mesh === obj)) obj = obj.parent;
    return all.find(u => u.mesh === obj) || null;
  }

  /** Returns first base under the cursor, or null. */
  function getBaseUnderMouse(e) {
    setMouseNDC(e);
    raycaster.setFromCamera(mouse, camera);
    const meshes = game.bases.map(b => b.mesh);
    const hits = raycaster.intersectObjects(meshes, true);
    if (hits.length === 0) return null;
    let obj = hits[0].object;
    while (obj && !game.bases.find(b => b.mesh === obj)) obj = obj.parent;
    return game.bases.find(b => b.mesh === obj) || null;
  }

  /** True when a unit's origin is inside the current camera viewport. */
  function isUnitOnScreen(u, margin = 24) {
    if (!u?.mesh) return false;
    const rect = canvas.getBoundingClientRect();
    const p = u.mesh.position.clone().project(camera);
    if (p.z < -1 || p.z > 1) return false;
    const sx = (p.x * 0.5 + 0.5) * rect.width;
    const sy = (-p.y * 0.5 + 0.5) * rect.height;
    return sx >= -margin && sx <= rect.width + margin && sy >= -margin && sy <= rect.height + margin;
  }

  // ----- Ground Cursor / Command Preview -----
  let groundCursor = null;
  let commandHint = null;

  const COMMAND_COLORS = {
    move: 0x44ff88,
    attack: 0xff4444
  };

  function createGroundCursor() {
    // Main cursor ring. Task 14: this cursor is now color-coded by command mode.
    const ringGeo = new THREE.RingGeometry(1.5, 2.5, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: COMMAND_COLORS.move,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      depthTest: false,
      depthWrite: false
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.15;
    ring.renderOrder = 930;

    // Crosshair lines
    const lineGeo = new THREE.BufferGeometry();
    const lineMat = new THREE.LineBasicMaterial({
      color: COMMAND_COLORS.move,
      transparent: true,
      opacity: 0.6,
      depthTest: false,
      depthWrite: false
    });
    const lineVerts = new Float32Array([
      -4, 0, 0,  -1.5, 0, 0,   // left
      1.5, 0, 0,   4, 0, 0,    // right
      0, 0, -4,    0, 0, -1.5, // back
      0, 0, 1.5,   0, 0, 4     // front
    ]);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(lineVerts, 3));
    const crosshair = new THREE.LineSegments(lineGeo, lineMat);
    crosshair.rotation.x = -Math.PI / 2;
    crosshair.position.y = 0.15;
    crosshair.renderOrder = 931;

    groundCursor = new THREE.Group();
    groundCursor.add(ring, crosshair);
    groundCursor.visible = false;
    game.scene.add(groundCursor);
  }

  function updateGroundCursor(point, mode = 'move') {
    if (!groundCursor) createGroundCursor();
    if (!point) { groundCursor.visible = false; return; }

    const color = COMMAND_COLORS[mode] || COMMAND_COLORS.move;
    const ring = groundCursor.children[0];
    const crosshair = groundCursor.children[1];
    if (ring) ring.material.color.setHex(color);
    if (crosshair) crosshair.material.color.setHex(color);

    groundCursor.visible = true;
    groundCursor.position.set(point.x, 0, point.z);

    // Animate ring
    const time = performance.now() * 0.003;
    if (ring) {
      ring.scale.setScalar(1 + Math.sin(time) * 0.15);
      ring.material.opacity = 0.5 + Math.sin(time * 2) * 0.3;
    }
    if (crosshair) crosshair.material.opacity = mode === 'attack' ? 0.9 : 0.6;
  }

  function ensureCommandHint() {
    if (!commandHint) {
      commandHint = document.createElement('div');
      commandHint.className = 'command-cursor-hint hidden';
      document.body.appendChild(commandHint);
    }
    return commandHint;
  }

  function updateCommandHint(e, mode, label) {
    const el = ensureCommandHint();
    el.textContent = label;
    el.classList.remove('hidden', 'move', 'attack');
    el.classList.add(mode === 'attack' ? 'attack' : 'move');
    el.style.left = `${e.clientX + 18}px`;
    el.style.top = `${e.clientY + 18}px`;
  }

  function hideCommandHint() {
    if (commandHint) commandHint.classList.add('hidden');
    canvas.classList.remove('command-move-hover', 'command-attack-hover');
  }

  function disposeMarkerObject(obj) {
    obj.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) child.material.dispose();
    });
  }

  function spawnCommandMarker(point, mode = 'move', label = 'MOVE') {
    if (!point) return;

    const color = COMMAND_COLORS[mode] || COMMAND_COLORS.move;
    const group = new THREE.Group();
    group.position.set(point.x, 0.65, point.z);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(mode === 'attack' ? 4.0 : 3.0, mode === 'attack' ? 5.5 : 4.5, 40),
      new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95,
        depthTest: false,
        depthWrite: false
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.renderOrder = 940;
    group.add(ring);

    const lineGeo = new THREE.BufferGeometry();
    const verts = mode === 'attack'
      ? new Float32Array([-6,0,-6, 6,0,6, -6,0,6, 6,0,-6])
      : new Float32Array([-6,0,0, -2,0,0, 2,0,0, 6,0,0, 0,0,-6, 0,0,-2, 0,0,2, 0,0,6]);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(verts, 3));
    const lines = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9, depthTest: false, depthWrite: false })
    );
    lines.renderOrder = 941;
    group.add(lines);

    game.scene.add(group);

    const start = performance.now();
    const lifeMs = 700;
    function tick(now) {
      const t = Math.min(1, (now - start) / lifeMs);
      const scale = mode === 'attack' ? 1 + t * 0.9 : 1 + t * 1.35;
      group.scale.set(scale, scale, scale);
      ring.material.opacity = 0.95 * (1 - t);
      lines.material.opacity = 0.9 * (1 - t);
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        game.scene.remove(group);
        disposeMarkerObject(group);
      }
    }
    requestAnimationFrame(tick);

    if (game.minimap && typeof game.pingMinimap === 'function') {
      game.pingMinimap(point.x, point.z);
    }
    console.log(`[COMMAND] ${label} marker at (${point.x.toFixed(0)}, ${point.z.toFixed(0)})`);
  }

  // ----- Selection logic -----
  function clearSelection() {
    for (const u of game.selectedUnits) {
      if (u?.setSelected) u.setSelected(false);
    }
    game.selectedUnits = [];
    game.selectedBuilding = null;
    updateGroundCursor(null);
    hideCommandHint();
    updateSelectionUI();
  }

  function selectUnit(u, additive = false) {
    if (!u || u.faction !== 'player' || !u.alive || u.selectable === false || u.carried) return;

    game.selectedBuilding = null;
    const wasSelected = game.selectedUnits.includes(u);

    // Shift-click now toggles membership instead of only adding forever.
    if (additive && wasSelected) {
      u.setSelected(false);
      game.selectedUnits = game.selectedUnits.filter(sel => sel !== u);
      updateSelectionUI();
      return;
    }

    if (!additive) clearSelection();

    if (!additive || !wasSelected) {
      u.setSelected(true);
      if (!game.selectedUnits.includes(u)) game.selectedUnits.push(u);
      Sound.play('select');
    }
    updateSelectionUI();
  }

  // Double-click selects all same-type friendly units that are currently visible on screen.
  function handleDoubleClick(u) {
    if (!u || u.faction !== 'player') return;
    const sameType = game.playerUnits.filter(unit =>
      unit.alive && unit.selectable !== false && !unit.carried && unit.type === u.type && isUnitOnScreen(unit)
    );
    const unitsToSelect = sameType.length > 0 ? sameType : [u];
    clearSelection();
    for (const unit of unitsToSelect) {
      unit.setSelected(true);
      game.selectedUnits.push(unit);
    }
    Sound.play('select');
    updateSelectionUI();
    game.flashMessage(`Selected ${unitsToSelect.length} visible ${u.type.toUpperCase()}(s)`);
  }

  function selectUnitsInBox(x1, y1, x2, y2, additive = false) {
    if (!additive) clearSelection();
    game.selectedBuilding = null;
    const minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
    const rect = canvas.getBoundingClientRect();
    let added = 0;

    for (const u of game.playerUnits) {
      if (!u.alive || u.selectable === false || u.carried) continue;
      // Project unit world position to screen.
      const p = u.mesh.position.clone().project(camera);
      if (p.z < -1 || p.z > 1) continue;
      const sx = (p.x * 0.5 + 0.5) * rect.width  + rect.left;
      const sy = (-p.y * 0.5 + 0.5) * rect.height + rect.top;
      if (sx >= minX && sx <= maxX && sy >= minY && sy <= maxY && !game.selectedUnits.includes(u)) {
        u.setSelected(true);
        game.selectedUnits.push(u);
        added++;
      }
    }
    if (added > 0) Sound.play('select');
    updateSelectionUI();
  }

  function updateSelectionUI() {
    const info = document.getElementById('selectionInfo');
    if (game.selectedUnits.length === 0) {
      if (game.selectedBuilding) {
        const sb = game.selectedBuilding;
        info.innerHTML = `<div style="color:#4af;text-align:center;padding:10px;">Selected: ${sb.base.name}<br><span style="color:#888;">${sb.isShipyard ? '🏭 Shipyard' : '🏛️ Barracks'}</span></div>`;
      } else {
        info.innerHTML = '<div style="color:#888; text-align:center; padding:10px;">Click/tap or drag to select units</div>';
      }
      return;
    }
    // Group by type
    const counts = {};
    for (const u of game.selectedUnits) {
      counts[u.type] = (counts[u.type] || 0) + 1;
    }
    
    // Generate unit icon data URLs for portraits
    const iconCache = {};
    function getIcon(type, color) {
      if (!iconCache[type]) {
        const canvas = document.createElement('canvas');
        canvas.width = 24; canvas.height = 24;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
        ctx.strokeStyle = '#4af'; ctx.lineWidth = 0.5;
        const cx = 12, cy = 12, s = 7;
        ctx.beginPath();
        switch (type) {
          case 'infantry': ctx.moveTo(cx, cy-s); ctx.lineTo(cx-s*0.6, cy+s*0.5); ctx.lineTo(cx+s*0.6, cy+s*0.5); ctx.closePath(); break;
          case 'tank': ctx.roundRect(cx-s, cy-s*0.7, s*2, s*1.4, 2); ctx.closePath(); break;
          case 'heavyTank': ctx.roundRect(cx-s*1.2, cy-s*0.8, s*2.4, s*1.6, 2); ctx.closePath(); break;
          case 'crusher': ctx.roundRect(cx-s*1.3, cy-s*0.9, s*2.6, s*1.8, 2); ctx.closePath(); break;
          case 'artillery': ctx.roundRect(cx-s, cy-s*0.6, s*2, s*1.2, 1.5); ctx.closePath(); break;
          case 'missileDefense': ctx.roundRect(cx-s*0.8, cy-s*0.6, s*1.6, s*1.2, 1); ctx.moveTo(cx, cy-s*0.6); ctx.lineTo(cx, cy-s*1.3); ctx.closePath(); break;
          case 'mlrs': ctx.roundRect(cx-s, cy-s*0.7, s*2, s*1.4, 2); ctx.moveTo(cx-s*0.6, cy-s*0.4); ctx.lineTo(cx+s*0.6, cy-s*0.4); ctx.lineTo(cx+s*0.4, cy-s*1); ctx.lineTo(cx-s*0.4, cy-s*1); ctx.closePath(); break;
          case 'coastal': ctx.roundRect(cx-s, cy-s*0.3, s*2, s*0.6, 1); ctx.moveTo(cx-s*0.3, cy-s*0.3); ctx.lineTo(cx+s*0.3, cy-s*0.3); ctx.lineTo(cx+s*0.3, cy-s*0.8); ctx.lineTo(cx-s*0.3, cy-s*0.8); ctx.closePath(); break;
          case 'healer': ctx.roundRect(cx-s, cy-s*0.7, s*2, s*1.4, 2); ctx.moveTo(cx-s*0.3, cy); ctx.lineTo(cx+s*0.3, cy); ctx.moveTo(cx, cy-s*0.3); ctx.lineTo(cx, cy+s*0.3); ctx.closePath(); break;
          case 'medHeli': ctx.moveTo(cx, cy); ctx.lineTo(cx+s*0.8, cy+s*0.3); ctx.lineTo(cx+s*0.8, cy-s*0.3); ctx.lineTo(cx, cy-s*0.2); ctx.lineTo(cx-s*0.8, cy-s*0.1); ctx.lineTo(cx-s*0.8, cy+s*0.1); ctx.closePath(); break;
          case 'escortJet': ctx.moveTo(cx, cy-s*1.1); ctx.lineTo(cx+s*0.7, cy+s*0.2); ctx.lineTo(cx+s*0.4, cy+s*0.2); ctx.lineTo(cx+s*0.5, cy+s*0.6); ctx.lineTo(cx, cy+s*0.4); ctx.lineTo(cx-s*0.5, cy+s*0.6); ctx.lineTo(cx-s*0.4, cy+s*0.2); ctx.lineTo(cx-s*0.7, cy+s*0.2); ctx.closePath(); break;
          case 'b2': ctx.moveTo(cx, cy-s*0.4); ctx.lineTo(cx-s*1.3, cy+s*0.5); ctx.lineTo(cx-s*1.3, cy+s*0.7); ctx.lineTo(cx+s*1.3, cy+s*0.7); ctx.lineTo(cx+s*1.3, cy+s*0.5); ctx.closePath(); break;
          case 'escortBomber': ctx.moveTo(cx, cy-s*1.3); ctx.lineTo(cx+s*1, cy+s*0.3); ctx.lineTo(cx+s*0.6, cy+s*0.3); ctx.lineTo(cx+s*0.7, cy+s*0.8); ctx.lineTo(cx, cy+s*0.6); ctx.lineTo(cx-s*0.7, cy+s*0.8); ctx.lineTo(cx-s*0.6, cy+s*0.3); ctx.lineTo(cx-s*1, cy+s*0.3); ctx.closePath(); break;
          case 'destroyer': case 'battleship': ctx.moveTo(cx-s*1.2, cy+s*0.3); ctx.lineTo(cx+s*1.2, cy+s*0.3); ctx.lineTo(cx+s*0.8, cy-s*0.4); ctx.lineTo(cx-s*0.8, cy-s*0.4); ctx.closePath(); break;
          case 'frigate': ctx.moveTo(cx-s*0.9, cy+s*0.3); ctx.lineTo(cx+s*1.2, cy+s*0.3); ctx.lineTo(cx+s*0.9, cy-s*0.3); ctx.lineTo(cx-s*0.6, cy-s*0.3); ctx.closePath(); break;
          case 'cruiser': ctx.moveTo(cx-s*1.3, cy+s*0.3); ctx.lineTo(cx+s*1.3, cy+s*0.3); ctx.lineTo(cx+s*1, cy-s*0.4); ctx.lineTo(cx-s*1, cy-s*0.4); ctx.closePath(); break;
          case 'submarine': ctx.ellipse(cx, cy, s*1.3, s*0.5, 0, 0, Math.PI*2); ctx.closePath(); break;
          case 'carrier': ctx.moveTo(cx-s*1.3, cy+s*0.2); ctx.lineTo(cx+s*1.3, cy+s*0.2); ctx.lineTo(cx+s*1.3, cy-s*0.3); ctx.lineTo(cx-s*1.3, cy-s*0.3); ctx.closePath(); break;
          case 'fighter': ctx.moveTo(cx, cy-s*1.1); ctx.lineTo(cx+s*0.6, cy+s*0.2); ctx.lineTo(cx+s*0.3, cy+s*0.2); ctx.lineTo(cx+s*0.4, cy+s*0.6); ctx.lineTo(cx, cy+s*0.4); ctx.lineTo(cx-s*0.4, cy+s*0.6); ctx.lineTo(cx-s*0.3, cy+s*0.2); ctx.lineTo(cx-s*0.6, cy+s*0.2); ctx.closePath(); break;
          case 'bomber': ctx.moveTo(cx, cy-s*1.2); ctx.lineTo(cx+s*0.8, cy+s*0.3); ctx.lineTo(cx+s*0.4, cy+s*0.3); ctx.lineTo(cx+s*0.5, cy+s*0.7); ctx.lineTo(cx, cy+s*0.5); ctx.lineTo(cx-s*0.5, cy+s*0.7); ctx.lineTo(cx-s*0.4, cy+s*0.3); ctx.lineTo(cx-s*0.8, cy+s*0.3); ctx.closePath(); break;
          case 'heli': ctx.moveTo(cx, cy); ctx.lineTo(cx+s*0.8, cy+s*0.3); ctx.lineTo(cx+s*0.8, cy-s*0.3); ctx.lineTo(cx, cy-s*0.2); ctx.lineTo(cx-s*0.8, cy-s*0.1); ctx.lineTo(cx-s*0.8, cy+s*0.1); ctx.closePath(); break;
          case 'gunship': ctx.roundRect(cx-s, cy-s*0.4, s*2, s*0.8, 2); ctx.moveTo(cx-s*1.5, cy); ctx.lineTo(cx+s*1.5, cy); ctx.lineTo(cx+s*1.5, cy+s*0.15); ctx.lineTo(cx-s*1.5, cy+s*0.15); ctx.closePath(); break;
          case 'transport': ctx.roundRect(cx-s, cy-s*0.5, s*2, s, 2); ctx.closePath(); break;
          case 'minigunnerVehicle': ctx.roundRect(cx-s*1.1, cy-s*0.7, s*2.2, s*1.4, 2); ctx.closePath(); break;
          case 'megaMedic': ctx.roundRect(cx-s, cy-s*0.7, s*2, s*1.4, 2); ctx.closePath(); break;
          case 'minigunner': ctx.moveTo(cx, cy-s); ctx.lineTo(cx-s*0.6, cy+s*0.5); ctx.lineTo(cx+s*0.6, cy+s*0.5); ctx.closePath(); break;
        }
        ctx.fill(); ctx.stroke();
        iconCache[type] = canvas.toDataURL('image/png');
      }
      return iconCache[type];
    }
    
    const domainCounts = {};
    for (const u of game.selectedUnits) {
      const domain = u.domain || UNIT_TYPES[u.type]?.domain || 'mixed';
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    }
    const typeSummary = Object.entries(counts).map(([type, count]) => `${count} ${type}`).join(' • ');
    const domainSummary = Object.entries(domainCounts).map(([domain, count]) => `${count} ${domain}`).join(' • ');

    // Build HTML with unit portraits (per-type stats)
    let html = `
      <div class="selection-summary">
        <strong>${game.selectedUnits.length}</strong> selected
        <span>${typeSummary}</span>
        <small>${domainSummary}</small>
      </div>
    `;
    for (const [type, count] of Object.entries(counts)) {
      const stats = UNIT_TYPES[type];
      const iconDataUrl = getIcon(type, stats.color);
      // Calculate per-type stats from selected units of this type
      let typeHp = 0, typeDmg = 0, typeRange = 0, typeCount = 0;
      for (const u of game.selectedUnits) {
        if (u.type === type) {
          typeHp += u.hp;
          typeDmg += u.stats.damage;
          typeRange = Math.max(typeRange, u.stats.range);
          typeCount++;
        }
      }
      const avgHp = Math.round(typeHp / typeCount);
      const avgDmg = Math.round(typeDmg / typeCount);
      html += `
        <div class="selection-item">
          <img class="selection-icon" src="${iconDataUrl}" alt="${type}">
          <div>
            <div class="selection-type">${type.toUpperCase()}</div>
            <div class="selection-stats">HP: ${avgHp} | DMG: ${avgDmg} | RNG: ${typeRange}</div>
          </div>
          <div class="selection-count">×${count}</div>
        </div>
      `;
    }
    html += `<div class="selection-tip">Shift-click toggles units • Drag/touch-drag box-selects • Pick a formation, then move to send each unit to its own slot</div>`;

    // Transport ship: show Load/Unload buttons
    const hasTransport = game.selectedUnits.some(u => u.isTransport && u.alive);
    if (hasTransport) {
      const transport = game.selectedUnits.find(u => u.isTransport);
      // Check for nearby friendly land units (not just selected)
      const nearbyLand = game.playerUnits.filter(u =>
        u.alive && u.domain === 'land' && !u.carried && transport.canLoadUnit(u)
      );
      const canLoad = nearbyLand.length > 0;
      const canUnload = transport.carriedUnits.length > 0;
      html += `<div class="transport-actions" style="display:flex;gap:8px;margin-top:8px;justify-content:center;">`;
      html += `<button id="loadBtn" class="action-btn" style="background:#2a6;color:#fff;border:none;padding:6px 14px;border-radius:4px;cursor:pointer;font-family:inherit;"${canLoad ? '' : ' disabled'}>📦 Load${canLoad ? '' : ' (no units nearby)'}</button>`;
      html += `<button id="unloadBtn" class="action-btn" style="background:#a62;color:#fff;border:none;padding:6px 14px;border-radius:4px;cursor:pointer;font-family:inherit;"${canUnload ? '' : ' disabled'}>📤 Unload${canUnload ? ` (${transport.carriedUnits.length})` : ' (no cargo)'}</button>`;
      html += `</div>`;
    }

    info.innerHTML = html;

    // Bind transport buttons (fresh each frame)
    const loadBtn = document.getElementById('loadBtn');
    if (loadBtn) {
      loadBtn.addEventListener('click', () => {
        const t = game.selectedUnits.find(u => u.isTransport);
        if (!t) return;
        const toLoad = game.playerUnits.filter(u =>
          u.alive && u.domain === 'land' && !u.carried && t.canLoadUnit(u)
        );
        for (const u of toLoad) t.loadUnit(u);
        game.updateSelectionUI();
      });
    }
    const unloadBtn = document.getElementById('unloadBtn');
    if (unloadBtn) {
      unloadBtn.addEventListener('click', () => {
        const t = game.selectedUnits.find(u => u.isTransport);
        if (t) t.unloadAll();
        game.updateSelectionUI();
      });
    }
  }

  // ----- Command issuing -----
  function makeBaseCommandTarget(base) {
    if (!base || base.faction === 'player') return null;
    // Keep the existing synthetic target pattern but include domain/name so the
    // combat layer can treat bases like land/building targets for attack UX.
    return {
      mesh: base.mesh,
      faction: base.faction,
      domain: base.domain || 'land',
      name: base.name || 'Base',
      type: 'base',
      get alive() { return base.alive; },
      get hp() { return base.hp; },
      get maxHp() { return base.maxHp; },
      takeDamage: d => base.takeDamage(d)
    };
  }

  function getCommandTarget(e) {
    const targetUnit = getUnitUnderMouse(e);
    if (targetUnit) return targetUnit;
    const targetBase = getBaseUnderMouse(e);
    return makeBaseCommandTarget(targetBase);
  }

  function commandTargetLabel(target) {
    if (!target) return 'TARGET';
    return (target.name || target.type || 'target').toString().toUpperCase();
  }

  function commandTargetPosition(target) {
    const pos = target?.mesh?.position || target?.position;
    return pos ? new THREE.Vector3(pos.x, 0, pos.z) : null;
  }

  function issueAttackCommand(target) {
    if (!target || target.faction === 'player') return;
    const units = game.selectedUnits.filter(u => u.alive && !u.carried);
    if (units.length === 0) return;

    for (const u of units) {
      u.attack(target);
      // Task 7 compatibility: if a ship is explicitly ordered at a hostile
      // target, do not let idle transport housekeeping immediately redirect it.
      if (u.isTransport) u._manualOrder = true;
    }

    const pos = commandTargetPosition(target);
    spawnCommandMarker(pos, 'attack', `ATTACK ${commandTargetLabel(target)}`);
    game.flashMessage(`Attack order: ${commandTargetLabel(target)}`);
    Sound.play('move');
  }

  function issueMoveCommand(worldPoint, additiveTarget = null) {
    const units = game.selectedUnits.filter(u => u.alive && !u.carried && u.stats?.speed !== 0);
    if (units.length === 0) return;

    // If right-clicked on an enemy, issue attack
    if (additiveTarget && additiveTarget.faction !== 'player') {
      issueAttackCommand(additiveTarget);
      return;
    }

    // Auto-load land units into nearby transports
    const transports = game.playerUnits.filter(u => u.isTransport && u.alive);
    for (const u of units) {
      if (u.domain !== 'land') continue;
      if (u.carried) continue;
      for (const t of transports) {
        if (t.carriedUnits.length >= t.transportCapacity) continue;
        const d = u.mesh.position.distanceTo(t.mesh.position);
        if (d <= 12) {
          // Check if the move destination is near the transport (unit going to board it)
          const toTrans = t.mesh.position.distanceTo(worldPoint);
          if (toTrans <= 10) {
            t.loadUnit(u);
            break;
          }
        }
      }
    }

    const orderId = (typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now());
    const assignments = typeof game.assignFormationMoveTargets === 'function'
      ? game.assignFormationMoveTargets(units, worldPoint, game.formation)
      : units.map((unit, index) => ({ unit, target: worldPoint.clone(), slotIndex: index, formation: game.formation || 'spread' }));

    for (const assignment of assignments) {
      const unit = assignment.unit;
      unit._formationOrderId = orderId;
      unit._formationSlotIndex = assignment.slotIndex;
      unit._formationSlotTarget = assignment.target.clone();
      unit.moveTo(assignment.target, game.attackMoveMode);
      // Task 7 fix: flag transports as under an explicit player order so the
      // automatic ferry/retreat logic in _updateTransport() (game.js) won't
      // hijack or override this destination — see Task 7 solution notes.
      if (unit.isTransport) unit._manualOrder = true;
    }

    const formationName = (game.formation || 'spread').toString().toUpperCase();
    spawnCommandMarker(worldPoint, 'move', units.length > 1 ? `MOVE ${formationName}` : 'MOVE');
    if (units.length > 1) game.flashMessage(`${formationName} move: ${assignments.length} units`);
    Sound.play('move');
  }

  // ----- Hover HP tooltip -----
  let hoverTooltip = null;
  let hoveredEnemyUnit = null;

  function updateHoverTooltip(e) {
    const u = getUnitUnderMouse(e);
    const base = getBaseUnderMouse(e);

    // Prefer unit over base
    const target = u || base;

    // Hover ring for enemy units
    const enemyUnit = u && u.faction !== 'player' ? u : null;
    if (enemyUnit !== hoveredEnemyUnit) {
      if (hoveredEnemyUnit) {
        hoveredEnemyUnit.ring.material.opacity = hoveredEnemyUnit.selected ? 1.0 : 0;
        if (hoveredEnemyUnit._ringFill) hoveredEnemyUnit._ringFill.material.opacity = hoveredEnemyUnit.selected ? 0.16 : 0;
      }
      hoveredEnemyUnit = enemyUnit;
      if (hoveredEnemyUnit) {
        hoveredEnemyUnit.ring.material.opacity = 0.5;
        if (hoveredEnemyUnit._ringFill) hoveredEnemyUnit._ringFill.material.opacity = 0.1;
      }
    }

    if (target && target.alive !== false) {
      if (!hoverTooltip) {
        hoverTooltip = document.createElement('div');
        hoverTooltip.className = 'unit-tooltip';
        document.body.appendChild(hoverTooltip);
      }
      hoverTooltip.classList.toggle('enemy', target.faction && target.faction !== 'player');
      const hp = Math.ceil(target.hp || target._displayHp || 0);
      const maxHp = Math.ceil(target.maxHp || 0);
      const pct = maxHp > 0 ? Math.round((hp / maxHp) * 100) : 0;
      const typeName = target.type || target.name || 'Unit';
      let tooltipContent = `<strong>${typeName.toUpperCase()}</strong><br>HP: ${hp} / ${maxHp} <span style="color:${pct > 50 ? '#4f4' : pct > 25 ? '#fa0' : '#f44'}">(${pct}%)</span>`;

      // Transport cargo manifest
      if (target.isTransport && target.carriedUnits && target.carriedUnits.length > 0) {
        const cap = target.transportCapacity || 10;
        const cargoCount = target.carriedUnits.length;
        const typeCounts = {};
        for (const cu of target.carriedUnits) {
          typeCounts[cu.type] = (typeCounts[cu.type] || 0) + 1;
        }
        const cargoLines = Object.entries(typeCounts)
          .map(([t, c]) => `- ${c}x ${t}`)
          .join('<br>');
        tooltipContent += `<br><span style="color:#fa0;">Cargo: ${cargoCount}/${cap} units</span><br><span style="color:#aaa;font-size:0.9em;">${cargoLines}</span>`;
      } else if (target.isTransport) {
        const cap = target.transportCapacity || 10;
        tooltipContent += `<br><span style="color:#aaa;">Cargo: 0/${cap} units</span>`;
      }

      hoverTooltip.innerHTML = tooltipContent;
      hoverTooltip.style.left = (e.clientX + 16) + 'px';
      hoverTooltip.style.top = (e.clientY + 16) + 'px';
      hoverTooltip.classList.add('visible');
    } else {
      if (hoverTooltip) {
        hoverTooltip.classList.remove('visible', 'enemy');
        hoverTooltip.remove();
        hoverTooltip = null;
      }
    }
  }

  function updateCommandPreview(e) {
    // Hide command affordances while dragging/placing or when nothing is selected.
    if ((game.placementMode && game.placementMode.active) || game.selectedUnits.length === 0 || (e.buttons & 1)) {
      updateGroundCursor(null);
      hideCommandHint();
      return;
    }

    const target = getCommandTarget(e);
    if (target && target.faction !== 'player') {
      const pos = commandTargetPosition(target) || getGroundPoint(e);
      updateGroundCursor(pos, 'attack');
      updateCommandHint(e, 'attack', `ATTACK ${commandTargetLabel(target)}`);
      canvas.classList.add('command-attack-hover');
      canvas.classList.remove('command-move-hover');
      return;
    }

    const point = getGroundPoint(e);
    if (point) {
      updateGroundCursor(point, 'move');
      updateCommandHint(e, 'move', 'MOVE');
      canvas.classList.add('command-move-hover');
      canvas.classList.remove('command-attack-hover');
    } else {
      updateGroundCursor(null);
      hideCommandHint();
    }
  }

  // ===== EVENT LISTENERS =====
  canvas.addEventListener('contextmenu', e => e.preventDefault());

  canvas.addEventListener('mousedown', e => {
    if (e.button === 0) {  // LEFT click — selection / box start
      // Skip during placement mode
      if (game.placementMode && game.placementMode.active) {
        console.log('[DEBUG INPUT] Left-click blocked — placement mode active');
        return;
      }
      mouseDownPos = { x: e.clientX, y: e.clientY };
      dragStart    = { x: e.clientX, y: e.clientY };
      isDragging   = false;
    }
  });

  // Detect mobile for performance - disable expensive formation preview
  const isMobile = matchMedia('(pointer: coarse)').matches;

  canvas.addEventListener('mousemove', e => {
    // Hover HP tooltip
    updateHoverTooltip(e);

    // Placement mode — update preview
    if (game.placementMode && game.placementMode.active) {
      const point = getGroundPoint(e);
      if (point) game.updatePlacementPreview(point);
      hideCommandHint();
      updateGroundCursor(null);
      return;
    }
    // Detect when the user crosses the drag threshold
    if (e.buttons & 1) {  // left button held
      hideCommandHint();
      updateGroundCursor(null);
      const dx = e.clientX - mouseDownPos.x;
      const dy = e.clientY - mouseDownPos.y;
      if (!isDragging && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        isDragging = true;
        selectionBox.style.display = 'block';
      }
      if (isDragging) {
        const x = Math.min(dragStart.x, e.clientX);
        const y = Math.min(dragStart.y, e.clientY);
        const w = Math.abs(e.clientX - dragStart.x);
        const h = Math.abs(e.clientY - dragStart.y);
        selectionBox.style.left   = `${x}px`;
        selectionBox.style.top    = `${y}px`;
        selectionBox.style.width  = `${w}px`;
        selectionBox.style.height = `${h}px`;
      }
    } else {
      // Task 14: show MOVE vs ATTACK intent before the command is issued.
      updateCommandPreview(e);
    }
  });

  canvas.addEventListener('mouseup', e => {
    // Placement mode — confirm on left-click, cancel on right-click
    if (game.placementMode && game.placementMode.active) {
      if (e.button === 0) {
        console.log('[DEBUG INPUT] Left-click in placement mode — confirming placement');
        const point = getGroundPoint(e);
        game.confirmPlacement(point);
      } else if (e.button === 2) {
        console.log('[DEBUG INPUT] Right-click in placement mode — cancelling');
        game.exitPlacementMode(true);
      }
      return;
    }
    if (e.button === 0) {  // LEFT release
      if (isDragging) {
        selectUnitsInBox(dragStart.x, dragStart.y, e.clientX, e.clientY, e.shiftKey);
        isDragging = false;
        selectionBox.style.display = 'none';
      } else {
        // Single click — select unit or base or clear
        const u = getUnitUnderMouse(e);
        const base = getBaseUnderMouse(e);

        // Double-click detection is target-aware so a quick second click on another unit
        // does not unexpectedly select an unrelated type.
        const now = Date.now();
        const dist = Math.hypot(e.clientX - lastClickPos.x, e.clientY - lastClickPos.y);
        const sameUnitType = !!(u && lastClickedUnit && u.faction === lastClickedUnit.faction && u.type === lastClickedUnit.type);
        const isDoubleClick = sameUnitType && (now - lastClickTime < DOUBLE_CLICK_MS) && (dist < DOUBLE_CLICK_DIST);
        lastClickTime = now;
        lastClickPos = { x: e.clientX, y: e.clientY };
        lastClickedUnit = u || null;

        if (u) {
          if (isDoubleClick && u.faction === 'player') {
            handleDoubleClick(u);
          } else {
            selectUnit(u, e.shiftKey);
          }
          game.selectedBuilding = null;
        } else if (base && base.faction === 'player') {
          clearSelection();
          game.selectedBuilding = {
            base: base,
            faction: base.faction,
            isShipyard: [TERRAIN.SEA, TERRAIN.COAST].includes(game.terrain.getTerrainAt(base.mesh.position.x, base.mesh.position.z))
          };
          updateSelectionUI();
        } else {
          clearSelection();
          game.selectedBuilding = null;
        }
      }
    } else if (e.button === 2) {  // RIGHT click — command
      const target = getCommandTarget(e);
      if (target && target.faction !== 'player') {
        issueAttackCommand(target);
      } else {
        const point = getGroundPoint(e);
        if (point) {
          issueMoveCommand(point);
        }
      }
      updateCommandPreview(e);
    }
  });

  // Cleanup hover tooltip when mouse leaves canvas
  canvas.addEventListener('mouseleave', () => {
    if (hoverTooltip) {
      hoverTooltip.classList.remove('visible', 'enemy');
      hoverTooltip.remove();
      hoverTooltip = null;
    }
    if (hoveredEnemyUnit) {
      hoveredEnemyUnit.ring.material.opacity = hoveredEnemyUnit.selected ? 1.0 : 0;
      if (hoveredEnemyUnit._ringFill) hoveredEnemyUnit._ringFill.material.opacity = hoveredEnemyUnit.selected ? 0.16 : 0;
      hoveredEnemyUnit = null;
    }
    updateGroundCursor(null);
    hideCommandHint();
  });

  // ===== Touch Controls for Mobile (Task 2) =====
  // Mobile has no right-click, so touch maps directly onto the same selection
  // and command helpers used by mouse:
  // - tap friendly unit/base = select
  // - touch-drag = box-select
  // - long-press with units selected = move/attack command
  // - two-finger drag/pinch = camera pan/zoom
  let touchStartX = 0;
  let touchStartY = 0;
  let lastTouchX = 0;
  let lastTouchY = 0;
  let touchMoved = false;
  let touchSelecting = false;
  let lastTouchDistance = null;
  let lastTouchMidpoint = null;
  let longPressTimer = null;
  let longPressFired = false;
  let touchMode = null;

  const LONG_PRESS_MS = 500;
  const TAP_MOVE_THRESHOLD = 10;
  const TOUCH_BOX_THRESHOLD = 14;

  function pointerEventFromXY(x, y, buttons = 0) {
    return {
      clientX: x,
      clientY: y,
      button: 0,
      buttons,
      shiftKey: false,
      preventDefault() {}
    };
  }

  function pointerEventFromTouch(touch, buttons = 0) {
    return pointerEventFromXY(touch.clientX, touch.clientY, buttons);
  }

  function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function getTouchMidpoint(touches) {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
  }

  function clearLongPressTimer() {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
  }

  function showSelectionBox(x1, y1, x2, y2, touch = false) {
    if (!selectionBox) return;
    const x = Math.min(x1, x2);
    const y = Math.min(y1, y2);
    const w = Math.abs(x2 - x1);
    const h = Math.abs(y2 - y1);

    selectionBox.style.display = 'block';
    selectionBox.style.left = `${x}px`;
    selectionBox.style.top = `${y}px`;
    selectionBox.style.width = `${w}px`;
    selectionBox.style.height = `${h}px`;
    selectionBox.classList.toggle('touch-selection', touch);
  }

  function hideSelectionBox() {
    if (!selectionBox) return;
    selectionBox.style.display = 'none';
    selectionBox.classList.remove('touch-selection');
  }

  function resetTouchState() {
    touchMoved = false;
    touchSelecting = false;
    longPressFired = false;
    touchMode = null;
    lastTouchDistance = null;
    lastTouchMidpoint = null;
    isDragging = false;
    hideSelectionBox();
    hideCommandHint();
    updateGroundCursor(null);
  }

  function handleTouchTap(touch) {
    const e = pointerEventFromTouch(touch);
    const u = getUnitUnderMouse(e);
    const base = getBaseUnderMouse(e);

    // Reuse the Task 13 desktop double-click state as double-tap state.
    const now = Date.now();
    const dist = Math.hypot(e.clientX - lastClickPos.x, e.clientY - lastClickPos.y);
    const sameUnitType = !!(u && lastClickedUnit && u.faction === lastClickedUnit.faction && u.type === lastClickedUnit.type);
    const isDoubleTap = sameUnitType && (now - lastClickTime < DOUBLE_CLICK_MS) && (dist < DOUBLE_CLICK_DIST);
    lastClickTime = now;
    lastClickPos = { x: e.clientX, y: e.clientY };
    lastClickedUnit = u || null;

    if (u) {
      if (isDoubleTap && u.faction === 'player') {
        handleDoubleClick(u);
      } else {
        selectUnit(u, false);
      }
      game.selectedBuilding = null;
    } else if (base && base.faction === 'player') {
      clearSelection();
      game.selectedBuilding = {
        base: base,
        faction: base.faction,
        isShipyard: [TERRAIN.SEA, TERRAIN.COAST].includes(game.terrain.getTerrainAt(base.mesh.position.x, base.mesh.position.z))
      };
      updateSelectionUI();
    } else {
      clearSelection();
      game.selectedBuilding = null;
    }
  }

  function issueTouchCommandAt(x, y) {
    if (game.placementMode && game.placementMode.active) return false;
    if (game.selectedUnits.length === 0) return false;

    const e = pointerEventFromXY(x, y);
    const target = getCommandTarget(e);
    if (target && target.faction !== 'player') {
      issueAttackCommand(target);
      updateCommandPreview(e);
      return true;
    }

    const point = getGroundPoint(e);
    if (point) {
      issueMoveCommand(point);
      updateCommandPreview(e);
      return true;
    }

    return false;
  }

  function panCameraByDelta(dx, dy) {
    const speed = 0.5;
    const target = game.cameraTarget;

    target.x -= dx * speed;
    target.z -= dy * speed;

    target.x = THREE.MathUtils.clamp(target.x, -MAP_SIZE / 2, MAP_SIZE / 2);
    target.z = THREE.MathUtils.clamp(target.z, -MAP_SIZE / 2, MAP_SIZE / 2);
  }

  function zoomCamera(delta) {
    camera.userData.height = THREE.MathUtils.clamp(
      (camera.userData.height ?? camera.position.y) + delta,
      60,
      400
    );

    camera.userData.distance = camera.userData.height;
  }

  canvas.addEventListener('touchstart', e => {
    e.preventDefault();

    if (e.touches.length === 2) {
      clearLongPressTimer();
      touchMode = 'pinch';
      longPressFired = false;
      touchSelecting = false;
      isDragging = false;
      hideSelectionBox();
      hideCommandHint();
      updateGroundCursor(null);
      lastTouchDistance = getTouchDistance(e.touches);
      lastTouchMidpoint = getTouchMidpoint(e.touches);
      return;
    }

    if (e.touches.length !== 1 || touchMode === 'pinch') return;

    const t = e.touches[0];
    touchMode = 'single';
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    lastTouchX = t.clientX;
    lastTouchY = t.clientY;
    touchMoved = false;
    touchSelecting = false;
    longPressFired = false;
    isDragging = false;
    hideSelectionBox();

    if (game.placementMode && game.placementMode.active) {
      const point = getGroundPoint(pointerEventFromTouch(t));
      if (point) game.updatePlacementPreview(point);
      return;
    }

    if (game.selectedUnits.length > 0) {
      updateCommandPreview(pointerEventFromTouch(t));
    }

    clearLongPressTimer();
    longPressTimer = setTimeout(() => {
      if (touchMoved || touchSelecting || touchMode !== 'single') return;
      longPressFired = true;
      hideSelectionBox();
      hideCommandHint();

      if (issueTouchCommandAt(touchStartX, touchStartY)) {
        canvas.classList.add('touch-command-active');
        setTimeout(() => canvas.classList.remove('touch-command-active'), 180);
      }
    }, LONG_PRESS_MS);
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();

    if (touchMode === 'pinch' && e.touches.length >= 2) {
      clearLongPressTimer();
      hideSelectionBox();
      hideCommandHint();

      const midpoint = getTouchMidpoint(e.touches);
      if (lastTouchMidpoint) {
        panCameraByDelta(midpoint.x - lastTouchMidpoint.x, midpoint.y - lastTouchMidpoint.y);
      }
      lastTouchMidpoint = midpoint;

      const dist = getTouchDistance(e.touches);
      if (lastTouchDistance !== null) {
        const delta = lastTouchDistance - dist;
        zoomCamera(delta * 0.4);
      }
      lastTouchDistance = dist;
      return;
    }

    if (touchMode !== 'single' || e.touches.length !== 1) return;

    const t = e.touches[0];
    const totalDx = t.clientX - touchStartX;
    const totalDy = t.clientY - touchStartY;
    const totalDist = Math.hypot(totalDx, totalDy);

    if (totalDist > TAP_MOVE_THRESHOLD) {
      touchMoved = true;
      clearLongPressTimer();
    }

    if (game.placementMode && game.placementMode.active) {
      const point = getGroundPoint(pointerEventFromTouch(t));
      if (point) game.updatePlacementPreview(point);
      lastTouchX = t.clientX;
      lastTouchY = t.clientY;
      return;
    }

    if (touchMoved && !longPressFired) {
      hideCommandHint();
      updateGroundCursor(null);

      if (!touchSelecting && totalDist > TOUCH_BOX_THRESHOLD) {
        touchSelecting = true;
        isDragging = true;
      }

      if (touchSelecting) {
        showSelectionBox(touchStartX, touchStartY, t.clientX, t.clientY, true);
      }
    } else if (!longPressFired && game.selectedUnits.length > 0) {
      updateCommandPreview(pointerEventFromTouch(t));
    }

    lastTouchX = t.clientX;
    lastTouchY = t.clientY;
  }, { passive: false });

  canvas.addEventListener('touchend', e => {
    e.preventDefault();
    clearLongPressTimer();

    if (touchMode === 'pinch') {
      if (e.touches.length < 2) {
        resetTouchState();
      }
      return;
    }

    const t = e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0] : null;
    if (!t || touchMode !== 'single') {
      resetTouchState();
      return;
    }

    if (game.placementMode && game.placementMode.active) {
      if (!touchMoved && !longPressFired) {
        const point = getGroundPoint(pointerEventFromTouch(t));
        game.confirmPlacement(point);
      }
      resetTouchState();
      return;
    }

    if (longPressFired) {
      resetTouchState();
      return;
    }

    if (touchSelecting || isDragging) {
      selectUnitsInBox(touchStartX, touchStartY, t.clientX, t.clientY, false);
    } else if (!touchMoved) {
      handleTouchTap(t);
    }

    resetTouchState();
  }, { passive: false });

  canvas.addEventListener('touchcancel', e => {
    e.preventDefault();
    clearLongPressTimer();
    resetTouchState();
    hideCommandHint();
    updateGroundCursor(null);
  }, { passive: false });

  // Expose selection UI updater and renderer so the game can refresh / project
  game.updateSelectionUI = updateSelectionUI;
  game.renderer = renderer;

  console.log('✅ Input system online — LMB select/drag, RMB move/attack, touch enabled.');
}
