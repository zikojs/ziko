export const parse_props = (props = {}) => {

    const result = {
        methods: {},
        events: {},
        style: {},
        attrs: {}
    };

    for (const [key, value] of Object.entries(props)) {
        if (key === "style") {
            result.style = value;
        }
        else if (key.startsWith("$")) {
            result.methods[key.slice(1)] = value;
        }
        else if (/^on[A-Z]/.test(key)) {
            result.events[key] = value;
        }
        else {
            result.attrs[key] = value;
        }
    }

    return result;
}