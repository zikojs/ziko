
/*
  Project: ziko.js
  Author: Zakaria Elalaoui
  Date : Wed Aug 26 2026 10:48:40 GMT+0100 (UTC+01:00)
  Git-Repo : https://github.com/zakarialaoui10/ziko.js
  Git-Wiki : https://github.com/zakarialaoui10/ziko.js/wiki
  Released under MIT License
*/

const { PI: PI$1, E } = Math;
const EPSILON=Number.EPSILON;

const is_primitive$1 = value => typeof value !== 'object' && typeof value !== 'function' || value === null;

const mapfun$1=(fun,...X)=>{
    const Y=X.map(x=>{
        if(is_primitive$1(x) || x?.__mapfun__) return fun(x)
        if(x instanceof Array) return x.map(n=>mapfun$1(fun,n));
        if(ArrayBuffer.isView(x)) return x.map(n=>fun(n));
        if(x instanceof Set) return new Set(mapfun$1(fun,...[...x]));
        if(x instanceof Map) return new Map([...x].map(n=>[n[0],mapfun$1(fun,n[1])]));
        if(x.isMatrix?.()) return new x.constructor(x.rows, x.cols, mapfun$1(x.arr.flat(1)))
        else if(x instanceof Object){
            return Object.fromEntries(
                Object.entries(x).map(
                    n=>n=[n[0],mapfun$1(fun,n[1])]
                )
            )
        }
    });
   return Y.length==1? Y[0]: Y; 
};

const apply_fun = (x, fn) => {
    if (x.isComplex?.()) return new x.constructor(
        fn(x.a),
        fn(x.b)
    )
    if (x.isMatrix?.()) return new x.constructor(
        x.rows,
        x.cols,
        x.arr.flat(1).map(fn)
    )
    if (x instanceof Array) mapfun$1(fn, ...x);
    return fn(x)
};

const base2base = (value, fromBase, toBase) => {

    const dec = parseInt(value, fromBase);
    if (Number.isNaN(dec)) throw new TypeError('Invalid value for the given base');

    return dec.toString(toBase);
};

const percentile = (X, p) => {
  if (X.length === 0) 
    return NaN;
  let a = X.sort((x, y) => x - y);
  let index = (p / 100) * (a.length - 1);
  let i = Math.floor(index);
  let f = index - i;
  if (i === a.length - 1) 
    return a[i]; 
  return a[i] * (1 - f) + a[i + 1] * f;
};

const q1 = X => percentile(X, 25); 
const median = X => percentile(X, 50); 
const q3 = X => percentile(X, 75); 

// Interquartile Range
const iqr = X => q3(X) - q1(X);

// Mean
const mean = (...x) => x.reduce((a, b) => a + b) / x.length;
const geo_mean = (...x) => (x.reduce((a, b) => a * b)) ** (1/x.length);
// Quadratic Mean
const rms = (...x) => {
    const n = x.length;
    return (Math.hypot(...x)/n)**(1/n)
};

const weighted_mean=(values, weights)=>{
  let sum = 0, sw = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i] * weights[i];
    sw += weights[i];
  }
  return sum / sw;
};

const harmonic_mean = (...x) => {
  let s = 0, i = 0;
  for(i=0; i<x.length; i++) 
    s += 1/x[i];
  return x.length / s;
};

const power_mean = (X, p) =>{
  let s = 0, i = 0, l = X.length;
  for(i=0; i < l; i++) 
    s+= X[i]**p;
  return (s / l) ** (1 / p);
};

const trimmed_mean = (X, k) =>{
  let a = [...X].sort((a,b)=>a-b).slice(k, X.length - k);
  return mean(...a);
};

const winsorized_mean = (X, k) =>{
  let a = [...X].sort((a,b)=>a-b);
  let low = a[k], high = a[a.length - k - 1];
  a = a.map(x => Math.max(low, Math.min(high, x)));
  return mean(a);
};

const midrange = (x) =>{
  let min = Math.min(...x);
  let max = Math.max(...x);
  return (min + max) / 2;
};

const midhinge = (...x) =>{
  let a = x.sort((a,b)=>a-b);
  let q1 = a[Math.floor((a.length - 1) * 0.25)];
  let q3 = a[Math.floor((a.length - 1) * 0.75)];
  return (q1 + q3) / 2;
};


const interquartile_mean = (...x) =>{
  let a = x.sort((a,b)=>a-b);
  let q1 = a[Math.floor((a.length - 1) * 0.25)];
  let q3 = a[Math.floor((a.length - 1) * 0.75)];
  let m = a.filter(x => x >= q1 && x <= q3);
  return mean(m);
};


const contraharmonic_mean = (...x) =>{
  let num = 0, den = 0, i, l = x.length;
  for(i = 0; i < l; i++){
    num += x[i]**2;
    den += x[i];
  }
  return num / den;
};

// Population Variance
const variance = (...x) => {
  const n = x.length;
  if (n === 0) return NaN;
  const x_mean = mean(...x);
  return x.reduce((sum, xi) => sum + (xi - x_mean) ** 2, 0) / n;
};
const std = (...x) => Math.sqrt(variance(...x));

const sample_variance = (...x) => {
  const n = x.length;
  if (n < 2) return NaN;
  const x_mean = mean(...x);
  return x.reduce((sum, xi) => sum + (xi - x_mean) ** 2, 0) / (n - 1);
};
const sample_std = (...x) => Math.sqrt(sample_variance(...x));

const weighted_variance = (X, weights) => {
  const n = X.length;
  if (n === 0 || weights.length !== n) return NaN;
  const sw = weights.reduce((sum, w) => sum + w, 0);
  const mean = X.reduce((sum, x, i) => sum + x * weights[i], 0) / sw;
  return X.reduce((sum, x, i) => sum + weights[i] * (x - mean) ** 2, 0) / sw;
};
const weighted_std = (X, weights) => Math.sqrt(weighted_variance(X, weights));

const rolling_variance = (X, windowSize) => {
  if (windowSize < 1 || X.length < windowSize) return [];
  let result = [];
  for (let i = 0; i <= X.length - windowSize; i++) {
    const w = X.slice(i, i + windowSize);
    result.push(sample_variance(w)); // usually sample variance for rolling
  }
  return result;
};
const rolling_std = (X, windowSize) => Math.sqrt(rolling_variance(X, windowSize));

// Simple Moving Average
const sma = (X, w) =>{
  let r = [];
  for (let i = 0; i <= X.length - w; i++) {
    let s = 0;
    for (let j = 0; j < w; j++) s += X[i + j];
    r.push(s / w);
  }
  return r;
};

// exponential Moving Average
const ema = (X, alpha) =>{
  let r = [], prev = X[0];
  r.push(prev);
  for (let i = 1; i < X.length; i++) {
    prev = alpha * X[i] + (1 - alpha) * prev;
    r.push(prev);
  }
  return r;
};

// weightedMovingAverage
const wma = (X, weights) =>{
  let k = weights.length;
  let sw = weights.reduce((a,b)=>a+b, 0);
  let r = [];
  for (let i = 0; i <= X.length - k; i++) {
    let s = 0;
    for (let j = 0; j < k; j++) s += X[i+j] * weights[j];
    r.push(s / sw);
  }
  return r;
};

const accum_sum = (arr) => {
  let result = [];
  let total = 0;
  for (let x of arr) {
    total += x;
    result.push(total);
  }
  return result;
};

const accum_product = (arr) => {
  let result = [];
  let prod = 1;
  for (let x of arr) {
    prod *= x;
    result.push(prod);
  }
  return result;
};

const accum_max = (arr) => {
  let result = [];
  let m = -Infinity;
  for (let x of arr) {
    m = Math.max(m, x);
    result.push(m);
  }
  return result;
};

const accum_min = (arr) => {
  let result = [];
  let m = Infinity;
  for (let x of arr) {
    m = Math.min(m, x);
    result.push(m);
  }
  return result;
};

class Random {
    static int(a, b){
        return Math.floor(this.float(a, b));
    }
    static float(a, b){
        return b !== undefined
            ? Math.random() * (b - a) + a
            : Math.random() * a;
    }
    static bin(){
        return this.int(2);
    }
    static oct(){
        return this.int(8);
    }
    static dec(){
        return this.int(10);
    }
    static hex(){
        return base2base(this.int(16), 10, 16);
    }
    static char(upperCase = false){
        const i = upperCase
            ? this.int(65, 91)
            : this.int(97, 123);
        return String.fromCharCode(i);
    }
    static bool(){
        return Boolean(this.int(2));
    }
    static get color(){
        return {
            hex : () =>
                `#${this.int(0xffffff).toString(16).padStart(6, '0')}`,

            hexa : () => {
                const [r,g,b,a] = Array.from(
                    {length:4},
                    () => this.int(0xff).toString(16).padStart(2,'0')
                );
                return `#${r}${g}${b}${a}`;
            },
            rgb : () => {
                const [r,g,b] = Array.from({length:3}, () => this.int(0xff));
                return `rgb(${r}, ${g}, ${b})`;
            },
            rgba : () => {
                const [r,g,b] = Array.from({length:3}, () => this.int(0xff));
                const a = Math.random().toFixed(2);
                return `rgba(${r}, ${g}, ${b}, ${a})`;
            },
            hsl : () => {
                const h = this.int(360);
                const s = this.int(100);
                const l = this.int(100);
                return `hsl(${h}, ${s}%, ${l}%)`;
            },
            hsla : () => {
                const h = this.int(360);
                const s = this.int(100);
                const l = this.int(100);
                const a = Math.random().toFixed(2);
                return `hsla(${h}, ${s}%, ${l}%, ${a})`;
            },
            gray : () => {
                const g = this.int(0xff);
                return `rgb(${g}, ${g}, ${g})`;
            }
        };
    }
    static get sample(){
        const R = this;
        return {
            int   : (n, a, b) => Array.from({length:n}, () => R.int(a, b)),
            float : (n, a, b) => Array.from({length:n}, () => R.float(a, b)),
            char  : (n, upper=false) => Array.from({length:n}, () => R.char(upper)),
            bool  : n => Array.from({length:n}, () => R.bool()),
            bin   : n => Array.from({length:n}, () => R.bin()),
            oct   : n => Array.from({length:n}, () => R.oct()),
            dec   : n => Array.from({length:n}, () => R.dec()),
            hex   : n => Array.from({length:n}, () => R.hex()),
            get color(){
                return {
                    hex  : n => Array.from({length:n}, () => R.color.hex()),
                    hexa : n => Array.from({length:n}, () => R.color.hexa()),
                    rgb  : n => Array.from({length:n}, () => R.color.rgb()),
                    rgba : n => Array.from({length:n}, () => R.color.rgba()),
                    hsl  : n => Array.from({length:n}, () => R.color.hsl()),
                    hsla : n => Array.from({length:n}, () => R.color.hsla()),
                    gray : n => Array.from({length:n}, () => R.color.gray())
                };
            },
            choice : (n, choices, p) =>
                Array.from({length:n}, () => R.choice(choices, p))
        };
    }
    static shuffle(arr){
        return [...arr].sort(() => 0.5 - Math.random());
    }
    static choice(choices = [1,2,3], p = new Array(choices.length).fill(1 / choices.length)){
        const acc = accum_sum(...p).map(v => v * 100);
        const pool = new Array(100);
        pool.fill(choices[0], 0, acc[0]);
        for(let i=1;i<choices.length;i++)
            pool.fill(choices[i], acc[i-1], acc[i]);
        return pool[this.int(pool.length)];
    }
}


globalThis.Random = Random;

// // (upperCase) => upperCase ? : String.fromCharCode(rand_int(97,120))
// class Random {
//     static string(length,upperCase){
//         return length instanceof Array?
//             new Array(this.int(...length)).fill(0).map(() => this.char(upperCase)).join(""):
//             new Array(length).fill(0).map(() => this.char(upperCase)).join("");
//     }

// }
// export{Random}

const complex_constructor = (Complex, a, b) => {
    let _a, _b;
  if (a instanceof Complex) {
    _a = a.a;
    _b = a.b;
  } 
  else if (typeof a === "object") {
    if ("a" in a && "b" in a) {
      _a = a.a;
      _b = a.b;
    } 
    else if ("a" in a && "z" in a) {
      _a = a.a;
      _b = Math.sqrt(a.z ** 2 - a.a ** 2);
    } 
    else if ("a" in a && "phi" in a) {
      _a = a.a;
      _b = a.a * Math.tan(a.phi);
    } 
    else if ("b" in a && "z" in a) {
      _b = a.b;
      _a = Math.sqrt(a.z ** 2 - a.b ** 2);
    } 
    else if ("b" in a && "phi" in a) {
      _b = b;
      _a = a.b / Math.tan(a.phi);
    } 
    else if ("z" in a && "phi" in a) {
      _a = +a.z * Math.cos(a.phi).toFixed(15);
      _b = +a.z * Math.sin(a.phi).toFixed(15);
    }
  } 
  else if (typeof a === "number" && typeof b === "number") {
    _a = +a.toFixed(32);
    _b = +b.toFixed(32);
  }
  return [_a, _b]
};

class Complex{
    constructor(a = 0, b = 0) {
        [
            this.a,
            this.b
        ] = complex_constructor(Complex, a, b);
    }
    get __mapfun__(){
        return true
    }
    isComplex(){
        return true
    }
    toString(){
        let str = "";
        if (this.a !== 0)
          this.b >= 0
            ? (str = `${this.a}+${this.b}*i`)
            : (str = `${this.a}-${Math.abs(this.b)}*i`);
        else
          this.b >= 0
            ? (str = `${this.b}*i`)
            : (str = `-${Math.abs(this.b)}*i`);
        return str;
    }
    serialize() {
        return JSON.stringify({
            type : 'complex',
            data : this
        });
    }
    static deserialize(json){
        if(typeof json === 'string') json = JSON.parse(json);
        let {data, type} = json;
        return (type === 'complex' && ('a' in data) && ('b' in data))
            ? new Complex(data.a, data.b)
            : TypeError('Not a valid complex')
    } 
    toFixed(n){
        this.a = + this.a.toFixed(n);
        this.b = + this.b.toFixed(n);
        return this; 
    }  
    toPrecision(n){
        this.a = + this.a.toPrecision(n);
        this.b = + this.b.toPrecision(n);
        return this; 
    }  
    clone() {
        return new Complex(this.a, this.b);
    }
    get z(){
        return Math.hypot(this.a,this.b);    
    }
    get phi(){
        return Math.atan2(this.b , this.a);        
    }
    static zero() {
        return new Complex(0, 0);
    }
    static fromPolar(z, phi) {
        return new Complex(
            +(z * cos(phi)).toFixed(13), 
            +(z * sin(phi)).toFixed(13)
        );
    }
    
    static get random(){
        return {
            int : (a, b)=> new Complex(...Random.sample.int(2, a, b) ),
            float : (a, b)=> new Complex(...Random.sample.float(2, a, b) ),
        }
    }
    static twiddle(K, N){
        const phi = -2 * Math.PI * K / N;
        return new Complex(
            Math.cos(phi), 
            Math.sin(phi)
        );
    }
    get conj() {
        return new Complex(this.a, -this.b);
    }
    get inv() {
        return new Complex(
            this.a / Math.hypot(this.a, this.b),
            -this.b / Math.hypot(this.a, this.b)
        );
    }
    add(...c) {
        for (let i = 0; i < c.length; i++) {
            if (typeof c[i] === "number") c[i] = new Complex(c[i], 0);
            this.a += c[i].a;
            this.b += c[i].b;
        }
        return this;
    }
    sub(...c) {
        for (let i = 0; i < c.length; i++) {
            if (typeof c[i] === "number") c[i] = new Complex(c[i], 0);
            this.a -= c[i].a;
            this.b -= c[i].b;
        }
        return this;
    }
    mul(...c){
        let {z, phi} = this;
        for (let i = 0; i < c.length; i++) {
            if (typeof c[i] === "number") c[i] = new Complex(c[i], 0);
            z *= c[i].z;
            phi += c[i].phi;
        }
        this.a = z * Math.cos(phi);
        this.b = z * Math.sin(phi);  
        return this.toFixed(8);
    }
    div(...c){
        let {z, phi} = this;
        for (let i = 0; i < c.length; i++) {
            if (typeof c[i] === "number") c[i] = new Complex(c[i], 0);
            z /= c[i].z;
            phi -= c[i].phi;
        }
        this.a = z * Math.cos(phi);
        this.b = z * Math.sin(phi);  
        return this.toFixed(8);    }
    modulo(...c) {
        for (let i = 0; i < c.length; i++) {
            if (typeof c[i] === "number") c[i] = new Complex(c[i], 0);
            this.a %= c[i].a;
            this.b %= c[i].b;
        }
        return this;
    }
    pow(...c){
        let {z, phi} = this;
        for (let i = 0; i < c.length; i++) {
            if (typeof c[i] === "number") c[i] = new Complex(c[i], 0);
            z *= Math.exp(c[i].a * Math.log(z) - c[i].b * phi);
            phi += c[i].b * Math.log(z) + c[i].a * phi;
        }
        this.a = z * Math.cos(phi);
        this.b = z * Math.sin(phi);  
        return this;
    }
    get expo() {
        return [this.z, this.phi];
    }
    nthr(n=2){
        return complex({z: this.z ** (1/n), phi: this.phi / n});
    }
    get sqrt(){
        return this.nthr(2);
    }
    get cbrt(){
        return this.nthr(3);
    }
    get log(){
        return complex(this.z, this.phi);
    }
    get cos(){
        return complex(
            Math.cos(this.a) * Math.cosh(this.b),
            Math.sin(this.a) * Math.sinh(this.b)
        )
    }
    get sin(){
        return complex(
            Math.sin(this.a) * Math.cosh(this.b),
            Math.cos(this.a) * Math.sinh(this.b)
        )
    }
    get tan(){
        const D=cos(this.a*2)+cosh(this.b*2);
        return complex(
            Math.sin(2 * this.a) / D,
            Math.sinh(2 * this.b) / D
        );
    }
}
const complex=(a,b)=>{
    if((a instanceof Array||ArrayBuffer.isView(a)) && (b instanceof Array||ArrayBuffer.isView(a)))return a.map((n,i)=>complex(a[i],b[i]));
    if(a.isMatrix?.() && b.isMatrix?.()){
        if((a.shape[0]!==b.shape[0])||(a.shape[1]!==b.shape[1]))return Error(0)
        const arr=a.arr.map((n,i)=>complex(a.arr[i],b.arr[i]));
        return new a.constructor(a.rows,a.cols,...arr)
    }
    return new Complex(a,b)
};

const PRECESION = 8;

const abs = (...x) => mapfun$1(
    x =>{
        if(x.isComplex?.()) return x.z;
        return Math.abs(x)
    },
    ...x
);

