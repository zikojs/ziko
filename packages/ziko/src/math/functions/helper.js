const {PI, cos, sin, tan, acos, asin, atan, cosh, sinh, tanh, acosh, asinh, atanh, log} = Math
export let Fixed={
    cos : x=> {
        if(x.isComplex?.()) return new x.constructor(
            cos(x.a)*cosh(x.b),
            -(sin(x.a)*sinh(x.b))
        );
        return cos(x)
    },
    sin : x=>{
        if(x?.isComplex) return new x.constructor(
            sin(x.a)*cosh(x.b),
            cos(x.a)*sinh(x.b)
        );
        return sin(x)
    },
    tan : x=>{
        if(x?.isComplex){
            const DEN = cos(2*x.a)+cosh(2*x.b);
            return new x.constructor(
                sin(2*x.a)/DEN,
                sinh(2*x.b)/DEN
            );
        } 
        return tan(x) 
    },
    sinc: x => sin(PI*x)/(PI*x),
    sec: x => 1/cos(x),
    csc: x => 1/sin(x),
    cot: x => 1/tan(x),
    acos: x=>{
        if(x?.isComplex) return 
        return sin(x)
    },
    asin: x=>{
        if(x?.isComplex) return 
        return sin(x)
    },
    atan: x=>{
        if(x?.isComplex) return 
        return sin(x)
    },
    acot: x => PI/2-atan(x),
    cosh: x=>{
        if(x?.isComplex) return new x.constructor(
            cosh(x.a)*cos(x.b),
            sinh(x.a)*sin(x.b)
        ); 
        return cosh(x)
    },
    sinh: x=>{
        if(x?.isComplex) return new x.constructor(
            sinh(x.a)*cos(x.b),
            cosh(x.a)*sin(x.b)
        ); 
        return sinh(x)
    },
    tanh: x=>{
        if(x?.isComplex){
            const DEN=cosh(2*a)+cos(2*b);
            return new x.constructor(
                sinh(2*a)/DEN,
                sin(2*b)/DEN
            )
        } 
        return tanh(x)
    },
    coth: n => (1/2*log((1+n)/(1-n))),
    acosh,
    asinh,
    atanh,
}

// Fixed = new Proxy(Fixed, {
//     get(target, prop) {
//         if(prop in target){
//             return x => + target[prop](x).toFixed(15);
//         }
//         return undefined;
//     }
// })