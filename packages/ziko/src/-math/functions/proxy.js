let {abs, sqrt, cos, sin, tan, exp, log, cosh, sinh, tanh} = Math;
// Math.abs = new Proxy(Math.abs, {
//   apply(target, thisArg, args) {
//     const x = args[0]
//       if(typeof x === 'number') return target.apply(thisArg, args);
//       if(x?.isComplex?.()){
//         const {a, b, z, phi} = x
//         const complex = (a, b) => new x.constructor(a, b) 
//         switch(target.name){
//           case 'abs' : return a.z;
//           case 'sqrt' : return complex(sqrt(z)*cos(phi/2),sqrt(z)*sin(phi/2));
//         }
//       }
      
//   }
// });


for (const key of Object.getOwnPropertyNames(Math)) {
  const fn = Math[key];
  if (typeof fn === "function") {
    Math[key] = new Proxy(fn, {
      apply(target, thisArg, args) {
        // console.log(target)
        const x = args[0]
        if(typeof x === 'number' || args.length === 0) return target.apply(thisArg, args);
        if(x?.isComplex?.()){
            const {a, b, z, phi} = x
            const complex = (a, b) => new x.constructor(a, b);
            switch(target.name){
                case 'abs' : return x.z;
                case 'sqrt' : return complex(sqrt(z)*cos(phi/2),sqrt(z)*sin(phi/2));
                case 'log' : return complex(log(z), phi);
                case 'exp' : return complex(exp(a)*cos(b),exp(a)*sin(b));
                case 'cos' : return complex(cos(a)*cosh(b),-(sin(a)*sinh(b)));
                case 'sin' : return complex(sin(a)*cosh(b),cos(a)*sinh(b));
                case 'tan' : {
                    const DEN = cos(2*a)+cosh(2*b);
                    return complex(sin(2*a) /DEN, sinh(2*b)/DEN);
                }
                case 'cosh' : return complex(cosh(a)*cos(b),sinh(a)*sin(b));
                case 'sinh' : return complex(sinh(a)*cos(b),cosh(a)*sin(b));
                case 'tanh' : {
                    const DEN=cosh(2*a)+cos(2*b);
                    return complex(sinh(2*a)/DEN,sin(2*b)/DEN)
                }
                default : return target.apply(thisArg, args)
             }
        }
        // if( x.isMatrix?.()){
        //     const {rows, cols, arr} = x
        //     // return new x.constructor(rows, cols, arr.flat(1).map(n=>));
        // }
        throw new TypeError(`Math.${key} expects only numbers`);
      }
    });
  }
}
