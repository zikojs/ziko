import type { UIElement } from "../../dom/UIElement";
import type { UILayout, UILayoutOptions } from "../Layout/index.d.ts";

export function Page(
  options?: UILayoutOptions,
  ...ui: UIElement[]
): () => UILayout;
