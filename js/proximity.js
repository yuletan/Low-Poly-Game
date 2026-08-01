// proximity.js — Spatial-grid wrappers for nearby-unit queries.
// The repository SpatialGrid only exposes queryCircle(x, z, radius, cb), so
// these helpers adapt that exact API and centralize the alive/predicate checks.

export function forEachNearby(game, position, radius, callback, predicate = null) {
  if (!game?.spatialGrid || !position) return;
  game.spatialGrid.queryCircle(position.x, position.z, radius, candidate => {
    if (!candidate?.alive) return;
    if (predicate && !predicate(candidate)) return;
    callback(candidate);
  });
}

export function collectNearby(game, position, radius, predicate = null, output = []) {
  output.length = 0;
  forEachNearby(game, position, radius, candidate => output.push(candidate), predicate);
  return output;
}

export function nearestNearby(game, position, radius, predicate = null) {
  let nearest = null;
  let nearestSq = radius * radius;
  forEachNearby(game, position, radius, candidate => {
    const dx = candidate.mesh.position.x - position.x;
    const dz = candidate.mesh.position.z - position.z;
    const distanceSq = dx * dx + dz * dz;
    if (distanceSq < nearestSq) {
      nearestSq = distanceSq;
      nearest = candidate;
    }
  }, predicate);
  return nearest;
}
