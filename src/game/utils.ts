import Vec from 'fast-vector';
type HasPosition = { state: { pos: Vec } };
export function getDiffVec(from: HasPosition, to: HasPosition) {
  return to.state.pos.sub(from.state.pos);
}
export function getAngle(from: HasPosition, to: HasPosition) {
  return to.state.pos.angleBetween(from.state.pos);
}
export function getDistSq(from: HasPosition, to: HasPosition) {
  return getDiffVec(from, to).magnitudeSquare();
}
export function getDist(from: HasPosition, to: HasPosition) {
  return to.state.pos.distance(from.state.pos);
}
