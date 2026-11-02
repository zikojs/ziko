
import { describe, it, expect, vi } from "vitest";
import { 
    useState,
    useDerived
} from "ziko/hooks";

/* Initial value */

describe("useDerived", () => {
    it("should return the derived initial value", () => {
        const [get] = useState(5);
        const derived = useDerived(value => value * 2, [get]);

        expect(derived().value).toBe(10);
    });

    it("should support multiple sources", () => {
        const [getA] = useState(2);
        const [getB] = useState(3);

        const derived = useDerived((a, b) => a + b, [getA, getB]);

        expect(derived().value).toBe(5);
    });

    it("should support object values", () => {
        const [get] = useState({ count: 2 });

        const derived = useDerived(state => state.count, [get]);

        expect(derived().value).toBe(2);
    });

    it("should support array values", () => {
        const [get] = useState([1, 2, 3]);

        const derived = useDerived(
            values => values.reduce((sum, value) => sum + value, 0),
            [get]
        );

        expect(derived().value).toBe(6);
    });

    /* Reactivity */

    it("should update when a source changes", () => {
        const [get, set] = useState(2);
        const derived = useDerived(value => value * 2, [get]);

        set(5);

        expect(derived().value).toBe(10);
    });

    it("should update when multiple sources change", () => {
        const [getA, setA] = useState(2);
        const [getB, setB] = useState(3);

        const derived = useDerived((a, b) => a + b, [getA, getB]);

        setA(5);
        expect(derived().value).toBe(8);

        setB(10);
        expect(derived().value).toBe(15);
    });

    it("should support functional source updates", () => {
        const [get, set] = useState(1);
        const derived = useDerived(value => value * 2, [get]);

        set(value => value + 2);

        expect(derived().value).toBe(6);
    });

    /* Notifications */

    it("should notify subscribers when the derived value changes", () => {
        const [get, set] = useState(1);
        const derived = useDerived(value => value * 2, [get]);
        const subscriber = vi.fn();

        derived()._subscribe(subscriber);

        set(3);

        expect(subscriber).toHaveBeenCalledTimes(1);
        expect(subscriber).toHaveBeenCalledWith(6);
    });

    it("should not notify when the derived value remains unchanged", () => {
        const [get, set] = useState(2);
        const derived = useDerived(value => value % 2, [get]);
        const subscriber = vi.fn();

        derived()._subscribe(subscriber);

        set(4);

        expect(subscriber).not.toHaveBeenCalled();
    });

    it("should notify all subscribers", () => {
        const [get, set] = useState(1);
        const derived = useDerived(value => value + 1, [get]);

        const subscriberA = vi.fn();
        const subscriberB = vi.fn();

        derived()._subscribe(subscriberA);
        derived()._subscribe(subscriberB);

        set(5);

        expect(subscriberA).toHaveBeenCalledWith(6);
        expect(subscriberB).toHaveBeenCalledWith(6);
    });

    it("should support unsubscribing subscribers", () => {
        const [get, set] = useState(1);
        const derived = useDerived(value => value * 2, [get]);
        const subscriber = vi.fn();

        const unsubscribe = derived()._subscribe(subscriber);

        set(2);
        unsubscribe();
        set(3);

        expect(subscriber).toHaveBeenCalledTimes(1);
        expect(subscriber).toHaveBeenCalledWith(4);
    });

    /* Object.is behavior */

    it("should handle NaN correctly", () => {
        const [get, set] = useState(1);
        const derived = useDerived(() => NaN, [get]);
        const subscriber = vi.fn();

        derived()._subscribe(subscriber);

        set(2);

        expect(subscriber).not.toHaveBeenCalled();
    });

    it("should detect positive and negative zero changes", () => {
        const [get, set] = useState(0);
        const derived = useDerived(value => value, [get]);
        const subscriber = vi.fn();

        derived()._subscribe(subscriber);

        set(-0);

        expect(subscriber).toHaveBeenCalledTimes(1);
        expect(subscriber).toHaveBeenCalledWith(-0);
    });

    /* State getter */

    it("should be recognized as a state getter", () => {
        const [get] = useState(1);
        const derived = useDerived(value => value + 1, [get]);

        expect(typeof derived).toBe("function");
        expect(derived().value).toBe(2);
    });

    it("should return the latest value to new subscribers", () => {
        const [get, set] = useState(1);
        const derived = useDerived(value => value * 2, [get]);

        set(5);

        expect(derived().value).toBe(10);
    });

    /* Derived from derived */

    it("should support chained derived states", () => {
        const [get, set] = useState(2);

        const doubled = useDerived(value => value * 2, [get]);
        const squared = useDerived(value => value ** 2, [doubled]);

        expect(squared().value).toBe(16);

        set(3);

        expect(doubled().value).toBe(6);
        expect(squared().value).toBe(36);
    });

    /* Multiple dependencies */

    it("should update when the same source is used more than once", () => {
        const [get, set] = useState(2);
        const derived = useDerived((a, b) => a + b, [get, get]);

        expect(derived().value).toBe(4);

        set(3);

        expect(derived().value).toBe(6);
    });
});
