import { describe, it, expect, beforeEach } from "vitest";
import { useTheme } from "ziko/hooks/styling";
import { tags } from "ziko/dom";

describe("useTheme", () => {
    let target;
    let themes;

    beforeEach(() => {
        target = document.createElement("div");

        themes = {
            light: {
                primary: "#ffffff",
                background: "#f5f5f5",
                text: "#222222"
            },
            dark: {
                primary: "#000000",
                background: "#222222",
                text: "#ffffff"
            },
            ocean: {
                primary: "#0077b6",
                background: "#caf0f8",
                text: "#03045e"
            }
        };
    });

    /* Initialization */

    it("should return a tuple containing vars, setTheme and getTheme", () => {
        const result = useTheme(themes, { target });

        expect(result).toHaveLength(3);
        expect(result[0]).toBeDefined();
        expect(typeof result[1]).toBe("function");
        expect(typeof result[2]).toBe("function");
    });

    it("should use the first theme as the default theme", () => {
        const [, , getTheme] = useTheme(themes, { target });

        expect(getTheme()).toBe("light");
    });

    it("should support a custom default theme", () => {
        const [, , getTheme] = useTheme(themes, {
            target,
            defaultTheme: "dark"
        });

        expect(getTheme()).toBe("dark");
    });

    it("should apply the default theme CSS variables", () => {
        useTheme(themes, { target });

        expect(target.style.getPropertyValue("--ziko-primary")).toBe("#ffffff");
        expect(target.style.getPropertyValue("--ziko-background")).toBe("#f5f5f5");
        expect(target.style.getPropertyValue("--ziko-text")).toBe("#222222");
    });

    it("should support a custom namespace", () => {
        useTheme(themes, {
            target,
            namespace: "app"
        });

        expect(target.style.getPropertyValue("--app-primary")).toBe("#ffffff");
    });

    it("should support UIElement as target", () => {
        const element = tags.div();

        useTheme(themes, { target: element });

        expect(
            element.element.style.getPropertyValue("--ziko-primary")
        ).toBe("#ffffff");
    });

    /* Theme Validation */

    it("should throw when themes is undefined", () => {
        expect(() => useTheme(undefined)).toThrow(TypeError);
    });

    it("should throw when themes is null", () => {
        expect(() => useTheme(null)).toThrow(TypeError);
    });

    it("should throw when themes is not an object", () => {
        expect(() => useTheme("dark")).toThrow(TypeError);
        expect(() => useTheme(123)).toThrow(TypeError);
    });

    it("should throw when themes is an array", () => {
        expect(() => useTheme([])).toThrow(TypeError);
    });

    it("should throw when themes is empty", () => {
        expect(() => useTheme({})).toThrow(TypeError);
    });

    it("should throw when defaultTheme does not exist", () => {
        expect(() => useTheme(themes, {
            target,
            defaultTheme: "unknown"
        })).toThrow("Unknown default theme: 'unknown'");
    });

    it("should throw when a theme is null", () => {
        expect(() => useTheme({
            light: null
        }, { target })).toThrow(TypeError);
    });

    it("should throw when a theme is not an object", () => {
        expect(() => useTheme({
            light: "dark"
        }, { target })).toThrow(TypeError);
    });

    it("should throw when a theme is an array", () => {
        expect(() => useTheme({
            light: []
        }, { target })).toThrow(TypeError);
    });

    /* Theme Switching */

    it("should switch to another theme", () => {
        const [, setTheme] = useTheme(themes, { target });

        setTheme("dark");

        expect(target.style.getPropertyValue("--ziko-primary")).toBe("#000000");
        expect(target.style.getPropertyValue("--ziko-background")).toBe("#222222");
        expect(target.style.getPropertyValue("--ziko-text")).toBe("#ffffff");
    });

    it("should update the active theme name", () => {
        const [, setTheme, getTheme] = useTheme(themes, { target });

        setTheme("dark");

        expect(getTheme()).toBe("dark");
    });

    it("should switch between multiple themes", () => {
        const [, setTheme, getTheme] = useTheme(themes, { target });

        setTheme("dark");
        expect(getTheme()).toBe("dark");

        setTheme("ocean");
        expect(getTheme()).toBe("ocean");

        setTheme("light");
        expect(getTheme()).toBe("light");
    });

    it("should throw when switching to an unknown theme", () => {
        const [, setTheme] = useTheme(themes, { target });

        expect(() => setTheme("unknown"))
            .toThrow("Unknown theme: 'unknown'");
    });

    it("should preserve the active theme when switching to an unknown theme", () => {
        const [, setTheme, getTheme] = useTheme(themes, { target });

        expect(() => setTheme("unknown")).toThrow();

        expect(getTheme()).toBe("light");
    });

    it("should return vars when switching themes", () => {
        const [vars, setTheme] = useTheme(themes, { target });

        expect(setTheme("dark")).toBe(vars);
    });

    /* CSS Variable References */

    it("should expose CSS variable references", () => {
        const [vars] = useTheme(themes, { target });

        expect(vars.primary).toBe("var(--ziko-primary)");
        expect(vars.background).toBe("var(--ziko-background)");
    });

    it("should keep the same vars proxy after switching themes", () => {
        const [vars, setTheme] = useTheme(themes, { target });

        setTheme("dark");

        expect(vars.primary).toBe("var(--ziko-primary)");
        expect(vars.text).toBe("var(--ziko-text)");
    });

    /* Independent Instances */

    it("should maintain independent theme state between instances", () => {
        const firstTarget = document.createElement("div");
        const secondTarget = document.createElement("div");

        const [, setFirstTheme, getFirstTheme] = useTheme(themes, {
            target: firstTarget
        });

        const [, , getSecondTheme] = useTheme(themes, {
            target: secondTarget
        });

        setFirstTheme("dark");

        expect(getFirstTheme()).toBe("dark");
        expect(getSecondTheme()).toBe("light");

        expect(
            firstTarget.style.getPropertyValue("--ziko-primary")
        ).toBe("#000000");

        expect(
            secondTarget.style.getPropertyValue("--ziko-primary")
        ).toBe("#ffffff");
    });
});