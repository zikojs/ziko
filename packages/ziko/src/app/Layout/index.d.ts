import type { UIElement } from "../../dom/UIElement";
export interface UILayoutOptions {
  title?: string;
  icon?: string;
  description?: string;
  lang?: string;
  links?: Record<string, any>[];
  script?: Record<string, any>[];
  meta?: Record<string, any>[];
}

export class UILayout {
  options: UILayoutOptions;
  ui: UIElement[];

  constructor(
    options?: UILayoutOptions,
    ...ui: UIElement[]
  );

  render(): void | {
    title?: string;
    icon?: string;
    description?: string;
    lang?: string;
    links: Record<string, any>[];
    meta: Record<string, any>[];
    script: Record<string, any>[];
    body: UIElement[];
  };

  mount(target: Element): this;
}

export function Layout(
  options?: UILayoutOptions,
  ...ui: UIElement[]
): UILayout;