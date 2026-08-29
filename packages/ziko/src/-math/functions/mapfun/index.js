import { is_primitive } from "../../../helpers/checkers/index.js";
export const mapfun=(fun,...X)=>{
    const Y=X.map(x=>{
        if(is_primitive(x) || x?.__mapfun__) return fun(x)
        if(x instanceof Array) return x.map(n=>mapfun(fun,n));
        if(ArrayBuffer.isView(x)) return x.map(n=>fun(n));
        if(x instanceof Set) return new Set(mapfun(fun,...[...x]));
        if(x instanceof Map) return new Map([...x].map(n=>[n[0],mapfun(fun,n[1])]));
        if(x.isMatrix?.()) return new x.constructor(x.rows, x.cols, mapfun(x.arr.flat(1)))
        else if(x instanceof Object){
            return Object.fromEntries(
                Object.entries(x).map(
                    n=>n=[n[0],mapfun(fun,n[1])]
                )
            )
        }
    });
   return Y.length==1? Y[0]: Y; 
}

export const apply_fun = (x, fn) => {
    if (x.isComplex?.()) return new x.constructor(
        fn(x.a),
        fn(x.b)
    )
    if (x.isMatrix?.()) return new x.constructor(
        x.rows,
        x.cols,
        x.arr.flat(1).map(fn)
    )
    if (x instanceof Array) mapfun(fn, ...x)
    return fn(x)
}