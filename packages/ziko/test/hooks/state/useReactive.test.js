
import { describe, it, expect, vi } from "vitest";
import { useReactive, isStateGetter } from "ziko/hooks";

/* Initial values */

describe("useReactive", () => {
    it("should create a reactive primitive", () => {
        const reactive = useReactive(10);

        expect(reactive.get().value).toBe(10);
    });

    it("should create reactive states from an object", () => {
        const reactive = useReactive({
            name: "Zakaria",
            age: 20,
        });

        expect(reactive.name.get().value).toBe("Zakaria");
        expect(reactive.age.get().value).toBe(20);
    });

    it("should create reactive states from an array", () => {
        const reactive = useReactive([10, 20, 30]);

        expect(reactive[0].get().value).toBe(10);
        expect(reactive[1].get().value).toBe(20);
        expect(reactive[2].get().value).toBe(30);
    });

    it("should preserve nested object structure", () => {
        const reactive = useReactive({
            user: {
                name: "Zakaria",
                age: 20,
            },
        });

        expect(reactive.user.name.get().value).toBe("Zakaria");
        expect(reactive.user.age.get().value).toBe(20);
    });

    it("should preserve nested arrays", () => {
        const reactive = useReactive({
            scores: [10, 20],
        });

        expect(reactive.scores[0].get().value).toBe(10);
        expect(reactive.scores[1].get().value).toBe(20);
    });

    /* State updates */

    it("should update a primitive value", () => {
        const reactive = useReactive(10);

        reactive.set(20);

        expect(reactive.get().value).toBe(20);
    });

    it("should update an object property independently", () => {
        const reactive = useReactive({
            name: "Zakaria",
            age: 20,
        });

        reactive.name.set("Updated");

        expect(reactive.name.get().value).toBe("Updated");
        expect(reactive.age.get().value).toBe(20);
    });

    it("should update an array item independently", () => {
        const reactive = useReactive([10, 20, 30]);

        reactive[1].set(50);

        expect(reactive[0].get().value).toBe(10);
        expect(reactive[1].get().value).toBe(50);
        expect(reactive[2].get().value).toBe(30);
    });

    it("should support functional updates", () => {
        const reactive = useReactive(10);

        reactive.set(value => value + 5);

        expect(reactive.get().value).toBe(15);
    });

    /* Reactivity */

    it("should notify subscribers when a primitive changes", () => {
        const reactive = useReactive(10);
        const subscriber = vi.fn();

        reactive.get()._subscribe(subscriber);

        reactive.set(20);

        expect(subscriber).toHaveBeenCalledTimes(1);
        expect(subscriber).toHaveBeenCalledWith(20);
    });

    it("should notify only the updated nested property", () => {
        const reactive = useReactive({
            name: "Zakaria",
            age: 20,
        });

        const nameSubscriber = vi.fn();
        const ageSubscriber = vi.fn();

        reactive.name.get()._subscribe(nameSubscriber);
        reactive.age.get()._subscribe(ageSubscriber);

        reactive.name.set("Updated");

        expect(nameSubscriber).toHaveBeenCalledTimes(1);
        expect(ageSubscriber).not.toHaveBeenCalled();
    });

    it("should keep nested states independent", () => {
        const reactive = useReactive({
            user: {
                name: "Zakaria",
            },
            settings: {
                theme: "dark",
            },
        });

        reactive.user.name.set("Updated");

        expect(reactive.user.name.get().value).toBe("Updated");
        expect(reactive.settings.theme.get().value).toBe("dark");
    });

    /* State getter */

    it("should expose state getters", () => {
        const reactive = useReactive({
            count: 10,
        });

        expect(isStateGetter(reactive.count.get)).toBe(true);
    });

    /* Empty collections */

    it("should handle empty objects", () => {
        const reactive = useReactive({});

        expect(reactive).toEqual({});
    });

    it("should handle empty arrays", () => {
        const reactive = useReactive([]);

        expect(reactive).toEqual([]);
    });
});
