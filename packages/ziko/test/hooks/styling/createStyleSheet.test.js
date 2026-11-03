import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createStyleSheet } from 'ziko/hooks/styling';

describe('createStyleSheet', () => {
    let target;
    let instances;

    beforeEach(() => {
        target = document.createElement('div');
        document.body.appendChild(target);
        instances = [];
    });

    afterEach(() => {
        instances.forEach(dispose => dispose());
        target.remove();
    });

    const create = (...args) => {
        const [set, remove, dispose] = createStyleSheet(...args);
        instances.push(dispose);
        return [set, remove, dispose];
    };

    /* Initialization */
    it('should create a stylesheet with initial CSS', () => {
        create('.box { color: red; }', target);
        expect(target.querySelector('style')?.textContent).toBe('.box { color: red; }');
    });

    it('should use document.head as the default target', () => {
        const [set, remove, dispose] = createStyleSheet('.box { color: red; }');
        expect(document.head.querySelector('style')?.textContent).toBe('.box { color: red; }');
        dispose();
    });

    /* Set */
    it('should replace stylesheet content by default', () => {
        const [set] = create('.box { color: red; }', target);
        set('.box { color: blue; }');
        expect(target.querySelector('style').textContent).toBe('.box { color: blue; }');
    });

    it('should support functional updates', () => {
        const [set] = create('.box { color: red; }', target);
        set(css => css.replace('red', 'blue'));
        expect(target.querySelector('style').textContent).toBe('.box { color: blue; }');
    });

    /* Append */
    it('should append CSS when append is true', () => {
        const [set] = create('.box { color: red; }', target);
        set('.title { color: blue; }', true);
        expect(target.querySelector('style').textContent).toBe('.box { color: red; }\n.title { color: blue; }');
    });

    it('should append multiple CSS rules with newline separators', () => {
        const [set] = create('.a {}', target);
        set('.b {}', true);
        set('.c {}', true);
        expect(target.querySelector('style').textContent).toBe('.a {}\n.b {}\n.c {}');
    });

    it('should support functional CSS when appending', () => {
        const [set] = create('.box { color: red; }', target);
        set(css => `.title { color: blue; }`, true);
        expect(target.querySelector('style').textContent).toBe('.box { color: red; }\n.title { color: blue; }');
    });

    it('should replace CSS when append is false', () => {
        const [set] = create('.box {}', target);
        set('.title {}', false);
        expect(target.querySelector('style').textContent).toBe('.title {}');
    });

    /* Remove */
    it('should remove the stylesheet without destroying the instance', () => {
        const [set, remove] = create('.box {}', target);
        remove();
        expect(target.querySelector('style')).toBeNull();
    });

    it('should recreate the stylesheet after removal', () => {
        const [set, remove] = create('.box { color: red; }', target);
        remove();
        set('.box { color: blue; }');
        expect(target.querySelector('style')?.textContent).toBe('.box { color: blue; }');
    });

    it('should preserve existing CSS when appending after removal', () => {
        const [set, remove] = create('.box {}', target);
        remove();
        set('.title {}', true);
        expect(target.querySelector('style')?.textContent).toBe('.box {}\n.title {}');
    });

    it('should not create duplicate style elements after repeated set calls', () => {
        const [set] = create('', target);
        set('.a {}');
        set('.b {}');
        set('.c {}');
        expect(target.querySelectorAll('style')).toHaveLength(1);
    });

    /* Dispose */
    it('should permanently remove the stylesheet', () => {
        const [set, remove, dispose] = create('.box {}', target);
        dispose();
        expect(target.querySelector('style')).toBeNull();
    });

    it('should prevent setting CSS after disposal', () => {
        const [set, remove, dispose] = create('.box {}', target);
        dispose();
        expect(() => set('.box { color: red; }')).toThrow('Stylesheet has been disposed');
    });

    it('should allow repeated dispose calls', () => {
        const [set, remove, dispose] = create('.box {}', target);
        expect(() => {
            dispose();
            dispose();
        }).not.toThrow();
    });
});