const pow$1 = (...x) => {
    const n = x.pop();
    return mapfun$1(
        x => {
            if(x.isComplex?.()) {
                if(n.isComplex?.()) return new x.constructor({
                    z: Math.exp(n.a * Math.log(x.z) - n.b * x.phi),
                    phi: n.b * Math.log(x.z) + n.a * x.phi
                })
                return new x.constructor({z: x.z ** n, phi: x.phi * n});
            }
            if(n.isComplex?.()) return new x.constructor({
                    z: Math.exp(n.a * Math.log(x)),
                    phi: n.b * Math.log(x)
            })
            return Math.pow(x, n)
        },
        ...x
    )
};

const sqrt$2 = (...x) => mapfun$1(
    x=>{
        if(x.isComplex?.()) 
            return new x.constructor({z: x.z**(1/2), phi: x.phi/2});
        if(x < 0) return complex(0, Math.sqrt(-x)).toFixed(PRECESION)
        return + Math.sqrt(x).toFixed(PRECESION);
    },
    ...x
);

const cbrt = (...x) => mapfun$1(
    x=>{
        if(x.isComplex?.()) 
            return new x.constructor({z: x.z**(1/3), phi: x.phi/3}).toFixed(PRECESION)
        return + Math.cbrt(x).toFixed(PRECESION);
    },
    ...x
);

const nthr = (...x) => {
    const n = x.pop();
    if(typeof n !== 'number') throw Error('nthr expects a real number n');
    return mapfun$1(
        x => {
            if(x.isComplex?.()) return new x.constructor({z: x.z ** (1/n), phi: x.phi / n});
            if(x<0) return n %2 ===2 
                ? complex(0, (-x)**(1/n)).toFixed(PRECESION)
                : + (-1 * (-x)**(1/n)).toFixed(PRECESION)                
            return + (x**(1/n)).toFixed(PRECESION)
        },
        ...x
    )
};

const croot = (...x) =>{
    const c = x.pop();
    if(!c.isComplex?.()) throw Error('croot expect Complex number as root')
    return mapfun$1(
        x => {
            if(typeof x === 'number') x = new c.constructor(x, 0);
            const {a : c_a, b : c_b} = c;
            const {z, phi} = x;
            const D = Math.hypot(c_a, c_b);
            const A = Math.exp((Math.log(z)*c_a + phi*c_b)/D);
            const B = (phi*c_a - Math.log(z)*c_b)/D;
            return new c.constructor(
                A * Math.cos(B),
                A * Math.sin(B)
            ).toFixed(PRECESION)
        },
        ...x
    )
};

const exp$1 = (...x) => mapfun$1(
    x => {
        if(x.isComplex?.()) return new x.constructor(
            Math.exp(x.a) * Math.cos(x.b),
            Math.exp(x.a) * Math.sin(x.b)
        ).toFixed(PRECESION);
        return + Math.exp(x).toFixed(PRECESION)
    }
    ,...x
);

const ln = (...x) => mapfun$1(
    x => {
        if(x.isComplex?.()) return new x.constructor(
            Math.log(x.z),
            x.phi
        ).toFixed(PRECESION);
        return + Math.log(x).toFixed(PRECESION)
    }
    ,...x
);

const sign = (...x) => mapfun$1(
    x => {
        if(x.isComplex?.()){
            const {z, phi} = x;
            if(z===0) return new x.constructor(0, 0);
            return new x.constructor({z:1, phi})
        }
        return Math.sign(x)
    }
    ,...x
);

const floor = (...x) => mapfun$1(
    x => {
        if(x.isComplex?.()) return new x.constructor(
            Math.floor(x.a),
            Math.floor(x.b)
        )
        return Math.floor(x)
    },
    ...x
);
const ceil = (...x) => mapfun$1(
    x => {
        if(x.isComplex?.()) return new x.constructor(
            Math.ceil(x.a),
            Math.ceil(x.b)
        )
        return Math.ceil(x)
    },
    ...x
);
const round = (...x) => mapfun$1(
    x => {
        if(x.isComplex?.()) return new x.constructor(
            Math.round(x.a),
            Math.round(x.b)
        )
        return Math.round(x)
    },
    ...x
);

const trunc = (...x) => mapfun$1(
    x => {
        if(x.isComplex?.()) return new x.constructor(
            Math.trunc(x.a),
            Math.trunc(x.b)
        )
        return Math.trunc(x)
    },
    ...x
);

const fract = (...x) => mapfun$1(
    x => {
        if(x.isComplex?.()) return new x.constructor(
            x.a - Math.trunc(x.a),
            x.b - Math.trunc(x.b)
        )
        return x - Math.trunc(x)
    },
    ...x
);

const cos$3 = (...x) => mapfun$1(
    x => {
        if(x.isComplex?.()) return new x.constructor(
            Math.cos(x.a) * Math.cosh(x.b),
            -Math.sin(x.a) * Math.sinh(x.b)
        ).toFixed(PRECESION);
        return + Math.cos(x).toFixed(PRECESION)
    }
    ,...x
);

const sin$3 = (...x) => mapfun$1(
    x =>{
        if(x?.isComplex) return new x.constructor(
            Math.sin(x.a) * Math.cosh(x.b),
            Math.cos(x.a) * Math.sinh(x.b)
        ).toFixed(PRECESION);
        return + Math.sin(x).toFixed(PRECESION)
    }
    , ...x
);

const tan = (...x) => mapfun$1(
    x =>{
        if(x?.isComplex){
            const D = Math.cos(2*x.a) + Math.cosh(2*x.b);
            return new x.constructor(
                Math.sin(2*x.a) / D,
                Math.sinh(2*x.b) / D
            ).toFixed(PRECESION);
        } 
        return + Math.tan(x).toFixed(PRECESION)
    },
    ...x
);

const sec = (...x) => mapfun$1(
    x => {
        if(x.isComplex?.()) ;
        return + (1 / Math.cos(x)).toFixed(PRECESION)
    }
    ,...x
);

const acos$1 = (...x) => mapfun$1(
    x =>{
        if(x?.isComplex){
            const { a, b } = x;
            const Rp = Math.hypot(a + 1, b);
            const Rm = Math.hypot(a - 1, b);
            globalThis.Rp = Rp;
            globalThis.Rm = Rm;
            return new x.constructor(
                Math.acos((Rp - Rm) / 2),
                -Math.acosh((Rp + Rm) / 2),
            ).toFixed(PRECESION)
        } 
        return + Math.acos(x).toFixed(PRECESION) 
    },
    ...x
);

const asin = (...x) => mapfun$1(
    x => {
        if(x?.isComplex){
            const { a, b } = x;
            const Rp = Math.hypot(a + 1, b);
            const Rm = Math.hypot(a - 1, b);
            return new x.constructor(
                Math.asin((Rp - Rm) / 2), 
                Math.acosh((Rp + Rm) / 2)
            ).toFixed(PRECESION);
        }
        return + Math.asin(x).toFixed(PRECESION);
    },
    ...x
);

const atan = (...x) => mapfun$1(
    x => {
        if(x?.isComplex){
            const { a, b } = x;
            return new x.constructor(
                Math.atan((a*2/(1-a**2-b**2)))/2,
                Math.log((a**2 + (1+b)**2)/(a**2 + (1-b)**2))/4
            ).toFixed(PRECESION)
        }
        return + Math.atan(x).toFixed(PRECESION);
    },
    ...x
);

const acot = (...x) => mapfun$1(
    x => {
        if(x?.isComplex){
            const { a, b } = x;
            return new x.constructor(
                Math.atan(2*a/(a**2+(b-1)*(b+1)))/2,
                Math.log((a**2 + (b-1)**2)/(a**2 + (b+1)**2))/4   
            ).toFixed(PRECESION)
        }
        return + (Math.PI/2 - Math.atan(x)).toFixed(PRECESION);
    },
    ...x
);


const cosh$2 = (...x) => mapfun$1(
    x =>{
        if(x?.isComplex) return new x.constructor(
            Math.cosh(x.a) * Math.cos(x.b),
            Math.sinh(x.a) * Math.sin(x.b)
        ).toFixed(PRECESION); 
        return + Math.cosh(x).toFixed(PRECESION)
    },
    ...x
);
const sinh$1 = (...x) => mapfun$1(
    x =>{
        if(x?.isComplex) return new x.constructor(
            Math.sinh(x.a) * Math.cos(x.b),
            Math.cosh(x.a) * Math.sin(x.b)
        ).toFixed(PRECESION); 
        return + Math.sinh(x).toFixed(PRECESION)
    },
    ...x
);
const tanh = (...x) => mapfun$1(
    x =>{
        if(x?.isComplex){
            const D = Math.cosh(2*a) + Math.cos(2*b);
            return new x.constructor(
                Math.sinh(2*a) / D,
                Math.sin(2*b) / D
            ).toFixed(PRECESION)
        } 
        return + Math.tanh(x).toFixed(PRECESION)
    },
    ...x
);

const coth = (...x) => mapfun$1(
    x =>{
        if(x?.isComplex){
            const {a, b} = x;
            const D = (Math.sinh(a)**2)*(Math.cos(b)**2) + (Math.cosh(a)**2)*(Math.sin(b)**2); 
            return new x.constructor(
                Math.cosh(a) * Math.sinh(a) / D,
                - Math.sin(b) * Math.cos(b) / D
            ).toFixed(PRECESION)
        } 
        return + (1 / Math.tanh(x)).toFixed(PRECESION)
    },
    ...x
);

const acosh = (...x) => mapfun$1(
    x =>{
        if(x?.isComplex){
            return ln(x.clone().add(sqrt$2(x.clone().mul(x.clone()).sub(1))))
        } 
        return + Math.acosh(x).toFixed(PRECESION)
    },
    ...x
);

const asinh = (...x) => mapfun$1(
    x =>{
        if(x?.isComplex){
            return ln(x.clone().add(sqrt$2(x.clone().mul(x.clone()).add(1))))
        } 
        return + Math.asinh(x).toFixed(PRECESION)
    },
    ...x
);

const atanh = (...x) => mapfun$1(
    x =>{
        if(x?.isComplex); 
        return + Math.atanh(x).toFixed(PRECESION)
    },
    ...x
);

const sig = (...x) => mapfun$1(
    x =>{
        if(x?.isComplex); 
        return 1/(1 + Math.exp(-x)).toFixed(PRECESION)
    },
    ...x
);

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
};
const add=(a,...b)=>{
    let res = a;
    for(let i=0; i<b.length; i++)
        res = arithmetic_helper('add', res, b[i]);
    return res;
};
const sub=(a,...b)=>{
    let res = a;
    for(let i=0; i<b.length; i++)
        res = arithmetic_helper('sub', res, b[i]);
    return res;
};
const mul=(a,...b)=>{
    let res = a;
    for(let i=0; i<b.length; i++)
        res = arithmetic_helper('mul', res, b[i]);
    return res;
};
const div=(a,...b)=>{
    let res = a;
    for(let i=0; i<b.length; i++)
        res = arithmetic_helper('div', res, b[i]);
    return res;
};
const modulo=(a,...b)=>{
    let res = a;
    for(let i=0; i<b.length; i++)
        res = arithmetic_helper('modulo', res, b[i]);
    return res;
};

const deg2rad = (...deg) => mapfun$1(x => x * Math.PI / 180, ...deg);
const rad2deg = (...rad) => mapfun$1(x => x / Math.PI * 180, ...rad);

const norm = (x, min, max) => apply_fun(
    x, 
    v => min !== max ? (v - min) / (max - min) : 0
);
const lerp = (x, min, max) => apply_fun(
    x, 
    v => (max - min) * v + min
);
const clamp = (x, min, max) => apply_fun(
    x, 
    v => Math.min(Math.max(v, min), max)
);
const map$1 = (x, a, b, c, d) => apply_fun(
    x, 
    v => lerp(norm(v, a, b), c, d)
);

const hypot = (...x) => {
  const c0 = x.find(a => a.isComplex?.());
  if (c0) {
    const W = x.map(n => n.isComplex?.() ? n : new c0.constructor(n, 0));
    return Math.hypot(...W.map(c => c.z));
  }
  return Math.hypot(...x);
};


const atan2 = (y, x, rad = true) => {
    if (y instanceof Array && !(x instanceof Array))
        return mapfun$1(n => atan2(n, x, rad), ...y);

    if (x instanceof Array && !(y instanceof Array))
        return mapfun$1(n => atan2(y, n, rad), ...x);

    if (y instanceof Array && x instanceof Array)
        return y.map((v, i) => atan2(v, x[i], rad));

    const phi = Math.atan2(y, x);
    return rad ? phi : phi * 180 / Math.PI;
};

const min = (...x) => Math.min(...x);
const max = (...x) => Math.max(...x);

const binomial = (n, k) =>{
  if(n !== Math.floor(n)) return TypeError('n must be an integer');
  if(k !== Math.floor(k)) return TypeError('k must be an integer');
  if (n < 0) return TypeError('n must be non-negative');
  if (k < 0 || n < 0 || k > n) return 0;
  if (k > n - k) k = n - k;
    let c = 1, i;
    for (i = 0; i < k; i++)
        c = c * (n - i) / (i + 1);
    return c;
};

// export const mean = (...x) => x.reduce((a, b) => a + b) / x.length;

// export const variance = (...x) => {
//   const n = x.length;
//   if (n === 0) return NaN;
//   const x_mean = mean(...x);
//   return x.reduce((sum, xi) => sum + (xi - x_mean) ** 2, 0) / n;
// };

// export const std = (...x) => Math.sqrt(variance(...x));

// export const accum_sum = (...x) => {
//   let result = [];
//   let total = 0, i, n = x.length;
//   for(i = 0; i < n ; i++){
//     total = add(total, x[i])
//     result.push(total);
//   }
//   return result;
// };

const accum_prod = (...x) => {
  let result = [];
  let prod = 1, i, n = x.length;
  for(i = 0; i < n ; i++){
    prod = mul(prod, x[i]);
    result.push(prod);
  }
  return result;
};

// export const percentile = (X, p) => {
//   if (X.length === 0) 
//     return NaN;
//   let a = [...X].sort((x, y) => x - y);
//   let index = (p / 100) * (a.length - 1);
//   let i = Math.floor(index);
//   let f = index - i;
//   if (i === a.length - 1) 
//     return a[i]; 
//   return a[i] * (1 - f) + a[i + 1] * f;
// }

// export const median = X => percentile(X, 50);

const not = x => {
    if(x.isComplex?.()) return new x.constructor(not(x.a), not(x.b))
    if(x.isMatrix?.()) return new x.constructor(x.rows, x.cols, x.arr.flat(1).map(not))
    return + !x;
};
const handle_complex_and_matrix = (x, operation) => {
    if (x.every(n => n.isComplex?.())) {
        const Re = x.map(n => n.a);
        const Im = x.map(n => n.b);
        return new x[0].constructor(
            operation(...Re),
            operation(...Im)
        );
    }

    if (x.every(n => n.isMatrix?.())) {
        if (!x.every(mat => mat.rows === x[0].rows && mat.cols === x[0].cols)) {
            return TypeError('All matrices must have the same shape');
        }

        const { rows, cols } = x[0];
        const Y = Array.from({ length: rows }, (_, i) =>
            Array.from({ length: cols }, (_, j) =>
                operation(...x.map(mat => mat.arr[i][j]))
            )
        );
        return new x[0].constructor(Y);
    }

    return null;  // Return null if no Complex or Matrix found
};

const and = (...x) => {
    const result = handle_complex_and_matrix(x, and);
    if (result !== null) return result;
    return x.reduce((n, m) => (n &= m), 1);
};

const or = (...x) => {
    const result = handle_complex_and_matrix(x, or);
    if (result !== null) return result;
    return x.reduce((n, m) => (n |= m), 0);
};

const xor = (...x) => {
    const result = handle_complex_and_matrix(x, xor);
    if (result !== null) return result;
    return x.reduce((n, m) => (n ^= m), 0);
};

const nand = (...x) => not(and(...x));
const nor = (...x) => not(or(...x));
const xnor = (...x) => not(xor(...x));

const matrix_constructor = (Matrix, rows, cols, element) => {
  if (rows instanceof Matrix) {
    arr = rows.arr;
    rows = rows.rows;
    cols = rows.cols;
  } 
  else {
    let arr = [], i, j;
    if (rows instanceof Array) {
        arr = rows;
        rows = arr.length;
        cols = arr[0].length;
    } 
    else {
      for (i = 0; i < rows; i++) {
        arr.push([]);
        arr[i].push(new Array(cols));
        for (j = 0; j < cols; j++) {
          arr[i][j] = element[i * cols + j];
          if (element[i * cols + j] == undefined) arr[i][j] = 0;
        }
      }
    }
    return [
        rows,
        cols,
        arr
    ]
  }
};

const maintain_indexes = (Matrix, oldRows) =>{
    for (let i = 0; i < Matrix.arr.length; i++) {
        Object.defineProperty(Matrix, i, {
            value: Matrix.arr[i],
            writable: true,
            configurable: true,
            enumerable: false
        });
    }
    for (let i = Matrix.arr.length; i < oldRows; i++) {
        delete Matrix[i];
    }
};

function matrix_inverse(M) {
    if(M.row !== M.cols) throw Error('is not a square matrix"')
    if (M.det === 0) throw Error("determinant should not equal 0");
    const { arr } = M;
    if (arr.length !== arr[0].length) return;
    var i = 0, ii = 0, j = 0, dim = arr.length, e = 0;
    var I = [], C = [];
    for (i = 0; i < dim; i += 1) {
        I[I.length] = [];
        C[C.length] = [];
        for (j = 0; j < dim; j += 1) {
            if (i == j) I[i][j] = 1;
            else I[i][j] = 0;
            C[i][j] = arr[i][j];
        }
    }
    for (i = 0; i < dim; i += 1) {
        e = C[i][i];
        if (e == 0) {
            for (ii = i + 1; ii < dim; ii += 1) {
                if (C[ii][i] != 0) {
                    for (j = 0; j < dim; j++) {
                        e = C[i][j];
                        C[i][j] = C[ii][j];
                        C[ii][j] = e;
                        e = I[i][j];
                        I[i][j] = I[ii][j];
                        I[ii][j] = e;
                    }
                    break;
                }
            }
            e = C[i][i];
            if (e == 0) return;
        }
        for (j = 0; j < dim; j++) {
            C[i][j] = C[i][j] / e;
            I[i][j] = I[i][j] / e;
        }
        for (ii = 0; ii < dim; ii++) {
            if (ii == i) {
                continue;
            }
            e = C[ii][i];
            for (j = 0; j < dim; j++) {
                C[ii][j] -= e * C[i][j];
                I[ii][j] -= e * I[i][j];
            }
        }
    }
    return new M.constructor(I);
}

