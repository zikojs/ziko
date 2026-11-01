
import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterEach
} from "vitest";

import { useHistory } from "ziko/hooks/routing";

describe("useHistory", () => {
    let historyBack;
    let historyForward;
    let historyGo;

    beforeEach(() => {
        historyBack = vi.spyOn(globalThis.history, "back")
            .mockImplementation(() => {});

        historyForward = vi.spyOn(globalThis.history, "forward")
            .mockImplementation(() => {});

        historyGo = vi.spyOn(globalThis.history, "go")
            .mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    /* Initialization */

    describe("Initialization", () => {
        it("should return undo, redo and go functions", () => {
            const result = useHistory();

            expect(result).toEqual({
                undo: expect.any(Function),
                redo: expect.any(Function),
                go: expect.any(Function)
            });
        });

        it("should return independent utility instances", () => {
            const first = useHistory();
            const second = useHistory();

            expect(first).not.toBe(second);
            expect(first.undo).not.toBe(second.undo);
        });
    });

    /* Undo */

    describe("undo", () => {
        it("should call history.back()", () => {
            const { undo } = useHistory();

            undo();

            expect(historyBack).toHaveBeenCalledOnce();
        });

        it("should not pass arguments to history.back()", () => {
            const { undo } = useHistory();

            undo();

            expect(historyBack).toHaveBeenCalledWith();
        });

        it("should return undefined", () => {
            const { undo } = useHistory();

            expect(undo()).toBeUndefined();
        });
    });

    /* Redo */

    describe("redo", () => {
        it("should call history.forward()", () => {
            const { redo } = useHistory();

            redo();

            expect(historyForward).toHaveBeenCalledOnce();
        });

        it("should not pass arguments to history.forward()", () => {
            const { redo } = useHistory();

            redo();

            expect(historyForward).toHaveBeenCalledWith();
        });

        it("should return undefined", () => {
            const { redo } = useHistory();

            expect(redo()).toBeUndefined();
        });
    });

    /* Go */

    describe("go", () => {
        it("should navigate forward by a positive delta", () => {
            const { go } = useHistory();

            go(2);

            expect(historyGo).toHaveBeenCalledWith(2);
        });

        it("should navigate backward by a negative delta", () => {
            const { go } = useHistory();

            go(-3);

            expect(historyGo).toHaveBeenCalledWith(-3);
        });

        it("should accept zero", () => {
            const { go } = useHistory();

            go(0);

            expect(historyGo).toHaveBeenCalledWith(0);
        });

        it("should accept negative integers", () => {
            const { go } = useHistory();

            expect(() => go(-1)).not.toThrow();
        });

        it("should reject non-integer numbers", () => {
            const { go } = useHistory();

            for (const value of [1.5, -2.7, 0.1]) {
                expect(() => go(value)).toThrow(TypeError);
            }
        });

        it("should reject invalid types", () => {
            const { go } = useHistory();

            for (const value of [
                "2",
                null,
                undefined,
                true,
                {},
                [],
                NaN,
                Infinity
            ]) {
                expect(() => go(value)).toThrow(TypeError);
            }
        });

        it("should include the correct error message", () => {
            const { go } = useHistory();

            expect(() => go(1.5))
                .toThrow("delta must be an integer");
        });

        it("should not call history.go() when delta is invalid", () => {
            const { go } = useHistory();

            expect(() => go(1.5)).toThrow(TypeError);

            expect(historyGo).not.toHaveBeenCalled();
        });

        it("should return undefined", () => {
            const { go } = useHistory();

            expect(go(1)).toBeUndefined();
        });
    });

    /* Combined operations */

    describe("Combined operations", () => {
        it("should execute multiple history operations independently", () => {
            const { undo, redo, go } = useHistory();

            undo();
            redo();
            go(-2);

            expect(historyBack).toHaveBeenCalledOnce();
            expect(historyForward).toHaveBeenCalledOnce();
            expect(historyGo).toHaveBeenCalledOnce();
            expect(historyGo).toHaveBeenCalledWith(-2);
        });
    });
});
