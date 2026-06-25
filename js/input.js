// input.js — Mouse selection (click + box drag) and command issuing.
import * as THREE from 'three';

export function initInput(game, camera, renderer) {
  const raycaster = new THREE.Raycaster();
  const mouse     = new THREE.Vector2();
  const canvas    = renderer.domElement;

  // Invisible ground plane for raycasting world clicks
  const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

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

  // ----- Selection logic -----
  function clearSelection() {
    for (const u of game.selectedUnits) u.setSelected(false);
    game.selectedUnits = [];
    updateSelectionUI();
  }

  function selectUnit(u, additive = false) {
    if (!additive) clearSelection();
    if (u.faction !== 'player') return;  // can only command our own
    if (!game.selectedUnits.includes(u)) {
      u.setSelected(true);
      game.selectedUnits.push(u);
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
      info.innerHTML = 'No units selected';
      return;
    }
    // Group by type
    const counts = {};
    for (const u of game.selectedUnits) {
      counts[u.type] = (counts[u.type] || 0) + 1;
    }
    info.innerHTML = Object.entries(counts)
      .map(([t, n]) => `<div>${t.toUpperCase()}: ${n}</div>`).join('');
    info.innerHTML += `<div style="margin-top:6px;color:#4af;">Total: ${game.selectedUnits.length}</div>`;
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
      remaining[bestU].moveTo(slots[bestS]);
      remaining.splice(bestU, 1);
      slots.splice(bestS, 1);
    }
  }

  // ===== EVENT LISTENERS =====
  canvas.addEventListener('contextmenu', e => e.preventDefault());

  canvas.addEventListener('mousedown', e => {
    if (e.button === 0) {  // LEFT click — selection / box start
      mouseDownPos = { x: e.clientX, y: e.clientY };
      dragStart    = { x: e.clientX, y: e.clientY };
      isDragging   = false;
    }
  });

  canvas.addEventListener('mousemove', e => {
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
    }
  });

  canvas.addEventListener('mouseup', e => {
    if (e.button === 0) {  // LEFT release
      if (isDragging) {
        selectUnitsInBox(dragStart.x, dragStart.y, e.clientX, e.clientY);
        isDragging = false;
        selectionBox.style.display = 'none';
      } else {
        // Single click — select unit or clear
        const u = getUnitUnderMouse(e);
        if (u) selectUnit(u, e.shiftKey);
        else   clearSelection();
      }
    } else if (e.button === 2) {  // RIGHT click — command
      const targetUnit = getUnitUnderMouse(e);
      const targetBase = getBaseUnderMouse(e);
      const target = targetUnit || (targetBase && targetBase.faction !== 'player'
                       ? { mesh: targetBase.mesh, faction: targetBase.faction, alive: targetBase.alive,
                           takeDamage: d => targetBase.takeDamage(d) }
                       : null);
      if (target && target.faction !== 'player') {
        // Attack: tell all selected units to engage
        for (const u of game.selectedUnits) u.attack(target);
      } else {
        // Move
        const point = getGroundPoint(e);
        if (point) issueMoveCommand(point);
      }
    }
  });

  console.log('✅ Input system online — LMB select/drag, RMB move/attack.');
}
