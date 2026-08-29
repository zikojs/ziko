import { abs , pow , nthr } from "../functions/index.js";
import { mul } from "../functions/arithmetic/index.js";
import { E } from "../const.js";
const zeros=(n)=>new Array(n).fill(0);
const ones=(n)=>new Array(n).fill(1);
const nums=(num,n)=>new Array(n).fill(num);

const arange=(a, b, step , include = false)=>{
    let tab = [];
    if(a<b){
        for (let i = a; include?i<=b:i<b; i += step) tab.push((i * 10) / 10);
    }
    else{
        for(let i = a; include?i>=b:i>b; i -= step) tab.push((i * 10) / 10);
    }
    return tab;
}
const linspace=(a,b,n=abs(b-a)+1,endpoint=true)=>{
    if(Math.floor(n)!==n)return;
    if([a,b].every(n=>typeof n==="number")){
        const [max,min]=[a,b].sort((a,b)=>b-a);
        var Y = [];
        let step ;
        endpoint ? step = (max - min) / (n - 1) : step = (max - min) / n;
        for (var i = 0; i < n; i++) {
            a<b?Y.push(min+step*i):Y.push(max-step*i);
        }
        return Y
    }

    if([a,b].some(n=>n.isComplex?.())){
        const z1 = new n.constructor(a)
        const z2 = new n.constructor(b)
        n=n||Math.abs(z1.a-z2.a)+1;
        const X=linspace(z1.a,z2.a,n,endpoint);
        const Y=linspace(z1.b,z2.b,n,endpoint);
        let Z=new Array(n).fill(null);
        Z=Z.map((n,i)=> new n.constructor(X[i],Y[i]));
        return Z;
    }
}
const logspace=(a,b,n=b-a+1,base=E,endpoint=true)=>{
    return linspace(a,b,n,endpoint).map(n=>pow(base,n))
}
const geomspace=(a,b,n=abs(b-a)+1,endpoint=true)=>{
    if(Math.floor(n)!==n)return;
    if([a,b].every(n=>typeof n==="number")){
        const [max,min]=[a,b].sort((a,b)=>b-a);
        let base;
        endpoint ? base = nthr(max/min,n-1) : base = nthr(max/min,n) ;
        const Y = [min];
        for (let i = 1; i < n; i++) {
            Y.push(Y[i-1]*base)
        }
        return a<b?Y:Y.reverse()
    }

    if([a,b].some(n=>n.isComplex?.())){
        const z1 = new n.constructor(a)
        const z2 = new n.constructor(b)
        n=n||Math.abs(z1.a-z2.a)+1;
        let base;
        endpoint ? base = nthr(z2.div(z1),n-1) : base = nthr(z2.div(z1),n) ;
        const Y = [z1];
        for (let i = 1; i < n; i++) {
            Y.push(mul(Y[i-1],base))
        } 
        return Y;
    }
}
export {
    zeros,
    ones,
    nums,
    // norm,
    // lerp,
    // map,
    // clamp,
    arange,
    linspace,
    logspace,
    geomspace,

}