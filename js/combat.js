// combat.js â€” Handles projectile flight, damage rolls, and FX.
import * as THREE from 'three';

import { CRIT_CHANCE, CRIT_MULT, TERRAIN_BONUSES, PROJECTILE_TYPES, PROJECTILE_PATTERNS } from './config.js?v=4';

// Object Pooling
const POOL = {};

function getPool(key, createFn, initialSize = 16) {
  if (!POOL[key]) {
    POOL[key] = [];
    for (let i = 0; i < initialSize; i++) {
      const obj = createFn();
      obj.visible = false;
      obj.userData._inPool = true;
      POOL[key].push(obj);
    }
  }
  return POOL[key];
}

export function acquireFromPool(key, createFn, initialSize = 16) {
  const pool = getPool(key, createFn, initialSize);
  for (const obj of pool) {
    if (!obj.visible) {
      obj.visible = true;
      obj.userData._inPool = false;
      return obj;
    }
  }
  const obj = createFn();
  obj.userData._inPool = true;
  pool.push(obj);
  obj.visible = true;
  obj.userData._inPool = false;
  return obj;
}

export function releaseToPool(obj) {
  if (obj.parent) obj.parent.remove(obj);
  obj.visible = false;
  obj.userData._inPool = true;
}

const PROJECTILE_POOL_KEY = 'projectile_land';
function createLandProjectile() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.8, 6),
    new THREE.MeshBasicMaterial({ color: 0xffaa00 })
  );
  body.rotation.x = Math.PI / 2;
  g.add(body);
  const trail = new THREE.Mesh(
    new THREE.ConeGeometry(0.15, 1.5, 6),
    new THREE.MeshBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.6 })
  );
  trail.rotation.x = -Math.PI / 2;
  trail.position.z = -1;
  g.add(trail);
  return g;
}

export class Projectile {
  constructor(scene, from, target, damage, hitChance, type = 'land', pattern = 'default', splashRadius = 0, splashFalloff = 1) {
    this.scene = scene;
    this.target = target;
    this.damage = damage;
    this.hitChance = hitChance;
    this.type = type;
    this.speed = PROJECTILE_TYPES[type].speed;
    this.pattern = pattern;
    this.splashRadius = splashRadius;
    this.splashFalloff = splashFalloff;
    this.alive = true;
    this.mesh = acquireFromPool('projectile_' + type, () => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.6, 6),
        new THREE.MeshBasicMaterial({ color: type === 'land' ? 0xffaa00 : type === 'sea' ? 0x444466 : 0xff4400 })
      );
      body.rotation.x = Math.PI / 2;
      g.add(body);
      return g;
    }, 64);
    this.mesh.position.copy(from);
    this.mesh.visible = true;
    scene.add(this.mesh);

    // Pattern-specific init
    const p = PROJECTILE_PATTERNS[pattern] || PROJECTILE_PATTERNS.default;
    this.burst = p.burst || 1;
    this.burstDelay = p.burstDelay || 0;
    this.spread = p.spread || 0;
    this.homing = p.homing || false;
    this.carpet = p.carpet || false;
    this.barrage = p.barrage || false;
    this.ap = p.ap || false;

    this._burstIndex = 0;
    this._burstTimer = 0;
    this._initialPos = from.clone();
    this._targetPos = target.mesh ? target.mesh.position.clone() : target.position.clone();

    // Arc trajectory for land projectiles
    this._arcProgress = 0; // t = 0..1
    this._arcTotalDist = this._initialPos.distanceTo(this._targetPos);
    this._arcHeight = this._arcTotalDist * 0.3; // peak height proportional to distance
    this._arcDuration = this._arcTotalDist / this.speed; // time to reach target
  }

  update(dt) {
    if (!this.alive || !this.target || !this.target.alive) { this.destroy(); return; }
    if (!this.target.mesh) { this.destroy(); return; }

    const targetPos = this.target.mesh.position;

    if (this.type === 'land') {
      // Parabolic arc for land projectiles
      this._arcProgress += dt / this._arcDuration;
      if (this._arcProgress >= 1) {
        this.mesh.position.copy(targetPos);
        this.impact();
        return;
      }
      const t = this._arcProgress;
      // Lerp from start to target
      this.mesh.position.lerpVectors(this._initialPos, this._targetPos, t);
      // Parabolic height: 4*h*t*(1-t) peaks at t=0.5
      const arcY = 4 * this._arcHeight * t * (1 - t);
      this.mesh.position.y += arcY;
    } else {
      // Straight line for sea/air
      const dir = new THREE.Vector3().subVectors(targetPos, this.mesh.position);
      const dist = dir.length();
      if (dist < 2) { this.impact(); return; }
      dir.normalize().multiplyScalar(this.speed * dt);
      this.mesh.position.add(dir);
    }

    // Air projectile trail
    if (this.type === 'air') {
      this.spawnAirTrail();
    }
  }

  impact() {
    const hit = Math.random() < this.hitChance;
    const impactPos = this.mesh.position.clone();

    if (hit) {
      let dmg = this.damage;
      const crit = Math.random() < CRIT_CHANCE;
      if (crit) dmg *= CRIT_MULT;

      // AP rounds: ignore terrain defense bonus
      if (this.ap && this.target.takeDamage) {
        this.target.takeDamage(dmg);
      } else {
        this.target.takeDamage(dmg);
      }
    } else {
    }

    if (hit) {
      // Splash damage (only on hit)
      if (this.splashRadius > 0) {
        this.applySplash(impactPos);
      }
      spawnExplosion(this.scene, impactPos, this.splashRadius);
    }
    this.destroy();
  }

  applySplash(center) {
    const attackerFaction = this.target?.faction;
    const allUnits = [...this.scene.userData.game?.playerUnits || [], ...this.scene.userData.game?.enemyUnits || []];
    for (const unit of allUnits) {
      if (!unit.alive || unit === this.target) continue;
      if (attackerFaction && unit.faction === attackerFaction) continue;
      const d = Math.hypot(unit.mesh.position.x - center.x, unit.mesh.position.z - center.z);
      if (d <= this.splashRadius) {
        const falloff = THREE.MathUtils.lerp(1, this.splashFalloff, d / this.splashRadius);
        const splashDmg = this.damage * falloff;
        unit.takeDamage(splashDmg);
      }
    }
    // Also splash bases (only enemy bases)
    const bases = this.scene.userData.game?.bases || [];
    for (const base of bases) {
      if (!base.alive) continue;
      if (attackerFaction && base.faction === attackerFaction) continue;
      const d = Math.hypot(base.mesh.position.x - center.x, base.mesh.position.z - center.z);
      if (d <= this.splashRadius) {
        const falloff = THREE.MathUtils.lerp(1, this.splashFalloff, d / this.splashRadius);
        const splashDmg = this.damage * falloff;
        base.takeDamage(splashDmg);
      }
    }
  }

  destroy() {
    this.alive = false;
    if (this.mesh.parent) {
      releaseToPool(this.mesh);
    }
  }

  spawnAirTrail() {
    const trail = acquireFromPool('airTrail', () => new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 4, 4),
      new THREE.MeshBasicMaterial({ color: 0xff9900, transparent: true, opacity: 0.8 })
    ), 32);
    trail.position.copy(this.mesh.position);
    trail.userData.life = 0.3;
    this.scene.add(trail);
    this.scene.userData.airTrails = this.scene.userData.airTrails || [];
    this.scene.userData.airTrails.push(trail);
  }
}

