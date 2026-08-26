import { UIElement } from "../constructors/UIElement.js";
import { UINode } from "../constructors/UINode.js";

/**
 * All valid DOM tag names (HTML + SVG + MathML)
 */
type NativeTagNames =
  | keyof HTMLElementTagNameMap
  | keyof SVGElementTagNameMap
  | keyof MathMLElementTagNameMap;

/**
 * Tags that should return UINode instead of UIElement
 */
type NodeTags = "html" | "head" | "body" | "style" | "title" | "meta" | "link" | "base";

/**
 * Map native tags:
 * - html | body | style → UINode
 * - everything else → UIElement
 */
export type Tags = {
  [K in NativeTagNames]: K extends NodeTags ? UINode : UIElement;
} & {
  [key: `${string}-${string}` | `${string}_${string}`]: UIElement; // custom elements default to UIElement
};

export declare const tags: Tags;