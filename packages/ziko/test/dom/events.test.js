import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tags } from 'ziko/dom';

describe('UIElement event methods', () => {
  let ui;

  beforeEach(() => {
    ui = tags.div();
  });

  /* on */

  it('registers multiple event listeners', () => {
    const click = vi.fn();
    const mouseover = vi.fn();

    ui.on({ click, mouseover });

    ui.element.dispatchEvent(new Event('click'));
    ui.element.dispatchEvent(new Event('mouseover'));

    expect(click).toHaveBeenCalledTimes(1);
    expect(mouseover).toHaveBeenCalledTimes(1);
  });

  it('passes the event and UIElement to callbacks', () => {
    const callback = vi.fn();
    const event = new Event('click');

    ui.on({ click: callback });
    ui.element.dispatchEvent(event);

    expect(callback).toHaveBeenCalledWith(event, ui);
    expect(callback.mock.instances[0]).toBe(ui);
  });

  it('does not register the same callback twice', () => {
    const callback = vi.fn();

    ui.on({ click: callback });
    ui.on({ click: callback });

    ui.element.dispatchEvent(new Event('click'));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('supports callback this binding', () => {
    let context;

    ui.on({
      click() {
        context = this;
      }
    });

    ui.element.dispatchEvent(new Event('click'));

    expect(context).toBe(ui);
  });

  it('returns the UIElement instance', () => {
    expect(ui.on({ click: vi.fn() })).toBe(ui);
  });

  it('does not execute callbacks when the event is paused', () => {
    const callback = vi.fn();

    ui.on({ click: callback });
    ui.cache.events.click.pause();

    ui.element.dispatchEvent(new Event('click'));

    expect(callback).not.toHaveBeenCalled();
  });

  it('resumes callbacks after pausing', () => {
    const callback = vi.fn();

    ui.on({ click: callback });
    ui.cache.events.click.pause();
    ui.cache.events.click.resume();

    ui.element.dispatchEvent(new Event('click'));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('supports external AbortSignal', () => {
    const callback = vi.fn();
    const controller = new AbortController();

    ui.on({ click: callback }, { signal: controller.signal });
    controller.abort();

    ui.element.dispatchEvent(new Event('click'));

    expect(callback).not.toHaveBeenCalled();
  });

  it('supports throttling', () => {
    vi.useFakeTimers();

    const callback = vi.fn();

    ui.on({ click: callback }, { throttle: 100 });

    ui.element.dispatchEvent(new Event('click'));
    ui.element.dispatchEvent(new Event('click'));

    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);

    ui.element.dispatchEvent(new Event('click'));

    expect(callback).toHaveBeenCalledTimes(2);

    vi.useRealTimers();
  });

  /* once */

  it('executes callbacks only once', () => {
    const callback = vi.fn();

    ui.once({ click: callback });

    ui.element.dispatchEvent(new Event('click'));
    ui.element.dispatchEvent(new Event('click'));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('supports multiple once listeners', () => {
    const click = vi.fn();
    const mouseover = vi.fn();

    ui.once({ click, mouseover });

    ui.element.dispatchEvent(new Event('click'));
    ui.element.dispatchEvent(new Event('click'));
    ui.element.dispatchEvent(new Event('mouseover'));
    ui.element.dispatchEvent(new Event('mouseover'));

    expect(click).toHaveBeenCalledTimes(1);
    expect(mouseover).toHaveBeenCalledTimes(1);
  });

  /* off */

  it('removes all callbacks for the specified event', () => {
    const first = vi.fn();
    const second = vi.fn();

    ui.on({ click: first });
    ui.on({ click: second });

    ui.off(['click']);

    ui.element.dispatchEvent(new Event('click'));

    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
  });

  it('does not remove callbacks for other events', () => {
    const click = vi.fn();
    const mouseover = vi.fn();

    ui.on({ click, mouseover });
    ui.off(['click']);

    ui.element.dispatchEvent(new Event('click'));
    ui.element.dispatchEvent(new Event('mouseover'));

    expect(click).not.toHaveBeenCalled();
    expect(mouseover).toHaveBeenCalledTimes(1);
  });

  it('ignores unknown event names', () => {
    expect(() => ui.off(['unknown'])).not.toThrow();
  });

  it('returns the UIElement instance', () => {
    expect(ui.off(['click'])).toBe(ui);
  });

  /* Destroyed element */

  it('does not register events after destruction', () => {
    ui.cache.destroyed = true;

    const callback = vi.fn();

    expect(ui.on({ click: callback })).toBe(ui);

    ui.element.dispatchEvent(new Event('click'));

    expect(callback).not.toHaveBeenCalled();
  });
});