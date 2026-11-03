import { describe, it, expect, beforeEach, vi } from "vitest";
import { useCssVars } from "ziko/hooks/document";
import { tags } from "ziko/dom";

describe("useCssVars", () => {
    let target;

    beforeEach(() => {
        target = document.createElement("div");
    });

    /* Initialization */

    it("should return a tuple containing vars and setter", () => {
        const result = useCssVars({ primary: "red" });

        expect(result).toHaveLength(2);
        expect(result[0]).toBeDefined();
        expect(typeof result[1]).toBe("function");
    });

    it("should apply initial CSS variables to document.documentElement by default", () => {
        const [,] = useCssVars({ primary: "red" });

        expect(
            document.documentElement.style.getPropertyValue("--ziko-primary")
        ).toBe("red");
    });

    it("should apply initial CSS variables to the provided element", () => {
        useCssVars(
            { primary: "red" },
            { target }
        );

        expect(
            target.style.getPropertyValue("--ziko-primary")
        ).toBe("red");
    });

    it("should support Document as target", () => {
        useCssVars(
            { primary: "red" },
            { target: document }
        );

        expect(
            document.documentElement.style.getPropertyValue("--ziko-primary")
        ).toBe("red");
    });

    it("should support UIElement as target", () => {
        const element = tags.div();

        useCssVars(
            { primary: "red" },
            { target: element }
        );

        expect(
            element.element.style.getPropertyValue("--ziko-primary")
        ).toBe("red");
    });

    it("should support custom namespace", () => {
        useCssVars(
            { primary: "red" },
            { target, namespace: "app" }
        );

        expect(
            target.style.getPropertyValue("--app-primary")
        ).toBe("red");
    });

    it("should support an empty namespace", () => {
        useCssVars(
            { primary: "red" },
            { target, namespace: "" }
        );

        expect(
            target.style.getPropertyValue("--primary")
        ).toBe("red");
    });

    /* CSS Variable References */

    it("should return CSS var references", () => {
        const [vars] = useCssVars(
            { primary: "red" },
            { target }
        );

        expect(vars.primary).toBe("var(--ziko-primary)");
    });

    it("should return references for unknown properties", () => {
        const [vars] = useCssVars(
            {},
            { target }
        );

        expect(vars.unknown).toBe("var(--ziko-unknown)");
    });

    it("should return undefined for non-string properties", () => {
        const [vars] = useCssVars({}, { target });

        expect(vars[Symbol.iterator]).toBeUndefined();
    });

    it("should support the in operator", () => {
        const [vars] = useCssVars(
            { primary: "red" },
            { target }
        );

        expect("primary" in vars).toBe(true);
        expect("unknown" in vars).toBe(false);
    });

    it("should support Object.keys", () => {
        const [vars] = useCssVars(
            {
                primary: "red",
                spacing: "1rem"
            },
            { target }
        );

        expect(Object.keys(vars)).toEqual(["primary", "spacing"]);
    });

    it("should support Object.values", () => {
        const [vars] = useCssVars(
            {
                primary: "red",
                spacing: "1rem"
            },
            { target }
        );

        expect(Object.values(vars)).toEqual([
            "var(--ziko-primary)",
            "var(--ziko-spacing)"
        ]);
    });

    /* Updates */

    it("should update CSS variables", () => {
        const [, setVars] = useCssVars(
            { primary: "red" },
            { target }
        );

        setVars({ primary: "blue" });

        expect(
            target.style.getPropertyValue("--ziko-primary")
        ).toBe("blue");
    });

    it("should add new CSS variables", () => {
        const [, setVars] = useCssVars(
            { primary: "red" },
            { target }
        );

        setVars({ secondary: "green" });

        expect(
            target.style.getPropertyValue("--ziko-secondary")
        ).toBe("green");
    });

    it("should preserve existing variables when updating", () => {
        const [, setVars] = useCssVars(
            {
                primary: "red",
                secondary: "blue"
            },
            { target }
        );

        setVars({ primary: "green" });

        expect(
            target.style.getPropertyValue("--ziko-primary")
        ).toBe("green");

        expect(
            target.style.getPropertyValue("--ziko-secondary")
        ).toBe("blue");
    });

    it("should support numeric values", () => {
        const [, setVars] = useCssVars(
            { spacing: 10 },
            { target }
        );

        expect(
            target.style.getPropertyValue("--ziko-spacing")
        ).toBe("10");
    });

    it("should convert values to strings", () => {
        const [, setVars] = useCssVars(
            { spacing: 10 },
            { target }
        );

        setVars({ spacing: 20 });

        expect(
            target.style.getPropertyValue("--ziko-spacing")
        ).toBe("20");
    });

    /* Functional Updates */

    it("should support functional updates", () => {
        const [, setVars] = useCssVars(
            { spacing: 10 },
            { target }
        );

        setVars(current => ({
            spacing: current.spacing + 5
        }));

        expect(
            target.style.getPropertyValue("--ziko-spacing")
        ).toBe("15");
    });

    it("should pass a copy of current data to the updater", () => {
        const [, setVars] = useCssVars(
            { primary: "red" },
            { target }
        );

        let currentData;

        setVars(current => {
            currentData = current;
            return { primary: "blue" };
        });

        expect(currentData).toEqual({ primary: "red" });
    });

    /* Return Value */

    it("should return vars after updating", () => {
        const [vars, setVars] = useCssVars(
            { primary: "red" },
            { target }
        );

        const result = setVars({ secondary: "blue" });

        expect(result).toBe(vars);
    });

    it("should expose newly added variables through the proxy", () => {
        const [vars, setVars] = useCssVars(
            { primary: "red" },
            { target }
        );

        setVars({ secondary: "blue" });

        expect(vars.secondary).toBe("var(--ziko-secondary)");
        expect("secondary" in vars).toBe(true);
    });

    /* Independent Instances */

    it("should maintain independent data between instances", () => {
        const firstTarget = document.createElement("div");
        const secondTarget = document.createElement("div");

        const [, setFirst] = useCssVars(
            { primary: "red" },
            { target: firstTarget }
        );

        useCssVars(
            { primary: "blue" },
            { target: secondTarget }
        );

        setFirst({ primary: "green" });

        expect(
            firstTarget.style.getPropertyValue("--ziko-primary")
        ).toBe("green");

        expect(
            secondTarget.style.getPropertyValue("--ziko-primary")
        ).toBe("blue");
    });
});