function matrix_det(M) {
    if (!M.isSquare) return new Error("is not square matrix");
    if (M.rows == 1) return M.arr[0][0];
    function determinat(M) {
        if (M.length == 2) {
            if (M.flat(1).some((n) => n?.isMatrix?.())) {
                console.warn("Tensors are not completely supported yet ...");
                return;
            }
            return sub(mul(M[0][0],M[1][1]),mul(M[0][1],M[1][0]))
        }
        var answer = 0;
        for (var i = 0; i < M.length; i++) {
            //console.log(M[0][i]);
            /*answer = answer.add(
                pow(-1, i)
                    .mul(M[0][i])
                    .mul(determinat(deleteRowAndColumn(M, i)))
            );*/
            //const to_be_added=add(mul(pow(-1, i),mul(M[0][i],determinat(deleteRowAndColumn(M, i)))));
            const to_be_added=add(mul(pow$1(-1, i),mul(M[0][i],determinat(deleteRowAndColumn(M, i)))));
            answer=add(answer,to_be_added);
        }
        return answer;
    }
    return determinat(M.arr);
}
function deleteRowAndColumn(M, index) {
    var temp = [];
    for (let i = 0; i < M.length; i++) temp.push(M[i].slice(0));
    temp.splice(0, 1);
    for (let i = 0; i < temp.length; i++) temp[i].splice(index, 1);
    return temp;
}

function hstack(M1, M2){
    M1 = M1.clone();
    M2 = M2.clone();
    if (M1.rows !== M2.rows) return;
    let newArr = M1.arr;
    for (let i = 0; i < M1.rows; i++) 
        for (let j = M1.cols; j < M1.cols + M2.cols; j++) 
            newArr[i][j] = M2.arr[i][j - M1.cols];
    M1.cols += M2.cols;
    return new M1.constructor(M1.rows, M1.cols, newArr.flat(1));
}

function vstack(M1, M2){
    M1 = M1.clone();
    M2 = M2.clone();
    if (M1.cols !== M2.cols) return;
    let newArr = M1.arr;
    for (let i = M1.rows; i < M1.rows + M2.rows; i++) {
        newArr[i] = [];
        for (let j = 0; j < M1.cols; j++) newArr[i][j] = M2.arr[i - M1.rows][j];
    }
    M1.rows += M2.rows;
    return new M1.constructor(M1.rows, M1.cols, newArr.flat(1));
}

class Matrix{
    constructor(rows, cols, element = [] ) {
        [
            this.rows, 
            this.cols, 
            this.arr
        ] = matrix_constructor(Matrix, rows, cols, element);
        maintain_indexes(this);
    }
    isMatrix(){
        return true
    }
    clone() {
        return new Matrix(this.rows, this.cols, this.arr.flat(1));
    }
    toComplex(){
        this.arr = mapfun$1(
            x => x?.isComplex?.() ? x : new Complex(x, 0),
            ...this.arr
        );
        maintain_indexes(this);
        return this;
    }
    [Symbol.iterator]() {
      return this.arr[Symbol.iterator]();
    }
    get size() {
        return this.rows * this.cols;
    } 
    get shape() {
        return [this.rows, this.cols];
    }
    // toString(){
    //     return arr2str(this.arr,false);
    // }
    at(i = 0, j = undefined) {
        if(i < 0) i += this.rows;
        if(i < 0 || i >= this.rows) throw new Error('Row index out of bounds');
        if(j === undefined) return this.arr[i];
        if(j < 0) j += this.cols;
        if(j < 0 || j >= this.cols) throw new Error('Column index out of bounds');
        return this.arr[i][j];
    }
    slice(r0=0, c0=0, r1 = this.rows-1, c1 = this.cols-1) {
        if(r1 < 0) r1 = this.rows + r1;
        if(c1 < 0 ) c1 = this.cols + c1;
        let newRow = r1 - r0,
            newCol = c1 - c0;
        let newArr = new Array(newCol);
        for (let i = 0; i < newRow; i++) {
            newArr[i] = [];
            for (let j = 0; j < newCol; j++) 
                newArr[i][j] = this.arr[i + r0][j + c0];
        }
        this.arr = newArr;
        maintain_indexes(this.rows);
        this.rows = newRow;
        this.cols = newCol;
        return this;
    }
    reshape(newRows, newCols) {
        if(!(newRows * newCols === this.rows * this.cols)) throw Error('size not matched');
        const oldRows = this.rows;
        Object.assign(this, new Matrix(newRows, newCols, this.arr.flat(1)));
        maintain_indexes(oldRows);
        return this;
    }
    get T() {
        let transpose = [];
        for (let i = 0; i < this.arr[0].length; i++) {
            transpose[i] = [];
            for (let j = 0; j < this.arr.length; j++) 
                transpose[i][j] = this.arr[j][i];
        }
        return new Matrix(this.cols, this.rows, transpose.flat(1));
    }
    get det() {
        return matrix_det(this)
    }
    get inv() {
        return matrix_inverse(this)
    }
    // normalize names
    static eye(size) {
        let result = new Matrix(size, size);
        for (let i = 0; i < size; i++) 
            for (let j = 0; j < size; j++) i === j ? (result.arr[i][j] = 1) : (result.arr[i][j] = 0);
        return result;
    }
    static zeros(rows, cols) {
        let result = new Matrix(rows, cols);
        for (let i = 0; i < rows; i++) 
            for (var j = 0; j < cols; j++) result.arr[i][j] = 0;
        return result;
    }
    static ones(rows, cols) {
        let result = new Matrix(rows, cols);
        for (let i = 0; i < rows; i++) 
            for (let j = 0; j < cols; j++) result.arr[i][j] = 1;
        return result;
    }
    static nums(rows, cols, number) {
        let result = new Matrix(rows, cols);
        for (let i = 0; i < rows; i++) 
            for (let j = 0; j < cols; j++) result.arr[i][j] = number;
        return result;
    }
    static get random(){
        return {
            int : (r, c, a, b)=> new Matrix(
                r,
                c,
                Random.sample.int(r*c, a, b)
            ),
            float : (r, c, a,)=> new Matrix(
                r,
                c,
                Random.sample.float(r*c, a, b)
            ),
        }
    }
    get range(){
        return {
            map : (xmin, xmax, ymin, ymax) => {
                this.arr = map$1(this.arr, xmin, xmax, ymin, ymax);
                return this;
            },
            norm : (min, max) => {
                this.arr = norm(this.arr, min, max);
                return this;
            },
            lerp : (min, max) => {
                this.arr = lerp(this.arr, min, max);
                return this;
            },
            clamp : (min, max) => {
                this.arr = clamp(this.arr, min, max);
                return this;
            },

        }
    }
    hstack(...matrices) {
        const M=[this, ...matrices].reduce((a,b)=>hstack(a, b));
        Object.assign(this, M);
        maintain_indexes(this);
        return this;
    }
    vstack(...matrices){
        const M=[this, ...matrices].reduce((a,b)=>vstack(a, b));
        Object.assign(this, M);
        maintain_indexes(this);
        return this;
    }
    hqueue(...matrices){
        const M=[this, ...matrices].reverse().reduce((a,b)=>hstack(a, b));
        Object.assign(this, M);
        maintain_indexes(this);
        return this;
    }
    vqueue(...matrices){
        const M=[this,...matrices].reverse().reduce((a, b)=>vstack(a, b));
        Object.assign(this, M);
        maintain_indexes(this);
        return this;
    }
    forEach(fn){
        this.arr.flat(1).forEach(fn);
        return this;
    }
    forEachRow(fn){
        this.arr.forEach(fn);
        return this;
    }
    forEachCol(fn){
        this.clone().T.forEachRow(fn);
        return this
    }
    map(fn){
        const arr = this.arr.flat(1).map(fn);
        return new Matrix(
            this.rows, 
            this.cols,
            arr
        )
    }
    mapRows(fn = ()=>{}){
        this.arr = this.arr.map(fn);
        return this;
    }
    mapCols(fn){
        return this.clone().T.mapRows(fn).T;
    }
    sort(fn = ()=>{}){
        const arr = this.arr.flat(1).sort(fn);
        return new Matrix(
            this.rows, 
            this.cols,
            arr
        )  
    }
    shuffle(){
        return this.sort(() => 0.5-Math.random())
    }
    sortRows(fn = ()=>{}){
        this.arr = this.arr.map(row => row.sort(fn));
        return this;
    }
    shuffleRows(){
        return this.sortRows(() => 0.5-Math.random())
    }
    sortCols(fn){
        return this.clone().T.sortRows(fn).T;
    }
    shuffleCols(){
        return this.sortCols(() => 0.5-Math.random())
    }
    reduce(fn, initialValue){
        const value = initialValue 
            ? this.arr.flat(1).reduce(fn, initialValue) 
            : this.arr.flat(1).reduce(fn);
        return new Matrix([[value]])
    }
    reduceRows(fn, initialValue){
        const values = initialValue 
            ? this.arr.map(row => row.reduce(fn, initialValue)) 
            : this.arr.map(row => row.reduce(fn)); 
        return new Matrix(1, this.cols, values)
    }
    reduceCols(fn, initialValue){
        return this.T.reduceRows(fn, initialValue).T
    }
    filterRows(fn){
        const mask = this.arr.map(n => n.some(m => fn(m)));
        const arr = [];
        let i;
        for(i = 0; i < mask.length; i++)
            if(mask[i]) arr.push(this.arr[i]);
        return new Matrix(arr)
    }
    filterCols(fn){
        const arr = this.T.filterRows(fn);
        return new Matrix(arr).T
    }
    every(fn){
        return this.arr.flat(1).every(fn)
    }
    everyRow(fn){
        return this.arr.map(n => n.every(fn))
    }
    everyCol(fn){
        return this.T.arr.map(n => n.every(fn))
    }
    some(fn){
        return this.arr.flat(1).some(fn)
    }
    someRow(fn){
        return this.arr.map(n => n.some(fn))
    }
    someCol(fn){
        return this.T.arr.map(n => n.some(fn))
    }
    // Checkers
    get isSquare() {
        return this.rows === this.cols;
    }
    get isSym() {
        if (!this.isSquare) return false;
        for (let i = 0; i < this.rows; i++) {
            for (let j = i + 1; j < this.cols; j++) {
                if (this.arr[i][j] !== this.arr[j][i]) return false;
            }
        }
        return true;
    }
    get isAntiSym() {
        if (!this.isSquare) return false;
        const n = this.rows;
        for (let i = 0; i < n; i++) {
            if (this.arr[i][i] !== 0) return false;
            for (let j = i + 1; j < n; j++) {
                if (this.arr[i][j] !== -this.arr[j][i]) return false;
            }
        }
        return true;
    }
    get isDiag() {
        if (!this.isSquare) return false;
        const n = this.rows;
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                if (this.arr[i][j] !== 0 || this.arr[j][i] !== 0) return false;
            }
        }
        return true;
    }
    get isOrtho() {
        if (!this.isSquare) return false;
        return this.isDiag && (this.det == 1 || this.det == -1);
    }
    get isIdemp() {
        if (!this.isSquare) return false;
        const n = this.rows;
        const A = this.arr;
        // Compute A * A
        const MM = [];
        for (let i = 0; i < n; i++) {
            MM[i] = [];
            for (let j = 0; j < n; j++) {
                let sum = 0;
                for (let k = 0; k < n; k++) {
                    sum += A[i][k] * A[k][j];
                }
                MM[i][j] = sum;
            }
        }
        // Check if A * A == A
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (MM[i][j] !== A[i][j]) return false;
            }
        }
        return true;
    }

    get isUpperTri() {
        if (!this.isSquare) return false;
        const n = this.rows;
        for (let i = 1; i < n; i++) {
            for (let j = 0; j < i; j++) {
                if (this.arr[i][j] !== 0) return false;
            }
        }
        return true;
    }
    get isLowerTri() {
        if (!this.isSquare) return false;
        const n = this.rows;
        for (let i = 0; i < n - 1; i++) {
            for (let j = i + 1; j < n; j++) {
                if (this.arr[i][j] !== 0) return false;
            }
        }
        return true;
    }
    toPrecision(p) {
        for (let i = 0; i < this.cols; i++) 
            for (let j = 0; j < this.rows; j++) 
                this.arr[i][j] = +this.arr[i][j].toPrecision(p);
        return this;
    }
    toFixed(p) {
        for (let i = 0; i < this.cols; i++) 
            for (let j = 0; j < this.rows; j++) 
                this.arr[i][j] = +this.arr[i][j].toFixed(p);
        return this;
    }
    // max2min() {
    //     let newArr = this.arr.flat(1).max2min;
    //     return new Matrix(this.rows, this.cols, newArr);
    // }
    // min2max() {
    //     let newArr = this.arr.flat(1).min2max;
    //     return new Matrix(this.rows, this.cols, newArr);
    // }
    // count(n) {
    //     return this.arr.flat(1).count(n);
    // }
    splice(r0,c0,deleteCount,...items){
        
    }
    getRows(ri, rf = ri + 1) {
        return this.slice(ri, 0, rf, this.cols);
    }
    getCols(ci, cf = ci + 1) {
        return this.slice(0, ci, this.rows, cf);
    }
    #arithmetic(fn, ...matr){
        for (let k = 0; k < matr.length; k++) {
            if (typeof matr[k] == "number" || matr[k]?.isComplex?.()) matr[k] = Matrix.nums(this.rows, this.cols, matr[k]);
            for (let i = 0; i < this.rows; i++) 
                for (var j = 0; j < this.cols; j++) 
                    this.arr[i][j] = fn(this.arr[i][j], matr[k].arr[i][j]);
        }
        return new Matrix(this.rows, this.cols, this.arr.flat(1));  
    }
    add(...matr) {
        return this.#arithmetic(add, ...matr)
    }
    sub(...matr) {
        return this.#arithmetic(sub, ...matr)
    }
    mul(...matr) {
        return this.#arithmetic(mul, ...matr)
    }
    div(...matr) {
        return this.#arithmetic(div, ...matr)
    }
    modulo(...matr) {
        return this.#arithmetic(modulo, ...matr)
    }
    dot(matrix) {
        var res = [];
        for (var i = 0; i < this.arr.length; i++) {
            res[i] = [];
            for (var j = 0; j < matrix.arr[0].length; j++) {
                res[i][j] = 0;
                for (var k = 0; k < this.arr[0].length; k++) {
                    res[i][j] = add(
                        res[i][j],
                        mul(this.arr[i][k],matrix.arr[k][j])
                        );
                }
            }
        }
        return new Matrix(this.arr.length, matrix.arr[0].length, res.flat(1));
    }
    pow(n) {
        let a = this.clone(),
            p = this.clone();
        for (let i = 0; i < n - 1; i++) p = p.dot(a);
        return p;
    }
    sum(){
        let S = 0;
        for (let i = 0; i < this.rows; i++) 
            for (let j = 0; j < this.cols; j++) 
                S = add(S, this.arr[i][j]);
        return S;
    }
    prod(){
        let S = 1;
        for (let i = 0; i < this.rows; i++) 
            for (let j = 0; j < this.cols; j++) 
                S = mul(S, this.arr[i][j]);
        return S;
    }
    hasComplex(){
        return this.arr.flat(Infinity).some((n) => n instanceof Complex);
    }
    get min() {
        if (this.hasComplex()) console.error("Complex numbers are not comparable");
        let minRow = [];
        for (let i = 0; i < this.rows; i++) 
            minRow.push(Math.min(...this.arr[i]));
        return Math.min(...minRow);
    }
    get max() {
        if (this.hasComplex()) console.error("Complex numbers are not comparable");
        let maxRow = [];
        for (let i = 0; i < this.rows; i++) 
            maxRow.push(Math.max(...this.arr[i]));
        return Math.max(...maxRow);
    }
    get minRows() {
        if (this.hasComplex()) console.error("Complex numbers are not comparable");
        let minRow = [];
        for (let i = 0; i < this.rows; i++) 
            minRow.push(Math.min(...this.arr[i]));
        return minRow;
    }
    get maxRows() {
        if (this.hasComplex()) console.error("Complex numbers are not comparable");
        let maxRow = [];
        for (let i = 0; i < this.rows; i++) 
            maxRow.push(Math.max(...this.arr[i]));
        return maxRow;
    }
    get minCols() {
        if (this.hasComplex()) console.error("Complex numbers are not comparable");
        return this.T.minRows;
    }
    get maxCols() {
        if (this.hasComplex()) console.error("Complex numbers are not comparable");
        return this.T.maxRows;
    }
    static fromVector(v) {
        return new Matrix(v.length, 1, v);
    }
    serialize() {
        const arr = mapfun$1(x => x.serialize?.() || x, ...this.arr);
        return JSON.stringify({
            type : 'matrix',
            data : {
                rows : this.rows,
                cols : this.cols,
                arr,
            }
        });
    }
    static deserialize(json) {
        if (typeof json == "string") json = JSON.parse(json);
        const {type, data} = json;
        if(type !== 'matrix') return TypeError('Not a valid Matrix')
        let {arr} = data;
        arr = mapfun$1(x => {
            if(typeof x === 'string') {
                const x_obj = JSON.parse(x);
                const {type} = x_obj;
                if(type === 'complex') return Complex.deserialize(x_obj)
            }
            return x
        }, ...arr);
        return new Matrix(arr)
    }
    flip(){
        return this.flipeH().flipeV()
    }
    flipeH(){
        this.arr = this.arr.map(row => [...row].reverse());
        maintain_indexes(this);
        return this;
    }
    flipeV(){
        this.arr = this.arr.reverse();
        maintain_indexes(this);
        return this;
    }
}


const matrix=(r, c, element)=>new Matrix(r, c, element);
const matrix2=(...element)=>new Matrix(2, 2, element);
const matrix3=(...element)=>new Matrix(3, 3, element);
const matrix4=(...element)=>new Matrix(4, 4, element);

class UINode {
    constructor(node){
        this.cache = {
            node
        };
    }
    isUINode(){
        return true
    }
    get node(){
        return this.cache.node;
    } 
}

// globalThis.node = (node) => new UINode(node);

function parseQueryParams$2(queryString) {
    const params = {};
    queryString.replace(/[A-Z0-9]+?=([\w|:|\/\.]*)/gi, (match) => {
        const [key, value] = match.split('=');
        params[key] = value;
    });
    return params;
}

