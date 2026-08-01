// transportCoordinator.js — Central ownership for troop manifests and
// controlled transport spawning. Replaces per-frame whole-faction scans in
// unit transport housekeeping with explicit, interval-driven reconciliation.

function cellKey(pathfinder, point) {
  const cell = pathfinder.worldToGrid(point.x, point.z);
  return `${cell.gx},${cell.gy}`;
}

function manifestKey(game, unit) {
  const data = unit._transportData;
  if (!data?.shipEmbarkPoint || !data?.shipDisembarkPoint) return null;
  const orderId = unit._aiWaveId ?? unit._formationOrderId ?? unit._transportOrderId ?? 'automatic';
  return [
    unit.faction,
    orderId,
    cellKey(game.pathfinder, data.shipEmbarkPoint),
    cellKey(game.pathfinder, data.shipDisembarkPoint)
  ].join(':');
}

export class TransportCoordinator {
  constructor(game, options = {}) {
    this.game = game;
    this.interval = options.interval || 0.25;
    this.spawnCooldownSeconds = options.spawnCooldownSeconds || 0.8;
    this.timer = 0;
    this.spawnCooldown = { player: 0, enemy: 0 };
    this.manifests = new Map();
    this.nextManifestId = 1;
    this.spawnIndex = 0;
  }

  update(dt) {
    this.timer += dt;
    for (const faction of ['player', 'enemy']) {
      this.spawnCooldown[faction] = Math.max(0, this.spawnCooldown[faction] - dt);
    }
    if (this.timer < this.interval) return;
    this.timer %= this.interval;
    this.reconcile();
  }

  factionUnits(faction) {
    return faction === 'player' ? this.game.playerUnits : this.game.enemyUnits;
  }

  /** True while this faction has an active (boarding) manifest — the
      coordinator owns assignment then and per-frame ship scans must yield. */
  hasPendingFor(faction) {
    for (const manifest of this.manifests.values()) {
      if (manifest.faction === faction && manifest.state === 'boarding' && manifest.ship?.alive) return true;
    }
    return false;
  }

  reconcile() {
    this.removeInvalidClaims();
    for (const faction of ['player', 'enemy']) this.reconcileFaction(faction);
  }

  removeInvalidClaims() {
    for (const manifest of this.manifests.values()) {
      manifest.troops = manifest.troops.filter(unit => {
        const valid = unit?.alive && (!unit._claimedByShip || unit._claimedByShip === manifest.ship);
        if (!valid && unit) {
          unit._claimedByShip = null;
          unit._boardingTarget = null;
        }
        return valid;
      });

      if (!manifest.ship?.alive) {
        for (const unit of manifest.troops) {
          unit._claimedByShip = null;
          unit._boardingTarget = null;
        }
        manifest.state = 'abandoned';
      }
    }

    for (const [id, manifest] of this.manifests) {
      if (['complete', 'abandoned'].includes(manifest.state)) this.manifests.delete(id);
    }
  }

  reconcileFaction(faction) {
    const units = this.factionUnits(faction);
    const waitingGroups = new Map();

    for (const unit of units) {
      if (!unit?.alive || unit.isTransport || unit.domain !== 'land' || unit.carried) continue;
      if (unit.state !== 'waitingForTransport' || unit._claimedByShip) continue;
      const key = manifestKey(this.game, unit);
      if (!key) continue;
      if (!waitingGroups.has(key)) waitingGroups.set(key, []);
      waitingGroups.get(key).push(unit);
    }

    const idleShips = units.filter(unit =>
      unit?.alive &&
      unit.isTransport &&
      !unit._manifestId &&
      !unit._manualOrder &&
      (unit.carriedUnits?.length || 0) === 0
    );

    for (const [key, waiting] of waitingGroups) {
      while (waiting.length && idleShips.length) {
        const ship = idleShips.shift();
        this.assign(ship, waiting.splice(0, ship.transportCapacity || 10), key);
      }

      if (!waiting.length || this.spawnCooldown[faction] > 0) continue;
      const ship = this.spawnShipFor(waiting[0], faction);
      if (!ship) continue;
      this.assign(ship, waiting.splice(0, ship.transportCapacity || 10), key);
      this.spawnCooldown[faction] = this.spawnCooldownSeconds;
    }
  }

  assign(ship, troops, key) {
    if (!ship || troops.length === 0) return null;
    const first = troops[0];
    const manifest = {
      id: this.nextManifestId++,
      key,
      faction: first.faction,
      waveId: first._aiWaveId ?? null,
      ship,
      troops: [...troops],
      embarkPoint: first._transportData.shipEmbarkPoint.clone(),
      disembarkPoint: first._transportData.shipDisembarkPoint.clone(),
      createdAt: this.game._currentTime || 0,
      boardingDeadline: (this.game._currentTime || 0) + 12,
      state: 'boarding'
    };

    this.manifests.set(manifest.id, manifest);
    ship._manifestId = manifest.id;
    ship._manifestKey = key;
    ship._manifest = manifest.troops;
    ship._transportData = first._transportData;
    ship._assignedEmbarkPoint = manifest.embarkPoint.clone();
    ship._aiWaveId = manifest.waveId;

    for (const troop of manifest.troops) {
      troop._claimedByShip = ship;
      troop._boardingTarget = ship;
    }

    const route = this.game.pathfinder.findPath(ship.mesh.position, manifest.embarkPoint, 'sea', false) || [];
    ship.path = route.map(point => point.clone());
    ship.moveTarget = ship.path.shift() || manifest.embarkPoint.clone();
    ship.state = 'moving';
    return manifest;
  }

  spawnShipFor(firstTroop, faction) {
    const type = 'transport';
    const cost = this.game.getUnitCost?.(type) ?? 350;
    if (faction === 'player' && this.game.money < cost) return null;

    const embark = firstTroop._transportData.shipEmbarkPoint;
    const grid = this.game.pathfinder.worldToGrid(embark.x, embark.z);
    const seaCell = this.game.pathfinder.findNearestWalkable(grid.gx, grid.gy, 'sea');
    if (!seaCell) return null;

    const world = this.game.pathfinder.gridToWorld(seaCell.gx, seaCell.gy);
    const index = this.spawnIndex++;
    const lane = index % 3;
    const row = Math.floor(index / 3) % 3;
    const position = {
      x: world.x + (lane - 1) * 7,
      y: 0.3,
      z: world.z + (row - 1) * 7
    };

    if (faction === 'player') this.game.money -= cost;
    return this.game.spawn(type, faction, position);
  }

  manifestFor(ship) {
    return ship?._manifestId ? this.manifests.get(ship._manifestId) : null;
  }

  readyToDepart(ship) {
    const manifest = this.manifestFor(ship);
    if (!manifest) return false;
    manifest.troops = manifest.troops.filter(unit => unit?.alive);
    const allAboard = manifest.troops.length > 0 && manifest.troops.every(unit => unit.carried);
    const full = (ship.carriedUnits?.length || 0) >= (ship.transportCapacity || 10);
    const timedOut = (this.game._currentTime || 0) >= manifest.boardingDeadline;
    const minimumLoad = Math.max(1, Math.ceil((ship.transportCapacity || 10) * 0.5));
    return full || allAboard || (timedOut && (ship.carriedUnits?.length || 0) >= minimumLoad);
  }

  complete(ship) {
    const manifest = this.manifestFor(ship);
    if (!manifest) return;
    for (const unit of manifest.troops) {
      unit._claimedByShip = null;
      unit._boardingTarget = null;
    }
    manifest.state = 'complete';
    ship._manifestId = null;
    ship._manifestKey = null;
    ship._manifest = null;
  }
}
