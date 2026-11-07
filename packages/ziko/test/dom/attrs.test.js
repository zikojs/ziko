// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from 'vitest';
import { tags } from 'ziko/dom';
import { useState } from 'ziko/hooks';

describe('UIElement attributes', () => {
  let ui;

  beforeEach(() => {
    ui = tags.div();
  });

  /* setAttr */

  it('sets a single attribute', () => {
    ui.setAttr('id', 'app');

    expect(ui.element.getAttribute('id')).toBe('app');
  });

  it('sets multiple attributes from an object', () => {
    ui.setAttr({ id: 'app', title: 'Hello', role: 'button' });

    expect(ui.element.getAttribute('id')).toBe('app');
    expect(ui.element.getAttribute('title')).toBe('Hello');
    expect(ui.element.getAttribute('role')).toBe('button');
  });

  it('overwrites an existing attribute', () => {
    ui.setAttr('id', 'first').setAttr('id', 'second');

    expect(ui.element.getAttribute('id')).toBe('second');
  });

  it('supports numeric values', () => {
    ui.setAttr('tabIndex', 2);

    expect(ui.element.getAttribute('tabIndex')).toBe('2');
  });

  it('supports boolean values', () => {
    ui.setAttr('disabled', true);

    expect(ui.element.getAttribute('disabled')).toBe('true');
  });

  it('converts data attributes from camelCase to kebab-case', () => {
    ui.setAttr('dataUserId', '42');

    expect(ui.element.getAttribute('data-user-id')).toBe('42');
  });

  it('converts aria attributes from camelCase to kebab-case', () => {
    ui.setAttr('ariaLabel', 'Close');

    expect(ui.element.getAttribute('aria-label')).toBe('Close');
  });

  it('supports data and aria attributes in objects', () => {
    ui.setAttr({
      dataUserId: '42',
      dataActiveState: 'true',
      ariaLabel: 'Close',
      ariaHidden: 'true'
    });

    expect(ui.element.getAttribute('data-user-id')).toBe('42');
    expect(ui.element.getAttribute('data-active-state')).toBe('true');
    expect(ui.element.getAttribute('aria-label')).toBe('Close');
    expect(ui.element.getAttribute('aria-hidden')).toBe('true');
  });

  it('returns the UIElement for chaining', () => {
    expect(ui.setAttr('id', 'app')).toBe(ui);
  });

  /* attr getter */

  it('gets an attribute using dot notation', () => {
    ui.setAttr('id', 'app');

    expect(ui.attr.id).toBe('app');
  });

  it('gets an attribute using bracket notation', () => {
    ui.setAttr('data-count', 10);

    expect(ui.attr['data-count']).toBe('10');
  });

  it('gets data attributes using camelCase', () => {
    ui.setAttr('dataUserId', '42');

    expect(ui.attr.dataUserId).toBe('42');
  });

  it('gets aria attributes using camelCase', () => {
    ui.setAttr('ariaLabel', 'Close');

    expect(ui.attr.ariaLabel).toBe('Close');
  });

  it('returns null for a missing attribute', () => {
    expect(ui.attr.missing).toBeNull();
  });

  it('reflects changes made through setAttr', () => {
    ui.setAttr('id', 'first');

    expect(ui.attr.id).toBe('first');

    ui.setAttr('id', 'second');

    expect(ui.attr.id).toBe('second');
  });

  it('reflects direct DOM attribute changes', () => {
    ui.element.setAttribute('id', 'external');

    expect(ui.attr.id).toBe('external');
  });

  it('reflects removed attributes', () => {
    ui.setAttr('id', 'app');
    ui.removeAttr('id');

    expect(ui.attr.id).toBeNull();
  });

  it('supports checking attribute existence with in', () => {
    ui.setAttr('id', 'app');

    expect('id' in ui.attr).toBe(true);
    expect('missing' in ui.attr).toBe(false);
  });

  /* removeAttr */

  it('removes an attribute', () => {
    ui.setAttr('id', 'app').removeAttr('id');

    expect(ui.element.hasAttribute('id')).toBe(false);
  });

  it('removes multiple attributes', () => {
    ui.setAttr({ id: 'app', title: 'Hello' });
    ui.removeAttr('id', 'title');

    expect(ui.element.hasAttribute('id')).toBe(false);
    expect(ui.element.hasAttribute('title')).toBe(false);
  });

  it('does not throw when removing a missing attribute', () => {
    expect(() => ui.removeAttr('missing')).not.toThrow();
  });

  it('returns the UIElement for chaining', () => {
    expect(ui.removeAttr('id')).toBe(ui);
  });

  /* Namespaced attributes */

  it('sets and gets xlink:href', () => {
    const svg = tags.svg();

    svg.setAttr('xlink:href', '#icon');

    expect(svg.attr['xlink:href']).toBe('#icon');
  });

  it('removes xlink:href', () => {
    const svg = tags.svg();

    svg.setAttr('xlink:href', '#icon');
    svg.removeAttr('xlink:href');

    expect(svg.attr['xlink:href']).toBeNull();
  });

  /* useState */

  it('supports useState values', () => {
    const [count] = useState(0);

    ui.setAttr('data-count', count);

    expect(ui.attr['data-count']).toBe('0');
  });

  it('updates attributes when useState changes', () => {
    const [count, setCount] = useState(0);

    ui.setAttr('data-count', count);
    setCount(5);

    expect(ui.attr['data-count']).toBe('5');
  });

  it('supports useState in object attributes', () => {
    const [name, setName] = useState('first');

    ui.setAttr({ dataName: name });
    setName('second');

    expect(ui.attr['data-name']).toBe('second');
  });

  /* SVG */

  it('supports SVG attributes', () => {
    const svg = tags.svg();

    svg.setAttr({
      viewBox: '0 0 100 100',
      width: 100,
      height: 100
    });

    expect(svg.attr.viewBox).toBe('0 0 100 100');
    expect(svg.attr.width).toBe('100');
    expect(svg.attr.height).toBe('100');
  });
});