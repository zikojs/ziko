import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useHistory } from 'ziko/hooks/routing';

describe('useHistory', () => {
    let back, forward, go;

    beforeEach(() => {
        back = vi.spyOn(globalThis.history, 'back').mockImplementation(() => {});
        forward = vi.spyOn(globalThis.history, 'forward').mockImplementation(() => {});
        go = vi.spyOn(globalThis.history, 'go').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    /* Return value */
    it('should return undo, redo and go methods', () => {
        const history = useHistory();
        expect(history).toEqual({
            undo: expect.any(Function),
            redo: expect.any(Function),
            go: expect.any(Function)
        });
    });

    /* Undo */
    it('should call history.back()', () => {
        useHistory().undo();
        expect(back).toHaveBeenCalledOnce();
    });

    /* Redo */
    it('should call history.forward()', () => {
        useHistory().redo();
        expect(forward).toHaveBeenCalledOnce();
    });

    /* Go */
    it('should call history.go() with a positive delta', () => {
        useHistory().go(2);
        expect(go).toHaveBeenCalledWith(2);
    });

    it('should call history.go() with a negative delta', () => {
        useHistory().go(-2);
        expect(go).toHaveBeenCalledWith(-2);
    });

    it('should accept zero as a valid delta', () => {
        useHistory().go(0);
        expect(go).toHaveBeenCalledWith(0);
    });

    it('should reject non-integer deltas', () => {
        const { go: navigate } = useHistory();
        for (const value of [1.5, NaN, Infinity, '2', null, undefined, {}, []]) {
            expect(() => navigate(value)).toThrow(TypeError);
        }
        expect(go).not.toHaveBeenCalled();
    });

    it('should include the expected error message', () => {
        expect(() => useHistory().go(1.5)).toThrow('delta must be an integer');
    });
});