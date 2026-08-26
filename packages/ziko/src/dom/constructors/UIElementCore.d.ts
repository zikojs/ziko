import { UINode } from "./UINode.js";
import { UIStore } from "../../__ziko__/__ui__.js";

export declare class UIElementCore extends UINode {
    cache: {
        node: Node;
        name?: string;
        isInteractive?: boolean;
        parent?: UIElementCore | null;
        isBody?: boolean;
        isRoot?: boolean;
        isHidden?: boolean;
        isFrozzen?: boolean;
        attributes?: Record<string, any>;
        filters?: Record<string, any>;
        temp?: Record<string, any>;
        element?: HTMLElement | SVGElement;
    };

    events: {
        ptr: any | null;
        mouse: any | null;
        wheel: any | null;
        key: any | null;
        drag: any | null;
        drop: any | null;
        click: any | null;
        clipboard: any | null;
        focus: any | null;
        swipe: any | null;
        custom: any | null;
    };

    observer: {
        resize: any | null;
        intersection: any | null;
    };

    items: UIStore;

    constructor();

    init(
        element: string | HTMLElement | SVGElement | null,
        name: string,
        type: "html" | "svg",
        render?: boolean
    ): void;

    get element(): HTMLElement | SVGElement | undefined;

    [Symbol.iterator](): Iterator<any>;

    maintain(): void;

    isInteractive(): boolean;

    isUIElement(): true;
}
