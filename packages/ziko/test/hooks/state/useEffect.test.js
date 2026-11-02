
import { describe, it, expect, vi } from "vitest";
import { 
    useState,
    useDerived,
    useEffect
} from "ziko/hooks";

/* Initial execution */

describe("useEffect", () => {
    it("should execute the callback immediately", () => {
        const callback = vi.fn();

        useEffect(callback);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([]);
    });

    it("should pass an empty array when no dependencies are provided", () => {
        const callback = vi.fn();

        useEffect(callback);

        expect(callback).toHaveBeenCalledWith([]);
    });

    it("should pass current dependency values", () => {
        const [getA] = useState(1);
        const [getB] = useState("Hello");
        const callback = vi.fn();

        useEffect(callback, [getA, getB]);

        expect(callback).toHaveBeenCalledWith([1, "Hello"]);
    });

    /* Reactivity */

    it("should execute when a dependency changes", () => {
        const [get, set] = useState(1);
        const callback = vi.fn();

        useEffect(callback, [get]);

        set(2);

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenLastCalledWith([2]);
    });

    it("should execute when multiple dependencies change", () => {
        const [getA, setA] = useState(1);
        const [getB, setB] = useState(2);
        const callback = vi.fn();

        useEffect(callback, [getA, getB]);

        setA(3);
        expect(callback).toHaveBeenLastCalledWith([3, 2]);

        setB(4);
        expect(callback).toHaveBeenLastCalledWith([3, 4]);

        expect(callback).toHaveBeenCalledTimes(3);
    });

    it("should ignore non-state dependencies", () => {
        const [get, set] = useState(1);
        const callback = vi.fn();

        useEffect(callback, [get, 10, "hello", null, {}]);

        expect(callback).toHaveBeenCalledWith([1]);

        set(2);

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenLastCalledWith([2]);
    });

    it("should support derived state dependencies", () => {
        const [get, set] = useState(2);
        const doubled = useDerived(value => value * 2, [get]);
        const callback = vi.fn();

        useEffect(callback, [doubled]);

        expect(callback).toHaveBeenLastCalledWith([4]);

        set(5);

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenLastCalledWith([10]);
    });

    /* Cleanup */

    it("should execute the previous cleanup before rerunning", () => {
        const [get, set] = useState(1);
        const cleanup = vi.fn();
        const callback = vi.fn(() => cleanup);

        useEffect(callback, [get]);

        expect(callback).toHaveBeenCalledTimes(1);

        set(2);

        expect(cleanup).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledTimes(2);
    });

    it("should execute cleanup when disposed", () => {
        const [get] = useState(1);
        const cleanup = vi.fn();

        const dispose = useEffect(() => cleanup, [get]);

        dispose();

        expect(cleanup).toHaveBeenCalledTimes(1);
    });

    it("should unsubscribe from dependencies when disposed", () => {
        const [get, set] = useState(1);
        const callback = vi.fn();

        const dispose = useEffect(callback, [get]);

        dispose();
        set(2);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should execute cleanup before disposal only once", () => {
        const cleanup = vi.fn();

        const dispose = useEffect(() => cleanup);

        dispose();
        dispose();

        expect(cleanup).toHaveBeenCalledTimes(1);
    });

    it("should not execute cleanup when callback returns a non-function", () => {
        const [get, set] = useState(1);
        const callback = vi.fn(() => "not a cleanup function");

        const dispose = useEffect(callback, [get]);

        set(2);
        dispose();

        expect(callback).toHaveBeenCalledTimes(2);
    });

    /* Object and array dependencies */

    it("should pass object state values", () => {
        const [get, set] = useState({ count: 1 });
        const callback = vi.fn();

        useEffect(callback, [get]);

        expect(callback).toHaveBeenLastCalledWith([{ count: 1 }]);

        set({ count: 2 });

        expect(callback).toHaveBeenLastCalledWith([{ count: 2 }]);
    });

    it("should pass array state values", () => {
        const [get, set] = useState([1, 2]);
        const callback = vi.fn();

        useEffect(callback, [get]);

        expect(callback).toHaveBeenLastCalledWith([[1, 2]]);

        set([3, 4]);

        expect(callback).toHaveBeenLastCalledWith([[3, 4]]);
    });

    /* Duplicate dependencies */

    it("should handle duplicate dependencies", () => {
        const [get, set] = useState(1);
        const callback = vi.fn();

        useEffect(callback, [get, get]);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenLastCalledWith([1, 1]);

        set(2);

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenLastCalledWith([2, 2]);
    });
});
