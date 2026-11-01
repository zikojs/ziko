
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLongPress } from 'ziko/hooks';
import { tags } from 'ziko/dom';

describe('useLongPress', () => {
    let target;
    let callback;

    beforeEach(() => {
        vi.useFakeTimers();
        target = document.createElement('div');
        callback = vi.fn();
    });

    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });

    const pointerEvent = (type) => {
        target.dispatchEvent(new Event(type));
    };

    it('should call callback after the default timeout', () => {
        useLongPress(target, callback);

        pointerEvent('pointerdown');

        vi.advanceTimersByTime(499);
        expect(callback).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should use a custom timeout', () => {
        useLongPress(target, callback, 1000);

        pointerEvent('pointerdown');

        vi.advanceTimersByTime(999);
        expect(callback).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should pass the pointerdown event to the callback', () => {
        useLongPress(target, callback);

        const event = new Event('pointerdown');
        target.dispatchEvent(event);

        vi.advanceTimersByTime(500);

        expect(callback).toHaveBeenCalledWith(event);
    });

    it('should cancel when pointerup occurs', () => {
        useLongPress(target, callback);

        pointerEvent('pointerdown');
        vi.advanceTimersByTime(200);

        pointerEvent('pointerup');
        vi.advanceTimersByTime(500);

        expect(callback).not.toHaveBeenCalled();
    });

    it('should cancel when pointerleave occurs', () => {
        useLongPress(target, callback);

        pointerEvent('pointerdown');
        pointerEvent('pointerleave');

        vi.advanceTimersByTime(500);

        expect(callback).not.toHaveBeenCalled();
    });

    it('should cancel when pointercancel occurs', () => {
        useLongPress(target, callback);

        pointerEvent('pointerdown');
        pointerEvent('pointercancel');

        vi.advanceTimersByTime(500);

        expect(callback).not.toHaveBeenCalled();
    });

    it('should not start multiple timers while pressed', () => {
        useLongPress(target, callback);

        pointerEvent('pointerdown');
        vi.advanceTimersByTime(200);

        pointerEvent('pointerdown');

        vi.advanceTimersByTime(300);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should allow another long press after cancellation', () => {
        useLongPress(target, callback);

        pointerEvent('pointerdown');
        pointerEvent('pointerup');

        pointerEvent('pointerdown');
        vi.advanceTimersByTime(500);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should return a cancellation function', () => {
        const cancel = useLongPress(target, callback);

        expect(cancel).toBeTypeOf('function');

        pointerEvent('pointerdown');
        cancel();

        vi.advanceTimersByTime(500);

        expect(callback).not.toHaveBeenCalled();
    });

    it('should support UIElement targets', () => {
        const element = tags.p('Hello world');
        const cancel = vi.spyOn(element.element, 'addEventListener');

        useLongPress(element, callback);

        expect(cancel).toHaveBeenCalledWith(
            'pointerdown',
            expect.any(Function)
        );
    });
});
