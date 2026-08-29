function routesMatcher(mask, route) {
    const maskSegments = mask.split('/');
    const routeSegments = route.split('/');
    if (maskSegments.length !== routeSegments.length) {
        return false;
    }
    for (let i = 0; i < maskSegments.length; i++) {
        const maskSegment = maskSegments[i];
        const routeSegment = routeSegments[i];
        if (maskSegment.startsWith(':')) {
            continue;
        } else if (maskSegment !== routeSegment) {
            return false;
        }
    }    
    return true;
}
function dynamicRoutesParser(mask, route) {
    const maskSegments = mask.split('/');
    const routeSegments = route.split('/');
    const params = {};
    if (maskSegments.length !== routeSegments.length) {
        return params; 
    }
    for (let i = 0; i < maskSegments.length; i++) {
        const maskSegment = maskSegments[i];
        const routeSegment = routeSegments[i];
        if (maskSegment.startsWith(':')) {
            const paramName = maskSegment.slice(1); 
            params[paramName] = routeSegment;
        } else if (maskSegment !== routeSegment) {
            return {};
        }
    }
    return params;
}

function isDynamic(path) {
    const DynamicPattern = /:\w+/;    
    return DynamicPattern.test(path);
  }

// // Example usage:
// const mask = "/:id/id/:lang/lang";
// const route = "/id/5/lang/fr";
// console.log(DynamicRouteMatcher(mask, route)); // Should return true

export {
    routesMatcher,
    dynamicRoutesParser,
    isDynamic
}

// // Example usage:
// const mask = "app/lang/:lang/id/:id";
// const route = "app/lang/en/id/7";
// console.log(dynamicRoutesParser(mask, route)); // Should return { lang: "en", id: "7" }