function defineParamsGetter$1(target ){
    Object.defineProperties(target, {
        'QueryParams': {
            get: function() {
                return parseQueryParams$2(globalThis.location.search.substring(1));
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

class UIStore extends Array {
    constructor(...args) {
        super(...args); 
    }
    clear(){
        this.length = 0;
        return this;
    }
    getItemById(id) {
        return this.find(n => n.element.id === id);
    }
    getItemsByTagName(tag) {
        return this.filter(n => n.element.tagName.toLowerCase() === tag.toLowerCase());
    }
    getElementsByClassName(className) {
        return this.filter(n => n.element.classList?.contains(className));
    }
    querySelector(selector) {
        const el = globalThis?.document?.querySelector(selector);
        if (!el) return null;
        return this.find(ui => ui.element === el) || null;
    }
    querySelectorAll(selector) {
        const els = globalThis?.document?.querySelectorAll(selector);
        return Array.from(els)
            .map(el => this.find(ui => ui.element === el))
            .filter(Boolean);
    }
}

// create the singleton
const __UI__ = new UIStore();

const __Config__ = {
    default:{
        target:null,
        render:true,
        math:{
            mode:"deg"
        }
    },
    setDefault:function(pairs){
        const keys=Object.keys(pairs);
        const values=Object.values(pairs);
        for(let i=0; i<keys.length; i++) this.default[keys[i]]=values[i];
    },
    init:()=>{
        // document.documentElement.setAttribute("data-engine","zikojs")
    },
    renderingMode :"spa",
    isSSC : false,
};

const __HYDRATION__ = {
    store : new Map(),
    index : 0,
    register: function(component){
        this.store.set(this.index++ , component);
    },
    reset(){
        this.index = 0;
        this.store.clear();
    }
    
};

const __CACHE__ = {
    ui_index : 0,
    get_ui_index:function(){
        return this.ui_index ++
    },
    register_ui: function(UIElement){
        
    }
};

class UseIPC {
    #channel;
    #eventData;
    #handlers;
    #uuid;
    #subscribers;
    #currentRooms;
    constructor(name = "") {
        this.#channel = new BroadcastChannel(name);
        this.#eventData = new Map();
        this.#handlers = new Map(); // Map<event, Array<{fn, rooms}>>
        this.#uuid = "ziko-channel:" + (Math.random()*10e16);  // To Be Replaced by UUID
        this.#subscribers = new Set([this.#uuid]);
        this.#currentRooms = new Set(); 
        this.#channel.addEventListener("message", (e) => {
            const { last_sent_event, userId, eventData, rooms } = e.data;
            if (userId === this.#uuid) return; // ignore own messages
            // broadcast if no rooms, else check intersection
            if (rooms && rooms.length && !rooms.some(r => this.#currentRooms.has(r))) return;
            this.#subscribers.add(userId);
            this.#eventData = new Map(eventData);
            const handlersList = this.#handlers.get(last_sent_event);
            if (!handlersList) return;
            handlersList.forEach(({ fn, rooms: handlerRooms }) => {
                // trigger if listener has no room filter, or intersects subscriber rooms
                if (!handlerRooms || handlerRooms.length === 0 ||
                    !rooms || rooms.some(r => handlerRooms.includes(r))) {
                    fn(this.#eventData.get(last_sent_event));
                }
            });
        });
    }

    emit(event, data, rooms) {
        this.#eventData.set(event, data);
        if(typeof rooms === 'string') rooms = [rooms];
        this.#channel.postMessage({
            eventData: Array.from(this.#eventData.entries()),
            last_sent_event: event,
            userId: this.#uuid,
            rooms: rooms && rooms.length ? rooms : undefined
        });
        return this;
    }
    on(event, handler = console.log, rooms) {
        if (!this.#handlers.has(event)) this.#handlers.set(event, []);
        if(typeof rooms === 'string') rooms = [rooms];
        this.#handlers.get(event).push({ fn: handler, rooms });
        return this;
    }
    off(event, handler) {
        if (!this.#handlers.has(event)) return this;
        this.#handlers.set(
            event,
            this.#handlers.get(event).filter(h => h.fn !== handler)
        );
        return this;
    }
    once(event, handler, rooms) {
        const wrapper = (data) => {
            handler(data);
            this.off(event, wrapper);
        };
        this.on(event, wrapper, rooms);
        return this;
    }
    join(...rooms) {
        rooms.forEach(r => this.#currentRooms.add(r));
        return this;
    }
    leave(...rooms) {
        if (!rooms.length) this.#currentRooms.clear();
        else rooms.forEach(r => this.#currentRooms.delete(r));
        return this;
    }
    close() {
        this.#channel.close();
        return this;
    }
}

const useIPC = (name) => new UseIPC(name);

class UseStorage {
  static RESERVED_KEYS = new Set([
    "cache", "items", "set", "add", "remove", "get", "clear", "onStorageUpdated"
  ]);

  constructor(storage, globalKey, initialValue, use_channel = true) {
    this.cache = {
      storage,
      globalKey,
      channel: use_channel ? useIPC(`Ziko:useStorage-${globalKey}`) : null,
      oldItemKeys: new Set()
    };

    this.#init(initialValue, use_channel);
  }

  get items() {
    const raw = this.cache.storage.getItem(this.cache.globalKey);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  #maintain() {
    const currentItems = this.items;
    const currentKeys = new Set(Object.keys(currentItems));

    // Cleanup keys that were removed
    this.cache.oldItemKeys.forEach(key => {
      if (!currentKeys.has(key)) {
        delete this[key];
        this.cache.oldItemKeys.delete(key);
      }
    });

    // Populate keys from storage onto `this`
    for (const key in currentItems) {
      if (!UseStorage.RESERVED_KEYS.has(key)) {
        this[key] = currentItems[key];
        this.cache.oldItemKeys.add(key);
      }
    }
  }

  #init(initialValue, use_channel) {
    if (use_channel && this.cache.channel) {
      this.cache.channel.on("Ziko-Storage-Updated", () => this.#maintain());
    }

    const hasStoredData = this.cache.storage.getItem(this.cache.globalKey) !== null;

    if (hasStoredData) {
      // Key already exists in storage -> Restore data to instance
      this.#maintain();
    } else if (initialValue !== undefined) {
      // Key doesn't exist -> Seed with initialValue
      this.set(initialValue);
    } else {
      // Key doesn't exist and no initialValue provided -> Default to empty
      this.#maintain();
    }
  }

  set(data) {
    this.cache.storage.setItem(this.cache.globalKey, JSON.stringify(data));
    if (this.cache.channel) {
      this.cache.channel.emit("Ziko-Storage-Updated", data);
    }
    this.#maintain();
    return this;
  }

  add(data) {
    return this.set({
      ...this.items,
      ...data
    });
  }

  remove(...keys) {
    const items = { ...this.items };
    keys.forEach(key => delete items[key]);
    return this.set(items);
  }

  get(key) {
    return this.items[key];
  }

  clear() {
    this.cache.storage.removeItem(this.cache.globalKey);
    this.#maintain();
    return this;
  }

  onStorageUpdated(callback) {
    if (this.cache.channel) {
      this.cache.channel.on("Ziko-Storage-Updated", callback);
    }
    return this;
  }
}

const useLocalStorage = (key, initialValue, use_channel = true) =>
  new UseStorage(localStorage, key, initialValue, use_channel);

const useSessionStorage = (key, initialValue, use_channel = true) =>
  new UseStorage(sessionStorage, key, initialValue, use_channel);

var __State__ = {
    store : new Map(),
    index : 0,
    session_storage : null,
    register: function(state){
        // if(!import.meta?.env?.SSR && import.meta?.env?.DEV){
        //     if(!this.session) this.session_storage = useSessionStorage('ziko-state', {})
        //     const savedValue = this.session_storage.get(this.index)
        //     if(!savedValue) this.session_storage.add({[this.index] : state.value});
        //     else state.value = savedValue
        // }
        // this.store.set(this.index++, state)
    },
    update: function(index, value){
    //    if(!import.meta?.env?.SSR && import.meta?.env?.DEV){
    //         this.session_storage.add({[index] : value})
    //     } 
    },

};

function __init__global__(){
    if ( !globalThis?.__Ziko__ ){
        globalThis.__Ziko__ = {
                    __UI__,
                    __HYDRATION__,
                    __State__,
                    __Config__,
                    __CACHE__,
                    __PROVIDERS__: {}
                };
        defineParamsGetter$1(__Ziko__);
    }
}

const parse_props = (props = {}) => {

    const result = {
        methods: {},
        events: {},
        style: {},
        attrs: {}
    };

    for (const [key, value] of Object.entries(props)) {
        if (key === "style") {
            result.style = value;
        }
        else if (key.startsWith("$")) {
            result.methods[key.slice(1)] = value;
        }
        else if (/^on[A-Z]/.test(key)) {
            result.events[key] = value;
        }
        else {
            result.attrs[key] = value;
        }
    }

    return result;
};

__init__global__();
class UIElementCore extends UINode{
  constructor(){
    super();
  }
  init({element, name, type, render, props = {}, items = []} = {}){
    this.target = globalThis.__Ziko__.__Config__.default.target||globalThis?.document?.body;
    if(typeof element === "string") {
      switch(type){
        case "html" : {
          element = globalThis?.document?.createElement(element);
          // console.log('1')
        } break;
        case "svg" : {
          element = globalThis?.document?.createElementNS("http://www.w3.org/2000/svg", element); 
          // console.log('2')
        } break;
        default : throw Error("Not supported")
      }
    }
    else this.target = element?.parentElement;
    Object.assign(this.cache, {
      name,
      itemsTarget : this,
      isInteractive : false,
      parent:null,
      isBody:false,
      isRoot:false,
      isHidden: false,
      isFrozzen:false,
      attributes: {},
      filters: {},
      temp:{}
    });
    this.events = {
      ptr:null,
      mouse:null,
      wheel:null,
      key:null,
      drag:null,
      drop:null,
      click:null,
      clipboard:null,
      focus:null,
      swipe:null,
      custom:null,
    };
    this.observer={
      resize:null,
      intersection:null
    };
    if(element) Object.assign(this.cache,{element});
    this.items = new UIStore();
    globalThis.__Ziko__.__UI__[this.cache.name]
      ? globalThis.__Ziko__.__UI__[this.cache.name]?.push(this)
      : globalThis.__Ziko__.__UI__[this.cache.name]=[this];
    element && render && this?.render?.();
    globalThis.__Ziko__.__UI__.push(this);

    // console.log({props})
    const parsed_props = parse_props(props);

    this.parsed_props = parsed_props;

    this.style(parsed_props.style);
    this.setAttr(parsed_props.attrs);

    const Events = Object.entries(parsed_props.events);

    Events.forEach(([ev, callback]) => this[ev](callback.bind(this)));
    

    if(items.length > 0) this.append(...items);
  }
  get element(){
    return this.cache.element;
  }
  [Symbol.iterator](){
    return this.items[Symbol.iterator]();
  }
  maintain() {
    for (let i = 0; i < this.items.length; i++) {
      Object.defineProperty(this, i, {
        value: this.items[i],
        writable: true,
        configurable: true,
        enumerable: false 
        });
    }
  }
  isInteractive(){
    return this.cache.isInteractive;
  }
  isUIElement(){
    return true;
  }
}

function register_to_class(target, ...mixins){
    mixins.forEach(n => _register_to_class_(target, n));
}
function _register_to_class_(target, mixin) {
  const descriptors = Object.getOwnPropertyDescriptors(mixin);
  for (const key of Reflect.ownKeys(descriptors)) {
    const desc = descriptors[key];
    if ('get' in desc || 'set' in desc || typeof desc.value !== 'function') {
      Object.defineProperty(Object.getPrototypeOf(target), key, desc);
    } else if (typeof desc.value === 'function') {
      if (!Object.getPrototypeOf(target).hasOwnProperty(key)) {
        Object.defineProperty(Object.getPrototypeOf(target), key, desc);
      }
    }
  }
}

// export function mount(target = this.target) {
//   if(this.isBody) return ;
//   if(target?.isUIElement)target=target.element;
//   this.target=target;
//   this.target?.appendChild(this.element);
//   return this;
// }
// export function unmount(){
//   if(this.cache.parent)this.cache.parent.remove(this);
//   else if(this.target?.children?.length && [...this.target?.children].includes(this.element)) this.target.removeChild(this.element);
//   return this;
// }

// export function mountAfter(target = this.target, t = 1) {
//   setTimeout(() => this.mount(), t);
//   return this;
// }
// export function unmountAfter(t = 1) {
//   setTimeout(() => this.unmount(), t);
//   return this;
// }

function mount(target = this.target, delay = 0) {
    if (delay > 0) {
        setTimeout(() => this.mount(target, 0), delay);
        return this;
    }

    if (this.isBody) return this;

    if (target?.isUIElement) target = target.element;
    this.target = target;

    this.target?.appendChild(this.element);
    return this;
}

function unmount(delay = 0) {
    if (delay > 0) {
        setTimeout(() => this.unmount(0), delay);
        return this;
    }

    if (this.cache.parent) {
        this.cache.parent.remove(this);
    } else if (
        this.target?.children?.length &&
        [...this.target.children].includes(this.element)
    ) {
        this.target.removeChild(this.element);
    }

    return this;
}

var LifecycleMethods = /*#__PURE__*/Object.freeze({
   __proto__: null,
   mount: mount,
   unmount: unmount
});

const STATE_GETTER = Symbol.for("ziko/hooks/STATE_GETTER");

// import { __init__global__ } from "../__ziko__/index.js";


function useState(initialValue) {
    const state = {
        value: initialValue,
        subscribers: new Set(),
        paused: false,
    };

    function getValue() {
        return {
            value: state.value,
            _subscribe: (fn) => {
                state.subscribers.add(fn);
                return () => state.subscribers.delete(fn);
            },
        };
    }

    getValue[STATE_GETTER] = true;

    function setValue(newValue) {
        if (state.paused) return;

        if (typeof newValue === "function") {
            newValue = newValue(state.value);
        }

        if (!Object.is(newValue, state.value)) {
            state.value = newValue;
            state.subscribers.forEach((fn) => fn(state.value));
        }
    }

    const controller = {
        pause: () => { state.paused = true; },
        resume: () => { state.paused = false; },
        clear: () => { state.subscribers.clear(); },
        force: (newValue) => {
            if (typeof newValue === "function") {
                newValue = newValue(state.value);
            }

            state.value = newValue;
            state.subscribers.forEach((fn) => fn(state.value));
        },
        getSubscribers: () => new Set(state.subscribers),
    };

    return [getValue, setValue, controller];
}

const isStateGetter = (arg) => typeof arg === "function" && arg[STATE_GETTER] === true;

const camel2hyphencase = (text = '') => text.replace(/[A-Z]/g, match => '-' + match.toLowerCase());

const is_camelcase = (text = '') =>{
    if (text.length === 0) return false; 
    const camelCasePattern = /^[a-z][a-zA-Z0-9]*$/;
    return camelCasePattern.test(text);
};

function setAttr(name, value) {
  if(name instanceof Object){
    const [names,values]=[Object.keys(name),Object.values(name)];
    for(let i=0;i<names.length;i++){
      if(values[i] instanceof Array)value[i] = values[i].join(" ");
      _set_attrs_.call(this, names[i], values[i]);
    }
  }
  else {
    if(value instanceof Array) value = value.join(" ");
    _set_attrs_.call(this, name, value);
  }
  return this;
}
function removeAttr(...names) {
  for(let i=0;i<names.length;i++)this.element?.removeAttribute(names[i]);
  return this;
}
function getAttr(name){
  name = is_camelcase(name) ? camel2hyphencase(name) : name;
  return this.element.attributes[name].value;
}
function setContentEditable(bool = true) {
  this.setAttr("contenteditable", bool);
  return this;
}


function _set_attrs_(name, value){
    if(globalThis.SVGAElement && this.element instanceof globalThis.SVGAElement) name = is_camelcase(name) ? camel2hyphencase(name) : name;
    if(this?.attr[name] && this?.attr[name]===value) return;
    if(isStateGetter(value)){
        const getter = value();
        getter._subscribe(
            (newValue) => this.element?.setAttribute(name, newValue),
            this 
        );
    }
    else this.element?.setAttribute(name, value);
    Object.assign(this.cache.attributes, {[name]:value});   
}

var AttrsMethods = /*#__PURE__*/Object.freeze({
   __proto__: null,
   _set_attrs_: _set_attrs_,
   getAttr: getAttr,
   removeAttr: removeAttr,
   setAttr: setAttr,
   setContentEditable: setContentEditable
});

class ZikoUIText extends UINode {
    constructor(...value) {
      super("span", "text", false, ...value);
      this.element = globalThis?.document?.createTextNode(...value);
    }
    isText(){
      return true
    }
}
const text = (...str) => new ZikoUIText(...str);

function append(...ele) {
  __addItem__.call(this, "append", "push", ...ele);
  return this;
}
function prepend(...ele) {
  this.__addItem__.call(this, "prepend", "unshift", ...ele);
  return this;
}
function insertAt(index, ...ele) {
    const target = this.itemsTarget;

    if (index >= target.items.length) return this.append(...ele);

    for (let i = 0; i < ele.length; i++) {
        if (["number", "string"].includes(typeof ele[i]))
            ele[i] = text(ele[i]);

        target.element?.insertBefore(
            ele[i].element,
            target.items[index].element
        );

        target.items.splice(index, 0, ele[i]);
    }

    target.maintain();

    return this;
}
function remove(...ele) {
  const remove = (ele) => {
    if (typeof ele === "number") ele = this.items[ele];
    if (ele?.isUIElement) this.itemsTarget.element?.removeChild(ele.element);
    this.items = this.items.filter((n) => n !== ele);
  };
  for (let i = 0; i < ele.length; i++) remove(ele[i]);
  for (let i = 0; i < this.items.length; i++)
    Object.assign(this, { [[i]]: this.items[i] });
  // Remove from item
  return this;
}
function clear(){
  this?.items?.forEach(n=>n.unmount());
  this.itemsTarget.element.innerHTML = '';
  return this;
}
function replaceElementWith(new_element){
    this.cache.element.replaceWith(new_element);
    this.cache.element = new_element;

    // To do : Dispose Events and States 
    return this
}
function after(ui){
  if(ui?.isUIElement) ui=ui.element;
  this.itemsTarget.element?.after(ui);
  return this;
}
function before(ui){
  if(ui?.isUIElement) ui=ui.element;
  this.itemsTarget.element?.before(ui);
  return this;
}




async function __addItem__(adder, pusher, ...ele) {
  const itemsTarget_el = this.itemsTarget.element;
  const itemsTarget = this.itemsTarget;

  if (this.cache.isFrozzen) {
    console.warn("You can't append new item to frozzen element");
    return this;
  }
  for (let i = 0; i < ele.length; i++) {
    if (["number", "string"].includes(typeof ele[i])) ele[i] = text(ele[i]);
        // Fix Items Latter
    if (ele[i] instanceof Function) {
      if (isStateGetter(ele[i])) {
        console.log({s : ele[i]()});
        const getter = ele[i]();
        ele[i] = text(getter.value);
        getter._subscribe(
            (newValue) => (ele[i].element.textContent = newValue),
            ele[i] 
        );
        // this.itemsTarget.element.appendChild(textNode);
      }
    }
    if (typeof globalThis?.Node === "function" && ele[i] instanceof globalThis?.Node) ele[i] = new this.constructor(ele[i]);
    if (ele[i]?.isUINode) {
        ele[i].cache.parent = this;
        itemsTarget_el?.[adder](ele[i].element);
        ele[i].target = this.itemsTarget.element;
        itemsTarget.items[pusher](ele[i]);
    } 
    else if(ele[i] instanceof Promise){
      const UIEle = await ele[i];
      UIEle.cache.parent = this;
      itemsTarget_el?.[adder](UIEle.element);
      UIEle.target = this.itemsTarget.element;
      itemsTarget.items[pusher](UIEle);
    }
    else if (ele[i] instanceof Object) {
      if (ele[i]?.style) this.style(ele[i]?.style);
      if (ele[i]?.attr) {
        Object.entries(ele[i].attr).forEach((n) =>
          this.setAttr("" + n[0], n[1]),
        );
      }
    }
  }
  this.maintain();
  return this;
}

var DomMethods = /*#__PURE__*/Object.freeze({
   __proto__: null,
   __addItem__: __addItem__,
   after: after,
   append: append,
   before: before,
   clear: clear,
   insertAt: insertAt,
   prepend: prepend,
   remove: remove,
   replaceElementWith: replaceElementWith
});

function at(index) {
  return this.items.at(index);
}
function forEach(callback) {
  this.items.forEach(callback);
  return this;
}
function map(callback) {
  return this.items.map(callback);
}
function find(condition) {
  return this.items.filter(condition);
}

var IndexingMethods = /*#__PURE__*/Object.freeze({
   __proto__: null,
   at: at,
   find: find,
   forEach: forEach,
   map: map
});

function style$1(styles){
    if(!this.element?.style) return this;
    for(let key in styles){
        const value = styles[key];
        if(isStateGetter(value)){
            const getter = value();
            Object.assign(this.element.style, {[key] : getter.value});
            getter._subscribe(
                (newValue) => {
                    console.log({newValue});
                    Object.assign(this.element.style, {[key] : newValue});
                },
                // this 
            );
        }
        else Object.assign(this.element.style, {[key] : value});
    }
    return this;
}
function size(width, height){
    return this.style({width, height})
}
function hide(){

}
function show(){

}
function animate(keyframe, {duration=1000, iterations=1, easing="ease"}={}){
    this.element?.animate(keyframe,{duration, iterations, easing});
    return this;
}

var StyleMethods = /*#__PURE__*/Object.freeze({
   __proto__: null,
   animate: animate,
   hide: hide,
   show: show,
   size: size,
   style: style$1
});

class EventController {
  constructor(target, category){
    this.cache = {
      category,
      target,
      listeners : {},
      currentEvent : null,
      event : null,
      customEvents : new Set()
    };
  }
  get event(){
    return this.cache.event
  }
  get target(){
    return this.cache.target;
  }
  get element(){
    return this.cache.target.element;
  }
  get currentEvent(){
    return this.cache.currentEvent;
  }
  addListener(event_name, callback, {preventDefault = false, paused = false} = {}){
    this.cache.listeners[event_name] = {
      callback : e =>{
        this.cache.event = e;
        if(this.cache.listeners[event_name].preventDefault) e.preventDefault();
        if(!this.cache.listeners[event_name].paused) {
          this.cache.currentEvent = event_name;
          callback.call(this, this);
        }
      },
      preventDefault,
      paused,
    };
    this.element.addEventListener(event_name, this.cache.listeners[event_name].callback);
    return this;
  }
  removeListener(event_name){
    this.element.removeEventListener(event_name, this.cache.listeners[event_name].callback);
    return this;
  }
  pause(event_name){
    this.cache.listeners[event_name].paused = true;
    return this;
  }
  resume(event_name){
    this.cache.listeners[event_name].paused = false;
    return this;
  }
  preventDefault(event_name){
    // if(!event_name) 
    this.cache.listeners[event_name].preventDefault = true;
    return this;
  }
  useDefault(event_name){
    this.cache.listeners[event_name].preventDefault = false;
    return this;
  }
}

class ClickAwayEvent extends Event {
  constructor(originalEvent, targetElement) {
    super("clickaway", { bubbles: true, cancelable: true });
    this.originalEvent = originalEvent;
    this.targetElement = targetElement;
  }
}

function register_click_away_event(element) {
  // console.log(element)
  function handler(e) {
    if (!element.contains(e.target)) {
      const clickAwayEvent = new ClickAwayEvent(e, element);
      element.dispatchEvent(clickAwayEvent);
    }
  }

  globalThis?.document?.addEventListener("click", handler);

  return () => globalThis?.document?.removeEventListener("click", handler);
  
}

// // Example usage
// const box = document.querySelector("#my-box");

// const stop = listenClickAway(box);

// box.addEventListener("clickaway", (e) => {
//   console.log("Clicked outside box!", e);
// });

// // later, you can stop listening:
// // stop();

const getCoordinates = (ctx, normalized = false) =>{
    const rect = ctx.element.getBoundingClientRect();
    const e = ctx.event;
    let x = (e?.clientX - rect.left) | 0;
    let y = (e?.clientY - rect.top) | 0;

    if(normalized){
        const w = ctx.element.clientWidth;
        const h = ctx.element.clientHeight;
        x = +((x / w) * 2 - 1).toFixed(8);
        y = +((y / h) * -2 + 1).toFixed(8);
    }

    return {x, y};
};

const isCustomEventRegistred = (ctx, category, event_name) => ctx.exp.events?.[category]?.cache?.customEvents?.has(event_name);

const CATEGORY$3 = 'click';
const ClickListeners = {
    onClick(callback){
        return this.on(
            'click', callback, 
            { category : CATEGORY$3 })
    },
    onDblClick(callback){
        return this.on(
            'dblclick', callback, 
            { category : CATEGORY$3})
    },
    onClickAway(callback){
        if(!isCustomEventRegistred(this, CATEGORY$3, 'clickaway')) register_click_away_event(this.element);
        return this.on(
            'clickaway', callback, 
            { category : CATEGORY$3, isCustom : true})
    },
};

const CATEGORY$2 = 'ptr';
const PtrListeners = {
    onPtrDown(callback, useNormalizedCoordinates = false){
        return this.on(
            'pointerdown', callback, 
            { category : CATEGORY$2, details_setter : (ctx)=> {
                const {x, y} = getCoordinates(ctx, useNormalizedCoordinates);
                ctx.dx = x;
                ctx.dy = y;
                ctx.isDown = true;
                ctx.isDragging = ctx.isMoving ?? false;
            }}
        )
    },
    onPtrMove(callback, useNormalizedCoordinates = false){
        return this.on(
            'pointermove', callback, 
            { category : CATEGORY$2, details_setter : (ctx)=> {
                const {x, y} = getCoordinates(ctx, useNormalizedCoordinates);
                ctx.mx = x;
                ctx.my = y;
                ctx.isMoving = true;
                ctx.isDragging = ctx.isDown ?? false;
            }}
        )
    },
    onPtrUp(callback, useNormalizedCoordinates = false){
        return this.on(
            'pointerup', callback, 
            { category : CATEGORY$2, details_setter : (ctx)=> {
                const {x, y} = getCoordinates(ctx, useNormalizedCoordinates);
                ctx.ux = x;
                ctx.uy = y;
                ctx.isDown = false;
                ctx.isMoving = false;
                ctx.isDragging = false;
            }}
        )
    }
};

const CATEGORY$1 = 'key';
const KeyListeners = {
    onKeyDown(callback){
        return this.on(
            'keydown', callback, 
            { category : CATEGORY$1, details_setter : ctx=> { ctx.kd = ctx.event.key; }
        })
    },
    onKeyPress(callback){
        return this.on(
            'keypress', callback, 
            { category : CATEGORY$1, details_setter : ctx=> { ctx.kp = ctx.event.key; }
        })
    },
    onKeyUp(callback){
        return this.on(
            'keydown', callback, 
            { category : CATEGORY$1, details_setter : ctx=> { ctx.ku = ctx.event.key; }
        })
    },
    
};

const debounce=(fn,delay=1000)=>{
    let id;
    return (...args) => id ? clearTimeout(id) : setTimeout(()=>fn(...args),delay);
};
const throttle=(fn,delay)=>{
    let lastTime=0;
    return (...args) => {
        const now = new Date().getTime();
        if(now-lastTime < delay) return;
        lastTime = now;
        fn(...args); 
    }
};

class ViewEvent extends CustomEvent {
    constructor(type, detail, { bubbles = true, cancelable = true } = {}) {
        super(type, { detail, bubbles, cancelable });
    }
}

function register_view_event(
    element,
    {
        intersection = true,
        resize = true,
        threshold = 0,
        throttleResize = 100,
        throttleEnterExit = 0
    } = {}
) {
    let intersectionObserver, resizeObserver;
    const resizeCallback = entries => {
        for (let entry of entries) {
            const { width, height } = entry.contentRect;

            element.dispatchEvent(
                new ViewEvent("resizeview", {
                    width,
                    height,
                    entry
                })
            );
        }
    };

    const throttledResize = throttleResize > 0
        ? throttle(resizeCallback, throttleResize)
        : resizeCallback;

    const intersectionCallback = entries => {
        for (let entry of entries) {
            const type = entry.isIntersecting ? "enterview" : "exitview";
            element.dispatchEvent(new ViewEvent(type, entry));
        }
    };

    const throttledIntersections = throttleEnterExit > 0
        ? throttle(intersectionCallback, throttleEnterExit)
        : intersectionCallback;

    if (intersection) {
        intersectionObserver = new IntersectionObserver(throttledIntersections, { threshold });
        intersectionObserver.observe(element);
    }

    if (resize) {
        resizeObserver = new ResizeObserver(throttledResize);
        resizeObserver.observe(element);
    }

    // ---- UNREGISTER ----
    return () => {
        if (intersectionObserver) {
            intersectionObserver.unobserve(element);
            intersectionObserver.disconnect();
        }
        if (resizeObserver) {
            resizeObserver.unobserve(element);
            resizeObserver.disconnect();
        }
    };
}

const CATEGORY = 'view';
const ViewListeners = {
    onEnterView(callback){
        if(!this.exp.events?.[CATEGORY]) register_view_event(this.element);
        return this.on(
            'enterview', callback, 
            { category : CATEGORY, isCustom : true})
    },
    onExitView(callback){
        if(!this.exp.events?.[CATEGORY]) register_view_event(this.element);
        return this.on(
            'exitview', callback, 
            { category : CATEGORY, isCustom : true})
    },
    onResizeView(callback){
        if(!this.exp.events?.[CATEGORY]) register_view_event(this.element);
        return this.on(
            'resizeview', callback, 
            { category : CATEGORY, isCustom : true})
    },
};

class SwipeEvent extends CustomEvent {
  constructor(type, detail) {
    super(type, {
      detail,
      bubbles: true,
      cancelable: true
    });
  }
}

function register_swipe_event(
  element,
  threshold = 5,
  restraint = 100,
  allowedTime = 500
) {
  let startX = 0,
      startY = 0,
      startTime = 0,
      isPointerDown = false;

  function onPointerDown(e) {
    startX = e.clientX;
    startY = e.clientY;
    startTime = performance.now();
    isPointerDown = true;
  }

  function onPointerUp(e) {
    if (!isPointerDown) return;
    isPointerDown = false;

    const distX = e.clientX - startX;
    const distY = e.clientY - startY;
    const elapsed = performance.now() - startTime;

    let direction = null;
    let eventName = null;

    if (elapsed <= allowedTime) {
      if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
        direction = distX < 0 ? "left" : "right";
        eventName = "swipe" + direction;
      } 
      else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
        direction = distY < 0 ? "up" : "down";
        eventName = "swipe" + direction;
      }
    }

    // Emit event
    if (eventName) {
      element.dispatchEvent(
        new SwipeEvent(eventName, {
          direction,
          distX,
          distY,
          originalEvent: e
        })
      );
    }
  }

  element.addEventListener("pointerdown", onPointerDown, { passive: true });
  element.addEventListener("pointerup", onPointerUp, { passive: true });

  return () => {
    element.removeEventListener("pointerdown", onPointerDown);
    element.removeEventListener("pointerup", onPointerUp);
  };
}

let UIElement$1 = class UIElement extends UIElementCore{
  constructor({element, name ='', type = 'html', render = __Ziko__.__Config__.default.render, props}={}){
    super();
    this.exp = {
      events : {

      }
    };
    register_to_class(
      this, 
      LifecycleMethods,
      AttrsMethods, 
      DomMethods, 
      StyleMethods,
      IndexingMethods,
      PtrListeners,
      ClickListeners,
      KeyListeners,
      ViewListeners,
    );

    if(element) this.init({element, name, type, render, props});
  }
  on(event_name, callback, {details_setter, category = 'global', isCustom = false, preventDefault = false} = {}){
    if(event_name instanceof Array) event_name.forEach(
      event => this.on(
        event, 
        callback, 
        {details_setter, category, isCustom, preventDefault}
      )
    );
    if(category && !this.exp.events.hasOwnProperty(category)) this.exp.events[category] = new EventController(this, category);
    isCustom && this.exp.events[category].cache.customEvents.add(event_name);
    const EVENT = this.exp.events[category];
    EVENT.addListener(event_name, (e)=>{
      if(details_setter) details_setter(EVENT);
      callback(e);
    },{
      preventDefault
    });
    return this;
  }
  _off(event, category = 'global'){
    this.exp.events[category].removeListener(event);
    return this
  }
  get element(){
    return this.cache.element;
  }
  get itemsTarget(){
    return this.cache.itemsTarget; 
  }
  get itemsTargetElement(){
    return this.itemsTarget.element;
  }
  setItemsTarget(parent){
    this.cache.itemsTarget = parent;
    this.items = parent.items;
    return this;
  }
  isInteractive(){
    return this.cache.isInteractive;
  }
  useClient(directive){
    if(!this.cache.isInteractive){
      this.element.setAttribute('data-hydration-index', globalThis.__Ziko__.__HYDRATION__.index);
      globalThis.__Ziko__.__HYDRATION__.register(() => this);
      this.cache.isInteractive = true;
    }
    if(directive)this.element.setAttribute('data-hydration-directive', directive);
    return this;
  }
  get st(){
    return this.cache.style;
  }
  get attr(){
    return this.cache.attributes;
  }
  get evt(){
    return this.events;
  }
  get html(){
    return this.element.innerHTML;
  }
  get text(){
    return this.element.textContent;
  }
  get isBody(){
    return this.element === globalThis?.document.body;
  }
  get parent(){
    return this.cache.parent;
  }
  get width(){
    return this.element.getBoundingClientRect().width;
  }
  get height(){
    return this.element.getBoundingClientRect().height;
  }
  get top(){
    return this.element.getBoundingClientRect().top;
  }
  get right(){
    return this.element.getBoundingClientRect().right;
  }
  get bottom(){
    return this.element.getBoundingClientRect().bottom;
  }
  get left(){
    return this.element.getBoundingClientRect().left;
  }

};

const is_primitive = (value) => typeof value !== 'object' && typeof value !== 'function' || value === null;

const call_with_optional_props = (Component) => {
    return (...args) => {
        const first = args[0];

        const isChild = first?.isUIElement?.() || is_primitive(first);

        if (isChild) {
            return new Component({}, ...args);
        }

        return new Component(first, ...args.slice(1));
    };
};

function add_vendor_prefix(property) {
	const propertyUC = property.slice(0, 1).toUpperCase() + property.slice(1);
	const vendors = ['Webkit', 'Moz', 'O', 'ms'];
	for(let i = 0, len = vendors.length; i < len; i++) {
		const vendor = vendors[i];
		if(typeof (globalThis?.document?.body).style[vendor + propertyUC] !== 'undefined') return vendor + propertyUC;
	}
	return property;
}
const normalize_css_value = value => typeof value === 'number' ? value+'px' : value;
const add_class = (UIElement, name) => UIElement.element.className = UIElement.element.className.replace(/\s+$/gi, '') + ' ' + name;
const remove_class =(UIElement, name) => UIElement.element.className = UIElement.element.className.replace(name, '');

// const addSuffixeToNumber=(value,suffixe="px")=>{
//   if(typeof value === "number") value+=suffixe;
//   if(value instanceof Array)value=value.map(n=>typeof n==="number"?n+=suffixe:n).join(" ");
//   return value;
// }

// const Id = (a) => document.getElementById(a);
// const Class = (a) => [...document.getElementsByClassName(a)];
// const $=(...selector)=>{
//   var ele=[]
//   for(let i=0;i<selector.length;i++){
//     if(typeof selector[i]=="string")ele.push(...document.querySelectorAll(selector[i]));
//     if(selector[i] instanceof UIElement)ele.push(selector[i].element)
//   }
//   return ele.length===1?ele[0]:ele;
// }

const style = (el, styles) => {if(el)Object.assign(el.style, styles);};

function script(src) {
  const Script = document?.createElement("script");
  Script.setAttribute("src", src);
  document.head.appendChild(Script);
}
function linkStyle(href) {
  const link = document?.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", href);
  document.head.appendChild(link);
}
const CloneElement = (UIElement) => {
  var clone = new UIElement.__proto__.constructor();
  //waitForUIElm(UIElement).then(e=>console.log(e)).then(()=>clone = new UIElement.__proto__.constructor())
  //let a = new UIElement.__proto__.constructor()
  return clone;
};
const cloneUI=UIElement=>{
  return Object.assign(Object.create(Object.getPrototypeOf(UIElement)),UIElement)
};
// function isPrimitive(value) {
//     return typeof value !== 'object' && typeof value !== 'function' || value === null;
// }
const waitElm=(UIElement)=>{
    return new Promise(resolve => {
        if (UIElement) {
            return resolve(UIElement);
        }
        const observer = new MutationObserver(() => {
            if (UIElement) {
                resolve(UIElement);
                observer.disconnect();
            }
        });
        observer.observe(document?.body, {
            childList: true,
            subtree: true
        });
    });
  };

const HTMLTags = [
  'a',
  'abb',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'blockquote',
  'br',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hgroup',
  'hr',
  'i',
  'iframe',
  'img',
  'ipnut',
  'ins',
  'kbd',
  'label',
  'legend',
  'li',
  'main',
  'map',
  'mark',
  'menu',
  'meter',
  'nav',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'search',
  'section',
  'select',
  'small',
  'source',
  'span',
  'strong',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'template',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr'
];

const SVGTags = [
    "svg", "g", "defs", "symbol", "use", "image", "switch",
    "rect", "circle", "ellipse", "line", "polyline", "polygon", "path",
    "text", "tspan", "textPath", "altGlyph", "altGlyphDef", "altGlyphItem", "glyph", "glyphRef",
    "linearGradient", "radialGradient", "pattern", "solidColor",
    "filter", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix",
    "feDiffuseLighting", "feDisplacementMap", "feDropShadow", "feFlood", "feFuncA", "feFuncR", "feFuncG", "feFuncB",
    "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "feSpecularLighting",
    "feTile", "feTurbulence",
    "animate", "animateMotion", "animateTransform", "set",
    "script",
    "desc", "title", "metadata", "foreignObject"
  ];

const MathMLTags = [
  'math', 'annotation', 
  `merror`,
  `mfrac`,
  `mi`, 
  `mprescripts`,
  `mn`, 
  `mo`, `mover`,
  `mpadded`, `mphantom`, `mprescripts`,
  `mroot`, `mrow`,
  `ms`, `semantics`, `mspace`, `msqrt`, `mstyle`, `msub`, `msup`, `msubsup`,
  `mtable`, `mtd`, `mtext`, `mtr`,
  `munder`, `munderover`
];

const tags = new Proxy({}, {
  get(target, prop) {
    if (typeof prop !== 'string') return undefined;
    let tag = prop.replaceAll("_","-").toLowerCase();
    let type ;
    if(HTMLTags.includes(tag)) type = 'html';
    if(SVGTags.includes(tag)) type = 'svg';
    if(MathMLTags.includes(tag)) type = 'mathml';
    return (...args) => {
      if(args.length === 0) {
        return new UIElement$1({element : tag, name : tag, type})
      }
      if(
        ['string', 'number'].includes(typeof args[0]) 
        || args[0] instanceof UIElement$1 
        || isStateGetter(args[0])
        || args[0] instanceof HTMLElement
      ) return new UIElement$1({element : tag, name : tag, type}).append(...args);
      return new UIElement$1({element : tag, type, props : args.shift()}).append(...args)
    }
  }
});

function define_wc(name, UI_Constructor, props = {}, { mode = 'open'} = {}) {
    if (globalThis.customElements?.get(name)) {
        console.warn(`Custom element "${name}" is already defined`);
        return;
    }
    if(name.search('-') === -1){
        console.warn(`"${name}" is not a valid custom element name`);
        return; 
    }
    globalThis.customElements?.define(
        name,
        class extends HTMLElement {
            static get observedAttributes() {
                return ['style', ...Object.keys(props)];
            }

            constructor() {
                super();
                this.attachShadow({ mode });
                this.props = {};
                this.mask = {
                    ...props,
                    // style: { type: Object }
                };
            }

            connectedCallback() {
                this.render();
            }

            render() {
                this.shadowRoot.innerHTML = '';
                const item = UI_Constructor(this.props);
                if(item instanceof Array) item.forEach(n => n.mount(this.shadowRoot)); 
                else item.mount(this.shadowRoot);
            }

            attributeChangedCallback(name, _, newValue) {
                Object.assign(this.props, {
                    [name]: this.mask[name].type(newValue)
                });
                this.render();
            }
        }
    );
}

class UIView extends UIElement$1{
    constructor(...items){
        super({element : 'div', name : 'view'});
        this.append(...items);
    }
}

const View = (...items) => new UIView(...items);

function set_vertical(direction){
  direction == 1
    ? this.style({ flexDirection: "column" })
    : direction == -1 && this.style({ flexDirection: "column-reverse" });
  return this;
}
function set_horizontal(direction){
    direction == 1
        ? this.style({ flexDirection: "row" })
        : direction == -1 && this.style({ flexDirection: "row-reverse" });
    return this;
}
function map_pos_x(align){
    let pos = ["flex-start", "center", "flex-end"];
    if (typeof align === "number") align = pos[align + 1];
    return align;
}
function map_pos_y(align){
    return map_pos_x(-align);
}

class UIFlex extends UIElement$1 {
  constructor({tag = "div", orientation = "h", order, w = "100%", h = "100%"} = {}) {
    super({element : tag , name : "Flex"});
    this.direction = "cols";
    this.style({ display: "flex" });
    // this.mount();
  }
  isFlex(){
    return true;
  }
  responsify(respBreakPoint, wrap = true) {
    this.wrap(wrap);
    if (this.element.clientWidth < respBreakPoint) this.vertical();
    else this.horizontal();
    return this;
  }
  setSpaceAround() {
    this.style({ justifyContent: "space-around" });
    return this;
  }
  setSpaceBetween() {
    this.style({ justifyContent: "space-between" });
    return this;
  }
  setBaseline() {
    this.style({ alignItems: "baseline" });
    return this;
  }
  gap(g) {
    if (this.direction === "row") this.style({ columnGap: g });
    else if (this.direction === "column") this.style({ rowGap: g });
    return this;
  }
  wrap(value = "wrap") {
    const values = ["no-wrap", "wrap","wrap-reverse"];
    this.style({
      flexWrap: typeof value === "string" ? value : values[+value],
    });
    return this;
  }
  _justifyContent(align = "center") {
    this.style({ justifyContent: align });
    return this;
  }
  // verticalize
  vertical(x, y, order = 1) {
    set_vertical.call(this, order);
    this.style({
      alignItems: typeof(x)==="number"?map_pos_x.call(this,x):x,
      justifyContent: typeof(y)=="number"?map_pos_y.call(this,y):y
    });
    return this;
  }
  // horizontalize
  horizontal(x, y, order = 1) {
    set_horizontal.call(this, order);
    this.style({
      alignItems: typeof(y)=="number"?map_pos_y.call(this,y):y,
      justifyContent: typeof(x)==="number"?map_pos_x.call(this,x):x
    });
    return this;
  }
  show() {
    this.isHidden = false;
    this.style({ display: "flex" });
    return this;
  }
}

const Flex = (...UIElement) =>{
  let tag="div";
  if(typeof UIElement[0]==="string"){
    tag=UIElement[0];
    UIElement.pop();
  }
  return new UIFlex(tag).append(...UIElement);
};

class UIElement extends UIElementCore{
    constructor({element, name, type, render}){
        super({element, name, type, render});
    }
}

class UISuspense extends UIElement{
    constructor(fallback_ui, callback){
        super({element : "div", name : "suspense"});
        this.setAttr({
            dataTemp : "suspense"
        });
        this.fallback_ui = fallback_ui;
        this.append(fallback_ui);
        (async ()=>{
            try{
                const ui = await callback();
                fallback_ui.unmount();
                this.append(ui);
            }
            catch(error){
                console.log({error});
            }
        })();
    }
}

const Suspense = (fallback_ui, callback) => new UISuspense(fallback_ui, callback);

class UISwap extends UIElement$1 {
    #DISPLAYS_MAP = new WeakMap()
    constructor({ activeIndex = 0 } = {}, ...items) {
        super({ element: 'div' });
        this.style({ display: 'contents' });
        
        this.states = {
            activeIndex
        };
        
        this.append(...items);
        requestAnimationFrame(() => {
            this.render();
        });
    }
    get activeItem(){
        return this.items[this.states.activeIndex]
    }
    render() {
        this.items.forEach((n, i) => {

            const initialDisplay = getComputedStyle(n.element).display;
            this.#DISPLAYS_MAP.set(n, initialDisplay);

            if (i !== this.states.activeIndex) {
                n.style({ display: 'none' });
            }
        });
    }
    get DS(){
        return this.#DISPLAYS_MAP
    }
    next(n = 1) {
        return this.activate(this.states.activeIndex + n);
    }
    previous(n = 1) {
        return this.activate(this.states.activeIndex - n);
    }
    activate(index) {
        if (!this.items.length) return this;

        const currentItem = this.items.at(this.states.activeIndex);

        if (currentItem) {
            currentItem.style({ display: 'none' });
        }

        const len = this.items.length;
        this.states.activeIndex = ((index % len) + len) % len;

        const activeItem = this.items.at(this.states.activeIndex);
        if (activeItem) {
            const restoredDisplay = this.#DISPLAYS_MAP.get(activeItem) || 'block';
            activeItem.style({ display: restoredDisplay === 'none' ? 'block' : restoredDisplay });
        }

        return this;
    }
}

const Swap = call_with_optional_props(UISwap);

class UIFragment extends UIElement$1{
    constructor(...items){
        super({ element : document.createDocumentFragment()});
        this.append(...items);
    }
    isFragment(){
        return true
    }
}

const Fragment = (...items) => new UIFragment(...items);

class UIFor extends UIFragment{
    constructor({each, fallback, mapFn = () => {}} = {}){
        super();
        this.config = {
            each,
            fallback,
            mapFn
        };
        this.append(
            ...this.config.each.map((n,i) => this.config.mapFn(n, i))
        );
    }
}

const For = ({each, fallback, mapFn} = {}) => new UIFor({each, fallback, mapFn});

class UISwitch extends UIElement$1{
    constructor(key, cases){
        super();
        this.key = key; 
        this.cases = cases;
        this.init();
    }
    init(){
        Object.values(this.cases).filter(n=>n != this.current).forEach(n=>n.unmount());
        super.init(this.current.element);
    }
    get current(){
        const matched = Object.keys(this.cases).find(n => n == this.key) ?? 'default';
        return this.cases[matched]
    }
    updateKey(key){
        this.key = key;
        this.replaceElementWith(this.current.element);
        // this.cache.element.replaceWith(this.current.element)
        // this.cache.element = this.current.element;
        return this;
    }
    
}

const Switch=({key, cases})=> new UISwitch(key, cases);

// export const Switch=({key, cases}) => {
//     const matched = Object.keys(cases).find(n => n == key) ?? 'default';
//     return this.cases[matched]()
// }

class UIHTMLWrapper extends UIElement$1 {
    constructor(content){
        super({element : 'div', name : 'html_wrappper'});
        this.element.append(html2dom(content));
        this.style({
            display : 'contents'
        });
    }
}

function html2dom(htmlString) {
    if(globalThis?.DOMParser){
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<div>${htmlString}</div>`, 'text/html');
        doc.body.firstChild.style.display = "contents";
        return doc.body.firstChild;
    }
}

const HTMLWrapper = (content) => new UIHTMLWrapper(content);

class UISVGWrapper extends UIElement$1 {
    constructor(content){
        super({element : 'div', name : 'html_wrappper'});
        this.element.append(svg2dom(content));
        this.style({
            display : 'contents'
        });
    }
}

function svg2dom(svgString) {
  if (typeof DOMParser !== "undefined") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString.trim(), "image/svg+xml");
    const svg = doc.documentElement;

    if (svg.nodeName === "parsererror") {
      throw new Error("Invalid SVG string");
    }
    if(svg.hasAttribute('xmlns')) return svg
    // TO Fix ...
    const {children, attributes} = svg;
    const element = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    for(let {name, value} of attributes){
      element.setAttribute(name, value);
    }
    element.append(...children);

    globalThis.svg = svg;
    globalThis.children = children; 
    globalThis.attributes = attributes;
    globalThis.element = element;
    return element;
  }
  throw new Error("DOMParser is not available in this environment");
}



const SVGWrapper = (content) => new UISVGWrapper(content);

class UICanvas extends UIElement$1{
    constructor(w,h){
        super("canvas","canvas");
        this.ctx = this.element?.getContext("2d");
        this.style({
            border:"1px red solid",
        });
        this.transformMatrix = new Matrix([
            [1,0,0],
            [0,1,0],
            [0,0,1]
        ]);
        this.axisMatrix = new Matrix([
            [-10,-10],
            [10,10]
        ]);
        // setTimeout(()=>this.resize(w,h),0);
        requestAnimationFrame(()=>this.resize(w,h),0);
        this.on("sizeupdated",()=>this.adjust());
    }
    get Xmin(){
        return this.axisMatrix[0][0];
    }
    get Ymin(){
        return this.axisMatrix[0][1];
    }
    get Xmax(){
        return this.axisMatrix[1][0];
    }
    get Ymax(){
        return this.axisMatrix[1][1];
    }
    get ImageData(){
        return this.ctx.getImageData(0,0,c.Width,c.Height);
    }
    draw(all=true){
        if(all){
            this.clear();  
            this.items.forEach(element => {
                element.parent=this;
                element.draw(this.ctx);
            });
        }
        else {
            this.items.at(-1).parent=this;
            this.items.at(-1).draw(this.ctx);
        }
        this.maintain();
        return this;
    }
    applyTransformMatrix(){
        this.ctx.setTransform(
            this.transformMatrix[0][0],
            this.transformMatrix[1][0],
            this.transformMatrix[0][1],
            this.transformMatrix[1][1],
            this.transformMatrix[0][2],
            this.transformMatrix[1][2],
        );
        return this;
    }
    resize(w,h){
        this.size(w,h);
        this.lineWidth();
        this.view(this.axisMatrix[0][0], this.axisMatrix[0][1], this.axisMatrix[1][0], this.axisMatrix[1][1]);
        this.emit("sizeupdated");
        return this;
    }
    adjust(){
        this.element.width =this.element?.getBoundingClientRect().width;
        this.element.height =this.element?.getBoundingClientRect().height;
        this.view(this.axisMatrix[0][0], this.axisMatrix[0][1], this.axisMatrix[1][0], this.axisMatrix[1][1]);
        return this;
    }
    view(xMin,yMin,xMax,yMax){
        this.transformMatrix[0][0]=this.width/(xMax-xMin); // scaleX
        this.transformMatrix[1][1]=-this.height/(yMax-yMin); // scaleY
        this.transformMatrix[0][2]=this.width/2;
        this.transformMatrix[1][2]=this.height/2;
        this.axisMatrix=new Matrix([
            [xMin,yMin],
            [xMax,yMax]
        ]);
        
        this.applyTransformMatrix(); 
        this.clear();
        this.lineWidth(1);
        this.draw();
        return this;
    }
    reset(){
        this.ctx.setTransform(1,0,0,0,0,0);
        return this;
    }
    append(element){
        this.items.push(element);
        this.draw(false);
        return this;
    }
    background(color){
        this.ctx.fillStyle = color;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.applyTransformMatrix();
        this.draw();
    }
    lineWidth(w){
        this.ctx.lineWidth=w/this.transformMatrix[0][0];
        return this
    }
    getImageData(x=0,y=0,w=this.width,h=this.height){
        return this.ctx.getImageData(x,y,w,h);
    }
    clear(){
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.applyTransformMatrix(); 
        return this;
    }
    clone(){
        console.log(this.width);
        const canvas=new UICanvas();
        canvas.items=this.items;
        canvas.transformMatrix=this.transformMatrix;
        canvas.axisMatrix=this.axisMatrix;
        Object.assign(canvas.cache,{...this.cache});
        //waitForUIElm(this)
        //console.log(element)
        this.size(this.element.style.width,this.element.style.width);
        this.applyTransformMatrix();
        this.draw();
        this.adjust();
        return canvas;
    }
    toImage() {
        this.img = document?.createElement("img");
        this.img.src = this.element?.toDataURL("image/png");
        return this;
    }
    toBlob() {
        var canvas = this.element;
        canvas.toBlob(function (blob) {
            var newImg = document?.createElement("img"),
                url = URL.createObjectURL(blob);
            newImg.onload = function () {
                URL.revokeObjectURL(url);
            };
            newImg.src = url;
            console.log(newImg);
        });
    }
    zoomIn(){

    }
    zoomOut(){
        
    }
    undo(n){

    }
    redo(n){

    }
    stream(){

    }
}

const Canvas=(w,h)=>new UICanvas(w,h);

class UISvg extends UIElement$1 {
    constructor(w=360,h=300) {
      super("svg","svg");
      //this.cache={};
      // this.setAttr("width",w);
      // this.setAttr("height",h);
      // this.setAttr({
      //   width : w,
      //   height : h
      // })
      this.style({border:"1px black solid"});
      //this.view(-w/2,-h/2,w/2,h/2);
      this.size(w, h);
      this.view(-10,-10,10,10);
    }
    size(w, h){
      this.setAttr({
        width : w,
        height : h
      });
      return this
    }
    view(x1,y1,x2,y2){
      let width=Math.abs(x2-x1);
      let height=Math.abs(y2-y1);
      this.setAttr("viewBox",[x1,y1,width,height].join(" "));
      this.st.scaleY(-1);
      return this;
    }
    add(...svgElement){
      for(let i=0;i<svgElement.length;i++){
        this.element.append(svgElement[i].element);
        this.items.push(svgElement[i]);
      }
      this.maintain();
      return this;
    }
    remove(...svgElement){
      for(let i=0;i<svgElement.length;i++){
        this.element?.removeChild(svgElement[i].element);
        this.items=this.items.filter(n=>!svgElement);
      }
      this.maintain();
      return this;     
    }
    mask(){
  
    }
    toString(){
      return  (new XMLSerializer()).serializeToString(this.element);
    }
    btoa(){
      return btoa(this.toString())
    }
    toImg(){
      return 'data:image/svg+xml;base64,'+this.btoa()
    }
    toImg2(){
      return "data:image/svg+xml;charset=utf8,"+this.toString().replaceAll("<","%3C").replaceAll(">","%3E").replaceAll("#","%23").replaceAll('"',"'");
    }
    
  }

  const Svg =(w,h)=>new UISvg(w,h);

const { PI, sqrt: sqrt$1, cos: cos$2, sin: sin$2, acos, pow } = Math;

const linear = t => t;

// --- Sin ---
const in_sin = t => 1 - cos$2((t * PI) / 2);
const out_sin = t => sin$2((t * PI) / 2);
const in_out_sin = t => -(cos$2(PI * t) - 1) / 2;

// --- Quad ---
const in_quad = t => t ** 2;
const out_quad = t => 1 - (1 - t) ** 2;
const in_out_quad = t =>
    t < 0.5 ? 2 * (t ** 2) : 1 - (-2 * t + 2) ** 2 / 2;

// --- Cubic ---
const in_cubic = t => t ** 3;
const out_cubic = t => 1 - (1 - t) ** 3;
const in_out_cubic = t =>
    t < 0.5 ? 4 * (t ** 3) : 1 - (-2 * t + 2) ** 3 / 2;

// --- Quart ---
const in_quart = t => t ** 4;
const out_quart = t => 1 - (1 - t) ** 4;
const in_out_quart = t =>
    t < 0.5 ? 8 * (t ** 4) : 1 - (-2 * t + 2) ** 4 / 2;

// --- Quint ---
const in_quint = t => t ** 5;
const out_quint = t => 1 - (1 - t) ** 5;
const in_out_quint = t =>
    t < 0.5 ? 16 * (t ** 5) : 1 - (-2 * t + 2) ** 5 / 2;

// --- Expo ---
const in_expo = t => (t === 0 ? 0 : 2 ** (10 * t - 10));
const out_expo = t => (t === 1 ? 1 : 1 - 2 ** (-10 * t));
const in_out_expo = t =>
    t === 0
        ? 0
        : t === 1
        ? 1
        : t < 0.5
        ? 2 ** (20 * t - 10) / 2
        : (2 - 2 ** (-20 * t + 10)) / 2;

// --- Circ ---
const in_circ = t => 1 - sqrt$1(1 - t ** 2);
const out_circ = t => sqrt$1(1 - (t - 1) ** 2);
const in_out_circ = t =>
    t < 0.5
        ? (1 - sqrt$1(1 - (2 * t) ** 2)) / 2
        : (sqrt$1(1 - (-2 * t + 2) ** 2) + 1) / 2;

// --- Arc ---
const arc = t => 1 - sin$2(acos(t));

// --- Back ---
const back = (t, x = 1) => (t ** 2) * ((x + 1) * t - x);

// --- Elastic ---
const elastic = t =>
    -2 * pow(2, 10 * (t - 1)) * cos$2((20 * PI * t) / 3 * t);

// --- Back variations ---
const in_back = (t, c1 = 1.70158, c3 = c1 + 1) =>
    c3 * pow(t, 3) - c1 * (t ** 2);

const out_back = (t, c1 = 1.70158, c3 = c1 + 1) =>
    1 + c3 * pow(t - 1, 3) + c1 * pow(t - 1, 2);

const in_out_back = (t, c1 = 1.70158, c2 = c1 * 1.525) =>
    t < 0.5
        ? (pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
        : (pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;

// --- Elastic variations ---
const in_elastic = (t, c4 = (2 * PI) / 3) =>
    t === 0
        ? 0
        : t === 1
        ? 1
        : -pow(2, 10 * t - 10) * sin$2((t * 10 - 10.75) * c4);

const out_elastic = (t, c4 = (2 * PI) / 3) =>
    t === 0
        ? 0
        : t === 1
        ? 1
        : pow(2, -10 * t) * sin$2((t * 10 - 0.75) * c4) + 1;

const in_out_elastic = (t, c5 = (2 * PI) / 4.5) =>
    t === 0
        ? 0
        : t === 1
        ? 1
        : t < 0.5
        ? -(pow(2, 20 * t - 10) * sin$2((20 * t - 11.125) * c5)) / 2
        : (pow(2, -20 * t + 10) * sin$2((20 * t - 11.125) * c5)) / 2 + 1;

// --- Bounce ---
const in_bounce = (t, n1 = 7.5625, d1 = 2.75) =>
    1 - out_bounce(1 - t, n1, d1);

const out_bounce = (t, n1 = 7.5625, d1 = 2.75) => {
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
};

const in_out_bounce = (t, n1 = 7.5625, d1 = 2.75) =>
    t < 0.5
        ? out_bounce(1 - 2 * t, n1, d1) / 2
        : out_bounce(2 * t - 1, n1, d1) / 2;

// --- Step / Discrete ---
const step = (t, steps = 5) => Math.floor(t * steps) / steps;
const discret = (t, segments = 5) => Math.ceil(t * segments) / segments;

class TimeAnimation {
  constructor(callback, { ease = linear, step = 50, t0 = 0, start = true, duration = 3000 } = {}) {
    this.callback = callback;
    this.state = {
      isRunning: false,
      animationId: null,
      startTime: null,
      ease,
      step,
    //   interval: [t0, t1],
      autoStart: start,
      duration
    };

    this.t = 0;   // elapsed time
    this.tx = 0;  // normalized [0,1]
    this.ty = 0;  // eased value
    this.i = 0;   // frame index

    if (this.state.autoStart) {
      this.start();
    }
  }

  // ---- private loop handler ----
  #tick = () => {
    this.t += this.state.step;
    this.i++;

    this.tx = map$1(this.t, 0, this.state.duration, 0, 1);
    this.ty = this.state.ease(this.tx);

    this.callback(this);

    if (this.t >= this.state.duration) {
      clearInterval(this.state.animationId);
      this.state.isRunning = false;
    }
  };

  // ---- core runner ----
  #run(reset = true) {
    if (!this.state.isRunning) {
      if (reset) this.reset(false);

      this.state.isRunning = true;
      this.state.startTime = Date.now();
      this.state.animationId = setInterval(this.#tick, this.state.step);
    }
    return this;
  }

  // ---- lifecycle methods ----
  start() {
    return this.#run(true);
  }

  pause() {
    if (this.state.isRunning) {
      clearInterval(this.state.animationId);
      this.state.isRunning = false;
    }
    return this;
  }

  resume() {
    return this.#run(false);
  }

  stop() {
    this.pause();
    this.reset(false);
    return this;
  }

  reset(restart = true) {
    this.t = 0;
    this.tx = 0;
    this.ty = 0;
    this.i = 0;

    if (restart) this.start();
    return this;
  }
}

// Hook-style factory
const animation = (callback, {ease, t0, t1, start, duration} = {}) =>
  new TimeAnimation(callback, {ease, t0, t1, start, duration});

class Tick {
  constructor(fn, ms, count = Infinity, start) {
    this.ms = ms;
    this.fn = fn;
    this.count = count;
    this.frame = 1;
    this.id = null;
    this.running = false;
    if(start) this.start();
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.frame = 1;
      this.id = setInterval(() => {
        if (this.frame > this.count) {
          this.stop();
          return;
        }
        this.fn.call(null, this);
        this.frame++;
      }, this.ms);
    }
    return this;
  }

  stop() {
    if (this.running) {
      this.running = false;
      clearInterval(this.id);
      this.id = null;
    }
    return this;
  }

  isRunning() {
    return this.running;
  }
}

// Helper factory
const tick = (fn, ms, count = Infinity, start = true) => new Tick(fn, ms, count, start);

class Clock extends Tick {
  constructor(tickMs = 1000 / 60) {
    super(tickMs, () => this._tick());
    this.elapsed = 0;
    this._lastTime = performance.now();
    this._callbacks = new Set();
  }

  _tick() {
    const now = performance.now();
    const delta = now - this._lastTime;
    this.elapsed += delta;
    this._lastTime = now;

    for (const cb of this._callbacks) {
      cb({ elapsed: this.elapsed, delta });
    }
  }

  onTick(cb) {
    this._callbacks.add(cb);
    return () => this._callbacks.delete(cb); 
  }

  reset() {
    this.elapsed = 0;
    this._lastTime = performance.now();
  }

  pause() {
    super.stop();
  }

  resume() {
    this._lastTime = performance.now();
    super.start();
  }
}

const clock = (tickMs) => new Clock(tickMs);


/* 

    const clock = new Clock(200);

    clock.onTick(({ elapsed, delta }) => {
      console.log(`Elapsed: ${elapsed.toFixed(0)}ms, Delta: ${delta.toFixed(0)}ms`);
    });

    clock.start();

    setTimeout(() => clock.pause(), 1000);  
    setTimeout(() => clock.resume(), 2000); 

*/

class TimeScheduler {
  constructor(tasks = [], { repeat = 1, loop = false } = {}) {
    this.tasks = tasks;
    this.repeat = repeat;
    this.loop = loop;

    this.stopped = false;
    this.running = false;

    // lifecycle hooks
    this.onStart = null;
    this.onTask = null;
    this.onEnd = null;
  }

  async run() {
    if (this.running) return;
    this.running = true;
    this.stopped = false;

    if (this.onStart) this.onStart();

    let repeatCount = this.repeat;

    do {
      for (const task of this.tasks) {
        if (this.stopped) return;

        if (Array.isArray(task)) {
          // Parallel tasks
          await Promise.all(
            task.map(({ fn, delay = 0 }) =>
              new Promise(async (resolve) => {
                if (delay > 0) await new Promise(r => setTimeout(r, delay));
                if (this.onTask) this.onTask(fn);
                await fn();
                resolve();
              })
            )
          );
        } else {
          // Single task
          const { fn, delay = 0 } = task;
          if (delay > 0) await new Promise(r => setTimeout(r, delay));
          if (this.onTask) this.onTask(fn);
          await fn();
        }
      }
    } while (this.loop && !this.stopped && (repeatCount === Infinity || repeatCount-- > 1));

    if (!this.stopped && this.onEnd) this.onEnd();
    this.running = false;
  }

  stop() {
    this.stopped = true;
    this.running = false;
  }

  addTask(task) {
    this.tasks.push(task);
  }

  clearTasks() {
    this.tasks = [];
  }
}

const Scheduler = (tasks, { repeat = null} = {}) => new TimeScheduler(tasks, { repeat});

const step_fps = (step_or_fps) => 1000 / step_or_fps;

const sleep= ms => new Promise(res => setTimeout(res, ms));
function timeout(ms, fn) {
  let id;
  const promise = new Promise((resolve) => {
    id = setTimeout(() => {
      if (fn) fn();
      resolve();
    }, ms);
  });

  return {
    id,
    clear: () => clearTimeout(id),
    promise
  };
}

class TimeLoop {
  constructor(callback, { step = 1000, t0 = 0, t1 = Infinity, autoplay = true } = {}) {
    this.callback = callback;
    this.cache = {
      isRunning: false,
      id: null,
      last_tick: null,
      step,
      t0,
      t1,
      autoplay,
      pauseTime: null,
      frame : 0,
    };

    if (autoplay) {
      t0 ? this.startAfter(t0) : this.start();
      if (t1 !== Infinity) this.stopAfter(t1);
    }
  }

  get frame(){
    return this.cache.frame;
  }
  get elapsed(){
    return this.cache.elapsed;
  }

  start() {
    if (!this.cache.isRunning) {
      this.cache.frame = 0;
      this.cache.isRunning = true;
      this.cache.last_tick = Date.now();
      this.animate();
    }
    return this;
  }

  pause() {
    if (this.cache.isRunning) {
      clearTimeout(this.cache.id);
      this.cache.isRunning = false;
      this.cache.pauseTime = Date.now();
    }
    return this;
  }

  resume() {
    if (!this.cache.isRunning) {
      this.cache.isRunning = true;
      if (this.cache.pauseTime) {
        // adjust start time so delta stays consistent
        const pausedDuration = Date.now() - this.cache.pauseTime;
        this.cache.last_tick += pausedDuration;
      }
      this.animate();
    }
    return this;
  }

  stop() {
    this.pause();
    this.cache.frame = 0;
    return this;
  }

  startAfter(t = 1000) {
    setTimeout(() => this.start(), t);
    return this;
  }

  stopAfter(t = 1000) {
    setTimeout(() => this.stop(), t);
    return this;
  }

  animate = () => {
    if (this.cache.isRunning) {
      const now = Date.now();
      const delta = now - this.cache.last_tick;

      if (delta >= this.cache.step) {
        this.cache.elapsed = now - (this.cache.t0 || 0);
        this.callback(this);
        this.cache.frame++;
        this.cache.last_tick = now - (delta % this.cache.step);
      }

      this.cache.id = setTimeout(this.animate, 0);
    }
  }
}

const loop = (callback, options = {}) => new TimeLoop(callback, options);


// Helpers
// const useFps = (fps) => 1000 / fps;

// const _loop = loop( e => {
//   console.log("Frame:", e.frame, " Elapsed: ", e.elapsed);
// });

const time_memory_Taken = (callback) => {
    const t0 = Date.now();
    const m0 = performance.memory.usedJSHeapSize;
    const result = callback();
    const t1 = Date.now();
    const m1 = performance.memory.usedJSHeapSize;
    const elapsedTime = t1 - t0;
    const usedMemory = m1 - m0;
    return { 
        elapsedTime,
        usedMemory, 
        result 
    };
  };

const waitForUIElm=(UIElement)=>{
    return new Promise(resolve => {
        if (UIElement.element) {
            return resolve(UIElement.element);
        }
  
        const observer = new MutationObserver(() => {
            if (UIElement.element) {
                resolve(UIElement.element);
                observer.disconnect();
            }
        });
  
        observer.observe(document?.body, {
            childList: true,
            subtree: true
        });
    });
  };
  const waitForUIElmSync=(UIElement,timeout=2000)=>{
    const t0=Date.now();
    while(Date.now()-t0<timeout){
      if(UIElement.element)return UIElement.element
    }
  };

// import Ease from "./ease.js";
const wait=(delayInMS)=>{
    return new Promise((resolve) => setTimeout(resolve, delayInMS));
};
const timeTaken = callback => {
    console.time('timeTaken');
    const r = callback();
    console.timeEnd('timeTaken');
    return r;
};

const csv2arr = (csv, delimiter = ",")=>csv.trim().trimEnd().split("\n").map(n=>n.split(delimiter));
const csv2matrix = (csv, delimiter = ",")=>new Matrix(csv2arr(csv,delimiter));
const csv2object = (csv, delimiter = ",") => {
    const [header, ...rows] = csv2arr(csv,delimiter);
    const result = rows.map(row => {
        const obj = {};
        header.forEach((key, index) => {
            obj[key] = row[index];
        });
        return obj;
    });
    return result;
};
const csv2json = (csv, delimiter = ",") => JSON.stringify(csv2object(csv,delimiter));
const csv2sql=(csv, Table)=>{
    const sanitizeId = s => s.trim().replace(/[^a-zA-Z0-9_]/g, '');
    const escapeVal = s => "'" + s.trim().replace(/'/g, "''") + "'";
    const lines = csv.trim().trimEnd().split('\n').filter(n=>n);
    const columns = lines[0].split(',').map(sanitizeId);
    let sqlQuery = "INSERT INTO " + sanitizeId(Table) + " (" + columns.join(', ') + ") Values ";
    let sqlValues = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(escapeVal);
      sqlValues.push("(" + values.join(', ') + ")");
    }
    return sqlQuery+sqlValues.join(",\n");
  };

const _objects2arr=data=>data instanceof Array?[Object.keys(data[0]),...data.map(n=>Object.values(n))]:[Object.keys(data)];
const _objects2csv=(data,delimiter)=>_objects2arr(data).map(n=>n.join(delimiter)).join("\n");
const json2arr=json=>json instanceof Object?_objects2arr(json):_objects2arr(JSON.parse(json));
const json2csv=(json,delimiter=",")=>json instanceof Object?_objects2csv(json,delimiter):_objects2csv(JSON.parse(json),delimiter);
const json2csvFile=(json,delimiter)=>{
    const str=json2csv(json,delimiter);
    const blob=new Blob([str], { type: 'text/csv;charset=utf-8;' });
    return {
       str,
       blob,
       url:URL.createObjectURL(blob)
    }
};
const _processObject=(obj, indent)=>{
    const yml = [];
    if (Array.isArray(obj)) {
        obj.forEach(item => {
            if (typeof item === 'object' && item !== null) {
                yml.push(`${indent}-`);
                const nestedLines = _processObject(item, `${indent}  `);
                yml.push(...nestedLines);
            } else yml.push(`${indent}- ${item}`);
        });
    } else {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (typeof value === 'object' && value !== null) {
                    yml.push(`${indent}${key}:`);
                    const nestedLines = _processObject(value, `${indent}  `);
                    yml.push(...nestedLines);
                } else {
                    yml.push(`${indent}${key}: ${value}`);
                }
            }
        }
    }
    return yml;
};
const _object2yml=(object,indent="")=>_processObject(object,indent).join('\n');
const json2yml=(json,indent)=>json instanceof Object?_object2yml(json,indent):_object2yml(JSON.parse(json),indent);
const json2ymlFile=(json,indent)=>{
    const str=json2yml(json,indent);
    const blob=new Blob([str], { type: 'text/yml;charset=utf-8;' });
    return {
       str,
       blob,
       url:URL.createObjectURL(blob)
    }
};
const json2xml=(json, indent = 1)=>{
    let xml = '';
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        const value = json[key];
        xml += '\n' + ' '.repeat(indent) + `<${key}>`;
        (typeof value === 'object') ? xml += json2xml(value, indent + 2) : xml += `${value}`;
        xml += `</${key}>`;
      }
    }
    return xml.trim();
  };
const json2xmlFile=(json,indent)=>{
    const str=json2xml(json,indent);
    const blob=new Blob([str], { type: 'text/xml;charset=utf-8;' });
    return {
       str,
       blob,
       url:URL.createObjectURL(blob)
    }
};

const svg2str=svg=>(new XMLSerializer()).serializeToString(svg);
const svg2ascii=svg=>btoa(svg2str(svg));
const svg2imgUrl=svg=>'data:image/svg+xml;base64,'+svg2ascii(svg);
const svg2img=(svg,render=true)=>tags.img(svg2imgUrl(svg)).mount(render);

const json2css=(json, indentLevel = 0)=>{
    json = trimKeys(json);
    let cssText = '';
    const indent = '  '.repeat(indentLevel); 

    for (let selector in json) {
        if (typeof json[selector] === 'object') {
            cssText += `${indent}${selector} {\n`;
            const properties = json[selector];
            for (let property in properties) {
                if (typeof properties[property] === 'object') {
                    cssText += json2css({ [property]: properties[property] }, indentLevel + 1);
                } else {
                    cssText += `${indent}  ${property.replace(/[A-Z]/g, match => '-' + match.toLowerCase())}: ${properties[property]};\n`;
                }
            }

            cssText += `${indent}}\n`; 
        }
    }

    return cssText;
};
function trimKeys(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj; 
    }

    return Object.keys(obj).reduce((acc, key) => {
        const trimmedKey = key.trim();
        acc[trimmedKey] = trimKeys(obj[key]);
        return acc;
    }, Array.isArray(obj) ? [] : {});
}

function parseXML(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const rootNode = xmlDoc.documentElement;
    const result = parseNode(rootNode);
    return result;
  }
  
  function parseNode(node) {
    const obj = {
      type: node.nodeName,
      attributes: {},
      children: []
    };
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i];
      obj.attributes[attr.name] = attr.value;
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      const child = node.childNodes[i];
      if (child.nodeType === Node.ELEMENT_NODE) {
        obj.children.push(parseNode(child));
      } else if (child.nodeType === Node.TEXT_NODE) {
        obj.text = child.textContent.trim();
      }
    }
    return obj;
  }

// import { ZikoHead , useHead} from "../reactivity/hooks/head/index.js";
class ZikoApp {
    constructor({head = null, wrapper = null, target = null}){
        this.head = head;
        this.wrapper = wrapper;
        this.target = target;
        this.init();        
    }
    get isZikoApp(){
        return true;
    }
    init(){
        this.head && this.setHead(this.head);
        this.wrapper && this.setWrapper(this.wrapper);
        this.target && this.setTarget(this.target);
        if(this.wrapper && this.target)this.wrapper.mount(this.target);
    }
    setTarget(target){
        if(target instanceof HTMLElement) this.target = target;
        else if (typeof target === "string") this.target = globalThis?.document?.querySelector(target);
        return this;
    }
    setWrapper(wrapper){
        if(wrapper?.isUIElement) this.wrapper = wrapper;
        else if(typeof wrapper === "function") this.wrapper = wrapper();
        return this;
    }
    // setHead(head){
    //     if(head instanceof ZikoHead) this.head = head;
    //     else this.head = useHead(head);
    //     return this;  
    // }
    
}
const App = ({head, wrapper, target}) => new ZikoApp({head, wrapper, target});

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
// const mask = "app/lang/:lang/id/:id";
// const route = "app/lang/en/id/7";
// console.log(dynamicRoutesParser(mask, route)); // Should return { lang: "en", id: "7" }

class ZikoSPA extends ZikoApp{
    constructor({head, wrapper, target, routes}){
        super({head, wrapper, target});
        this.routes=new Map([
            ["404",text("Error 404")],
            ...Object.entries(routes)
        ]);
        this.clear();
        globalThis.onpopstate = this.mount(location.pathname);
    }
    clear(){
        [...this.routes].forEach(n=>{
            !isDynamic(n[0]) && n[1]?.isUIElement && n[1].unmount();
        });   
        // this.wrapper.clear();
        return this;
    }
    mount(path){
        const [mask, callback] = [...this.routes].find(route=>routesMatcher(route[0],path));
        let element ;
        if(isDynamic(mask)){
            const params = dynamicRoutesParser(mask, path);
            element = callback.call(this,params);
        }
        else {
            callback?.isUIElement && callback.mount(this.wrapper); 
            if(typeof callback === "function") element = callback();  
        }
        if(element?.isUIElement) element.mount(this.wrapper);
        // if(element?.isZikoApp) element.mount(this.wrapper);
        if(element instanceof Promise){
            element.then(e=>e.mount(this.wrapper));
        }
        globalThis.history.pushState({}, "", path);
        return this;
    }
}
const SPA=({head, wrapper, target, routes})=>new ZikoSPA({head, wrapper, target, routes});


/*
 // Static 
  S.get("/url",wrapper)
// Dynamique 
 s.get("/url/name/:name/id/:id",(path,name,id)=>handler())
// regEx
*/

function parseQueryParams$1(queryString) {
    return Object.fromEntries(
            new URLSearchParams(location.search)
        );
}

function defineParamsGetter(target ){
    Object.defineProperties(target, {
        'QueryParams': {
            get: function() {
                return parseQueryParams$1(globalThis.location.search.substring(1));
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

// import.meta.glob('./src/pages/**/*.js')
async function FileBasedRouting(pages /* use import.meta.glob */){
   const routes = Object.keys(pages);
   const root = findCommonPath(routes);
   const pairs = {};
   for(let i=0; i<routes.length; i++){
      const module = await pages[routes[i]]();
      const component = await module.default;
      Object.assign(pairs,{[customPath(routes[i], root)]:component});
   }
   return SPA({
      target : document.body,
      routes : {
         "/" : ()=>{},
         ...pairs
      },
      wrapper : tags.section()
   })   
}
function customPath(inputPath, root = './src/pages', extensions = ['js', 'ts']) {
   if(root.at(-1)==="/") root = root.slice(0, -1);
   const normalizedPath = inputPath.replace(/\\/g, '/').replace(/\[(\w+)\]/g, '$1/:$1');
   const parts = normalizedPath.split('/');
   const rootParts = root.split('/');
   const rootIndex = parts.indexOf(rootParts.at(-1));
   if (rootIndex !== -1) {
       const subsequentParts = parts.slice(rootIndex + 1);
       const lastPart = parts.at(-1);
       const isIndexFile = lastPart === 'index.js' || lastPart === 'index.ts';
    //    console.log({extensions, subsequentParts, lastPart, isIndexFile, rootParts, rootIndex, parts})
       const hasValidExtension = extensions.some(ext => lastPart === `.${ext}` || lastPart.endsWith(`.${ext}`));
       if (isIndexFile) {
           return '/' + (subsequentParts.length > 1 ? subsequentParts.slice(0, -1).join('/') : '');
       }
       if (hasValidExtension) {
           return '/' + subsequentParts.join('/').replace(/\.(js|ts)$/, '');
       }
   }
   return '';
}
function findCommonPath(paths) {
   if (paths.length === 0) return '';
   const splitPaths = paths.map(path => path.split('/'));
   const minLength = Math.min(...splitPaths.map(parts => parts.length));
   let commonParts = [];
   for (let i = 0; i < minLength; i++) {
       const part = splitPaths[0][i]; 
       if (splitPaths.every(parts => parts[i] === part || parts[i].startsWith('['))) {
           commonParts.push(part);
       } else {
           break; 
       }
   }
   const commonPath = commonParts.join('/') + (commonParts.length ? '/' : '');
   return commonPath;
}

function useDerived(deriveFn, sources) {
    let value = deriveFn(...sources.map(s => s().value));
    const subscribers = new Set();

    // const unsubscribers = sources.map(source => {
    //     const srcValue = source();

    //     return srcValue._subscribe(() => {
    //         const newVal = deriveFn(...sources.map(s => s().value));

    //         if (!Object.is(newVal, value)) {
    //             value = newVal;
    //             subscribers.forEach(fn => fn(value));
    //         }
    //     });
    // });

    const getter = () => ({
        value,
        _subscribe: (fn) => {
            subscribers.add(fn);
            return () => subscribers.delete(fn);
        },
    });

    getter[STATE_GETTER] = true;
    return getter
}

const mapfun=(fun,...X)=>{
    const Y=X.map(x=>{
        if(
            x===null||
            ["number","string","boolean","bigint","undefined"].includes(typeof x)||
            x?.__mapfun__
        ) return fun(x)
        if(x instanceof Array) return x.map(n=>mapfun(fun,n));
        if(ArrayBuffer.isView(x)) return x.map(n=>fun(n));
        if(x instanceof Set) return new Set(mapfun(fun,...[...x]));
        if(x instanceof Map) return new Map([...x].map(n=>[n[0],mapfun(fun,n[1])]));
        if(x.isMatrix?.()) return new x.constructor(x.rows, x.cols, mapfun(x.arr.flat(1)))
        // if(x.isComplex?.()){
        //     const [a,b,z,phi]=[x.a,x.b,x.z,x.phi];
        //     switch(fun){
        //         // Moved to Fixed to avoid Circular Dep
        //         // case Math.log: return new x.constructor(ln(z),phi); // Done
        //         // case Math.exp: return new x.constructor(e(a)*cos(b),e(a)*sin(b)); // Done
        //         // case Math.abs: return z; // Done
        //         // case Math.sqrt: return new x.constructor(sqrt(z)*cos(phi/2),sqrt(z)*sin(phi/2)); // Done
        //         // case Fixed.cos: return new x.constructor(cos(a)*cosh(b),-(sin(a)*sinh(b)));
        //         // case Fixed.sin: return new x.constructor(sin(a)*cosh(b),cos(a)*sinh(b));
        //         // case Fixed.tan:{
        //         //     const DEN = cos(2*a)+cosh(2*b);
        //         //     return new x.constructor(sin(2*a)/DEN,sinh(2*b)/DEN);
        //         // }
        //         // case Fixed.cosh:return new x.constructor(cosh(a)*cos(b),sinh(a)*sin(b));
        //         // case Fixed.sinh:return new x.constructor(sinh(a)*cos(b),cosh(a)*sin(b));
        //         // case Fixed.tanh:{
        //         //     const DEN=cosh(2*a)+cos(2*b);
        //         //     return new x.constructor(sinh(2*a)/DEN,sin(2*b)/DEN)
        //         // }
        //         default : return fun(x)
        //     }
        // }
        else if(x instanceof Object){
            return Object.fromEntries(Object.entries(x).map(n=>n=[n[0],mapfun(fun,n[1])]))
            // return fun(Object) || Object.fromEntries(Object.entries(x).map(n=>n=[n[0],mapfun(fun,n[1])]))
        }
    });
   return Y.length==1? Y[0]: Y; 
};

const useReactive = (nested_value) => mapfun(
    n => {
        const state = useState(n);
        return {
            get : state[0],
            set : state[1],
        }
    }, 
    nested_value
);

const useEffect = (callback, deps = []) =>{
    const states = deps.filter(isStateGetter);

    let cleanup;

    const execute = () => {
        // Cleanup previous effect
        if (typeof cleanup === "function") {
            cleanup();
        }

        // Read current state values
        const values = states.map(state => state().value);

        // Execute effect
        cleanup = callback(...values);
    };

    // Subscribe to states
    const unsubscribers = states.map(state =>
        state()._subscribe(execute)
    );

    // Initial execution
    execute();

    // Return effect cleanup
    return () => {
        unsubscribers.forEach(unsubscribe => {
            unsubscribe();
        });

        if (typeof cleanup === "function") {
            cleanup();
            cleanup = undefined;
        }
    };
};

class UseThread {
    #worker;
    #callbacks = new Map();
    #idCounter = 0;

    constructor() {
        const workerCode = `
            this.onmessage = function(e) {
                const { id, funStr, args, close } = e.data;
                try {
                    const func = new Function("return " + funStr)();
                    const result = func(...args);
                    postMessage({ id, result });
                } catch (error) {
                    postMessage({ id, error: error.message });
                } finally {
                    if (close) self.close();
                }
            }
        `;
        const blob = new Blob([workerCode], { type: "text/javascript" });
        this.#worker = new Worker(URL.createObjectURL(blob));

        this.#worker.addEventListener("message", (e) => {
            const { id, result, error } = e.data;
            const callback = this.#callbacks.get(id);
            if (!callback) return;

            callback(result, error);
            this.#callbacks.delete(id);
        });
    }
    call(func, callback, args = [], close = true) {
        if (typeof func !== "function") throw new TypeError("func must be a function");
        const id = ++this.#idCounter;
        this.#callbacks.set(id, callback);

        this.#worker.postMessage({
            id,
            funStr: func.toString(),
            args,
            close
        });

        return this;
    }

    terminate() {
        this.#worker.terminate();
    }
}

const useThread = (func, callback, args = [], close = true) => new UseThread().call(func, callback, args, close);

class UseEventEmitter {
    constructor(maxListeners = 10) {
        this.events = {};
        this.maxListeners = maxListeners;
    }

    on(event, listener) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(listener);
        if (this.events[event].length > this.maxListeners) {
            console.warn(`Warning: Possible memory leak. Event '${event}' has more than ${this.maxListeners} listeners.`);
        }
        return this;
    }

    once(event, listener) {
        const wrapper = (...args) => {
            this.off(event, wrapper);
            listener(...args);
        };
        return this.on(event, wrapper);
    }

    off(event, listener) {
        const listeners = this.events[event];
        if (!listeners) return this;

        const index = listeners.indexOf(listener);
        if (index !== -1) {
            listeners.splice(index, 1);
        }

        return this;
    }

    emit(event, data) {
        const listeners = this.events[event];
        if (!listeners) return false;

        // Make a copy so removing listeners inside callbacks doesn't affect iteration
        [...listeners].forEach(listener => {
            try {
                listener(data);
            } catch (e) {
                console.error(`Error in listener for '${event}':`, e);
            }
        });

        return true;
    }
    remove(event){
        delete this.events[event];  
        return this; 
    }
    clear() {
        this.events = {};
        return this;
    }

    setMaxListeners(max) {
        this.maxListeners = max;
        return this;
    }
}

const useEventEmitter = (maxListeners) => new UseEventEmitter(maxListeners);

/*
 [
    {
        query: '(min-width: 600px)',
        callback: () => console.log(1)
    },
    {
        query: '(max-width: 300px)',
        callback: () => console.log(2)
    }
 ]
*/

class UseMediaQuery {
    #mediaQueryRules;
    #fallback;
    #lastCalledCallback = null;

    constructor(mediaQueryRules = [], fallback = () => {}) {
        this.#mediaQueryRules = mediaQueryRules;
        this.#fallback = fallback;

        this.#init();
    }

    // PRIVATE: check if ANY rule matches
    #checkAllRules() {
        return this.#mediaQueryRules.some(
            ({ query }) => globalThis.matchMedia(query).matches
        );
    }

    // PRIVATE: installs listeners and initial checks
    #init() {
        this.#mediaQueryRules.forEach(({ query, callback }) => {
            const mediaQueryList = globalThis.matchMedia(query);

            const checkMatches = () => {
                const anyMatch = this.#checkAllRules();

                if (mediaQueryList.matches) {
                    callback();
                    this.#lastCalledCallback = callback;
                } else if (!anyMatch && this.#lastCalledCallback !== this.#fallback) {
                    this.#fallback();
                    this.#lastCalledCallback = this.#fallback;
                }
            };

            checkMatches();
            mediaQueryList.addEventListener("change", checkMatches);
        });
    }
}

const useMediaQuery = (mediaQueryRules, fallback) =>
    new UseMediaQuery(mediaQueryRules, fallback);

class UseTitle {
    constructor(title = document.title, withEmitter = true) {
        this.cache = {
            emitter: null
        };

        if (withEmitter) this.useEventEmitter();
        this.set(title);
    }

    useEventEmitter() {
        this.cache.emitter = useEventEmitter();
        return this;
    }

    setTitle(title) {
        if (title !== document.title) {
            document.title = title;

            if (this.cache.emitter) {
                this.cache.emitter.emit("ziko:title-changed", title);
            }
        }
        return this;
    }

    get current() {
        return document.title;
    }

    onChange(callback) {
        if (this.cache.emitter) {
            this.cache.emitter.on("ziko:title-changed", callback);
        }
        return this;
    }
}

const useTitle = (title, withEmitter = true) => new UseTitle(title, withEmitter);

class UseRoot {
    constructor(PropsMap, { namespace = 'Ziko', ValidateCssProps = false } = {}) {
        this.currentPropsMap = PropsMap;
        this.namespace = namespace;
        this.ValidateCssProps = ValidateCssProps;
        this.use(PropsMap);
    }

    use(PropsMap) {
        if (this.ValidateCssProps) ValidateCssPropsFn(PropsMap);
        this.currentPropsMap = PropsMap;
        this.#maintain();
        return this;
    }

    #maintain() {
        const root = globalThis?.document?.documentElement?.style;
        for (const prop in this.currentPropsMap) {
            const cssProp = this.namespace ? `--${this.namespace}-${prop}` : `--${prop}`;
            root.setProperty(cssProp, this.currentPropsMap[prop]);

            Object.defineProperty(this, prop, {
                value: `var(${cssProp})`,
                writable: true,
                configurable: true,
                enumerable: false
            });
        }
    }
}

function ValidateCssPropsFn(PropsMap) {
    const validProps = new Set(Object.keys(document.documentElement.style));
    for (const key in PropsMap) {
        if (!validProps.has(key)) {
            throw new Error(`Invalid CSS property: "${key}"`);
        }
    }
}

const useRoot = (PropsMap, options = {}) => new UseRoot(PropsMap, options);


// Usage 

/*
const Styles = {
 S1 : {
  background : 'white',
  color : 'darkblue'
  border : '2px darkblue solid"'
 },
 S2 : {
  background : 'darkblue',
  color : 'white'
  border : '2px green solid"'
 }
}
const {use, border, background, color} = useRoot(Style.S1)

tags.p("Test useRoot ").style({
  border,
  color,
  background,
  padding : '10px'
})

*/

const parseQueryParams = queryString => Object.fromEntries(new URLSearchParams(globalThis?.location?.search));

function useQueryParams() {
    const getParams = () =>
        parseQueryParams();

    const setParams = (updates, merge = true) => {
        const current = getParams();

        const next =
            typeof updates === "function"
                ? updates(current)
                : updates;

        const finalParams = merge
            ? { ...current, ...next }
            : next;

        const search = new URLSearchParams(finalParams).toString();

        window.history.pushState(
            {},
            "",
            `${window.location.pathname}${search ? `?${search}` : ""}`
        );

        window.dispatchEvent(
            new CustomEvent("queryparamschange", {
                detail: finalParams
            })
        );
    };

    return [getParams, setParams];
}

function watchQueryParams(callback) {
    let previousSearch = location.search;

    const notify = () => {
        const currentSearch = location.search;

        if (currentSearch === previousSearch) {
            return;
        }

        previousSearch = currentSearch;
        callback(parseQueryParams());
    };

    window.addEventListener("popstate", notify);

    const pushState = history.pushState;
    history.pushState = function (...args) {
        pushState.apply(this, args);
        notify();
    };

    const replaceState = history.replaceState;
    history.replaceState = function (...args) {
        replaceState.apply(this, args);
        notify();
    };

    callback(parseQueryParams());

    return () => {
        window.removeEventListener("popstate", notify);
    };
}

let {sqrt, cos: cos$1, sin: sin$1, exp, log, cosh: cosh$1, sinh} = Math;
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
        const x = args[0];
        if(typeof x === 'number' || args.length === 0) return target.apply(thisArg, args);
        if(x?.isComplex?.()){
            const {a, b, z, phi} = x;
            const complex = (a, b) => new x.constructor(a, b);
            switch(target.name){
                case 'abs' : return x.z;
                case 'sqrt' : return complex(sqrt(z)*cos$1(phi/2),sqrt(z)*sin$1(phi/2));
                case 'log' : return complex(log(z), phi);
                case 'exp' : return complex(exp(a)*cos$1(b),exp(a)*sin$1(b));
                case 'cos' : return complex(cos$1(a)*cosh$1(b),-(sin$1(a)*sinh(b)));
                case 'sin' : return complex(sin$1(a)*cosh$1(b),cos$1(a)*sinh(b));
                case 'tan' : {
                    const DEN = cos$1(2*a)+cosh$1(2*b);
                    return complex(sin$1(2*a) /DEN, sinh(2*b)/DEN);
                }
                case 'cosh' : return complex(cosh$1(a)*cos$1(b),sinh(a)*sin$1(b));
                case 'sinh' : return complex(sinh(a)*cos$1(b),cosh$1(a)*sin$1(b));
                case 'tanh' : {
                    const DEN=cosh$1(2*a)+cos$1(2*b);
                    return complex(sinh(2*a)/DEN,sin$1(2*b)/DEN)
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

if(globalThis?.document){
    document?.addEventListener("DOMContentLoaded", __Ziko__.__Config__.init());
}

export { App, Canvas, ClickAwayEvent, ClickListeners, Clock, CloneElement, Complex, E, EPSILON, EventController, FileBasedRouting, Flex, For, Fragment, HTMLWrapper, KeyListeners, Matrix, PI$1 as PI, PtrListeners, Random, SPA, SVGWrapper, Scheduler, Suspense, Svg, Swap, SwipeEvent, Switch, Tick, TimeAnimation, TimeLoop, TimeScheduler, UICanvas, UIElement$1 as UIElement, UIFlex, UIFragment, UIHTMLWrapper, UINode, UISVGWrapper, UISuspense, UISvg, UISwap, UISwitch, UIView, UseRoot, UseThread, View, ViewEvent, ViewListeners, ZikoApp, ZikoSPA, ZikoUIText, abs, accum_max, accum_min, accum_prod, accum_product, accum_sum, acos$1 as acos, acosh, acot, add, add_class, add_vendor_prefix, and, animation, apply_fun, arc, asin, asinh, atan, atan2, atanh, back, binomial, call_with_optional_props, cbrt, ceil, clamp, clock, cloneUI, complex, contraharmonic_mean, cos$3 as cos, cosh$2 as cosh, coth, croot, csv2arr, csv2json, csv2matrix, csv2object, csv2sql, debounce, defineParamsGetter, define_wc, deg2rad, discret, div, elastic, ema, exp$1 as exp, floor, fract, geo_mean, harmonic_mean, hypot, in_back, in_bounce, in_circ, in_cubic, in_elastic, in_expo, in_out_back, in_out_bounce, in_out_circ, in_out_cubic, in_out_elastic, in_out_expo, in_out_quad, in_out_quart, in_out_quint, in_out_sin, in_quad, in_quart, in_quint, in_sin, interquartile_mean, iqr, isStateGetter, is_primitive, json2arr, json2css, json2csv, json2csvFile, json2xml, json2xmlFile, json2yml, json2ymlFile, lerp, linear, linkStyle, ln, loop, map$1 as map, mapfun$1 as mapfun, matrix, matrix2, matrix3, matrix4, max, mean, median, midhinge, midrange, min, modulo, mul, nand, nor, norm, normalize_css_value, not, nthr, or, out_back, out_bounce, out_circ, out_cubic, out_elastic, out_expo, out_quad, out_quart, out_quint, out_sin, parseXML, parse_props, percentile, pow$1 as pow, power_mean, q1, q3, rad2deg, register_click_away_event, register_swipe_event, register_view_event, remove_class, rms, rolling_std, rolling_variance, round, sample_std, sample_variance, script, sec, sig, sign, sin$3 as sin, sinh$1 as sinh, sleep, sma, sqrt$2 as sqrt, std, step, step_fps, style, sub, svg2ascii, svg2img, svg2imgUrl, svg2str, tags, tan, tanh, text, throttle, tick, timeTaken, time_memory_Taken, timeout, trimmed_mean, trunc, useDerived, useEffect, useEventEmitter, useIPC, useLocalStorage, useMediaQuery, useQueryParams, useReactive, useRoot, useSessionStorage, useState, useThread, useTitle, variance, wait, waitElm, waitForUIElm, waitForUIElmSync, watchQueryParams, weighted_mean, weighted_std, weighted_variance, winsorized_mean, wma, xnor, xor };
