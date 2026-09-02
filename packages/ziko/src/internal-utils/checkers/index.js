export const is_primitive = value => typeof value !== 'object' && typeof value !== 'function' || value === null;
export const is_async = fn => fn && fn.constructor && fn.constructor.name === "AsyncFunction";
