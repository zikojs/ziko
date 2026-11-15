
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useState, isStateGetter } from "ziko/hooks";
import { tags } from "ziko/dom";

/* Initial state */

describe("useState", () => {
    it("should initialize with a primitive value", () => {
        const [get, set] = useState(10);

        expect(get().value).toBe(10);
        expect(isStateGetter(get)).toBe(true);
    });

    it("should initialize with an object", () => {
        const initial = { name: "Ziko", active: true };
        const [get] = useState(initial);

        expect(get().value).toBe(initial);
    });

    it("should initialize with an array", () => {
        const initial = [1, 2, 3];
        const [get] = useState(initial);

        expect(get().value).toBe(initial);
    });
});


/* State updates */

describe("setValue", () => {
    it("should update a primitive value", () => {
        const [get, set] = useState(10);

        set(20);

        expect(get().value).toBe(20);
    });

    it("should update an object", () => {
        const [get, set] = useState({ count: 0 });

        const next = { count: 1 };
        set(next);

        expect(get().value).toBe(next);
    });

    it("should update an array", () => {
        const [get, set] = useState([1, 2]);

        set([1, 2, 3]);

        expect(get().value).toEqual([1, 2, 3]);
    });

    it("should support functional updates", () => {
        const [get, set] = useState(10);

        set(value => value + 5);

        expect(get().value).toBe(15);
    });

    it("should support functional object updates", () => {
        const [get, set] = useState({ count: 1 });

        set(value => ({ ...value, count: value.count + 1 }));

        expect(get().value).toEqual({ count: 2 });
    });

    it("should not update when the value is identical", () => {
        const initial = { count: 1 };
        const [get, set] = useState(initial);
        const callback = vi.fn();

        get()._subscribe(callback);

        set(initial);

        expect(get().value).toBe(initial);
        expect(callback).not.toHaveBeenCalled();
    });

    it("should not update when primitive value is unchanged", () => {
        const [get, set] = useState(10);
        const callback = vi.fn();

        get()._subscribe(callback);

        set(10);

        expect(callback).not.toHaveBeenCalled();
    });

    it("should distinguish NaN correctly", () => {
        const [get, set] = useState(NaN);
        const callback = vi.fn();

        get()._subscribe(callback);

        set(NaN);

        expect(callback).not.toHaveBeenCalled();
    });

    it("should distinguish positive and negative zero", () => {
        const [get, set] = useState(0);
        const callback = vi.fn();

        get()._subscribe(callback);

        set(-0);

        expect(get().value).toBe(-0);
        expect(callback).toHaveBeenCalledOnce();
    });
});


/* Subscribers */

describe("subscriptions", () => {
    it("should notify subscribers after an update", () => {
        const [get, set] = useState(0);
        const callback = vi.fn();

        get()._subscribe(callback);

        set(1);

        expect(callback).toHaveBeenCalledWith(1);
    });

    it("should notify multiple subscribers", () => {
        const [get, set] = useState(0);

        const first = vi.fn();
        const second = vi.fn();

        get()._subscribe(first);
        get()._subscribe(second);

        set(5);

        expect(first).toHaveBeenCalledWith(5);
        expect(second).toHaveBeenCalledWith(5);
    });

    it("should return an unsubscribe function", () => {
        const [get, set] = useState(0);
        const callback = vi.fn();

        const unsubscribe = get()._subscribe(callback);

        unsubscribe();
        set(1);

        expect(callback).not.toHaveBeenCalled();
    });

    it("should not notify unsubscribed subscribers", () => {
        const [get, set] = useState(0);
        const callback = vi.fn();

        const unsubscribe = get()._subscribe(callback);

        set(1);
        unsubscribe();
        set(2);

        expect(callback).toHaveBeenCalledOnce();
    });

    it("should expose subscribers through getSubscribers", () => {
        const [get, , controller] = useState(0);
        const callback = vi.fn();

        get()._subscribe(callback);

        const subscribers = controller.getSubscribers();

        expect(subscribers).toBeInstanceOf(Set);
        expect(subscribers.has(callback)).toBe(true);
    });

    it("should return a copy of the subscribers set", () => {
        const [get, , controller] = useState(0);
        const callback = vi.fn();

        get()._subscribe(callback);

        const subscribers = controller.getSubscribers();
        subscribers.clear();

        expect(controller.getSubscribers().has(callback)).toBe(true);
    });
});


/* Controller */

