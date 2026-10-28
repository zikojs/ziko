export function isSpacingProp(prop) {
  return prop.startsWith('margin') 
         || prop.startsWith('padding')
         || ['gap'].includes(prop);
}

export function transformValue(prop, value) {
  if (typeof value === 'number' && isSpacingProp(prop)) {
    return `calc(var(--ziko-base-spacing) * ${value})`;
  }
  return value;
}

export function isResponsiveValue(v) {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}
