import { Random } from "../random/index.js";
import { complex_constructor } from "./helpers/index.js";
class Complex{
    constructor(a = 0, b = 0) {
        [
            this.a,
            this.b
        ] = complex_constructor(Complex, a, b)
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
        this.a = z * Math.cos(phi)
        this.b = z * Math.sin(phi)  
        return this.toFixed(8);
    }
    div(...c){
        let {z, phi} = this;
        for (let i = 0; i < c.length; i++) {
            if (typeof c[i] === "number") c[i] = new Complex(c[i], 0);
            z /= c[i].z;
            phi -= c[i].phi;
        }
        this.a = z * Math.cos(phi)
        this.b = z * Math.sin(phi)  
        return this.toFixed(8);;
    }
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
        this.a = z * Math.cos(phi)
        this.b = z * Math.sin(phi)  
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
        const arr=a.arr.map((n,i)=>complex(a.arr[i],b.arr[i]))
        return new a.constructor(a.rows,a.cols,...arr)
    }
    return new Complex(a,b)
}
export{complex,Complex}