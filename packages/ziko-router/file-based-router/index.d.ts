// createSPAFileBasedRouter.d.ts

import { UIElement } from '../../../src/ui/constructors/UIElement.js'

/**
 * Creates a SPA (Single Page Application) file-based router.
 * Automatically loads and mounts the component corresponding to the current path.
 * Supports dynamic routes and parameter extraction.
 *
 * @param pages - An object mapping route paths to async module functions that return a component.
 *                Example: { "/user/[id]": () => import("./pages/user/[id].js") }
 * @param target - Optional DOM element to mount the component. Defaults to `document.body`.
 */
export function createSPAFileBasedRouter(
  options : {
    pages: Record<
      string, 
      () => Promise<{ default: (param? : Record<string, string>) => UIElement | UIElement[]}>
    >,
    target?: HTMLElement | UIElement
    extensions : string[],
    wrapper : Function
  },
): Promise<void>;
