import { UIElement } from '../../dom/UIElement'
import type { UILayout } from '../../Layout'

export type Component<T = unknown> =
  | ((params?: Record<string, string>) => T)
  | T
  | T[]

export type Renderer<TComponent = unknown, TTarget = unknown> = (
  target: TTarget,
  component: TComponent | TComponent[] | null,
  params: Record<string, string>,
  wrapper?: unknown
) => void | Promise<void>

export interface CreateFileBasedRouterOptions<
  TComponent = unknown,
  TTarget = unknown
> {
  pages?: Record<
    string,
    () => Promise<{
      default: (params?: Record<string, string>) => TComponent
      [key: string]: unknown
    }>
  >

  target?: TTarget | null

  extensions?: string[]

  renderer?: Renderer<TComponent, TTarget>

  wrapper?: unknown

  lazy?: boolean

  base?: string

  url?: string

  namedExportHandler?: Record<
    string,
    (
      exportedFn: unknown,
      context: {
        route: string | null
        mask: string | null
        module: unknown
        currentPath: string
        params: Record<string, string>
      }
    ) => unknown | Promise<unknown>
  >
}

export interface FileBasedRouterResult<TComponent = unknown> {
  mask: string | null
  component: TComponent | null
  params: Record<string, string>
  namedExports?: Record<string, unknown>
  matched: boolean
  error?: unknown
}

export declare function _createFileBasedRouter<
  TComponent = unknown,
  TTarget = unknown
>(
  options?: CreateFileBasedRouterOptions<TComponent, TTarget>
): Promise<FileBasedRouterResult<TComponent>>


export type ZikoComponent =
  | UIElement
  | UIElement[]
  | UILayout

export declare function createFileBasedRouter(
  options?: CreateFileBasedRouterOptions<
    ZikoComponent,
    HTMLElement | UIElement
  >
): Promise<FileBasedRouterResult<ZikoComponent>>