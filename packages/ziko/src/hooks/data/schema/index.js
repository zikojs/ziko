export function createSchema(extensions = {}) {
    const rules = {
        string: ({ value }) => typeof value === "string",
        number: ({ value }) =>
            typeof value === "number" && !Number.isNaN(value),
        integer: ({ value }) => Number.isInteger(value),
        boolean: ({ value }) => typeof value === "boolean",
        function: ({ value }) => typeof value === "function",
        symbol: ({ value }) => typeof value === "symbol",
        undefined: ({ value }) => value === undefined,
        null: ({ value }) => value === null,
        object: ({ value }) =>
            value !== null &&
            typeof value === "object" &&
            !Array.isArray(value),
        array: ({ value }) => Array.isArray(value),
        date: ({ value }) =>
            value instanceof Date &&
            !Number.isNaN(value.getTime()),
        min: ({ value, config }) => value >= config,
        max: ({ value, config }) => value <= config,
        minLength: ({ value, config }) =>
            value.length >= config,

        maxLength: ({ value, config }) =>
            value.length <= config,

        matches: ({ value, config }) =>
            config.test(value),

        ...extensions.rules
    };

    const schema = {};

    function getErrorMessage(message, context, fallback) {
        if (typeof message === "function") {
            return message(context);
        }

        return message ?? fallback;
    }

    function executeRule(name, context) {
        const definition = rules[name];

        if (!definition) {
            throw new Error(`Unknown schema rule: "${name}"`);
        }

        const handler =
            typeof definition === "function"
                ? definition
                : definition.validate;

        if (typeof handler !== "function") {
            throw new Error(`Invalid schema rule: "${name}"`);
        }

        const result = handler(context);

        const isResultObject =
            result !== null &&
            typeof result === "object" &&
            "valid" in result;

        const valid = isResultObject
            ? Boolean(result.valid)
            : Boolean(result);

        if (!valid) {
            const message = getErrorMessage(
                isResultObject
                    ? result.message ?? definition.message
                    : definition.message,
                context,
                `Validation failed for "${context.key ?? "value"}": ${name}`
            );

            throw new TypeError(message);
        }

        if (isResultObject && "value" in result) {
            return result.value;
        }

        // Allow transformation rules to return a value.
        if (
            !isResultObject &&
            result !== true &&
            result !== undefined
        ) {
            return result;
        }

        return context.value;
    }

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

        // Dynamically expose registered rules.
        for (const name of Object.keys(rules)) {
            if (name in builder) continue;

            builder[name] = (...args) => {
                builder.checks.push({
                    name,
                    config: args[0]
                });

                return builder;
            };
        }

        return builder;
    }


    function registerRule(name, definition) {
        rules[name] = definition;

        schema[name] = (...args) => {
            const builder = createBuilder();

            builder.checks.push({
                name,
                config: args[0]
            });

            return builder;
        };
    }

    // Create methods for all built-in and extension rules.
    for (const [name, definition] of Object.entries(rules)) {
        registerRule(name, definition);
    }


    schema.object = properties => ({
        __schema_type__: "object",
        properties
    });

    schema.array = items =>
        createBuilder({
            type: "array",
            items
        });

    schema.instanceOf = constructor =>
        createBuilder({
            instanceOf: constructor
        });

    schema.addRule = (name, definition) => {
        registerRule(name, definition);
        return schema;
    };

    function validateValue(value, definition, key, parent) {
        const name = key ?? "value";

        if (value === undefined && definition?.isOptional) {
            return value;
        }

        // Zod compatibility
        if (definition && typeof definition.safeParse === "function") {
            const result = definition.safeParse(value);

            if (!result.success) {
                throw result.error;
            }

            return result.data;
        }

        // Nested objects
        if (definition?.__schema_type__ === "object") {
            if (!rules.object({ value })) {
                throw new TypeError(`${name} must be an object`);
            }

            return validateSchema(value, definition.properties);
        }

        // String or array of rule names.
        // All rules must pass (AND semantics).
        if (
            typeof definition === "string" ||
            Array.isArray(definition)
        ) {
            const names = Array.isArray(definition)
                ? definition
                : [definition];

            if (
                !names.length ||
                !names.every(rule => typeof rule === "string")
            ) {
                throw new TypeError(`Invalid rules for "${name}"`);
            }

            for (const ruleName of names) {
                value = executeRule(ruleName, {
                    value,
                    key: name,
                    parent,
                    config: undefined,
                    schema
                });
            }

            return value;
        }

        // Direct predicate
        if (typeof definition === "function") {
            if (!definition(value, parent)) {
                throw new TypeError(`Invalid value for "${name}"`);
            }

            return value;
        }

        if (definition?.__schema_type__ !== "rule") {
            return value;
        }

        // Base rule
        if (definition.type) {
            value = executeRule(definition.type, {
                value,
                key: name,
                parent,
                config: undefined,
                schema
            });
        }

        // Instance validation
        if (
            definition.instanceOf &&
            !(value instanceof definition.instanceOf)
        ) {
            throw new TypeError(
                `${name} must be an instance of ${definition.instanceOf.name}`
            );
        }

        // Array items
        if (definition.items !== undefined) {
            if (!Array.isArray(value)) {
                throw new TypeError(`${name} must be an array`);
            }

            value = value.map((item, index) =>
                validateValue(
                    item,
                    definition.items,
                    `${name}[${index}]`,
                    value
                )
            );
        }

        // Additional checks
        for (const check of definition.checks ?? []) {
            value = executeRule(check.name, {
                value,
                config: check.config,
                key: name,
                parent,
                rule: definition,
                schema
            });
        }

        return value;
    }

    function validateSchema(data, definition) {
        if (!definition) return data;

        // Zod compatibility
        if (typeof definition.safeParse === "function") {
            const result = definition.safeParse(data);

            if (!result.success) {
                throw result.error;
            }

            return result.data;
        }

        if (
            data === null ||
            typeof data !== "object" ||
            Array.isArray(data)
        ) {
            throw new TypeError("Data must be an object");
        }

        for (const [key, rule] of Object.entries(definition)) {
            const value = data[key];

            if (value === undefined && !rule?.isOptional) {
                throw new Error(
                    `Missing required property: "${key}"`
                );
            }

            data[key] = validateValue(
                value,
                rule,
                key,
                data
            );
        }

        return data;
    }

    // --------------------------------------------------
    // Public API
    // --------------------------------------------------

    schema.validate = (data, definition) =>
        validateSchema(data, definition);

    schema.rules = rules;

    return schema;
}
