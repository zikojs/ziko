const _add=(a,b)=>{
    if(typeof(a)==="number"){
        if (typeof b == "number") return a + b;
        else if (b.isComplex?.())return new b.constructor(a + b.a, b.b);
        else if (b.isMatrix?.()) return b.constructor.nums(b.rows, b.cols, a).add(b);
        else if (b instanceof Array)return b.map(n=>add(n,a));                 
    }
    else if(a.isComplex?.()||a.isMatrix?.()){
        if(b instanceof Array)return b.map(n=>a.clone.add(n));
        return a.clone.add(b);
    }
    else if(a instanceof Array){
        if(b instanceof Array){
            if(a.length === b.length)return a.map((n,i)=>add(n,b[i]))
        }
        else {
            return a.map(n=>add(n,b));
        }
    }
}
const _sub=(a,b)=>{
    if(typeof(a)==="number"){
        if (typeof b == "number") return a - b;
        else if (b.isComplex?.())return new b.constructor(a - b.a, -b.b);
        else if (b.isMatrix?.()) return b.constructor.nums(b.rows, b.cols, a).sub(b);
        else if (b instanceof Array)return b.map(n=>sub(n,a));                 
    }
    else if(a.isComplex?.()||a.isMatrix?.()){
        if(b instanceof Array)return b.map(n=>a.clone.sub(n));
        return a.clone.sub(b);
    }
    else if(a instanceof Array){
        if(b instanceof Array){
            if(b instanceof Array){
                if(a.length === b.length)return a.map((n,i)=>sub(n,b[i]))
            }
        }
        else {
            return a.map(n=>sub(n,b));
        }
    }
}
const _mul=(a,b)=>{
    if(typeof(a)==="number"){
    if (typeof b == "number") return a * b;
        else if (b.isComplex?.())return new b.constructor(a * b.a, a * b.b);
        else if (b.isMatrix?.()) return b.constructor.nums(b.rows, b.cols, a).mul(b);
        else if (b instanceof Array)return b.map(n=>mul(a,n)); 
    }
    else if(a.isComplex?.()||a.isMatrix?.()){
        if(b instanceof Array)return b.map(n=>a.clone.mul(n));
        return a.clone.mul(b);
    }
    else if(a instanceof Array){
        if(b instanceof Array){
            if(b instanceof Array){
                if(a.length === b.length)return a.map((n,i)=>mul(n,b[i]))
            }
        }
        else {
            return a.map(n=>mul(n,b));
        }
    }
}
const _div=(a,b)=>{
    if(typeof(a)==="number"){
    if (typeof b == "number") return a / b;
        else if (b.isComplex?.())return new b.constructor(a / b.a,a / b.b);
        else if (b.isMatrix?.()) return b.constructor.nums(b.rows, b.cols, a).div(b);
        else if (b instanceof Array)return b.map(n=>div(a,n));
    }
    else if(a.isComplex?.()||a.isMatrix?.()){
        if(b instanceof Array)return b.map(n=>a.clone.div(n));
        return a.clone.div(b);
    }
    else if(a instanceof Array){
        if(b instanceof Array){
            if(b instanceof Array){
                if(a.length === b.length)return a.map((n,i)=>div(n,b[i]))
            }
        }
        else {
            return a.map(n=>div(n,b));
        }
    }
}
const _modulo=(a,b)=>{
    if(typeof(a)==="number"){
        if (typeof b == "number") return a % b;
            else if (b.isComplex?.())return new b.constructor(a % b.a,a % b.b);
            else if (b.isMatrix?.()) return b.constructor.nums(b.rows, b.cols, a).modulo(b);
            else if (b instanceof Array)return b.map(n=>div(a,n));
        }
        else if(a.isComplex?.()||a.isMatrix?.()){
            if(b instanceof Array)return b.map(n=>a.clone.div(n));
            return a.clone.div(b);
        }
        else if(a instanceof Array){
            if(b instanceof Array){
            }
            else {
                return a.map(n=>add(n,b));
            }
        }
}
const add=(a,...b)=>{
    var res=a;
    for(let i=0;i<b.length;i++)res=_add(res,b[i])
    return res;
}
const sub=(a,...b)=>{
    var res=a;
    for(let i=0;i<b.length;i++)res=_sub(res,b[i])
    return res;
}
const mul=(a,...b)=>{
    var res=a;
    for(let i=0;i<b.length;i++)res=_mul(res,b[i])
    return res;
}
const div=(a,...b)=>{
    var res=a;
    for(let i=0;i<b.length;i++)res=_div(res,b[i])
    return res;
}
const modulo=(a,...b)=>{
    var res=a;
    for(let i=0;i<b.length;i++)res=_modulo(res,b[i])
    return res;
}
export{
    add,
    sub,
    mul,
    div,
    modulo
}