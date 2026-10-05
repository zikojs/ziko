import { describe, it, expect } from "vitest";
import { tags, UIElement } from "ziko/dom";

describe("tags", () => {
  it("creates an HTML UIElement", () => {
    const ui = tags.div();

    expect(ui).toBeInstanceOf(UIElement);
    expect(ui.element.localName).toBe("div");
  });

  it("normalizes tag names to lowercase", () => {
    const ui = tags.DIV();

    expect(ui.element.localName).toBe("div");
  });

  it("converts underscores to hyphens", () => {
    const ui = tags.custom_element();

    expect(ui.element.localName).toBe("custom-element");
  });

  it("returns undefined for symbol properties", () => {
    expect(tags[Symbol.toStringTag]).toBeUndefined();
  });

  it("creates an empty element", () => {
    const ui = tags.div();

    expect(ui.element.children).toHaveLength(0);
    expect(ui.element.textContent).toBe("");
  });

  it("accepts a string child", () => {
    const ui = tags.div("Hello");

    expect(ui.element.textContent).toBe("Hello");
  });

  it("accepts a number child", () => {
    const ui = tags.div(42);

    expect(ui.element.textContent).toBe("42");
  });

  it("accepts a UIElement child", () => {
    const child = tags.span("Hello");
    const ui = tags.div(child);

    expect(ui.element.contains(child.element)).toBe(true);
  });

  it("accepts a native HTMLElement child", () => {
    const child = document.createElement("span");
    child.textContent = "Hello";

    const ui = tags.div(child);

    expect(ui.element.contains(child)).toBe(true);
  });

  it("accepts a state getter", () => {
    const getter = () => "Hello";
    const ui = tags.div(getter);

    expect(ui).toBeInstanceOf(UIElement);
  });

  it("treats an object as props", () => {
    const ui = tags.div({
      id: "app",
      class: "container"
    });

    expect(ui.element.id).toBe("app");
    expect(ui.element.className).toBe("container");
  });

  it("supports props followed by children", () => {
    const ui = tags.div(
      { id: "app" },
      "Hello"
    );

    expect(ui.element.id).toBe("app");
    expect(ui.element.textContent).toBe("Hello");
  });

//   it("supports multiple children", () => {
//     const ui = tags.div(
//       tags.span("Hello"),
//       tags.span("World")
//     );

//     expect(ui.element.children).toHaveLength(2);
//     expect(ui.element.children[0].textContent).toBe("Hello");
//     expect(ui.element.children[1].textContent).toBe("World");
//   });

  it("creates SVG elements", () => {
    const ui = tags.svg();

    expect(ui).toBeInstanceOf(UIElement);
    expect(ui.element.namespaceURI).toBe(
      "http://www.w3.org/2000/svg"
    );
    expect(ui.element.localName).toBe("svg");
  });
});