describe("controller", () => {
    it("should pause state updates", () => {
        const [get, set, controller] = useState(0);

        controller.pause();
        set(10);

        expect(get().value).toBe(0);
    });

    it("should resume state updates", () => {
        const [get, set, controller] = useState(0);

        controller.pause();
        set(10);

        controller.resume();
        set(20);

        expect(get().value).toBe(20);
    });

    it("should ignore updates while paused", () => {
        const [get, set, controller] = useState(0);
        const callback = vi.fn();

        get()._subscribe(callback);

        controller.pause();
        set(1);
        set(2);

        expect(get().value).toBe(0);
        expect(callback).not.toHaveBeenCalled();
    });

    it("should clear all subscribers", () => {
        const [get, set, controller] = useState(0);
        const callback = vi.fn();

        get()._subscribe(callback);
        controller.clear();

        set(1);

        expect(callback).not.toHaveBeenCalled();
        expect(controller.getSubscribers().size).toBe(0);
    });

    it("should force an update even when the value is identical", () => {
        const [get, , controller] = useState(10);
        const callback = vi.fn();

        get()._subscribe(callback);

        controller.force(10);

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith(10);
    });

    it("should force an update while paused", () => {
        const [get, , controller] = useState(10);
        const callback = vi.fn();

        get()._subscribe(callback);

        controller.pause();
        controller.force(20);

        expect(get().value).toBe(20);
        expect(callback).toHaveBeenCalledWith(20);
    });

    it("should support functional force updates", () => {
        const [get, , controller] = useState(10);

        controller.force(value => value + 5);

        expect(get().value).toBe(15);
    });

    it("should allow pausing and resuming multiple times", () => {
        const [get, set, controller] = useState(0);

        controller.pause();
        set(1);

        controller.resume();
        set(2);

        controller.pause();
        set(3);

        controller.resume();
        set(4);

        expect(get().value).toBe(4);
    });
});


/* State getter */

describe("isStateGetter", () => {
    it("should identify a state getter", () => {
        const [get] = useState(10);

        expect(isStateGetter(get)).toBe(true);
    });

    it("should reject ordinary functions", () => {
        expect(isStateGetter(() => 10)).toBe(false);
    });

    it("should reject non-functions", () => {
        expect(isStateGetter(10)).toBe(false);
        expect(isStateGetter(null)).toBe(false);
        expect(isStateGetter(undefined)).toBe(false);
        expect(isStateGetter({})).toBe(false);
    });
});


/* UIElement integration */

describe("useState with tags and UIElement", () => {
    let container;

    beforeEach(() => {
        container = document.createElement("div");
        document.body.appendChild(container);
    });

    it("should render a primitive state value", () => {
        const [get, set] = useState("Hello");

        const element = tags.div(get);

        element.mount(container);

        expect(element.text).toBe("Hello");

        set("World");

        expect(element.text).toBe("World");
    });

    it("should render a numeric state value", () => {
        const [get, set] = useState(10);

        const element = tags.span(get).mount(container);

        expect(element.text).toBe("10");

        set(20);

        expect(element.text).toBe("20");
    });

    it("should render an object state value", () => {
        const [get, set] = useState({ count: 1 });

        const element = tags.div(get().value.count).mount(container);

        expect(element.text).toBe("1");

        set({ count: 2 });

        expect(element.text).toBe("1");
    });

    it("should update text when a state value changes", () => {
        const [get, set] = useState("First");

        const element = tags.p(get).mount(container);

        set("Second");

        expect(element.text).toBe("Second");
    });

    it("should update an element when the state changes to another primitive", () => {
        const [get, set] = useState("Before");

        const element = tags.div(get).mount(container);

        set("After");

        expect(element.text).toBe("After");
    });

    it("should replace a rendered UIElement when state changes", () => {
        const [get, set] = useState("First");

        const element = tags.div(get).mount(container);

        const previousNode = element.element.firstChild;

        set("Second");

        expect(element.text).toBe("Second");
        expect(element.element.firstChild).not.toBe(previousNode);
    });

    it("should support state inside other tags", () => {
        const [get, set] = useState("Initial");

        const element = tags.div(
            tags.h1("Title"),
            tags.p(get),
            tags.span("Footer")
        ).mount(container);

        expect(element.text).toBe("TitleInitialFooter");

        set("Updated");

        expect(element.text).toBe("TitleUpdatedFooter");
    });

    it("should preserve surrounding elements when a state changes", () => {
        const [get, set] = useState("A");

        const element = tags.div(
            tags.span("Before"),
            tags.p(get),
            tags.span("After")
        ).mount(container);

        set("B");

        expect(element.element.children).toHaveLength(3);
        expect(element.element.children[0].textContent).toBe("Before");
        expect(element.element.children[1].textContent).toBe("B");
        expect(element.element.children[2].textContent).toBe("After");
    });

    it("should update state inside SVG tags", () => {
        const [get, set] = useState("10");

        const element = tags.svg(
            tags.text(get)
        ).mount(container);

        expect(element.text).toBe("10");

        set("20");

        expect(element.text).toBe("20");
    });
});