// Multi-projectile patterns: create multiple projectiles with offsets/delays
export function createProjectilePattern(scene, from, target, damage, hitChance, type, pattern, splashRadius, splashFalloff, firingUnitRotation = 0, targetPos = null, effectiveBurst = null, bomberCarpetDir = null, burstDelay = 0) {
  const p = PROJECTILE_PATTERNS[pattern] || PROJECTILE_PATTERNS.default;
  const projectiles = [];
  const burst = effectiveBurst !== null ? effectiveBurst : p.burst;
  const delay = burstDelay || p.burstDelay || 0;

  const targetPosition = targetPos || (target.mesh ? target.mesh.position : target.position);

  for (let i = 0; i < burst; i++) {
    const proj = new Projectile(scene, from, target, damage, hitChance, type, pattern, splashRadius, splashFalloff);

    // Apply spread for salvo (battleship broadside)
    if (p.spread > 0 && burst > 1) {
      const spreadRad = THREE.MathUtils.degToRad(p.spread);
      const angleOffset = (i / (burst - 1) - 0.5) * spreadRad;
      const dir = new THREE.Vector3().subVectors(targetPosition, from).normalize();
      dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), angleOffset);
      const newTargetPos = from.clone().add(dir.multiplyScalar(1000));
      proj._targetPos = newTargetPos;
    }

    // Carpet bomb: offset along perpendicular to approach vector
    if (p.carpet && burst > 1) {
      const perp = bomberCarpetDir || new THREE.Vector3(0, 0, 1);
      const spacing = 6;
      const offset = (i - (burst - 1) / 2) * spacing;
      proj._targetPos = targetPosition.clone().add(perp.multiplyScalar(offset));
    }

    // Barrage: sequential landing points toward target
    if (p.barrage && burst > 1) {
      const dir = new THREE.Vector3().subVectors(targetPosition, from).normalize();
      const dist = from.distanceTo(targetPosition);
      const step = dist / burst;
      proj._targetPos = from.clone().add(dir.multiplyScalar(step * (i + 1)));
    }

    projectiles.push(proj);
  }

  return projectiles;
}

function cleanupAirTrails(scene, dt) {
  const list = scene.userData.airTrails || [];
  for (let i = list.length - 1; i >= 0; i--) {
    const p = list[i];
    p.userData.life -= dt;
    p.scale.multiplyScalar(0.9);
    p.material.opacity -= 0.3 * dt;
    if (p.userData.life <= 0) { releaseToPool(p); list.splice(i,1); }
  }
}

