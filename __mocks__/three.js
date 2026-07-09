import { vi } from 'vitest';

// Minimal Three.js mock for testing

class Vector2 {
  constructor(x = 0, y = 0) { this.x = x; this.y = y; }
  set(x, y) { this.x = x; this.y = y; return this; }
  clone() { return new Vector2(this.x, this.y); }
}

class Vector3 {
  constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
  set(x, y, z) { this.x = x; this.y = y; this.z = z; return this; }
  clone() { return new Vector3(this.x, this.y, this.z); }
  copy(v) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }
  add(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }
  subVectors(a, b) { this.x = a.x - b.x; this.y = a.y - b.y; this.z = a.z - b.z; return this; }
  normalize() { const l = Math.hypot(this.x, this.y, this.z) || 1; this.x /= l; this.y /= l; this.z /= l; return this; }
  multiplyScalar(s) { this.x *= s; this.y *= s; this.z *= s; return this; }
  distanceTo(v) { return Math.hypot(this.x - v.x, this.y - v.y, this.z - v.z); }
  applyQuaternion() { return this; }
  project() { return this; }
  dot(v) { return this.x * v.x + this.y * v.y + this.z * v.z; }
  length() { return Math.hypot(this.x, this.y, this.z); }
  setFromMatrixPosition() { return this; }
  setFromMatrixColumn() { return this; }
}

class Color {
  constructor(hex) { this._hex = hex; }
  getHex() { return this._hex; }
  setHex(hex) { this._hex = hex; return this; }
  clone() { return new Color(this._hex); }
  lerp() { return this; }
}

class Object3D {
  constructor() {
    this.position = new Vector3();
    this.rotation = { x: 0, y: 0, z: 0, set: function(x, y, z) { this.x = x; this.y = y; this.z = z; return this; } };
    this.scale = { x: 1, y: 1, z: 1, setScalar(s) { this.x = s; this.y = s; this.z = s; return this; } };
    this.quaternion = { normalize() {}, setFromUnitVectors() {}, clone() { return this; } };
    this.children = [];
    this.userData = {};
    this.visible = true;
    this.renderOrder = 0;
    this.matrix = { autoUpdate: true };
    this.parent = null;
  }
  add(...children) { for (const c of children) { c.parent = this; this.children.push(c); } }
  remove(child) { this.children = this.children.filter(c => c !== child); }
  traverse(fn) { fn(this); for (const c of this.children) c.traverse(fn); }
  clone() { const g = new Object3D(); g.position = this.position.clone(); return g; }
}

class Group extends Object3D {
  constructor() { super(); this.type = 'Group'; }
}

class Mesh extends Object3D {
  constructor(geometry, material) {
    super();
    this.geometry = geometry;
    this.material = material || new MeshBasicMaterial();
    this.type = 'Mesh';
    this.castShadow = false;
    this.receiveShadow = false;
  }
  isMesh = true;
}

class Line extends Object3D {
  constructor(geometry, material) {
    super();
    this.geometry = geometry;
    this.material = material;
    this.type = 'Line';
  }
}

class LineSegments extends Object3D {
  constructor(geometry, material) {
    super();
    this.geometry = geometry;
    this.material = material;
    this.type = 'LineSegments';
  }
}

class BufferGeometry {
  constructor() { this.attributes = {}; }
  setFromPoints() { return this; }
  setAttribute(name, attr) { this.attributes[name] = attr; return this; }
  computeVertexNormals() {}
  computeBoundingSphere() {}
  dispose() {}
  clone() { return new BufferGeometry(); }
}

class BufferAttribute {
  constructor(array, itemSize) { this.array = array; this.itemSize = itemSize; }
}

class Plane {
  constructor(normal, constant) { this.normal = normal; this.constant = constant; }
}

class Raycaster {
  constructor() {
    this.ray = { intersectPlane() { return null; } };
  }
  setFromCamera() {}
  intersectObjects() { return []; }
}

class SphereGeometry extends BufferGeometry {
  constructor(r, w, h) { super(); this.parameters = { r, w, h }; this.type = 'SphereGeometry'; }
  clone() { return new SphereGeometry(); }
}

class BoxGeometry extends BufferGeometry {
  constructor(w, h, d) { super(); this.parameters = { w, h, d }; this.type = 'BoxGeometry'; }
  clone() { return new BoxGeometry(); }
}

class CylinderGeometry extends BufferGeometry {
  constructor(r1, r2, h, seg) { super(); this.parameters = { r1, r2, h, seg }; this.type = 'CylinderGeometry'; }
  clone() { return new CylinderGeometry(); }
}

class CapsuleGeometry extends BufferGeometry {
  constructor(r, h, capSeg, radSeg) { super(); this.parameters = { r, h, capSeg, radSeg }; this.type = 'CapsuleGeometry'; }
  clone() { return new CapsuleGeometry(); }
}

class ConeGeometry extends BufferGeometry {
  constructor(r, h, seg) { super(); this.parameters = { r, h, seg }; this.type = 'ConeGeometry'; }
  clone() { return new ConeGeometry(); }
}

