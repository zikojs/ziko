// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tags } from 'ziko/dom';
import { useState, useDerived } from 'ziko/hooks';

describe('UIElement attributes', () => {
  let ui;

  beforeEach(() => {
    ui = tags.div();
  });

  /* setAttr */

  it('sets a string attribute', () => {
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
    ui.setAttr('id', 'first');
    ui.setAttr('id', 'second');

    expect(ui.element.getAttribute('id')).toBe('second');
  });

  it('supports numeric attribute values', () => {
    ui.setAttr('tabIndex', 2);
    expect(ui.element.getAttribute('tabIndex')).toBe('2');
  });

  it('supports boolean attribute values', () => {
    ui.setAttr('disabled', true);
    expect(ui.element.hasAttribute('disabled')).toBe(true);
  });

  it('converts data attributes from camelCase to kebab-case', () => {
    ui.setAttr('dataUserId', '42');

    expect(ui.element.getAttribute('data-user-id')).toBe('42');
  });

  it('converts aria attributes from camelCase to kebab-case', () => {
    ui.setAttr('ariaLabel', 'Close');

    expect(ui.element.getAttribute('aria-label')).toBe('Close');
  });

  it('supports multiple data and aria attributes', () => {
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

  /* removeAttr */

  it('removes an attribute', () => {
    ui.setAttr('id', 'app');
    ui.removeAttr('id');

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

  it('removes namespaced attributes', () => {
    const svg = tags.svg();

    svg.setAttr('xlink:href', '#icon');
    expect(svg.element.getAttributeNS(
      'http://www.w3.org/1999/xlink',
      'href'
    )).toBe('#icon');

    svg.removeAttr('xlink:href');

    expect(svg.element.hasAttributeNS(
      'http://www.w3.org/1999/xlink',
      'href'
    )).toBe(false);
  });

  it('returns the UIElement for chaining', () => {
    expect(ui.removeAttr('id')).toBe(ui);
  });

  /* useState */

  it('supports useState values', () => {
    const [count] = useState(0);

    ui.setAttr('data-count', count);

    expect(ui.element.getAttribute('data-count')).toBe('0');
  });

  it('updates attributes when useState changes', () => {
    const [count, setCount] = useState(0);

    ui.setAttr('data-count', count);
    setCount(5);

    expect(ui.element.getAttribute('data-count')).toBe('5');
  });

  it('supports useState in object attributes', () => {
    const [name, setName] = useState('first');

    ui.setAttr({
      id: 'app',
      dataName: name
    });

    setName('second');

    expect(ui.element.getAttribute('id')).toBe('app');
    expect(ui.element.getAttribute('data-name')).toBe('second');
  });

  /* useDerived */

//   it('supports useDerived values', () => {
//     const [count, setCount] = useState(2);
//     const doubled = useDerived(() => count.value * 2);

//     ui.setAttr('data-total', doubled);

//     expect(ui.element.getAttribute('data-total')).toBe('4');

//     setCount(5);

//     expect(ui.element.getAttribute('data-total')).toBe('10');
//   });

//   it('supports multiple reactive attributes', () => {
//     const [count, setCount] = useState(1);
//     const doubled = useDerived(() => count.value * 2);

//     ui.setAttr({
//       dataCount: count,
//       dataDoubled: doubled
//     });

//     setCount(4);

//     expect(ui.element.getAttribute('data-count')).toBe('4');
//     expect(ui.element.getAttribute('data-doubled')).toBe('8');
//   });

  /* Namespace */

  it('supports SVG attributes', () => {
    const svg = tags.svg();

    svg.setAttr({
      viewBox: '0 0 100 100',
      width: 100,
      height: 100
    });

    expect(svg.element.getAttribute('viewBox')).toBe('0 0 100 100');
    expect(svg.element.getAttribute('width')).toBe('100');
    expect(svg.element.getAttribute('height')).toBe('100');
  });

  /* Chaining */

  it('supports chaining setAttr and removeAttr', () => {
    const result = ui
      .setAttr({ id: 'app', title: 'Hello' })
      .removeAttr('title');

    expect(result).toBe(ui);
    expect(ui.element.getAttribute('id')).toBe('app');
    expect(ui.element.hasAttribute('title')).toBe(false);
  });
});