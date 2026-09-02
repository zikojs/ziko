export function at(index) {
  return this.items.at(index);
}
export function forEach(callback) {
  this.items.forEach(callback);
  return this;
}
export function map(callback) {
  return this.items.map(callback);
}
export function find(condition) {
  return this.items.filter(condition);
}

