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
  lazy = true,
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

  const rawRoutes = Object.keys(pages);
  const root = get_root(rawRoutes);

  let mask = null;
  let component = null;
  let module = null;
  let rawRoute = null;
  let namedExports = {};

  if (lazy) {
    // --- LAZY MODE ---
    // 3a. Map normalized masks to raw routes without executing module imports
    const maskToRawRouteMap = {};
    for (const route of rawRoutes) {
      const maskKey = normalize_path(route, root, extensions);
      maskToRawRouteMap[maskKey] = route;
    }

    // 4a. Sort route masks by precedence
    const sortedMasks = sort_routes(Object.keys(maskToRawRouteMap));

    // 5a. Match current path against route masks first
    for (const routeMask of sortedMasks) {
      if (routes_matcher(routeMask, currentPath)) {
        mask = routeMask;
        break;
      }
    }

    // Early exit if no route matches (0 dynamic imports loaded)
    if (mask === null) {
      return { mask: null, component: null, params: {}, matched: false };
    }

    // 6a. Import ONLY the matched module
    rawRoute = maskToRawRouteMap[mask];
    try {
      module = await pages[rawRoute]();
      const { default: cmp, ...restExports } = module;
      component = cmp;
      namedExports = restExports;
    } catch (error) {
      console.error(`[Router] Failed to load module for route: ${rawRoute}`, error);
      return { mask: null, component: null, params: {}, matched: false, error };
    }

  } else {
    // --- EAGER MODE ---
    // 3b. Load all modules and map normalized keys upfront
    const pairs = {};
    const modules = {};

    for (const route of rawRoutes) {
      const loadedModule = await pages[route]();
      const { default: cmp } = loadedModule;
      const normalizedKey = normalize_path(route, root, extensions);
      
      pairs[normalizedKey] = cmp;
      modules[normalizedKey] = { module: loadedModule, rawRoute: route };
    }

    // 4b. Sort route keys by precedence
    const sortedRouteKeys = sort_routes(Object.keys(pairs));

    // 5b. Match route
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

    if (mask in modules) {
      module = modules[mask].module;
      rawRoute = modules[mask].rawRoute;
      const { default: _, ...restExports } = module;
      namedExports = restExports;
    }
  }

  // 7. Parse dynamic parameters
  const params = is_dynamic(mask) ? dynamic_routes_parser(mask, currentPath) : {};

  // 8. Execute named exports handler for matched module
  for (const exportName in namedExportHandler) {
    if (exportName in namedExports && typeof namedExportHandler[exportName] === 'function') {
      await namedExportHandler[exportName](namedExports[exportName], {
        route: rawRoute,
        mask,
        module,
        currentPath,
        params
      });
    }
  }

  // 9. Render component
  if (mountTarget && typeof renderer === 'function') {
    await renderer(mountTarget, component, params, wrapper);
  }

  // Return router state
  return {
    mask,
    component,
    params,
    namedExports,
    matched: true
  };
}

// Backward-compatible alias for SPA usage
export const createSPAFileBasedRouter = createFileBasedRouter;