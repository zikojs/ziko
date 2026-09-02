export function register_to_class(target, ...mixins){
    mixins.forEach(n => _register_to_class_(target, n))
}
function _register_to_class_(target, mixin) {
  const descriptors = Object.getOwnPropertyDescriptors(mixin);
  for (const key of Reflect.ownKeys(descriptors)) {
    const desc = descriptors[key];
    if ('get' in desc || 'set' in desc || typeof desc.value !== 'function') {
      Object.defineProperty(Object.getPrototypeOf(target), key, desc);
    } else if (typeof desc.value === 'function') {
      if (!Object.getPrototypeOf(target).hasOwnProperty(key)) {
        Object.defineProperty(Object.getPrototypeOf(target), key, desc);
      }
    }
  }
}