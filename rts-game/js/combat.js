// combat.js — Handles projectile flight, damage rolls, and FX.
import * as THREE from 'three';
import { createProjectileMesh } from './unitFactory.js';
import { CRIT_CHANCE, CRIT_MULT, TERRAIN_BONUSES } from './config.js';

export class Projectile {
  constructor(scene, from, target, damage, hitChance) {
    this.scene = scene;
    this.target = target;
    this.damage = damage;
    this.hitChance = hitChance;
    this.speed = 80;
    this.alive = true;
    this.mesh = createProjectileMesh();
    this.mesh.position.copy(from);
    scene.add(this.mesh);
  }
  update(dt) {
    if (!this.alive || !this.target.alive) { this.destroy(); return; }
    const tp = this.target.mesh.position;
    const dir = new THREE.Vector3().subVectors(tp, this.mesh.position);
    const dist = dir.length();
    if (dist < 2) { this.impact(); return; }
    dir.normalize().multiplyScalar(this.speed * dt);
    this.mesh.position.add(dir);
  }
  impact() {
    if (Math.random() < this.hitChance) {
      let dmg = this.damage;
      if (Math.random() < CRIT_CHANCE) dmg *= CRIT_MULT;
      this.target.takeDamage(dmg);
    }
    spawnExplosion(this.scene, this.mesh.position);
    this.destroy();
  }
  destroy() {
    this.alive = false;
    this.scene.remove(this.mesh);
  }
}

export function spawnExplosion(scene, pos) {
  const particles = [];
  for (let i = 0; i < 8; i++) {
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
}

export function applyTerrainBonus(domain, terrain, baseDmg, baseHp) {
  const b = TERRAIN_BONUSES[domain]?.[terrain] || { dmg:1, hp:1 };
  return { dmg: baseDmg * b.dmg, hp: baseHp * b.hp };
}