class RingGeometry extends BufferGeometry {
  constructor(inner, outer, seg) { super(); this.parameters = { inner, outer, seg }; this.type = 'RingGeometry'; }
  clone() { return new RingGeometry(); }
}

class PlaneGeometry extends BufferGeometry {
  constructor(w, h) { super(); this.parameters = { w, h }; this.type = 'PlaneGeometry'; }
  clone() { return new PlaneGeometry(); }
}

class CircleGeometry extends BufferGeometry {
  constructor(r, seg) { super(); this.parameters = { r, seg }; this.type = 'CircleGeometry'; }
  clone() { return new CircleGeometry(); }
}

class Shape {
  constructor() { this.vertices = []; }
  moveTo(x, y) { this.vertices.push({ x, y }); }
  lineTo(x, y) { this.vertices.push({ x, y }); }
  closePath() {}
}

class ShapeGeometry extends BufferGeometry {
  constructor(shape) { super(); this.shape = shape; this.type = 'ShapeGeometry'; }
  clone() { return new ShapeGeometry(); }
}

class EdgesGeometry extends BufferGeometry {
  constructor(geo, threshold) { super(); this.geo = geo; this.threshold = threshold; this.type = 'EdgesGeometry'; }
  clone() { return new EdgesGeometry(); }
}

class MeshStandardMaterial {
  constructor(props = {}) {
    this.color = new Color(props.color || 0xffffff);
    this.emissive = new Color(props.emissive || 0x000000);
    this.roughness = props.roughness || 0.5;
    this.metalness = props.metalness || 0.5;
    this.transparent = props.transparent || false;
    this.opacity = props.opacity ?? 1;
    this.depthWrite = props.depthWrite !== false;
    this.side = props.side;
    this.emissiveIntensity = props.emissiveIntensity || 0;
    this.envMapIntensity = 0.7;
    this.type = 'MeshStandardMaterial';
  }
  clone() { return new MeshStandardMaterial(this); }
}

class MeshBasicMaterial {
  constructor(props = {}) {
    this.color = new Color(props.color || 0xffffff);
    this.transparent = props.transparent || false;
    this.opacity = props.opacity ?? 1;
    this.side = props.side;
    this.depthTest = props.depthTest !== false;
    this.depthWrite = props.depthWrite !== false;
    this.type = 'MeshBasicMaterial';
  }
  clone() { return new MeshBasicMaterial({ color: this.color.getHex(), transparent: this.transparent, opacity: this.opacity }); }
  dispose() {}
}

class MeshPhysicalMaterial extends MeshStandardMaterial {
  constructor(props = {}) {
    super(props);
    this.transmission = props.transmission || 0;
  }
  clone() { return new MeshPhysicalMaterial(this); }
}

class LineBasicMaterial {
  constructor(props = {}) {
    this.color = new Color(props.color || 0xffffff);
    this.transparent = props.transparent || false;
    this.opacity = props.opacity ?? 1;
    this.depthTest = props.depthTest !== false;
    this.type = 'LineBasicMaterial';
  }
  dispose() {}
  clone() { return new LineBasicMaterial(this); }
}

class LineLoop extends Line {
  constructor(geometry, material) { super(geometry, material); this.type = 'LineLoop'; }
}

const MathUtils = {
  clamp: (v, min, max) => Math.min(Math.max(v, min), max),
  degToRad: d => d * Math.PI / 180,
  radToDeg: r => r * 180 / Math.PI,
  lerp: (a, b, t) => a + (b - a) * t,
  generateUUID: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16); }),
};

const DoubleSide = 2;
const FlatShading = 1;

const Scene = Object3D;
const PerspectiveCamera = Object3D;

export {
  Vector2,
  Vector3,
  Color,
  Object3D,
  Group,
  Mesh,
  Line,
  LineSegments,
  LineLoop,
  BufferGeometry,
  BufferAttribute,
  Plane,
  Raycaster,
  SphereGeometry,
  BoxGeometry,
  CylinderGeometry,
  CapsuleGeometry,
  ConeGeometry,
  RingGeometry,
  PlaneGeometry,
  CircleGeometry,
  Shape,
  ShapeGeometry,
  EdgesGeometry,
  MeshStandardMaterial,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  LineBasicMaterial,
  MathUtils,
  DoubleSide,
  FlatShading,
  Scene,
  PerspectiveCamera,
};

export default {
  Vector2,
  Vector3,
  Color,
  Object3D,
  Group,
  Mesh,
  Line,
  LineSegments,
  LineLoop,
  BufferGeometry,
  BufferAttribute,
  Plane,
  Raycaster,
  SphereGeometry,
  BoxGeometry,
  CylinderGeometry,
  CapsuleGeometry,
  ConeGeometry,
  RingGeometry,
  PlaneGeometry,
  CircleGeometry,
  Shape,
  ShapeGeometry,
  EdgesGeometry,
  MeshStandardMaterial,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  LineBasicMaterial,
  MathUtils,
  DoubleSide,
  FlatShading,
  Scene,
  PerspectiveCamera,
};
