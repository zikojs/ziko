export function routes_matcher(mask, route) {
  const maskSegments = mask.split("/").filter(Boolean);
  const routeSegments = route.split("/").filter(Boolean);
  let i = 0, j = 0;

  while (i < maskSegments.length && j < routeSegments.length) {
    const maskSegment = maskSegments[i];

    // Optional Catch-all [[...slug]]
    if (maskSegment.startsWith("[[...") && maskSegment.endsWith("]]")) {
      const remainingMaskSegments = maskSegments.length - i - 1;
      if (remainingMaskSegments === 0) return true;
      let requiredSegments = 0;
      for (let k = i + 1; k < maskSegments.length; k++) {
        if (!maskSegments[k].endsWith("]+")) requiredSegments++;
      }
      const remainingRouteSegments = routeSegments.length - j;
      const segmentsToConsume = remainingRouteSegments - requiredSegments;
      if (segmentsToConsume < 0) return false;
      j += segmentsToConsume;
      i++;
      continue;
    }

    // Required Catch-all [...slug]
    if (maskSegment.startsWith("[...") && maskSegment.endsWith("]")) {
      const remainingMaskSegments = maskSegments.length - i - 1;
      if (remainingMaskSegments === 0) return true;
      let requiredSegments = 0;
      for (let k = i + 1; k < maskSegments.length; k++) {
        if (!maskSegments[k].endsWith("]+")) requiredSegments++;
      }
      const remainingRouteSegments = routeSegments.length - j;
      if (remainingRouteSegments < requiredSegments) return false;
      const segmentsToConsume = remainingRouteSegments - requiredSegments;
      if (segmentsToConsume < 1) return false;
      j += segmentsToConsume;
      i++;
      continue;
    }

    if (maskSegment.startsWith("[") && maskSegment.endsWith("]+")) {
      if (routeSegments[j]) j++;
      i++;
      continue;
    }

    if (maskSegment.startsWith("[") && maskSegment.endsWith("]")) {
      i++;
      j++;
      continue;
    }

    if (maskSegment !== routeSegments[j]) return false;
    i++;
    j++;
  }

  while (i < maskSegments.length) {
    const seg = maskSegments[i];
    // [[...slug]] and [param]+ can match empty segments at the end
    if (seg.startsWith("[[...") && seg.endsWith("]]")) {
      i++;
      continue;
    }
    if (seg.endsWith("]+")) {
      i++;
      continue;
    }
    return false;
  }

  return i === maskSegments.length && j === routeSegments.length;
}
// // DEMO
// console.log("=== EXISTING TESTS ===");
// console.log(routes_matcher("/user/[id]+", "/user")); // true
// console.log(routes_matcher("/user/[id]+", "/user/42")); // true
// console.log(routes_matcher("/blog/[...slug]", "/blog/a/b")); // true
// console.log(routes_matcher("/blog/[id]", "/blog")); // false
// console.log(routes_matcher("/product/:id", "/product/99")); // true


