export class RoundedBoxGeometry {
  constructor(w, h, d, seg, radius) {
    this.parameters = { w, h, d, seg, radius };
    this.type = 'RoundedBoxGeometry';
  }
  clone() { return new RoundedBoxGeometry(); }
}
