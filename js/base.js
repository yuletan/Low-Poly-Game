// base.js — Base class: capturable buildings with HP, territory, and a defensive turret.
import * as THREE from 'three';
import { DIFFICULTY, TERRAIN } from './config.js?v=7';
import { LAND_HEIGHT } from './terrain.js?v=3';
import { createBaseMesh, createShipyardMesh } from './unitFactory.js?v=3';
import { createProjectilePattern } from './combat.js?v=3';
import { Sound } from './sound.js';

export class Base {
  constructor(game, faction, position, size = 1, name = 'Base') {
    this.game = game;
    this.faction = faction;
    this.name = name;
    this.size = size;

    // Known HQ positions for HP scaling
    const playerHQ = { x: -500, z: 200 };
    const enemyMain = { x: 450, z: -100 };
    const refPos = faction === 'enemy' ? playerHQ : enemyMain;
    const distance = Math.hypot(position.x - refPos.x, position.z - refPos.z);

    // HP scales with base size and distance from opposite HQ
    let hpMult = 1.0; // default: no distance scaling
    if (name !== 'Player HQ' && name !== 'Main Base') {
      if (distance < 150) hpMult = 4.0;
      else if (distance < 300) hpMult = 3.0;
      else if (distance < 500) hpMult = 2.0;
      else hpMult = 1.5;
    }
    // Difficulty multiplier
    const diffCfg = DIFFICULTY[game.difficulty] || DIFFICULTY.easy;
    const diffHpMult = diffCfg.baseHpMultiplier || 1.0;
    this.hp = 500 * size * hpMult * diffHpMult;
    this.maxHp = this.hp;
    this.alive = true;
    this.domain = 'land';

    // Territory radius (bigger for Main Base)
    this.territory = 150 * size;
    if (name === 'Main Base') this.territory = 200 * size;

    // Defensive turret stats Ã¢â‚¬â€ increased range and fire rate
    this.turretRange = 80 * size;
    this.turretDamage = 25 * size * hpMult;
    this.turretCooldown = 0;
    this.turretFireRate = 1.0;

    // Use shipyard mesh for bases on water/coast, barracks for land
    const terrainType = game.terrain.getTerrainAt(position.x, position.z);
    const isWaterBase = terrainType === TERRAIN.SEA || terrainType === TERRAIN.COAST;
    this.mesh = isWaterBase
      ? createShipyardMesh(size, faction === 'player')
      : createBaseMesh(size, faction === 'player');
    this.mesh.position.set(position.x, LAND_HEIGHT, position.z);
    game.scene.add(this.mesh);

    // Territory ring visual (created in createBases after all bases exist)
    this.territoryRing = null;

    // HP bar (always visible)
    this._createHpBar();
  }

  _createHpBar() {
    const barWidth = 8 * this.size;
    const barHeight = 0.6;
    const barY = 6 + this.size * 2; // above the base

    const bgBar = new THREE.Mesh(
      new THREE.PlaneGeometry(barWidth, barHeight),
      new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.9, depthTest: false })
    );
    bgBar.rotation.x = -Math.PI / 2;
    bgBar.position.y = barY;
    bgBar.renderOrder = 900;

    const fgBar = new THREE.Mesh(
      new THREE.PlaneGeometry(barWidth, barHeight),
      new THREE.MeshBasicMaterial({ color: this.faction === 'player' ? 0x44ff88 : 0xff4444, depthTest: false })
    );
    fgBar.rotation.x = -Math.PI / 2;
    fgBar.position.y = barY + 0.02;
    fgBar.renderOrder = 901;

    this.mesh.add(bgBar, fgBar);
    this._hpBar = { bg: bgBar, fg: fgBar, barWidth, maxHp: this.maxHp };
    this._displayHp = this.hp;
    this._trailHp = this.hp;
  }

  update(dt) {
    if (!this.alive) return;

    // HP bar update (always visible for bases)
    if (this._hpBar) {
      this._trailHp += (this._displayHp - this._trailHp) * Math.min(1, dt * 2);
      const hpRatio = this._displayHp / this._hpBar.maxHp;
      const trailRatio = this._trailHp / this._hpBar.maxHp;
      this._hpBar.fg.scale.x = hpRatio;
      this._hpBar.fg.position.x = -(this._hpBar.barWidth / 2) * (1 - hpRatio);
      this._hpBar.fg.material.color.setHex(this.faction === 'player' ? 0x44ff88 : 0xff4444);
    }

    // Auto-defend: shoot player units in range
    this.turretCooldown -= dt;
    if (this.turretCooldown > 0) return;

    const enemies = this.faction === 'player' ? this.game.enemyUnits : this.game.playerUnits;
    let best = null, bestD = this.turretRange;
    for (const e of enemies) {
      if (!e.alive) continue;
      const d = this.mesh.position.distanceTo(e.mesh.position);
      if (d < bestD) { best=e; bestD=d; }
    }
    if (best) {
      this.turretCooldown = this.turretFireRate;
      const projType = 'land';
      const targetPos = best.mesh.position;
      const projs = createProjectilePattern(
        this.game.scene,
        this.mesh.position.clone().add(new THREE.Vector3(0,10,0)),
        best, this.turretDamage, 0.9, projType, 'default', 0, 1,
        0, targetPos
      );
      this.game.projectiles.push(...projs);
      Sound.play('fire');
    }
  }

  takeDamage(d) {
    this.hp -= d;
    this._displayHp = this.hp;
    if (this.hp <= 0) this.capture();
    else if (this.game.onBaseUnderAttack) this.game.onBaseUnderAttack(this);
  }

  capture() {
    if (!this.alive) return;
    const attackers = this.faction === 'player' ? this.game.enemyUnits : this.game.playerUnits;
    const newOwner = attackers.length ? attackers[0].faction :
                    (this.faction === 'player' ? 'enemy' : 'player');
    this.faction = newOwner;
    this.hp = this.maxHp;
    this._displayHp = this.hp;
    this._trailHp = this.hp;
    const flagColor = newOwner === 'player' ? 0x2266aa : 0xaa3333;
    const buildingColor = newOwner === 'player' ? 0x3355aa : 0xaa4444;
    const glowColor = newOwner === 'player' ? 0x44aaff : 0xff4444;
    // Update ALL visual elements
    this.mesh.children.forEach(c => {
      if (c.userData?.isFlag) {
        c.material.color.setHex(flagColor);
      }
      // Update building/HQ color
      if (c.geometry?.type === 'BoxGeometry' && c.position.y > 4) {
        c.material.color.setHex(buildingColor);
      }
      // Update trim/glow color
      if (c.material?.emissive) {
        c.material.emissive.setHex(glowColor);
      }
    });
    // Update territory ring owner color
    if (this.territoryRing) {
      this.territoryRing.material.color.setHex(flagColor);
    }
    // Update HP bar color
    if (this._hpBar) {
      this._hpBar.fg.material.color.setHex(newOwner === 'player' ? 0x44ff88 : 0xff4444);
    }
    if (newOwner === 'player') {
      this.game.money += 400;
      this.game.flashMessage(`Captured ${this.name}!`);
    } else {
      this.game.flashMessage(`Lost ${this.name}!`);
    }
    this.game.checkWinCondition();
  }

  cleanup() {
    if (!this.alive) return;
    this.alive = false;
    this.game.scene.remove(this.mesh);
    if (this.territoryRing) {
      this.game.scene.remove(this.territoryRing);
      this.territoryRing = null;
    }
  }
}
