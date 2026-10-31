export function validateSchema(data, schema) {
    if (!schema) return data;
    // Zod compatibility
    if (typeof schema.safeParse === "function") {
        const result = schema.safeParse(data);
        if (!result.success) {
            throw result.error;
        }
        return result.data;
    }
    // Custom schema validation
    for (const [key, rule] of Object.entries(schema)) {
        const value = data[key];
        if (value === undefined) {
            if (typeof rule === "object" && rule?.optional) continue;
            throw new Error(`Missing required property: "${key}"`);
        }
        if (typeof rule === "string") {
            if (typeof value !== rule) {
                throw new TypeError(`"${key}" must be of type ${rule}`);
            }
            continue;
        }
        if (typeof rule === "function") {
            if (!rule(value, data)) {
                throw new TypeError(`Invalid value for "${key}"`);
            }
            continue;
        }
        if (typeof rule === "object" && rule !== null) {
            if (rule.type && typeof value !== rule.type) {
                throw new TypeError(`"${key}" must be of type ${rule.type}`);
            }
            if (rule.validate && !rule.validate(value, data)) {
                throw new TypeError(`Invalid value for "${key}"`);
            }
        }
    }
    return data;
}