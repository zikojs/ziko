// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tags } from 'ziko/dom';

describe('UIElement events', () => {
  let ui;

  beforeEach(() => {
    ui = tags.div();
  });

  const dispatch = (type, element = ui.element) => {
    element.dispatchEvent(new Event(type));
  };

  /* on */

  it('registers an event listener', () => {
    const callback = vi.fn();

    ui.on({ click: callback });
    dispatch('click');

    expect(callback).toHaveBeenCalledOnce();
  });

  it('passes the event and UIElement to the callback', () => {
    const callback = vi.fn();

    ui.on({ click: callback });
    const event = new Event('click');
    ui.element.dispatchEvent(event);

    expect(callback).toHaveBeenCalledWith(event, ui);
  });

  it('binds this to the UIElement', () => {
    let context;

    ui.on({
      click() {
        context = this;
      }
    });

    dispatch('click');
    expect(context).toBe(ui);
  });

  it('supports multiple callbacks for the same event', () => {
    const first = vi.fn();
    const second = vi.fn();

    ui.on({ click: first });
    ui.on({ click: second });

    dispatch('click');

    expect(first).toHaveBeenCalledOnce();
    expect(second).toHaveBeenCalledOnce();
  });

  it('does not register the same callback twice', () => {
    const callback = vi.fn();

    ui.on({ click: callback });
    ui.on({ click: callback });

    dispatch('click');

    expect(callback).toHaveBeenCalledOnce();
  });

  it('ignores non-function callbacks', () => {
    ui.on({ click: null, mouseover: 'invalid' });

    expect(ui.cache.events.click).toBeUndefined();
    expect(ui.cache.events.mouseover).toBeUndefined();
  });

  /* once */

  it('registers a listener that fires only once', () => {
    const callback = vi.fn();

    ui.once({ click: callback });

    dispatch('click');
    dispatch('click');

    expect(callback).toHaveBeenCalledOnce();
  });

  it('removes once callbacks from the registry', () => {
    const callback = vi.fn();

    ui.once({ click: callback });
    dispatch('click');

    expect(ui.cache.events.click.callbacks.has(callback)).toBe(false);
  });

  /* off */

  it('removes all callbacks for the specified event', () => {
    const first = vi.fn();
    const second = vi.fn();

    ui.on({ click: first });
    ui.on({ click: second });

    ui.off('click');
    dispatch('click');

    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
    expect(ui.cache.events.click.callbacks.size).toBe(0);
  });

  it('accepts an array of event names', () => {
    const click = vi.fn();
    const input = vi.fn();

    ui.on({ click, input });
    ui.off(['click', 'input']);

    dispatch('click');
    dispatch('input');

    expect(click).not.toHaveBeenCalled();
    expect(input).not.toHaveBeenCalled();
  });

  it('does not remove callbacks for other events', () => {
    const click = vi.fn();
    const input = vi.fn();

    ui.on({ click, input });
    ui.off('click');

    dispatch('click');
    dispatch('input');

    expect(click).not.toHaveBeenCalled();
    expect(input).toHaveBeenCalledOnce();
  });

  it('ignores unknown event names', () => {
    expect(() => ui.off('unknown')).not.toThrow();
  });

  it('returns the UIElement for chaining', () => {
    expect(ui.off('click')).toBe(ui);
  });

  /* pause / resume */

  it('pauses callbacks for an event', () => {
    const callback = vi.fn();

    ui.on({ click: callback });
    ui.cache.events.click.pause();

    dispatch('click');

    expect(callback).not.toHaveBeenCalled();
  });

  it('resumes callbacks for an event', () => {
    const callback = vi.fn();

    ui.on({ click: callback });
    const event = ui.cache.events.click;

    event.pause();
    dispatch('click');

    event.resume();
    dispatch('click');

    expect(callback).toHaveBeenCalledOnce();
  });

  /* options */

  it('supports capture listeners', () => {
    const callback = vi.fn();
    const parent = tags.div();
    parent.append(ui);

    parent.on({ click: callback }, { capture: true });
    parent.off('click');

    dispatch('click');

    expect(callback).not.toHaveBeenCalled();
  });

  it('removes a listener when the external signal aborts', () => {
    const controller = new AbortController();
    const callback = vi.fn();

    ui.on({ click: callback }, { signal: controller.signal });
    controller.abort();

    dispatch('click');

    expect(callback).not.toHaveBeenCalled();
    expect(ui.cache.events.click.callbacks.has(callback)).toBe(false);
  });

  it('does not register a listener with an already aborted signal', () => {
    const controller = new AbortController();
    controller.abort();

    const callback = vi.fn();
    ui.on({ click: callback }, { signal: controller.signal });

    dispatch('click');

    expect(callback).not.toHaveBeenCalled();
  });
  /* emit */

  it('emits a custom event', () => {
    const callback = vi.fn();

    ui.on({ 'user:login': callback });
    ui.emit('user:login');

    expect(callback).toHaveBeenCalledOnce();
  });

  it('passes data through event.detail', () => {
    const callback = vi.fn();
    const data = { id: 1, username: 'Zakaria' };

    ui.on({
      'user:login': e => callback(e.detail)
    });

    ui.emit('user:login', data);

    expect(callback).toHaveBeenCalledWith(data);
  });

  it('supports bubbling', () => {
    const parent = tags.div();
    parent.append(ui);

    const callback = vi.fn();
    parent.on({ 'user:login': callback });

    ui.emit('user:login', null, { bubbles: true });

    expect(callback).toHaveBeenCalledOnce();
  });

  it('supports cancelable events', () => {
    let event;

    ui.on({
      test: e => {
        event = e;
        e.preventDefault();
      }
    });

    ui.emit('test', null, { cancelable: true });

    expect(event.defaultPrevented).toBe(true);
  });

  it('returns the UIElement for chaining', () => {
    expect(ui.emit('test')).toBe(ui);
  });

  it('does nothing when destroyed', () => {
    const callback = vi.fn();

    ui.on({ test: callback });
    ui.destroy();
    ui.emit('test');

    expect(callback).not.toHaveBeenCalled();
  });
});