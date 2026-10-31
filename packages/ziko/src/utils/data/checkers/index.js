export const isObject = value =>
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value);