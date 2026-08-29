export * from './mapfun/index.js'
export * from './ufunc/index.js'
export * from './arithmetic/index.js'
export * from './utils/index.js'
export * from './stats/index.js'
export * from './logic/index.js'
// export const atan2=(x,y,rad=true)=>{
//     if(typeof x === "number"){
//         if(typeof y === "number")return rad?Math.atan2(x,y):Math.atan2(x,y)*180/Math.PI;
//         else return mapfun(a=>atan2(x,a,rad),...y);
//     }
//     // else if(x.isComplex?.()){
//     //     if(typeof n === "number")return x.constructor.fromExpo(x.z**n,x.phi*n);
//     //     else return mapfun(a=>pow(x,a),...n);
//     // }
//     else if(x instanceof Array){
//         if(typeof y === "number") return mapfun(a=>atan2(a,y,rad),...x);
//         else if(y instanceof Array){
//             const Y=[];
//             for(let i=0;i<x.length;i++){
//                 Y.push(mapfun(a=>pow(x[i],a,rad),...y))
//             }
//             return Y;
//         }
//     }
// }
// export const fact=(...x)=>mapfun(n=> {
//         let i,
//         y = 1;
//         if (n == 0) y = 1;
//         else if (n > 0) for (i = 1; i <= n; i++) y *= i;
//         else y = NaN;
//         return y;
//     },...x);

// export const hypot=(...x)=>{
//     if(x.every(n=>typeof n === "number"))return Math.hypot(...x);
//     if(x.every(n=>n instanceof Array))return mapfun(
//         Math.hypot,
//         ...x
//     )
// }

