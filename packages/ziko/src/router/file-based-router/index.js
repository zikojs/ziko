import { 
    get_root,
    normalize_path,
    routes_matcher,
    is_dynamic,
    dynamic_routes_parser,
    sort_routes,
    renderer as ziko_renderer
} from "../internal-utils/index.js";

export async function createFileBasedRouter({
  pages = {},
  url = typeof location !== 'undefined' ? location.pathname : '/',
  target = typeof document !== 'undefined' ? document.body : null,
  extensions = ['js', 'ts'],
  base = '/',
  renderer = ziko_renderer,
  wrapper,
  namedExportHandler = {
    Get: async (exportedFn, context) => {
      if (typeof exportedFn === 'function') {
        return await exportedFn(context);
      }
    }
  }
} = {}) {
  // Normalize target element safely for UI frameworks/DOM wrapper objects
  let mountTarget = target;
  if (target && typeof target === 'object' && 'element' in target) {
    mountTarget = target.element;
  }

  // 1. Normalize base path
  let cleanBase = base === '.' ? '' : base.replace(/\/$/, '');
  if (cleanBase && !cleanBase.startsWith('/')) {
    cleanBase = '/' + cleanBase;
  }

  // 2. Normalize and extract current URL path
  let rawPath = decodeURIComponent(url.replace(/\/$/, '')) || '/';
  
  // Strip base prefix if matched
  if (cleanBase && rawPath.startsWith(cleanBase)) {
    rawPath = rawPath.slice(cleanBase.length) || '/';
  }

  let currentPath = rawPath.startsWith('/') ? rawPath : '/' + rawPath;

  // 3. Normalize route masks and collect modules
  const routes = Object.keys(pages);
  const root = get_root(routes);

  const pairs = {};
  const modules = {};

  for (const route of routes) {
    const module = await pages[route]();
    const modComponent = await module.default;
    const normalizedKey = normalize_path(route, root, extensions);
    
    pairs[normalizedKey] = modComponent;
    modules[normalizedKey] = { module, rawRoute: route };
  }

  // 4. Sort routes by precedence (Static -> Dynamic -> Catch-All -> Optional Catch-All)
  const sortedRouteKeys = sort_routes(Object.keys(pairs));

  let mask = null;
  let component = null;

  for (const routePath of sortedRouteKeys) {
    if (routes_matcher(routePath, currentPath)) {
      mask = routePath;
      component = pairs[routePath];
      break;
    }
  }

  if (mask === null) {
    return { mask: null, component: null, params: {}, matched: false };
  }

  const params = is_dynamic(mask) ? dynamic_routes_parser(mask, currentPath) : {};

  if (mask in modules) {
    const { module, rawRoute } = modules[mask];
    for (const exportName in namedExportHandler) {
      if (exportName in module && typeof namedExportHandler[exportName] === 'function') {
        await namedExportHandler[exportName](module[exportName], {
          route: rawRoute,
          mask,
          module,
          currentPath,
          params
        });
      }
    }
  }

  if (mountTarget && typeof renderer === 'function') {
    await renderer(mountTarget, component, params, wrapper);
  }

  // Return router state for SSR/static build environments
  return {
    mask,
    component,
    params,
    matched: true
  };
}

// Backward-compatible alias for SPA usage
export const createSPAFileBasedRouter = createFileBasedRouter;