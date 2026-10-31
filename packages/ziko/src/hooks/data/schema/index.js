
export function createSchema(extensions = {}) {
    const validators = {
        string: value => typeof value === "string",
        number: value => typeof value === "number" && !Number.isNaN(value),
        integer: Number.isInteger,
        boolean: value => typeof value === "boolean",
        function: value => typeof value === "function",
        symbol: value => typeof value === "symbol",
        undefined: value => value === undefined,
        null: value => value === null,
        object: value => value !== null && typeof value === "object" && !Array.isArray(value),
        array: Array.isArray,
        date: value => value instanceof Date && !Number.isNaN(value.getTime())
    };

    const rules = {};

    const schema = {};

    // -----------------------------------------
    // Chainable builder
    // -----------------------------------------

    function createBuilder(config = {}) {
        const builder = {
            __schema_type__: "rule",
            ...config,
            checks: [],

            optional() {
                this.isOptional = true;
                return this;
            }
        };

        // Add every registered rule to the builder.
        for (const name of Object.keys(rules)) {
            builder[name] = (...args) => {
                builder.checks.push({
                    name,
                    config: args[0]
                });

                return builder;
            };
        }

        // Add every registered custom validator.
        for (const name of Object.keys(customValidators)) {
            builder[name] = (...args) => {
                builder.checks.push({
                    name,
                    args,
                    validator: true
                });

                return builder;
            };
        }

        return builder;
    }

    // -----------------------------------------
    // Custom validators
    // -----------------------------------------

    const customValidators = {};

    const builtinValidators = {
        email: value =>
            typeof value === "string" &&
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),

        url: value => {
            if (typeof value !== "string") return false;

            try {
                new URL(value);
                return true;
            } catch {
                return false;
            }
        },

        ...extensions.validators
    };

    function registerValidator(name, validator) {
        customValidators[name] = validator;

        schema[name] = (...args) => {
            const builder = createBuilder();

            builder.checks.push({
                name,
                args,
                validator: true
            });

            return builder;
        };
    }

    for (const [name, validator] of Object.entries(builtinValidators)) {
        registerValidator(name, validator);
    }

    // -----------------------------------------
    // Rules
    // -----------------------------------------

    const builtinRules = {
        min: ({ value, config }) => value >= config,
        max: ({ value, config }) => value <= config,

        minLength: ({ value, config }) => value.length >= config,
        maxLength: ({ value, config }) => value.length <= config,

        matches: ({ value, config }) => config.test(value),

        ...extensions.rules
    };

    function registerRule(name, handler) {
        rules[name] = handler;

        schema[name] = config => {
            const builder = createBuilder();

            builder.checks.push({
                name,
                config
            });

            return builder;
        };
    }

    for (const [name, handler] of Object.entries(builtinRules)) {
        registerRule(name, handler);
    }

    // -----------------------------------------
    // Schema methods
    // -----------------------------------------

    for (const name of Object.keys(validators)) {
        schema[name] = () => createBuilder({
            type: name
        });
    }

    schema.object = properties => ({
        __schema_type__: "object",
        properties
    });

    schema.rule = config => createBuilder(config);

    schema.array = items => createBuilder({
        type: "array",
        items
    });

    schema.instanceOf = constructor => createBuilder({
        instanceOf: constructor
    });

    schema.addValidator = (name, validator) => {
        registerValidator(name, validator);
        return schema;
    };

    schema.addRule = (name, handler) => {
        registerRule(name, handler);
        return schema;
    };

    schema.validate = (data, definition) =>
        validateSchema(data, definition);

    // -----------------------------------------
    // Type checking
    // -----------------------------------------

    function isType(value, type) {
        const validator = validators[type];

        if (!validator) {
            throw new Error(`Unknown schema type: "${type}"`);
        }

        return validator(value);
    }

    // -----------------------------------------
    // Value validation
    // -----------------------------------------

    function validateValue(value, rule, key, parent) {
        const name = key === undefined ? "value" : `"${key}"`;

        if (value === undefined && rule?.isOptional) return value;

        // Zod compatibility
        if (rule && typeof rule.safeParse === "function") {
            const result = rule.safeParse(value);

            if (!result.success) throw result.error;

            return result.data;
        }

        // Nested object
        if (rule?.__schema_type__ === "object") {
            if (!isType(value, "object")) {
                throw new TypeError(`${name} must be an object`);
            }

            return validateSchema(value, rule.properties);
        }

        // Custom predicate
        if (typeof rule === "function") {
            if (!rule(value, parent)) {
                throw new TypeError(`Invalid value for ${name}`);
            }

            return value;
        }

        // Primitive shorthand
        if (typeof rule === "string" || Array.isArray(rule)) {
            const types = Array.isArray(rule) ? rule : [rule];

            if (!types.some(type => isType(value, type))) {
                throw new TypeError(
                    `${name} must be of type ${types.join(" or ")}`
                );
            }

            return value;
        }

        if (rule?.__schema_type__ !== "rule") return value;

        // Type validation
        if (rule.type) {
            const types = Array.isArray(rule.type) ? rule.type : [rule.type];

            if (!types.some(type => isType(value, type))) {
                throw new TypeError(
                    `${name} must be of type ${types.join(" or ")}`
                );
            }
        }

        // Instance validation
        if (rule.instanceOf && !(value instanceof rule.instanceOf)) {
            throw new TypeError(
                `${name} must be an instance of ${rule.instanceOf.name}`
            );
        }

        // Array item validation
        if (rule.items !== undefined) {
            if (!Array.isArray(value)) {
                throw new TypeError(`${name} must be an array`);
            }

            return value.map((item, index) =>
                validateValue(item, rule.items, `${key}[${index}]`, value)
            );
        }

        // Legacy direct validation
        if (rule.validate && !rule.validate(value, parent)) {
            throw new TypeError(`Invalid value for ${name}`);
        }

        // Execute chained checks in order
        for (const check of rule.checks || []) {
            let result;

            if (check.validator) {
                const validator = customValidators[check.name];

                result = validator(value, ...check.args, parent);

                if (!result) {
                    throw new TypeError(
                        `Validation failed for ${name}: ${check.name}`
                    );
                }
            } else {
                const handler = rules[check.name];

                result = handler({
                    value,
                    config: check.config,
                    rule,
                    parent,
                    key,
                    schema
                });

                if (result === false) {
                    throw new TypeError(
                        `Validation failed for ${name}: ${check.name}`
                    );
                }

                if (result !== undefined && result !== true) {
                    value = result;
                }
            }
        }

        return value;
    }

    // -----------------------------------------
    // Object validation
    // -----------------------------------------

    function validateSchema(data, definition) {
        if (!definition) return data;

        if (typeof definition.safeParse === "function") {
            const result = definition.safeParse(data);

            if (!result.success) throw result.error;

            return result.data;
        }

        if (data === null || typeof data !== "object" || Array.isArray(data)) {
            throw new TypeError("Data must be an object");
        }

        for (const [key, rule] of Object.entries(definition)) {
            const value = data[key];

            if (value === undefined) {
                if (rule?.isOptional) continue;

                throw new Error(`Missing required property: "${key}"`);
            }

            data[key] = validateValue(value, rule, key, data);
        }

        return data;
    }

    schema.validators = validators;
    schema.customValidators = customValidators;
    schema.rules = rules;

    return schema;
}