function createExplosionParticle() {
  return new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.6, 0.6),
    new THREE.MeshBasicMaterial({ transparent: true })
  );
}

export function spawnExplosion(scene, pos, splashRadius = 0) {
  const particleCount = (splashRadius > 0 ? 16 : 8);
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    const p = acquireFromPool('explosion', createExplosionParticle, 24);
    p.position.copy(pos);
    p.material.color.setHex(i % 2 ? 0xff6600 : 0xffcc00);
    p.material.opacity = 1;
    p.scale.set(1, 1, 1);
    const v = new THREE.Vector3(
      (Math.random() - 0.5) * 20, Math.random() * 15, (Math.random() - 0.5) * 20
    );
    p.userData = { v, life: 0.6 };
    scene.add(p);
    particles.push(p);
  }
  scene.userData.explosions = scene.userData.explosions || [];
  scene.userData.explosions.push(...particles);

  // Splash ring
  if (splashRadius > 0) {
    const ring = acquireFromPool('splashRing', () => {
      const g = new THREE.RingGeometry(1, 1, 32);
      const m = new THREE.MeshBasicMaterial({
        color: 0xff8800, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthTest: false
      });
      const r = new THREE.Mesh(g, m);
      r.rotation.x = -Math.PI / 2;
      return r;
    }, 4);
    ring.position.set(pos.x, 0.2, pos.z);
    ring.userData = { life: 0.4, maxRadius: splashRadius };
    ring.scale.set(splashRadius, splashRadius, splashRadius);
    scene.add(ring);
    scene.userData.splashRings = scene.userData.splashRings || [];
    scene.userData.splashRings.push(ring);
  }
}

export function updateExplosions(scene, dt) {
  const list = scene.userData.explosions || [];
  for (let i = list.length - 1; i >= 0; i--) {
    const p = list[i];
    p.userData.life -= dt;
    p.userData.v.y -= 30 * dt;
    p.position.addScaledVector(p.userData.v, dt);
    p.scale.multiplyScalar(0.96);
    if (p.userData.life <= 0) {
      releaseToPool(p);
      list.splice(i, 1);
    }
  }
  const rings = scene.userData.splashRings || [];
  for (let i = rings.length - 1; i >= 0; i--) {
    const r = rings[i];
    r.userData.life -= dt;
    r.material.opacity = THREE.MathUtils.lerp(0, 0.5, r.userData.life / 0.4);
    r.scale.multiplyScalar(1.02);
    if (r.userData.life <= 0) {
      releaseToPool(r);
      rings.splice(i, 1);
    }
  }
}

export function updateAllTrails(scene, dt) {
  cleanupAirTrails(scene, dt);
}

export function applyHitscanDamage(scene, attackerPos, target, damage, hitChance, splashRadius = 0, splashFalloff = 1) {
  const hit = Math.random() < hitChance;
  const impactPos = target.mesh ? target.mesh.position.clone() : (target.position ? target.position.clone() : attackerPos.clone());

  let dmg = damage;
  if (hit) {
    const crit = Math.random() < CRIT_CHANCE;
    if (crit) dmg *= CRIT_MULT;
    target.takeDamage(dmg);
  }

  if (splashRadius > 0) {
    const attackerFaction = target?.faction;
    const allUnits = [...scene.userData.game?.playerUnits || [], ...scene.userData.game?.enemyUnits || []];
    for (const unit of allUnits) {
      if (!unit.alive || unit === target) continue;
      if (attackerFaction && unit.faction === attackerFaction) continue;
      const d = Math.hypot(unit.mesh.position.x - impactPos.x, unit.mesh.position.z - impactPos.z);
      if (d <= splashRadius) {
        const falloff = THREE.MathUtils.lerp(1, splashFalloff, d / splashRadius);
        unit.takeDamage(damage * falloff);
      }
    }
    const bases = scene.userData.game?.bases || [];
    for (const base of bases) {
      if (!base.alive) continue;
      if (attackerFaction && base.faction === attackerFaction) continue;
      const d = Math.hypot(base.mesh.position.x - impactPos.x, base.mesh.position.z - impactPos.z);
      if (d <= splashRadius) {
        const falloff = THREE.MathUtils.lerp(1, splashFalloff, d / splashRadius);
        base.takeDamage(damage * falloff);
      }
    }
  }

  spawnExplosion(scene, impactPos, splashRadius);
  return { hit, damage: hit ? dmg : 0 };
}

export function applyTerrainBonus(domain, terrain, baseDmg, baseHp) {
  const b = TERRAIN_BONUSES[domain]?.[terrain] || { dmg:1, hp:1 };
  // AP rounds ignore terrain defense
  return { dmg: baseDmg * b.dmg, hp: baseHp * b.hp };
}