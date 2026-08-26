export function register_to_instance(target, ...mixins){
    console.log('register to instance')
    mixins.forEach(n => _register_to_instance_(target, n))
}
function _register_to_instance_(instance, mixin) {
  const descriptors = Object.getOwnPropertyDescriptors(mixin);
  for (const key of Reflect.ownKeys(descriptors)) {
    const desc = descriptors[key];
    if ('get' in desc || 'set' in desc) {
      Object.defineProperty(instance, key, {
        ...desc,
        configurable: true // 🔑 make it replaceable
      });
    } else if (typeof desc.value === 'function') {
      Object.defineProperty(instance, key, {
        value: desc.value.bind(instance),
        writable: true,     // 🔑 allow reassignment
        configurable: true, // 🔑 allow redefinition
        enumerable: false
      });
    } else {
      Object.defineProperty(instance, key, {
        value: desc.value,
        writable: true,
        configurable: true,
        enumerable: true
      });
    }
  }
}
