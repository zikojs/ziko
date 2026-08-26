export function is_dynamic(path) {
  const DynamicPattern = /(:\w+|\[\[\.\.\.\w+\]\]|\[\.\.\.\w+\]|\[\w+\]\+?)/;
  return DynamicPattern.test(path);
}
export function sort_routes(routeKeys) {
  return [...routeKeys].sort((a, b) => {
    const aIsOptionalCatchAll = a.includes('[[...');
    const bIsOptionalCatchAll = b.includes('[[...');
    
    const aIsCatchAll = a.includes('[...') && !aIsOptionalCatchAll;
    const bIsCatchAll = b.includes('[...') && !bIsOptionalCatchAll;
    
    const aIsDynamic = is_dynamic(a);
    const bIsDynamic = is_dynamic(b);

    // 1. Optional catch-alls [[...slug]] ALWAYS go last
    if (aIsOptionalCatchAll && !bIsOptionalCatchAll) return 1;
    if (!aIsOptionalCatchAll && bIsOptionalCatchAll) return -1;

    // 2. Catch-alls [...slug] go right before optional catch-alls
    if (aIsCatchAll && !bIsCatchAll) return 1;
    if (!aIsCatchAll && bIsCatchAll) return -1;

    // 3. Static routes go before standard dynamic routes ([id])
    if (!aIsDynamic && bIsDynamic) return -1;
    if (aIsDynamic && !bIsDynamic) return 1;

    // 4. Deeper/longer routes take precedence over shorter ones
    return b.length - a.length;
  });
}
export function routes_grouper(routeMap) {
  const grouped = {
    static: {},
    dynamic: {},
  };
  for (const [path, value] of Object.entries(routeMap)) {
    if (is_dynamic(path)) {
      const segments = path.split("/").filter(Boolean);
      const optionalIndex = segments.findIndex(seg => seg.endsWith("]+"));
      const hasInvalidOptional =
        optionalIndex !== -1 && optionalIndex !== segments.length - 1;
      if (hasInvalidOptional) throw new Error(`Invalid optional param position in route: "${path}" — optional parameters can only appear at the end.`);
      grouped.dynamic[path] = value;
    } 
    else grouped.static[path] = value;
  }
  return grouped;
}