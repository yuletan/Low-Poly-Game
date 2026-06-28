// input.js — Mouse selection (click + box drag) and command issuing.
import * as THREE from 'three';
import { LAND_HEIGHT } from './terrain.js?v=3';
import { Sound } from './sound.js';
import { UNIT_TYPES, TERRAIN } from './config.js?v=4';

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
    const all = [...game.playerUnits, ...game.enemyUnits].filter(u => u.alive);
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

  // ----- Ground Cursor & Formation Preview -----
  let groundCursor = null;
  let formationPreview = [];

  function createGroundCursor() {
    // Main cursor ring
    const ringGeo = new THREE.RingGeometry(1.5, 2.5, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x44ff88,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      depthTest: false
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.15;

    // Crosshair lines
    const lineGeo = new THREE.BufferGeometry();
    const lineMat = new THREE.LineBasicMaterial({ color: 0x44ff88, transparent: true, opacity: 0.6, depthTest: false });
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

    groundCursor = new THREE.Group();
    groundCursor.add(ring, crosshair);
    groundCursor.visible = false;
    game.scene.add(groundCursor);
  }

  function updateGroundCursor(point) {
    if (!groundCursor) createGroundCursor();
    if (!point) { groundCursor.visible = false; return; }
    
    groundCursor.visible = true;
    groundCursor.position.set(point.x, 0, point.z);
    
    // Animate ring
    const time = performance.now() * 0.003;
    const ring = groundCursor.children[0];
    if (ring) {
      ring.scale.setScalar(1 + Math.sin(time) * 0.15);
      ring.material.opacity = 0.5 + Math.sin(time * 2) * 0.3;
    }
  }

  function clearFormationPreview() {
    for (const marker of formationPreview) {
      game.scene.remove(marker);
    }
    formationPreview = [];
  }

  function updateFormationPreview(point) {
    clearFormationPreview();
    if (!point || game.selectedUnits.length === 0) return;
    
    const positions = game.computeFormation(point, game.selectedUnits.length, game.formation);
    const unitType = game.selectedUnits[0].type;
    const stats = UNIT_TYPES[unitType];
    const color = stats.color;
    const isAir = stats.domain === 'air';
    const isSea = stats.domain === 'sea';
    
    for (const pos of positions) {
      const ringGeo = new THREE.RingGeometry(1.5, 2.2, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x44ff88,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
        depthTest: false
      });
      const marker = new THREE.Mesh(ringGeo, ringMat);
      marker.rotation.x = -Math.PI / 2;
      const y = isAir ? stats.altitude : (isSea ? 0.3 : LAND_HEIGHT + 0.5);
      marker.position.set(pos.x, y + 0.1, pos.z);
      marker.userData.animOffset = Math.random() * Math.PI * 2;
      game.scene.add(marker);
      formationPreview.push(marker);
    }
  }

  // Animate formation preview markers
  function animateFormationPreview() {
    const time = performance.now() * 0.004;
    for (let i = 0; i < formationPreview.length; i++) {
      const marker = formationPreview[i];
      const offset = marker.userData.animOffset || 0;
      const scale = 1 + Math.sin(time + offset + i * 0.5) * 0.2;
      marker.scale.setScalar(scale);
      marker.material.opacity = 0.4 + Math.sin(time * 2 + offset) * 0.2;
    }
  }

  // ----- Selection logic -----
  function clearSelection() {
    for (const u of game.selectedUnits) u.setSelected(false);
    game.selectedUnits = [];
    game.selectedBuilding = null;
    updateSelectionUI();
  }

  function selectUnit(u, additive = false) {
    if (!additive) clearSelection();
    if (u.faction !== 'player') return;  // can only command our own
    if (!game.selectedUnits.includes(u)) {
      u.setSelected(true);
      game.selectedUnits.push(u);
      Sound.play('select');
    }
    updateSelectionUI();
  }

  function selectUnitsInBox(x1, y1, x2, y2) {
    clearSelection();
    const minX = Math.min(x1, x2), maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2), maxY = Math.max(y1, y2);
    const rect = canvas.getBoundingClientRect();

    for (const u of game.playerUnits) {
      if (!u.alive) continue;
      // Project unit world position to screen
      const p = u.mesh.position.clone().project(camera);
      const sx = (p.x * 0.5 + 0.5) * rect.width  + rect.left;
      const sy = (-p.y * 0.5 + 0.5) * rect.height + rect.top;
      if (sx >= minX && sx <= maxX && sy >= minY && sy <= maxY) {
        u.setSelected(true);
        game.selectedUnits.push(u);
      }
    }
    updateSelectionUI();
  }

  function updateSelectionUI() {
    const info = document.getElementById('selectionInfo');
    if (game.selectedUnits.length === 0) {
      if (game.selectedBuilding) {
        const sb = game.selectedBuilding;
        info.innerHTML = `<div style="color:#4af;text-align:center;padding:10px;">Selected: ${sb.base.name}<br><span style="color:#888;">${sb.isShipyard ? '🏭 Shipyard' : '🏛️ Barracks'}</span></div>`;
      } else {
        info.innerHTML = '<div style="color:#888; text-align:center; padding:10px;">Click or drag to select units</div>';
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
        }
        ctx.fill(); ctx.stroke();
        iconCache[type] = canvas.toDataURL('image/png');
      }
      return iconCache[type];
    }
    
    // Build HTML with unit portraits (per-type stats)
    let html = '';
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
    const unitLabel = game.selectedUnits.length === 1 ? 'unit' : 'units';
    html += `<div style="margin-top:8px;color:#4af;text-align:center;">Total: ${game.selectedUnits.length} ${unitLabel}</div>`;

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
  function issueMoveCommand(worldPoint, additiveTarget = null) {
    const units = game.selectedUnits;
    if (units.length === 0) return;

    // If right-clicked on an enemy, issue attack
    if (additiveTarget && additiveTarget.faction !== 'player') {
      for (const u of units) u.attack(additiveTarget);
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

    // Otherwise compute formation positions
    const positions = game.computeFormation(worldPoint, units.length, game.formation);
    // Assign nearest unit to nearest position for nicer movement
    const remaining = [...units];
    const slots     = [...positions];
    while (remaining.length > 0 && slots.length > 0) {
      let bestU = 0, bestS = 0, bestD = Infinity;
      for (let i = 0; i < remaining.length; i++) {
        for (let j = 0; j < slots.length; j++) {
          const d = remaining[i].mesh.position.distanceTo(slots[j]);
          if (d < bestD) { bestD = d; bestU = i; bestS = j; }
        }
      }
      remaining[bestU].moveTo(slots[bestS], game.attackMoveMode);
      remaining.splice(bestU, 1);
      slots.splice(bestS, 1);
    }
    Sound.play('move');
  }

  // ----- Hover HP tooltip -----
  let hoverTooltip = null;

  function updateHoverTooltip(e) {
    const u = getUnitUnderMouse(e);
    const base = getBaseUnderMouse(e);

    // Prefer unit over base
    const target = u || base;

    if (target && target.alive !== false) {
      if (!hoverTooltip) {
        hoverTooltip = document.createElement('div');
        hoverTooltip.className = 'unit-tooltip';
        document.body.appendChild(hoverTooltip);
      }
      const hp = Math.ceil(target.hp || target._displayHp || 0);
      const maxHp = Math.ceil(target.maxHp || 0);
      const pct = maxHp > 0 ? Math.round((hp / maxHp) * 100) : 0;
      const typeName = target.type || target.name || 'Unit';
      hoverTooltip.innerHTML = `<strong>${typeName.toUpperCase()}</strong><br>❤ HP: ${hp} / ${maxHp} <span style="color:${pct > 50 ? '#4f4' : pct > 25 ? '#fa0' : '#f44'}">(${pct}%)</span>`;
      hoverTooltip.style.left = (e.clientX + 16) + 'px';
      hoverTooltip.style.top = (e.clientY + 16) + 'px';
      hoverTooltip.classList.add('visible');
    } else {
      if (hoverTooltip) {
        hoverTooltip.classList.remove('visible');
        hoverTooltip.remove();
        hoverTooltip = null;
      }
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

  canvas.addEventListener('mousemove', e => {
    // Hover HP tooltip
    updateHoverTooltip(e);

    // Placement mode — update preview
    if (game.placementMode && game.placementMode.active) {
      const point = getGroundPoint(e);
      if (point) game.updatePlacementPreview(point);
      return;
    }
    // Detect when the user crosses the drag threshold
    if (e.buttons & 1) {  // left button held
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
    } else if (game.selectedUnits.length > 0) {
      // Update ground cursor and formation preview when units are selected
      const point = getGroundPoint(e);
      if (point) {
        updateGroundCursor(point);
        updateFormationPreview(point);
      }
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
        selectUnitsInBox(dragStart.x, dragStart.y, e.clientX, e.clientY);
        isDragging = false;
        selectionBox.style.display = 'none';
      } else {
        // Single click — select unit or base or clear
        const u = getUnitUnderMouse(e);
        const base = getBaseUnderMouse(e);
        if (u) {
          selectUnit(u, e.shiftKey);
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
      const targetUnit = getUnitUnderMouse(e);
      const targetBase = getBaseUnderMouse(e);
      const target = targetUnit || (targetBase && targetBase.faction !== 'player'
                       ? { mesh: targetBase.mesh, faction: targetBase.faction,
                           get alive() { return targetBase.alive; }, get hp() { return targetBase.hp; },
                           takeDamage: d => targetBase.takeDamage(d) }
                       : null);
      if (target && target.faction !== 'player') {
        console.log(`[DEBUG INPUT] Right-click ATTACK on ${targetUnit ? 'unit' : 'base'} (${game.selectedUnits.length} attackers)`);
        for (const u of game.selectedUnits) u.attack(target);
      } else {
        const point = getGroundPoint(e);
        if (point) {
          console.log(`[DEBUG INPUT] Right-click MOVE to (${point.x.toFixed(0)}, ${point.z.toFixed(0)}) — ${game.selectedUnits.length} units`);
          issueMoveCommand(point);
        }
      }
    }
  });

  // Cleanup hover tooltip when mouse leaves canvas
  canvas.addEventListener('mouseleave', () => {
    if (hoverTooltip) {
      hoverTooltip.classList.remove('visible');
      hoverTooltip.remove();
      hoverTooltip = null;
    }
  });

  // Expose selection UI updater and renderer so the game can refresh / project
  game.updateSelectionUI = updateSelectionUI;
  game.renderer = renderer;

  console.log('✅ Input system online — LMB select/drag, RMB move/attack.');
}
