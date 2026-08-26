const arithmetic_helper=(op, x, y)=>{
    if(typeof x === 'number'){
        if(typeof y === 'number'){
            switch(op){
                case 'add' : return x + y;
                case 'sub' : return x - y;
                case 'mul' : return x * y;
                case 'div' : return x / y;
                case 'modulo' : return x % y;
            }
        }
        if(y?.isComplex?.()) x = new y.constructor(x, 0);
        if(y?.isMatrix?.()) x = y.constructor.nums(y.rows, y.cols, x);
        return x[op](y)
    }
    if(x?.isComplex?.()){
        if(typeof y === 'number' || y?.isComplex?.()) return x.clone()[op](y);
        if(y?.isMatrix?.()){
            x = y.constructor.nums(y.rows, y.cols, x);
            return x.clone()[op](y)
        }
    }
    if(x?.isMatrix?.()){
        return x.clone()[op](y)
    }    
}
export const add=(a,...b)=>{
    let res = a;
    for(let i=0; i<b.length; i++)
        res = arithmetic_helper('add', res, b[i])
    return res;
}
export const sub=(a,...b)=>{
    let res = a;
    for(let i=0; i<b.length; i++)
        res = arithmetic_helper('sub', res, b[i])
    return res;
}
export const mul=(a,...b)=>{
    let res = a;
    for(let i=0; i<b.length; i++)
        res = arithmetic_helper('mul', res, b[i])
    return res;
}
export const div=(a,...b)=>{
    let res = a;
    for(let i=0; i<b.length; i++)
        res = arithmetic_helper('div', res, b[i])
    return res;
}
export const modulo=(a,...b)=>{
    let res = a;
    for(let i=0; i<b.length; i++)
        res = arithmetic_helper('modulo', res, b[i])
    return res;
}