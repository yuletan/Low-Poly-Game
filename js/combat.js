// combat.js — Handles projectile flight, damage rolls, and FX.
import * as THREE from 'three';
import { createProjectileMesh } from './unitFactory.js?v=3';
import { CRIT_CHANCE, CRIT_MULT, TERRAIN_BONUSES, PROJECTILE_TYPES, PROJECTILE_PATTERNS } from './config.js?v=4';

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
    this.mesh = createProjectileMesh(type);
    this.mesh.position.copy(from);
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

      console.log(`[DEBUG COMBAT] HIT — ${dmg.toFixed(1)} damage${crit ? ' (CRITICAL!)' : ''} → ${this.target.type || 'target'} HP: ${this.target.hp != null ? this.target.hp.toFixed(0) : 'N/A'}`);
    } else {
      console.log(`[DEBUG COMBAT] MISS — no damage dealt`);
    }

    // Splash damage
    if (this.splashRadius > 0) {
      this.applySplash(impactPos);
    }

    spawnExplosion(this.scene, impactPos, this.splashRadius);
    this.destroy();
  }

  applySplash(center) {
    const allUnits = [...this.scene.userData.game?.playerUnits || [], ...this.scene.userData.game?.enemyUnits || []];
    for (const unit of allUnits) {
      if (!unit.alive) continue;
      const d = Math.hypot(unit.mesh.position.x - center.x, unit.mesh.position.z - center.z);
      if (d <= this.splashRadius && unit !== this.target) {
        const falloff = THREE.MathUtils.lerp(1, this.splashFalloff, d / this.splashRadius);
        const splashDmg = this.damage * falloff;
        unit.takeDamage(splashDmg);
        console.log(`[DEBUG COMBAT] SPLASH — ${splashDmg.toFixed(1)} to ${unit.type} (dist: ${d.toFixed(1)})`);
      }
    }
    // Also splash bases
    const bases = this.scene.userData.game?.bases || [];
    for (const base of bases) {
      if (!base.alive) continue;
      const d = Math.hypot(base.mesh.position.x - center.x, base.mesh.position.z - center.z);
      if (d <= this.splashRadius) {
        const falloff = THREE.MathUtils.lerp(1, this.splashFalloff, d / this.splashRadius);
        const splashDmg = this.damage * falloff;
        base.takeDamage(splashDmg);
        console.log(`[DEBUG COMBAT] SPLASH BASE — ${splashDmg.toFixed(1)} to ${base.name} (dist: ${d.toFixed(1)})`);
      }
    }
  }

  destroy() {
    this.alive = false;
    this.scene.remove(this.mesh);
  }

  spawnAirTrail() {
    const trailMesh = new THREE.Mesh(new THREE.SphereGeometry(0.1, 4, 4), new THREE.MeshBasicMaterial({ color: 0xff9900, transparent: true, opacity: 0.8 }));
    trailMesh.position.copy(this.mesh.position);
    trailMesh.userData.life = 0.3;
    this.scene.add(trailMesh);
    this.scene.userData.airTrails = this.scene.userData.airTrails || [];
    this.scene.userData.airTrails.push(trailMesh);
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
    if (p.userData.life <= 0) { scene.remove(p); list.splice(i,1); }
  }
}

export function spawnExplosion(scene, pos, splashRadius = 0) {
  const particles = [];
  const particleCount = splashRadius > 0 ? 16 : 8;
  for (let i = 0; i < particleCount; i++) {
    const p = new THREE.Mesh(
      new THREE.BoxGeometry(0.6,0.6,0.6),
      new THREE.MeshBasicMaterial({ color: i%2 ? 0xff6600 : 0xffcc00 })
    );
    p.position.copy(pos);
    const v = new THREE.Vector3(
      (Math.random()-0.5)*20, Math.random()*15, (Math.random()-0.5)*20
    );
    p.userData = { v, life:0.6 };
    scene.add(p);
    particles.push(p);
  }
  scene.userData.explosions = scene.userData.explosions || [];
  scene.userData.explosions.push(...particles);

  // Splash radius visual ring
  if (splashRadius > 0) {
    const ringGeom = new THREE.RingGeometry(splashRadius * 0.9, splashRadius * 1.1, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff8800, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthTest: false
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(pos.x, 0.2, pos.z);
    ring.userData = { life: 0.4, maxRadius: splashRadius };
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
      scene.remove(p);
      list.splice(i,1);
    }
  }
  // Update splash rings
  const rings = scene.userData.splashRings || [];
  for (let i = rings.length - 1; i >= 0; i--) {
    const r = rings[i];
    r.userData.life -= dt;
    r.material.opacity = THREE.MathUtils.lerp(0, 0.5, r.userData.life / 0.4);
    r.scale.multiplyScalar(1.02);
    if (r.userData.life <= 0) {
      scene.remove(r);
      rings.splice(i,1);
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
    const allUnits = [...scene.userData.game?.playerUnits || [], ...scene.userData.game?.enemyUnits || []];
    for (const unit of allUnits) {
      if (!unit.alive || unit === target) continue;
      const d = Math.hypot(unit.mesh.position.x - impactPos.x, unit.mesh.position.z - impactPos.z);
      if (d <= splashRadius) {
        const falloff = THREE.MathUtils.lerp(1, splashFalloff, d / splashRadius);
        unit.takeDamage(damage * falloff);
      }
    }
    const bases = scene.userData.game?.bases || [];
    for (const base of bases) {
      if (!base.alive) continue;
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