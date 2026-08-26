function parseQueryParams(queryString) {
    const params = {};
    queryString.replace(/[A-Z0-9]+?=([\w|:|\/\.]*)/gi, (match) => {
        const [key, value] = match.split('=');
        params[key] = value;
    });
    return params;
}

function defineParamsGetter(target ){
    Object.defineProperties(target, {
        'QueryParams': {
            get: function() {
                return parseQueryParams(globalThis.location.search.substring(1));
            },
            configurable: false,
            enumerable: true 
        },
        'HashParams': {
            get: function() {
                const hash = globalThis.location.hash.substring(1);
                return hash.split("#");
            },
            configurable: false,
            enumerable: true 
        }
    });
}


/*

  /users?name=ziko&age=26
  /users#name=ziko

*/

export{
    defineParamsGetter
}